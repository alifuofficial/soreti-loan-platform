import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { writeFile, mkdir, unlink } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

// POST - Upload profile image
export async function POST(request: NextRequest) {
  try {
    console.log('[Profile Image] Starting upload...')
    
    const session = await auth()
    console.log('[Profile Image] Session:', session?.user?.id ? 'Found' : 'Not found')
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    console.log('[Profile Image] File received:', file ? `${file.name} (${file.size} bytes)` : 'No file')

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Invalid file type. Please upload an image.' }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'profiles')
    console.log('[Profile Image] Uploads directory:', uploadsDir)
    
    try {
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true })
        console.log('[Profile Image] Created directory')
      }
    } catch (mkdirError) {
      console.error('[Profile Image] Error creating directory:', mkdirError)
      return NextResponse.json({ error: 'Failed to create upload directory' }, { status: 500 })
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const fileName = `${session.user.id}-${Date.now()}.${fileExtension}`
    const filePath = path.join(uploadsDir, fileName)
    console.log('[Profile Image] File path:', filePath)

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    try {
      await writeFile(filePath, buffer)
      console.log('[Profile Image] File written successfully')
    } catch (writeError) {
      console.error('[Profile Image] Error writing file:', writeError)
      return NextResponse.json({ error: 'Failed to save file' }, { status: 500 })
    }

    // Generate public URL
    const imageUrl = `/uploads/profiles/${fileName}`

    // Update user in database
    await db.user.update({
      where: { id: session.user.id },
      data: { image: imageUrl }
    })
    console.log('[Profile Image] Database updated with URL:', imageUrl)

    return NextResponse.json({ 
      success: true,
      imageUrl 
    })
  } catch (error) {
    console.error('[Profile Image] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Failed to upload image: ' + (error instanceof Error ? error.message : 'Unknown error') }, 
      { status: 500 }
    )
  }
}

// DELETE - Remove profile image
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get current user to find existing image
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { image: true }
    })

    // Delete file if exists
    if (user?.image) {
      const filePath = path.join(process.cwd(), 'public', user.image)
      if (existsSync(filePath)) {
        try {
          await unlink(filePath)
        } catch (e) {
          // Ignore file deletion errors
        }
      }
    }

    // Update user in database to remove image
    await db.user.update({
      where: { id: session.user.id },
      data: { image: null }
    })

    return NextResponse.json({ 
      success: true,
      message: 'Profile image removed' 
    })
  } catch (error) {
    console.error('Error removing profile image:', error)
    return NextResponse.json(
      { error: 'Failed to remove image' }, 
      { status: 500 }
    )
  }
}
