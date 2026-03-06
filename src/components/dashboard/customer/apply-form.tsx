'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFormContext, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Search,
  Building2,
  Package,
  DollarSign,
  CreditCard,
  FileUp,
  Send,
  CheckCircle2
} from 'lucide-react'
import { useDashboardStore } from '@/lib/store/dashboard-store'
import { cn } from '@/lib/utils'

// Validation schemas
const bankSchema = z.object({
  bankId: z.string().min(1, 'Please select a bank'),
})

const productSchema = z.object({
  productId: z.string().min(1, 'Please select a product'),
})

const loanDetailsSchema = z.object({
  amount: z.number().min(1000, 'Minimum loan amount is ETB 1,000'),
  termMonths: z.number().min(3, 'Minimum term is 3 months').max(60, 'Maximum term is 60 months'),
  downPayment: z.number().min(0, 'Down payment cannot be negative'),
})

const bankAccountSchema = z.object({
  accountNumber: z.string().min(10, 'Account number must be at least 10 digits'),
  accountName: z.string().min(2, 'Account name is required'),
  bankName: z.string().min(1, 'Bank name is required'),
})

const documentsSchema = z.object({
  idCard: z.any().optional(),
  proofOfIncome: z.any().optional(),
  bankStatement: z.any().optional(),
})

const fullFormSchema = bankSchema.merge(productSchema).merge(loanDetailsSchema).merge(bankAccountSchema).merge(documentsSchema)

type FormData = z.infer<typeof fullFormSchema>

interface Bank {
  id: string
  name: string
  code: string
  logoUrl?: string
  minLoanAmount: number
  maxLoanAmount: number
  interestRate: number
  maxTermMonths: number
}

interface Product {
  id: string
  name: string
  price: number
  category?: string
  imageUrl?: string
  description?: string
  minDownPayment?: number
}

interface ApplyFormProps {
  banks?: Bank[]
  products?: Product[]
  isLoading?: boolean
}

const steps = [
  { id: 1, title: 'Select Bank', description: 'Choose your preferred bank', icon: Building2 },
  { id: 2, title: 'Select Product', description: 'Choose what to finance', icon: Package },
  { id: 3, title: 'Loan Details', description: 'Set loan amount and term', icon: DollarSign },
  { id: 4, title: 'Bank Account', description: 'Disbursement details', icon: CreditCard },
  { id: 5, title: 'Documents', description: 'Upload required files', icon: FileUp },
  { id: 6, title: 'Review', description: 'Confirm and submit', icon: Send },
]

