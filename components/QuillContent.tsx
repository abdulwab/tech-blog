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
            element.className = 'text-3xl md:text-4xl font-bold text-[var(--text-primary)] mt-12 mb-6 border-b border-[var(--border-primary)] pb-3 scroll-mt-24 leading-tight'
            const h1Element = element as HTMLElement
            h1Element.style.color = 'var(--text-primary)'
            h1Element.style.letterSpacing = '-0.025em'
            break
          case 'h2':
            element.className = 'text-2xl md:text-3xl font-bold text-[var(--text-primary)] mt-10 mb-5 scroll-mt-24 leading-tight'
            const h2Element = element as HTMLElement
            h2Element.style.color = 'var(--text-primary)'
            h2Element.style.letterSpacing = '-0.025em'
            break
          case 'h3':
            element.className = 'text-xl md:text-2xl font-semibold text-[var(--text-primary)] mt-8 mb-4 scroll-mt-24 leading-tight'
            const h3Element = element as HTMLElement
            h3Element.style.color = 'var(--text-primary)'
            h3Element.style.letterSpacing = '-0.025em'
            break
          case 'h4':
            element.className = 'text-lg md:text-xl font-semibold text-[var(--text-primary)] mt-6 mb-3 scroll-mt-24 leading-tight'
            const h4Element = element as HTMLElement
            h4Element.style.color = 'var(--text-primary)'
            break
          case 'h5':
            element.className = 'text-base md:text-lg font-semibold text-[var(--text-primary)] mt-5 mb-3 scroll-mt-24 leading-tight'
            const h5Element = element as HTMLElement
            h5Element.style.color = 'var(--text-primary)'
            break
          case 'h6':
            element.className = 'text-sm md:text-base font-semibold text-[var(--text-primary)] mt-4 mb-2 scroll-mt-24 leading-tight'
            const h6Element = element as HTMLElement
            h6Element.style.color = 'var(--text-primary)'
            break
          case 'p':
            element.className = 'text-[var(--text-primary)] leading-relaxed mb-6 text-base md:text-lg'
            // Force color override for dark mode
            const pElement = element as HTMLElement
            pElement.style.color = 'var(--text-primary)'
            pElement.style.lineHeight = '1.75'
            pElement.style.marginBottom = '1.5rem'
            break
          case 'a':
            element.className = 'text-[var(--accent-web)] hover:text-[var(--accent-iot)] underline decoration-2 underline-offset-2 transition-colors font-medium'
            break
          case 'blockquote':
            element.className = 'border-l-4 border-[var(--accent-web)] pl-6 py-4 italic bg-gradient-to-r from-[var(--background-secondary)] to-transparent rounded-r-lg my-8 text-[var(--text-secondary)] relative shadow-sm'
            const blockquoteElement = element as HTMLElement
            blockquoteElement.style.fontSize = '1.125rem'
            blockquoteElement.style.lineHeight = '1.75'
            // Add quote icon
            const quoteIcon = document.createElement('div')
            quoteIcon.innerHTML = '"'
            quoteIcon.className = 'absolute -left-2 -top-2 text-4xl text-[var(--accent-web)] opacity-30 font-serif'
            blockquoteElement.appendChild(quoteIcon)
            break
          case 'ul':
            element.className = 'mb-6 pl-6 space-y-2 text-[var(--text-primary)] list-disc marker:text-[var(--accent-web)]'
            const ulElement = element as HTMLElement
            ulElement.style.color = 'var(--text-primary)'
            ulElement.style.marginBottom = '1.5rem'
            break
          case 'ol':
            element.className = 'mb-6 pl-6 space-y-2 text-[var(--text-primary)] list-decimal marker:text-[var(--accent-web)] marker:font-semibold'
            const olElement = element as HTMLElement
            olElement.style.color = 'var(--text-primary)'
            olElement.style.marginBottom = '1.5rem'
            break
          case 'li':
            element.className = 'text-[var(--text-primary)] leading-relaxed text-base md:text-lg'
            const liElement = element as HTMLElement
            liElement.style.color = 'var(--text-primary)'
            liElement.style.lineHeight = '1.75'
            liElement.style.marginBottom = '0.5rem'
            break
          case 'code':
            if (element.parentElement?.tagName === 'PRE') {
              element.className = 'bg-transparent p-0 text-inherit text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words font-mono'
            } else {
              element.className = 'bg-[var(--background-secondary)] border border-[var(--border-primary)] px-2 py-1 rounded-md text-sm font-mono text-[var(--accent-web)] whitespace-nowrap font-semibold shadow-sm'
            }
            break
          case 'pre':
            element.className = 'bg-[var(--background-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] p-6 rounded-xl my-8 relative overflow-hidden shadow-lg'
            // Add horizontal scrolling for mobile, but wrap on larger screens
            const preElement = element as HTMLElement
            preElement.style.cssText = `
              overflow-x: auto;
              white-space: pre-wrap;
              word-wrap: break-word;
              max-width: 100%;
              font-size: 0.875rem;
              line-height: 1.5;
            `
            break
          case 'img':
            element.className = 'max-w-full h-auto rounded-xl my-8 border border-[var(--border-primary)] shadow-lg mx-auto block'
            break
          case 'video':
            element.className = 'max-w-full h-auto rounded-xl my-8 shadow-lg mx-auto block'
            break
          case 'table':
            element.className = 'min-w-full border-collapse border border-[var(--border-primary)] my-8 rounded-lg overflow-hidden shadow-sm'
            break
          case 'th':
            element.className = 'bg-[var(--background-secondary)] border border-[var(--border-primary)] px-6 py-4 text-left font-semibold text-[var(--text-primary)] text-sm md:text-base'
            break
          case 'td':
            element.className = 'border border-[var(--border-primary)] px-6 py-4 text-[var(--text-primary)] text-sm md:text-base'
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
            element.className = 'border-t-2 border-[var(--border-primary)] my-12 mx-auto w-24 opacity-50'
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
          // Default to javascript for code blocks without language
          codeElement.className = 'language-javascript'
        }
      })

      // Highlight all code blocks
      Prism.highlightAllUnder(contentRef.current)

      // Add copy button and language badge to code blocks
      const preElements = contentRef.current.querySelectorAll('pre')
      preElements.forEach((pre) => {
        const codeElement = pre.querySelector('code')
        const language = codeElement?.className.match(/language-(\w+)/)?.[1] || 'code'
        
        if (!pre.querySelector('.copy-button')) {
          // Add language badge
          const languageBadge = document.createElement('div')
          languageBadge.className = 'absolute top-3 left-4 bg-[var(--accent-web)] text-white px-2 py-1 rounded text-xs font-medium uppercase tracking-wide'
          languageBadge.textContent = language
          pre.appendChild(languageBadge)

          // Add copy button
          const copyButton = document.createElement('button')
          copyButton.className = 'copy-button absolute top-3 right-4 bg-[var(--background)] hover:bg-[var(--card-bg)] border border-[var(--border-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-3 py-1 rounded-md text-xs transition-all duration-200 font-medium shadow-sm'
          copyButton.textContent = 'Copy'
          copyButton.addEventListener('click', () => {
            const code = pre.querySelector('code')
            if (code) {
              navigator.clipboard.writeText(code.textContent || '')
              copyButton.textContent = 'Copied!'
              copyButton.className = copyButton.className.replace('text-[var(--text-secondary)]', 'text-green-600')
              setTimeout(() => {
                copyButton.textContent = 'Copy'
                copyButton.className = copyButton.className.replace('text-green-600', 'text-[var(--text-secondary)]')
              }, 2000)
            }
          })
          pre.appendChild(copyButton)
        }
      })

      // Add smooth scroll behavior for anchor links
      const anchorLinks = contentRef.current.querySelectorAll('a[href^="#"]')
      anchorLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
          e.preventDefault()
          const href = (link as HTMLAnchorElement).getAttribute('href')
          if (href) {
            const target = document.querySelector(href)
            target?.scrollIntoView({ behavior: 'smooth' })
          }
        })
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
        lineHeight: '1.75',
        fontSize: '1rem'
      }}
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  )
}