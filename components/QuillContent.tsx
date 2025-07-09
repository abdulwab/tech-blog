'use client'

import { useEffect, useRef } from 'react'

interface QuillContentProps {
  content: string
  className?: string
}

export default function QuillContent({ content, className = '' }: QuillContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      // Apply Tailwind classes to Quill-generated HTML elements
      const elements = contentRef.current.querySelectorAll('*')
      
      elements.forEach((element) => {
        const tagName = element.tagName.toLowerCase()
        
        switch (tagName) {
          case 'h1':
            element.className = 'text-3xl font-bold text-gray-900 mt-8 mb-4'
            break
          case 'h2':
            element.className = 'text-2xl font-bold text-gray-900 mt-6 mb-3'
            break
          case 'h3':
            element.className = 'text-xl font-bold text-gray-900 mt-4 mb-2'
            break
          case 'p':
            element.className = 'text-gray-700 leading-relaxed mb-4'
            break
          case 'a':
            element.className = 'text-blue-600 hover:text-blue-800 underline'
            break
          case 'blockquote':
            element.className = 'border-l-4 border-blue-500 pl-4 italic bg-blue-50 p-4 rounded-r-lg my-4'
            break
          case 'ul':
          case 'ol':
            element.className = 'mb-4 pl-6'
            break
          case 'li':
            element.className = 'mb-1'
            break
          case 'code':
            if (element.parentElement?.tagName === 'PRE') {
              element.className = 'bg-transparent p-0 text-inherit'
            } else {
              element.className = 'bg-gray-100 px-1 py-0.5 rounded text-sm font-mono'
            }
            break
          case 'pre':
            element.className = 'bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4'
            break
          case 'img':
            element.className = 'max-w-full h-auto rounded-lg my-4'
            break
          case 'video':
            element.className = 'max-w-full h-auto rounded-lg my-4'
            break
        }
      })
    }
  }, [content])

  return (
    <div 
      ref={contentRef}
      className={`prose prose-lg max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}