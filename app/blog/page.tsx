import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { formatDate, truncateText, formatCategory, calculateReadingTime, formatReadingTime } from '@/lib/utils'
import { Calendar, User, Tag, Clock } from 'lucide-react'
import CategorySelect from "@/components/CategorySelect";

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
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-8 space-y-8">
              {/* Categories */}
              <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                  Categories
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/blog"
                      className={`flex items-center justify-between py-2 px-3 rounded-md transition-colors ${
                        !category
                          ? 'bg-[var(--accent-web)]/10 text-[var(--accent-web)]'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]'
                      }`}
                    >
                      <span>All Posts</span>
                      <span className="text-sm text-[var(--text-secondary)]">
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
                            ? 'bg-[var(--accent-web)]/10 text-[var(--accent-web)]'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]'
                        }`}
                      >
                        <span className="capitalize">
                          {formatCategory(cat.category)}
                        </span>
                        <span className="text-sm text-[var(--text-secondary)]">
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
              <CategorySelect categories={categories} currentCategory={category} />
            </div>

            {/* Posts Grid */}
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <Link href={`/blog/${post.slug}`}>
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        width={400}
                        height={160}
                        className="w-full h-36 object-cover hover:opacity-90 transition-opacity"
                      />
                    </Link>
                    
                    <div className="p-4">
                      {/* Category and Tags */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-block bg-[var(--accent-web)]/10 text-[var(--accent-web)] text-xs font-medium px-2 py-1 rounded">
                          {formatCategory(post.category)}
                        </span>
                        {post.isFeatured && (
                          <span className="inline-block bg-[var(--accent-ai)]/10 text-[var(--accent-ai)] text-xs font-medium px-2 py-1 rounded">
                            Featured
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <Link href={`/blog/${post.slug}`}>
                        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2 hover:text-[var(--accent-web)] transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                      </Link>

                      {/* Description */}
                      <p className="text-[var(--text-secondary)] mb-3 text-sm line-clamp-2">
                        {truncateText(post.description, 120)}
                      </p>

                      {/* Tags */}
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {post.tags.slice(0, 2).map((tag: string) => (
                            <span
                              key={tag}
                              className="inline-flex items-center text-xs text-[var(--text-secondary)]"
                            >
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </span>
                          ))}
                          {post.tags.length > 2 && (
                            <span className="text-xs text-[var(--text-secondary)]">
                              +{post.tags.length - 2} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Meta */}
                      <div className="flex items-center text-xs text-[var(--text-secondary)] space-x-3">
                        <span>{post.author}</span>
                        <span>•</span>
                        <span>{formatDate(post.createdAt)}</span>
                        <span>•</span>
                        <span>{formatReadingTime(calculateReadingTime(post.content))}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                  No posts found
                </h3>
                <p className="text-[var(--text-secondary)]">
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