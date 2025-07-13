import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { sendNewPostNotification } from '@/lib/email'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { postId } = await request.json()

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      )
    }

    // Get the post details
    const post = await prisma.post.findUnique({
      where: { id: postId }
    })

    if (!post || !post.isPublished) {
      return NextResponse.json(
        { error: 'Post not found or not published' },
        { status: 404 }
      )
    }

    // Get all active subscribers
    const subscribers = await prisma.subscriber.findMany({
      where: { isActive: true }
    })

    if (subscribers.length === 0) {
      return NextResponse.json(
        { message: 'No active subscribers found' },
        { status: 200 }
      )
    }

    // Send new post notification using our comprehensive email system
    const subscriberEmails = subscribers.map(sub => sub.email)
    
    const result = await sendNewPostNotification({
      title: post.title,
      description: post.description,
      slug: post.slug,
      coverImage: post.coverImage,
      author: post.author,
      category: post.category,
      publishedAt: post.createdAt.toISOString()
    }, subscriberEmails)

    const successCount = result.successCount || 0
    const errorCount = result.failedCount || 0

    return NextResponse.json(
      {
        message: 'Email notifications sent',
        successCount,
        errorCount,
        totalSubscribers: subscribers.length,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error sending notifications:', error)
    return NextResponse.json(
      { error: 'Failed to send notifications' },
      { status: 500 }
    )
  }
} 