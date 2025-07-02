import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')

    const where: any = { isPublished: true }

    if (category) {
      where.category = category
    }

    if (featured === 'true') {
      where.isFeatured = true
    }

    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : undefined,
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

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

    const body = await request.json()
    const {
      title,
      slug,
      description,
      content,
      coverImage,
      author,
      category,
      tags,
      isFeatured,
      isPublished,
    } = body

    // Validate required fields
    if (!title || !slug || !description || !content || !coverImage || !author || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingPost = await prisma.post.findUnique({
      where: { slug }
    })

    if (existingPost) {
      return NextResponse.json(
        { error: 'Post with this slug already exists' },
        { status: 409 }
      )
    }

    // Create the post
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        description,
        content,
        coverImage,
        author,
        category,
        tags: tags || [],
        isFeatured: isFeatured || false,
        isPublished: isPublished || false,
      },
    })

    // If published, trigger email notification
    if (isPublished) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            postId: post.id,
          }),
        })
      } catch (emailError) {
        console.error('Failed to send notification emails:', emailError)
        // Don't fail the post creation if email fails
      }
    }

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
} 