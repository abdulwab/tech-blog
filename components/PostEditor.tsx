'use client'

import { useState } from 'react'
import { createSlug } from '@/lib/utils'
import { Save, Eye, Upload } from 'lucide-react'
import QuillEditor from './QuillEditor'

interface PostFormData {
  title: string
  description: string
  content: string
  coverImage: string
  author: string
  category: string
  tags: string
  isFeatured: boolean
  isPublished: boolean
}

interface PostEditorProps {
  initialData?: PostFormData & { id?: string; slug?: string }
  onSave?: () => void
  onCancel?: () => void
}

export default function PostEditor({ initialData, onSave, onCancel }: PostEditorProps) {
  const [formData, setFormData] = useState<PostFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    content: initialData?.content || '',
    coverImage: initialData?.coverImage || '',
    author: initialData?.author || '',
    category: initialData?.category || '',
    tags: initialData?.tags || '',
    isFeatured: initialData?.isFeatured || false,
    isPublished: initialData?.isPublished || false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [preview, setPreview] = useState(false)
  const isEditing = Boolean(initialData?.id)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const slug = initialData?.slug || createSlug(formData.title)
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)

      const url = isEditing ? '/api/admin/posts' : '/api/posts'
      const method = isEditing ? 'PUT' : 'POST'
      const body = isEditing 
        ? { ...formData, id: initialData?.id, slug, tags: tagsArray }
        : { ...formData, slug, tags: tagsArray }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        alert(`Post ${isEditing ? 'updated' : 'created'} successfully!`)
        onSave?.()
        
        if (!isEditing) {
          // Reset form only for new posts
          setFormData({
            title: '',
            description: '',
            content: '',
            coverImage: '',
            author: '',
            category: '',
            tags: '',
            isFeatured: false,
            isPublished: false,
          })
        }
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      alert('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }))
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-[var(--background-secondary)] border-b border-[var(--border-primary)]">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-[var(--card-bg)] border border-[var(--border-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-web)] text-[var(--text-primary)]"
              placeholder="Enter post title"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-3 py-2 bg-[var(--card-bg)] border border-[var(--border-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-web)] text-[var(--text-primary)]"
              placeholder="Brief description of the post"
            />
          </div>

          {/* Author & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Author *
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-[var(--card-bg)] border border-[var(--border-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-web)] text-[var(--text-primary)]"
                placeholder="Author name"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-[var(--card-bg)] border border-[var(--border-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-web)] text-[var(--text-primary)]"
              >
                <option value="">Select category</option>
                <option value="web-development">Web Development</option>
                <option value="javascript">JavaScript</option>
                <option value="react">React</option>
                <option value="nextjs">Next.js</option>
                <option value="nodejs">Node.js</option>
                <option value="artificial-intelligence">Artificial Intelligence</option>
                <option value="machine-learning">Machine Learning</option>
                <option value="large-language-models">Large Language Models</option>
                <option value="iot">Internet of Things (IoT)</option>
                <option value="robotics">Robotics</option>
                <option value="data-science">Data Science</option>
                <option value="blockchain">Blockchain</option>
                <option value="cybersecurity">Cybersecurity</option>
                <option value="cloud-computing">Cloud Computing</option>
                <option value="devops">DevOps</option>
                <option value="mobile-development">Mobile Development</option>
                <option value="python">Python</option>
                <option value="tutorials">Tutorials</option>
                <option value="tips">Tips & Tricks</option>
                <option value="industry-trends">Industry Trends</option>
                <option value="tech-news">Tech News</option>
              </select>
            </div>
          </div>

          {/* Cover Image & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Cover Image URL *
              </label>
              <input
                type="url"
                id="coverImage"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-[var(--card-bg)] border border-[var(--border-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-web)] text-[var(--text-primary)]"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[var(--card-bg)] border border-[var(--border-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-web)] text-[var(--text-primary)]"
                placeholder="react, javascript, tutorial"
              />
            </div>
          </div>

          {/* Content - Now using Quill Editor */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Content *
            </label>
            <QuillEditor
              value={formData.content}
              onChange={handleContentChange}
              placeholder="Write your post content here..."
            />
          </div>

          {/* Options */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center text-[var(--text-primary)]">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="mr-2 h-4 w-4 text-[var(--accent-web)] focus:ring-[var(--accent-web)] border-[var(--border-primary)] rounded"
              />
              Featured Post
            </label>

            <label className="flex items-center text-[var(--text-primary)]">
              <input
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleChange}
                className="mr-2 h-4 w-4 text-[var(--accent-web)] focus:ring-[var(--accent-web)] border-[var(--border-primary)] rounded"
              />
              Publish Immediately
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-[var(--background)] transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-[var(--accent-web)] text-white rounded-md hover:bg-[var(--accent-web-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-web)] focus:ring-offset-2 focus:ring-offset-[var(--background)] disabled:opacity-50 transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : (isEditing ? 'Update Post' : 'Save Post')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}