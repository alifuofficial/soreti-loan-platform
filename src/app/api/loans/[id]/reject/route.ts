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

const rejectLoanSchema = z.object({
  reason: z.string().min(10, "Rejection reason is required (min 10 characters)"),
});

// POST /api/loans/[id]/reject - Reject loan (banker/admin)
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

    // Banker can only reject loans from their bank
    if (authResult.role === "BANKER" && authResult.bankId !== loan.bankId) {
      return forbiddenResponse("You can only reject loans from your bank");
    }

    // Check if loan is in a rejectable status
    if (!["SUBMITTED", "UNDER_REVIEW", "ADDITIONAL_INFO_REQUIRED"].includes(loan.status)) {
      return errorResponse("Loan cannot be rejected in current status");
    }

    const body = await request.json();
    const validatedData = rejectLoanSchema.parse(body);

    // Update loan status
    const updatedLoan = await db.loanApplication.update({
      where: { id },
      data: {
        status: "REJECTED",
        rejectionReason: validatedData.reason,
        reviewedBy: authResult.id,
        reviewedAt: new Date(),
        reviewedByName: authResult.fullName,
      },
    });

    // Create timeline entry
    await db.loanTimeline.create({
      data: {
        loanId: loan.id,
        status: "REJECTED",
        action: "STATUS_CHANGE",
        description: `Loan rejected: ${validatedData.reason}`,
        performedBy: authResult.id,
        performedByName: authResult.fullName,
      },
    });

    // Create notification for user
    await db.notification.create({
      data: {
        userId: loan.userId,
        title: "Loan Application Update",
        message: `Your loan application ${loan.applicationId} has been reviewed. Please check the details.`,
        type: "WARNING",
        entityType: "LoanApplication",
        entityId: loan.id,
      },
    });

    // Create audit log
    const clientInfo = getClientInfo(request);
    await createAuditLog(authResult.id, {
      action: "LOAN_REJECTED",
      entityType: "LoanApplication",
      entityId: loan.id,
      description: `Loan application ${loan.applicationId} rejected: ${validatedData.reason}`,
      oldValue: JSON.stringify({ status: loan.status }),
      newValue: JSON.stringify({ status: "REJECTED", reason: validatedData.reason }),
      ...clientInfo,
      route: `/api/loans/${id}/reject`,
      method: "POST",
    });

    return successResponse({
      message: "Loan application rejected",
      loan: updatedLoan,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(error.errors[0].message);
    }
    console.error("Error rejecting loan:", error);
    return errorResponse("Failed to reject loan application", 500);
  }
}
