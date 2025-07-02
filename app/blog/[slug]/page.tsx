import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import BlogPost from '@/components/BlogPost'
import SubscriptionForm from '@/components/SubscriptionForm'
import Link from 'next/link'
import { ArrowLeft, Share2, Twitter, Linkedin, Facebook } from 'lucide-react'

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
        authors: [post.author],
        images: [
          {
            url: post.coverImage,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.description,
        images: [post.coverImage],
      },
    }
  } catch (error) {
    // If database is not available during build, return basic metadata
    return {
      title: 'TechBlog Post',
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

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`
  const shareText = `Check out this article: ${post.title}`

  return (
    <div className="min-h-screen bg-white">
      {/* Back Navigation */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Blog Post */}
      <BlogPost post={post} />

      {/* Share Section */}
      <div className="max-w-4xl mx-auto px-4 py-8 border-t">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Share this article</h3>
          <div className="flex space-x-4">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-500 hover:text-blue-700 transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-500 hover:text-blue-800 transition-colors"
            >
              <Facebook className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="bg-gray-50 py-16">
          <div className="max-w-4xl mx-auto px-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <article
                  key={relatedPost.id}
                  className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <img
                    src={relatedPost.coverImage}
                    alt={relatedPost.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded mb-2">
                      {relatedPost.category}
                    </span>
                    <Link href={`/blog/${relatedPost.slug}`}>
                      <h4 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                        {relatedPost.title}
                      </h4>
                    </Link>
                    <p className="text-sm text-gray-600 line-clamp-2">
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
      <div className="bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <SubscriptionForm />
        </div>
      </div>
    </div>
  )
} 