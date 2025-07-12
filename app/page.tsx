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
        take: 6,
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
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[var(--accent-web)] via-[var(--accent-ai)] to-[var(--accent-iot)] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Welcome to <span className="text-[var(--accent-chatbot)]">TechBlog</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white/90">
            Discover cutting-edge insights, tutorials, and industry trends that shape the future of technology.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center px-8 py-3 bg-white text-[var(--accent-web)] font-semibold rounded-lg hover:bg-[var(--hover-bg)] transition-colors"
          >
            Explore Articles
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-16 bg-[var(--background-secondary)]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-[var(--text-primary)]">
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <Link href={`/blog/${post.slug}`}>
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <span className="inline-block bg-[var(--accent-web)]/10 text-[var(--accent-web)] text-xs font-medium px-2 py-1 rounded">
                        {formatCategory(post.category)}
                      </span>
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3 hover:text-[var(--accent-web)] transition-colors">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-[var(--text-secondary)] mb-4">
                      {truncateText(post.description, 120)}
                    </p>
                    <div className="flex items-center text-sm text-[var(--text-secondary)] space-x-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {post.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(post.createdAt)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatReadingTime(calculateReadingTime(post.content))}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Posts */}
      <section className="py-16 bg-[var(--background)]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--text-primary)]">Latest Articles</h2>
            <Link
              href="/blog"
              className="text-[var(--accent-web)] hover:text-[var(--accent-iot)] font-medium flex items-center"
            >
              View All Posts
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <article
                key={post.id}
                className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <Link href={`/blog/${post.slug}`}>
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    width={400}
                    height={200}
                    className="w-full h-40 object-cover hover:opacity-90 transition-opacity"
                  />
                </Link>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <span className="inline-block bg-[var(--background-secondary)] text-[var(--text-primary)] text-xs font-medium px-2 py-1 rounded border border-[var(--border-primary)]">
                      {formatCategory(post.category)}
                    </span>
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2 hover:text-[var(--accent-web)] transition-colors">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-[var(--text-secondary)] text-sm mb-4">
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

      {/* Newsletter Subscription */}
      <section className="py-16 bg-[var(--background-secondary)]">
        <div className="container mx-auto px-4">
          <SubscriptionForm />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[var(--background)]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg">
              <div className="text-4xl font-bold text-[var(--accent-web)] mb-2">50+</div>
              <p className="text-[var(--text-secondary)]">Published Articles</p>
            </div>
            <div className="p-6 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg">
              <div className="text-4xl font-bold text-[var(--accent-ai)] mb-2">10K+</div>
              <p className="text-[var(--text-secondary)]">Monthly Readers</p>
            </div>
            <div className="p-6 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg">
              <div className="text-4xl font-bold text-[var(--accent-iot)] mb-2">5+</div>
              <p className="text-[var(--text-secondary)]">Categories Covered</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 