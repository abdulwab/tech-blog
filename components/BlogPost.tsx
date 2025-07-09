import Image from 'next/image'
import { formatDate } from '@/lib/utils'
import QuillContent from '@/components/QuillContent'

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
}

export default function BlogPost({ post }: BlogPostProps) {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        <div className="mb-4">
          <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            {post.category}
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          {post.title}
        </h1>
        
        <p className="text-xl text-gray-600 mb-6">
          {post.description}
        </p>
        
        <div className="flex items-center text-sm text-gray-500 space-x-4">
          <span>By {post.author}</span>
          <span>•</span>
          <time dateTime={post.createdAt.toISOString()}>
            {formatDate(post.createdAt)}
          </time>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded"
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
      <QuillContent content={post.content} />
    </article>
  )
}