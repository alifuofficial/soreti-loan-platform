import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  forbiddenResponse,
  requireAuth,
  canManageLoan,
  createAuditLog,
  getClientInfo,
  idSchema,
} from "@/lib/api-utils";

// Validation schema for updating a loan
const updateLoanSchema = z.object({
  amount: z.number().positive().optional(),
  downPayment: z.number().min(0).optional(),
  totalAmount: z.number().positive().optional(),
  termMonths: z.number().int().min(1).max(60).optional(),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  bankName: z.string().optional(),
  internalNotes: z.string().optional(),
});

// GET /api/loans/[id] - Get loan details
export async function GET(
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
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            idNumber: true,
            address: true,
          },
        },
        bank: {
          select: {
            id: true,
            name: true,
            code: true,
            logoUrl: true,
            interestRate: true,
            maxTermMonths: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            imageUrl: true,
            category: true,
            description: true,
          },
        },
        documents: {
          select: {
            id: true,
            type: true,
            name: true,
            fileSize: true,
            isVerified: true,
            uploadedAt: true,
          },
        },
        timeline: {
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });

    if (!loan) {
      return notFoundResponse("Loan application not found");
    }

    // Authorization check
    if (!canManageLoan(authResult, loan)) {
      return forbiddenResponse("You don't have access to this loan");
    }

    return successResponse(loan);
  } catch (error) {
    console.error("Error fetching loan:", error);
    return errorResponse("Failed to fetch loan", 500);
  }
}

// PUT /api/loans/[id] - Update loan
export async function PUT(
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

    const existingLoan = await db.loanApplication.findUnique({
      where: { id },
    });

    if (!existingLoan) {
      return notFoundResponse("Loan application not found");
    }

    // Authorization check
    if (!canManageLoan(authResult, existingLoan)) {
      return forbiddenResponse("You don't have access to this loan");
    }

    // Status-based edit restrictions
    const editableStatuses = ["DRAFT", "ADDITIONAL_INFO_REQUIRED"];
    if (!editableStatuses.includes(existingLoan.status) && authResult.role === "CUSTOMER") {
      return errorResponse("Cannot edit loan in current status");
    }

    const body = await request.json();
    const validatedData = updateLoanSchema.parse(body);

    // Only allow certain fields based on role
    const updateData: Record<string, unknown> = {};
    
    if (authResult.role === "CUSTOMER") {
      // Customers can update basic loan details
      if (validatedData.amount !== undefined) updateData.amount = validatedData.amount;
      if (validatedData.downPayment !== undefined) updateData.downPayment = validatedData.downPayment;
      if (validatedData.totalAmount !== undefined) updateData.totalAmount = validatedData.totalAmount;
      if (validatedData.termMonths !== undefined) updateData.termMonths = validatedData.termMonths;
      if (validatedData.accountNumber !== undefined) updateData.accountNumber = validatedData.accountNumber;
      if (validatedData.accountName !== undefined) updateData.accountName = validatedData.accountName;
      if (validatedData.bankName !== undefined) updateData.bankName = validatedData.bankName;
    } else {
      // Staff can update internal notes
      if (validatedData.internalNotes !== undefined) {
        updateData.internalNotes = validatedData.internalNotes;
      }
    }

    // Recalculate monthly payment if amount or term changed
    if (updateData.amount || updateData.termMonths) {
      const amount = updateData.amount as number || existingLoan.amount;
      const termMonths = updateData.termMonths as number || existingLoan.termMonths;
      const monthlyRate = existingLoan.interestRate / 100 / 12;
      updateData.monthlyPayment = amount * 
        (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
        (Math.pow(1 + monthlyRate, termMonths) - 1);
    }

    const loan = await db.loanApplication.update({
      where: { id },
      data: updateData,
    });

    // Create timeline entry
    await db.loanTimeline.create({
      data: {
        loanId: loan.id,
        status: loan.status,
        action: "LOAN_UPDATED",
        description: "Loan application updated",
        performedBy: authResult.id,
        performedByName: authResult.fullName,
      },
    });

    // Create audit log
    const clientInfo = getClientInfo(request);
    await createAuditLog(authResult.id, {
      action: "LOAN_UPDATED",
      entityType: "LoanApplication",
      entityId: loan.id,
      description: `Updated loan application ${loan.applicationId}`,
      oldValue: JSON.stringify(existingLoan),
      newValue: JSON.stringify(loan),
      ...clientInfo,
      route: `/api/loans/${id}`,
      method: "PUT",
    });

    return successResponse(loan);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(error.errors[0].message);
    }
    console.error("Error updating loan:", error);
    return errorResponse("Failed to update loan", 500);
  }
}
