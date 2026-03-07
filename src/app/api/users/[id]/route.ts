import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'

type Params = {
  params: { id: string }
}

// GET /api/users/[id] - Get single user
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const user = await db.user.findUnique({
      where: { id: params.id },
      include: {
        bank: {
          select: {
            id: true,
            name: true,
            code: true,
          }
        },
        loans: {
          select: {
            id: true,
            applicationId: true,
            status: true,
            amount: true,
            createdAt: true,
          },
          take: 10,
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: { loans: true }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt?.toISOString(),
        lastLoginAt: user.lastLoginAt?.toISOString(),
        emailVerified: user.emailVerified?.toISOString(),
        phoneVerified: user.phoneVerified?.toISOString(),
        firstVisitAt: user.firstVisitAt?.toISOString(),
      }
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}

// PATCH /api/users/[id] - Update user
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession()
    const body = await request.json()
    const { fullName, email, phone, role, isActive, bankId } = body

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id: params.id }
    })

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if email is being changed and is already taken
    if (email && email !== existingUser.email) {
      const emailTaken = await db.user.findFirst({
        where: { 
          email,
          NOT: { id: params.id }
        }
      })
      if (emailTaken) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 400 })
      }
    }

    // Check if phone is being changed and is already taken
    if (phone && phone !== existingUser.phone) {
      const phoneTaken = await db.user.findFirst({
        where: { 
          phone,
          NOT: { id: params.id }
        }
      })
      if (phoneTaken) {
        return NextResponse.json({ error: 'Phone number already in use' }, { status: 400 })
      }
    }

    // Update user
    const updatedUser = await db.user.update({
      where: { id: params.id },
      data: {
        fullName: fullName || existingUser.fullName,
        email: email !== undefined ? email : existingUser.email,
        phone: phone !== undefined ? phone : existingUser.phone,
        role: role || existingUser.role,
        isActive: isActive !== undefined ? isActive : existingUser.isActive,
        bankId: bankId !== undefined ? bankId : existingUser.bankId,
      },
      include: {
        bank: {
          select: { id: true, name: true, code: true }
        }
      }
    })

    // Create audit log
    await db.auditLog.create({
      data: {
        userId: params.id,
        action: 'USER_UPDATED',
        entityType: 'User',
        entityId: params.id,
        description: `User ${updatedUser.fullName} was updated`,
        changes: JSON.stringify(body)
      }
    })

    return NextResponse.json({
      user: {
        ...updatedUser,
        createdAt: updatedUser.createdAt.toISOString(),
        updatedAt: updatedUser.updatedAt?.toISOString(),
        lastLoginAt: updatedUser.lastLoginAt?.toISOString(),
      }
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

// DELETE /api/users/[id] - Delete user
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { 
            loans: true,
            documents: true,
          }
        }
      }
    })

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Prevent deletion if user has active loans
    if (existingUser._count.loans > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete user with existing loans. Consider deactivating instead.' 
      }, { status: 400 })
    }

    // Delete user's audit logs first (cascade)
    await db.auditLog.deleteMany({
      where: { userId: params.id }
    })

    // Delete user's OAuth accounts
    await db.account.deleteMany({
      where: { userId: params.id }
    })

    // Delete user's notifications
    await db.notification.deleteMany({
      where: { userId: params.id }
    })

    // Delete user
    await db.user.delete({
      where: { id: params.id }
    })

    // Create audit log for the deletion
    await db.auditLog.create({
      data: {
        action: 'USER_DELETED',
        entityType: 'User',
        entityId: params.id,
        description: `User ${existingUser.fullName} (${existingUser.email}) was deleted`,
        changes: JSON.stringify({
          deletedUser: {
            email: existingUser.email,
            fullName: existingUser.fullName,
            role: existingUser.role
          }
        })
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'User deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}
