'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import {
  Users, Building2, Package, FileText, TrendingUp, DollarSign,
  CheckCircle, Clock, ArrowUpRight, ArrowDownRight, Activity,
  CreditCard, TrendingDown, BarChart3, Calendar,
  RefreshCw, Download, ChevronRight, AlertCircle, Sparkles,
  Shield, Zap, Target, PieChartIcon, ArrowRight, LucideIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminStats {
  role: string
  users: {
    total: number
    active: number
    newThisMonth: number
  }
  banks: {
    total: number
    active: number
  }
  products: {
    total: number
  }
  loans: {
    total: number
    byStatus: Record<string, number>
    totalDisbursed: number
    recent: any[]
  }
}

interface ChartData {
  monthlyApplications: { month: string; applications: number; approved: number; rejected: number }[]
  loanStatusData: { name: string; value: number; color: string }[]
  bankPerformance: { name: string; loans: number; amount: number }[]
  userGrowth: { month: string; users: number; customers: number; bankers: number }[]
  recentActivity: { id: string; type: string; description: string; timestamp: string; user?: string }[]
}

const COLORS = ['#10B981', '#14B8A6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16']

const statusColors: Record<string, string> = {
  DRAFT: '#6B7280',
  SUBMITTED: '#14B8A6',
  UNDER_REVIEW: '#F59E0B',
  ADDITIONAL_INFO_REQUIRED: '#F97316',
  APPROVED: '#10B981',
  REJECTED: '#EF4444',
  DISBURSED: '#8B5CF6',
  REPAID: '#06B6D4',
  DEFAULTED: '#DC2626',
  CANCELLED: '#9CA3AF',
}

const statusLabels: Record<string, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  ADDITIONAL_INFO_REQUIRED: 'Additional Info',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  DISBURSED: 'Disbursed',
  REPAID: 'Repaid',
  DEFAULTED: 'Defaulted',
  CANCELLED: 'Cancelled',
}

