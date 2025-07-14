import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { sendNewPostNotification } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { postId } = await request.json()

    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
    }

    // Get the post details
    const post = await prisma.post.findUnique({
      where: { id: postId }
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if (!post.isPublished) {
      return NextResponse.json({ error: 'Post must be published to send notifications' }, { status: 400 })
    }

    // Get all active subscribers
    const subscribers = await prisma.subscriber.findMany({
      where: { isActive: true }
    })

    if (subscribers.length === 0) {
      return NextResponse.json({ error: 'No active subscribers found' }, { status: 400 })
    }

    // Send notifications
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

    return NextResponse.json({
      message: 'Post notification sent successfully',
      successCount: result.successCount || 0,
      failedCount: result.failedCount || 0,
      totalSubscribers: subscribers.length
    })
  } catch (error) {
    console.error('Error sending post notification:', error)
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 })
  }
} 