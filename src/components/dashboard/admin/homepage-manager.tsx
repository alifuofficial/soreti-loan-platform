'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  GripVertical,
  Settings,
  Eye,
  EyeOff,
  Palette,
  Type,
  Image as ImageIcon,
  Link2,
  MoreVertical,
  RefreshCw,
  Monitor,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface HomepageSection {
  id: string
  sectionKey: string
  isEnabled: boolean
  order: number
  title: string | null
  subtitle: string | null
  description: string | null
  content: string | null
  backgroundColor: string | null
  textColor: string | null
  accentColor: string | null
  customCss: string | null
  backgroundImage: string | null
  backgroundImageUrl: string | null
  ctaText: string | null
  ctaLink: string | null
  ctaButtonColor: string | null
  secondaryCtaText: string | null
  secondaryCtaLink: string | null
  updatedAt: string
}

const SECTION_ICONS: Record<string, any> = {
  hero: Sparkles,
  mobile_apps: Monitor,
  how_it_works: ChevronUp,
  banks: Link2,
  products: ImageIcon,
  testimonials: Type,
  stats: Palette,
  contact: Link2,
  footer: GripVertical
}

const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero Section',
  mobile_apps: 'Mobile Apps Banner',
  how_it_works: 'How It Works',
  banks: 'Partner Banks',
  products: 'Featured Products',
  testimonials: 'Testimonials',
  stats: 'Statistics',
  contact: 'Contact Section',
  footer: 'Footer'
}

