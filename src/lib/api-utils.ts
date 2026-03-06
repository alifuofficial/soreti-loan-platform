import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions, hasRoleLevel, roleHierarchy } from "./auth";
import { db } from "./db";
import type { Role, AuditLog } from "@prisma/client";

// ============================================
// Response Helpers
// ============================================

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export function successResponse<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(error: string, status = 400): NextResponse<ApiResponse> {
  return NextResponse.json({ success: false, error }, { status });
}

export function unauthorizedResponse(message = "Unauthorized"): NextResponse<ApiResponse> {
  return NextResponse.json({ success: false, error: message }, { status: 401 });
}

export function forbiddenResponse(message = "Forbidden"): NextResponse<ApiResponse> {
  return NextResponse.json({ success: false, error: message }, { status: 403 });
}

export function notFoundResponse(message = "Resource not found"): NextResponse<ApiResponse> {
  return NextResponse.json({ success: false, error: message }, { status: 404 });
}

// ============================================
// Authentication Helpers
// ============================================

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  bankId: string | null;
  phone: string | null;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return session.user;
}

export async function requireAuth(): Promise<AuthUser | NextResponse<ApiResponse>> {
  const user = await getCurrentUser();
  if (!user) {
    return unauthorizedResponse("Authentication required");
  }
  return user;
}

export async function requireRole(roles: Role[]): Promise<AuthUser | NextResponse<ApiResponse>> {
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;

  if (!roles.includes(authResult.role)) {
    return forbiddenResponse("Insufficient permissions");
  }

  return authResult;
}

export async function requireMinRole(minRole: Role): Promise<AuthUser | NextResponse<ApiResponse>> {
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;

  if (!hasRoleLevel(authResult.role, minRole)) {
    return forbiddenResponse("Insufficient permissions");
  }

  return authResult;
}

// Check if user can access bank data (admin, banker of that bank, or super admin)
export function canAccessBank(user: AuthUser, bankId: string): boolean {
  if (user.role === "SUPER_ADMIN" || user.role === "ADMIN" || user.role === "CEO" || user.role === "GENERAL_MANAGER") {
    return true;
  }
  if (user.role === "BANKER" && user.bankId === bankId) {
    return true;
  }
  return false;
}

// Check if user can manage loans (admin, banker of that bank, finance manager)
export function canManageLoan(user: AuthUser, loan: { bankId: string; userId: string }): boolean {
  // Customer can only see their own loans
  if (user.role === "CUSTOMER") {
    return user.id === loan.userId;
  }
  // Banker can manage their bank's loans
  if (user.role === "BANKER") {
    return user.bankId === loan.bankId;
  }
  // Admin roles can manage all loans
  if (["SUPER_ADMIN", "ADMIN", "CEO", "GENERAL_MANAGER", "FINANCE_MANAGER"].includes(user.role)) {
    return true;
  }
  return false;
}

// ============================================
// Audit Logging
// ============================================

interface AuditLogData {
  action: string;
  entityType?: string;
  entityId?: string;
  description?: string;
  oldValue?: string;
  newValue?: string;
  ipAddress?: string;
  userAgent?: string;
  route?: string;
  method?: string;
}

export async function createAuditLog(
  userId: string | null,
  data: AuditLogData
): Promise<AuditLog> {
  return db.auditLog.create({
    data: {
      userId,
      action: data.action,
      entityType: data.entityType,
      entityId: data.entityId,
      description: data.description,
      oldValue: data.oldValue,
      newValue: data.newValue,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      route: data.route,
      method: data.method,
    },
  });
}

// Get client info from request
export function getClientInfo(request: Request): { ipAddress: string | null; userAgent: string | null } {
  const userAgent = request.headers.get("user-agent");
  // In a real app, you'd get IP from x-forwarded-for or x-real-ip headers
  const ipAddress = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                    request.headers.get("x-real-ip") || null;
  return { ipAddress, userAgent };
}

// ============================================
// Validation Helpers
// ============================================

import { z } from "zod";

// Common validation schemas
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const idSchema = z.string().cuid();

// Generate application ID
export function generateApplicationId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
  return `SOL-${year}-${random}`;
}

// ============================================
// Role Hierarchy Export
// ============================================

export { roleHierarchy };
