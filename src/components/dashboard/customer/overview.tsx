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
  ArrowRight,
  Plus,
  Eye,
  Sparkles,
  Wallet,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  CreditCard,
  Calendar,
  Bell,
  Target
} from 'lucide-react'
import { useDashboardStore } from '@/lib/store/dashboard-store'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface Stats {
  totalApplications: number
  approved: number
  pending: number
  totalFinanced: number
}

interface Loan {
  id: string
  applicationId: string
  productName: string
  bankName: string
  amount: number
  status: string
  createdAt: string
}

interface OverviewProps {
  stats?: Stats
  loans?: Loan[]
  isLoading?: boolean
  userFullName?: string
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

export function Overview({ stats, loans, isLoading, userFullName }: OverviewProps) {
  const { setView, setSelectedLoanId } = useDashboardStore()
  const router = useRouter()

  const handleViewLoan = (loanId: string) => {
    setSelectedLoanId(loanId)
    router.push(`/?view=loan&id=${loanId}`, { scroll: false })
  }

  const handleApplyNow = () => {
    setView('apply')
    router.push('/?view=apply', { scroll: false })
  }

  const handleViewAllLoans = () => {
    setView('loans')
    router.push('/?view=loans', { scroll: false })
  }

  if (isLoading) {
    return <OverviewSkeleton />
  }

  const firstName = userFullName?.split(' ')[0] || 'User'
  const totalFinanced = stats?.totalFinanced || 0
  const pendingCount = stats?.pending || 0
  const approvedCount = stats?.approved || 0
  const totalApplications = stats?.totalApplications || 0

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 lg:p-8">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        </div>

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">Welcome back</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
              Hello, {firstName}! 👋
            </h1>
            <p className="text-white/70 max-w-lg">
              Here&apos;s an overview of your loan applications and financing activity. Ready to achieve your financial goals?
            </p>
          </div>

          <Button
            className="bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/30 shrink-0"
            onClick={handleApplyNow}
          >
            <Plus className="h-4 w-4 mr-2" />
            Apply for a New Loan
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Applications */}
        <Card className="relative overflow-hidden border-0 shadow-lg shadow-gray-200/50 bg-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <CardContent className="pt-6 relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Applications</p>
                <p className="text-3xl font-bold text-gray-900">{totalApplications}</p>
                <div className="flex items-center gap-1 mt-2 text-emerald-600">
                  <ArrowUpRight className="h-3 w-3" />
                  <span className="text-xs font-medium">Active</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Approved */}
        <Card className="relative overflow-hidden border-0 shadow-lg shadow-gray-200/50 bg-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <CardContent className="pt-6 relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Approved</p>
                <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
                <div className="flex items-center gap-1 mt-2 text-green-600">
                  <CheckCircle className="h-3 w-3" />
                  <span className="text-xs font-medium">Successful</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending */}
        <Card className="relative overflow-hidden border-0 shadow-lg shadow-gray-200/50 bg-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <CardContent className="pt-6 relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Pending</p>
                <p className="text-3xl font-bold text-amber-600">{pendingCount}</p>
                <div className="flex items-center gap-1 mt-2 text-amber-600">
                  <Clock className="h-3 w-3" />
                  <span className="text-xs font-medium">In Progress</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Financed */}
        <Card className="relative overflow-hidden border-0 shadow-lg shadow-gray-200/50 bg-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <CardContent className="pt-6 relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Financed</p>
                <p className="text-2xl font-bold text-gray-900">
                  ETB {totalFinanced.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2 text-emerald-600">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs font-medium">Growing</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg shadow-gray-200/50 bg-white">
        <CardHeader className="pb-3 border-b border-gray-100">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-500" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={handleApplyNow}
              className="group flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-200">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">New Application</p>
                <p className="text-sm text-gray-500">Start a new loan request</p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 ml-auto group-hover:text-emerald-500 group-hover:translate-x-1 transition-all duration-200" />
            </button>

            <button
              onClick={handleViewAllLoans}
              className="group flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-200">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Track Applications</p>
                <p className="text-sm text-gray-500">View all your loans</p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 ml-auto group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200" />
            </button>

            <button
              onClick={() => router.push('/?view=profile', { scroll: false })}
              className="group flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-200">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Update Profile</p>
                <p className="text-sm text-gray-500">Manage your account</p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 ml-auto group-hover:text-purple-500 group-hover:translate-x-1 transition-all duration-200" />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications - Takes 2 columns */}
        <Card className="lg:col-span-2 border-0 shadow-lg shadow-gray-200/50 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-gray-100">
            <CardTitle className="text-lg flex items-center gap-2">
              <Wallet className="h-5 w-5 text-emerald-500" />
              Recent Applications
            </CardTitle>
            {(loans?.length || 0) > 0 && (
              <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" onClick={handleViewAllLoans}>
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="pt-4">
            {!loans || loans.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">No applications yet</h3>
                <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                  Start your first loan application today and achieve your financial goals
                </p>
                <Button 
                  className="bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/30"
                  onClick={handleApplyNow}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Apply for a Loan
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {loans.slice(0, 5).map((loan) => (
                  <button
                    key={loan.id}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
                    onClick={() => handleViewLoan(loan.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <CreditCard className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">{loan.productName}</p>
                        <p className="text-sm text-gray-500">
                          {loan.applicationId} • {loan.bankName}
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
                      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Column - Tips & Notifications */}
        <div className="space-y-6">
          {/* Tips Card */}
          <Card className="border-0 shadow-lg shadow-gray-200/50 bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-5 w-5" />
                <span className="font-semibold">Tips for Faster Approval</span>
              </div>
              <ul className="space-y-2 text-sm text-white/90">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>Complete your profile with accurate information</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>Upload clear and valid documents</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>Respond promptly to additional info requests</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Upcoming Payments */}
          <Card className="border-0 shadow-lg shadow-gray-200/50 bg-white">
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-emerald-500" />
                Upcoming Payments
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Calendar className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">No upcoming payments</p>
                <p className="text-xs text-gray-400 mt-1">Your payment schedule will appear here</p>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="border-0 shadow-lg shadow-gray-200/50 bg-white">
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5 text-emerald-500" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Welcome to Soreti!</p>
                    <p className="text-xs text-gray-500">Start your loan journey today</p>
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

      {/* Quick Actions Skeleton */}
      <Card className="border-0 shadow-lg shadow-gray-200/50">
        <CardHeader className="border-b border-gray-100">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>

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
