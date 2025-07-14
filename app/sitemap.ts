import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]

  // Dynamic blog post pages
  let blogPosts: any[] = []
  
  try {
    blogPosts = await prisma.post.findMany({
      where: { isPublished: true },
      select: {
        slug: true,
        updatedAt: true,
        createdAt: true,
        isFeatured: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error)
    // Return static pages only if database is not available
    return staticPages
  }

  const postPages = blogPosts.map((post) => ({
          url: `${baseUrl}/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: post.isFeatured ? 0.9 : 0.7,
  }))

  // Get unique categories for category pages
  let categories: any[] = []
  
  try {
    const categoryData = await prisma.post.findMany({
      where: { isPublished: true },
      select: { category: true },
      distinct: ['category'],
    })
    categories = categoryData
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error)
  }

  const categoryPages = categories.map((cat) => ({
    url: `${baseUrl}/blog?category=${cat.category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...postPages, ...categoryPages]
} 