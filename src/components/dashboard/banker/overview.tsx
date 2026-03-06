'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  FileText,
  CheckCircle,
  Clock,
  TrendingUp,
  Eye,
  DollarSign,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Activity,
  CreditCard,
  AlertCircle,
  Users,
  Target
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Stats {
  totalPending: number
  totalApproved: number
  totalRejected: number
  totalAmount: number
}

interface Loan {
  id: string
  applicationId: string
  customerName: string
  productName: string
  amount: number
  status: string
  createdAt: string
  termMonths: number
}

interface BankerOverviewProps {
  stats?: Stats
  pendingLoans?: Loan[]
  isLoading?: boolean
  onViewLoan: (loanId: string) => void
  onViewAllPending: () => void
}

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-800 border-gray-200',
  SUBMITTED: 'bg-blue-100 text-blue-800 border-blue-200',
  UNDER_REVIEW: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  ADDITIONAL_INFO_REQUIRED: 'bg-orange-100 text-orange-800 border-orange-200',
  APPROVED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  REJECTED: 'bg-red-100 text-red-800 border-red-200',
  DISBURSED: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0',
  CANCELLED: 'bg-gray-100 text-gray-600 border-gray-200',
}

const statusLabels: Record<string, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  ADDITIONAL_INFO_REQUIRED: 'Info Required',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  DISBURSED: 'Disbursed',
  CANCELLED: 'Cancelled',
}

export function BankerOverview({ stats, pendingLoans, isLoading, onViewLoan, onViewAllPending }: BankerOverviewProps) {
  if (isLoading) {
    return <OverviewSkeleton />
  }

  const pendingCount = stats?.totalPending || 0
  const approvedCount = stats?.totalApproved || 0
  const rejectedCount = stats?.totalRejected || 0
  const totalAmount = stats?.totalAmount || 0

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 lg:p-8">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        </div>

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-5 w-5 text-blue-400" />
              <span className="text-sm text-blue-400 font-medium">Banker Dashboard</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
              Welcome Back! 👋
            </h1>
            <p className="text-white/70 max-w-lg">
              Review and process loan applications from your assigned bank queue. Stay on top of pending applications.
            </p>
          </div>

          {pendingCount > 0 && (
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold">{pendingCount} Applications Pending</p>
                <p className="text-white/60 text-sm">Require your review</p>
              </div>
              <Button 
                className="ml-4 bg-white/20 hover:bg-white/30 text-white"
                onClick={onViewAllPending}
              >
                Review Now
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Review */}
        <Card className="relative overflow-hidden border-0 shadow-lg shadow-gray-200/50 bg-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <CardContent className="pt-6 relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Pending Review</p>
                <p className="text-3xl font-bold text-amber-600">{pendingCount}</p>
                <div className="flex items-center gap-1 mt-2 text-amber-600">
                  <Clock className="h-3 w-3" />
                  <span className="text-xs font-medium">Awaiting Action</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Approved */}
        <Card className="relative overflow-hidden border-0 shadow-lg shadow-gray-200/50 bg-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <CardContent className="pt-6 relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Approved</p>
                <p className="text-3xl font-bold text-emerald-600">{approvedCount}</p>
                <div className="flex items-center gap-1 mt-2 text-emerald-600">
                  <CheckCircle className="h-3 w-3" />
                  <span className="text-xs font-medium">Successful</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rejected */}
        <Card className="relative overflow-hidden border-0 shadow-lg shadow-gray-200/50 bg-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <CardContent className="pt-6 relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Rejected</p>
                <p className="text-3xl font-bold text-red-600">{rejectedCount}</p>
                <div className="flex items-center gap-1 mt-2 text-red-600">
                  <FileText className="h-3 w-3" />
                  <span className="text-xs font-medium">Declined</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center shadow-lg shadow-red-500/30">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Amount */}
        <Card className="relative overflow-hidden border-0 shadow-lg shadow-gray-200/50 bg-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <CardContent className="pt-6 relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  ETB {totalAmount.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2 text-blue-600">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs font-medium">Processed</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Loans - Takes 2 columns */}
        <Card className="lg:col-span-2 border-0 shadow-lg shadow-gray-200/50 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-gray-100">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-amber-500" />
              Pending Review
            </CardTitle>
            {(pendingLoans?.length || 0) > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                onClick={onViewAllPending}
              >
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="pt-4">
            {!pendingLoans || pendingLoans.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-10 w-10 text-emerald-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">All caught up!</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">
                  No pending loan applications to review. Great job staying on top of things!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingLoans.slice(0, 5).map((loan) => (
                  <button
                    key={loan.id}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
                    onClick={() => onViewLoan(loan.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <CreditCard className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">{loan.customerName}</p>
                        <p className="text-sm text-gray-500">
                          {loan.applicationId} • {loan.productName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ETB {loan.amount.toLocaleString()}
                        </p>
                        <Badge className={cn('text-xs', statusColors[loan.status] || statusColors.DRAFT)}>
                          {statusLabels[loan.status] || loan.status}
                        </Badge>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Column - Tips & Quick Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="border-0 shadow-lg shadow-gray-200/50 bg-white">
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-emerald-500" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <button
                  onClick={onViewAllPending}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-amber-300 hover:bg-amber-50/50 transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Review Applications</p>
                    <p className="text-xs text-gray-500">{pendingCount} pending review</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
                </button>

                <button
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">View Customers</p>
                    <p className="text-xs text-gray-500">Manage applications</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="border-0 shadow-lg shadow-gray-200/50 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-5 w-5" />
                <span className="font-semibold">Review Guidelines</span>
              </div>
              <ul className="space-y-2 text-sm text-white/90">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>Verify customer identity documents</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>Check income and employment details</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>Review credit history and bank statements</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>Assess repayment capacity</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Performance Summary */}
          <Card className="border-0 shadow-lg shadow-gray-200/50 bg-white">
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                Your Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Approval Rate</span>
                    <span className="text-sm font-semibold text-emerald-600">
                      {approvedCount + rejectedCount > 0 
                        ? Math.round((approvedCount / (approvedCount + rejectedCount)) * 100) 
                        : 0}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-500"
                      style={{ width: `${approvedCount + rejectedCount > 0 
                        ? Math.round((approvedCount / (approvedCount + rejectedCount)) * 100) 
                        : 0}%` }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center p-3 bg-emerald-50 rounded-xl">
                    <p className="text-2xl font-bold text-emerald-600">{approvedCount}</p>
                    <p className="text-xs text-gray-500">Approved</p>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-xl">
                    <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
                    <p className="text-xs text-gray-500">Rejected</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      {/* Welcome Section Skeleton */}
      <Skeleton className="h-40 w-full rounded-2xl" />

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-0 shadow-lg shadow-gray-200/50">
            <CardContent className="pt-6">
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-0 shadow-lg shadow-gray-200/50">
          <CardHeader className="border-b border-gray-100">
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="space-y-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="border-0 shadow-lg shadow-gray-200/50">
              <CardHeader className="border-b border-gray-100">
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="pt-4">
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
