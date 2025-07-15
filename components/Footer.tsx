import Link from 'next/link'
import { BookOpen, Github, Linkedin, MessageCircle, Globe } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[var(--background-secondary)] border-t border-[var(--border-primary)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-[var(--accent-web)]" />
              <span className="text-xl font-bold text-[var(--text-primary)]">Abdul Wahab</span>
            </Link>
            <p className="text-[var(--text-secondary)] mb-4 max-w-md">
              Personal blog sharing insights, tutorials, and development journey by Abdul Wahab 
              to help developers and tech enthusiasts stay ahead of the curve.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/abdulwab" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-secondary)] hover:text-[var(--accent-web)] transition-colors footer-social-icons"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://www.linkedin.com/in/abdul-wahab-7bb7b490/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-secondary)] hover:text-[var(--accent-iot)] transition-colors footer-social-icons"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="https://discord.gg/VkAW9rEn" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-secondary)] hover:text-[var(--accent-ai)] transition-colors footer-social-icons"
                aria-label="Discord Community"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a 
                href="https://www.abdulwahab.live/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-secondary)] hover:text-[var(--accent-web)] transition-colors footer-social-icons"
                aria-label="Portfolio"
              >
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-[var(--text-secondary)] hover:text-[var(--accent-web)] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-[var(--text-secondary)] hover:text-[var(--accent-web)] transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[var(--text-secondary)] hover:text-[var(--accent-web)] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[var(--text-secondary)] hover:text-[var(--accent-web)] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog?category=ai" className="text-[var(--text-secondary)] hover:text-[var(--accent-ai)] transition-colors">
                  AI & ML
                </Link>
              </li>
              <li>
                <Link href="/blog?category=web" className="text-[var(--text-secondary)] hover:text-[var(--accent-web)] transition-colors">
                  Web Development
                </Link>
              </li>
              <li>
                <Link href="/blog?category=iot" className="text-[var(--text-secondary)] hover:text-[var(--accent-iot)] transition-colors">
                  IoT & Robotics
                </Link>
              </li>
              <li>
                <Link href="/blog?category=mobile" className="text-[var(--text-secondary)] hover:text-[var(--accent-mobile)] transition-colors">
                  Mobile Development
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-[var(--border-primary)]">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-[var(--text-secondary)] text-sm">
              © {currentYear} Abdul Wahab. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-[var(--text-secondary)] hover:text-[var(--accent-web)] text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-[var(--text-secondary)] hover:text-[var(--accent-web)] text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 