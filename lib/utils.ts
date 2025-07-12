import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import slug from 'slug'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createSlug(title: string): string {
  return slug(title, { lower: true })
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function formatCategory(category: string): string {
  // Map specific category slugs to their proper display names
  const categoryMap: Record<string, string> = {
    'web-development': 'Web Development',
    'javascript': 'JavaScript',
    'react': 'React',
    'nextjs': 'Next.js',
    'nodejs': 'Node.js',
    'artificial-intelligence': 'Artificial Intelligence',
    'machine-learning': 'Machine Learning',
    'large-language-models': 'Large Language Models',
    'iot': 'Internet of Things (IoT)',
    'robotics': 'Robotics',
    'data-science': 'Data Science',
    'blockchain': 'Blockchain',
    'cybersecurity': 'Cybersecurity',
    'cloud-computing': 'Cloud Computing',
    'devops': 'DevOps',
    'mobile-development': 'Mobile Development',
    'python': 'Python',
    'tutorials': 'Tutorials',
    'tips': 'Tips & Tricks',
    'industry-trends': 'Industry Trends',
    'tech-news': 'Tech News'
  }
  
  return categoryMap[category] || category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

export function getCategoryColor(category: string): string {
  // Map categories to theme colors
  const colorMap: Record<string, string> = {
    'web-development': 'var(--accent-web)',
    'javascript': 'var(--accent-web)',
    'react': 'var(--accent-web)',
    'nextjs': 'var(--accent-web)',
    'nodejs': 'var(--accent-web)',
    'artificial-intelligence': 'var(--accent-ai)',
    'machine-learning': 'var(--accent-ai)',
    'large-language-models': 'var(--accent-ai)',
    'iot': 'var(--accent-iot)',
    'robotics': 'var(--accent-iot)',
    'data-science': 'var(--accent-ai)',
    'blockchain': 'var(--accent-iot)',
    'cybersecurity': 'var(--accent-mobile)',
    'cloud-computing': 'var(--accent-iot)',
    'devops': 'var(--accent-iot)',
    'mobile-development': 'var(--accent-mobile)',
    'python': 'var(--accent-ai)',
    'tutorials': 'var(--accent-chatbot)',
    'tips': 'var(--accent-chatbot)',
    'industry-trends': 'var(--accent-web)',
    'tech-news': 'var(--accent-web)'
  }
  
  return colorMap[category] || 'var(--accent-web)'
}

export function calculateReadingTime(content: string): number {
  // Strip HTML tags and count words
  const plainText = content.replace(/<[^>]*>/g, ' ')
  const words = plainText.trim().split(/\s+/).filter(word => word.length > 0)
  const wordCount = words.length
  
  // Average reading speed is 200 words per minute
  const readingSpeed = 200
  const readingTime = Math.ceil(wordCount / readingSpeed)
  
  return Math.max(1, readingTime) // Minimum 1 minute
}

export function formatReadingTime(minutes: number): string {
  if (minutes === 1) {
    return '1 min read'
  }
  return `${minutes} min read`
} 

/**
 * Unescape HTML entities and convert escaped HTML back to proper HTML
 */
export function unescapeHtml(text: string): string {
  // First handle basic HTML entities
  let result = text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&#x60;/g, '`')
    .replace(/&#x3D;/g, '=')
    .replace(/&nbsp;/g, ' ')
    
  // Handle Unicode escape sequences common in Quill/React content
  result = result
    .replace(/\\u003c/gi, '<')
    .replace(/\\u003e/gi, '>')
    .replace(/\\u0026/gi, '&')
    .replace(/\\u0022/gi, '"')
    .replace(/\\u0027/gi, "'")
    .replace(/\\u002F/gi, '/')
    .replace(/\\u003D/gi, '=')
  
  return result
}

/**
 * Check if content contains escaped HTML
 */
export function isEscapedHtml(content: string): boolean {
  return (
    content.includes('&lt;') || 
    content.includes('&gt;') || 
    content.includes('&amp;') ||
    content.includes('\\u003c') ||
    content.includes('\\u003e') ||
    content.includes('\\u0026')
  )
} 