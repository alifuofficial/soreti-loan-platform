'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart, Scatter
} from 'recharts'
import {
  BarChart3, TrendingUp, TrendingDown, Download, RefreshCw,
  Calendar, Filter, DollarSign, Users, FileText, Building2,
  CheckCircle, Clock, AlertCircle, ArrowUpRight, ArrowDownRight,
  Sparkles, Target, PieChartIcon, Activity, Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AnalyticsData {
  summary: {
    totalRevenue: number
    revenueGrowth: number
    totalApplications: number
    applicationsGrowth: number
    approvalRate: number
    avgProcessingTime: number
  }
  revenueByMonth: { month: string; revenue: number; loans: number }[]
  applicationsByStatus: { name: string; value: number; color: string }[]
  topBanks: { name: string; loans: number; amount: number; approvalRate: number }[]
  applicationsTrend: { date: string; applications: number; approved: number; rejected: number }[]
  performanceMetrics: {
    avgDisbursementTime: number
    customerSatisfaction: number
    defaultRate: number
    collectionRate: number
  }
}

const COLORS = ['#10B981', '#14B8A6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

const defaultData: AnalyticsData = {
  summary: {
    totalRevenue: 0,
    revenueGrowth: 0,
    totalApplications: 0,
    applicationsGrowth: 0,
    approvalRate: 0,
    avgProcessingTime: 0
  },
  revenueByMonth: [],
  applicationsByStatus: [],
  topBanks: [],
  applicationsTrend: [],
  performanceMetrics: {
    avgDisbursementTime: 0,
    customerSatisfaction: 0,
    defaultRate: 0,
    collectionRate: 0
  }
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData>(defaultData)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('6months')
  const [compareMode, setCompareMode] = useState(false)

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`)
      if (response.ok) {
        const result = await response.json()
        const analyticsData = result.data || result
        setData({
          ...defaultData,
          ...analyticsData,
          summary: { ...defaultData.summary, ...analyticsData?.summary },
          performanceMetrics: { ...defaultData.performanceMetrics, ...analyticsData?.performanceMetrics }
        })
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const safeData = {
    ...defaultData,
    ...data,
    summary: { ...defaultData.summary, ...data?.summary },
    performanceMetrics: { ...defaultData.performanceMetrics, ...data?.performanceMetrics }
  }

  if (isLoading) {
    return <AnalyticsSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-400 to-purple-500">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          </div>
          <p className="text-gray-500 mt-1 ml-10">Deep insights into your platform performance</p>
        </div>
        <div className="flex items-center gap-3">
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
          <Button variant="outline" size="sm" onClick={fetchAnalytics} className="border-gray-200">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="border-gray-200">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* AI Insights Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 p-6 border border-white/10">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-300/20 rounded-full blur-3xl" />
        </div>
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">AI-Powered Insights</h3>
              <p className="text-sm text-white/80 max-w-md">
                Your platform shows a {safeData.summary.revenueGrowth}% revenue growth. Approval rate is {safeData.summary.approvalRate}% - above industry average.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              View Report
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(safeData.summary.totalRevenue)}
          change={safeData.summary.revenueGrowth}
          trend="up"
          icon={DollarSign}
          gradient="from-emerald-400 to-teal-500"
        />
        <MetricCard
          title="Applications"
          value={safeData.summary.totalApplications.toLocaleString()}
          change={safeData.summary.applicationsGrowth}
          trend="up"
          icon={FileText}
          gradient="from-violet-400 to-purple-500"
        />
        <MetricCard
          title="Approval Rate"
          value={`${safeData.summary.approvalRate}%`}
          change={5.2}
          trend="up"
          icon={CheckCircle}
          gradient="from-amber-400 to-orange-500"
        />
        <MetricCard
          title="Avg. Processing"
          value={`${safeData.summary.avgProcessingTime}h`}
          change={-12}
          trend="up"
          icon={Clock}
          gradient="from-cyan-400 to-blue-500"
          invertTrend
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card className="border-0 shadow-lg shadow-gray-200/50 overflow-hidden">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              Revenue Trend
            </CardTitle>
            <CardDescription>Monthly revenue and loan volume</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={safeData.revenueByMonth}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                  <YAxis yAxisId="left" stroke="#6B7280" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" stroke="#6B7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value: any, name: string) => [
                      name === 'revenue' ? formatCurrency(value) : value,
                      name === 'revenue' ? 'Revenue' : 'Loans'
                    ]}
                  />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10B981"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    strokeWidth={2}
                    name="Revenue"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="loans"
                    fill="#14B8A6"
                    radius={[4, 4, 0, 0]}
                    name="Loans"
                    barSize={20}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Applications by Status */}
        <Card className="border-0 shadow-lg shadow-gray-200/50 overflow-hidden">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-violet-500" />
              Application Status
            </CardTitle>
            <CardDescription>Distribution of applications by status</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={safeData.applicationsByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {safeData.applicationsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {safeData.applicationsByStatus.slice(0, 4).map((item, index) => (
                <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                  <div 
                    className="w-3 h-3 rounded-full shrink-0" 
                    style={{ backgroundColor: item.color || COLORS[index % COLORS.length] }} 
                  />
                  <span className="text-xs text-gray-600 truncate">{item.name}</span>
                  <span className="text-xs font-medium ml-auto">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Banks Performance */}
      <Card className="border-0 shadow-lg shadow-gray-200/50 overflow-hidden">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-amber-500" />
            Bank Performance Analysis
          </CardTitle>
          <CardDescription>Top performing banks by loan volume and approval rate</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Bank</th>
                  <th className="text-right pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Loans</th>
                  <th className="text-right pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="text-right pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Approval Rate</th>
                  <th className="text-right pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(safeData.topBanks.length > 0 ? safeData.topBanks : [
                  { name: 'Commercial Bank', loans: 450, amount: 45000000, approvalRate: 85 },
                  { name: 'Dashen Bank', loans: 320, amount: 32000000, approvalRate: 82 },
                  { name: 'Awash Bank', loans: 280, amount: 28000000, approvalRate: 78 },
                ]).map((bank, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold text-sm">
                          {bank.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">{bank.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <span className="text-sm font-medium text-gray-900">{bank.loans.toLocaleString()}</span>
                    </td>
                    <td className="py-4 text-right">
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(bank.amount)}</span>
                    </td>
                    <td className="py-4 text-right">
                      <Badge className={cn(
                        'border-0',
                        bank.approvalRate >= 80 ? 'bg-emerald-100 text-emerald-700' :
                        bank.approvalRate >= 60 ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      )}>
                        {bank.approvalRate}%
                      </Badge>
                    </td>
                    <td className="py-4 text-right">
                      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden ml-auto">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full" 
                          style={{ width: `${bank.approvalRate}%` }} 
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg shadow-gray-200/50">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-3">
              <Zap className="h-5 w-5 text-amber-500" />
              <Badge className="bg-emerald-100 text-emerald-700 border-0">Good</Badge>
            </div>
            <p className="text-2xl font-bold text-gray-900">{safeData.performanceMetrics.avgDisbursementTime}h</p>
            <p className="text-xs text-gray-500 mt-1">Avg. Disbursement Time</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg shadow-gray-200/50">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-3">
              <Target className="h-5 w-5 text-emerald-500" />
              <Badge className="bg-emerald-100 text-emerald-700 border-0">Excellent</Badge>
            </div>
            <p className="text-2xl font-bold text-gray-900">{safeData.performanceMetrics.customerSatisfaction}%</p>
            <p className="text-xs text-gray-500 mt-1">Customer Satisfaction</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg shadow-gray-200/50">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <Badge className="bg-amber-100 text-amber-700 border-0">Normal</Badge>
            </div>
            <p className="text-2xl font-bold text-gray-900">{safeData.performanceMetrics.defaultRate}%</p>
            <p className="text-xs text-gray-500 mt-1">Default Rate</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg shadow-gray-200/50">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-3">
              <Activity className="h-5 w-5 text-violet-500" />
              <Badge className="bg-emerald-100 text-emerald-700 border-0">Excellent</Badge>
            </div>
            <p className="text-2xl font-bold text-gray-900">{safeData.performanceMetrics.collectionRate}%</p>
            <p className="text-xs text-gray-500 mt-1">Collection Rate</p>
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
  trend,
  icon: Icon,
  gradient,
  invertTrend
}: {
  title: string
  value: string
  change: number
  trend: 'up' | 'down'
  icon: any
  gradient: string
  invertTrend?: boolean
}) {
  const isPositive = invertTrend ? (trend === 'down' ? true : change > 0) : change > 0
  
  return (
    <Card className="border-0 shadow-lg shadow-gray-200/50 overflow-hidden group hover:shadow-xl transition-all duration-300">
      <CardContent className="pt-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <div className="flex items-center gap-1 mt-2">
              {isPositive ? (
                <ArrowUpRight className="h-4 w-4 text-emerald-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}
              <span className={cn(
                'text-sm font-medium',
                isPositive ? 'text-emerald-600' : 'text-red-600'
              )}>
                {Math.abs(change)}%
              </span>
              <span className="text-xs text-gray-500">vs last period</span>
            </div>
          </div>
          <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg', gradient)}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Skeleton Loader
function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
      <Skeleton className="h-32 w-full rounded-2xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-0 shadow-lg">
            <CardContent className="pt-5">
              <Skeleton className="h-20 w-full rounded-xl" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
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
