'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  Star,
  Calendar,
  User,
  Tag,
  Globe,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  MoreVertical
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Image from 'next/image'
import Tooltip from '../Tooltip'
import PostEditor from '../PostEditor'

interface Post {
  id: string
  title: string
  slug: string
  description: string
  coverImage: string
  author: string
  category: string
  tags: string[]
  isPublished: boolean
  isFeatured: boolean
  createdAt: string
  updatedAt: string
}

interface PostsResponse {
  posts: Post[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function PostsManager() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [featuredFilter, setFeaturedFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })
  const [selectedPosts, setSelectedPosts] = useState<string[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [categories, setCategories] = useState<Array<{id: string, name: string, slug: string}>>([])

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

  // Fetch posts
  useEffect(() => {
    fetchPosts()
  }, [currentPage, searchTerm, categoryFilter, statusFilter, featuredFilter])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        search: searchTerm,
        category: categoryFilter,
        status: statusFilter,
        featured: featuredFilter
      })

      const response = await fetch(`/api/admin/posts?${params}`)
      if (response.ok) {
        const data: PostsResponse = await response.json()
        setPosts(data.posts)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const response = await fetch(`/api/admin/posts?id=${postId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchPosts()
      }
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedPosts.length} posts?`)) return

    try {
      await Promise.all(
        selectedPosts.map(postId =>
          fetch(`/api/admin/posts?id=${postId}`, { method: 'DELETE' })
        )
      )
      setSelectedPosts([])
      fetchPosts()
    } catch (error) {
      console.error('Error bulk deleting posts:', error)
    }
  }

  const handleTogglePublish = async (postId: string, isPublished: boolean) => {
    try {
      const post = posts.find(p => p.id === postId)
      if (!post) return

      const response = await fetch('/api/admin/posts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...post,
          isPublished: !isPublished
        })
      })

      if (response.ok) {
        fetchPosts()
      }
    } catch (error) {
      console.error('Error toggling publish status:', error)
    }
  }

  const handleToggleFeatured = async (postId: string, isFeatured: boolean) => {
    try {
      const post = posts.find(p => p.id === postId)
      if (!post) return

      const response = await fetch('/api/admin/posts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...post,
          isFeatured: !isFeatured
        })
      })

      if (response.ok) {
        fetchPosts()
      }
    } catch (error) {
      console.error('Error toggling featured status:', error)
    }
  }

  const handleCreatePost = () => {
    setEditingPost(null)
    setShowForm(true)
  }

  const handleEditPost = (post: Post) => {
    setEditingPost(post)
    setShowForm(true)
  }

  const handleFormSave = () => {
    setShowForm(false)
    setEditingPost(null)
    fetchPosts()
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingPost(null)
  }

  const getStatusBadge = (post: Post) => {
    if (post.isPublished) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Published
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="h-3 w-3 mr-1" />
          Draft
        </span>
      )
    }
  }

  if (showForm) {
    const formData = editingPost ? {
      id: editingPost.id,
      slug: editingPost.slug,
      title: editingPost.title,
      description: editingPost.description,
      content: '', // Will be loaded from API
      coverImage: editingPost.coverImage,
      author: editingPost.author,
      category: editingPost.category,
      tags: editingPost.tags.join(', '),
      isFeatured: editingPost.isFeatured,
      isPublished: editingPost.isPublished,
    } : undefined

    return (
      <PostEditor
        initialData={formData}
        onSave={handleFormSave}
        onCancel={handleFormCancel}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Posts</h2>
          <p className="text-[var(--text-secondary)]">
            Manage your blog posts ({pagination.total} total)
          </p>
        </div>
        <Tooltip content="Create a new blog post" position="bottom">
          <button 
            onClick={handleCreatePost}
            className="bg-[var(--accent-web)] text-white px-4 py-2 rounded-md hover:bg-[var(--accent-web-dark)] transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Post</span>
          </button>
        </Tooltip>
      </div>

      {/* Filters */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
            <Tooltip content="Search posts by title, description, or content" position="top">
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[var(--border-primary)] rounded-md bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-web)]"
              />
            </Tooltip>
          </div>

          {/* Category Filter */}
          <Tooltip content="Filter posts by category" position="top">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-[var(--border-primary)] rounded-md bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-web)]"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </Tooltip>

          {/* Status Filter */}
          <Tooltip content="Filter posts by publication status" position="top">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-[var(--border-primary)] rounded-md bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-web)]"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </Tooltip>

          {/* Featured Filter */}
          <Tooltip content="Filter posts by featured status" position="top">
            <select
              value={featuredFilter}
              onChange={(e) => setFeaturedFilter(e.target.value)}
              className="px-3 py-2 border border-[var(--border-primary)] rounded-md bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-web)]"
            >
              <option value="all">All Posts</option>
              <option value="true">Featured</option>
              <option value="false">Not Featured</option>
            </select>
          </Tooltip>

          {/* Bulk Actions */}
          {selectedPosts.length > 0 && (
            <Tooltip content={`Delete ${selectedPosts.length} selected posts permanently`} position="top">
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete ({selectedPosts.length})</span>
              </button>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[var(--border-primary)]">
            <thead className="bg-[var(--background-secondary)]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                  <Tooltip content="Select all posts for bulk actions" position="right">
                    <input
                      type="checkbox"
                      checked={selectedPosts.length === posts.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPosts(posts.map(p => p.id))
                        } else {
                          setSelectedPosts([])
                        }
                      }}
                      className="h-4 w-4 text-[var(--accent-web)] focus:ring-[var(--accent-web)]"
                    />
                  </Tooltip>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                  Post
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-[var(--card-bg)] divide-y divide-[var(--border-primary)]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-[var(--text-secondary)]">
                    Loading posts...
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-[var(--text-secondary)]">
                    No posts found
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-[var(--hover-bg)]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Tooltip content="Select this post for bulk actions" position="right">
                        <input
                          type="checkbox"
                          checked={selectedPosts.includes(post.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPosts([...selectedPosts, post.id])
                            } else {
                              setSelectedPosts(selectedPosts.filter(id => id !== post.id))
                            }
                          }}
                          className="h-4 w-4 text-[var(--accent-web)] focus:ring-[var(--accent-web)]"
                        />
                      </Tooltip>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-[var(--text-primary)] flex items-center">
                            {post.title}
                            {post.isFeatured && (
                              <Star className="h-4 w-4 text-yellow-500 ml-2" />
                            )}
                          </div>
                          <div className="text-sm text-[var(--text-secondary)] truncate max-w-xs">
                            {post.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(post)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {post.category.split(',').map((cat, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[var(--accent-web)] text-white"
                          >
                            {cat.trim()}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-[var(--text-primary)]">
                        {post.author}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-[var(--text-secondary)]">
                        {formatDate(new Date(post.createdAt))}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => window.open(`/${post.slug}`, '_blank')}
                          className="text-[var(--text-secondary)] hover:text-[var(--accent-web)] transition-colors"
                          title="View Post"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleTogglePublish(post.id, post.isPublished)}
                          className={`transition-colors ${
                            post.isPublished 
                              ? 'text-green-600 hover:text-green-700' 
                              : 'text-yellow-600 hover:text-yellow-700'
                          }`}
                          title={post.isPublished ? 'Unpublish' : 'Publish'}
                        >
                          {post.isPublished ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => handleToggleFeatured(post.id, post.isFeatured)}
                          className={`transition-colors ${
                            post.isFeatured 
                              ? 'text-yellow-500 hover:text-yellow-600' 
                              : 'text-[var(--text-secondary)] hover:text-yellow-500'
                          }`}
                          title={post.isFeatured ? 'Remove from Featured' : 'Add to Featured'}
                        >
                          <Star className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditPost(post)}
                          className="text-[var(--text-secondary)] hover:text-[var(--accent-web)] transition-colors"
                          title="Edit Post"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-[var(--text-secondary)] hover:text-red-600 transition-colors"
                          title="Delete Post"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-[var(--border-primary)] flex items-center justify-between">
            <div className="text-sm text-[var(--text-secondary)]">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} posts
            </div>
            <div className="flex items-center space-x-2">
              <Tooltip content="Go to previous page" position="top">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-[var(--border-primary)] rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                >
                  Previous
                </button>
              </Tooltip>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                <Tooltip key={page} content={`Go to page ${page}`} position="top">
                  <button
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 border rounded-md text-sm ${
                      currentPage === page
                        ? 'border-[var(--accent-web)] bg-[var(--accent-web)] text-white'
                        : 'border-[var(--border-primary)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)]'
                    }`}
                  >
                    {page}
                  </button>
                </Tooltip>
              ))}
              <Tooltip content="Go to next page" position="top">
                <button
                  onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
                  disabled={currentPage === pagination.pages}
                  className="px-3 py-1 border border-[var(--border-primary)] rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                >
                  Next
                </button>
              </Tooltip>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 