export function HomepageManager() {
  const router = useRouter()
  const [sections, setSections] = useState<HomepageSection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSection, setSelectedSection] = useState<HomepageSection | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    backgroundColor: '',
    textColor: '',
    accentColor: '',
    customCss: '',
    backgroundImage: '',
    backgroundImageUrl: '',
    ctaText: '',
    ctaLink: '',
    ctaButtonColor: '',
    secondaryCtaText: '',
    secondaryCtaLink: ''
  })

  // Fetch sections
  const fetchSections = useCallback(async () => {
    try {
      setError(null)
      const response = await fetch('/api/homepage-sections')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch sections')
      }
      
      setSections(data.data || [])
    } catch (error) {
      console.error('Failed to fetch sections:', error)
      setError(error instanceof Error ? error.message : 'Failed to load sections')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSections()
  }, [fetchSections])

  // Toggle section enabled/disabled
  const toggleSection = async (section: HomepageSection) => {
    try {
      const response = await fetch(`/api/homepage-sections/${section.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isEnabled: !section.isEnabled })
      })
      
      if (response.ok) {
        setSections(prev => prev.map(s => 
          s.id === section.id ? { ...s, isEnabled: !s.isEnabled } : s
        ))
      }
    } catch (error) {
      console.error('Failed to toggle section:', error)
    }
  }

  // Move section up or down
  const moveSection = async (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    if (targetIndex < 0 || targetIndex >= newSections.length) return
    
    // Swap
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]]
    
    // Update order
    const reorderedSections = newSections.map((s, i) => ({ ...s, order: i }))
    setSections(reorderedSections)
    
    // Save to backend
    try {
      await fetch('/api/homepage-sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections: reorderedSections })
      })
    } catch (error) {
      console.error('Failed to reorder sections:', error)
    }
  }

  // Open edit dialog
  const openEditDialog = (section: HomepageSection) => {
    setSelectedSection(section)
    setFormData({
      title: section.title || '',
      subtitle: section.subtitle || '',
      description: section.description || '',
      backgroundColor: section.backgroundColor || '',
      textColor: section.textColor || '',
      accentColor: section.accentColor || '',
      customCss: section.customCss || '',
      backgroundImage: section.backgroundImage || '',
      backgroundImageUrl: section.backgroundImageUrl || '',
      ctaText: section.ctaText || '',
      ctaLink: section.ctaLink || '',
      ctaButtonColor: section.ctaButtonColor || '',
      secondaryCtaText: section.secondaryCtaText || '',
      secondaryCtaLink: section.secondaryCtaLink || ''
    })
    setIsEditDialogOpen(true)
  }

  // Save section changes
  const saveSection = async () => {
    if (!selectedSection) return
    
    setIsSaving(true)
    setSaveMessage(null)
    
    try {
      const response = await fetch(`/api/homepage-sections/${selectedSection.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        const data = await response.json()
        setSections(prev => prev.map(s => s.id === selectedSection.id ? data.data : s))
        setSaveMessage({ type: 'success', text: 'Section updated successfully!' })
        setTimeout(() => {
          setIsEditDialogOpen(false)
          setSaveMessage(null)
        }, 1500)
      } else {
        setSaveMessage({ type: 'error', text: 'Failed to save changes' })
      }
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Failed to save changes' })
    } finally {
      setIsSaving(false)
    }
  }

  // Reset to defaults
  const resetToDefaults = async () => {
    if (!confirm('This will reset all sections to their default values. Continue?')) return
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/homepage-sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seedDefaults: true })
      })
      
      if (response.ok) {
        const data = await response.json()
        setSections(data.data || [])
      }
    } catch (error) {
      console.error('Failed to reset sections:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Sections</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchSections} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <Button onClick={resetToDefaults} className="gap-2">
            Seed Default Sections
          </Button>
        </div>
      </div>
    )
  }

  // Empty state - no sections
  if (sections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Monitor className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Homepage Sections</h3>
        <p className="text-gray-500 mb-4">
          Get started by seeding the default homepage sections
        </p>
        <Button onClick={resetToDefaults} className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-500">
          <Sparkles className="h-4 w-4" />
          Seed Default Sections
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Monitor className="h-6 w-6 text-emerald-500" />
            Homepage Manager
          </h2>
          <p className="text-gray-500 mt-1">
            Control which sections appear on the homepage and customize their appearance
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={resetToDefaults}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reset Defaults
          </Button>
          <Button
            onClick={() => window.open('/', '_blank')}
            className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
          >
            <ExternalLink className="h-4 w-4" />
            Preview
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg shadow-gray-200/50 bg-gradient-to-br from-white to-gray-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {sections.filter(s => s.isEnabled).length}
                </p>
                <p className="text-xs text-gray-500">Active Sections</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg shadow-gray-200/50 bg-gradient-to-br from-white to-gray-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <EyeOff className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {sections.filter(s => !s.isEnabled).length}
                </p>
                <p className="text-xs text-gray-500">Disabled Sections</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg shadow-gray-200/50 bg-gradient-to-br from-white to-gray-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Monitor className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{sections.length}</p>
                <p className="text-xs text-gray-500">Total Sections</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sections List */}
      <Card className="border-0 shadow-lg shadow-gray-200/50">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-lg">Homepage Sections</CardTitle>
          <CardDescription>
            Drag to reorder sections or click edit to customize
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {sections.map((section, index) => {
              const IconComponent = SECTION_ICONS[section.sectionKey] || Monitor
              const label = SECTION_LABELS[section.sectionKey] || section.sectionKey
              
              return (
                <div
                  key={section.id}
                  className={cn(
                    'flex items-center gap-4 p-4 hover:bg-gray-50/50 transition-colors',
                    !section.isEnabled && 'opacity-60'
                  )}
                >
                  {/* Drag Handle & Reorder */}
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveSection(index, 'up')}
                      disabled={index === 0}
                      className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronUp className="h-3 w-3 text-gray-400" />
                    </button>
                    <button
                      onClick={() => moveSection(index, 'down')}
                      disabled={index === sections.length - 1}
                      className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronDown className="h-3 w-3 text-gray-400" />
                    </button>
                  </div>

                  {/* Order Number */}
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    section.isEnabled
                      ? 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/30'
                      : 'bg-gray-200'
                  )}>
                    <IconComponent className={cn(
                      'h-5 w-5',
                      section.isEnabled ? 'text-white' : 'text-gray-400'
                    )} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{label}</span>
                      {section.isEnabled ? (
                        <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">
                          Active
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-600 border-0 text-[10px]">
                          Disabled
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {section.title || 'No title set'}
                    </p>
                  </div>

                  {/* Quick Info */}
                  <div className="hidden md:flex items-center gap-4">
                    {section.accentColor && (
                      <div className="flex items-center gap-1.5">
                        <div 
                          className="w-4 h-4 rounded-full border border-gray-200"
                          style={{ backgroundColor: section.accentColor }}
                        />
                        <span className="text-xs text-gray-500">Accent</span>
                      </div>
                    )}
                    {section.ctaText && (
                      <Badge variant="outline" className="text-xs">
                        CTA: {section.ctaText}
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={section.isEnabled}
                      onCheckedChange={() => toggleSection(section)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(section)}
                      className="hover:bg-emerald-50 hover:text-emerald-600"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-emerald-500" />
              Edit {selectedSection && SECTION_LABELS[selectedSection.sectionKey]}
            </DialogTitle>
            <DialogDescription>
              Customize the appearance and content of this section
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Content Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Type className="h-4 w-4" />
                Content
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Section title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Input
                    value={formData.subtitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="Section subtitle"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Section description"
                  rows={3}
                />
              </div>
            </div>

            {/* Styling Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Styling
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.backgroundColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      placeholder="#ffffff or gradient"
                      className="flex-1"
                    />
                    <input
                      type="color"
                      value={formData.backgroundColor?.startsWith('#') ? formData.backgroundColor : '#ffffff'}
                      onChange={(e) => setFormData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="w-10 h-10 rounded border cursor-pointer"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Text Color</Label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.textColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, textColor: e.target.value }))}
                      placeholder="#333333"
                      className="flex-1"
                    />
                    <input
                      type="color"
                      value={formData.textColor?.startsWith('#') ? formData.textColor : '#333333'}
                      onChange={(e) => setFormData(prev => ({ ...prev, textColor: e.target.value }))}
                      className="w-10 h-10 rounded border cursor-pointer"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.accentColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, accentColor: e.target.value }))}
                      placeholder="#10b981"
                      className="flex-1"
                    />
                    <input
                      type="color"
                      value={formData.accentColor?.startsWith('#') ? formData.accentColor : '#10b981'}
                      onChange={(e) => setFormData(prev => ({ ...prev, accentColor: e.target.value }))}
                      className="w-10 h-10 rounded border cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Custom CSS</Label>
                <Textarea
                  value={formData.customCss}
                  onChange={(e) => setFormData(prev => ({ ...prev, customCss: e.target.value }))}
                  placeholder=".my-class { color: red; }"
                  rows={3}
                  className="font-mono text-sm"
                />
              </div>
            </div>

            {/* Media Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Media
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Background Image</Label>
                  <Input
                    value={formData.backgroundImageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, backgroundImageUrl: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Link2 className="h-4 w-4" />
                Call to Action
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Primary Button Text</Label>
                  <Input
                    value={formData.ctaText}
                    onChange={(e) => setFormData(prev => ({ ...prev, ctaText: e.target.value }))}
                    placeholder="Get Started"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Primary Button Link</Label>
                  <Input
                    value={formData.ctaLink}
                    onChange={(e) => setFormData(prev => ({ ...prev, ctaLink: e.target.value }))}
                    placeholder="#register"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Secondary Button Text</Label>
                  <Input
                    value={formData.secondaryCtaText}
                    onChange={(e) => setFormData(prev => ({ ...prev, secondaryCtaText: e.target.value }))}
                    placeholder="Learn More"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Secondary Button Link</Label>
                  <Input
                    value={formData.secondaryCtaLink}
                    onChange={(e) => setFormData(prev => ({ ...prev, secondaryCtaLink: e.target.value }))}
                    placeholder="#about"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Button Color</Label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.ctaButtonColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, ctaButtonColor: e.target.value }))}
                      placeholder="#10b981"
                      className="flex-1"
                    />
                    <input
                      type="color"
                      value={formData.ctaButtonColor?.startsWith('#') ? formData.ctaButtonColor : '#10b981'}
                      onChange={(e) => setFormData(prev => ({ ...prev, ctaButtonColor: e.target.value }))}
                      className="w-10 h-10 rounded border cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700">Preview</h4>
              <div 
                className="rounded-xl p-6 border border-gray-200 min-h-[120px]"
                style={{
                  background: formData.backgroundColor || '#ffffff',
                  color: formData.textColor || '#333333',
                  backgroundImage: formData.backgroundImageUrl ? `url(${formData.backgroundImageUrl})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {formData.subtitle && (
                  <p className="text-xs uppercase tracking-wider opacity-70 mb-2">{formData.subtitle}</p>
                )}
                {formData.title && <h3 className="text-xl font-bold mb-2">{formData.title}</h3>}
                {formData.description && <p className="text-sm opacity-80 mb-4">{formData.description}</p>}
                <div className="flex gap-3">
                  {formData.ctaText && (
                    <button 
                      className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                      style={{ backgroundColor: formData.ctaButtonColor || formData.accentColor || '#10b981' }}
                    >
                      {formData.ctaText}
                    </button>
                  )}
                  {formData.secondaryCtaText && (
                    <button className="px-4 py-2 rounded-lg border border-current text-sm font-medium opacity-70 hover:opacity-100">
                      {formData.secondaryCtaText}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Save Message */}
            {saveMessage && (
              <div className={cn(
                'flex items-center gap-2 p-3 rounded-lg',
                saveMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
              )}>
                {saveMessage.type === 'success' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                {saveMessage.text}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={saveSection}
              disabled={isSaving}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
