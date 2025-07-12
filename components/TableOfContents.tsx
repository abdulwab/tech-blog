'use client'

import { useState, useEffect } from 'react'
import { ChevronRight, List } from 'lucide-react'

interface TOCItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Extract headings from HTML content
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6')
    
    const items: TOCItem[] = Array.from(headings).map((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1))
      const text = heading.textContent || ''
      const id = `heading-${index}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
      
      // Add id to the heading if it doesn't have one
      heading.id = id
      
      return { id, text, level }
    })

    setTocItems(items)
  }, [content])

  useEffect(() => {
    // Update heading IDs in the actual DOM
    tocItems.forEach((item) => {
      const element = document.getElementById(item.id)
      if (!element) {
        // Find the heading by text content and add the ID
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
        Array.from(headings).forEach((heading) => {
          if (heading.textContent === item.text && !heading.id) {
            heading.id = item.id
          }
        })
      }
    })
  }, [tocItems])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-20% 0% -35% 0%',
        threshold: 0
      }
    )

    tocItems.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [tocItems])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const yOffset = -100 // Account for sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
    setIsOpen(false)
  }

  if (tocItems.length === 0) return null

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-30 bg-[var(--accent-web)] text-white p-3 rounded-full shadow-lg hover:bg-[var(--accent-iot)] transition-colors"
        aria-label="Toggle table of contents"
      >
        <List className="w-5 h-5" />
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Table of Contents */}
      <aside
        className={`
          fixed lg:sticky top-24 right-4 lg:right-0 z-50 lg:z-10
          w-80 lg:w-64 max-h-[calc(100vh-8rem)] 
          bg-[var(--card-bg)] border border-[var(--card-border)] 
          rounded-lg shadow-lg lg:shadow-none overflow-hidden
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-4 border-b border-[var(--border-primary)]">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center">
            <List className="w-4 h-4 mr-2" />
            Table of Contents
          </h3>
        </div>
        
        <nav className="overflow-y-auto max-h-96 lg:max-h-[calc(100vh-12rem)]">
          <ul className="py-2">
            {tocItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollToHeading(item.id)}
                  className={`
                    w-full text-left px-4 py-2 text-sm transition-colors
                    flex items-center hover:bg-[var(--hover-bg)]
                    ${activeId === item.id 
                      ? 'text-[var(--accent-web)] bg-[var(--accent-web)]/10 border-r-2 border-[var(--accent-web)]' 
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }
                  `}
                  style={{ 
                    paddingLeft: `${(item.level - 1) * 12 + 16}px`
                  }}
                >
                  {item.level > 2 && (
                    <ChevronRight className="w-3 h-3 mr-1 flex-shrink-0" />
                  )}
                  <span className="line-clamp-2">{item.text}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Progress indicator */}
        <div className="p-3 border-t border-[var(--border-primary)] bg-[var(--background-secondary)]">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span>Reading Progress</span>
            <span>{Math.round((activeId ? tocItems.findIndex(item => item.id === activeId) + 1 : 1) / tocItems.length * 100)}%</span>
          </div>
          <div className="w-full bg-[var(--border-primary)] rounded-full h-1.5 mt-1">
            <div 
              className="bg-[var(--accent-web)] h-1.5 rounded-full transition-all duration-300"
              style={{ 
                width: `${(activeId ? tocItems.findIndex(item => item.id === activeId) + 1 : 1) / tocItems.length * 100}%` 
              }}
            />
          </div>
        </div>
      </aside>
    </>
  )
} 