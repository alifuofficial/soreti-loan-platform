'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import {
  ArrowLeft,
  Building2,
  Package,
  DollarSign,
  CreditCard,
  FileText,
  CheckCircle2,
  Circle,
  Clock,
  Upload,
  Download,
  Calendar,
  Wallet,
  TrendingUp,
  Sparkles,
  AlertCircle,
  CheckCircle,
  ArrowRight
} from 'lucide-react'
import { useDashboardStore } from '@/lib/store/dashboard-store'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface TimelineEvent {
  id: string
  status: string
  action: string
  description: string
  createdAt: string
  performedByName?: string
}

interface Document {
  id: string
  type: string
  name: string
  fileSize: number
  isVerified: boolean
  uploadedAt: string
}

interface LoanDetail {
  id: string
  applicationId: string
  status: string
  amount: number
  downPayment: number
  totalAmount: number
  interestRate: number
  termMonths: number
  monthlyPayment?: number
  accountNumber?: string
  accountName?: string
  bankName?: string
  rejectionReason?: string
  createdAt: string
  submittedAt?: string
  approvedAt?: string
  disbursedAt?: string
  product: {
    id: string
    name: string
    price: number
    category?: string
    imageUrl?: string
  }
  bank: {
    id: string
    name: string
    interestRate: number
  }
  timeline?: TimelineEvent[]
  documents?: Document[]
}

