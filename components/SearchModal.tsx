'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Search, X, Clock, User } from 'lucide-react'
import { formatDate, formatCategory, calculateReadingTime, formatReadingTime, truncateText } from '@/lib/utils'

interface SearchResult {
  id: string
  title: string
  slug: string
  description: string
  coverImage: string
  author: string
  category: string
  tags: string[]
  createdAt: string
  content: string
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      setQuery('')
      setResults([])
      setSelectedIndex(-1)
    }
  }, [isOpen])

  useEffect(() => {
    const searchPosts = async () => {
      if (query.trim().length < 2) {
        setResults([])
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await response.json()
        setResults(data.posts || [])
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    const debounce = setTimeout(searchPosts, 300)
    return () => clearTimeout(debounce)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      const result = results[selectedIndex]
      router.push(`/blog/${result.slug}`)
      onClose()
    }
  }

  const handleResultClick = (slug: string) => {
    router.push(`/blog/${slug}`)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="flex items-start justify-center min-h-screen pt-20 px-4">
        <div 
          className="w-full max-w-2xl bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex items-center px-4 py-3 border-b border-[var(--border-primary)]">
            <Search className="w-5 h-5 text-[var(--text-secondary)] mr-3" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search articles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none"
            />
            <button
              onClick={onClose}
              className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--accent-web)]"></div>
                <span className="ml-3 text-[var(--text-secondary)]">Searching...</span>
              </div>
            )}

            {!isLoading && query.trim().length >= 2 && results.length === 0 && (
              <div className="text-center py-8 text-[var(--text-secondary)]">
                No articles found for "{query}"
              </div>
            )}

            {!isLoading && query.trim().length < 2 && (
              <div className="text-center py-8 text-[var(--text-secondary)]">
                Type at least 2 characters to search
              </div>
            )}

            {!isLoading && results.length > 0 && (
              <div className="py-2">
                {results.map((result, index) => (
                  <div
                    key={result.id}
                    className={`flex items-start space-x-3 px-4 py-3 cursor-pointer transition-colors ${
                      index === selectedIndex 
                        ? 'bg-[var(--hover-bg)]' 
                        : 'hover:bg-[var(--hover-bg)]'
                    }`}
                    onClick={() => handleResultClick(result.slug)}
                  >
                    <Image
                      src={result.coverImage}
                      alt={result.title}
                      width={60}
                      height={40}
                      className="w-15 h-10 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-[var(--text-primary)] line-clamp-1">
                        {result.title}
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mt-1">
                        {truncateText(result.description, 100)}
                      </p>
                      <div className="flex items-center space-x-3 mt-2 text-xs text-[var(--text-secondary)]">
                        <span className="inline-block bg-[var(--accent-web)]/10 text-[var(--accent-web)] px-2 py-0.5 rounded">
                          {formatCategory(result.category)}
                        </span>
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {result.author}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatReadingTime(calculateReadingTime(result.content))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-[var(--border-primary)] text-xs text-[var(--text-secondary)]">
            <div className="flex items-center justify-between">
              <span>Use ↑↓ to navigate, Enter to select, Esc to close</span>
              <span>{results.length > 0 && `${results.length} results`}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 