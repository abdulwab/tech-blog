'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'
import SearchModal from './SearchModal'
import { Search } from 'lucide-react'

export default function Header() {
  const pathname = usePathname()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true
    if (path !== '/' && pathname.startsWith(path)) return true
    return false
  }

  // Handle keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-40 bg-[var(--card-bg)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--card-bg)]/60 border-b border-[var(--card-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link 
                href="/" 
                className="text-xl font-bold text-[var(--text-primary)] hover:text-[var(--accent-web)] transition-colors"
              >
                Abdul Wahab
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-[var(--accent-web)] bg-[var(--accent-web)]/10' 
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)]'
                }`}
              >
                Home
              </Link>
              <Link
                href="/blog"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/blog') 
                    ? 'text-[var(--accent-web)] bg-[var(--accent-web)]/10' 
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)]'
                }`}
              >
                Blog
              </Link>
              <Link
                href="/about"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/about') 
                    ? 'text-[var(--accent-web)] bg-[var(--accent-web)]/10' 
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)]'
                }`}
              >
                About
              </Link>
              <Link
                href="/contact"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/contact') 
                    ? 'text-[var(--accent-web)] bg-[var(--accent-web)]/10' 
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)]'
                }`}
              >
                Contact
              </Link>
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Search button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center space-x-2 p-2 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-colors"
                aria-label="Search"
                title="Search posts (⌘K)"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Search</span>
                <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 border border-[var(--border-primary)] rounded text-xs">
                  ⌘K
                </kbd>
              </button>
              
              {/* Theme toggle */}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  )
} 