export function ApplyForm({ banks = [], products = [], isLoading }: ApplyFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [applicationId, setApplicationId] = useState<string>('')
  const router = useRouter()
  const { setView } = useDashboardStore()

  const form = useForm<FormData>({
    resolver: zodResolver(fullFormSchema),
    defaultValues: {
      bankId: '',
      productId: '',
      amount: 0,
      termMonths: 12,
      downPayment: 0,
      accountNumber: '',
      accountName: '',
      bankName: '',
    },
    mode: 'onChange',
  })

  const progress = (currentStep / steps.length) * 100

  const nextStep = async () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/loans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      if (response.ok) {
        const result = await response.json()
        setApplicationId(result.applicationId)
        setIsSuccess(true)
      }
    } catch (error) {
      console.error('Failed to submit application:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleViewLoans = () => {
    setView('loans')
    router.push('/?view=loans', { scroll: false })
  }

  const handleNewApplication = () => {
    form.reset()
    setCurrentStep(1)
    setIsSuccess(false)
    setApplicationId('')
  }

  if (isLoading) {
    return <ApplyFormSkeleton />
  }

  if (isSuccess) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-600 mb-4">
            Your loan application has been successfully submitted.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Application ID: <span className="font-mono font-semibold">{applicationId}</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" onClick={handleNewApplication}>
              Start New Application
            </Button>
            <Button onClick={handleViewLoans}>
              View My Loans
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Header */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Loan Application</h2>
            <span className="text-sm text-gray-500">
              Step {currentStep} of {steps.length}
            </span>
          </div>
          <Progress value={progress} className="h-2 mb-4" />
          <div className="hidden md:flex items-center justify-between">
            {steps.map((step) => (
              <div
                key={step.id}
                className={cn(
                  'flex items-center gap-2',
                  currentStep >= step.id ? 'text-primary' : 'text-gray-400'
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                    currentStep > step.id
                      ? 'bg-primary text-white'
                      : currentStep === step.id
                      ? 'bg-primary/10 text-primary border-2 border-primary'
                      : 'bg-gray-100 text-gray-400'
                  )}
                >
                  {currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
                </div>
                <span className="text-sm font-medium hidden lg:inline">{step.title}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Steps */}
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <Card className="mb-6">
            <CardContent className="pt-6">
              {currentStep === 1 && (
                <BankSelection banks={banks} form={form} />
              )}
              {currentStep === 2 && (
                <ProductSelection products={products} form={form} />
              )}
              {currentStep === 3 && (
                <LoanDetailsStep banks={banks} form={form} />
              )}
              {currentStep === 4 && (
                <BankAccountStep form={form} />
              )}
              {currentStep === 5 && (
                <DocumentsStep form={form} />
              )}
              {currentStep === 6 && (
                <ReviewStep banks={banks} products={products} form={form} />
              )}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            {currentStep < steps.length ? (
              <Button type="button" onClick={nextStep}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>Submitting...</>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

// Bank Selection Step
function BankSelection({ banks, form }: { banks: Bank[], form: any }) {
  const { setValue, watch, formState: { errors } } = form
  const selectedBankId = watch('bankId')
  const selectedBank = banks.find(b => b.id === selectedBankId)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Select Your Preferred Bank</h3>
        <p className="text-gray-500 text-sm">
          Choose from our partner banks for your loan financing
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {banks.map((bank) => (
          <Card
            key={bank.id}
            className={cn(
              'cursor-pointer transition-all hover:shadow-md',
              selectedBankId === bank.id
                ? 'ring-2 ring-primary bg-primary/5'
                : 'hover:border-gray-300'
            )}
            onClick={() => setValue('bankId', bank.id, { shouldValidate: true })}
          >
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">
                    {bank.code.substring(0, 2)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900">{bank.name}</h4>
                    {selectedBankId === bank.id && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Interest Rate: {bank.interestRate}% • Max Term: {bank.maxTermMonths} months
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Loan Range: ETB {bank.minLoanAmount.toLocaleString()} - {bank.maxLoanAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedBank && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4 pb-4">
            <h4 className="font-medium text-blue-900 mb-2">{selectedBank.name} Details</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-blue-600">Interest Rate</p>
                <p className="font-semibold text-blue-900">{selectedBank.interestRate}%</p>
              </div>
              <div>
                <p className="text-blue-600">Max Term</p>
                <p className="font-semibold text-blue-900">{selectedBank.maxTermMonths} months</p>
              </div>
              <div>
                <p className="text-blue-600">Min Amount</p>
                <p className="font-semibold text-blue-900">ETB {selectedBank.minLoanAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-blue-600">Max Amount</p>
                <p className="font-semibold text-blue-900">ETB {selectedBank.maxLoanAmount.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {errors.bankId && (
        <p className="text-sm text-red-500">{errors.bankId.message}</p>
      )}
    </div>
  )
}

// Product Selection Step
function ProductSelection({ products, form }: { products: Product[], form: any }) {
  const { setValue, watch, formState: { errors } } = form
  const selectedProductId = watch('productId')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))]
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const selectedProduct = products.find(p => p.id === selectedProductId)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Select Product to Finance</h3>
        <p className="text-gray-500 text-sm">
          Choose the product you want to purchase with financing
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      <ScrollArea className="h-[400px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className={cn(
                'cursor-pointer transition-all hover:shadow-md overflow-hidden',
                selectedProductId === product.id
                  ? 'ring-2 ring-primary'
                  : 'hover:border-gray-300'
              )}
              onClick={() => setValue('productId', product.id, { shouldValidate: true })}
            >
              <div className="relative h-32 bg-gray-100">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-10 w-10 text-gray-400" />
                  </div>
                )}
                {selectedProductId === product.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              <CardContent className="pt-3 pb-3">
                <h4 className="font-medium text-gray-900 text-sm truncate">{product.name}</h4>
                <p className="text-primary font-semibold mt-1">
                  ETB {product.price.toLocaleString()}
                </p>
                {product.category && (
                  <Badge variant="secondary" className="mt-2 text-xs">
                    {product.category}
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {selectedProduct && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                {selectedProduct.imageUrl ? (
                  <img
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Package className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{selectedProduct.name}</h4>
                <p className="text-lg font-semibold text-primary">
                  ETB {selectedProduct.price.toLocaleString()}
                </p>
                {selectedProduct.minDownPayment && (
                  <p className="text-sm text-gray-500">
                    Min Down Payment: {selectedProduct.minDownPayment}%
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {errors.productId && (
        <p className="text-sm text-red-500">{errors.productId.message}</p>
      )}
    </div>
  )
}

// Loan Details Step
function LoanDetailsStep({ banks, form }: { banks: Bank[], form: any }) {
  const { register, watch, setValue, formState: { errors } } = form
  const selectedBankId = watch('bankId')
  const selectedProductId = watch('productId')
  const amount = watch('amount')
  const termMonths = watch('termMonths')
  const downPayment = watch('downPayment')

  const bank = banks.find(b => b.id === selectedBankId)
  
  // Calculate monthly payment (simple calculation)
  const monthlyPayment = amount && termMonths
    ? (amount - (downPayment || 0)) / termMonths
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Loan Details</h3>
        <p className="text-gray-500 text-sm">
          Set your loan amount, term, and down payment
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="amount">Loan Amount (ETB)</Label>
            <Input
              id="amount"
              type="number"
              {...register('amount', { valueAsNumber: true })}
              placeholder="Enter loan amount"
              min={bank?.minLoanAmount || 1000}
              max={bank?.maxLoanAmount || 1000000}
            />
            {errors.amount && (
              <p className="text-sm text-red-500 mt-1">{errors.amount.message}</p>
            )}
            {bank && (
              <p className="text-xs text-gray-500 mt-1">
                Range: ETB {bank.minLoanAmount.toLocaleString()} - {bank.maxLoanAmount.toLocaleString()}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="termMonths">Loan Term (Months)</Label>
            <Select
              value={termMonths?.toString()}
              onValueChange={(val) => setValue('termMonths', parseInt(val), { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select term" />
              </SelectTrigger>
              <SelectContent>
                {[3, 6, 12, 18, 24, 36, 48, 60].map((months) => (
                  <SelectItem
                    key={months}
                    value={months.toString()}
                    disabled={bank && months > bank.maxTermMonths}
                  >
                    {months} months ({months / 12} year{months > 12 ? 's' : ''})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.termMonths && (
              <p className="text-sm text-red-500 mt-1">{errors.termMonths.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="downPayment">Down Payment (ETB)</Label>
            <Input
              id="downPayment"
              type="number"
              {...register('downPayment', { valueAsNumber: true })}
              placeholder="Enter down payment"
              min={0}
            />
            {errors.downPayment && (
              <p className="text-sm text-red-500 mt-1">{errors.downPayment.message}</p>
            )}
          </div>
        </div>

        {/* Summary Card */}
        <Card className="bg-gray-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Loan Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Loan Amount</span>
              <span className="font-medium">ETB {amount?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Down Payment</span>
              <span className="font-medium">ETB {downPayment?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Term</span>
              <span className="font-medium">{termMonths || 0} months</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Interest Rate</span>
              <span className="font-medium">{bank?.interestRate || 0}%</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between">
              <span className="font-medium">Estimated Monthly Payment</span>
              <span className="font-bold text-primary text-lg">
                ETB {monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Bank Account Step
function BankAccountStep({ form }: { form: any }) {
  const { register, watch, setValue, formState: { errors } } = form
  const bankName = watch('bankName')

  const bankOptions = [
    'Commercial Bank of Ethiopia',
    'Dashen Bank',
    'Awash Bank',
    'Hijira Bank',
    'Coop Bank',
    'Bank of Abyssinia',
    'Zemen Bank',
    'Wegagen Bank',
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Bank Account Details</h3>
        <p className="text-gray-500 text-sm">
          Provide your bank account details for loan disbursement
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="bankName">Bank</Label>
          <Select
            value={bankName}
            onValueChange={(val) => setValue('bankName', val, { shouldValidate: true })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your bank" />
            </SelectTrigger>
            <SelectContent>
              {bankOptions.map((bank) => (
                <SelectItem key={bank} value={bank}>
                  {bank}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.bankName && (
            <p className="text-sm text-red-500 mt-1">{errors.bankName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="accountNumber">Account Number</Label>
          <Input
            id="accountNumber"
            {...register('accountNumber')}
            placeholder="Enter your account number"
          />
          {errors.accountNumber && (
            <p className="text-sm text-red-500 mt-1">{errors.accountNumber.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="accountName">Account Holder Name</Label>
          <Input
            id="accountName"
            {...register('accountName')}
            placeholder="Enter account holder name"
          />
          {errors.accountName && (
            <p className="text-sm text-red-500 mt-1">{errors.accountName.message}</p>
          )}
        </div>
      </div>

      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-4 pb-4">
          <p className="text-sm text-yellow-800">
            <strong>Important:</strong> Make sure the account details are correct. 
            Loan funds will be disbursed to this account upon approval.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

// Documents Step
function DocumentsStep({ form }: { form: any }) {
  const { setValue, watch, formState: { errors } } = form
  const idCard = watch('idCard')
  const proofOfIncome = watch('proofOfIncome')
  const bankStatement = watch('bankStatement')

  const documentTypes = [
    {
      id: 'idCard',
      label: 'ID Card / Passport',
      description: 'Valid government-issued ID',
      required: true,
      file: idCard,
    },
    {
      id: 'proofOfIncome',
      label: 'Proof of Income',
      description: 'Salary slip or business income proof',
      required: true,
      file: proofOfIncome,
    },
    {
      id: 'bankStatement',
      label: 'Bank Statement',
      description: 'Last 3 months bank statement',
      required: true,
      file: bankStatement,
    },
  ]

  const handleFileChange = (docId: string, file: File | null) => {
    setValue(docId as any, file, { shouldValidate: true })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Upload Documents</h3>
        <p className="text-gray-500 text-sm">
          Please upload the required documents to complete your application
        </p>
      </div>

      <div className="space-y-4">
        {documentTypes.map((doc) => (
          <Card key={doc.id}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileUp className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900">{doc.label}</h4>
                    {doc.required && (
                      <Badge variant="secondary" className="text-xs">Required</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{doc.description}</p>
                  
                  <div className="mt-3">
                    {doc.file ? (
                      <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg">
                        <Check className="h-4 w-4" />
                        <span className="text-sm">{doc.file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="ml-auto h-6 px-2"
                          onClick={() => handleFileChange(doc.id, null)}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <label className="block">
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleFileChange(doc.id, file)
                          }}
                        />
                        <div className="border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                          <p className="text-sm text-gray-500">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            PDF, JPG, PNG up to 5MB
                          </p>
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4 pb-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> All documents are encrypted and stored securely. 
            They will only be used for loan processing purposes.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

// Review Step
function ReviewStep({ banks, products, form }: { banks: Bank[], products: Product[], form: any }) {
  const { watch } = form
  const formData = watch()
  
  const bank = banks.find(b => b.id === formData.bankId)
  const product = products.find(p => p.id === formData.productId)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Review Your Application</h3>
        <p className="text-gray-500 text-sm">
          Please review all details before submitting your application
        </p>
      </div>

      <div className="space-y-4">
        {/* Bank Details */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Bank
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{bank?.name || 'Not selected'}</p>
            <p className="text-sm text-gray-500">
              Interest Rate: {bank?.interestRate}% | Max Term: {bank?.maxTermMonths} months
            </p>
          </CardContent>
        </Card>

        {/* Product Details */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Product
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{product?.name || 'Not selected'}</p>
            <p className="text-sm text-gray-500">
              Price: ETB {product?.price?.toLocaleString() || 0}
            </p>
          </CardContent>
        </Card>

        {/* Loan Details */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Loan Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Loan Amount</p>
                <p className="font-medium">ETB {formData.amount?.toLocaleString() || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Down Payment</p>
                <p className="font-medium">ETB {formData.downPayment?.toLocaleString() || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Term</p>
                <p className="font-medium">{formData.termMonths || 0} months</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Interest Rate</p>
                <p className="font-medium">{bank?.interestRate || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bank Account */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Disbursement Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{formData.accountName || 'Not provided'}</p>
            <p className="text-sm text-gray-500">
              {formData.bankName} - {formData.accountNumber}
            </p>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <FileUp className="h-5 w-5 text-primary" />
              Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {formData.idCard && (
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <Check className="h-3 w-3 mr-1" /> ID Card
                </Badge>
              )}
              {formData.proofOfIncome && (
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <Check className="h-3 w-3 mr-1" /> Proof of Income
                </Badge>
              )}
              {formData.bankStatement && (
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <Check className="h-3 w-3 mr-1" /> Bank Statement
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Skeleton
function ApplyFormSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardContent className="pt-6">
          <Skeleton className="h-6 w-40 mb-4" />
          <Skeleton className="h-2 w-full mb-4" />
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}
