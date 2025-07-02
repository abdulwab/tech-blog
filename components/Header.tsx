'use client'

import Link from 'next/link'
import { UserButton, useUser } from '@clerk/nextjs'
import { PenTool, BookOpen } from 'lucide-react'

export default function Header() {
  const { isSignedIn } = useUser()

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">TechBlog</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/blog" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Blog
            </Link>
            {isSignedIn && (
              <Link 
                href="/admin" 
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <PenTool className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            )}
          </nav>

          {/* User Button */}
          <div className="flex items-center space-x-4">
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8"
                }
              }}
            />
          </div>
        </div>
      </div>
    </header>
  )
} 