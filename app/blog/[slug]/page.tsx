import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import BlogPostContent from '@/components/BlogPostContent'
import AuthorBio from '@/components/AuthorBio'
import SubscriptionForm from '@/components/SubscriptionForm'
import Link from 'next/link'
import { ArrowLeft, Share2, Twitter, Linkedin, Facebook } from 'lucide-react'
import { formatCategory, calculateReadingTime } from '@/lib/utils'

interface PageProps {
  params: {
    slug: string
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const post = await prisma.post.findUnique({
      where: { slug: params.slug, isPublished: true },
    })

    if (!post) {
      return {
        title: 'Post Not Found',
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com'
    const postUrl = `${baseUrl}/blog/${post.slug}`

    return {
      title: post.title,
      description: post.description,
      keywords: post.tags.join(', '),
      authors: [{ name: post.author }],
      openGraph: {
        title: post.title,
        description: post.description,
        type: 'article',
        publishedTime: post.createdAt.toISOString(),
        modifiedTime: post.updatedAt.toISOString(),
        authors: [post.author],
        url: postUrl,
        images: [
          {
            url: post.coverImage,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
        tags: post.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.description,
        images: [post.coverImage],
      },
      alternates: {
        canonical: postUrl,
      },
    }
  } catch (error) {
    // If database is not available during build, return basic metadata
    return {
      title: 'Abdul Wahab - Blog Post',
      description: 'Read the latest tech articles on our blog',
    }
  }
}

// Generate static params for static generation
export async function generateStaticParams() {
  try {
    const posts = await prisma.post.findMany({
      where: { isPublished: true },
      select: { slug: true },
    })

    return posts.map((post) => ({
      slug: post.slug,
    }))
  } catch (error) {
    // If database is not available during build (e.g., on Vercel), return empty array
    // Pages will be generated dynamically at runtime instead
    console.log('Database not available during build, using dynamic generation')
    return []
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug, isPublished: true },
  })

  if (!post) {
    notFound()
  }

  // Get related posts
  const relatedPosts = await prisma.post.findMany({
    where: {
      isPublished: true,
      category: post.category,
      id: { not: post.id },
    },
    orderBy: { createdAt: 'desc' },
    take: 3,
  })

  // Author information - You can customize this based on your needs
  const authorInfo = {
    name: post.author,
    bio: 'A passionate developer sharing insights about technology, programming, and industry trends. Always learning and building innovative solutions.',
    avatar: '/default-avatar.svg', // You can replace with actual author avatars
                    title: 'Abdul Wahab - Developer & Content Creator',
    website: 'https://your-portfolio.com',
    github: 'yourusername',
    twitter: 'yourusername',
    linkedin: 'yourusername',
    email: 'your@email.com'
  }

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`
  const shareText = `Check out this article: ${post.title}`

  // Calculate reading time
  const readingTime = calculateReadingTime(post.content)

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.coverImage,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
                    name: 'Abdul Wahab',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_APP_URL}/default-avatar.svg`,
      },
    },
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': shareUrl,
    },
    keywords: post.tags.join(', '),
    wordCount: calculateReadingTime(post.content) * 200, // Approximate word count
    timeRequired: `PT${readingTime}M`,
    articleSection: formatCategory(post.category),
    about: {
      '@type': 'Thing',
      name: formatCategory(post.category),
    },
  }

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <div className="min-h-screen bg-[var(--background)]">
        {/* Back Navigation */}
        <div className="bg-[var(--background-secondary)] border-b border-[var(--border-primary)]">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Link
              href="/blog"
              className="inline-flex items-center text-[var(--accent-web)] hover:text-[var(--accent-iot)] transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </div>
        </div>

        {/* Main Content with TOC */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <BlogPostContent post={post} />

          {/* Author Bio */}
          <div className="max-w-4xl mx-auto lg:max-w-none lg:pl-0">
            <AuthorBio author={authorInfo} />
          </div>

          {/* Share Section */}
          <div className="max-w-4xl mx-auto lg:max-w-none lg:pl-0 py-8 border-t border-[var(--border-primary)]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Share this article</h3>
              <div className="flex space-x-4">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-web)] transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-iot)] transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-ai)] transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="bg-[var(--background-secondary)] py-16">
            <div className="max-w-7xl mx-auto px-4">
              <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-8">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <article
                    key={relatedPost.id}
                    className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={relatedPost.coverImage}
                      alt={relatedPost.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4">
                      <span className="inline-block bg-[var(--accent-web)]/10 text-[var(--accent-web)] text-xs font-medium px-2 py-1 rounded mb-2">
                        {formatCategory(relatedPost.category)}
                      </span>
                      <Link href={`/blog/${relatedPost.slug}`}>
                        <h4 className="font-semibold text-[var(--text-primary)] hover:text-[var(--accent-web)] transition-colors mb-2 line-clamp-2">
                          {relatedPost.title}
                        </h4>
                      </Link>
                      <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
                        {relatedPost.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="bg-[var(--background)] py-16">
          <div className="max-w-7xl mx-auto px-4">
            <SubscriptionForm />
          </div>
        </div>
      </div>
    </>
  )
} 