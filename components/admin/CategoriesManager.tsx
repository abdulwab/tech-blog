'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit3, Trash2, Tag, Palette, Hash } from 'lucide-react'
import Tooltip from '../Tooltip'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  color: string
  icon: string | null
  createdAt: string
  updatedAt: string
}

export default function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    color: '#60a5fa',
    icon: ''
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = '/api/admin/categories'
      const method = editingCategory ? 'PUT' : 'POST'
      const body = editingCategory 
        ? { ...formData, id: editingCategory.id }
        : formData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        fetchCategories()
        resetForm()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save category')
      }
    } catch (error) {
      console.error('Error saving category:', error)
      alert('Failed to save category')
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      color: category.color,
      icon: category.icon || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      const response = await fetch(`/api/admin/categories?id=${categoryId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchCategories()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete category')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Failed to delete category')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      color: '#60a5fa',
      icon: ''
    })
    setEditingCategory(null)
    setShowForm(false)
  }

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  }

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name)
    })
  }

  const predefinedColors = [
    '#60a5fa', '#34d399', '#a78bfa', '#fbbf24', '#22d3ee', '#f87171',
    '#fb7185', '#a855f7', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Categories</h2>
          <p className="text-[var(--text-secondary)]">
            Manage your blog categories ({categories.length} total)
          </p>
        </div>
        <Tooltip content="Create a new blog category" position="bottom">
          <button
            onClick={() => setShowForm(true)}
            className="bg-[var(--accent-web)] text-white px-4 py-2 rounded-md hover:bg-[var(--accent-web-dark)] transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Category</span>
          </button>
        </Tooltip>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Name
                </label>
                <Tooltip content="Enter the category name - slug will be auto-generated" position="top">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-md bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-web)]"
                    required
                  />
                </Tooltip>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Slug
                </label>
                <Tooltip content="URL-friendly version of the category name for permalinks" position="top">
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-md bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-web)]"
                    required
                  />
                </Tooltip>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Description
                </label>
                <Tooltip content="Optional description of what this category contains" position="top">
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-md bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-web)]"
                  />
                </Tooltip>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Color
                </label>
                <div className="flex items-center space-x-2">
                  <Tooltip content="Pick a custom color for this category" position="top">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-12 h-10 border border-[var(--border-primary)] rounded-md cursor-pointer"
                    />
                  </Tooltip>
                  <div className="flex flex-wrap gap-2">
                    {predefinedColors.map((color) => (
                      <Tooltip key={color} content={`Select ${color} as category color`} position="top">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, color })}
                          className={`w-6 h-6 rounded-full border-2 ${
                            formData.color === color ? 'border-[var(--text-primary)]' : 'border-[var(--border-primary)]'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      </Tooltip>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Icon (optional)
                </label>
                <Tooltip content="Add an emoji or icon to represent this category" position="top">
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="e.g., 💻, 🤖, 🔗"
                    className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-md bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-web)]"
                  />
                </Tooltip>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Tooltip content="Cancel category creation and close form" position="top">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-[var(--border-primary)] rounded-md text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-colors"
                  >
                    Cancel
                  </button>
                </Tooltip>
                <Tooltip content={editingCategory ? 'Save category changes' : 'Create new category'} position="top">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[var(--accent-web)] text-white rounded-md hover:bg-[var(--accent-web-dark)] transition-colors"
                  >
                    {editingCategory ? 'Update' : 'Create'}
                  </button>
                </Tooltip>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center text-[var(--text-secondary)] py-8">
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="col-span-full text-center text-[var(--text-secondary)] py-8">
            No categories found. Create your first category!
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  />
                  <div>
                    <h3 className="font-semibold text-[var(--text-primary)] flex items-center">
                      {category.icon && <span className="mr-2">{category.icon}</span>}
                      {category.name}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {category.slug}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Tooltip content="Edit this category" position="left">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-[var(--text-secondary)] hover:text-[var(--accent-web)] transition-colors"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                  </Tooltip>
                  <Tooltip content="Delete this category" position="left">
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-[var(--text-secondary)] hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </Tooltip>
                </div>
              </div>
              
              {category.description && (
                <p className="text-sm text-[var(--text-secondary)] mb-3">
                  {category.description}
                </p>
              )}
              
              <div className="text-xs text-[var(--text-secondary)]">
                Created: {new Date(category.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
} 