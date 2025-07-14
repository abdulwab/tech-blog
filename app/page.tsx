import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { formatDate, truncateText, formatCategory, calculateReadingTime, formatReadingTime } from '@/lib/utils'
import SubscriptionForm from '@/components/SubscriptionForm'
import { ArrowRight, Calendar, User, Clock } from 'lucide-react'

export default async function HomePage() {
  // Fetch featured and recent posts
  let featuredPosts: any[] = []
  let recentPosts: any[] = []
  
  try {
    const [featured, recent] = await Promise.all([
      prisma.post.findMany({
        where: { isPublished: true, isFeatured: true },
        orderBy: { createdAt: 'desc' },
        take: 3,
      }),
      prisma.post.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' },
        take: 8,
      }),
    ])
    featuredPosts = featured
    recentPosts = recent
  } catch (error) {
    console.log('Database not available during build, rendering with empty data')
    // Will render with empty arrays, causing sections to be hidden
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-12 bg-[var(--background-secondary)]">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                Featured Articles
              </h2>
              <Link
                href="/blog"
                className="text-[var(--accent-web)] hover:text-[var(--accent-iot)] font-medium flex items-center text-sm"
              >
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <Link href={`/${post.slug}`}>
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      width={400}
                      height={200}
                      className="w-full h-36 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      <span className="inline-block bg-[var(--accent-web)]/10 text-[var(--accent-web)] text-xs font-medium px-2 py-1 rounded">
                        {formatCategory(post.category)}
                      </span>
                    </div>
                    <Link href={`/${post.slug}`}>
                      <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 hover:text-[var(--accent-web)] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-[var(--text-secondary)] mb-3 text-sm line-clamp-2">
                      {truncateText(post.description, 100)}
                    </p>
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
          </div>
        </section>
      )}

      {/* Recent Posts */}
      <section className="py-12 bg-[var(--background)]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Latest Articles</h2>
            <Link
              href="/blog"
              className="text-[var(--accent-web)] hover:text-[var(--accent-iot)] font-medium flex items-center text-sm"
            >
              View All Posts
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentPosts.map((post) => (
              <article
                key={post.id}
                className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <Link href={`/${post.slug}`}>
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    width={400}
                    height={160}
                    className="w-full h-32 object-cover hover:opacity-90 transition-opacity"
                  />
                </Link>
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <span className="inline-block bg-[var(--background-secondary)] text-[var(--text-primary)] text-xs font-medium px-2 py-1 rounded border border-[var(--border-primary)]">
                      {formatCategory(post.category)}
                    </span>
                  </div>
                  <Link href={`/${post.slug}`}>
                    <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2 hover:text-[var(--accent-web)] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-[var(--text-secondary)] text-sm mb-3 line-clamp-2">
                    {truncateText(post.description, 80)}
                  </p>
                  <div className="flex items-center text-xs text-[var(--text-secondary)] space-x-2">
                    <span>{post.author}</span>
                    <span>•</span>
                    <span>{formatReadingTime(calculateReadingTime(post.content))}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-12 bg-[var(--background-secondary)]">
        <div className="container mx-auto px-4">
          <SubscriptionForm />
        </div>
      </section>
    </div>
  )
} 