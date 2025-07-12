'use client'

import { useState, useEffect } from 'react'
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
  const [loadingContent, setLoadingContent] = useState(false)
  const [categories, setCategories] = useState<Array<{id: string, name: string, slug: string, color: string}>>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const isEditing = Boolean(initialData?.id)

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/admin/categories')
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  // Initialize selected categories
  useEffect(() => {
    if (initialData?.category) {
      // Handle legacy single category or comma-separated categories
      const categoryList = initialData.category.split(',').map(cat => cat.trim()).filter(Boolean)
      setSelectedCategories(categoryList)
    }
  }, [initialData?.category])

  // Fetch full post content when editing
  useEffect(() => {
    if (initialData?.id && !initialData?.content) {
      setLoadingContent(true)
      fetch(`/api/posts/${initialData.slug}`)
        .then(response => response.json())
        .then(post => {
          if (post.content) {
            setFormData(prev => ({
              ...prev,
              content: post.content
            }))
          }
        })
        .catch(error => console.error('Error fetching post content:', error))
        .finally(() => setLoadingContent(false))
    }
  }, [initialData?.id, initialData?.slug, initialData?.content])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedCategories.length === 0) {
      alert('Please select at least one category.')
      return
    }
    
    setIsLoading(true)

    try {
      const slug = initialData?.slug || createSlug(formData.title)
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      const categoryString = selectedCategories.join(', ')

      const url = isEditing ? '/api/admin/posts' : '/api/posts'
      const method = isEditing ? 'PUT' : 'POST'
      const body = isEditing 
        ? { ...formData, id: initialData?.id, slug, tags: tagsArray, category: categoryString }
        : { ...formData, slug, tags: tagsArray, category: categoryString }

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
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Categories *
              </label>
              {categories.length === 0 ? (
                <div className="text-sm text-[var(--text-secondary)] p-4 border border-[var(--border-primary)] rounded-md">
                  No categories available. Please create categories in the admin panel first.
                </div>
              ) : (
                <div className="border border-[var(--border-primary)] rounded-md p-3 max-h-48 overflow-y-auto">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center space-x-2 py-2 hover:bg-[var(--hover-bg)] rounded px-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategories([...selectedCategories, category.name])
                          } else {
                            setSelectedCategories(selectedCategories.filter(cat => cat !== category.name))
                          }
                        }}
                        className="h-4 w-4 text-[var(--accent-web)] focus:ring-[var(--accent-web)] border-[var(--border-primary)] rounded"
                      />
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-[var(--text-primary)]">{category.name}</span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
              {selectedCategories.length > 0 && (
                <div className="mt-2">
                  <span className="text-sm text-[var(--text-secondary)]">Selected: </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedCategories.map((category) => (
                      <span
                        key={category}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[var(--accent-web)] text-white"
                      >
                        {category}
                        <button
                          type="button"
                          onClick={() => setSelectedCategories(selectedCategories.filter(cat => cat !== category))}
                          className="ml-1 text-white hover:text-gray-200"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
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