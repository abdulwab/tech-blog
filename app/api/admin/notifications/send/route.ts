import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// POST send notification
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { notificationId } = body

    if (!notificationId) {
      return NextResponse.json({ error: 'Notification ID required' }, { status: 400 })
    }

    // Get notification details
    const notification = await prisma.emailNotification.findUnique({
      where: { id: notificationId }
    })

    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
    }

    if (notification.status === 'sent') {
      return NextResponse.json({ error: 'Notification already sent' }, { status: 400 })
    }

    // Get recipients based on type
    let recipients: string[] = []
    
    if (notification.recipientType === 'all') {
      const subscribers = await prisma.subscriber.findMany({
        select: { email: true }
      })
      recipients = subscribers.map(sub => sub.email)
    } else if (notification.recipientType === 'active') {
      const subscribers = await prisma.subscriber.findMany({
        where: { isActive: true },
        select: { email: true }
      })
      recipients = subscribers.map(sub => sub.email)
    } else if (notification.recipientType === 'specific') {
      recipients = notification.recipientList
    }

    if (recipients.length === 0) {
      return NextResponse.json({ error: 'No recipients found' }, { status: 400 })
    }

    // Send emails in batches to avoid rate limiting
    const batchSize = 10
    let sentCount = 0
    let failedCount = 0

    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize)
      
      try {
        await resend.emails.send({
          from: 'TechBlog <noreply@techblog.com>',
          to: batch,
          subject: notification.subject,
          html: notification.content
        })
        sentCount += batch.length
      } catch (error) {
        console.error('Error sending email batch:', error)
        failedCount += batch.length
      }

      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    // Update notification status
    await prisma.emailNotification.update({
      where: { id: notificationId },
      data: {
        status: 'sent',
        sentAt: new Date(),
        sentCount,
        failedCount
      }
    })

    return NextResponse.json({
      message: 'Notification sent successfully',
      sentCount,
      failedCount,
      totalRecipients: recipients.length
    })
  } catch (error) {
    console.error('Error sending notification:', error)
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 })
  }
} 