interface LoanDetailProps {
  loan?: LoanDetail
  isLoading?: boolean
}

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  DRAFT: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' },
  SUBMITTED: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
  UNDER_REVIEW: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
  ADDITIONAL_INFO_REQUIRED: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
  APPROVED: { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200' },
  REJECTED: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
  DISBURSED: { bg: 'bg-gradient-to-r from-emerald-500 to-teal-500', text: 'text-white', border: 'border-0' },
  CANCELLED: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
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

const docTypeLabels: Record<string, string> = {
  ID_CARD: 'ID Card',
  PASSPORT: 'Passport',
  KEBELE_ID: 'Kebele ID',
  BANK_STATEMENT: 'Bank Statement',
  PROOF_OF_INCOME: 'Proof of Income',
  EMPLOYMENT_LETTER: 'Employment Letter',
  BUSINESS_LICENSE: 'Business License',
  UTILITY_BILL: 'Utility Bill',
  OTHER: 'Other Document',
}

const statusProgress: Record<string, number> = {
  DRAFT: 10,
  SUBMITTED: 25,
  UNDER_REVIEW: 50,
  ADDITIONAL_INFO_REQUIRED: 35,
  APPROVED: 75,
  REJECTED: 100,
  DISBURSED: 100,
  CANCELLED: 100,
}

export function LoanDetail({ loan, isLoading }: LoanDetailProps) {
  const router = useRouter()
  const { setView, setSelectedLoanId } = useDashboardStore()

  const handleBack = () => {
    setSelectedLoanId(null)
    setView('loans')
    router.push('/?view=loans', { scroll: false })
  }

  if (isLoading) {
    return <LoanDetailSkeleton />
  }

  if (!loan) {
    return (
      <Card className="max-w-2xl mx-auto border-0 shadow-lg shadow-gray-200/50 bg-white">
        <CardContent className="pt-12 pb-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Application not found</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
            The loan application you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button 
            className="bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/30"
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Loans
          </Button>
        </CardContent>
      </Card>
    )
  }

  const colors = statusColors[loan.status] || statusColors.DRAFT
  const progress = statusProgress[loan.status] || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-xl hover:bg-gray-100"
            onClick={handleBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Wallet className="h-6 w-6 text-emerald-500" />
              {loan.applicationId}
            </h2>
            <p className="text-gray-500">{loan.product.name}</p>
          </div>
        </div>
        <Badge 
          variant="outline"
          className={cn('px-4 py-2 text-sm font-medium', colors.bg, colors.text, colors.border)}
        >
          {statusLabels[loan.status] || loan.status}
        </Badge>
      </div>

      {/* Progress Bar */}
      <Card className="border-0 shadow-lg shadow-gray-200/50 bg-white overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Application Progress
            </span>
            <span className="text-sm font-semibold text-emerald-600">{progress}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
          
          {/* Status Steps */}
          <div className="flex items-center justify-between mt-6">
            {['Created', 'Submitted', 'Review', 'Approved', 'Disbursed'].map((step, index) => {
              const stepProgress = [10, 25, 50, 75, 100][index]
              const isCompleted = progress >= stepProgress
              const isCurrent = progress === stepProgress
              
              return (
                <div key={step} className="flex flex-col items-center gap-1">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                    isCompleted 
                      ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-500/30' 
                      : 'bg-gray-100 text-gray-400'
                  )}>
                    {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                  </div>
                  <span className={cn(
                    'text-xs font-medium',
                    isCompleted ? 'text-gray-900' : 'text-gray-400'
                  )}>
                    {step}
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Rejection Reason */}
      {loan.status === 'REJECTED' && loan.rejectionReason && (
        <Card className="border-0 shadow-lg shadow-red-200/50 bg-gradient-to-br from-red-50 to-pink-50">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h4 className="font-semibold text-red-800 mb-1">Application Rejected</h4>
                <p className="text-sm text-red-700">{loan.rejectionReason}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Info Required */}
      {loan.status === 'ADDITIONAL_INFO_REQUIRED' && (
        <Card className="border-0 shadow-lg shadow-orange-200/50 bg-gradient-to-br from-orange-50 to-amber-50">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0">
                <AlertCircle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-semibold text-orange-800 mb-1">Additional Information Required</h4>
                <p className="text-sm text-orange-700">
                  Please upload additional documents or provide more information to proceed with your application.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Loan Details */}
          <Card className="border-0 shadow-lg shadow-gray-200/50 bg-white overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-500" />
                Loan Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Loan Amount</p>
                  <p className="text-xl font-bold text-gray-900">
                    ETB {loan.amount.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Down Payment</p>
                  <p className="text-xl font-bold text-gray-900">
                    ETB {loan.downPayment.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Interest Rate</p>
                  <p className="text-xl font-bold text-emerald-600">
                    {loan.interestRate}%
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Term</p>
                  <p className="text-xl font-bold text-gray-900">
                    {loan.termMonths} months
                  </p>
                </div>
              </div>
              <Separator className="my-6" />
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl">
                <div>
                  <p className="text-sm text-gray-500">Monthly Payment (Est.)</p>
                  <p className="text-3xl font-bold text-emerald-600">
                    ETB {(loan.monthlyPayment || loan.amount / loan.termMonths).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-xl font-bold text-gray-900">
                    ETB {loan.totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product & Bank */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg shadow-gray-200/50 bg-white">
              <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="h-5 w-5 text-emerald-500" />
                  Product
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
                    {loan.product.imageUrl ? (
                      <img
                        src={loan.product.imageUrl}
                        alt={loan.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{loan.product.name}</p>
                    <p className="text-sm text-gray-500">{loan.product.category || 'Product'}</p>
                    <p className="text-emerald-600 font-bold mt-1">
                      ETB {loan.product.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg shadow-gray-200/50 bg-white">
              <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-emerald-500" />
                  Financing Bank
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <span className="text-white font-bold text-lg">
                      {loan.bank.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{loan.bank.name}</p>
                    <p className="text-sm text-gray-500">Interest Rate: {loan.bank.interestRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Disbursement Account */}
          {loan.accountNumber && (
            <Card className="border-0 shadow-lg shadow-gray-200/50 bg-white">
              <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="text-base flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-emerald-500" />
                  Disbursement Account
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Bank</p>
                    <p className="font-medium text-gray-900">{loan.bankName}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Account Number</p>
                    <p className="font-mono font-medium text-gray-900">{loan.accountNumber}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Account Name</p>
                    <p className="font-medium text-gray-900">{loan.accountName}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Documents */}
          <Card className="border-0 shadow-lg shadow-gray-200/50 bg-white">
            <CardHeader className="pb-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-5 w-5 text-emerald-500" />
                  Documents
                </CardTitle>
                {loan.status !== 'DISBURSED' && loan.status !== 'CANCELLED' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {!loan.documents || loan.documents.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <FileText className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">No documents uploaded yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {loan.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                          <FileText className="h-5 w-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{docTypeLabels[doc.type] || doc.type}</p>
                          <p className="text-xs text-gray-500">
                            {(doc.fileSize / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {doc.isVerified ? (
                          <Badge className="bg-emerald-100 text-emerald-700 border-0">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-700 border-0">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white">
                          <Download className="h-4 w-4 text-gray-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Timeline */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-lg shadow-gray-200/50 bg-white sticky top-4">
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-emerald-500" />
                Application Timeline
              </CardTitle>
              <CardDescription>
                Track your application status
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {!loan.timeline || loan.timeline.length === 0 ? (
                <div className="space-y-4">
                  {/* Default timeline based on status */}
                  <TimelineItem
                    title="Application Created"
                    description="Your application has been created"
                    date={loan.createdAt}
                    isCompleted={true}
                  />
                  <TimelineItem
                    title="Submitted"
                    description="Application submitted for review"
                    date={loan.submittedAt}
                    isCompleted={!!loan.submittedAt}
                  />
                  <TimelineItem
                    title="Under Review"
                    description="Bank is reviewing your application"
                    isCompleted={['UNDER_REVIEW', 'APPROVED', 'DISBURSED'].includes(loan.status)}
                  />
                  <TimelineItem
                    title="Approved"
                    description="Application approved by bank"
                    date={loan.approvedAt}
                    isCompleted={['APPROVED', 'DISBURSED'].includes(loan.status)}
                  />
                  <TimelineItem
                    title="Disbursed"
                    description="Funds transferred to your account"
                    date={loan.disbursedAt}
                    isCompleted={loan.status === 'DISBURSED'}
                    isLast={true}
                  />
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {loan.timeline.map((event, index) => (
                      <TimelineItem
                        key={event.id}
                        title={event.description}
                        description={event.performedByName ? `by ${event.performedByName}` : ''}
                        date={event.createdAt}
                        isCompleted={true}
                        isLast={index === loan.timeline!.length - 1}
                      />
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

interface TimelineItemProps {
  title: string
  description?: string
  date?: string
  isCompleted: boolean
  isLast?: boolean
}

function TimelineItem({ title, description, date, isCompleted, isLast }: TimelineItemProps) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        {isCompleted ? (
          <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <CheckCircle2 className="h-4 w-4 text-white" />
          </div>
        ) : (
          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
            <Circle className="h-3 w-3 text-gray-400" />
          </div>
        )}
        {!isLast && (
          <div className={cn(
            'w-0.5 h-12 mt-1',
            isCompleted ? 'bg-gradient-to-b from-emerald-400 to-teal-500' : 'bg-gray-200'
          )} />
        )}
      </div>
      <div className={cn('pb-4', isLast && 'pb-0')}>
        <p className={cn(
          'text-sm font-medium',
          isCompleted ? 'text-gray-900' : 'text-gray-400'
        )}>
          {title}
        </p>
        {description && (
          <p className="text-xs text-gray-500">{description}</p>
        )}
        {date && (
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {format(new Date(date), 'MMM d, yyyy h:mm a')}
          </p>
        )}
      </div>
    </div>
  )
}

function LoanDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      
      <Card className="border-0 shadow-lg shadow-gray-200/50">
        <CardContent className="pt-6">
          <Skeleton className="h-4 w-40 mb-2" />
          <Skeleton className="h-2 w-full" />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-lg shadow-gray-200/50">
            <CardContent className="pt-6">
              <Skeleton className="h-48 w-full" />
            </CardContent>
          </Card>
          <div className="grid grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg shadow-gray-200/50">
              <CardContent className="pt-6">
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg shadow-gray-200/50">
              <CardContent className="pt-6">
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
        <div>
          <Card className="border-0 shadow-lg shadow-gray-200/50">
            <CardContent className="pt-6">
              <Skeleton className="h-72 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
