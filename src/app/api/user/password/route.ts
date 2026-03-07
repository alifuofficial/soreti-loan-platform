import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

// PUT - Change password
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { currentPassword, newPassword } = body

    // Validation
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ 
        error: 'Current password and new password are required' 
      }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ 
        error: 'New password must be at least 8 characters' 
      }, { status: 400 })
    }

    // Get user with password
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { 
        id: true, 
        password: true,
        authProvider: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user signed up with social auth (no password)
    if (user.authProvider !== 'credentials' && !user.password) {
      return NextResponse.json({ 
        error: 'Cannot change password for social login accounts. Please set a password first.' 
      }, { status: 400 })
    }

    // Verify current password
    if (user.password) {
      const isValidPassword = await bcrypt.compare(currentPassword, user.password)
      if (!isValidPassword) {
        return NextResponse.json({ 
          error: 'Current password is incorrect' 
        }, { status: 400 })
      }
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Update password
    await db.user.update({
      where: { id: session.user.id },
      data: { 
        password: hashedPassword,
        authProvider: 'credentials' // Ensure provider is set
      }
    })

    return NextResponse.json({ 
      success: true,
      message: 'Password changed successfully' 
    })
  } catch (error) {
    console.error('Error changing password:', error)
    return NextResponse.json(
      { error: 'Failed to change password' }, 
      { status: 500 }
    )
  }
}
