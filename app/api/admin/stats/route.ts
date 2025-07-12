import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

// GET admin dashboard stats
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all stats in parallel
    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      totalSubscribers,
      totalCategories,
      pendingNotifications
    ] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { isPublished: true } }),
      prisma.post.count({ where: { isPublished: false } }),
      prisma.subscriber.count({ where: { isActive: true } }),
      prisma.category.count(),
      prisma.emailNotification.count({ where: { status: 'draft' } })
    ])

    return NextResponse.json({
      totalPosts,
      publishedPosts,
      draftPosts,
      totalSubscribers,
      totalCategories,
      pendingNotifications
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
} 