import { auth, currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const clerkUser = await currentUser()
    if (!clerkUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get the referer URL to determine default role
    const referer = request.headers.get('referer') || ''
    const isWriterRoute = referer.includes('/writer')
    const isAdminRoute = referer.includes('/admin')
    
    // Determine default role based on route
    let defaultRole = 'VIEWER'
    if (isWriterRoute) {
      defaultRole = 'WRITER'
    } else if (isAdminRoute) {
      defaultRole = 'VIEWER' // Admin routes should still default to VIEWER for security
    }

    // Check if user already exists in database
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (existingUser) {
      // Update existing user with latest info from Clerk
      const updatedUser = await prisma.user.update({
        where: { clerkId: userId },
        data: {
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          imageUrl: clerkUser.imageUrl,
          lastSignIn: new Date(),
          isActive: true
        }
      })
      return NextResponse.json({ 
        user: updatedUser, 
        action: 'updated',
        role: updatedUser.role,
        message: `User updated successfully. Current role: ${updatedUser.role}`
      })
    } else {
      // Create new user in database with appropriate default role
      const newUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          imageUrl: clerkUser.imageUrl,
          role: defaultRole as any, // Use determined default role
          lastSignIn: new Date()
        }
      })
      return NextResponse.json({ 
        user: newUser, 
        action: 'created',
        role: newUser.role,
        message: `User created successfully with role: ${newUser.role}`
      })
    }
  } catch (error) {
    console.error('Error syncing user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
