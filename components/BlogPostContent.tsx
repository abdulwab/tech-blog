'use client'

import { useState } from 'react'
import BlogPost from './BlogPost'
import TableOfContents from './TableOfContents'

interface BlogPostContentProps {
  post: {
    id: string
    title: string
    content: string
    description: string
    coverImage: string
    author: string
    createdAt: Date
    category: string
    tags: string[]
    slug: string
    isPublished: boolean
    updatedAt: Date
  }
}

export default function BlogPostContent({ post }: BlogPostContentProps) {
  const [processedContent, setProcessedContent] = useState(post.content)

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
      {/* Blog Content */}
      <div className="lg:col-span-8 xl:col-span-9">
        <BlogPost 
          post={post} 
          onContentProcessed={setProcessedContent}
        />
      </div>

      {/* Table of Contents Sidebar */}
      <div className="hidden lg:block lg:col-span-4 xl:col-span-3">
        <div className="sticky top-24">
          <TableOfContents content={processedContent} />
        </div>
      </div>
    </div>
  )
} 