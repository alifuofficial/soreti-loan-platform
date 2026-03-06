import { successResponse, errorResponse, requireAuth } from "@/lib/api-utils";
import { db } from "@/lib/db";
import { LoanStatus } from "@prisma/client";

// GET /api/stats - Dashboard statistics based on user role
export async function GET() {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;

    // Common stats for all roles
    if (authResult.role === "CUSTOMER") {
      // Customer stats
      const [totalLoans, activeLoans, pendingLoans, totalBorrowed, documents] = await Promise.all([
        db.loanApplication.count({ where: { userId: authResult.id } }),
        db.loanApplication.count({
          where: {
            userId: authResult.id,
            status: { in: ["DISBURSED", "REPAID"] as LoanStatus[] },
          },
        }),
        db.loanApplication.count({
          where: {
            userId: authResult.id,
            status: { in: ["DRAFT", "SUBMITTED", "UNDER_REVIEW", "ADDITIONAL_INFO_REQUIRED"] as LoanStatus[] },
          },
        }),
        db.loanApplication.aggregate({
          where: {
            userId: authResult.id,
            status: "DISBURSED",
          },
          _sum: { amount: true },
        }),
        db.document.count({ where: { userId: authResult.id } }),
      ]);

      return successResponse({
        role: "CUSTOMER",
        totalLoans,
        activeLoans,
        pendingLoans,
        totalBorrowed: totalBorrowed._sum.amount || 0,
        documents,
      });
    }

    // Banker stats
    if (authResult.role === "BANKER" && authResult.bankId) {
      const [totalLoans, pendingReview, approved, rejected, totalAmount] = await Promise.all([
        db.loanApplication.count({ where: { bankId: authResult.bankId } }),
        db.loanApplication.count({
          where: {
            bankId: authResult.bankId,
            status: { in: ["SUBMITTED", "UNDER_REVIEW"] as LoanStatus[] },
          },
        }),
        db.loanApplication.count({
          where: { bankId: authResult.bankId, status: "APPROVED" },
        }),
        db.loanApplication.count({
          where: { bankId: authResult.bankId, status: "REJECTED" },
        }),
        db.loanApplication.aggregate({
          where: { bankId: authResult.bankId, status: "DISBURSED" },
          _sum: { amount: true },
        }),
      ]);

      return successResponse({
        role: "BANKER",
        bankId: authResult.bankId,
        totalLoans,
        pendingReview,
        approved,
        rejected,
        totalDisbursed: totalAmount._sum.amount || 0,
      });
    }

    // Finance Manager stats
    if (authResult.role === "FINANCE_MANAGER") {
      const [approvedLoans, disbursedLoans, pendingDisbursement, totalDisbursed] = await Promise.all([
        db.loanApplication.count({ where: { status: "APPROVED" } }),
        db.loanApplication.count({ where: { status: "DISBURSED" } }),
        db.loanApplication.count({ where: { status: "APPROVED" } }),
        db.loanApplication.aggregate({
          where: { status: "DISBURSED" },
          _sum: { amount: true },
        }),
      ]);

      return successResponse({
        role: "FINANCE_MANAGER",
        approvedLoans,
        disbursedLoans,
        pendingDisbursement,
        totalDisbursed: totalDisbursed._sum.amount || 0,
      });
    }

    // Admin/Manager stats (comprehensive)
    const [
      totalUsers,
      activeUsers,
      totalBanks,
      activeBanks,
      totalProducts,
      totalLoans,
      loansByStatus,
      totalLoanAmount,
      recentLoans,
      newUsersThisMonth,
    ] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { isActive: true } }),
      db.bank.count(),
      db.bank.count({ where: { isActive: true } }),
      db.product.count({ where: { isActive: true } }),
      db.loanApplication.count(),
      db.loanApplication.groupBy({
        by: ["status"],
        _count: { id: true },
      }),
      db.loanApplication.aggregate({
        where: { status: "DISBURSED" },
        _sum: { amount: true },
      }),
      db.loanApplication.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          applicationId: true,
          amount: true,
          status: true,
          createdAt: true,
          user: { select: { fullName: true } },
          bank: { select: { name: true } },
        },
      }),
      db.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ]);

    // Format loans by status
    const statusCounts: Record<string, number> = {};
    loansByStatus.forEach(item => {
      statusCounts[item.status] = item._count.id;
    });

    return successResponse({
      role: authResult.role,
      users: {
        total: totalUsers,
        active: activeUsers,
        newThisMonth: newUsersThisMonth,
      },
      banks: {
        total: totalBanks,
        active: activeBanks,
      },
      products: {
        total: totalProducts,
      },
      loans: {
        total: totalLoans,
        byStatus: statusCounts,
        totalDisbursed: totalLoanAmount._sum.amount || 0,
        recent: recentLoans,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return errorResponse("Failed to fetch statistics", 500);
  }
}
