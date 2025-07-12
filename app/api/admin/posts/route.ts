import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { logActivity } from '@/lib/activity'

// GET all posts for admin (includes unpublished)
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const status = searchParams.get('status') || 'all' // all, published, draft
    const featured = searchParams.get('featured') || 'all' // all, true, false

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } }
      ]
    }

    if (category && category !== 'all') {
      where.category = category
    }

    if (status !== 'all') {
      where.isPublished = status === 'published'
    }

    if (featured !== 'all') {
      where.isFeatured = featured === 'true'
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          coverImage: true,
          author: true,
          category: true,
          tags: true,
          isPublished: true,
          isFeatured: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.post.count({ where })
    ])

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

// POST create new post
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, slug, description, content, coverImage, category, tags, isFeatured, isPublished, author } = body

    // Check if slug already exists
    const existingPost = await prisma.post.findUnique({
      where: { slug }
    })

    if (existingPost) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        description,
        content,
        coverImage,
        category,
        tags: tags || [],
        isFeatured: isFeatured || false,
        isPublished: isPublished || false,
        author: author || 'Admin'
      }
    })

    // Log activity
    const activityType = isPublished ? 'post_published' : 'post_created'
    const activityTitle = isPublished 
      ? `Published new post: "${title}"`
      : `Created new draft post: "${title}"`
    
    await logActivity({
      type: activityType,
      title: activityTitle,
      details: `${isPublished ? 'Published' : 'Created'} post in ${category} category`,
      metadata: {
        postId: post.id,
        postSlug: post.slug,
        category: post.category,
        tags: post.tags,
        author: post.author
      },
      createdBy: userId
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}

// PUT update post
export async function PUT(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, title, slug, description, content, coverImage, category, tags, isFeatured, isPublished, author } = body

    // Check if slug already exists (excluding current post)
    const existingPost = await prisma.post.findUnique({
      where: { slug }
    })

    if (existingPost && existingPost.id !== id) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    }

    // Get the current post to check for status changes
    const currentPost = await prisma.post.findUnique({
      where: { id }
    })

    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        content,
        coverImage,
        category,
        tags: tags || [],
        isFeatured,
        isPublished,
        author
      }
    })

    // Log activity based on changes
    if (currentPost) {
      if (!currentPost.isPublished && isPublished) {
        // Post was published
        await logActivity({
          type: 'post_published',
          title: `Published post: "${title}"`,
          details: `Post moved from draft to published status`,
          metadata: {
            postId: post.id,
            postSlug: post.slug,
            category: post.category,
            previousStatus: 'draft',
            newStatus: 'published'
          },
          createdBy: userId
        })
      } else if (currentPost.isFeatured !== isFeatured) {
        // Featured status changed
        await logActivity({
          type: isFeatured ? 'post_featured' : 'post_unfeatured',
          title: `${isFeatured ? 'Featured' : 'Unfeatured'} post: "${title}"`,
          details: `Post ${isFeatured ? 'added to' : 'removed from'} featured section`,
          metadata: {
            postId: post.id,
            postSlug: post.slug,
            category: post.category,
            featured: isFeatured
          },
          createdBy: userId
        })
      } else {
        // Regular update
        await logActivity({
          type: 'post_updated',
          title: `Updated post: "${title}"`,
          details: `Post content and metadata updated`,
          metadata: {
            postId: post.id,
            postSlug: post.slug,
            category: post.category,
            tags: post.tags
          },
          createdBy: userId
        })
      }
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

// DELETE post
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 })
    }

    // Get post details before deletion for logging
    const postToDelete = await prisma.post.findUnique({
      where: { id },
      select: { title: true, slug: true, category: true }
    })

    await prisma.post.delete({
      where: { id }
    })

    // Log activity
    if (postToDelete) {
      await logActivity({
        type: 'post_deleted',
        title: `Deleted post: "${postToDelete.title}"`,
        details: `Post permanently removed from the system`,
        metadata: {
          postId: id,
          postSlug: postToDelete.slug,
          category: postToDelete.category
        },
        createdBy: userId
      })
    }

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
} 