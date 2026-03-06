import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  errorResponse,
  notFoundResponse,
  forbiddenResponse,
  requireAuth,
  createAuditLog,
  getClientInfo,
  idSchema,
} from "@/lib/api-utils";
import { readFile, unlink } from "fs/promises";
import path from "path";

// GET /api/documents/[id] - Download document (authorized users only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;

    const { id } = await params;
    
    if (!idSchema.safeParse(id).success) {
      return errorResponse("Invalid document ID");
    }

    const document = await db.document.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true },
        },
        loan: {
          select: { 
            id: true, 
            userId: true, 
            bankId: true,
          },
        },
      },
    });

    if (!document) {
      return notFoundResponse("Document not found");
    }

    // Authorization check
    const isOwner = document.userId === authResult.id;
    const isAdmin = ["SUPER_ADMIN", "ADMIN", "CEO", "GENERAL_MANAGER"].includes(authResult.role);
    const isLoanBanker = document.loan && 
      authResult.role === "BANKER" && 
      authResult.bankId === document.loan.bankId;

    if (!isOwner && !isAdmin && !isLoanBanker) {
      return forbiddenResponse("Access denied");
    }

    // Read file
    const filePath = path.join(process.cwd(), "public", document.filePath);
    const fileBuffer = await readFile(filePath);

    // Return file with appropriate headers
    return new Response(fileBuffer, {
      headers: {
        "Content-Type": document.mimeType,
        "Content-Disposition": `attachment; filename="${document.name}"`,
        "Content-Length": document.fileSize.toString(),
      },
    });
  } catch (error) {
    console.error("Error downloading document:", error);
    return errorResponse("Failed to download document", 500);
  }
}

// DELETE /api/documents/[id] - Delete document
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;

    const { id } = await params;
    
    if (!idSchema.safeParse(id).success) {
      return errorResponse("Invalid document ID");
    }

    const document = await db.document.findUnique({
      where: { id },
      include: {
        loan: {
          select: { 
            id: true, 
            userId: true, 
            status: true,
          },
        },
      },
    });

    if (!document) {
      return notFoundResponse("Document not found");
    }

    // Authorization check
    const isOwner = document.userId === authResult.id;
    const isAdmin = ["SUPER_ADMIN", "ADMIN"].includes(authResult.role);

    if (!isOwner && !isAdmin) {
      return forbiddenResponse("Access denied");
    }

    // Check if loan is still editable
    if (document.loan && !["DRAFT", "ADDITIONAL_INFO_REQUIRED"].includes(document.loan.status)) {
      return errorResponse("Cannot delete documents for loans in current status");
    }

    // Delete file from storage
    try {
      const filePath = path.join(process.cwd(), "public", document.filePath);
      await unlink(filePath);
    } catch {
      // File might not exist, continue with DB deletion
    }

    // Delete document record
    await db.document.delete({
      where: { id },
    });

    // Create audit log
    const clientInfo = getClientInfo(request);
    await createAuditLog(authResult.id, {
      action: "DOCUMENT_DELETED",
      entityType: "Document",
      entityId: id,
      description: `Deleted document: ${document.name}`,
      oldValue: JSON.stringify({
        type: document.type,
        name: document.name,
        loanId: document.loanId,
      }),
      ...clientInfo,
      route: `/api/documents/${id}`,
      method: "DELETE",
    });

    return Response.json({ success: true, message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting document:", error);
    return errorResponse("Failed to delete document", 500);
  }
}
