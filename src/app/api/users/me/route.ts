import { successResponse, errorResponse, requireAuth } from "@/lib/api-utils";
import { db } from "@/lib/db";

// GET /api/users/me - Get current user profile
export async function GET() {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;

    const user = await db.user.findUnique({
      where: { id: authResult.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        isActive: true,
        bankId: true,
        idNumber: true,
        address: true,
        dateOfBirth: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
        emailVerified: true,
        phoneVerified: true,
        bank: {
          select: {
            id: true,
            name: true,
            code: true,
            logoUrl: true,
          },
        },
        bankAccount: {
          select: {
            id: true,
            bankName: true,
            accountName: true,
            accountType: true,
            isVerified: true,
          },
        },
        _count: {
          select: {
            loans: true,
            documents: true,
            notifications: { where: { isRead: false } },
          },
        },
      },
    });

    if (!user) {
      return errorResponse("User not found", 404);
    }

    return successResponse(user);
  } catch (error) {
    console.error("Error fetching current user:", error);
    return errorResponse("Failed to fetch user profile", 500);
  }
}
