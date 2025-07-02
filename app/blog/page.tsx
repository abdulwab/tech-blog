import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { formatDate, truncateText } from '@/lib/utils'
import { Calendar, User, Tag } from 'lucide-react'

interface SearchParams {
  category?: string
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { category } = searchParams

  // Build the where clause
  const where: any = { isPublished: true }
  if (category) {
    where.category = category
  }

  // Fetch posts and categories
  let posts: any[] = []
  let categories: any[] = []
  
  try {
    const [postsData, categoriesData] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.post.groupBy({
        by: ['category'],
        where: { isPublished: true },
        _count: {
          category: true,
        },
      }),
    ])
    posts = postsData
    categories = categoriesData
  } catch (error) {
    console.log('Database not available during build, rendering with empty data')
    // Will render with empty arrays
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Blog Posts
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our collection of articles covering the latest in technology, 
              web development, and programming tutorials.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-8 space-y-8">
              {/* Categories */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Categories
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/blog"
                      className={`flex items-center justify-between py-2 px-3 rounded-md transition-colors ${
                        !category
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span>All Posts</span>
                      <span className="text-sm text-gray-500">
                        {posts.length}
                      </span>
                    </Link>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat.category}>
                      <Link
                        href={`/blog?category=${cat.category}`}
                        className={`flex items-center justify-between py-2 px-3 rounded-md transition-colors ${
                          category === cat.category
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <span className="capitalize">
                          {cat.category.replace('-', ' ')}
                        </span>
                        <span className="text-sm text-gray-500">
                          {cat._count.category}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9">
            {/* Mobile Category Filter */}
            <div className="lg:hidden mb-6">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={category || ''}
                onChange={(e) => {
                  const newCategory = e.target.value
                  const url = newCategory ? `/blog?category=${newCategory}` : '/blog'
                  window.location.href = url
                }}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.category} value={cat.category}>
                    {cat.category.replace('-', ' ')} ({cat._count.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Posts Grid */}
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <Link href={`/blog/${post.slug}`}>
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
                      />
                    </Link>
                    
                    <div className="p-6">
                      {/* Category and Tags */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                          {post.category}
                        </span>
                        {post.isFeatured && (
                          <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded">
                            Featured
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <Link href={`/blog/${post.slug}`}>
                        <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                      </Link>

                      {/* Description */}
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {truncateText(post.description, 150)}
                      </p>

                      {/* Tags */}
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {post.tags.slice(0, 3).map((tag: string) => (
                            <span
                              key={tag}
                              className="inline-flex items-center text-xs text-gray-500"
                            >
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="text-xs text-gray-400">
                              +{post.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Meta */}
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {post.author}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(post.createdAt)}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No posts found
                </h3>
                <p className="text-gray-600">
                  {category 
                    ? `No posts found in the "${category}" category.`
                    : 'No posts have been published yet.'
                  }
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
} 