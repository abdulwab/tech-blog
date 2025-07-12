import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

// GET all email notifications
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') || 'all'

    const skip = (page - 1) * limit

    const where: any = {}
    if (status !== 'all') {
      where.status = status
    }

    const [notifications, total] = await Promise.all([
      prisma.emailNotification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.emailNotification.count({ where })
    ])

    return NextResponse.json({
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }
}

// POST create new notification
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { subject, content, recipientType, recipientList, scheduledAt } = body

    const notification = await prisma.emailNotification.create({
      data: {
        subject,
        content,
        recipientType,
        recipientList: recipientList || [],
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        createdBy: userId
      }
    })

    return NextResponse.json(notification, { status: 201 })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 })
  }
}

// PUT update notification
export async function PUT(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, subject, content, recipientType, recipientList, scheduledAt } = body

    const notification = await prisma.emailNotification.update({
      where: { id },
      data: {
        subject,
        content,
        recipientType,
        recipientList: recipientList || [],
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null
      }
    })

    return NextResponse.json(notification)
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 })
  }
}

// DELETE notification
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Notification ID required' }, { status: 400 })
    }

    await prisma.emailNotification.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Notification deleted successfully' })
  } catch (error) {
    console.error('Error deleting notification:', error)
    return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 })
  }
} 