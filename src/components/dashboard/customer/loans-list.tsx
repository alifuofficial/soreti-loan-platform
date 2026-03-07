'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Eye,
  FileText,
  Filter,
  ArrowUpDown,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  CreditCard,
  ArrowRight,
  Wallet,
  Search,
  Sparkles
} from 'lucide-react'
import { useDashboardStore } from '@/lib/store/dashboard-store'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface Loan {
  id: string
  applicationId: string
  productName: string
  bankName: string
  amount: number
  status: string
  createdAt: string
  termMonths: number
  interestRate: number
  monthlyPayment?: number
}

interface LoansListProps {
  loans?: Loan[]
  isLoading?: boolean
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

const statusFilters = [
  { value: 'all', label: 'All Status' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'SUBMITTED', label: 'Submitted' },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  { value: 'ADDITIONAL_INFO_REQUIRED', label: 'Info Required' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'DISBURSED', label: 'Disbursed' },
]

export function LoansList({ loans = [], isLoading }: LoansListProps) {
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const { setSelectedLoanId } = useDashboardStore()
  const router = useRouter()

  const itemsPerPage = 10

  const handleViewLoan = (loanId: string) => {
    setSelectedLoanId(loanId)
    router.push(`/?view=loan&id=${loanId}`, { scroll: false })
  }

  const handleApplyNew = () => {
    router.push('/?view=apply', { scroll: false })
  }

  // Filter loans by status and search
  const filteredLoans = loans.filter(loan => {
    const matchesStatus = statusFilter === 'all' || loan.status === statusFilter
    const matchesSearch = searchQuery === '' || 
      loan.applicationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.bankName.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Sort loans
  const sortedLoans = [...filteredLoans].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'asc' 
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else {
      return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount
    }
  })

  // Paginate
  const totalPages = Math.ceil(sortedLoans.length / itemsPerPage)
  const paginatedLoans = sortedLoans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const toggleSort = (field: 'date' | 'amount') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  if (isLoading) {
    return <LoansListSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Wallet className="h-6 w-6 text-emerald-500" />
            My Loan Applications
          </h2>
          <p className="text-gray-500 mt-1">
            View and track all your loan applications
          </p>
        </div>
        <Button 
          className="bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/30"
          onClick={handleApplyNew}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Application
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden border-0 shadow-lg shadow-gray-200/50 bg-white">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full -translate-y-1/2 translate-x-1/2" />
          <CardContent className="pt-4 pb-4 relative">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold text-gray-900">{loans.length}</p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-0 shadow-lg shadow-gray-200/50 bg-white">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full -translate-y-1/2 translate-x-1/2" />
          <CardContent className="pt-4 pb-4 relative">
            <p className="text-sm text-gray-500">Approved</p>
            <p className="text-2xl font-bold text-emerald-600">{loans.filter(l => l.status === 'APPROVED' || l.status === 'DISBURSED').length}</p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-0 shadow-lg shadow-gray-200/50 bg-white">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full -translate-y-1/2 translate-x-1/2" />
          <CardContent className="pt-4 pb-4 relative">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-amber-600">{loans.filter(l => ['SUBMITTED', 'UNDER_REVIEW', 'ADDITIONAL_INFO_REQUIRED'].includes(l.status)).length}</p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-0 shadow-lg shadow-gray-200/50 bg-white">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-100 to-pink-100 rounded-full -translate-y-1/2 translate-x-1/2" />
          <CardContent className="pt-4 pb-4 relative">
            <p className="text-sm text-gray-500">Rejected</p>
            <p className="text-2xl font-bold text-red-600">{loans.filter(l => l.status === 'REJECTED').length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg shadow-gray-200/50 bg-white">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ID, product, or bank..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50/50 pl-9 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-colors"
              />
            </div>
            
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 border-gray-200 bg-gray-50/50">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  {statusFilters.map((filter) => (
                    <SelectItem key={filter.value} value={filter.value}>
                      {filter.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-sm text-gray-500 flex items-center">
              {filteredLoans.length} application{filteredLoans.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loans List */}
      {paginatedLoans.length === 0 ? (
        <Card className="border-0 shadow-lg shadow-gray-200/50 bg-white">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">No applications found</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
              {statusFilter !== 'all' 
                ? `No ${statusLabels[statusFilter]?.toLowerCase() || ''} applications`
                : 'Start your first loan application today'}
            </p>
            <Button 
              className="bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/30"
              onClick={handleApplyNew}
            >
              <Plus className="h-4 w-4 mr-2" />
              Apply for a Loan
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-0 shadow-lg shadow-gray-200/50 bg-white">
          <CardContent className="p-0">
            {/* Table Header */}
            <div className="hidden lg:grid lg:grid-cols-7 gap-4 px-6 py-3 bg-gray-50/50 border-b border-gray-100 text-sm font-medium text-gray-500">
              <div className="col-span-1">Application ID</div>
              <div className="col-span-2">Product</div>
              <div className="col-span-1">Bank</div>
              <div className="col-span-1">
                <button
                  className="flex items-center gap-1 hover:text-gray-700"
                  onClick={() => toggleSort('amount')}
                >
                  Amount
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">
                <button
                  className="flex items-center gap-1 hover:text-gray-700"
                  onClick={() => toggleSort('date')}
                >
                  Date
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Loans List */}
            <ScrollArea className="w-full">
              <div className="divide-y divide-gray-100">
                {paginatedLoans.map((loan) => (
                  <button
                    key={loan.id}
                    className="w-full grid grid-cols-1 lg:grid-cols-7 gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors text-left"
                    onClick={() => handleViewLoan(loan.id)}
                  >
                    {/* Application ID */}
                    <div className="lg:col-span-1">
                      <span className="font-mono text-sm font-medium text-gray-900">
                        {loan.applicationId}
                      </span>
                    </div>

                    {/* Product */}
                    <div className="lg:col-span-2 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
                        <CreditCard className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{loan.productName}</p>
                        <p className="text-xs text-gray-500 lg:hidden">{loan.bankName}</p>
                      </div>
                    </div>

                    {/* Bank */}
                    <div className="hidden lg:block lg:col-span-1">
                      <span className="text-gray-600">{loan.bankName}</span>
                    </div>

                    {/* Amount */}
                    <div className="lg:col-span-1">
                      <span className="font-semibold text-gray-900">
                        ETB {loan.amount.toLocaleString()}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="lg:col-span-1">
                      <Badge 
                        variant="outline"
                        className={cn('text-xs', statusColors[loan.status] || statusColors.DRAFT)}
                      >
                        {statusLabels[loan.status] || loan.status}
                      </Badge>
                    </div>

                    {/* Date */}
                    <div className="lg:col-span-1 flex items-center justify-between lg:justify-start">
                      <div className="flex items-center gap-1 text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span className="text-sm">
                          {format(new Date(loan.createdAt), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 lg:hidden" />
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-200"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-200"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function LoansListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>
      
      {/* Stats Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-0 shadow-lg shadow-gray-200/50">
            <CardContent className="pt-4 pb-4">
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-8 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="border-0 shadow-lg shadow-gray-200/50">
        <CardContent className="pt-4 pb-4">
          <Skeleton className="h-10 w-full max-w-md" />
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-lg shadow-gray-200/50">
        <CardContent className="p-0">
          <div className="p-4 space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