export function AdvancedAdminOverview() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('6months')

  useEffect(() => {
    fetchDashboardData()
  }, [timeRange])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      const [statsRes, analyticsRes] = await Promise.all([
        fetch('/api/stats'),
        fetch(`/api/admin/analytics?range=${timeRange}`)
      ])

      if (statsRes.ok) {
        const data = await statsRes.json()
        setStats(data.data || data)
      }

      if (analyticsRes.ok) {
        const data = await analyticsRes.json()
        setChartData(data.data || data)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <OverviewSkeleton />
  }

  const loanStatusData = stats?.loans?.byStatus
    ? Object.entries(stats.loans.byStatus).map(([status, count], index) => ({
        name: statusLabels[status] || status,
        value: count,
        color: statusColors[status] || COLORS[index % COLORS.length]
      }))
    : []

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Enterprise Dashboard</h1>
          </div>
          <p className="text-gray-500 mt-1 ml-10">AI-powered insights for your platform</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
            <Shield className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-medium text-emerald-700">Real-time Sync</span>
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <Button variant="outline" size="sm" onClick={fetchDashboardData} className="border-gray-200 hover:bg-gray-50">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Users"
          value={stats?.users?.total || 0}
          change={stats?.users?.newThisMonth || 0}
          changeLabel="new this month"
          trend="up"
          icon={Users}
          gradient="from-violet-500 to-purple-600"
          description="Active platform users"
        />
        <MetricCard
          title="Total Loans"
          value={stats?.loans?.total || 0}
          change={stats?.loans?.byStatus?.APPROVED || 0}
          changeLabel="approved"
          trend="up"
          icon={FileText}
          gradient="from-emerald-500 to-teal-600"
          description="Loan applications"
        />
        <MetricCard
          title="Partner Banks"
          value={stats?.banks?.total || 0}
          change={stats?.banks?.active || 0}
          changeLabel="active"
          trend="neutral"
          icon={Building2}
          gradient="from-amber-500 to-orange-600"
          description="Connected institutions"
        />
        <MetricCard
          title="Total Disbursed"
          value={formatCurrency(stats?.loans?.totalDisbursed || 0)}
          change={12.5}
          changeLabel="% growth"
          trend="up"
          icon={DollarSign}
          gradient="from-cyan-500 to-blue-600"
          isCurrency
          description="Total funds disbursed"
        />
      </div>

      {/* AI Insights Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 border border-white/10">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl" />
        </div>
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/30">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">AI-Powered Insights</h3>
              <p className="text-sm text-white/60 max-w-md">
                Your approval rate is 23% higher than last month. Consider increasing marketing spend in Q4.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              View Analysis
            </Button>
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Loan Applications Over Time */}
        <Card className="lg:col-span-2 border-0 shadow-lg shadow-gray-200/50 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-full blur-3xl" />
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                  Loan Applications Trend
                </CardTitle>
                <CardDescription>Monthly application volume and approval rates</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  Live
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData?.monthlyApplications || []}>
                  <defs>
                    <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="applications"
                    stroke="#10B981"
                    fillOpacity={1}
                    fill="url(#colorApplications)"
                    strokeWidth={2}
                    name="Applications"
                  />
                  <Area
                    type="monotone"
                    dataKey="approved"
                    stroke="#14B8A6"
                    fillOpacity={1}
                    fill="url(#colorApproved)"
                    strokeWidth={2}
                    name="Approved"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Loan Status Distribution */}
        <Card className="border-0 shadow-lg shadow-gray-200/50 overflow-hidden">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-violet-500" />
              Status Distribution
            </CardTitle>
            <CardDescription>Current portfolio breakdown</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={loanStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {loanStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {loanStatusData.slice(0, 4).map((item, index) => (
                <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-gray-600 truncate">{item.name}</span>
                  <span className="text-xs font-medium ml-auto">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bank Performance */}
        <Card className="border-0 shadow-lg shadow-gray-200/50 overflow-hidden">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-amber-500" />
              Bank Performance
            </CardTitle>
            <CardDescription>Loan volume by partner bank</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData?.bankPerformance || []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis type="number" stroke="#6B7280" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="#6B7280" fontSize={11} width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value: any, name: string) => [
                      name === 'amount' ? formatCurrency(value) : value,
                      name === 'amount' ? 'Amount' : 'Loans'
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="loans" fill="#10B981" name="Loans" radius={[0, 6, 6, 0]} />
                  <Bar dataKey="amount" fill="#14B8A6" name="Amount" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* User Growth */}
        <Card className="border-0 shadow-lg shadow-gray-200/50 overflow-hidden">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-cyan-500" />
              User Growth
            </CardTitle>
            <CardDescription>New user registrations over time</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData?.userGrowth || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    dot={{ fill: '#8B5CF6', strokeWidth: 0, r: 4 }}
                    name="Total Users"
                  />
                  <Line
                    type="monotone"
                    dataKey="customers"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 0, r: 4 }}
                    name="Customers"
                  />
                  <Line
                    type="monotone"
                    dataKey="bankers"
                    stroke="#F59E0B"
                    strokeWidth={3}
                    dot={{ fill: '#F59E0B', strokeWidth: 0, r: 4 }}
                    name="Bankers"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-0 shadow-lg shadow-gray-200/50 overflow-hidden">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-emerald-500" />
                Recent Activity
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {(chartData?.recentActivity || []).slice(0, 5).map((activity, index) => (
                <div key={activity.id || index} className="flex items-start gap-4 p-4 hover:bg-gray-50/50 transition-colors">
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                    activity.type === 'LOAN_APPROVED' ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white' :
                    activity.type === 'LOAN_SUBMITTED' ? 'bg-gradient-to-br from-violet-400 to-purple-500 text-white' :
                    activity.type === 'USER_REGISTERED' ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' :
                    'bg-gradient-to-br from-gray-400 to-gray-500 text-white'
                  )}>
                    {activity.type === 'LOAN_APPROVED' ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : activity.type === 'LOAN_SUBMITTED' ? (
                      <FileText className="h-5 w-5" />
                    ) : activity.type === 'USER_REGISTERED' ? (
                      <Users className="h-5 w-5" />
                    ) : (
                      <Activity className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {activity.user && <span className="font-medium text-gray-700">{activity.user}</span>}
                      {activity.user && ' • '}
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="secondary" className="shrink-0 bg-gray-100 text-gray-600 border-0">
                    {activity.type.replace(/_/g, ' ').toLowerCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Platform Health */}
        <Card className="border-0 shadow-lg shadow-gray-200/50 overflow-hidden">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-emerald-500" />
              Platform Health
            </CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            <ProgressBar
              label="Approval Rate"
              value={stats?.loans?.total ? Math.round(((stats.loans.byStatus?.APPROVED || 0) / stats.loans.total) * 100) : 0}
              color="emerald"
            />
            <ProgressBar
              label="Active Users"
              value={stats?.users?.total ? Math.round((stats.users.active / stats.users.total) * 100) : 0}
              color="violet"
            />
            <ProgressBar
              label="Partner Banks Active"
              value={stats?.banks?.total ? Math.round((stats.banks.active / stats.banks.total) * 100) : 0}
              color="amber"
            />

            <div className="pt-4 border-t border-gray-100 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-100">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <span className="text-sm text-amber-800">Pending Reviews</span>
                </div>
                <Badge className="bg-amber-500 text-white border-0">
                  {(stats?.loans?.byStatus?.SUBMITTED || 0) + (stats?.loans?.byStatus?.UNDER_REVIEW || 0)}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Draft Applications</span>
                </div>
                <Badge variant="secondary" className="bg-gray-200 text-gray-700 border-0">
                  {stats?.loans?.byStatus?.DRAFT || 0}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm text-emerald-800">Disbursed This Month</span>
                </div>
                <Badge className="bg-emerald-500 text-white border-0">
                  {stats?.loans?.byStatus?.DISBURSED || 0}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Metric Card Component
function MetricCard({
  title,
  value,
  change,
  changeLabel,
  trend,
  icon: Icon,
  gradient,
  isCurrency,
  description
}: {
  title: string
  value: string | number
  change: number
  changeLabel: string
  trend: 'up' | 'down' | 'neutral'
  icon: LucideIcon
  gradient: string
  isCurrency?: boolean
  description: string
}) {
  return (
    <Card className="relative overflow-hidden border-0 shadow-lg shadow-gray-200/50 group hover:shadow-xl transition-shadow duration-300">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-20 transition-opacity" style={{ background: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }} />
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            <div className="flex items-center gap-1.5">
              {trend === 'up' && (
                <span className="flex items-center gap-1 text-emerald-600">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  <span className="text-sm font-medium">{change}{!isCurrency && typeof change === 'number' ? '' : ''}</span>
                </span>
              )}
              {trend === 'down' && (
                <span className="flex items-center gap-1 text-red-600">
                  <ArrowDownRight className="h-3.5 w-3.5" />
                  <span className="text-sm font-medium">{change}</span>
                </span>
              )}
              {trend === 'neutral' && (
                <span className="text-sm font-medium text-gray-600">{change}</span>
              )}
              <span className="text-xs text-gray-500">{changeLabel}</span>
            </div>
            <p className="text-[11px] text-gray-400">{description}</p>
          </div>
          <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg', gradient)}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Progress Bar Component
function ProgressBar({ label, value, color }: { label: string; value: number; color: 'emerald' | 'violet' | 'amber' }) {
  const colors = {
    emerald: { bg: 'bg-emerald-100', fill: 'bg-gradient-to-r from-emerald-400 to-teal-500', text: 'text-emerald-600' },
    violet: { bg: 'bg-violet-100', fill: 'bg-gradient-to-r from-violet-400 to-purple-500', text: 'text-violet-600' },
    amber: { bg: 'bg-amber-100', fill: 'bg-gradient-to-r from-amber-400 to-orange-500', text: 'text-amber-600' },
  }
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">{label}</span>
        <span className={cn('text-sm font-semibold', colors[color].text)}>{value}%</span>
      </div>
      <div className={cn('h-2 rounded-full overflow-hidden', colors[color].bg)}>
        <div 
          className={cn('h-full rounded-full transition-all duration-500', colors[color].fill)} 
          style={{ width: `${value}%` }} 
        />
      </div>
    </div>
  )
}

// Skeleton Loader
function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <Skeleton className="h-24 w-full rounded-xl" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardContent className="pt-6">
            <Skeleton className="h-[350px] w-full rounded-xl" />
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <Skeleton className="h-[350px] w-full rounded-xl" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
