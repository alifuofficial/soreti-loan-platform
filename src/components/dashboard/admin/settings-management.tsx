'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Settings, Shield, Bell, Key, Globe, CreditCard,
  Save, RefreshCw, AlertCircle, CheckCircle, Lock,
  Mail, Phone, Clock, DollarSign, Percent,
  Building2, Users, FileText, Sparkles, Zap, Server,
  Database, Webhook, ExternalLink, Search, Code,
  Image, FileCode, Link2, Tag, Languages, Eye,
  Monitor, Palette, Layout, LucideIcon, ChevronRight,
  DatabaseBackup, HardDrive, CloudUpload, FileCog,
  User, Camera, Trash2, EyeOff, Github, Linkedin,
  Facebook, Chrome, Twitter, Smartphone, Activity
} from 'lucide-react'
import { cn } from '@/lib/utils'

type SettingsSection = 
  | 'profile' 
  | 'general' 
  | 'seo' 
  | 'appearance' 
  | 'loan' 
  | 'notifications' 
  | 'security' 
  | 'socialLogin'
  | 'integrations'
  | 'database'

interface SettingsNavItem {
  id: SettingsSection
  label: string
  icon: LucideIcon
  description: string
  category: 'account' | 'platform' | 'content' | 'system'
}

const settingsNav: SettingsNavItem[] = [
  // Account Category
  { id: 'profile', label: 'Profile', icon: User, description: 'Account & password', category: 'account' },
  
  // Platform Category
  { id: 'general', label: 'General', icon: Settings, description: 'Basic platform settings', category: 'platform' },
  { id: 'appearance', label: 'Appearance', icon: Palette, description: 'Theme & branding', category: 'platform' },
  { id: 'loan', label: 'Loan Settings', icon: CreditCard, description: 'Loan parameters & workflow', category: 'platform' },
  
  // Content Category
  { id: 'seo', label: 'SEO & Meta', icon: Search, description: 'Search engine optimization', category: 'content' },
  { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Email & SMS settings', category: 'content' },
  
  // System Category
  { id: 'security', label: 'Security', icon: Shield, description: 'Authentication & access', category: 'system' },
  { id: 'socialLogin', label: 'Social Login', icon: Key, description: 'OAuth providers', category: 'system' },
  { id: 'integrations', label: 'Integrations', icon: Webhook, description: 'API & third-party', category: 'system' },
  { id: 'database', label: 'Database', icon: Database, description: 'Backup & storage', category: 'system' },
]

export function SettingsManagement() {
  const [isSaving, setIsSaving] = useState(false)
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile')

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSettings />
      case 'general':
        return <GeneralSettings />
      case 'seo':
        return <SEOSettings />
      case 'appearance':
        return <AppearanceSettings />
      case 'loan':
        return <LoanSettings />
      case 'notifications':
        return <NotificationsSettings />
      case 'security':
        return <SecuritySettings />
      case 'socialLogin':
        return <SocialLoginSettings />
      case 'integrations':
        return <IntegrationsSettings />
      case 'database':
        return <DatabaseSettings />
      default:
        return <ProfileSettings />
    }
  }

  return (
    <div className="flex gap-6 min-h-[calc(100vh-12rem)]">
      {/* Settings Sidebar Navigation */}
      <div className="w-64 shrink-0 hidden lg:block">
        <Card className="border-0 shadow-lg shadow-gray-200/50 sticky top-6 overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-slate-800 to-slate-900">
            <div className="flex items-center gap-2 text-white">
              <Settings className="h-5 w-5" />
              <span className="font-semibold">Settings</span>
            </div>
            <p className="text-xs text-white/60 mt-1">Manage platform configuration</p>
          </div>
          <ScrollArea className="h-[calc(100vh-20rem)]">
            <div className="p-2">
              {['account', 'platform', 'content', 'system'].map((category) => {
                const items = settingsNav.filter(item => item.category === category)
                return (
                  <div key={category} className="mb-4">
                    <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      {category}
                    </div>
                    {items.map((item) => {
                      const isActive = activeSection === item.id
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveSection(item.id)}
                          className={cn(
                            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 mb-1',
                            isActive 
                              ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 shadow-sm' 
                              : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                          )}
                        >
                          <div className={cn(
                            'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
                            isActive 
                              ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white' 
                              : 'bg-gray-100 text-gray-500'
                          )}>
                            <item.icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="text-sm font-medium">{item.label}</div>
                            <div className="text-[10px] text-gray-400 truncate">{item.description}</div>
                          </div>
                          {isActive && <ChevronRight className="h-4 w-4 text-emerald-500" />}
                        </button>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </Card>
      </div>

      {/* Main Settings Content */}
      <div className="flex-1 min-w-0">
        {/* Mobile Navigation */}
        <Card className="border-0 shadow-lg shadow-gray-200/50 mb-6 lg:hidden overflow-x-auto">
          <CardContent className="pt-4">
            <div className="flex gap-2 pb-2">
              {settingsNav.map((item) => {
                const isActive = activeSection === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors',
                      isActive 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {settingsNav.find(s => s.id === activeSection)?.label} Settings
            </h1>
            <p className="text-gray-500 mt-1">
              {settingsNav.find(s => s.id === activeSection)?.description}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-emerald-700">Auto-saved</span>
            </div>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Settings Content */}
        {renderContent()}
      </div>
    </div>
  )
}

// General Settings Component
function GeneralSettings() {
  return (
    <div className="space-y-6">
      {/* Company Information */}
      <Card className="border-0 shadow-lg shadow-gray-200/50">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="h-5 w-5 text-emerald-500" />
            Company Information
          </CardTitle>
          <CardDescription>Basic company details displayed across the platform</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input id="companyName" defaultValue="Soreti" className="border-gray-200 focus:border-emerald-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="legalName">Legal Name</Label>
              <Input id="legalName" defaultValue="Soreti Loan Origination Platform PLC" className="border-gray-200 focus:border-emerald-500" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyEmail">Support Email *</Label>
              <Input id="companyEmail" type="email" defaultValue="support@soreti.com" className="border-gray-200 focus:border-emerald-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyPhone">Phone Number *</Label>
              <Input id="companyPhone" defaultValue="+251 911 123 456" className="border-gray-200 focus:border-emerald-500" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select defaultValue="africa/addis_ababa">
                <SelectTrigger className="border-gray-200 focus:border-emerald-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="africa/addis_ababa">Africa/Addis Ababa (GMT+3)</SelectItem>
                  <SelectItem value="utc">UTC (GMT+0)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <Select defaultValue="etb">
                <SelectTrigger className="border-gray-200 focus:border-emerald-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="etb">ETB - Ethiopian Birr</SelectItem>
                  <SelectItem value="usd">USD - US Dollar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Business Address</Label>
            <Textarea id="address" defaultValue="Bole Road, Addis Ababa, Ethiopia" rows={2} className="border-gray-200 focus:border-emerald-500" />
          </div>
        </CardContent>
      </Card>

      {/* Platform Settings */}
      <Card className="border-0 shadow-lg shadow-gray-200/50">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-base">
            <Server className="h-5 w-5 text-violet-500" />
            Platform Settings
          </CardTitle>
          <CardDescription>Core platform configuration options</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 border border-red-100">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Maintenance Mode</p>
                  <p className="text-xs text-gray-500">Temporarily disable platform</p>
                </div>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                  <Users className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">New Registration</p>
                  <p className="text-xs text-gray-500">Allow user sign-ups</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                  <FileText className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Document Uploads</p>
                  <p className="text-xs text-gray-500">Allow file uploads</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 border border-emerald-100">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                  <Sparkles className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">AI Features</p>
                  <p className="text-xs text-gray-500">Smart recommendations</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// SEO Settings Component
function SEOSettings() {
  return (
    <div className="space-y-6">
      {/* Meta Tags */}
      <Card className="border-0 shadow-lg shadow-gray-200/50">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-base">
            <Code className="h-5 w-5 text-emerald-500" />
            Meta Tags
          </CardTitle>
          <CardDescription>Configure meta tags for search engines and social sharing</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="metaTitle">Site Title *</Label>
            <Input id="metaTitle" defaultValue="Soreti - Loan Origination Platform" className="border-gray-200 focus:border-emerald-500" />
            <p className="text-xs text-gray-500">Recommended: 50-60 characters</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description *</Label>
            <Textarea 
              id="metaDescription" 
              defaultValue="Soreti is Ethiopia's leading loan origination platform, connecting you with partner banks for fast loan approvals and competitive rates." 
              rows={3} 
              className="border-gray-200 focus:border-emerald-500" 
            />
            <p className="text-xs text-gray-500">Recommended: 150-160 characters</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="metaKeywords">Meta Keywords</Label>
            <Input id="metaKeywords" defaultValue="loan, finance, ethiopia, banking, credit, personal loan, business loan" className="border-gray-200 focus:border-emerald-500" />
            <p className="text-xs text-gray-500">Separate keywords with commas</p>
          </div>
        </CardContent>
      </Card>

      {/* Open Graph */}
      <Card className="border-0 shadow-lg shadow-gray-200/50">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-base">
            <Globe className="h-5 w-5 text-violet-500" />
            Open Graph (Social Sharing)
          </CardTitle>
          <CardDescription>Configure how your site appears when shared on social media</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ogTitle">OG Title</Label>
              <Input id="ogTitle" defaultValue="Soreti - Get Financing for Quality Products" className="border-gray-200 focus:border-emerald-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ogSiteName">Site Name</Label>
              <Input id="ogSiteName" defaultValue="Soreti" className="border-gray-200 focus:border-emerald-500" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ogDescription">OG Description</Label>
            <Textarea 
              id="ogDescription" 
              defaultValue="Apply for loans from Ethiopia's leading banks. Fast approvals, competitive rates, and seamless experience." 
              rows={2} 
              className="border-gray-200 focus:border-emerald-500" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ogImage">OG Image URL</Label>
            <div className="flex gap-2">
              <Input id="ogImage" defaultValue="https://soreti.com/og-image.png" className="border-gray-200 focus:border-emerald-500" />
              <Button variant="outline" className="border-gray-200 shrink-0">
                <Image className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>
            <p className="text-xs text-gray-500">Recommended size: 1200x630 pixels</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ogType">OG Type</Label>
              <Select defaultValue="website">
                <SelectTrigger className="border-gray-200 focus:border-emerald-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="business.business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ogLocale">Locale</Label>
              <Select defaultValue="en_US">
                <SelectTrigger className="border-gray-200 focus:border-emerald-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en_US">English (US)</SelectItem>
                  <SelectItem value="am_ET">Amharic (Ethiopia)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Twitter Cards */}
      <Card className="border-0 shadow-lg shadow-gray-200/50">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-base">
            <Tag className="h-5 w-5 text-cyan-500" />
            Twitter Cards
          </CardTitle>
          <CardDescription>Configure Twitter card appearance</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="twitterCard">Card Type</Label>
              <Select defaultValue="summary_large_image">
                <SelectTrigger className="border-gray-200 focus:border-emerald-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Summary</SelectItem>
                  <SelectItem value="summary_large_image">Summary Large Image</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitterSite">Twitter Handle</Label>
              <Input id="twitterSite" defaultValue="@soreti" className="border-gray-200 focus:border-emerald-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Structured Data */}
      <Card className="border-0 shadow-lg shadow-gray-200/50">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileCode className="h-5 w-5 text-amber-500" />
            Structured Data (JSON-LD)
          </CardTitle>
          <CardDescription>Configure structured data for rich search results</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 border border-emerald-100">
              <div>
                <p className="text-sm font-medium text-gray-900">Organization Schema</p>
                <p className="text-xs text-gray-500">Company info</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 border border-emerald-100">
              <div>
                <p className="text-sm font-medium text-gray-900">Local Business</p>
                <p className="text-xs text-gray-500">Location data</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 border border-emerald-100">
              <div>
                <p className="text-sm font-medium text-gray-900">Financial Service</p>
                <p className="text-xs text-gray-500">Service schema</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Custom JSON-LD</Label>
            <Textarea 
              placeholder='{"@context": "https://schema.org", "@type": "FinancialService", ...}' 
              rows={4} 
              className="border-gray-200 focus:border-emerald-500 font-mono text-sm" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Robots & Sitemap */}
      <Card className="border-0 shadow-lg shadow-gray-200/50">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileCog className="h-5 w-5 text-rose-500" />
            Robots & Sitemap
          </CardTitle>
          <CardDescription>Configure crawler access and sitemap settings</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 border border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                <Eye className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Allow Search Indexing</p>
                <p className="text-xs text-gray-500">Let search engines crawl your site</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="space-y-2">
            <Label htmlFor="robotsTxt">robots.txt Content</Label>
            <Textarea 
              id="robotsTxt" 
              defaultValue={`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Sitemap: https://soreti.com/sitemap.xml`} 
              rows={6} 
              className="border-gray-200 focus:border-emerald-500 font-mono text-sm" 
            />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-gray-200">
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate Sitemap
            </Button>
            <Button variant="outline" className="border-gray-200">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Sitemap
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Appearance Settings Component - Connected to Homepage
function AppearanceSettings() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [updateHomepage, setUpdateHomepage] = useState(true)
  const [settings, setSettings] = useState({
    primaryColor: '#10b981',
    secondaryColor: '#14b8a6',
    accentColor: '#10b981',
    logoUrl: '',
    logoDarkUrl: '',
    faviconUrl: '',
    fontFamily: 'Inter',
    borderRadius: '0.75rem',
  })
  const [homepageSections, setHomepageSections] = useState<any[]>([])

  // Fetch appearance settings and homepage sections
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appearanceRes, sectionsRes] = await Promise.all([
          fetch('/api/settings/appearance'),
          fetch('/api/homepage-sections')
        ])

        if (appearanceRes.ok) {
          const data = await appearanceRes.json()
          setSettings(prev => ({ ...prev, ...data.data }))
        }

        if (sectionsRes.ok) {
          const data = await sectionsRes.json()
          setHomepageSections(data.data || [])
        }
      } catch (error) {
        console.error('Failed to fetch appearance settings:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Save settings
  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/settings/appearance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...settings,
          updateHomepageSections: updateHomepage
        })
      })

      if (response.ok) {
        // Refresh homepage sections if updated
        if (updateHomepage) {
          const sectionsRes = await fetch('/api/homepage-sections')
          if (sectionsRes.ok) {
            const data = await sectionsRes.json()
            setHomepageSections(data.data || [])
          }
        }
      }
    } catch (error) {
      console.error('Failed to save appearance settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  // Color picker change handler
  const handleColorChange = (field: string, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Branding Colors */}
      <Card className="border-0 shadow-lg shadow-gray-200/50">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-base">
            <Palette className="h-5 w-5 text-emerald-500" />
            Brand Colors
          </CardTitle>
          <CardDescription>
            Configure your brand colors. Changes sync with the homepage automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex gap-2">
                <div 
                  className="w-10 h-10 rounded-lg border-2 border-gray-200 cursor-pointer overflow-hidden"
                  style={{ backgroundColor: settings.primaryColor }}
                >
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    className="w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <Input 
                  value={settings.primaryColor}
                  onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                  className="border-gray-200 focus:border-emerald-500 font-mono"
                  placeholder="#10b981"
                />
              </div>
              <p className="text-xs text-gray-500">Main brand color for buttons, links</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondaryColor">Secondary Color</Label>
              <div className="flex gap-2">
                <div 
                  className="w-10 h-10 rounded-lg border-2 border-gray-200 cursor-pointer overflow-hidden"
                  style={{ backgroundColor: settings.secondaryColor }}
                >
                  <input
                    type="color"
                    value={settings.secondaryColor}
                    onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                    className="w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <Input 
                  value={settings.secondaryColor}
                  onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                  className="border-gray-200 focus:border-emerald-500 font-mono"
                  placeholder="#14b8a6"
                />
              </div>
              <p className="text-xs text-gray-500">Accent color for highlights</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accentColor">Homepage Accent</Label>
              <div className="flex gap-2">
                <div 
                  className="w-10 h-10 rounded-lg border-2 border-gray-200 cursor-pointer overflow-hidden"
                  style={{ backgroundColor: settings.accentColor }}
                >
                  <input
                    type="color"
                    value={settings.accentColor}
                    onChange={(e) => handleColorChange('accentColor', e.target.value)}
                    className="w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <Input 
                  value={settings.accentColor}
                  onChange={(e) => handleColorChange('accentColor', e.target.value)}
                  className="border-gray-200 focus:border-emerald-500 font-mono"
                  placeholder="#10b981"
                />
              </div>
              <p className="text-xs text-gray-500">Applied to all homepage sections</p>
            </div>
          </div>

          {/* Sync Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                <Sparkles className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Sync with Homepage</p>
                <p className="text-xs text-gray-500">Update all homepage sections with accent color</p>
              </div>
            </div>
            <Switch 
              checked={updateHomepage}
              onCheckedChange={setUpdateHomepage}
            />
          </div>
        </CardContent>
      </Card>

      {/* Logo & Favicon */}
      <Card className="border-0 shadow-lg shadow-gray-200/50">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-base">
            <Image className="h-5 w-5 text-violet-500" />
            Logo & Favicon
          </CardTitle>
          <CardDescription>Upload your brand assets</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Logo (Light Background)</Label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-emerald-500 transition-colors cursor-pointer">
                {settings.logoUrl ? (
                  <img src={settings.logoUrl} alt="Logo" className="h-12 mx-auto mb-2" />
                ) : (
                  <>
                    <Image className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Drop logo here or click to upload</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, SVG (max 2MB)</p>
                  </>
                )}
              </div>
              {settings.logoUrl && (
                <Input 
                  value={settings.logoUrl}
                  onChange={(e) => handleColorChange('logoUrl', e.target.value)}
                  placeholder="Logo URL"
                  className="border-gray-200"
                />
              )}
            </div>
            <div className="space-y-2">
              <Label>Logo (Dark Background)</Label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center bg-slate-800 hover:border-emerald-500 transition-colors cursor-pointer">
                {settings.logoDarkUrl ? (
                  <img src={settings.logoDarkUrl} alt="Logo Dark" className="h-12 mx-auto mb-2" />
                ) : (
                  <>
                    <Image className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-400">Drop logo here or click to upload</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, SVG (max 2MB)</p>
                  </>
                )}
              </div>
              {settings.logoDarkUrl && (
                <Input 
                  value={settings.logoDarkUrl}
                  onChange={(e) => handleColorChange('logoDarkUrl', e.target.value)}
                  placeholder="Logo Dark URL"
                  className="border-gray-200"
                />
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Favicon</Label>
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                style={{ background: `linear-gradient(to bottom right, ${settings.primaryColor}, ${settings.secondaryColor})` }}
              >
                {settings.faviconUrl ? (
                  <img src={settings.faviconUrl} alt="Favicon" className="w-8 h-8" />
                ) : (
                  'S'
                )}
              </div>
              <Input 
                value={settings.faviconUrl}
                onChange={(e) => handleColorChange('faviconUrl', e.target.value)}
                placeholder="Favicon URL (32x32 PNG/ICO)"
                className="flex-1 border-gray-200"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Homepage Sections Preview */}
      <Card className="border-0 shadow-lg shadow-gray-200/50">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-base">
            <Layout className="h-5 w-5 text-amber-500" />
            Homepage Sections Preview
          </CardTitle>
          <CardDescription>
            Preview how accent color applies to homepage sections
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {homepageSections.map((section) => (
              <div
                key={section.id}
                className="p-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div 
                  className="w-full h-8 rounded-lg mb-2"
                  style={{ backgroundColor: section.accentColor || settings.accentColor }}
                />
                <p className="text-xs font-medium text-gray-900 truncate capitalize">
                  {section.sectionKey.replace(/_/g, ' ')}
                </p>
                <p className="text-[10px] text-gray-500 font-mono">
                  {section.accentColor || settings.accentColor}
                </p>
              </div>
            ))}
          </div>
          {updateHomepage && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg flex items-start gap-2 border border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-700">
                Saving will update all homepage sections with the new accent color. 
                You can manage individual sections in the <strong>Homepage Manager</strong>.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Typography & Spacing */}
      <Card className="border-0 shadow-lg shadow-gray-200/50">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-base">
            <Monitor className="h-5 w-5 text-cyan-500" />
            Typography & Spacing
          </CardTitle>
          <CardDescription>Configure font and spacing preferences</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Font Family</Label>
              <Select 
                value={settings.fontFamily} 
                onValueChange={(value) => handleColorChange('fontFamily', value)}
              >
                <SelectTrigger className="border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Roboto">Roboto</SelectItem>
                  <SelectItem value="Open Sans">Open Sans</SelectItem>
                  <SelectItem value="Lato">Lato</SelectItem>
                  <SelectItem value="Poppins">Poppins</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Border Radius</Label>
              <Select 
                value={settings.borderRadius} 
                onValueChange={(value) => handleColorChange('borderRadius', value)}
              >
                <SelectTrigger className="border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.25rem">Small (4px)</SelectItem>
                  <SelectItem value="0.5rem">Medium (8px)</SelectItem>
                  <SelectItem value="0.75rem">Large (12px)</SelectItem>
                  <SelectItem value="1rem">Extra Large (16px)</SelectItem>
                  <SelectItem value="9999px">Full (Pill)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25"
        >
          {isSaving ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Appearance
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

// Loan Settings Component
function LoanSettings() {
  return (
    <div className="space-y-6">
      {/* Loan Parameters */}
      <Card className="border-0 shadow-lg shadow-gray-200/50">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-base">
            <DollarSign className="h-5 w-5 text-emerald-500" />
            Loan Parameters
          </CardTitle>
          <CardDescription>Default loan configuration values</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minLoanAmount">Min Amount (ETB)</Label>
              <Input id="minLoanAmount" type="number" defaultValue="10000" className="border-gray-200 focus:border-emerald-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxLoanAmount">Max Amount (ETB)</Label>
              <Input id="maxLoanAmount" type="number" defaultValue="10000000" className="border-gray-200 focus:border-emerald-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultInterestRate">Default Rate (%)</Label>
              <Input id="defaultInterestRate" type="number" step="0.1" defaultValue="12.5" className="border-gray-200 focus:border-emerald-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxLoanTerm">Max Term (months)</Label>
              <Input id="maxLoanTerm" type="number" defaultValue="60" className="border-gray-200 focus:border-emerald-500" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="processingFee">Processing Fee (%)</Label>
              <Input id="processingFee" type="number" step="0.1" defaultValue="1.5" className="border-gray-200 focus:border-emerald-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lateFee">Late Payment Fee (%)</Label>
              <Input id="lateFee" type="number" step="0.1" defaultValue="2.5" className="border-gray-200 focus:border-emerald-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflow */}
      <Card className="border-0 shadow-lg shadow-gray-200/50">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-5 w-5 text-amber-500" />
            Workflow Settings
          </CardTitle>
          <CardDescription>Loan application workflow configuration</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">Auto-approve Small Loans</p>
                <p className="text-xs text-gray-500">Loans under threshold</p>
              </div>
              <Switch />
            </div>
            <div className="space-y-2">
              <Label>Auto-approve Threshold (ETB)</Label>
              <Input type="number" defaultValue="50000" className="border-gray-200 focus:border-emerald-500" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">Document Verification</p>
                <p className="text-xs text-gray-500">Required before approval</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">Multi-level Approval</p>
                <p className="text-xs text-gray-500">For large loans</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interest Tiers */}
      <Card className="border-0 shadow-lg shadow-gray-200/50">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-base">
            <Percent className="h-5 w-5 text-violet-500" />
            Interest Rate Tiers
          </CardTitle>
          <CardDescription>Configure rates by loan amount</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { range: 'ETB 10K - 100K', rate: '15', badge: 'Micro', color: 'from-emerald-400 to-teal-500' },
              { range: 'ETB 100K - 1M', rate: '12.5', badge: 'Standard', color: 'from-amber-400 to-orange-500' },
              { range: 'ETB 1M - 10M', rate: '10', badge: 'Premium', color: 'from-violet-400 to-purple-500' },
            ].map((tier, i) => (
              <div key={i} className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200">
                <Badge className={cn('mb-3 border-0 bg-gradient-to-r text-white', tier.color)}>{tier.badge}</Badge>
                <p className="text-sm text-gray-500 mb-1">{tier.range}</p>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-bold text-gray-900">{tier.rate}</span>
                  <span className="text-sm text-gray-500 mb-1">% p.a.</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Notifications Settings Component
function NotificationsSettings() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email */}
        <Card className="border-0 shadow-lg shadow-gray-200/50">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-base">
              <Mail className="h-5 w-5 text-emerald-500" />
              Email Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            {[
              { label: 'New Loan Application', desc: 'New submissions' },
              { label: 'Status Updates', desc: 'Loan status changes' },
              { label: 'Payment Reminders', desc: 'Upcoming payments' },
              { label: 'Document Uploads', desc: 'New documents' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
                <Switch defaultChecked />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* SMS */}
        <Card className="border-0 shadow-lg shadow-gray-200/50">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-base">
              <Phone className="h-5 w-5 text-violet-500" />
              SMS Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            {[
              { label: 'OTP Verification', desc: 'Login codes' },
              { label: 'Loan Approval', desc: 'Approved notifications' },
              { label: 'Disbursement', desc: 'Fund transfers' },
              { label: 'Payment Confirm', desc: 'Payment receipts' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
                <Switch defaultChecked />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Security Settings Component
function SecuritySettings() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg shadow-gray-200/50">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-base">
              <Key className="h-5 w-5 text-emerald-500" />
              Authentication
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 border border-emerald-100">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium">Two-Factor Auth</p>
                  <p className="text-xs text-gray-500">For admin users</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="space-y-2">
              <Label>Session Timeout (min)</Label>
              <Input type="number" defaultValue="30" className="border-gray-200 focus:border-emerald-500" />
            </div>
            <div className="space-y-2">
              <Label>Password Expiry (days)</Label>
              <Input type="number" defaultValue="90" className="border-gray-200 focus:border-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-gray-200/50">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-5 w-5 text-amber-500" />
              Access Control
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div>
                <p className="text-sm font-medium">IP Whitelisting</p>
                <p className="text-xs text-gray-500">Restrict access</p>
              </div>
              <Switch />
            </div>
            <div className="space-y-2">
              <Label>Allowed IPs</Label>
              <Textarea placeholder="One IP per line" rows={3} className="border-gray-200 focus:border-emerald-500" />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div>
                <p className="text-sm font-medium">Rate Limiting</p>
                <p className="text-xs text-gray-500">API throttling</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Integrations Settings Component
function IntegrationsSettings() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment */}
        <Card className="border-0 shadow-lg shadow-gray-200/50">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="h-5 w-5 text-emerald-500" />
              Payment Gateway
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Chapa</span>
                <Badge className="bg-emerald-500 text-white border-0">Connected</Badge>
              </div>
              <p className="text-xs text-gray-500">Last sync: 2 min ago</p>
            </div>
            <div className="space-y-2">
              <Label>Secret Key</Label>
              <Input type="password" defaultValue="CHASECRET_xxxxx" className="border-gray-200 focus:border-emerald-500" />
            </div>
            <Button variant="outline" className="w-full border-gray-200">
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync
            </Button>
          </CardContent>
        </Card>

        {/* SMS */}
        <Card className="border-0 shadow-lg shadow-gray-200/50">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-base">
              <Phone className="h-5 w-5 text-violet-500" />
              SMS Gateway
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Twilio</span>
                <Badge className="bg-violet-500 text-white border-0">Connected</Badge>
              </div>
              <p className="text-xs text-gray-500">Balance: 5,000 credits</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Account SID</Label>
                <Input defaultValue="ACxxxxx" className="border-gray-200 focus:border-emerald-500" />
              </div>
              <div className="space-y-2">
                <Label>Auth Token</Label>
                <Input type="password" className="border-gray-200 focus:border-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API */}
      <Card className="border-0 shadow-lg shadow-gray-200/50">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-base">
            <Webhook className="h-5 w-5 text-amber-500" />
            API & Webhooks
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">API Version</p>
              <p className="text-lg font-semibold">v2.0</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Rate Limit</p>
              <p className="text-lg font-semibold">1000/min</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Webhooks</p>
              <p className="text-lg font-semibold">3 Active</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-gray-200">Regenerate API Key</Button>
            <Button variant="outline" className="border-gray-200">View Documentation</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Database Settings Component
function DatabaseSettings() {
  return (
    <div className="space-y-6">
      {/* Storage */}
      <Card className="border-0 shadow-lg shadow-gray-200/50">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-base">
            <HardDrive className="h-5 w-5 text-emerald-500" />
            Storage Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
              <Database className="h-8 w-8 text-emerald-500 mb-2" />
              <p className="text-2xl font-bold">256 MB</p>
              <p className="text-xs text-gray-500">Database Size</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200">
              <FileText className="h-8 w-8 text-violet-500 mb-2" />
              <p className="text-2xl font-bold">1.2 GB</p>
              <p className="text-xs text-gray-500">Documents</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
              <Image className="h-8 w-8 text-amber-500 mb-2" />
              <p className="text-2xl font-bold">450 MB</p>
              <p className="text-xs text-gray-500">Images</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200">
              <CloudUpload className="h-8 w-8 text-cyan-500 mb-2" />
              <p className="text-2xl font-bold">85%</p>
              <p className="text-xs text-gray-500">Storage Used</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup */}
      <Card className="border-0 shadow-lg shadow-gray-200/50">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-base">
            <DatabaseBackup className="h-5 w-5 text-violet-500" />
            Backup & Recovery
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div>
                <p className="text-sm font-medium">Auto Backup</p>
                <p className="text-xs text-gray-500">Daily automatic backups</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="space-y-2">
              <Label>Backup Frequency</Label>
              <Select defaultValue="daily">
                <SelectTrigger className="border-gray-200 focus:border-emerald-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
              <DatabaseBackup className="h-4 w-4 mr-2" />
              Backup Now
            </Button>
            <Button variant="outline" className="border-gray-200">
              Restore from Backup
            </Button>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-sm text-gray-500">Last backup: <span className="font-medium text-gray-700">Today at 3:00 AM</span></p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Profile Settings Component
function ProfileSettings() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div className="space-y-6">
      {/* Profile Picture Section */}
      <Card className="border-0 shadow-lg shadow-gray-200/50">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-5 w-5 text-emerald-500" />
            Profile Picture
          </CardTitle>
          <CardDescription>Update your profile photo</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-4xl font-bold shadow-xl shadow-emerald-500/20">
                AD
              </div>
              <button className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="h-8 w-8 text-white" />
              </button>
              <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center border-2 border-emerald-500">
                <Camera className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Admin User</h3>
              <p className="text-sm text-gray-500 mb-4">admin@soreti.com</p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
                  <Camera className="h-4 w-4 mr-2" />
                  Upload Photo
                </Button>
                <Button variant="outline" className="border-gray-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-3">JPG, PNG or GIF. Max size 2MB.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="border-0 shadow-lg shadow-gray-200/50">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-5 w-5 text-violet-500" />
            Personal Information
          </CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input id="firstName" defaultValue="Admin" className="border-gray-200 focus:border-emerald-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input id="lastName" defaultValue="User" className="border-gray-200 focus:border-emerald-500" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input id="email" type="email" defaultValue="admin@soreti.com" className="border-gray-200 focus:border-emerald-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" defaultValue="+251 911 123 456" className="border-gray-200 focus:border-emerald-500" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" placeholder="Tell us about yourself..." rows={3} className="border-gray-200 focus:border-emerald-500" />
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="border-0 shadow-lg shadow-gray-200/50">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-base">
            <Lock className="h-5 w-5 text-amber-500" />
            Change Password
          </CardTitle>
          <CardDescription>Ensure your account is using a strong password</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password *</Label>
            <div className="relative">
              <Input 
                id="currentPassword" 
                type={showCurrentPassword ? "text" : "password"} 
                placeholder="Enter current password"
                className="border-gray-200 focus:border-emerald-500 pr-10" 
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password *</Label>
              <div className="relative">
                <Input 
                  id="newPassword" 
                  type={showNewPassword ? "text" : "password"} 
                  placeholder="Enter new password"
                  className="border-gray-200 focus:border-emerald-500 pr-10" 
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Input 
                  id="confirmPassword" 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="Confirm new password"
                  className="border-gray-200 focus:border-emerald-500 pr-10" 
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
          
          {/* Password Requirements */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                Minimum 8 characters
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                At least one uppercase letter
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                At least one number
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                At least one special character
              </li>
            </ul>
          </div>

          <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
            Update Password
          </Button>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card className="border-0 shadow-lg shadow-gray-200/50">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-5 w-5 text-emerald-500" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 border border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                <Shield className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">Protect your account with 2FA</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-emerald-500 text-white border-0">Enabled</Badge>
              <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-100">
                Configure
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sessions */}
      <Card className="border-0 shadow-lg shadow-gray-200/50">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="h-5 w-5 text-rose-500" />
            Active Sessions
          </CardTitle>
          <CardDescription>Manage your active sessions across devices</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-3">
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                <Monitor className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Current Session</p>
                <p className="text-xs text-gray-500">Chrome on Windows • Addis Ababa, ET</p>
              </div>
            </div>
            <Badge className="bg-emerald-500 text-white border-0">Active</Badge>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                <Smartphone className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Mobile App</p>
                <p className="text-xs text-gray-500">iPhone • Last active 2 hours ago</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="border-gray-200 text-red-600 hover:bg-red-50">
              Revoke
            </Button>
          </div>
          <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50">
            Sign Out All Other Sessions
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

// Social Login Settings Component - Connected to Registration Page
function SocialLoginSettings() {
  const [providers, setProviders] = useState<Array<{
    id: string
    name: string
    displayName: string
    isEnabled: boolean
    clientId: string | null
    buttonColor: string | null
    buttonTextColor: string | null
  }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [expandedProvider, setExpandedProvider] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, { clientId: string; clientSecret: string; buttonColor: string }>>({})

  // Provider configurations matching registration page
  const providerConfigs = {
    google: {
      icon: Chrome,
      color: 'bg-white border-2 border-gray-200',
      iconColor: 'text-gray-700',
      gradient: 'from-red-500 to-yellow-500',
      description: 'Sign in with Google account',
      redirectUrl: '/api/auth/callback/google'
    },
    facebook: {
      icon: Facebook,
      color: 'bg-[#1877F2]',
      iconColor: 'text-white',
      gradient: 'from-blue-600 to-blue-700',
      description: 'Sign in with Facebook account',
      redirectUrl: '/api/auth/callback/facebook'
    },
    telegram: {
      icon: Smartphone,
      color: 'bg-[#0088cc]',
      iconColor: 'text-white',
      gradient: 'from-cyan-500 to-blue-500',
      description: 'Sign in with Telegram account',
      redirectUrl: '/api/auth/callback/telegram'
    }
  }

  // Fetch providers from API
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch('/api/settings/oauth')
        if (response.ok) {
          const data = await response.json()
          setProviders(data.providers || [])
          
          // Initialize form data
          const initialFormData: Record<string, { clientId: string; clientSecret: string; buttonColor: string }> = {}
          data.providers?.forEach((p: { id: string; clientId: string | null; buttonColor: string | null }) => {
            initialFormData[p.id] = {
              clientId: p.clientId || '',
              clientSecret: '',
              buttonColor: p.buttonColor || ''
            }
          })
          setFormData(initialFormData)
        }
      } catch (error) {
        console.error('Failed to fetch providers:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProviders()
  }, [])

  // Toggle provider enabled status
  const toggleProvider = async (providerId: string, currentStatus: boolean) => {
    setSavingId(providerId)
    try {
      const response = await fetch('/api/settings/oauth', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: providerId,
          isEnabled: !currentStatus
        })
      })
      
      if (response.ok) {
        setProviders(prev => prev.map(p => 
          p.id === providerId ? { ...p, isEnabled: !currentStatus } : p
        ))
      }
    } catch (error) {
      console.error('Failed to toggle provider:', error)
    } finally {
      setSavingId(null)
    }
  }

  // Save provider configuration
  const saveProviderConfig = async (providerId: string) => {
    setSavingId(providerId)
    const data = formData[providerId]
    if (!data) return
    
    try {
      const response = await fetch('/api/settings/oauth', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: providerId,
          clientId: data.clientId,
          clientSecret: data.clientSecret || undefined,
          buttonColor: data.buttonColor || undefined
        })
      })
      
      if (response.ok) {
        setExpandedProvider(null)
      }
    } catch (error) {
      console.error('Failed to save provider config:', error)
    } finally {
      setSavingId(null)
    }
  }

  const enabledCount = providers.filter(p => p.isEnabled).length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <Card className="border-0 shadow-lg shadow-gray-200/50">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-base">
            <Key className="h-5 w-5 text-emerald-500" />
            Social Login Providers
          </CardTitle>
          <CardDescription>
            Configure OAuth providers for user registration and login. Changes here affect the login buttons on the registration page.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 text-center">
              <p className="text-3xl font-bold text-gray-900">{enabledCount}</p>
              <p className="text-xs text-gray-500">Active Providers</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 text-center">
              <p className="text-3xl font-bold text-gray-900">{providers.length}</p>
              <p className="text-xs text-gray-500">Total Providers</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 text-center">
              <p className="text-3xl font-bold text-gray-900">3</p>
              <p className="text-xs text-gray-500">Supported</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 text-center">
              <div className="flex items-center justify-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-medium text-gray-700">Live</span>
              </div>
              <p className="text-xs text-gray-500">Synced with Registration</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Provider Cards - Only Google, Facebook, Telegram */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {['google', 'facebook', 'telegram'].map((providerName) => {
          const provider = providers.find(p => p.name === providerName)
          const config = providerConfigs[providerName as keyof typeof providerConfigs]
          const IconComponent = config.icon
          const isEnabled = provider?.isEnabled ?? false
          const isExpanded = expandedProvider === providerName
          const isSaving = savingId === provider?.id

          return (
            <Card 
              key={providerName} 
              className={cn(
                "border-0 shadow-lg shadow-gray-200/50 overflow-hidden transition-all duration-300",
                isEnabled && "ring-2 ring-emerald-500/20"
              )}
            >
              <div className={cn("h-1 bg-gradient-to-r", config.gradient)} />
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl",
                      config.color
                    )}>
                      <IconComponent className={cn("h-6 w-6", config.iconColor)} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 capitalize">{providerName}</h3>
                      <p className="text-xs text-gray-500">{config.description}</p>
                    </div>
                  </div>
                </div>

                {/* Enable/Disable Toggle */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 mb-4">
                  <div className="flex items-center gap-2">
                    {isEnabled ? (
                      <>
                        <Badge className="bg-emerald-500 text-white border-0">Active</Badge>
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      </>
                    ) : (
                      <Badge variant="secondary" className="bg-gray-200 text-gray-600">Disabled</Badge>
                    )}
                  </div>
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={() => provider && toggleProvider(provider.id, isEnabled)}
                    disabled={isSaving}
                  />
                </div>

                {/* Expand/Collapse for Configuration */}
                <Button
                  variant="outline"
                  className="w-full border-gray-200"
                  onClick={() => setExpandedProvider(isExpanded ? null : providerName)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {isExpanded ? 'Hide Configuration' : 'Configure'}
                </Button>

                {/* Configuration Panel */}
                {isExpanded && provider && (
                  <div className="mt-4 space-y-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="space-y-2">
                      <Label className="text-xs">Client ID</Label>
                      <Input
                        value={formData[providerName]?.clientId || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          [providerName]: { ...prev[providerName], clientId: e.target.value }
                        }))}
                        placeholder={`${providerName} client ID`}
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Client Secret</Label>
                      <Input
                        type="password"
                        value={formData[providerName]?.clientSecret || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          [providerName]: { ...prev[providerName], clientSecret: e.target.value }
                        }))}
                        placeholder="Enter new secret to update"
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Button Color (optional)</Label>
                      <div className="flex gap-2">
                        <Input
                          value={formData[providerName]?.buttonColor || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            [providerName]: { ...prev[providerName], buttonColor: e.target.value }
                          }))}
                          placeholder="#1877F2"
                          className="h-9 text-sm flex-1"
                        />
                        <input
                          type="color"
                          value={formData[providerName]?.buttonColor || '#1877F2'}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            [providerName]: { ...prev[providerName], buttonColor: e.target.value }
                          }))}
                          className="w-9 h-9 rounded border cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Redirect URL</Label>
                      <div className="p-2 rounded bg-white border border-gray-200 font-mono text-xs text-gray-600 break-all">
                        {config.redirectUrl}
                      </div>
                      <p className="text-[10px] text-gray-400">Add this URL to your {providerName} app settings</p>
                    </div>
                    <Button
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                      onClick={() => saveProviderConfig(provider.id)}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Configuration
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Info Card */}
      <Card className="border-0 shadow-lg shadow-gray-200/50 bg-gradient-to-r from-blue-50 to-cyan-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Registration Page Integration</h3>
              <p className="text-sm text-gray-600">
                These settings control which social login buttons appear on the user registration and login pages. 
                Disable a provider here to hide its button from the registration page.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
