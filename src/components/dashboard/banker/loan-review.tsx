'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  User,
  Building2,
  Package,
  DollarSign,
  Calendar,
  AlertCircle,
  Loader2,
  ArrowLeft,
  CreditCard,
  Wallet,
  Sparkles,
  TrendingUp,
  Shield
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoanDetails {
  id: string
  applicationId: string
  status: string
  amount: number
  downPayment: number
  totalAmount: number
  interestRate: number
  termMonths: number
  monthlyPayment: number
  createdAt: string
  submittedAt?: string
  internalNotes?: string
  rejectionReason?: string
  
  // Customer info
  customerName: string
  customerEmail: string
  customerPhone?: string
  
  // Bank info
  bankName: string
  
  // Product info
  productName: string
  productPrice: number
  
  // Disbursement info
  accountNumber?: string
  accountName?: string
  disbursementBankName?: string
  
  // Timeline
  timeline: {
    status: string
    action: string
    description: string
    performedByName?: string
    createdAt: string
  }[]
}

interface LoanReviewProps {
  loan?: LoanDetails
  isLoading?: boolean
  onBack: () => void
  onRefresh: () => void
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

export function LoanReview({ loan, isLoading, onBack, onRefresh }: LoanReviewProps) {
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [notes, setNotes] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleApprove = async () => {
    if (!loan) return
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/loans/${loan.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ internalNotes: notes }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to approve loan')
      } else {
        setShowApproveDialog(false)
        onRefresh()
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = async () => {
    if (!loan || !rejectionReason.trim()) {
      setError('Please provide a rejection reason')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/loans/${loan.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          rejectionReason,
          internalNotes: notes 
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to reject loan')
      } else {
        setShowRejectDialog(false)
        onRefresh()
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-12 w-48 bg-gray-200 rounded-xl animate-pulse" />
        <div className="h-96 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    )
  }

  if (!loan) {
    return (
      <Card className="max-w-2xl mx-auto border-0 shadow-lg shadow-gray-200/50 bg-white">
        <CardContent className="pt-12 pb-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Loan not found</h3>
          <p className="text-sm text-gray-500 mb-6">The loan application you&apos;re looking for doesn&apos;t exist.</p>
          <Button 
            className="bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/30"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </CardContent>
      </Card>
    )
  }

  const canTakeAction = ['SUBMITTED', 'UNDER_REVIEW', 'ADDITIONAL_INFO_REQUIRED'].includes(loan.status)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-xl hover:bg-gray-100"
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Wallet className="h-6 w-6 text-emerald-500" />
              {loan.applicationId}
            </h2>
            <p className="text-gray-500">Loan Application Review</p>
          </div>
        </div>
        <Badge className={cn('px-4 py-2 text-sm font-medium', statusColors[loan.status] || statusColors.DRAFT)}>
          {statusLabels[loan.status] || loan.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <Card className="border-0 shadow-lg shadow-gray-200/50 bg-white overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-emerald-500" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Full Name</p>
                  <p className="font-semibold text-gray-900">{loan.customerName}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="font-semibold text-gray-900">{loan.customerEmail}</p>
                </div>
                {loan.customerPhone && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Phone</p>
                    <p className="font-semibold text-gray-900">{loan.customerPhone}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Loan Amount</p>
                  <p className="text-xl font-bold text-gray-900">ETB {loan.amount.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Down Payment</p>
                  <p className="text-xl font-bold text-gray-900">ETB {loan.downPayment.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Interest Rate</p>
                  <p className="text-xl font-bold text-emerald-600">{loan.interestRate}%</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Term</p>
                  <p className="text-xl font-bold text-gray-900">{loan.termMonths} months</p>
                </div>
              </div>
              <Separator className="my-6" />
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl">
                <div>
                  <p className="text-sm text-gray-500">Estimated Monthly Payment</p>
                  <p className="text-3xl font-bold text-emerald-600">
                    ETB {loan.monthlyPayment?.toLocaleString() || 'N/A'}
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
                <p className="font-semibold text-gray-900">{loan.productName}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Price: ETB {loan.productPrice.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg shadow-gray-200/50 bg-white">
              <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-500" />
                  Financing Bank
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="font-semibold text-gray-900">{loan.bankName}</p>
              </CardContent>
            </Card>
          </div>

          {/* Disbursement Info */}
          {loan.accountNumber && (
            <Card className="border-0 shadow-lg shadow-gray-200/50 bg-white">
              <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="text-base flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-emerald-500" />
                  Disbursement Account
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Bank</p>
                    <p className="font-medium text-gray-900">{loan.disbursementBankName}</p>
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

          {/* Rejection Reason */}
          {loan.rejectionReason && (
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
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          {canTakeAction && (
            <Card className="border-0 shadow-lg shadow-gray-200/50 bg-white overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
              <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-emerald-500" />
                  Review Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <Button
                  className="w-full bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/30 h-11"
                  onClick={() => setShowApproveDialog(true)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Loan
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 h-11"
                  onClick={() => setShowRejectDialog(true)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Loan
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card className="border-0 shadow-lg shadow-gray-200/50 bg-white">
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-5 w-5 text-emerald-500" />
                Application Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {loan.timeline?.map((event, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        'w-3 h-3 rounded-full',
                        index === 0 
                          ? 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/30' 
                          : 'bg-gray-300'
                      )} />
                      {index < loan.timeline.length - 1 && (
                        <div className="w-0.5 h-8 bg-gray-200 mt-1" />
                      )}
                    </div>
                    <div className="pb-3">
                      <p className="text-sm font-medium text-gray-900">{event.description}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(event.createdAt).toLocaleString()}
                        {event.performedByName && ` • by ${event.performedByName}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Important Dates */}
          <Card className="border-0 shadow-lg shadow-gray-200/50 bg-white">
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-5 w-5 text-emerald-500" />
                Important Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-500">Created</span>
                <span className="text-sm font-medium text-gray-900">{new Date(loan.createdAt).toLocaleDateString()}</span>
              </div>
              {loan.submittedAt && (
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-500">Submitted</span>
                  <span className="text-sm font-medium text-gray-900">{new Date(loan.submittedAt).toLocaleDateString()}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security Note */}
          <Card className="border-0 shadow-lg shadow-gray-200/50 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-5 w-5 text-emerald-400" />
                <span className="font-semibold">Security Note</span>
              </div>
              <p className="text-sm text-white/70">
                All loan decisions are logged and auditable. Ensure you have reviewed all documentation before making a decision.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              Approve Loan Application
            </DialogTitle>
            <DialogDescription>
              You are about to approve this loan application. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="approve-notes">Internal Notes (Optional)</Label>
              <Textarea
                id="approve-notes"
                placeholder="Add any notes about this approval..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white"
              onClick={handleApprove} 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Approving...
                </>
              ) : (
                'Approve Loan'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              Reject Loan Application
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this loan application.
            </DialogDescription>
          </DialogHeader>
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="reject-reason">Rejection Reason *</Label>
              <Textarea
                id="reject-reason"
                placeholder="Explain why this application is being rejected..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                required
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="reject-notes">Internal Notes (Optional)</Label>
              <Textarea
                id="reject-notes"
                placeholder="Add any internal notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject} 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Rejecting...
                </>
              ) : (
                'Reject Loan'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
