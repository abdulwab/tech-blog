import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { logActivity } from '@/lib/activity'

// GET all categories
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const categories = await prisma.category.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

// POST create new category
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, slug, description, color, icon } = body

    // Check if category name or slug already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [
          { name },
          { slug }
        ]
      }
    })

    if (existingCategory) {
      return NextResponse.json({ error: 'Category name or slug already exists' }, { status: 400 })
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        color: color || '#60a5fa',
        icon
      }
    })

    // Log activity
    await logActivity({
      type: 'category_created',
      title: `Created new category: "${name}"`,
      details: `Added new blog category for content organization`,
      metadata: {
        categoryId: category.id,
        categoryName: category.name,
        categorySlug: category.slug,
        categoryColor: category.color,
        categoryIcon: category.icon
      },
      createdBy: userId
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}

// PUT update category
export async function PUT(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, name, slug, description, color, icon } = body

    // Check if category name or slug already exists (excluding current category)
    const existingCategory = await prisma.category.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          {
            OR: [
              { name },
              { slug }
            ]
          }
        ]
      }
    })

    if (existingCategory) {
      return NextResponse.json({ error: 'Category name or slug already exists' }, { status: 400 })
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        color,
        icon
      }
    })

    // Log activity
    await logActivity({
      type: 'category_updated',
      title: `Updated category: "${name}"`,
      details: `Category details and styling updated`,
      metadata: {
        categoryId: category.id,
        categoryName: category.name,
        categorySlug: category.slug,
        categoryColor: category.color,
        categoryIcon: category.icon
      },
      createdBy: userId
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

// DELETE category
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Category ID required' }, { status: 400 })
    }

    // Get category details before deletion for logging
    const categoryToDelete = await prisma.category.findUnique({
      where: { id },
      select: { name: true, slug: true, color: true, icon: true }
    })

    // Check if category is being used by any posts
    const postsUsingCategory = await prisma.post.findFirst({
      where: {
        category: {
          in: categoryToDelete ? [categoryToDelete.name] : []
        }
      }
    })

    if (postsUsingCategory) {
      return NextResponse.json({ 
        error: 'Cannot delete category that is being used by posts' 
      }, { status: 400 })
    }

    await prisma.category.delete({
      where: { id }
    })

    // Log activity
    if (categoryToDelete) {
      await logActivity({
        type: 'category_deleted',
        title: `Deleted category: "${categoryToDelete.name}"`,
        details: `Category permanently removed from the system`,
        metadata: {
          categoryId: id,
          categoryName: categoryToDelete.name,
          categorySlug: categoryToDelete.slug,
          categoryColor: categoryToDelete.color,
          categoryIcon: categoryToDelete.icon
        },
        createdBy: userId
      })
    }

    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
} 