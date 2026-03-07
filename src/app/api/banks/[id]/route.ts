import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  requireMinRole,
  createAuditLog,
  getClientInfo,
  idSchema,
} from "@/lib/api-utils";

// Validation schema for updating a bank
const updateBankSchema = z.object({
  name: z.string().min(1, "Bank name is required").optional(),
  code: z.string().min(2, "Bank code is required").max(10).optional(),
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
  apiUrl: z.string().url().optional().nullable(),
  apiKey: z.string().optional().nullable(),
});

// GET /api/banks/[id] - Get bank details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!idSchema.safeParse(id).success) {
      return errorResponse("Invalid bank ID");
    }

    const bank = await db.bank.findUnique({
      where: { id },
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
        updatedAt: true,
        // Include loan stats
        _count: {
          select: {
            loans: true,
            users: true,
          },
        },
      },
    });

    if (!bank) {
      return notFoundResponse("Bank not found");
    }

    return successResponse(bank);
  } catch (error) {
    console.error("Error fetching bank:", error);
    return errorResponse("Failed to fetch bank", 500);
  }
}

// PUT /api/banks/[id] - Update bank (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireMinRole("ADMIN");
    if (authResult instanceof Response) return authResult;

    const { id } = await params;
    
    if (!idSchema.safeParse(id).success) {
      return errorResponse("Invalid bank ID");
    }

    const existingBank = await db.bank.findUnique({ where: { id } });
    if (!existingBank) {
      return notFoundResponse("Bank not found");
    }

    const body = await request.json();
    const validatedData = updateBankSchema.parse(body);

    // If code is being updated, check for duplicates
    if (validatedData.code && validatedData.code !== existingBank.code) {
      const duplicateCode = await db.bank.findUnique({
        where: { code: validatedData.code },
      });
      if (duplicateCode) {
        return errorResponse("Bank with this code already exists");
      }
    }

    const bank = await db.bank.update({
      where: { id },
      data: {
        ...(validatedData.name && { name: validatedData.name }),
        ...(validatedData.code && { code: validatedData.code.toUpperCase() }),
        ...(validatedData.logoUrl !== undefined && { logoUrl: validatedData.logoUrl }),
        ...(validatedData.description !== undefined && { description: validatedData.description }),
        ...(validatedData.websiteUrl !== undefined && { websiteUrl: validatedData.websiteUrl }),
        ...(validatedData.contactEmail !== undefined && { contactEmail: validatedData.contactEmail }),
        ...(validatedData.contactPhone !== undefined && { contactPhone: validatedData.contactPhone }),
        ...(validatedData.minLoanAmount !== undefined && { minLoanAmount: validatedData.minLoanAmount }),
        ...(validatedData.maxLoanAmount !== undefined && { maxLoanAmount: validatedData.maxLoanAmount }),
        ...(validatedData.interestRate !== undefined && { interestRate: validatedData.interestRate }),
        ...(validatedData.maxTermMonths !== undefined && { maxTermMonths: validatedData.maxTermMonths }),
        ...(validatedData.isActive !== undefined && { isActive: validatedData.isActive }),
        ...(validatedData.isPartner !== undefined && { isPartner: validatedData.isPartner }),
        ...(validatedData.apiUrl !== undefined && { apiUrl: validatedData.apiUrl }),
        ...(validatedData.apiKey !== undefined && { apiKey: validatedData.apiKey }),
      },
    });

    // Create audit log
    const clientInfo = getClientInfo(request);
    await createAuditLog(authResult.id, {
      action: "BANK_UPDATED",
      entityType: "Bank",
      entityId: bank.id,
      description: `Updated bank: ${bank.name} (${bank.code})`,
      oldValue: JSON.stringify(existingBank),
      newValue: JSON.stringify(bank),
      ...clientInfo,
      route: `/api/banks/${id}`,
      method: "PUT",
    });

    return successResponse(bank);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(error.errors[0].message);
    }
    console.error("Error updating bank:", error);
    return errorResponse("Failed to update bank", 500);
  }
}

// DELETE /api/banks/[id] - Delete/deactivate bank (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireMinRole("ADMIN");
    if (authResult instanceof Response) return authResult;

    const { id } = await params;
    
    if (!idSchema.safeParse(id).success) {
      return errorResponse("Invalid bank ID");
    }

    const existingBank = await db.bank.findUnique({ where: { id } });
    if (!existingBank) {
      return notFoundResponse("Bank not found");
    }

    // Check if bank has active loans
    const activeLoans = await db.loanApplication.count({
      where: {
        bankId: id,
        status: { in: ["SUBMITTED", "UNDER_REVIEW", "APPROVED"] },
      },
    });

    if (activeLoans > 0) {
      // Soft delete - just deactivate
      const bank = await db.bank.update({
        where: { id },
        data: { isActive: false },
      });

      const clientInfo = getClientInfo(request);
      await createAuditLog(authResult.id, {
        action: "BANK_DEACTIVATED",
        entityType: "Bank",
        entityId: bank.id,
        description: `Deactivated bank: ${bank.name} (${bank.code}) - had ${activeLoans} active loans`,
        oldValue: JSON.stringify(existingBank),
        newValue: JSON.stringify(bank),
        ...clientInfo,
        route: `/api/banks/${id}`,
        method: "DELETE",
      });

      return successResponse({ 
        message: "Bank deactivated successfully (had active loans)",
        bank 
      });
    }

    // Hard delete if no active loans
    await db.bank.delete({ where: { id } });

    const clientInfo = getClientInfo(request);
    await createAuditLog(authResult.id, {
      action: "BANK_DELETED",
      entityType: "Bank",
      entityId: id,
      description: `Deleted bank: ${existingBank.name} (${existingBank.code})`,
      oldValue: JSON.stringify(existingBank),
      ...clientInfo,
      route: `/api/banks/${id}`,
      method: "DELETE",
    });

    return successResponse({ message: "Bank deleted successfully" });
  } catch (error) {
    console.error("Error deleting bank:", error);
    return errorResponse("Failed to delete bank", 500);
  }
}
