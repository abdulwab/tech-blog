import Link from 'next/link'
import { BookOpen, Github, Twitter, Linkedin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">TechBlog</span>
            </Link>
            <p className="text-gray-300 mb-4 max-w-md">
              A modern tech blog delivering cutting-edge insights, tutorials, and industry news 
              to help developers and tech enthusiasts stay ahead of the curve.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
                  All Posts
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog?category=web-development" className="text-gray-300 hover:text-white transition-colors">
                  Web Development
                </Link>
              </li>
              <li>
                <Link href="/blog?category=javascript" className="text-gray-300 hover:text-white transition-colors">
                  JavaScript
                </Link>
              </li>
              <li>
                <Link href="/blog?category=react" className="text-gray-300 hover:text-white transition-colors">
                  React
                </Link>
              </li>
              <li>
                <Link href="/blog?category=nextjs" className="text-gray-300 hover:text-white transition-colors">
                  Next.js
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {currentYear} TechBlog. All rights reserved. Built with Next.js and ❤️
          </p>
        </div>
      </div>
    </footer>
  )
} 