import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  successResponse,
  errorResponse,
  requireMinRole,
  createAuditLog,
  getClientInfo,
  paginationSchema,
} from "@/lib/api-utils";

// Validation schema for creating a bank
const createBankSchema = z.object({
  name: z.string().min(1, "Bank name is required"),
  code: z.string().min(2, "Bank code is required").max(10),
  logoUrl: z.string().url().optional().nullable(),
  description: z.string().optional().nullable(),
  websiteUrl: z.string().url().optional().nullable(),
  contactEmail: z.string().email().optional().nullable(),
  contactPhone: z.string().optional().nullable(),
  minLoanAmount: z.number().positive().optional(),
  maxLoanAmount: z.number().positive().optional(),
  interestRate: z.number().min(0).max(100).optional(),
  maxTermMonths: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
  isPartner: z.boolean().optional(),
});

// GET /api/banks - List all active banks (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("includeInactive") === "true";

    const banks = await db.bank.findMany({
      where: includeInactive ? undefined : { isActive: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        code: true,
        logoUrl: true,
        description: true,
        websiteUrl: true,
        contactEmail: true,
        contactPhone: true,
        minLoanAmount: true,
        maxLoanAmount: true,
        interestRate: true,
        maxTermMonths: true,
        isActive: true,
        isPartner: true,
        partnershipDate: true,
        createdAt: true,
        // Don't expose sensitive fields like apiKey
      },
    });

    return successResponse(banks);
  } catch (error) {
    console.error("Error fetching banks:", error);
    return errorResponse("Failed to fetch banks", 500);
  }
}

// POST /api/banks - Create a new bank (admin only)
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireMinRole("ADMIN");
    if (authResult instanceof Response) return authResult;

    const body = await request.json();
    const validatedData = createBankSchema.parse(body);

    // Check if bank code already exists
    const existingBank = await db.bank.findUnique({
      where: { code: validatedData.code },
    });

    if (existingBank) {
      return errorResponse("Bank with this code already exists");
    }

    const bank = await db.bank.create({
      data: {
        name: validatedData.name,
        code: validatedData.code.toUpperCase(),
        logoUrl: validatedData.logoUrl,
        description: validatedData.description,
        websiteUrl: validatedData.websiteUrl,
        contactEmail: validatedData.contactEmail,
        contactPhone: validatedData.contactPhone,
        minLoanAmount: validatedData.minLoanAmount ?? 1000,
        maxLoanAmount: validatedData.maxLoanAmount ?? 1000000,
        interestRate: validatedData.interestRate ?? 12.5,
        maxTermMonths: validatedData.maxTermMonths ?? 36,
        isActive: validatedData.isActive ?? true,
        isPartner: validatedData.isPartner ?? true,
      },
    });

    // Create audit log
    const clientInfo = getClientInfo(request);
    await createAuditLog(authResult.id, {
      action: "BANK_CREATED",
      entityType: "Bank",
      entityId: bank.id,
      description: `Created bank: ${bank.name} (${bank.code})`,
      newValue: JSON.stringify(bank),
      ...clientInfo,
      route: "/api/banks",
      method: "POST",
    });

    return successResponse(bank, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(error.errors[0].message);
    }
    console.error("Error creating bank:", error);
    return errorResponse("Failed to create bank", 500);
  }
}
