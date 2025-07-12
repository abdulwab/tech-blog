'use client'

import { useEffect, useRef } from 'react'
import Prism from 'prismjs'
import { unescapeHtml, isEscapedHtml } from '@/lib/utils'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-markdown'

interface QuillContentProps {
  content: string
  className?: string
}

export default function QuillContent({ content, className = '' }: QuillContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      // Check if content contains escaped HTML and fix it
      let processedContent = content
      if (isEscapedHtml(content)) {
        processedContent = unescapeHtml(content)
        console.log('Detected and fixed escaped HTML content')
      }

      // Update the content if it was fixed
      if (processedContent !== content) {
        contentRef.current.innerHTML = processedContent
      }

      // Apply theme-aware Tailwind classes to HTML elements
      const elements = contentRef.current.querySelectorAll('*')
      
      elements.forEach((element) => {
        const tagName = element.tagName.toLowerCase()
        
        switch (tagName) {
          case 'h1':
            element.className = 'text-3xl font-bold text-[var(--text-primary)] mt-8 mb-4 border-b border-[var(--border-primary)] pb-2 scroll-mt-24'
            break
          case 'h2':
            element.className = 'text-2xl font-bold text-[var(--text-primary)] mt-6 mb-3 scroll-mt-24'
            break
          case 'h3':
            element.className = 'text-xl font-bold text-[var(--text-primary)] mt-4 mb-2 scroll-mt-24'
            break
          case 'h4':
            element.className = 'text-lg font-semibold text-[var(--text-primary)] mt-3 mb-2 scroll-mt-24'
            break
          case 'h5':
            element.className = 'text-base font-semibold text-[var(--text-primary)] mt-2 mb-1 scroll-mt-24'
            break
          case 'h6':
            element.className = 'text-sm font-semibold text-[var(--text-primary)] mt-2 mb-1 scroll-mt-24'
            break
          case 'p':
            element.className = 'text-[var(--text-primary)] leading-relaxed mb-4'
            break
          case 'a':
            element.className = 'text-[var(--accent-web)] hover:text-[var(--accent-iot)] underline transition-colors'
            break
          case 'blockquote':
            element.className = 'border-l-4 border-[var(--accent-web)] pl-4 italic bg-[var(--background-secondary)] p-4 rounded-r-lg my-4 text-[var(--text-secondary)]'
            break
          case 'ul':
          case 'ol':
            element.className = 'mb-4 pl-6 text-[var(--text-primary)]'
            break
          case 'li':
            element.className = 'mb-1 text-[var(--text-primary)]'
            break
          case 'code':
            if (element.parentElement?.tagName === 'PRE') {
              element.className = 'bg-transparent p-0 text-inherit text-sm'
            } else {
              element.className = 'bg-[var(--background-secondary)] border border-[var(--border-primary)] px-1 py-0.5 rounded text-sm font-mono text-[var(--accent-web)]'
            }
            break
          case 'pre':
            element.className = 'bg-[var(--background-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] p-4 rounded-lg overflow-x-auto my-4 relative'
            break
          case 'img':
            element.className = 'max-w-full h-auto rounded-lg my-4 border border-[var(--border-primary)]'
            break
          case 'video':
            element.className = 'max-w-full h-auto rounded-lg my-4'
            break
          case 'table':
            element.className = 'min-w-full border-collapse border border-[var(--border-primary)] my-4'
            break
          case 'th':
            element.className = 'bg-[var(--background-secondary)] border border-[var(--border-primary)] px-4 py-2 text-left font-semibold text-[var(--text-primary)]'
            break
          case 'td':
            element.className = 'border border-[var(--border-primary)] px-4 py-2 text-[var(--text-primary)]'
            break
          case 'strong':
          case 'b':
            element.className = 'font-bold text-[var(--text-primary)]'
            break
          case 'em':
          case 'i':
            element.className = 'italic text-[var(--text-primary)]'
            break
          case 'hr':
            element.className = 'border-t border-[var(--border-primary)] my-8'
            break
        }
      })

      // Apply syntax highlighting to code blocks
      const codeBlocks = contentRef.current.querySelectorAll('pre code')
      codeBlocks.forEach((block) => {
        const codeElement = block as HTMLElement
        
        // Try to detect language from class name
        const className = codeElement.className
        const languageMatch = className.match(/language-(\w+)/)
        
        if (languageMatch) {
          const language = languageMatch[1]
          
          // Map some common language aliases
          const languageMap: { [key: string]: string } = {
            'js': 'javascript',
            'ts': 'typescript',
            'py': 'python',
            'sh': 'bash',
            'shell': 'bash',
            'yml': 'yaml'
          }
          
          const mappedLanguage = languageMap[language] || language
          codeElement.className = `language-${mappedLanguage}`
        } else {
          // Default to python for code blocks without language
          codeElement.className = 'language-python'
        }
      })

      // Highlight all code blocks
      Prism.highlightAllUnder(contentRef.current)
    }
  }, [content])

  // Check if content contains escaped HTML and fix it
  const processedContent = isEscapedHtml(content) ? unescapeHtml(content) : content

  return (
    <div 
      ref={contentRef}
      className={`prose prose-lg max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  )
}