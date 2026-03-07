import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  successResponse,
  errorResponse,
  requireAuth,
  createAuditLog,
  getClientInfo,
  paginationSchema,
  generateApplicationId,
} from "@/lib/api-utils";
import { LoanStatus } from "@prisma/client";

// Validation schema for creating a loan application
const createLoanSchema = z.object({
  bankId: z.string().cuid("Invalid bank ID"),
  productId: z.string().cuid("Invalid product ID"),
  amount: z.number().positive("Loan amount must be positive"),
  downPayment: z.number().min(0).default(0),
  totalAmount: z.number().positive("Total amount must be positive"),
  termMonths: z.number().int().min(1).max(60).default(12),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  bankName: z.string().optional(),
});

// GET /api/loans - List loans (filtered by role)
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;

    const { searchParams } = new URL(request.url);
    
    // Parse pagination
    const { page, limit } = paginationSchema.parse({
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "10",
    });

    // Parse filters
    const status = searchParams.get("status") as LoanStatus | null;
    const bankId = searchParams.get("bankId");
    const userId = searchParams.get("userId");

    // Build where clause based on role
    const where: Record<string, unknown> = {};

    // Role-based filtering
    if (authResult.role === "CUSTOMER") {
      // Customers can only see their own loans
      where.userId = authResult.id;
    } else if (authResult.role === "BANKER") {
      // Bankers can see loans from their bank
      where.bankId = authResult.bankId;
    }
    // Admin roles can see all loans

    // Additional filters
    if (status && Object.values(LoanStatus).includes(status)) {
      where.status = status;
    }
    if (bankId) {
      where.bankId = bankId;
    }
    if (userId && ["SUPER_ADMIN", "ADMIN", "CEO", "GENERAL_MANAGER"].includes(authResult.role)) {
      where.userId = userId;
    }

    // Get total count
    const total = await db.loanApplication.count({ where });

    // Get loans
    const loans = await db.loanApplication.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
        bank: {
          select: {
            id: true,
            name: true,
            code: true,
            logoUrl: true,
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
          },
        },
        documents: {
          select: {
            id: true,
            type: true,
            name: true,
            isVerified: true,
          },
        },
        _count: {
          select: {
            documents: true,
            timeline: true,
          },
        },
      },
    });

    return successResponse({
      loans,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching loans:", error);
    return errorResponse("Failed to fetch loans", 500);
  }
}

// POST /api/loans - Create loan application (customer)
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;

    const body = await request.json();
    const validatedData = createLoanSchema.parse(body);

    // Verify bank exists and is active
    const bank = await db.bank.findUnique({
      where: { id: validatedData.bankId },
    });
    if (!bank || !bank.isActive) {
      return errorResponse("Bank not found or inactive");
    }

    // Verify product exists and is active
    const product = await db.product.findUnique({
      where: { id: validatedData.productId },
    });
    if (!product || !product.isActive) {
      return errorResponse("Product not found or inactive");
    }

    // Validate loan amount against bank limits
    if (validatedData.amount < bank.minLoanAmount || validatedData.amount > bank.maxLoanAmount) {
      return errorResponse(
        `Loan amount must be between ${bank.minLoanAmount} and ${bank.maxLoanAmount}`
      );
    }

    // Validate term
    if (validatedData.termMonths > bank.maxTermMonths) {
      return errorResponse(`Maximum term is ${bank.maxTermMonths} months`);
    }

    // Calculate monthly payment (simple calculation)
    const monthlyRate = bank.interestRate / 100 / 12;
    const monthlyPayment = validatedData.amount * 
      (monthlyRate * Math.pow(1 + monthlyRate, validatedData.termMonths)) /
      (Math.pow(1 + monthlyRate, validatedData.termMonths) - 1);

    // Generate application ID
    const applicationId = generateApplicationId();

    const loan = await db.loanApplication.create({
      data: {
        applicationId,
        userId: authResult.id,
        bankId: validatedData.bankId,
        productId: validatedData.productId,
        amount: validatedData.amount,
        downPayment: validatedData.downPayment,
        totalAmount: validatedData.totalAmount,
        interestRate: bank.interestRate,
        termMonths: validatedData.termMonths,
        monthlyPayment,
        accountNumber: validatedData.accountNumber,
        accountName: validatedData.accountName,
        bankName: validatedData.bankName,
        status: "DRAFT",
      },
      include: {
        bank: {
          select: { name: true, code: true },
        },
        product: {
          select: { name: true, price: true },
        },
      },
    });

    // Create timeline entry
    await db.loanTimeline.create({
      data: {
        loanId: loan.id,
        status: "DRAFT",
        action: "LOAN_CREATED",
        description: "Loan application created",
        performedBy: authResult.id,
        performedByName: authResult.fullName,
      },
    });

    // Create audit log
    const clientInfo = getClientInfo(request);
    await createAuditLog(authResult.id, {
      action: "LOAN_CREATED",
      entityType: "LoanApplication",
      entityId: loan.id,
      description: `Created loan application ${loan.applicationId}`,
      newValue: JSON.stringify(loan),
      ...clientInfo,
      route: "/api/loans",
      method: "POST",
    });

    return successResponse(loan, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(error.errors[0].message);
    }
    console.error("Error creating loan:", error);
    return errorResponse("Failed to create loan application", 500);
  }
}
