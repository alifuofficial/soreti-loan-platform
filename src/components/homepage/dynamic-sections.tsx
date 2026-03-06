'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface SectionSettings {
  id: string
  sectionKey: string
  isEnabled: boolean
  order: number
  title: string | null
  subtitle: string | null
  description: string | null
  backgroundColor: string | null
  textColor: string | null
  accentColor: string | null
  customCss: string | null
  backgroundImageUrl: string | null
  ctaText: string | null
  ctaLink: string | null
  ctaButtonColor: string | null
  secondaryCtaText: string | null
  secondaryCtaLink: string | null
}

interface HomepageContextType {
  sections: SectionSettings[]
  isLoading: boolean
  getSection: (key: string) => SectionSettings | undefined
  isEnabled: (key: string) => boolean
}

const HomepageContext = createContext<HomepageContextType>({
  sections: [],
  isLoading: true,
  getSection: () => undefined,
  isEnabled: () => true
})

export function useHomepageSections() {
  return useContext(HomepageContext)
}

interface HomepageProviderProps {
  children: ReactNode
}

export function HomepageProvider({ children }: HomepageProviderProps) {
  const [sections, setSections] = useState<SectionSettings[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await fetch('/api/homepage-sections')
        if (response.ok) {
          const data = await response.json()
          setSections(data.data || [])
        }
      } catch (error) {
        console.error('Failed to fetch homepage sections:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSections()
  }, [])

  const getSection = (key: string) => {
    return sections.find(s => s.sectionKey === key)
  }

  const isEnabled = (key: string) => {
    const section = getSection(key)
    return section?.isEnabled ?? true
  }

  return (
    <HomepageContext.Provider value={{ sections, isLoading, getSection, isEnabled }}>
      {children}
    </HomepageContext.Provider>
  )
}

// Wrapper component for dynamic sections
interface DynamicSectionProps {
  sectionKey: string
  children: ReactNode
  className?: string
  id?: string
}

export function DynamicSection({ sectionKey, children, className, id }: DynamicSectionProps) {
  const { getSection, isLoading } = useHomepageSections()
  const section = getSection(sectionKey)

  // During initial load, show the section to prevent flash
  if (isLoading) {
    return (
      <section id={id} className={className}>
        {children}
      </section>
    )
  }

  // If section is disabled, don't render
  if (section && !section.isEnabled) {
    return null
  }

  // Apply dynamic styles
  const style: React.CSSProperties = {}
  
  if (section?.backgroundColor) {
    if (section.backgroundColor.includes('gradient')) {
      style.background = section.backgroundColor
    } else {
      style.backgroundColor = section.backgroundColor
    }
  }
  
  if (section?.textColor) {
    style.color = section.textColor
  }

  if (section?.backgroundImageUrl) {
    style.backgroundImage = `url(${section.backgroundImageUrl})`
    style.backgroundSize = 'cover'
    style.backgroundPosition = 'center'
  }

  return (
    <section 
      id={id} 
      className={className}
      style={Object.keys(style).length > 0 ? style : undefined}
      data-section={sectionKey}
    >
      {section?.customCss && (
        <style dangerouslySetInnerHTML={{ __html: section.customCss }} />
      )}
      {children}
    </section>
  )
}

// Component to display section title with dynamic content
interface SectionTitleProps {
  sectionKey: string
  defaultTitle: string
  defaultSubtitle?: string
  className?: string
}

export function SectionTitle({ sectionKey, defaultTitle, defaultSubtitle, className }: SectionTitleProps) {
  const { getSection } = useHomepageSections()
  const section = getSection(sectionKey)

  const title = section?.title || defaultTitle
  const subtitle = section?.subtitle || defaultSubtitle

  return (
    <div className={className}>
      {subtitle && (
        <p className="text-sm font-medium text-emerald-600 mb-2">{subtitle}</p>
      )}
      <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
      {section?.description && (
        <p className="mt-4 text-lg text-gray-600">{section.description}</p>
      )}
    </div>
  )
}

// Component for CTA buttons with dynamic content
interface SectionCTAProps {
  sectionKey: string
  defaultPrimaryText?: string
  defaultPrimaryLink?: string
  defaultSecondaryText?: string
  defaultSecondaryLink?: string
  onPrimaryClick?: () => void
  onSecondaryClick?: () => void
  className?: string
}

export function SectionCTA({
  sectionKey,
  defaultPrimaryText,
  defaultPrimaryLink,
  defaultSecondaryText,
  defaultSecondaryLink,
  onPrimaryClick,
  onSecondaryClick,
  className
}: SectionCTAProps) {
  const { getSection } = useHomepageSections()
  const section = getSection(sectionKey)

  const primaryText = section?.ctaText || defaultPrimaryText
  const primaryLink = section?.ctaLink || defaultPrimaryLink
  const secondaryText = section?.secondaryCtaText || defaultSecondaryText
  const secondaryLink = section?.secondaryCtaLink || defaultSecondaryLink
  const buttonColor = section?.ctaButtonColor || section?.accentColor

  if (!primaryText && !secondaryText) return null

  return (
    <div className={className}>
      {primaryText && (
        <a
          href={primaryLink}
          onClick={onPrimaryClick}
          className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium text-white rounded-lg shadow-lg transition-all hover:shadow-xl"
          style={{ 
            backgroundColor: buttonColor || '#10b981',
            boxShadow: buttonColor ? `0 10px 25px -5px ${buttonColor}40` : undefined
          }}
        >
          {primaryText}
        </a>
      )}
      {secondaryText && (
        <a
          href={secondaryLink}
          onClick={onSecondaryClick}
          className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {secondaryText}
        </a>
      )}
    </div>
  )
}
