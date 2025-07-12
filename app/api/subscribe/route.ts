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

    // Log activity
    await logActivity({
      type: 'subscriber_added',
      title: `New subscriber joined: ${email}`,
      details: `New subscriber joined through the website subscription form`,
      metadata: {
        subscriberId: subscriber.id,
        email: email,
        source: 'website_form',
        action: 'subscribed'
      }
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

    // Get subscriber details before deactivation
    const subscriber = await prisma.subscriber.findUnique({
      where: { email }
    })

    // Deactivate subscription instead of deleting
    await prisma.subscriber.update({
      where: { email },
      data: { isActive: false }
    })

    // Log activity
    if (subscriber) {
      await logActivity({
        type: 'subscriber_deactivated',
        title: `Subscriber unsubscribed: ${email}`,
        details: `Subscriber unsubscribed through the website`,
        metadata: {
          subscriberId: subscriber.id,
          email: email,
          source: 'website_form',
          action: 'unsubscribed'
        }
      })
    }

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