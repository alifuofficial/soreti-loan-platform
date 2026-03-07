import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  successResponse,
  errorResponse,
  requireAuth,
  createAuditLog,
  getClientInfo,
} from "@/lib/api-utils";
import { DocType } from "@prisma/client";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Allowed document types
const ALLOWED_TYPES: Record<string, string[]> = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "application/pdf": [".pdf"],
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Valid document types from enum
const validDocTypes = Object.values(DocType);

// POST /api/documents/upload - Upload document
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string;
    const loanId = formData.get("loanId") as string | null;

    // Validate inputs
    if (!file) {
      return errorResponse("No file provided");
    }

    if (!type || !validDocTypes.includes(type as DocType)) {
      return errorResponse("Invalid document type");
    }

    // Validate file type
    if (!ALLOWED_TYPES[file.type]) {
      return errorResponse("File type not allowed. Allowed types: JPEG, PNG, WebP, PDF");
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return errorResponse("File size exceeds 10MB limit");
    }

    // If loanId provided, verify user has access
    if (loanId) {
      const loan = await db.loanApplication.findUnique({
        where: { id: loanId },
        select: { id: true, userId: true, status: true },
      });

      if (!loan) {
        return errorResponse("Loan application not found");
      }

      if (loan.userId !== authResult.id && authResult.role === "CUSTOMER") {
        return errorResponse("Access denied");
      }
    }

    // Generate unique filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileExt = path.extname(file.name);
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}${fileExt}`;
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "documents");
    await mkdir(uploadsDir, { recursive: true });
    
    const filePath = path.join(uploadsDir, fileName);
    await writeFile(filePath, buffer);

    // Save document record
    const document = await db.document.create({
      data: {
        loanId: loanId || null,
        userId: authResult.id,
        type: type as DocType,
        name: file.name,
        filePath: `/uploads/documents/${fileName}`,
        fileSize: file.size,
        mimeType: file.type,
      },
    });

    // If associated with a loan, add timeline entry
    if (loanId) {
      await db.loanTimeline.create({
        data: {
          loanId,
          status: "DRAFT", // Will be updated based on actual loan status
          action: "DOCUMENT_UPLOADED",
          description: `Document uploaded: ${file.name} (${type})`,
          performedBy: authResult.id,
          performedByName: authResult.fullName,
        },
      });
    }

    // Create audit log
    const clientInfo = getClientInfo(request);
    await createAuditLog(authResult.id, {
      action: "DOCUMENT_UPLOADED",
      entityType: "Document",
      entityId: document.id,
      description: `Uploaded document: ${file.name} (${type})`,
      newValue: JSON.stringify({
        type,
        fileName: file.name,
        fileSize: file.size,
        loanId,
      }),
      ...clientInfo,
      route: "/api/documents/upload",
      method: "POST",
    });

    return successResponse(document, 201);
  } catch (error) {
    console.error("Error uploading document:", error);
    return errorResponse("Failed to upload document", 500);
  }
}
