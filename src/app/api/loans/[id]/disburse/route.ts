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

const disburseLoanSchema = z.object({
  disbursementReference: z.string().optional(),
  notes: z.string().optional(),
});

// POST /api/loans/[id]/disburse - Mark as disbursed (finance manager)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireMinRole("FINANCE_MANAGER");
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
        product: { select: { name: true, price: true } },
      },
    });

    if (!loan) {
      return notFoundResponse("Loan application not found");
    }

    // Check if loan is approved
    if (loan.status !== "APPROVED") {
      return errorResponse("Only approved loans can be disbursed");
    }

    // Check if bank account details exist
    if (!loan.accountNumber || !loan.accountName || !loan.bankName) {
      return errorResponse("Bank account details are required before disbursement");
    }

    const body = await request.json().catch(() => ({}));
    const validatedData = disburseLoanSchema.safeParse(body);

    // Update loan status
    const updatedLoan = await db.loanApplication.update({
      where: { id },
      data: {
        status: "DISBURSED",
        disbursedAt: new Date(),
        internalNotes: validatedData.success && validatedData.data.notes
          ? `${loan.internalNotes || ""}\nDisbursement notes: ${validatedData.data.notes}`.trim()
          : loan.internalNotes,
      },
    });

    // Create timeline entry
    await db.loanTimeline.create({
      data: {
        loanId: loan.id,
        status: "DISBURSED",
        action: "STATUS_CHANGE",
        description: `Loan disbursed to ${loan.bankName} account ${loan.accountName}` + 
          (validatedData.success && validatedData.data.disbursementReference 
            ? ` (Ref: ${validatedData.data.disbursementReference})` 
            : ""),
        performedBy: authResult.id,
        performedByName: authResult.fullName,
        metadata: validatedData.success 
          ? JSON.stringify({ disbursementReference: validatedData.data.disbursementReference })
          : null,
      },
    });

    // Create notification for user
    await db.notification.create({
      data: {
        userId: loan.userId,
        title: "Loan Disbursed!",
        message: `Your loan of ${loan.amount} for ${loan.product?.name || 'product'} has been disbursed to your account.`,
        type: "SUCCESS",
        entityType: "LoanApplication",
        entityId: loan.id,
      },
    });

    // Create audit log
    const clientInfo = getClientInfo(request);
    await createAuditLog(authResult.id, {
      action: "LOAN_DISBURSED",
      entityType: "LoanApplication",
      entityId: loan.id,
      description: `Loan application ${loan.applicationId} disbursed - Amount: ${loan.amount}`,
      oldValue: JSON.stringify({ status: loan.status }),
      newValue: JSON.stringify({ 
        status: "DISBURSED", 
        disbursedAt: new Date(),
        disbursementReference: validatedData.success ? validatedData.data.disbursementReference : null,
      }),
      ...clientInfo,
      route: `/api/loans/${id}/disburse`,
      method: "POST",
    });

    return successResponse({
      message: "Loan disbursed successfully",
      loan: updatedLoan,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(error.errors[0].message);
    }
    console.error("Error disbursing loan:", error);
    return errorResponse("Failed to disburse loan", 500);
  }
}
