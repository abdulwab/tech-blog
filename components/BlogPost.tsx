import Image from 'next/image'
import { formatDate, formatCategory, calculateReadingTime, formatReadingTime } from '@/lib/utils'
import QuillContent from '@/components/QuillContent'
import { Clock } from 'lucide-react'

interface BlogPostProps {
  post: {
    id: string
    title: string
    description: string
    content: string
    coverImage: string
    author: string
    category: string
    createdAt: Date
    tags: string[]
  }
  onContentProcessed?: (processedContent: string) => void
}

export default function BlogPost({ post, onContentProcessed }: BlogPostProps) {
  const readingTime = calculateReadingTime(post.content)
  
  return (
    <article className="w-full py-8 bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <header className="mb-8">
        <div className="mb-4">
          <span className="inline-block bg-[var(--accent-web)]/10 text-[var(--accent-web)] text-sm font-medium px-3 py-1 rounded-full">
            {formatCategory(post.category)}
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4 leading-tight">
          {post.title}
        </h1>
        
        <p className="text-xl text-[var(--text-secondary)] mb-6">
          {post.description}
        </p>
        
        <div className="flex items-center text-sm text-[var(--text-secondary)] space-x-4">
          <span>By {post.author}</span>
          <span>•</span>
          <time dateTime={post.createdAt.toISOString()}>
            {formatDate(post.createdAt)}
          </time>
          <span>•</span>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {formatReadingTime(readingTime)}
          </div>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block bg-[var(--background-secondary)] text-[var(--text-primary)] text-xs font-medium px-2 py-1 rounded border border-[var(--border-primary)]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Cover Image */}
      <div className="mb-8">
        <Image
          src={post.coverImage}
          alt={post.title}
          width={800}
          height={400}
          className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
        />
      </div>

      {/* Content - Now rendering HTML from Quill */}
      <div className="prose prose-lg max-w-none">
        <QuillContent content={post.content} onContentProcessed={onContentProcessed} />
      </div>
    </article>
  )
}