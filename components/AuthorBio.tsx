'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Github, Twitter, Linkedin, Globe, Mail } from 'lucide-react'

interface AuthorBioProps {
  author: {
    name: string
    bio: string
    avatar?: string
    title?: string
    website?: string
    github?: string
    twitter?: string
    linkedin?: string
    email?: string
  }
}

export default function AuthorBio({ author }: AuthorBioProps) {
  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-6 mt-8">
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <Image
            src={author.avatar || '/default-avatar.svg'}
            alt={author.name}
            width={80}
            height={80}
            className="w-20 h-20 rounded-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
              {author.name}
            </h3>
            {author.title && (
              <p className="text-sm text-[var(--text-secondary)] mb-2">
                {author.title}
              </p>
            )}
          </div>

          <p className="text-[var(--text-secondary)] mb-4 leading-relaxed">
            {author.bio}
          </p>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            {author.website && (
              <Link
                href={author.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-secondary)] hover:text-[var(--accent-web)] transition-colors"
                title="Website"
              >
                <Globe className="h-5 w-5" />
              </Link>
            )}
            {author.github && (
              <Link
                href={`https://github.com/${author.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-secondary)] hover:text-[var(--accent-web)] transition-colors"
                title="GitHub"
              >
                <Github className="h-5 w-5" />
              </Link>
            )}
            {author.twitter && (
              <Link
                href={`https://twitter.com/${author.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-secondary)] hover:text-[var(--accent-web)] transition-colors"
                title="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
            )}
            {author.linkedin && (
              <Link
                href={`https://linkedin.com/in/${author.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-secondary)] hover:text-[var(--accent-iot)] transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            )}
            {author.email && (
              <Link
                href={`mailto:${author.email}`}
                className="text-[var(--text-secondary)] hover:text-[var(--accent-ai)] transition-colors"
                title="Email"
              >
                <Mail className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 