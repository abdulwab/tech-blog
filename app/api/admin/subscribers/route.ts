import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

// GET all subscribers for admin
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all' // all, active, inactive

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.email = {
        contains: search,
        mode: 'insensitive'
      }
    }

    if (status !== 'all') {
      where.isActive = status === 'active'
    }

    const [subscribers, total] = await Promise.all([
      prisma.subscriber.findMany({
        where,
        skip,
        take: limit,
        orderBy: { subscribedAt: 'desc' },
        select: {
          id: true,
          email: true,
          isActive: true,
          subscribedAt: true
        }
      }),
      prisma.subscriber.count({ where })
    ])

    return NextResponse.json({
      subscribers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching subscribers:', error)
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 })
  }
}

// POST create new subscriber
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { email, isActive = true } = body

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 })
    }

    // Check if email already exists
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email }
    })

    if (existingSubscriber) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }

    const subscriber = await prisma.subscriber.create({
      data: {
        email,
        isActive
      }
    })

    return NextResponse.json(subscriber, { status: 201 })
  } catch (error) {
    console.error('Error creating subscriber:', error)
    return NextResponse.json({ error: 'Failed to create subscriber' }, { status: 500 })
  }
}

// PUT update subscriber
export async function PUT(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, email, isActive } = body

    if (!id) {
      return NextResponse.json({ error: 'Subscriber ID is required' }, { status: 400 })
    }

    // Validate email if provided
    if (email && !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 })
    }

    // Check if email already exists (excluding current subscriber)
    if (email) {
      const existingSubscriber = await prisma.subscriber.findUnique({
        where: { email }
      })

      if (existingSubscriber && existingSubscriber.id !== id) {
        return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
      }
    }

    const updateData: any = {}
    if (email !== undefined) updateData.email = email
    if (isActive !== undefined) updateData.isActive = isActive

    const subscriber = await prisma.subscriber.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(subscriber)
  } catch (error) {
    console.error('Error updating subscriber:', error)
    return NextResponse.json({ error: 'Failed to update subscriber' }, { status: 500 })
  }
}

// DELETE subscriber
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Subscriber ID is required' }, { status: 400 })
    }

    await prisma.subscriber.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Subscriber deleted successfully' })
  } catch (error) {
    console.error('Error deleting subscriber:', error)
    return NextResponse.json({ error: 'Failed to delete subscriber' }, { status: 500 })
  }
} 