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
  onContentProcessed?: (processedContent: string) => void
}

export default function QuillContent({ content, className = '', onContentProcessed }: QuillContentProps) {
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

      // Notify parent component about processed content
      if (onContentProcessed) {
        onContentProcessed(processedContent)
      }

      // Apply theme-aware Tailwind classes to HTML elements
      const elements = contentRef.current.querySelectorAll('*')
      
      elements.forEach((element) => {
        const tagName = element.tagName.toLowerCase()
        
        switch (tagName) {
          case 'h1':
            element.className = 'text-3xl font-bold text-[var(--text-primary)] mt-8 mb-4 border-b border-[var(--border-primary)] pb-2 scroll-mt-24'
            const h1Element = element as HTMLElement
            h1Element.style.color = 'var(--text-primary)'
            h1Element.style.lineHeight = '1.2'
            break
          case 'h2':
            element.className = 'text-2xl font-bold text-[var(--text-primary)] mt-7 mb-3 scroll-mt-24'
            const h2Element = element as HTMLElement
            h2Element.style.color = 'var(--text-primary)'
            h2Element.style.lineHeight = '1.2'
            break
          case 'h3':
            element.className = 'text-xl font-semibold text-[var(--text-primary)] mt-6 mb-3 scroll-mt-24'
            const h3Element = element as HTMLElement
            h3Element.style.color = 'var(--text-primary)'
            h3Element.style.lineHeight = '1.2'
            break
          case 'h4':
            element.className = 'text-lg font-semibold text-[var(--text-primary)] mt-5 mb-2 scroll-mt-24'
            const h4Element = element as HTMLElement
            h4Element.style.color = 'var(--text-primary)'
            h4Element.style.lineHeight = '1.2'
            break
          case 'h5':
            element.className = 'text-base font-semibold text-[var(--text-primary)] mt-4 mb-2 scroll-mt-24'
            const h5Element = element as HTMLElement
            h5Element.style.color = 'var(--text-primary)'
            h5Element.style.lineHeight = '1.2'
            break
          case 'h6':
            element.className = 'text-sm font-semibold text-[var(--text-primary)] mt-3 mb-2 scroll-mt-24'
            const h6Element = element as HTMLElement
            h6Element.style.color = 'var(--text-primary)'
            h6Element.style.lineHeight = '1.2'
            break
          case 'p':
            element.className = 'text-[var(--text-primary)] leading-normal mb-4 text-base'
            // Force color override for dark mode
            const pElement = element as HTMLElement
            pElement.style.color = 'var(--text-primary)'
            pElement.style.lineHeight = '1.5'
            pElement.style.marginBottom = '1rem'
            break
          case 'a':
            element.className = 'text-[var(--accent-web)] hover:text-[var(--accent-iot)] underline transition-colors'
            break
          case 'blockquote':
            element.className = 'border-l-4 border-[var(--accent-web)] pl-6 py-2 italic bg-[var(--background-secondary)] rounded-r-lg my-6 text-[var(--text-secondary)] relative before:content-[""] before:absolute before:-left-2 before:top-0 before:text-4xl before:text-[var(--accent-web)] before:opacity-50'
            break
          case 'ul':
            element.className = 'mb-4 pl-6 space-y-1 text-[var(--text-primary)]'
            const ulElement = element as HTMLElement
            ulElement.style.color = 'var(--text-primary)'
            ulElement.style.marginBottom = '1rem'
            break
          case 'ol':
            element.className = 'mb-4 pl-6 space-y-1 text-[var(--text-primary)]'
            const olElement = element as HTMLElement
            olElement.style.color = 'var(--text-primary)'
            olElement.style.marginBottom = '1rem'
            break
          case 'li':
            element.className = 'text-[var(--text-primary)] leading-normal'
            const liElement = element as HTMLElement
            liElement.style.color = 'var(--text-primary)'
            liElement.style.lineHeight = '1.5'
            liElement.style.marginBottom = '0.25rem'
            break
          case 'code':
            if (element.parentElement?.tagName === 'PRE') {
              element.className = 'bg-transparent p-0 text-inherit text-sm leading-relaxed whitespace-pre-wrap break-words'
            } else {
              element.className = 'bg-[var(--background-secondary)] border border-[var(--border-primary)] px-2 py-1 rounded text-sm font-mono text-[var(--accent-web)] whitespace-nowrap'
            }
            break
          case 'pre':
            element.className = 'bg-[var(--background-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] p-4 rounded-lg my-6 relative overflow-hidden'
            // Add horizontal scrolling for mobile, but wrap on larger screens
            const preElement = element as HTMLElement
            preElement.style.cssText = `
              overflow-x: auto;
              white-space: pre-wrap;
              word-wrap: break-word;
              max-width: 100%;
            `
            break
          case 'img':
            element.className = 'max-w-full h-auto rounded-lg my-6 border border-[var(--border-primary)] shadow-sm'
            break
          case 'video':
            element.className = 'max-w-full h-auto rounded-lg my-6'
            break
          case 'table':
            element.className = 'min-w-full border-collapse border border-[var(--border-primary)] my-6 rounded-lg overflow-hidden'
            break
          case 'th':
            element.className = 'bg-[var(--background-secondary)] border border-[var(--border-primary)] px-4 py-3 text-left font-semibold text-[var(--text-primary)]'
            break
          case 'td':
            element.className = 'border border-[var(--border-primary)] px-4 py-3 text-[var(--text-primary)]'
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

      // Add copy button to code blocks
      const preElements = contentRef.current.querySelectorAll('pre')
      preElements.forEach((pre) => {
        if (!pre.querySelector('.copy-button')) {
          const copyButton = document.createElement('button')
          copyButton.className = 'copy-button absolute top-2 right-2 bg-[var(--background)] border border-[var(--border-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-2 py-1 rounded text-xs transition-colors'
          copyButton.textContent = 'Copy'
          copyButton.addEventListener('click', () => {
            const code = pre.querySelector('code')
            if (code) {
              navigator.clipboard.writeText(code.textContent || '')
              copyButton.textContent = 'Copied!'
              setTimeout(() => {
                copyButton.textContent = 'Copy'
              }, 2000)
            }
          })
          pre.appendChild(copyButton)
        }
      })
    }
  }, [content, onContentProcessed])

  // Check if content contains escaped HTML and fix it
  const processedContent = isEscapedHtml(content) ? unescapeHtml(content) : content

  return (
    <div 
      ref={contentRef}
      className={`prose prose-lg max-w-none text-[var(--text-primary)] ${className}`}
      style={{
        color: 'var(--text-primary)',
        lineHeight: '1.5'
      }}
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  )
}