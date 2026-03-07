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

// GET - Fetch a single section
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const section = await db.homepageSection.findUnique({
      where: { id }
    })
    
    if (!section) {
      return errorResponse('Section not found', 404)
    }
    
    return successResponse(section)
  } catch (error) {
    console.error('Error fetching section:', error)
    return errorResponse('Failed to fetch section', 500)
  }
}

// PUT - Update a section
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || !['SUPER_ADMIN', 'ADMIN', 'CEO', 'GENERAL_MANAGER', 'MARKETING_MANAGER'].includes(session.user.role)) {
      return errorResponse('Unauthorized', 401)
    }
    
    const { id } = await params
    const body = await request.json()
    
    const section = await db.homepageSection.update({
      where: { id },
      data: {
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
        isEnabled: body.isEnabled,
        lastModifiedBy: session.user.id
      }
    })
    
    return successResponse(section)
  } catch (error) {
    console.error('Error updating section:', error)
    return errorResponse('Failed to update section', 500)
  }
}

// DELETE - Delete a section
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || !['SUPER_ADMIN', 'ADMIN', 'CEO'].includes(session.user.role)) {
      return errorResponse('Unauthorized', 401)
    }
    
    const { id } = await params
    
    await db.homepageSection.delete({
      where: { id }
    })
    
    return successResponse({ message: 'Section deleted successfully' })
  } catch (error) {
    console.error('Error deleting section:', error)
    return errorResponse('Failed to delete section', 500)
  }
}
