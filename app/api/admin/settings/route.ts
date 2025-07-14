import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

// GET admin settings
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const settings = await prisma.adminSettings.findFirst()
    
    if (!settings) {
      // Create default settings if none exist
      const defaultSettings = await prisma.adminSettings.create({
        data: {
          emailNotifications: true,
          autoNotifyNewPost: true,
          autoNotifyNewSubscriber: true,
          notificationFromEmail: 'noreply@techblog.com',
          notificationFromName: 'Abdul Wahab'
        }
      })
      return NextResponse.json(defaultSettings)
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching admin settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

// PUT update admin settings
export async function PUT(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { emailNotifications, autoNotifyNewPost, autoNotifyNewSubscriber, notificationFromEmail, notificationFromName } = body

    // Check if settings exist
    const existingSettings = await prisma.adminSettings.findFirst()

    let settings
    if (existingSettings) {
      settings = await prisma.adminSettings.update({
        where: { id: existingSettings.id },
        data: {
          emailNotifications,
          autoNotifyNewPost,
          autoNotifyNewSubscriber,
          notificationFromEmail,
          notificationFromName
        }
      })
    } else {
      settings = await prisma.adminSettings.create({
        data: {
          emailNotifications,
          autoNotifyNewPost,
          autoNotifyNewSubscriber,
          notificationFromEmail,
          notificationFromName
        }
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating admin settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
} 