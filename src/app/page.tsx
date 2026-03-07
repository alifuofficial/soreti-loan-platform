'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useSearchParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

// Components
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  UserPlus,
  Building2,
  FileText,
  CheckCircle,
  ArrowRight,
  Star,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Shield,
  Clock,
  Users,
  TrendingUp,
  Menu,
  X,
  Loader2,
  Smartphone,
  Laptop,
  Car,
  Home,
  Sparkles,
  CreditCard,
  Zap,
  PlayCircle,
  Award,
  Timer,
  Quote,
  MessageCircle,
  ArrowUpRight,
  Wallet,
  Rocket,
  ChevronRight,
  Globe,
  BadgePercent,
  HeadphonesIcon,
  ArrowDownLeft,
  Send,
  ExternalLink,
  Bell
} from 'lucide-react'

// Auth Modals
import { AuthModals } from '@/components/auth/auth-modals'

// Homepage dynamic sections
import { HomepageProvider, DynamicSection, useHomepageSections } from '@/components/homepage/dynamic-sections'

// Lazy load dashboard components
const CustomerLayout = dynamic(
  () => import('@/components/dashboard/customer-layout').then(mod => ({ default: mod.CustomerLayout })),
  { loading: () => <DashboardLoader /> }
)
const Overview = dynamic(
  () => import('@/components/dashboard/customer/overview').then(mod => ({ default: mod.Overview })),
  { loading: () => <DashboardLoader /> }
)
const ApplyForm = dynamic(
  () => import('@/components/dashboard/customer/apply-form').then(mod => ({ default: mod.ApplyForm })),
  { loading: () => <DashboardLoader /> }
)
const LoansList = dynamic(
  () => import('@/components/dashboard/customer/loans-list').then(mod => ({ default: mod.LoansList })),
  { loading: () => <DashboardLoader /> }
)
const LoanDetail = dynamic(
  () => import('@/components/dashboard/customer/loan-detail').then(mod => ({ default: mod.LoanDetail })),
  { loading: () => <DashboardLoader /> }
)
const ProfileManagement = dynamic(
  () => import('@/components/dashboard/customer/profile-management').then(mod => ({ default: mod.ProfileManagement })),
  { loading: () => <DashboardLoader /> }
)
const BankerLayout = dynamic(
  () => import('@/components/dashboard/banker/layout').then(mod => ({ default: mod.BankerLayout })),
  { loading: () => <DashboardLoader /> }
)
const BankerOverview = dynamic(
  () => import('@/components/dashboard/banker/overview').then(mod => ({ default: mod.BankerOverview })),
  { loading: () => <DashboardLoader /> }
)
const LoanReview = dynamic(
  () => import('@/components/dashboard/banker/loan-review').then(mod => ({ default: mod.LoanReview })),
  { loading: () => <DashboardLoader /> }
)
const BankerProfile = dynamic(
  () => import('@/components/dashboard/banker/banker-profile').then(mod => ({ default: mod.BankerProfile })),
  { loading: () => <DashboardLoader /> }
)
const AdminLayout = dynamic(
  () => import('@/components/dashboard/admin/layout').then(mod => ({ default: mod.AdminLayout })),
  { loading: () => <DashboardLoader /> }
)
const AdminOverview = dynamic(
  () => import('@/components/dashboard/admin/overview').then(mod => ({ default: mod.AdminOverview })),
  { loading: () => <DashboardLoader /> }
)
const UsersManagement = dynamic(
  () => import('@/components/dashboard/admin/users-management').then(mod => ({ default: mod.UsersManagement })),
  { loading: () => <DashboardLoader /> }
)
const BanksManagement = dynamic(
  () => import('@/components/dashboard/admin/banks-management').then(mod => ({ default: mod.BanksManagement })),
  { loading: () => <DashboardLoader /> }
)
const ProductsManagement = dynamic(
  () => import('@/components/dashboard/admin/products-management').then(mod => ({ default: mod.ProductsManagement })),
  { loading: () => <DashboardLoader /> }
)
const AnalyticsDashboard = dynamic(
  () => import('@/components/dashboard/admin/analytics-dashboard').then(mod => ({ default: mod.AnalyticsDashboard })),
  { loading: () => <DashboardLoader /> }
)
const SettingsManagement = dynamic(
  () => import('@/components/dashboard/admin/settings-management').then(mod => ({ default: mod.SettingsManagement })),
  { loading: () => <DashboardLoader /> }
)
const HomepageManager = dynamic(
  () => import('@/components/dashboard/admin/homepage-manager').then(mod => ({ default: mod.HomepageManager })),
  { loading: () => <DashboardLoader /> }
)
const AdvancedAdminOverview = dynamic(
  () => import('@/components/dashboard/admin/advanced-overview').then(mod => ({ default: mod.AdvancedAdminOverview })),
  { loading: () => <DashboardLoader /> }
)

// Types
import type { BankerViewType } from '@/components/dashboard/banker/layout'
import type { AdminViewType } from '@/components/dashboard/admin/layout'

// Dashboard Store
import { useDashboardStore } from '@/lib/store/dashboard-store'

