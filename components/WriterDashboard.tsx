'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit3, 
  Eye, 
  ArrowLeft, 
  FileText,
  BarChart3,
  Save,
  Send
} from 'lucide-react'
import Link from 'next/link'
import PostEditor from './PostEditor'

interface User {
  id: string
  firstName: string | null
  lastName: string | null
  email: string
  role: string
  imageUrl: string | null
}

interface WriterDashboardProps {
  user: User
}

interface Post {
  id: string
  title: string
  slug: string
  description: string
  isPublished: boolean
  isFeatured: boolean
  createdAt: string
  updatedAt: string
  category: string
  author: string
}

export default function WriterDashboard({ user }: WriterDashboardProps) {
  const [activeView, setActiveView] = useState<'posts' | 'create'>('posts')
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0
  })

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/posts?limit=50')
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts || [])
        
        // Calculate stats
        const totalPosts = data.posts?.length || 0
        const publishedPosts = data.posts?.filter((p: Post) => p.isPublished).length || 0
        const draftPosts = totalPosts - publishedPosts
        
        setStats({ totalPosts, publishedPosts, draftPosts })
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Blog
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-bold text-[var(--text-primary)]">
                Writer Dashboard
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-[var(--text-secondary)]">
                Welcome, {user.firstName} {user.lastName}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveView('posts')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeView === 'posts'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-gray-100'
                  }`}
                >
                  <FileText className="h-4 w-4 mr-2 inline" />
                  My Posts
                </button>
                <button
                  onClick={() => setActiveView('create')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeView === 'create'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-gray-100'
                  }`}
                >
                  <Plus className="h-4 w-4 mr-2 inline" />
                  Create Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'posts' ? (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Posts</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Eye className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Published</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.publishedPosts}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-50 rounded-lg">
                    <Edit3 className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Drafts</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.draftPosts}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts List */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                    Your Posts
                  </h2>
                  <button
                    onClick={() => setActiveView('create')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Post
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                    <p className="text-gray-500 mb-4">Create your first post to get started.</p>
                    <button
                      onClick={() => setActiveView('create')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Create Your First Post
                    </button>
                  </div>
                ) : (
                  <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Post
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Updated
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {posts.map((post) => (
                        <tr key={post.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{post.title}</div>
                              <div className="text-sm text-gray-500 truncate max-w-md">{post.description}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              post.isPublished
                                ? 'text-green-800 bg-green-100'
                                : 'text-yellow-800 bg-yellow-100'
                            }`}>
                              {post.isPublished ? 'Published' : 'Draft'}
                            </span>
                            {post.isFeatured && (
                              <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full text-purple-800 bg-purple-100">
                                Featured
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {post.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(post.updatedAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Link
                                href={`/blog/${post.slug}`}
                                className="text-blue-600 hover:text-blue-900"
                                target="_blank"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                              <button className="text-green-600 hover:text-green-900">
                                <Edit3 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Create New Post
              </h2>
              <p className="text-[var(--text-secondary)] text-sm mt-1">
                Write and publish your blog post
              </p>
            </div>
            <div className="p-6">
              <PostEditor />
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 