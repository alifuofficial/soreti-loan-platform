import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// Default appearance settings
const DEFAULT_APPEARANCE = {
  primaryColor: '#10b981',
  secondaryColor: '#14b8a6',
  accentColor: '#10b981',
  logoUrl: '',
  logoDarkUrl: '',
  faviconUrl: '',
  fontFamily: 'Inter',
  borderRadius: '0.75rem',
}

// GET - Fetch appearance settings
export async function GET(request: NextRequest) {
  try {
    const settings = await db.setting.findUnique({
      where: { key: 'appearance' }
    })

    if (!settings) {
      // Return defaults
      return NextResponse.json({ 
        data: DEFAULT_APPEARANCE 
      })
    }

    const appearanceSettings = JSON.parse(settings.value)
    return NextResponse.json({ 
      data: { ...DEFAULT_APPEARANCE, ...appearanceSettings } 
    })
  } catch (error) {
    console.error('Error fetching appearance settings:', error)
    return NextResponse.json({ 
      data: DEFAULT_APPEARANCE 
    })
  }
}

// PUT - Update appearance settings (admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || !['SUPER_ADMIN', 'ADMIN', 'CEO', 'GENERAL_MANAGER', 'MARKETING_MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      primaryColor, 
      secondaryColor, 
      accentColor,
      logoUrl,
      logoDarkUrl,
      faviconUrl,
      fontFamily,
      borderRadius,
      updateHomepageSections 
    } = body

    // Build the appearance settings object
    const appearanceSettings = {
      primaryColor: primaryColor || DEFAULT_APPEARANCE.primaryColor,
      secondaryColor: secondaryColor || DEFAULT_APPEARANCE.secondaryColor,
      accentColor: accentColor || DEFAULT_APPEARANCE.accentColor,
      logoUrl: logoUrl || '',
      logoDarkUrl: logoDarkUrl || '',
      faviconUrl: faviconUrl || '',
      fontFamily: fontFamily || DEFAULT_APPEARANCE.fontFamily,
      borderRadius: borderRadius || DEFAULT_APPEARANCE.borderRadius,
    }

    // Save to database
    await db.setting.upsert({
      where: { key: 'appearance' },
      create: {
        key: 'appearance',
        value: JSON.stringify(appearanceSettings),
        description: 'Platform appearance settings',
        updatedBy: session.user.id
      },
      update: {
        value: JSON.stringify(appearanceSettings),
        updatedBy: session.user.id
      }
    })

    // If updateHomepageSections is true, update all homepage sections with new accent color
    if (updateHomepageSections && accentColor) {
      await db.homepageSection.updateMany({
        data: {
          accentColor: accentColor,
          ctaButtonColor: accentColor
        }
      })
    }

    return NextResponse.json({ 
      success: true, 
      data: appearanceSettings 
    })
  } catch (error) {
    console.error('Error updating appearance settings:', error)
    return NextResponse.json({ 
      error: 'Failed to update appearance settings' 
    }, { status: 500 })
  }
}
