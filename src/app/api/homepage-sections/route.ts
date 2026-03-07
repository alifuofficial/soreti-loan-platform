import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// Helper to create consistent API responses
function successResponse(data: any) {
  return NextResponse.json({ data })
}

function errorResponse(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status })
}

// Default sections configuration
const DEFAULT_SECTIONS = [
  {
    sectionKey: 'hero',
    title: 'Get Financing for Quality Products',
    subtitle: "Ethiopia's #1 Loan Platform",
    description: "Soreti's loan origination platform connects you with Ethiopia's leading banks. Fast approvals, competitive rates, and a seamless experience from application to disbursement.",
    backgroundColor: 'linear-gradient(to bottom right, #f9fafb, #ffffff, rgba(16, 185, 129, 0.05))',
    textColor: '#111827',
    accentColor: '#10b981',
    ctaText: 'Apply Now',
    ctaLink: '#register',
    secondaryCtaText: 'Watch Demo',
    secondaryCtaLink: '#demo',
    order: 1
  },
  {
    sectionKey: 'mobile_apps',
    title: 'Get Soreti on Your Mobile',
    subtitle: 'Coming Soon',
    description: 'iOS & Android apps launching soon. Apply for loans on the go!',
    backgroundColor: 'linear-gradient(to right, #111827, #1f2937, #111827)',
    textColor: '#ffffff',
    accentColor: '#10b981',
    order: 2
  },
  {
    sectionKey: 'how_it_works',
    title: 'How It Works',
    subtitle: 'Simple steps to get your loan',
    description: 'Get financing in four easy steps',
    backgroundColor: '#ffffff',
    textColor: '#111827',
    accentColor: '#10b981',
    order: 3
  },
  {
    sectionKey: 'banks',
    title: 'Our Partner Banks',
    subtitle: 'Trusted financial institutions',
    description: 'Compare and select from our trusted partner banks',
    backgroundColor: '#f9fafb',
    textColor: '#111827',
    accentColor: '#10b981',
    order: 4
  },
  {
    sectionKey: 'products',
    title: 'Featured Products',
    subtitle: 'Finance what you need',
    description: 'Browse products available for financing',
    backgroundColor: '#ffffff',
    textColor: '#111827',
    accentColor: '#10b981',
    order: 5
  },
  {
    sectionKey: 'testimonials',
    title: 'What Our Customers Say',
    subtitle: 'Real stories from real customers',
    description: 'See what our satisfied customers have to say',
    backgroundColor: '#f9fafb',
    textColor: '#111827',
    accentColor: '#10b981',
    order: 6
  },
  {
    sectionKey: 'stats',
    title: 'Our Impact in Numbers',
    subtitle: 'Trusted by thousands',
    description: 'Key statistics about our platform',
    backgroundColor: '#ffffff',
    textColor: '#111827',
    accentColor: '#10b981',
    order: 7
  },
  {
    sectionKey: 'contact',
    title: 'Get in Touch',
    subtitle: 'Contact us',
    description: 'Have questions? We are here to help.',
    backgroundColor: '#111827',
    textColor: '#ffffff',
    accentColor: '#10b981',
    ctaText: 'Contact Us',
    ctaLink: '#contact',
    order: 8
  },
  {
    sectionKey: 'footer',
    title: 'Soreti',
    subtitle: 'Ethiopia\'s Leading Loan Platform',
    description: 'Connecting you with trusted banks for all your financing needs',
    backgroundColor: '#111827',
    textColor: '#ffffff',
    accentColor: '#10b981',
    order: 9
  }
]

// GET - Fetch all homepage sections
export async function GET(request: NextRequest) {
  try {
    const sections = await db.homepageSection.findMany({
      orderBy: { order: 'asc' }
    })
    
    // If no sections exist, seed defaults
    if (sections.length === 0) {
      const seededSections = await Promise.all(
        DEFAULT_SECTIONS.map(section => 
          db.homepageSection.create({ data: section })
        )
      )
      return successResponse(seededSections)
    }
    
    return successResponse(sections)
  } catch (error) {
    console.error('Error fetching homepage sections:', error)
    return errorResponse('Failed to fetch homepage sections', 500)
  }
}

// POST - Seed default sections (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || !['SUPER_ADMIN', 'ADMIN', 'CEO', 'GENERAL_MANAGER', 'MARKETING_MANAGER'].includes(session.user.role)) {
      return errorResponse('Unauthorized', 401)
    }
    
    const body = await request.json()
    
    // If seeding defaults
    if (body.seedDefaults) {
      // Delete existing sections
      await db.homepageSection.deleteMany()
      
      // Create default sections
      const sections = await Promise.all(
        DEFAULT_SECTIONS.map(section => 
          db.homepageSection.create({
            data: {
              ...section,
              lastModifiedBy: session.user.id
            }
          })
        )
      )
      
      return successResponse(sections)
    }
    
    // Create a new section
    const section = await db.homepageSection.create({
      data: {
        sectionKey: body.sectionKey,
        title: body.title,
        subtitle: body.subtitle,
        description: body.description,
        content: body.content,
        backgroundColor: body.backgroundColor,
        textColor: body.textColor,
        accentColor: body.accentColor,
        customCss: body.customCss,
        backgroundImage: body.backgroundImage,
        backgroundImageUrl: body.backgroundImageUrl,
        ctaText: body.ctaText,
        ctaLink: body.ctaLink,
        ctaButtonColor: body.ctaButtonColor,
        secondaryCtaText: body.secondaryCtaText,
        secondaryCtaLink: body.secondaryCtaLink,
        order: body.order || 0,
        isEnabled: body.isEnabled ?? true,
        lastModifiedBy: session.user.id
      }
    })
    
    return successResponse(section)
  } catch (error) {
    console.error('Error creating homepage section:', error)
    return errorResponse('Failed to create homepage section', 500)
  }
}

// PUT - Update multiple sections order (admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || !['SUPER_ADMIN', 'ADMIN', 'CEO', 'GENERAL_MANAGER', 'MARKETING_MANAGER'].includes(session.user.role)) {
      return errorResponse('Unauthorized', 401)
    }
    
    const body = await request.json()
    const { sections } = body
    
    if (!Array.isArray(sections)) {
      return errorResponse('Sections must be an array')
    }
    
    // Update order for each section
    const updates = sections.map((section, index) => 
      db.homepageSection.update({
        where: { id: section.id },
        data: { 
          order: index,
          lastModifiedBy: session.user.id
        }
      })
    )
    
    await Promise.all(updates)
    
    const updatedSections = await db.homepageSection.findMany({
      orderBy: { order: 'asc' }
    })
    
    return successResponse(updatedSections)
  } catch (error) {
    console.error('Error updating sections order:', error)
    return errorResponse('Failed to update sections order', 500)
  }
}
