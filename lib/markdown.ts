import { remark } from 'remark'
import html from 'remark-html'
import matter from 'gray-matter'

export async function markdownToHtml(markdown: string) {
  const result = await remark()
    .use(html, { sanitize: false })
    .process(markdown)
  return result.toString()
}

export function parseMarkdownWithMatter(content: string) {
  const { data, content: markdownContent } = matter(content)
  return {
    metadata: data,
    content: markdownContent
  }
}

export function extractExcerpt(content: string, maxLength: number = 150): string {
  // Remove markdown syntax and get plain text
  const plainText = content
    .replace(/#{1,6}\s/g, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\n/g, ' ') // Replace newlines with spaces
    .trim()

  return plainText.length > maxLength 
    ? plainText.substring(0, maxLength) + '...'
    : plainText
} 