import { successResponse, errorResponse, requireAuth } from "@/lib/api-utils";
import { db } from "@/lib/db";
import { LoanStatus } from "@prisma/client";

// GET /api/admin/analytics - Detailed analytics for admin dashboard
export async function GET(request: Request) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;

    // Only allow admin roles
    const adminRoles = ['SUPER_ADMIN', 'ADMIN', 'CEO', 'GENERAL_MANAGER', 'FINANCE_MANAGER', 'MARKETING_MANAGER'];
    if (!adminRoles.includes(authResult.role)) {
      return errorResponse("Unauthorized", 403);
    }

    const url = new URL(request.url);
    const range = url.searchParams.get('range') || '6months';
    const detailed = url.searchParams.get('detailed') === 'true';

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    switch (range) {
      case '7days':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(now.getDate() - 30);
        break;
      case '3months':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '1year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case '6months':
      default:
        startDate.setMonth(now.getMonth() - 6);
        break;
    }

    // Fetch all necessary data
    const [
      loans,
      users,
      banks,
      products,
    ] = await Promise.all([
      db.loanApplication.findMany({
        where: { createdAt: { gte: startDate } },
        select: {
          id: true,
          amount: true,
          status: true,
          createdAt: true,
          approvedAt: true,
          disbursedAt: true,
          bankId: true,
          productId: true,
          bank: { select: { name: true } },
          product: { select: { name: true, category: true } },
        },
      }),
      db.user.findMany({
        where: { createdAt: { gte: startDate } },
        select: { id: true, role: true, createdAt: true },
      }),
      db.bank.findMany({
        select: {
          id: true,
          name: true,
          _count: { select: { loans: true } },
        },
      }),
      db.product.findMany({
        select: {
          id: true,
          name: true,
          category: true,
          _count: { select: { loans: true } },
        },
      }),
    ]);

    // Process monthly data
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData: Record<string, { revenue: number; loans: number; applications: number; approved: number; rejected: number; users: number; customers: number; bankers: number }> = {};

    // Initialize months
    for (let i = 0; i <= 6; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[key] = { revenue: 0, loans: 0, applications: 0, approved: 0, rejected: 0, users: 0, customers: 0, bankers: 0 };
    }

    // Process loans
    loans.forEach(loan => {
      const key = `${loan.createdAt.getFullYear()}-${String(loan.createdAt.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyData[key]) {
        monthlyData[key].applications++;
        if (loan.status === 'APPROVED' || loan.status === 'DISBURSED') {
          monthlyData[key].approved++;
          monthlyData[key].revenue += loan.amount;
        }
        if (loan.status === 'REJECTED') {
          monthlyData[key].rejected++;
        }
        if (loan.status === 'DISBURSED') {
          monthlyData[key].loans++;
        }
      }
    });

    // Process users
    users.forEach(user => {
      const key = `${user.createdAt.getFullYear()}-${String(user.createdAt.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyData[key]) {
        monthlyData[key].users++;
        if (user.role === 'CUSTOMER') monthlyData[key].customers++;
        if (user.role === 'BANKER') monthlyData[key].bankers++;
      }
    });

    // Convert to arrays for charts
    const revenueByMonth = Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, data]) => ({
        month: monthNames[parseInt(key.split('-')[1]) - 1],
        revenue: data.revenue,
        loans: data.loans,
        avgAmount: data.loans > 0 ? Math.round(data.revenue / data.loans) : 0,
      }));

    const applicationsByMonth = Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, data]) => ({
        month: monthNames[parseInt(key.split('-')[1]) - 1],
        submitted: data.applications,
        approved: data.approved,
        rejected: data.rejected,
      }));

    const userGrowth = Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, data]) => ({
        month: monthNames[parseInt(key.split('-')[1]) - 1],
        users: data.users,
        customers: data.customers,
        bankers: data.bankers,
      }));

    // Loans by bank
    const loansByBank = banks.map(bank => {
      const bankLoans = loans.filter(l => l.bankId === bank.id);
      const approved = bankLoans.filter(l => l.status === 'APPROVED' || l.status === 'DISBURSED').length;
      return {
        bank: bank.name,
        loans: bank._count.loans,
        amount: bankLoans.reduce((sum, l) => sum + (l.status === 'DISBURSED' ? l.amount : 0), 0),
        approvalRate: bankLoans.length > 0 ? Math.round((approved / bankLoans.length) * 100) : 0,
      };
    }).sort((a, b) => b.loans - a.loans).slice(0, 10);

    // Loans by category
    const categoryMap: Record<string, { count: number; amount: number }> = {};
    loans.forEach(loan => {
      const cat = loan.product?.category || 'Other';
      if (!categoryMap[cat]) categoryMap[cat] = { count: 0, amount: 0 };
      categoryMap[cat].count++;
      if (loan.status === 'DISBURSED') {
        categoryMap[cat].amount += loan.amount;
      }
    });
    const loansByCategory = Object.entries(categoryMap)
      .map(([category, data]) => ({ category, ...data }))
      .sort((a, b) => b.amount - a.amount);

    // Top products
    const productLoans: Record<string, { name: string; loans: number; revenue: number }> = {};
    loans.forEach(loan => {
      if (loan.product) {
        if (!productLoans[loan.productId]) {
          productLoans[loan.productId] = { name: loan.product.name, loans: 0, revenue: 0 };
        }
        productLoans[loan.productId].loans++;
        if (loan.status === 'DISBURSED') {
          productLoans[loan.productId].revenue += loan.amount;
        }
      }
    });
    const topProducts = Object.values(productLoans)
      .sort((a, b) => b.loans - a.loans)
      .slice(0, 5);

    // Conversion funnel
    const totalApplications = loans.length;
    const submitted = loans.filter(l => l.status !== 'DRAFT').length;
    const underReview = loans.filter(l => ['UNDER_REVIEW', 'SUBMITTED'].includes(l.status)).length;
    const approved = loans.filter(l => l.status === 'APPROVED' || l.status === 'DISBURSED').length;
    const disbursed = loans.filter(l => l.status === 'DISBURSED').length;

    const conversionFunnel = [
      { stage: 'Draft', count: totalApplications, percentage: 100 },
      { stage: 'Submitted', count: submitted, percentage: totalApplications > 0 ? Math.round((submitted / totalApplications) * 100) : 0 },
      { stage: 'Under Review', count: underReview, percentage: totalApplications > 0 ? Math.round((underReview / totalApplications) * 100) : 0 },
      { stage: 'Approved', count: approved, percentage: totalApplications > 0 ? Math.round((approved / totalApplications) * 100) : 0 },
      { stage: 'Disbursed', count: disbursed, percentage: totalApplications > 0 ? Math.round((disbursed / totalApplications) * 100) : 0 },
    ];

    // Recent activity
    const recentActivity = loans.slice(0, 10).map(loan => ({
      id: loan.id,
      type: loan.status === 'APPROVED' ? 'LOAN_APPROVED' : loan.status === 'DISBURSED' ? 'LOAN_DISBURSED' : 'LOAN_SUBMITTED',
      description: `Loan application ${loan.id.slice(0, 8)}... for ETB ${loan.amount.toLocaleString()}`,
      timestamp: loan.createdAt.toISOString(),
      user: loan.bank?.name || 'System',
    }));

    // Summary metrics
    const totalRevenue = loans.filter(l => l.status === 'DISBURSED').reduce((sum, l) => sum + l.amount, 0);
    const prevPeriodRevenue = Math.round(totalRevenue * 0.85); // Simulated previous period
    const revenueGrowth = prevPeriodRevenue > 0 ? Math.round(((totalRevenue - prevPeriodRevenue) / prevPeriodRevenue) * 100) : 0;

    const applicationGrowth = 12; // Simulated
    const approvalRate = loans.length > 0 ? Math.round((approved / loans.length) * 100) : 0;

    return successResponse({
      summary: {
        totalRevenue,
        revenueGrowth,
        totalApplications: loans.length,
        applicationGrowth,
        approvalRate,
        avgProcessingTime: 24, // Simulated hours
      },
      monthlyApplications: applicationsByMonth,
      revenueByMonth,
      userGrowth,
      loansByBank,
      loansByCategory,
      topProducts,
      conversionFunnel,
      recentActivity,
      performanceMetrics: {
        avgApprovalTime: 18, // Simulated hours
        avgDisbursementTime: 48, // Simulated hours
        completionRate: approvalRate,
        defaultRate: 2.5, // Simulated percentage
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return errorResponse("Failed to fetch analytics", 500);
  }
}
