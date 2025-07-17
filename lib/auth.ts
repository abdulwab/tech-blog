import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

export async function getCurrentUserRole(): Promise<UserRole | null> {
  try {
    const { userId } = auth()
    if (!userId) return null

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true }
    })

    return user?.role || null
  } catch (error) {
    console.error('Error getting user role:', error)
    return null
  }
}

export async function getCurrentUser() {
  try {
    const { userId } = auth()
    if (!userId) return null

    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function checkUserRole(requiredRole: UserRole): Promise<boolean> {
  const userRole = await getCurrentUserRole()
  if (!userRole) return false

  // Admin has access to everything
  if (userRole === 'ADMIN') return true
  
  // Writer has access to writer and viewer content
  if (userRole === 'WRITER' && (requiredRole === 'WRITER' || requiredRole === 'VIEWER')) return true
  
  // Viewer only has access to viewer content
  if (userRole === 'VIEWER' && requiredRole === 'VIEWER') return true

  return false
}

export async function requireRole(requiredRole: UserRole) {
  const hasAccess = await checkUserRole(requiredRole)
  if (!hasAccess) {
    throw new Error(`Access denied. Required role: ${requiredRole}`)
  }
}

export async function isAdmin(): Promise<boolean> {
  return await checkUserRole('ADMIN')
}

export async function isWriter(): Promise<boolean> {
  const userRole = await getCurrentUserRole()
  return userRole === 'ADMIN' || userRole === 'WRITER'
}

export async function syncUserToDatabase() {
  try {
    const { userId } = auth()
    if (!userId) return null

    const clerkUser = await currentUser()
    if (!clerkUser) return null

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (existingUser) {
      // Update existing user
      return await prisma.user.update({
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
    } else {
      // Create new user
      return await prisma.user.create({
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
    }
  } catch (error) {
    console.error('Error syncing user to database:', error)
    return null
  }
}
