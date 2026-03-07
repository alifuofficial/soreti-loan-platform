import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  forbiddenResponse,
  requireAuth,
  createAuditLog,
  getClientInfo,
  idSchema,
} from "@/lib/api-utils";

// POST /api/loans/[id]/submit - Submit for review
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;

    const { id } = await params;
    
    if (!idSchema.safeParse(id).success) {
      return errorResponse("Invalid loan ID");
    }

    const loan = await db.loanApplication.findUnique({
      where: { id },
      include: {
        documents: true,
        user: {
          select: { fullName: true },
        },
      },
    });

    if (!loan) {
      return notFoundResponse("Loan application not found");
    }

    // Only the loan owner can submit
    if (loan.userId !== authResult.id) {
      return forbiddenResponse("Only the loan applicant can submit");
    }

    // Check if loan is in a submittable status
    if (!["DRAFT", "ADDITIONAL_INFO_REQUIRED"].includes(loan.status)) {
      return errorResponse("Loan cannot be submitted in current status");
    }

    // Check for required documents
    const requiredDocTypes = ["ID_CARD", "PASSPORT", "KEBELE_ID"];
    const hasIdentityDoc = loan.documents.some(doc => requiredDocTypes.includes(doc.type));
    
    if (!hasIdentityDoc) {
      return errorResponse("Please upload an identity document (ID Card, Passport, or Kebele ID)");
    }

    // Update loan status
    const updatedLoan = await db.loanApplication.update({
      where: { id },
      data: {
        status: "SUBMITTED",
        submittedAt: new Date(),
      },
    });

    // Create timeline entry
    await db.loanTimeline.create({
      data: {
        loanId: loan.id,
        status: "SUBMITTED",
        action: "STATUS_CHANGE",
        description: "Loan application submitted for review",
        performedBy: authResult.id,
        performedByName: authResult.fullName,
      },
    });

    // Create audit log
    const clientInfo = getClientInfo(request);
    await createAuditLog(authResult.id, {
      action: "LOAN_SUBMITTED",
      entityType: "LoanApplication",
      entityId: loan.id,
      description: `Loan application ${loan.applicationId} submitted for review`,
      oldValue: JSON.stringify({ status: loan.status }),
      newValue: JSON.stringify({ status: "SUBMITTED" }),
      ...clientInfo,
      route: `/api/loans/${id}/submit`,
      method: "POST",
    });

    return successResponse({
      message: "Loan application submitted successfully",
      loan: updatedLoan,
    });
  } catch (error) {
    console.error("Error submitting loan:", error);
    return errorResponse("Failed to submit loan application", 500);
  }
}
