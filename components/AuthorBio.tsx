'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Github, Linkedin, Globe, MessageCircle } from 'lucide-react'

interface AuthorBioProps {
  author: {
    name: string
    bio: string
    avatar?: string
    title?: string
    website?: string
    github?: string
    linkedin?: string
    discord?: string
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
            className="rounded-full border-2 border-[var(--border-primary)]"
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">
              {author.name}
            </h3>
            {author.title && (
              <span className="ml-2 px-2 py-1 bg-[var(--accent-web)] text-white text-xs rounded-full">
                {author.title}
              </span>
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
                title="Portfolio"
              >
                <Globe className="h-5 w-5" />
              </Link>
            )}
            {author.github && (
              <Link
                href={author.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-secondary)] hover:text-[var(--accent-web)] transition-colors"
                title="GitHub"
              >
                <Github className="h-5 w-5" />
              </Link>
            )}
            {author.linkedin && (
              <Link
                href={author.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-secondary)] hover:text-[var(--accent-iot)] transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            )}
            {author.discord && (
              <Link
                href={author.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-secondary)] hover:text-[var(--accent-ai)] transition-colors"
                title="Discord Community"
              >
                <MessageCircle className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 