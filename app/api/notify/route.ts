import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/lib/prisma'
import { sendEmail, createNewPostEmailTemplate } from '@/lib/email'

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

    // Create email template
    const emailHtml = createNewPostEmailTemplate({
      title: post.title,
      description: post.description,
      slug: post.slug,
      coverImage: post.coverImage,
      author: post.author,
    })

    // Send emails in batches to avoid overwhelming the email service
    const batchSize = 50
    const batches = []
    
    for (let i = 0; i < subscribers.length; i += batchSize) {
      batches.push(subscribers.slice(i, i + batchSize))
    }

    let successCount = 0
    let errorCount = 0

    for (const batch of batches) {
      const emailPromises = batch.map(subscriber =>
        sendEmail({
          to: [subscriber.email],
          subject: `New Post: ${post.title}`,
          html: emailHtml,
        })
      )

      const results = await Promise.allSettled(emailPromises)
      
      results.forEach(result => {
        if (result.status === 'fulfilled' && result.value.success) {
          successCount++
        } else {
          errorCount++
        }
      })

      // Wait a bit between batches to avoid rate limiting
      if (batches.indexOf(batch) < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

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