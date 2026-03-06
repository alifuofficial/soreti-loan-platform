'use client'

import { useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import {
  LayoutDashboard,
  FileText,
  List,
  User,
  Menu,
  LogOut,
  Bell,
  ChevronLeft,
  ChevronRight,
  Shield,
  Sparkles,
  Lock,
  Activity,
  Zap,
  LucideIcon,
  Search,
  HelpCircle,
  PieChart,
  CreditCard,
  Wallet,
  ChevronDown,
  Settings
} from 'lucide-react'
import { useDashboardStore, ViewType } from '@/lib/store/dashboard-store'
import { cn } from '@/lib/utils'

interface CustomerLayoutProps {
  children: ReactNode
  user: {
    id: string
    fullName: string
    email: string
    role: string
  }
}

interface NavItem {
  id: ViewType
  label: string
  icon: LucideIcon
  description: string
  badge?: number
}

interface NavCategory {
  id: string
  label: string
  icon: LucideIcon
  items: NavItem[]
  collapsed?: boolean
}

const navigationCategories: NavCategory[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: PieChart,
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Your overview' },
    ]
  },
  {
    id: 'loans',
    label: 'Loans',
    icon: Wallet,
    items: [
      { id: 'apply', label: 'Apply for Loan', icon: FileText, description: 'Start new application' },
      { id: 'loans', label: 'My Loans', icon: List, description: 'Track applications' },
    ]
  },
  {
    id: 'account',
    label: 'Account',
    icon: Settings,
    items: [
      { id: 'profile', label: 'Profile', icon: User, description: 'Manage account' },
    ]
  }
]

interface NavCategoryProps {
  category: NavCategory
  currentView: ViewType
  onNavigate: (view: ViewType) => void
  onClose?: () => void
  collapsed?: boolean
  isSidebarCollapsed?: boolean
  onToggleCategory?: (categoryId: string) => void
}

function NavCategory({ 
  category, 
  currentView, 
  onNavigate, 
  onClose, 
  collapsed,
  isSidebarCollapsed,
  onToggleCategory
}: NavCategoryProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const isCategoryActive = category.items.some(item => item.id === currentView)

  const handleToggle = () => {
    if (!isSidebarCollapsed) {
      setIsExpanded(!isExpanded)
      onToggleCategory?.(category.id)
    }
  }

  return (
    <div className="mb-2">
      {/* Category Header */}
      {!collapsed && (
        <button
          onClick={handleToggle}
          className={cn(
            'w-full flex items-center gap-2 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider',
            'text-white/50 hover:text-white/70 transition-colors'
          )}
        >
          <category.icon className="h-3.5 w-3.5" />
          <span className="flex-1 text-left">{category.label}</span>
          <ChevronDown className={cn(
            'h-3.5 w-3.5 transition-transform duration-200',
            !isExpanded && '-rotate-90'
          )} />
        </button>
      )}

      {/* Category Items */}
      {isExpanded && (
        <nav className="flex flex-col gap-1 px-2">
          {category.items.map((item) => {
            const isActive = currentView === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id)
                  onClose?.()
                }}
                className={cn(
                  'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200',
                  'hover:bg-white/10',
                  isActive && 'bg-white/15 shadow-lg shadow-black/5'
                )}
                title={collapsed ? item.label : undefined}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-r-full" />
                )}
                
                <div className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-200',
                  isActive 
                    ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-500/30' 
                    : 'bg-white/10 text-white/70 group-hover:bg-white/15 group-hover:text-white'
                )}>
                  <item.icon className="h-[18px] w-[18px]" />
                </div>
                
                {!collapsed && (
                  <>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'text-sm font-medium truncate',
                          isActive ? 'text-white' : 'text-white/80 group-hover:text-white'
                        )}>
                          {item.label}
                        </span>
                        {item.badge && (
                          <Badge className="h-5 px-1.5 text-[10px] bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <span className="text-[11px] text-white/40 group-hover:text-white/50 truncate block">
                        {item.description}
                      </span>
                    </div>
                    <ChevronRight className={cn(
                      'h-4 w-4 text-white/30 transition-transform duration-200',
                      isActive && 'translate-x-0.5 text-white/60'
                    )} />
                  </>
                )}
              </button>
            )
          })}
        </nav>
      )}
    </div>
  )
}