// Data
const steps = [
  { 
    icon: UserPlus, 
    title: 'Create Account', 
    description: 'Sign up in minutes with basic info and verification',
    time: '~3 min',
    color: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200'
  },
  { 
    icon: Building2, 
    title: 'Choose Bank', 
    description: 'Compare and select from our trusted partner banks',
    time: '~2 min',
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  { 
    icon: FileText, 
    title: 'Submit Application', 
    description: 'Upload documents and complete your loan request',
    time: '~5 min',
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200'
  },
  { 
    icon: CheckCircle, 
    title: 'Get Approved', 
    description: 'Receive approval and access your financing',
    time: '24-48 hrs',
    color: 'from-primary to-emerald-600',
    bgColor: 'bg-primary/5',
    borderColor: 'border-primary/20'
  }
]

const partnerBanks = [
  { 
    name: 'Hijira Bank', 
    initials: 'HB', 
    status: 'available',
    tagline: 'Islamic Banking Excellence',
    color: '#059669',
    featured: true
  },
  { 
    name: 'Coop Bank', 
    initials: 'CB', 
    status: 'available',
    tagline: 'Banking for All',
    color: '#2563eb',
    featured: true
  },
  { 
    name: 'Commercial Bank of Ethiopia', 
    initials: 'CBE', 
    status: 'available',
    tagline: 'Ethiopia\'s Leading Bank',
    color: '#dc2626',
    featured: true
  },
  { 
    name: 'Dashen Bank', 
    initials: 'DB', 
    status: 'available',
    tagline: 'Innovative Solutions',
    color: '#7c3aed',
    featured: false
  },
  { 
    name: 'Awash Bank', 
    initials: 'AB', 
    status: 'available',
    tagline: 'Your Trusted Partner',
    color: '#0891b2',
    featured: false
  },
  { 
    name: 'Zemen Bank', 
    initials: 'ZB', 
    status: 'available',
    tagline: 'Transforming Lives',
    color: '#ea580c',
    featured: false
  },
  { 
    name: 'Bunna Bank', 
    initials: 'BB', 
    status: 'available',
    tagline: 'Fresh Banking',
    color: '#16a34a',
    featured: false
  },
  { 
    name: 'Abay Bank', 
    initials: 'AYB', 
    status: 'coming_soon',
    tagline: 'Coming Soon',
    color: '#4f46e5',
    featured: false
  },
  { 
    name: 'Berhan Bank', 
    initials: 'BrB', 
    status: 'coming_soon',
    tagline: 'Coming Soon',
    color: '#0d9488',
    featured: false
  },
  { 
    name: 'Enat Bank', 
    initials: 'EB', 
    status: 'coming_soon',
    tagline: 'Coming Soon',
    color: '#be185d',
    featured: false
  },
]

const featuredProducts = [
  { 
    name: 'iPhone 15 Pro Max', 
    price: 'ETB 150,000', 
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
    category: 'Electronics',
    monthlyPayment: 'ETB 4,167/mo',
    badge: 'Popular'
  },
  { 
    name: 'Samsung Galaxy S24 Ultra', 
    price: 'ETB 120,000', 
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=300&fit=crop',
    category: 'Electronics',
    monthlyPayment: 'ETB 3,333/mo',
    badge: 'New'
  },
  { 
    name: 'MacBook Pro 16"', 
    price: 'ETB 200,000', 
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=400&h=300&fit=crop',
    category: 'Computers',
    monthlyPayment: 'ETB 5,556/mo',
    badge: 'Best Value'
  },
  { 
    name: 'Toyota Corolla 2023', 
    price: 'ETB 3,500,000', 
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop',
    category: 'Vehicles',
    monthlyPayment: 'ETB 97,222/mo',
    badge: 'Featured'
  }
]

const productCategories = [
  { name: 'Electronics', icon: Smartphone, count: 150, color: 'from-violet-500 to-purple-600' },
  { name: 'Computers', icon: Laptop, count: 85, color: 'from-blue-500 to-cyan-600' },
  { name: 'Vehicles', icon: Car, count: 45, color: 'from-emerald-500 to-teal-600' },
  { name: 'Real Estate', icon: Home, count: 30, color: 'from-orange-500 to-amber-600' }
]

const stats = [
  { value: '10,000+', label: 'Loans Approved', icon: CheckCircle },
  { value: '$50M+', label: 'Financed', icon: TrendingUp },
  { value: '15+', label: 'Partner Banks', icon: Building2 },
  { value: '98%', label: 'Satisfaction', icon: Star }
]

const testimonials = [
  { 
    name: 'Abebe Bekele', 
    role: 'Business Owner', 
    content: 'Soreti made it incredibly easy to get financing for my business equipment. The process was smooth and the support team was very helpful.', 
    rating: 5,
    loanAmount: 'ETB 500,000',
    loanType: 'Business Equipment',
    avatar: 'AB',
    gradient: 'from-violet-500 to-purple-600',
    verified: true
  },
  { 
    name: 'Tigist Haile', 
    role: 'Healthcare Professional', 
    content: 'I was able to purchase medical equipment for my clinic through Soreti\'s platform. The interest rates are competitive and the approval was fast.', 
    rating: 5,
    loanAmount: 'ETB 850,000',
    loanType: 'Medical Equipment',
    avatar: 'TH',
    gradient: 'from-blue-500 to-cyan-600',
    verified: true
  },
  { 
    name: 'Dawit Amare', 
    role: 'Software Developer', 
    content: 'Got my dream laptop with financing from Soreti. The whole process took less than a week. Highly recommended!', 
    rating: 5,
    loanAmount: 'ETB 150,000',
    loanType: 'Electronics',
    avatar: 'DA',
    gradient: 'from-emerald-500 to-teal-600',
    verified: true
  },
  { 
    name: 'Sara Mekonnen', 
    role: 'Restaurant Owner', 
    content: 'The financing helped me expand my restaurant. The team was professional and the approval process was transparent.', 
    rating: 5,
    loanAmount: 'ETB 1,200,000',
    loanType: 'Business Expansion',
    avatar: 'SM',
    gradient: 'from-orange-500 to-amber-600',
    verified: true
  },
  { 
    name: 'Yohannes Girma', 
    role: 'Teacher', 
    content: 'I bought furniture for my new home. The monthly payments are affordable and the customer service is excellent.', 
    rating: 5,
    loanAmount: 'ETB 180,000',
    loanType: 'Home Furniture',
    avatar: 'YG',
    gradient: 'from-pink-500 to-rose-600',
    verified: true
  },
  { 
    name: 'Marta Tesfaye', 
    role: 'Fashion Designer', 
    content: 'Soreti helped me get the equipment I needed for my fashion studio. Very satisfied with the service!', 
    rating: 5,
    loanAmount: 'ETB 350,000',
    loanType: 'Business Equipment',
    avatar: 'MT',
    gradient: 'from-indigo-500 to-violet-600',
    verified: true
  },
  { 
    name: 'Daniel Hailu', 
    role: 'Engineer', 
    content: 'Got my car financed through Soreti. The process was straightforward and the team was very supportive throughout.', 
    rating: 5,
    loanAmount: 'ETB 2,800,000',
    loanType: 'Vehicle',
    avatar: 'DH',
    gradient: 'from-cyan-500 to-blue-600',
    verified: true
  },
  { 
    name: 'Helen Alemu', 
    role: 'Pharmacist', 
    content: 'Quick approval and competitive rates. I was able to open my pharmacy thanks to Soreti\'s financing solution.', 
    rating: 5,
    loanAmount: 'ETB 950,000',
    loanType: 'Business Startup',
    avatar: 'HA',
    gradient: 'from-teal-500 to-emerald-600',
    verified: true
  },
  { 
    name: 'Berhanu Kebede', 
    role: 'Contractor', 
    content: 'Excellent service! The loan helped me purchase construction equipment. Very professional team.', 
    rating: 5,
    loanAmount: 'ETB 1,500,000',
    loanType: 'Construction Equipment',
    avatar: 'BK',
    gradient: 'from-amber-500 to-orange-600',
    verified: true
  },
  { 
    name: 'Selam Tadesse', 
    role: 'Graphic Designer', 
    content: 'Financed my iMac and design software through Soreti. The process was seamless and quick!', 
    rating: 5,
    loanAmount: 'ETB 200,000',
    loanType: 'Electronics',
    avatar: 'ST',
    gradient: 'from-fuchsia-500 to-pink-600',
    verified: true
  }
]

const quickLinks = [
  { name: 'Home', href: '#hero' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Partner Banks', href: '#banks' },
  { name: 'Products', href: '#products' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'Contact', href: '#contact' }
]

const footerLinks = {
  company: [
    { name: 'About Us', href: '#about' },
    { name: 'Our Team', href: '#team' },
    { name: 'Careers', href: '#careers' },
    { name: 'Press', href: '#press' }
  ],
  services: [
    { name: 'Personal Loans', href: '#personal-loans' },
    { name: 'Business Financing', href: '#business-financing' },
    { name: 'Asset Financing', href: '#asset-financing' },
    { name: 'Vehicle Financing', href: '#vehicle-financing' }
  ],
  legal: [
    { name: 'Privacy Policy', href: '#privacy' },
    { name: 'Terms of Service', href: '#terms' },
    { name: 'Cookie Policy', href: '#cookies' },
    { name: 'Disclaimer', href: '#disclaimer' }
  ],
  support: [
    { name: 'Help Center', href: '#help' },
    { name: 'FAQs', href: '#faqs' },
    { name: 'Contact Us', href: '#contact' },
    { name: 'Report an Issue', href: '#report' }
  ]
}

function DashboardLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}

// Main Page Component
function MainPageContent() {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { currentView, setView, selectedLoanId, setSelectedLoanId } = useDashboardStore()

  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Data states
  const [banks, setBanks] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loans, setLoans] = useState<any[]>([])
  const [selectedLoan, setSelectedLoan] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  // Admin/Banker view states
  const [bankerView, setBankerView] = useState<BankerViewType>('dashboard')
  const [adminView, setAdminView] = useState<AdminViewType>('dashboard')

  // Sync view with URL
  useEffect(() => {
    const view = searchParams.get('view')
    const tab = searchParams.get('tab')
    const loanId = searchParams.get('id')

    if (view === 'loan' && loanId) {
      setSelectedLoanId(loanId)
    } else if (view) {
      setView(view as any)
    }
    
    if (tab) {
      setBankerView(tab as BankerViewType)
      setAdminView(tab as AdminViewType)
    }
  }, [searchParams, setView, setSelectedLoanId])

  // Fetch data for authenticated users
  useEffect(() => {
    if (session?.user) {
      fetchInitialData()
    }
  }, [session])

  const fetchInitialData = async () => {
    setIsLoading(true)
    try {
      const [banksRes, productsRes, loansRes, statsRes] = await Promise.all([
        fetch('/api/banks'),
        fetch('/api/products'),
        fetch('/api/loans'),
        fetch('/api/stats'),
      ])

      if (banksRes.ok) {
        const data = await banksRes.json()
        setBanks(data.banks || data || [])
      }
      if (productsRes.ok) {
        const data = await productsRes.json()
        setProducts(data.products || data || [])
      }
      if (loansRes.ok) {
        const data = await loansRes.json()
        setLoans(data.loans || data || [])
      }
      if (statsRes.ok) {
        const data = await statsRes.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchLoanDetails = async (loanId: string) => {
    try {
      const res = await fetch(`/api/loans/${loanId}`)
      if (res.ok) {
        const data = await res.json()
        setSelectedLoan(data.loan || data)
      }
    } catch (error) {
      console.error('Failed to fetch loan details:', error)
    }
  }

  useEffect(() => {
    if (selectedLoanId) {
      fetchLoanDetails(selectedLoanId)
    }
  }, [selectedLoanId])

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  // Determine if user is authenticated and their role
  const isAuthenticated = status === 'authenticated' && session?.user
  const isLoadingSession = status === 'loading'
  const userRole = session?.user?.role
  const isBanker = userRole === 'BANKER'
  const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'CEO', 'GENERAL_MANAGER', 'FINANCE_MANAGER', 'MARKETING_MANAGER'].includes(userRole || '')

  // Get bank name for banker - with safety check
  const bankName = Array.isArray(banks) ? banks.find(b => b.id === session?.user?.bankId)?.name || 'Your Bank' : 'Your Bank'

  // Show loading state while session is being validated (prevents flash to homepage)
  if (isLoadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  // Render appropriate dashboard based on role
  if (isAuthenticated) {
    // Banker Dashboard
    if (isBanker) {
      return (
        <BankerLayout
          user={{
            ...session.user,
            bankName
          }}
          currentView={bankerView}
          onViewChange={setBankerView}
        >
          {bankerView === 'dashboard' && (
            <BankerOverview
              stats={stats?.bankerStats || stats}
              pendingLoans={Array.isArray(loans) ? loans.filter(l => ['SUBMITTED', 'UNDER_REVIEW'].includes(l.status)) : []}
              isLoading={isLoading}
              onViewLoan={(id) => {
                setSelectedLoanId(id)
                router.push(`/?view=banker&tab=loan&id=${id}`, { scroll: false })
              }}
              onViewAllPending={() => setBankerView('pending')}
            />
          )}
          {bankerView === 'pending' && (
            <LoansList
              loans={Array.isArray(loans) ? loans.filter(l => ['SUBMITTED', 'UNDER_REVIEW'].includes(l.status)) : []}
              isLoading={isLoading}
            />
          )}
          {(bankerView === 'approved' || bankerView === 'rejected') && (
            <LoansList
              loans={Array.isArray(loans) ? loans.filter(l => bankerView === 'approved' ? l.status === 'APPROVED' : l.status === 'REJECTED') : []}
              isLoading={isLoading}
            />
          )}
          {bankerView === 'stats' && (
            <div className="text-center py-12 text-gray-500">
              Statistics dashboard coming soon...
            </div>
          )}
          {bankerView === 'profile' && (
            <BankerProfile user={{
              id: session.user.id,
              fullName: session.user.fullName,
              email: session.user.email,
              role: session.user.role,
              bankName: bankName
            }} />
          )}
        </BankerLayout>
      )
    }

    // Admin Dashboard
    if (isAdmin) {
      return (
        <AdminLayout
          user={session.user}
          currentView={adminView}
          onViewChange={setAdminView}
        >
          {adminView === 'dashboard' && (
            <AdvancedAdminOverview />
          )}
          {adminView === 'users' && (
            <UsersManagement isLoading={isLoading} />
          )}
          {adminView === 'banks' && (
            <BanksManagement />
          )}
          {adminView === 'products' && (
            <ProductsManagement />
          )}
          {adminView === 'loans' && (
            <LoansList loans={Array.isArray(loans) ? loans : []} isLoading={isLoading} />
          )}
          {adminView === 'analytics' && (
            <AnalyticsDashboard />
          )}
          {adminView === 'settings' && (
            <SettingsManagement />
          )}
          {adminView === 'homepage' && (
            <HomepageManager />
          )}
        </AdminLayout>
      )
    }

    // Customer Dashboard
    return (
      <CustomerLayout user={session.user}>
        {currentView === 'dashboard' && (
          <Overview
            stats={stats?.customerStats || stats}
            loans={Array.isArray(loans) ? loans : []}
            isLoading={isLoading}
            userFullName={session.user.fullName}
          />
        )}
        {currentView === 'apply' && (
          <ApplyForm
            banks={Array.isArray(banks) ? banks : []}
            products={Array.isArray(products) ? products : []}
            isLoading={isLoading}
          />
        )}
        {currentView === 'loans' && (
          <LoansList loans={Array.isArray(loans) ? loans : []} isLoading={isLoading} />
        )}
        {currentView === 'loan' && selectedLoanId && (
          <LoanDetail loan={selectedLoan} isLoading={isLoading} />
        )}
        {currentView === 'profile' && (
          <ProfileManagement user={session.user} />
        )}
      </CustomerLayout>
    )
  }

  // Public Homepage
  return (
    <HomepageProvider>
    <div className="min-h-screen flex flex-col">
      {/* Auth Modals */}
      <AuthModals
        showLogin={showLogin}
        showRegister={showRegister}
        onClose={() => { setShowLogin(false); setShowRegister(false) }}
        onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true) }}
        onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true) }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Soreti</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            {quickLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-600 hover:text-primary transition-colors font-medium"
              >
                {link.name}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden sm:inline-flex" onClick={() => setShowLogin(true)}>
              Sign In
            </Button>
            <Button onClick={() => setShowRegister(true)}>Get Started</Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white py-4 px-4">
            <nav className="flex flex-col gap-4">
              {quickLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-600 hover:text-primary transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="flex flex-col gap-2 mt-4">
                <Button variant="outline" onClick={() => { setShowLogin(true); setMobileMenuOpen(false) }}>
                  Sign In
                </Button>
                <Button onClick={() => { setShowRegister(true); setMobileMenuOpen(false) }}>
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <DynamicSection sectionKey="hero" id="hero" className="relative min-h-[90vh] flex items-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-primary/5" />
          
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-gray-200/50 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-gray-200/30 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-primary/10 rounded-full" />
          </div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:48px_48px]" />
          
          <div className="container mx-auto px-4 py-20 lg:py-0 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-center lg:text-left">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
                  <Sparkles className="h-4 w-4" />
                  <span>Ethiopia&apos;s #1 Loan Platform</span>
                  <BadgePercent className="h-4 w-4" />
                </div>
                
                {/* Headline */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Get Financing for
                  <br />
                  <span className="relative">
                    <span className="text-primary">Quality Products</span>
                    <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                      <path d="M2 10C50 4 150 2 298 10" stroke="url(#gradient)" strokeWidth="4" strokeLinecap="round"/>
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#10B981" stopOpacity="0.8"/>
                          <stop offset="100%" stopColor="#10B981" stopOpacity="0.2"/>
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                </h1>
                
                {/* Description */}
                <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Soreti&apos;s loan origination platform connects you with Ethiopia&apos;s leading banks. Fast approvals, competitive rates, and a seamless experience from application to disbursement.
                </p>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                  <Button 
                    size="lg" 
                    className="text-lg px-8 py-6 shadow-xl shadow-primary/25 group"
                    onClick={() => setShowRegister(true)}
                  >
                    Apply Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-lg px-8 py-6 gap-2"
                  >
                    <PlayCircle className="h-5 w-5" />
                    Watch Demo
                  </Button>
                </div>
                
                {/* Trust Indicators */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">Bank-Grade Security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">48h Approval</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">10K+ Customers</span>
                  </div>
                </div>
              </div>
              
              {/* Right Content - Stats Cards */}
              <div className="hidden lg:block relative">
                {/* Main Stats Card */}
                <div className="relative bg-white rounded-3xl shadow-2xl shadow-gray-200/50 p-8 border border-gray-100">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
                  
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Total Financed</div>
                      <div className="text-3xl font-bold text-gray-900">$50M+</div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="text-center p-4 bg-gray-50 rounded-2xl">
                      <div className="text-2xl font-bold text-gray-900">10K+</div>
                      <div className="text-xs text-gray-500">Loans</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-2xl">
                      <div className="text-2xl font-bold text-gray-900">98%</div>
                      <div className="text-xs text-gray-500">Approval</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-2xl">
                      <div className="text-2xl font-bold text-gray-900">15+</div>
                      <div className="text-xs text-gray-500">Banks</div>
                    </div>
                  </div>
                  
                  {/* Progress */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Monthly Goal</span>
                      <span className="font-semibold text-primary">85%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full w-[85%] bg-gradient-to-r from-primary to-emerald-500 rounded-full" />
                    </div>
                  </div>
                </div>
                
                {/* Floating Cards */}
                <div className="absolute -top-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Loan Approved!</div>
                    <div className="text-xs text-gray-500">Just now • ETB 250,000</div>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100 flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {['bg-violet-500', 'bg-blue-500', 'bg-emerald-500'].map((color, i) => (
                      <div key={i} className={`w-8 h-8 rounded-full ${color} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}>
                        {['AB', 'TH', 'DA'][i]}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">+2.5k</div>
                    <div className="text-xs text-gray-500">This week</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400">
            <span className="text-xs">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex items-start justify-center p-1">
              <div className="w-1.5 h-3 bg-gray-400 rounded-full animate-bounce" />
            </div>
          </div>
        </DynamicSection>

        {/* Mobile Apps Coming Soon Banner */}
        <DynamicSection sectionKey="mobile_apps" className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-8">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-100" />
          
          {/* Decorative Glows */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 relative">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
              {/* Animated Badge */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/50 rounded-full animate-ping" />
                  <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-emerald-500 rounded-full shadow-lg shadow-primary/30">
                    <Smartphone className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs text-primary font-semibold uppercase tracking-wider">Coming Soon</div>
                </div>
              </div>
              
              {/* Text Content */}
              <div className="text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                  Get Soreti on Your Mobile
                </h3>
                <p className="text-gray-400 text-sm md:text-base">
                  iOS & Android apps launching soon. Apply for loans on the go!
                </p>
              </div>
              
              {/* App Store Buttons */}
              <div className="flex items-center gap-3">
                {/* iOS Button */}
                <div className="group flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all duration-300 cursor-pointer">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 leading-none">Coming to</div>
                    <div className="text-sm font-semibold text-white">App Store</div>
                  </div>
                </div>
                
                {/* Android Button */}
                <div className="group flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all duration-300 cursor-pointer">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.523 15.341c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9m-11.046 0c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9m11.405-6.02l1.997-3.46a.416.416 0 00-.152-.567.416.416 0 00-.568.152L17.117 8.97c-1.451-.67-3.085-1.044-4.85-1.044-1.766 0-3.4.374-4.85 1.044L5.296 5.446a.416.416 0 00-.568-.152.416.416 0 00-.152.567l1.997 3.46C3.066 11.09 1 14.133 1 17.624h22c0-3.491-2.066-6.534-5.118-8.303M1 17.624h22v1.665H1v-1.665z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 leading-none">Coming to</div>
                    <div className="text-sm font-semibold text-white">Play Store</div>
                  </div>
                </div>
                
                {/* Notify Me Button */}
                <Button 
                  variant="outline"
                  className="hidden sm:flex bg-primary/20 border-primary/30 text-primary hover:bg-primary hover:text-white px-5 py-2.5 text-sm font-semibold"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Notify Me
                </Button>
              </div>
            </div>
          </div>
        </DynamicSection>

        {/* How It Works Section */}
        <DynamicSection sectionKey="how_it_works" id="how-it-works" className="py-14 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/30 to-white" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 relative">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
                  <PlayCircle className="h-4 w-4" />
                  Simple Process
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">How It Works</h2>
                <p className="text-gray-600 max-w-xl">
                  Get financed in four simple steps. Our streamlined process takes you from application to approval in record time.
                </p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-center px-6 py-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="text-2xl font-bold text-gray-900">~10</div>
                  <div className="text-sm text-gray-500">min to apply</div>
                </div>
                <div className="text-center px-6 py-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="text-2xl font-bold text-primary">48h</div>
                  <div className="text-sm text-gray-500">approval time</div>
                </div>
              </div>
            </div>

            {/* Steps Grid */}
            <div className="relative">
              {/* Connection Line - Desktop */}
              <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-200 via-blue-200 via-emerald-200 to-primary/30" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {steps.map((step, index) => (
                  <div key={step.title} className="relative group">
                    {/* Step Number - Floating */}
                    <div className="absolute -top-3 -left-3 z-20 w-8 h-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-sm font-bold text-gray-600 group-hover:border-primary group-hover:text-primary transition-colors shadow-sm">
                      {index + 1}
                    </div>
                    
                    <div className={`relative h-full rounded-2xl border ${step.borderColor} ${step.bgColor} p-6 group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300`}>
                      {/* Icon Container */}
                      <div className="mb-5">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <step.icon className="h-7 w-7 text-white" />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">{step.description}</p>
                      
                      {/* Time Badge */}
                      <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                        <Timer className="h-3.5 w-3.5" />
                        <span>{step.time}</span>
                      </div>
                      
                      {/* Arrow - Desktop */}
                      {index < steps.length - 1 && (
                        <div className="hidden lg:flex absolute -right-4 top-24 z-10 w-8 h-8 bg-white rounded-full border border-gray-200 items-center justify-center text-gray-400 group-hover:text-primary group-hover:border-primary transition-colors">
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      )}
                      
                      {/* Gradient Overlay on Hover */}
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="gap-2" onClick={() => setShowRegister(true)}>
                Start Your Application
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <PlayCircle className="h-4 w-4" />
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-gray-500 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>Bank-grade Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" />
                <span>Trusted by 10,000+</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </DynamicSection>

        {/* Partner Banks Section */}
        <DynamicSection sectionKey="banks" id="banks" className="py-14 overflow-hidden bg-gradient-to-b from-white via-gray-50/50 to-white">
          {/* Section Header */}
          <div className="container mx-auto px-4 mb-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
                  <Building2 className="h-4 w-4" />
                  Trusted Network
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  Partner Banks
                </h2>
                <p className="text-gray-600 max-w-xl">
                  We&apos;ve partnered with Ethiopia&apos;s leading financial institutions to bring you competitive rates and seamless financing.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">10+</div>
                  <div className="text-sm text-gray-500">Partner Banks</div>
                </div>
                <div className="w-px h-12 bg-gray-200"></div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">7</div>
                  <div className="text-sm text-gray-500">Active Now</div>
                </div>
              </div>
            </div>
          </div>

          {/* Auto-scrolling Carousel */}
          <div className="relative">
            {/* Gradient Overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
            
            {/* Scrolling Container */}
            <div className="flex gap-6 animate-scroll-carousel py-4">
              {/* Use dynamic banks or fallback to static if loading */}
              {((banks.length > 0 ? banks : partnerBanks) || partnerBanks).length === 0 ? (
                // Loading skeleton
                [...Array(6)].map((_, index) => (
                  <div key={`skeleton-${index}`} className="flex-shrink-0 w-72">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 h-40 animate-pulse">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gray-200"></div>
                        <div className="flex-1 pt-1">
                          <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
                          <div className="h-3 w-24 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // Duplicate for seamless loop
                [...(banks.length > 0 ? banks : partnerBanks), ...(banks.length > 0 ? banks : partnerBanks), ...(banks.length > 0 ? banks : partnerBanks)].map((bank, index) => {
                  const dynamicBank = bank as any
                  const logoUrl = dynamicBank.logoUrl
                  const initials = dynamicBank.code?.substring(0, 2) || dynamicBank.initials || 'BK'
                  const color = dynamicBank.color || '#059669'
                  const tagline = dynamicBank.tagline || dynamicBank.description || 'Partner Bank'
                  const status = dynamicBank.status || (dynamicBank.isActive ? 'available' : 'coming_soon')
                  const featured = dynamicBank.featured || dynamicBank.isPartner
                  
                  return (
                    <div
                      key={`${bank.id || bank.name}-${index}`}
                      className="flex-shrink-0 w-72 group"
                    >
                      <div className="relative bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 h-full">
                        {/* Status Badge */}
                        <div className="absolute top-4 right-4">
                          {status === 'coming_soon' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                              Coming Soon
                            </span>
                          ) : featured ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                              <Star className="w-3 h-3 fill-primary" />
                              Featured
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                              Available
                            </span>
                          )}
                        </div>

                        {/* Bank Logo/Initials */}
                        <div className="flex items-start gap-4 mb-4">
                          <div
                            className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg overflow-hidden"
                            style={{ 
                              background: logoUrl ? 'white' : `linear-gradient(135deg, ${color}, ${color}dd)`,
                              boxShadow: logoUrl ? '0 4px 12px -4px rgba(0,0,0,0.1)' : `0 8px 24px -8px ${color}40`
                            }}
                          >
                            {logoUrl ? (
                              <img 
                                src={logoUrl} 
                                alt={bank.name}
                                className="w-full h-full object-contain p-2"
                              />
                            ) : (
                              initials
                            )}
                          </div>
                          <div className="flex-1 pt-1">
                            <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                              {bank.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-0.5">{tagline}</p>
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100">
                          <div className="text-center">
                            <div className="text-sm font-semibold text-gray-900">
                              {dynamicBank.interestRate || 12}%
                            </div>
                            <div className="text-[10px] text-gray-500">Rate</div>
                          </div>
                          <div className="text-center border-x border-gray-100">
                            <div className="text-sm font-semibold text-gray-900">
                              {dynamicBank.maxTermMonths || 36} mo
                            </div>
                            <div className="text-[10px] text-gray-500">Max Term</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-semibold text-gray-900">
                              {dynamicBank.maxLoanAmount ? `${(dynamicBank.maxLoanAmount / 1000000).toFixed(1)}M` : '$1M'}
                            </div>
                            <div className="text-[10px] text-gray-500">Max Loan</div>
                          </div>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="container mx-auto px-4 mt-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button className="gap-2">
                View All Partners
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="gap-2">
                Become a Partner
              </Button>
            </div>
          </div>
        </DynamicSection>

        {/* Featured Products Section */}
        <DynamicSection sectionKey="products" id="products" className="py-14 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
                  <Sparkles className="h-4 w-4" />
                  Curated Selection
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Featured Products</h2>
                <p className="text-gray-600 max-w-xl">
                  Explore quality products available for financing through our platform with flexible payment plans.
                </p>
              </div>
              <Button variant="outline" className="gap-2 shrink-0">
                View All Products
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Product Categories */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {productCategories.map((category) => (
                <div 
                  key={category.name}
                  className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-5 hover:shadow-lg hover:border-gray-200 transition-all duration-300 cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <category.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.count} items</p>
                  <ArrowRight className="absolute top-5 right-5 h-5 w-5 text-gray-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              ))}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <div 
                  key={product.name} 
                  className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.badge === 'Popular' ? 'bg-violet-100 text-violet-700' :
                      product.badge === 'New' ? 'bg-emerald-100 text-emerald-700' :
                      product.badge === 'Best Value' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {product.badge}
                    </span>
                  </div>

                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Quick Action Button */}
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <Button className="w-full bg-white/95 text-gray-900 hover:bg-white gap-2" size="sm">
                        <CreditCard className="h-4 w-4" />
                        Quick Apply
                      </Button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="text-xs text-gray-500 mb-1">{product.category}</div>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                    <div className="flex items-end justify-between gap-2">
                      <div>
                        <div className="text-lg font-bold text-gray-900">{product.price}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Zap className="h-3 w-3 text-primary" />
                          {product.monthlyPayment}
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="shrink-0"
                        onClick={() => setShowRegister(true)}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Banner */}
            <div className="mt-10 relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-8 md:p-10">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Can&apos;t find what you&apos;re looking for?
                  </h3>
                  <p className="text-white/80 text-lg">
                    We partner with 100+ vendors. Tell us what you need and we&apos;ll make it happen.
                  </p>
                </div>
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 shrink-0"
                  onClick={() => setShowRegister(true)}
                >
                  Request a Product
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </DynamicSection>

        {/* Trust Signals Section */}
        <DynamicSection sectionKey="stats" className="py-14 bg-primary text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <CheckCircle className="h-10 w-10 mx-auto mb-4 opacity-80" />
                <div className="text-4xl md:text-5xl font-bold mb-2">10,000+</div>
                <div className="text-white/80 text-lg">Loans Approved</div>
              </div>
              <div className="text-center">
                <TrendingUp className="h-10 w-10 mx-auto mb-4 opacity-80" />
                <div className="text-4xl md:text-5xl font-bold mb-2">$50M+</div>
                <div className="text-white/80 text-lg">Financed</div>
              </div>
              <div className="text-center">
                <Building2 className="h-10 w-10 mx-auto mb-4 opacity-80" />
                <div className="text-4xl md:text-5xl font-bold mb-2">15+</div>
                <div className="text-white/80 text-lg">Partner Banks</div>
              </div>
              <div className="text-center">
                <Star className="h-10 w-10 mx-auto mb-4 opacity-80" />
                <div className="text-4xl md:text-5xl font-bold mb-2">98%</div>
                <div className="text-white/80 text-lg">Satisfaction</div>
              </div>
            </div>
          </div>
        </DynamicSection>

        {/* Testimonials Section */}
        <DynamicSection sectionKey="testimonials" id="testimonials" className="py-14 relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 relative">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
                  <MessageCircle className="h-4 w-4" />
                  Success Stories
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">What Our Customers Say</h2>
                <p className="text-gray-600 max-w-xl">
                  Real stories from satisfied customers who achieved their financial goals with Soreti.
                </p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">4.9/5</div>
                  <div className="text-sm text-gray-500">Average Rating</div>
                </div>
                <div className="w-px h-12 bg-gray-200"></div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">10K+</div>
                  <div className="text-sm text-gray-500">Happy Customers</div>
                </div>
              </div>
            </div>
          </div>

          {/* Auto-scrolling Carousel */}
          <div className="relative">
            {/* Gradient Overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 via-gray-50/80 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 via-gray-50/80 to-transparent z-10 pointer-events-none"></div>
            
            {/* Scrolling Container */}
            <div className="flex gap-6 animate-scroll-testimonials py-4">
              {/* Duplicate the testimonials for seamless loop */}
              {[...testimonials, ...testimonials, ...testimonials].map((testimonial, index) => (
                <div
                  key={`${testimonial.name}-${index}`}
                  className="flex-shrink-0 w-96 group"
                >
                  <div className="relative bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 h-full">
                    {/* Quote Icon */}
                    <div className="absolute -top-3 right-6">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center shadow-lg`}>
                        <Quote className="h-5 w-5 text-white" />
                      </div>
                    </div>

                    {/* Rating Stars */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    {/* Content */}
                    <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">&quot;{testimonial.content}&quot;</p>

                    {/* Loan Info */}
                    <div className="flex items-center gap-4 mb-5 p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold text-gray-900">{testimonial.loanAmount}</span>
                      </div>
                      <div className="w-px h-4 bg-gray-200" />
                      <span className="text-xs text-gray-500">{testimonial.loanType}</span>
                    </div>

                    {/* Author */}
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold shadow-lg`}>
                        {testimonial.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{testimonial.name}</span>
                          {testimonial.verified && (
                            <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                              <CheckCircle className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{testimonial.role}</div>
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-gray-300 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Badge */}
          <div className="container mx-auto px-4 relative mt-8">
            <div className="flex flex-wrap items-center justify-center gap-8">
              <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-full border border-gray-100 shadow-sm">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-900">4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Shield className="h-4 w-4 text-primary" />
                <span>Verified Reviews</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Globe className="h-4 w-4 text-primary" />
                <span>Trusted Nationwide</span>
              </div>
            </div>
          </div>
        </DynamicSection>

        {/* CTA Section */}
        <DynamicSection sectionKey="contact" className="py-14 relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-emerald-600" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-100" />
          
          {/* Decorative Elements */}
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/10 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/10 rounded-full" />
          
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto">
              {/* Content */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
                  <Rocket className="h-4 w-4" />
                  Start Your Journey Today
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                  Ready to Transform Your<br />
                  <span className="text-emerald-200">Financial Future?</span>
                </h2>
                <p className="text-white/80 text-lg max-w-2xl mx-auto">
                  Join thousands of satisfied customers who have achieved their dreams with Soreti&apos;s flexible financing solutions.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg font-semibold shadow-xl gap-2 group"
                  onClick={() => setShowRegister(true)}
                >
                  Get Started Now
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg" 
                  className="bg-transparent border-2 border-white/40 text-white hover:bg-white/10 hover:border-white/60 px-8 py-6 text-lg gap-2"
                >
                  <Phone className="h-5 w-5" />
                  Talk to an Expert
                </Button>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Clock, text: 'Quick Approval' },
                  { icon: Shield, text: 'Secure Process' },
                  { icon: TrendingUp, text: 'Competitive Rates' },
                  { icon: Users, text: '24/7 Support' }
                ].map((item, i) => (
                  <div 
                    key={i}
                    className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-white text-sm font-medium">{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Trust Indicators */}
              <div className="mt-10 pt-8 border-t border-white/10">
                <div className="flex flex-wrap items-center justify-center gap-8 text-white/60 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>No hidden fees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Flexible repayment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Early payoff options</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DynamicSection>
      </main>

      {/* Footer */}
      <DynamicSection sectionKey="footer" id="contact" className="relative bg-gray-900 text-white mt-auto overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:48px_48px]" />
        
        <div className="container mx-auto px-4 py-16 relative">
          {/* Top Section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <span className="text-white font-bold text-2xl">S</span>
                </div>
                <div>
                  <span className="text-2xl font-bold text-white">Soreti</span>
                  <div className="text-xs text-gray-400">Loan Origination Platform</div>
                </div>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Connecting you with Ethiopia&apos;s trusted financial institutions to achieve your goals through accessible financing solutions.
              </p>
              
              {/* Social Links */}
              <div className="flex gap-3">
                {[
                  { icon: Facebook, href: '#' },
                  { icon: Twitter, href: '#' },
                  { icon: Linkedin, href: '#' },
                  { icon: Instagram, href: '#' }
                ].map((social, i) => (
                  <a 
                    key={i}
                    href={social.href} 
                    className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-xl flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                Quick Links
              </h3>
              <ul className="space-y-4">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2 group">
                      <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Services */}
            <div>
              <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                Services
              </h3>
              <ul className="space-y-4 text-gray-400">
                {footerLinks.services.map((service) => (
                  <li key={service.name}>
                    <a href={service.href} className="flex items-center gap-2 group cursor-pointer hover:text-primary transition-colors">
                      <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      {service.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Contact & Newsletter */}
            <div>
              <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                Get in Touch
              </h3>
              
              {/* Contact Info */}
              <div className="space-y-4 mb-6">
                <a href="tel:+251111234567" className="flex items-center gap-3 text-gray-400 hover:text-primary transition-colors group">
                  <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Call us</div>
                    <div>+251 11 123 4567</div>
                  </div>
                </a>
                <a href="mailto:info@soreti.com" className="flex items-center gap-3 text-gray-400 hover:text-primary transition-colors group">
                  <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Email us</div>
                    <div>info@soreti.com</div>
                  </div>
                </a>
                <div className="flex items-start gap-3 text-gray-400">
                  <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Visit us</div>
                    <div>Bole Road, Addis Ababa, Ethiopia</div>
                  </div>
                </div>
              </div>
              
              {/* Newsletter */}
              <div className="bg-gray-800/50 rounded-2xl p-4">
                <div className="text-sm text-white mb-3">Subscribe to updates</div>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Your email" 
                    className="flex-1 bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                  />
                  <button className="w-10 h-10 bg-primary hover:bg-primary/90 rounded-xl flex items-center justify-center transition-colors">
                    <Send className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-t border-b border-gray-800 mb-8">
            {[
              { value: '10,000+', label: 'Loans Approved', icon: CheckCircle },
              { value: '$50M+', label: 'Total Financed', icon: TrendingUp },
              { value: '15+', label: 'Partner Banks', icon: Building2 },
              { value: '98%', label: 'Satisfaction Rate', icon: Star }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
          
          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Soreti. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              {footerLinks.legal.slice(0, 3).map((link) => (
                <a key={link.name} href={link.href} className="hover:text-primary transition-colors">{link.name}</a>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Shield className="h-4 w-4 text-primary" />
              <span>Secured by Bank-Grade Encryption</span>
            </div>
          </div>
        </div>
      </DynamicSection>
    </div>
    </HomepageProvider>
  )
}

// Main export with Suspense boundary
export default function Page() {
  return (
    <Suspense fallback={<DashboardLoader />}>
      <MainPageContent />
    </Suspense>
  )
}
