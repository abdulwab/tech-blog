import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'

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

      {/* Content */}
      <div className="prose prose-lg prose-blue max-w-none">
        <ReactMarkdown
          components={{
            code(props) {
              const { children, className } = props
              const match = /language-(\w+)/.exec(className || '')
              return match ? (
                <SyntaxHighlighter
                  language={match[1]}
                  style={tomorrow}
                  className="rounded-lg"
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className}>
                  {children}
                </code>
              )
            },
            h1: ({ children }) => (
              <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-3">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xl font-bold text-gray-900 mt-4 mb-2">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="text-gray-700 leading-relaxed mb-4">
                {children}
              </p>
            ),
            a: ({ href, children }) => (
              <a 
                href={href}
                className="text-blue-600 hover:text-blue-800 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-blue-500 pl-4 italic bg-blue-50 p-4 rounded-r-lg my-4">
                {children}
              </blockquote>
            ),
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  )
}