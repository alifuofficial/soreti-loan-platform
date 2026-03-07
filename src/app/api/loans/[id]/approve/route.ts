import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  forbiddenResponse,
  requireMinRole,
  createAuditLog,
  getClientInfo,
  idSchema,
} from "@/lib/api-utils";

const approveLoanSchema = z.object({
  notes: z.string().optional(),
});

// POST /api/loans/[id]/approve - Approve loan (banker/admin)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireMinRole("BANKER");
    if (authResult instanceof Response) return authResult;

    const { id } = await params;
    
    if (!idSchema.safeParse(id).success) {
      return errorResponse("Invalid loan ID");
    }

    const loan = await db.loanApplication.findUnique({
      where: { id },
      include: {
        bank: { select: { id: true, name: true } },
        user: { select: { id: true, fullName: true, email: true } },
      },
    });

    if (!loan) {
      return notFoundResponse("Loan application not found");
    }

    // Banker can only approve loans from their bank
    if (authResult.role === "BANKER" && authResult.bankId !== loan.bankId) {
      return forbiddenResponse("You can only approve loans from your bank");
    }

    // Check if loan is in an approvable status
    if (!["SUBMITTED", "UNDER_REVIEW", "ADDITIONAL_INFO_REQUIRED"].includes(loan.status)) {
      return errorResponse("Loan cannot be approved in current status");
    }

    const body = await request.json().catch(() => ({}));
    const validatedData = approveLoanSchema.safeParse(body);

    // Update loan status
    const updatedLoan = await db.loanApplication.update({
      where: { id },
      data: {
        status: "APPROVED",
        approvedAt: new Date(),
        reviewedBy: authResult.id,
        reviewedAt: new Date(),
        reviewedByName: authResult.fullName,
        internalNotes: validatedData.success && validatedData.data.notes 
          ? `${loan.internalNotes || ""}\nApproval notes: ${validatedData.data.notes}`.trim()
          : loan.internalNotes,
      },
    });

    // Create timeline entry
    await db.loanTimeline.create({
      data: {
        loanId: loan.id,
        status: "APPROVED",
        action: "STATUS_CHANGE",
        description: `Loan approved by ${authResult.fullName}`,
        performedBy: authResult.id,
        performedByName: authResult.fullName,
      },
    });

    // Create notification for user
    await db.notification.create({
      data: {
        userId: loan.userId,
        title: "Loan Approved",
        message: `Your loan application ${loan.applicationId} has been approved!`,
        type: "SUCCESS",
        entityType: "LoanApplication",
        entityId: loan.id,
      },
    });

    // Create audit log
    const clientInfo = getClientInfo(request);
    await createAuditLog(authResult.id, {
      action: "LOAN_APPROVED",
      entityType: "LoanApplication",
      entityId: loan.id,
      description: `Loan application ${loan.applicationId} approved`,
      oldValue: JSON.stringify({ status: loan.status }),
      newValue: JSON.stringify({ status: "APPROVED" }),
      ...clientInfo,
      route: `/api/loans/${id}/approve`,
      method: "POST",
    });

    return successResponse({
      message: "Loan application approved successfully",
      loan: updatedLoan,
    });
  } catch (error) {
    console.error("Error approving loan:", error);
    return errorResponse("Failed to approve loan application", 500);
  }
}
