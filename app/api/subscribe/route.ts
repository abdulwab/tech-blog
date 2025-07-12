import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logActivity } from '@/lib/activity'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email }
    })

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return NextResponse.json(
          { error: 'Email is already subscribed' },
          { status: 409 }
        )
      } else {
        // Reactivate subscription
        await prisma.subscriber.update({
          where: { email },
          data: { isActive: true }
        })

        // Log activity
        await logActivity({
          type: 'subscriber_activated',
          title: `Subscriber reactivated: ${email}`,
          details: `Subscriber reactivated their subscription through the website`,
          metadata: {
            subscriberId: existingSubscriber.id,
            email: email,
            source: 'website_form',
            action: 'reactivated'
          }
        })

        return NextResponse.json(
          { message: 'Subscription reactivated successfully' },
          { status: 200 }
        )
      }
    }

    // Create new subscriber
    const subscriber = await prisma.subscriber.create({
      data: {
        email,
        isActive: true,
      },
    })

    return NextResponse.json(
      { message: 'Successfully subscribed to newsletter' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating subscription:', error)
    return NextResponse.json(
      { error: 'Failed to process subscription' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Deactivate subscription instead of deleting
    await prisma.subscriber.update({
      where: { email },
      data: { isActive: false }
    })

    return NextResponse.json(
      { message: 'Successfully unsubscribed' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error unsubscribing:', error)
    return NextResponse.json(
      { error: 'Failed to unsubscribe' },
      { status: 500 }
    )
  }
} 