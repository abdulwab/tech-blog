import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const clerkUser = await currentUser()
    if (!clerkUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
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
      return NextResponse.json({ user: updatedUser, action: 'updated' })
    } else {
      // Create new user in database
      const newUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          imageUrl: clerkUser.imageUrl,
          role: 'VIEWER', // Default role
          lastSignIn: new Date()
        }
      })
      return NextResponse.json({ user: newUser, action: 'created' })
    }
  } catch (error) {
    console.error('Error syncing user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
