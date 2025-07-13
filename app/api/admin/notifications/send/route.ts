import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { sendNewsletterEmail, createNewsletterTemplate } from '@/lib/email'
import { logActivity } from '@/lib/activity'

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

    // Send newsletter using our new email system
    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/subscribe?action=unsubscribe`
    
    const result = await sendNewsletterEmail({
      subject: notification.subject,
      content: notification.content,
      unsubscribeUrl
    }, recipients)

    const sentCount = result.successCount || 0
    const failedCount = result.failedCount || 0

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

    // Log activity
    await logActivity({
      type: 'notification_sent',
      title: `Newsletter sent: "${notification.subject}"`,
      details: `Newsletter successfully delivered to ${sentCount} subscribers${failedCount > 0 ? `, ${failedCount} failed` : ''}`,
      metadata: {
        notificationId: notification.id,
        subject: notification.subject,
        recipientCount: sentCount,
        failedCount: failedCount,
        totalRecipients: recipients.length,
        recipientType: notification.recipientType
      },
      createdBy: userId
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