export function CustomerLayout({ children, user }: CustomerLayoutProps) {
  const { currentView, setView, sidebarOpen, setSidebarOpen, setSelectedLoanId } = useDashboardStore()
  const router = useRouter()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleNavigation = (view: ViewType) => {
    setView(view)
    setSelectedLoanId(null)
    router.replace(`/?view=${view}`, { scroll: false })
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  const userInitials = user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
  const currentLabel = navigationCategories
    .flatMap(cat => cat.items)
    .find(item => item.id === currentView)?.label || 'Dashboard'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100">
      {/* Desktop Sidebar */}
      <aside className={cn(
        'fixed left-0 top-0 z-40 hidden h-screen border-r border-white/20 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 transition-all duration-300 ease-in-out lg:block',
        sidebarCollapsed ? 'w-20' : 'w-72'
      )}>
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        </div>

        <div className="relative flex h-full flex-col">
          {/* Logo Header */}
          <div className={cn(
            'flex h-16 items-center border-b border-white/10 px-4',
            sidebarCollapsed ? 'justify-center' : 'gap-3 px-5'
          )}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl blur-lg opacity-50" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/30">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
            </div>
            {!sidebarCollapsed && (
              <div>
                <span className="text-xl font-bold text-white tracking-tight">Soreti</span>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                  <Zap className="h-3 w-3" />
                  <span>Customer Portal</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats Badge */}
          {!sidebarCollapsed && (
            <div className="mx-4 mt-4 mb-2">
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-white/10 p-3">
                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/20 rounded-full blur-xl" />
                <div className="relative flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500">
                    <CreditCard className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-white">Quick Loans</div>
                    <div className="text-[10px] text-white/60">Fast & Easy</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Status */}
          {!sidebarCollapsed && (
            <div className="mx-4 mb-2">
              <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20">
                  <Lock className="h-3 w-3 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <div className="text-[11px] text-emerald-400 font-medium">Secure Session</div>
                </div>
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </div>
          )}

          {/* Scrollable Navigation */}
          <ScrollArea className="flex-1 px-1 py-2">
            {navigationCategories.map((category) => (
              <NavCategory
                key={category.id}
                category={category}
                currentView={currentView}
                onNavigate={handleNavigation}
                collapsed={sidebarCollapsed}
                isSidebarCollapsed={sidebarCollapsed}
              />
            ))}
          </ScrollArea>

          {/* Collapse Toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="mx-3 mb-2 flex items-center justify-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span className="text-xs">Collapse</span>
              </>
            )}
          </button>

          {/* User Profile */}
          <div className="border-t border-white/10 p-4">
            {!sidebarCollapsed ? (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10 border-2 border-emerald-500/30">
                    <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white text-sm font-medium">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user.fullName}</p>
                  <p className="text-[11px] text-white/50 truncate">{user.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white/50 hover:text-red-400 hover:bg-red-500/10"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Avatar className="h-10 w-10 border-2 border-emerald-500/30">
                  <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white text-sm font-medium">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white/50 hover:text-red-400 hover:bg-red-500/10"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200/50 bg-white/80 backdrop-blur-xl px-4 lg:hidden">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0 hover:bg-gray-100">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-white/10">
            <div className="flex h-full flex-col">
              <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl blur-lg opacity-50" />
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/30">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <span className="text-xl font-bold text-white tracking-tight">Soreti</span>
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                    <Shield className="h-3 w-3" />
                    <span>Customer Portal</span>
                  </div>
                </div>
              </div>
              <ScrollArea className="flex-1 py-2">
                {navigationCategories.map((category) => (
                  <NavCategory
                    key={category.id}
                    category={category}
                    currentView={currentView}
                    onNavigate={handleNavigation}
                    onClose={() => setSidebarOpen(false)}
                  />
                ))}
              </ScrollArea>
              <div className="border-t border-white/10 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-10 w-10 border-2 border-emerald-500/30">
                    <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white text-sm">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{user.fullName}</p>
                    <p className="text-xs text-white/50 truncate">{user.email}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-white/60 hover:text-red-400 hover:bg-red-500/10"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-gray-900">Soreti</span>
          <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 text-[10px] ml-1">Customer</Badge>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full text-[10px] text-white flex items-center justify-center font-medium">
              2
            </span>
          </Button>
          <Avatar className="h-8 w-8 border-2 border-emerald-500/30">
            <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white text-sm">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Content */}
      <main className={cn(
        'transition-all duration-300 ease-in-out',
        sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
      )}>
        {/* Top Bar */}
        <header className="hidden lg:flex h-16 items-center justify-between border-b border-gray-200/50 bg-white/80 backdrop-blur-xl px-6 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{currentLabel}</h1>
              <p className="text-xs text-gray-500">Welcome back, {user.fullName.split(' ')[0]}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="h-9 w-64 rounded-lg border border-gray-200 bg-gray-50/50 pl-9 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-colors"
              />
            </div>
            
            {/* Help */}
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <HelpCircle className="h-5 w-5 text-gray-600" />
            </Button>
            
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full text-[10px] text-white flex items-center justify-center font-medium">
                2
              </span>
            </Button>
            
            <div className="h-6 w-px bg-gray-200" />
            
            {/* User */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role.toLowerCase()}</p>
              </div>
              <Avatar className="h-9 w-9 border-2 border-emerald-500/30">
                <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white text-sm">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
