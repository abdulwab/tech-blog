import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ posts: [] })
    }

    const searchQuery = query.trim()

    // Search in title, description, content, and tags
    const posts = await prisma.post.findMany({
      where: {
        isPublished: true,
        OR: [
          {
            title: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            content: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            tags: {
              hasSome: [searchQuery],
            },
          },
          {
            category: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            author: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        coverImage: true,
        author: true,
        category: true,
        tags: true,
        createdAt: true,
        content: true,
      },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' },
      ],
      take: 20, // Limit results
    })

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error searching posts:', error)
    return NextResponse.json(
      { error: 'Failed to search posts', posts: [] },
      { status: 500 }
    )
  }
} 