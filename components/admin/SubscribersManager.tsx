'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Mail,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  Users
} from 'lucide-react'
import Tooltip from '../Tooltip'
import { formatDate } from '@/lib/utils'

interface Subscriber {
  id: string
  email: string
  isActive: boolean
  subscribedAt: string
}

interface SubscribersResponse {
  subscribers: Subscriber[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function SubscribersManager() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  })
  const [showForm, setShowForm] = useState(false)
  const [editingSubscriber, setEditingSubscriber] = useState<Subscriber | null>(null)
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([])
  const [formData, setFormData] = useState({
    email: '',
    isActive: true
  })

  // Fetch subscribers
  useEffect(() => {
    fetchSubscribers()
  }, [currentPage, searchTerm, statusFilter])

  const fetchSubscribers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        search: searchTerm,
        status: statusFilter
      })

      const response = await fetch(`/api/admin/subscribers?${params}`)
      if (response.ok) {
        const data: SubscribersResponse = await response.json()
        setSubscribers(data.subscribers)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = '/api/admin/subscribers'
      const method = editingSubscriber ? 'PUT' : 'POST'
      const body = editingSubscriber 
        ? { ...formData, id: editingSubscriber.id }
        : formData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        fetchSubscribers()
        resetForm()
        alert(`Subscriber ${editingSubscriber ? 'updated' : 'added'} successfully!`)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save subscriber')
      }
    } catch (error) {
      console.error('Error saving subscriber:', error)
      alert('Failed to save subscriber')
    }
  }

  const handleEdit = (subscriber: Subscriber) => {
    setEditingSubscriber(subscriber)
    setFormData({
      email: subscriber.email,
      isActive: subscriber.isActive
    })
    setShowForm(true)
  }

  const handleDelete = async (subscriberId: string) => {
    if (!confirm('Are you sure you want to delete this subscriber?')) return

    try {
      const response = await fetch(`/api/admin/subscribers?id=${subscriberId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchSubscribers()
        alert('Subscriber deleted successfully!')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete subscriber')
      }
    } catch (error) {
      console.error('Error deleting subscriber:', error)
      alert('Failed to delete subscriber')
    }
  }

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedSubscribers.length} subscribers?`)) return

    try {
      await Promise.all(
        selectedSubscribers.map(subscriberId =>
          fetch(`/api/admin/subscribers?id=${subscriberId}`, { method: 'DELETE' })
        )
      )
      setSelectedSubscribers([])
      fetchSubscribers()
      alert('Subscribers deleted successfully!')
    } catch (error) {
      console.error('Error bulk deleting subscribers:', error)
      alert('Failed to delete subscribers')
    }
  }

  const handleToggleStatus = async (subscriber: Subscriber) => {
    try {
      const response = await fetch('/api/admin/subscribers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: subscriber.id,
          email: subscriber.email,
          isActive: !subscriber.isActive
        })
      })

      if (response.ok) {
        fetchSubscribers()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update subscriber status')
      }
    } catch (error) {
      console.error('Error toggling subscriber status:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      email: '',
      isActive: true
    })
    setEditingSubscriber(null)
    setShowForm(false)
  }

  const getStatusBadge = (subscriber: Subscriber) => {
    if (subscriber.isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Active
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="h-3 w-3 mr-1" />
          Inactive
        </span>
      )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Subscribers</h2>
          <p className="text-[var(--text-secondary)]">
            Manage your email subscribers ({pagination.total} total)
          </p>
        </div>
        <Tooltip content="Add a new subscriber manually" position="bottom">
          <button
            onClick={() => setShowForm(true)}
            className="bg-[var(--accent-web)] text-white px-4 py-2 rounded-md hover:bg-[var(--accent-web-dark)] transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Subscriber</span>
          </button>
        </Tooltip>
      </div>

      {/* Filters */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
            <Tooltip content="Search subscribers by email address" position="top">
              <input
                type="text"
                placeholder="Search subscribers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[var(--border-primary)] rounded-md bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-web)]"
              />
            </Tooltip>
          </div>

          {/* Status Filter */}
          <Tooltip content="Filter subscribers by status" position="top">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-[var(--border-primary)] rounded-md bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-web)]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </Tooltip>

          {/* Bulk Actions */}
          {selectedSubscribers.length > 0 && (
            <Tooltip content={`Delete ${selectedSubscribers.length} selected subscribers permanently`} position="top">
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete ({selectedSubscribers.length})</span>
              </button>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
              {editingSubscriber ? 'Edit Subscriber' : 'Add New Subscriber'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Email Address
                </label>
                <Tooltip content="Enter a valid email address" position="top">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-md bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-web)]"
                    required
                    placeholder="user@example.com"
                  />
                </Tooltip>
              </div>

              <div className="flex items-center space-x-2">
                <Tooltip content="Toggle subscriber status - inactive subscribers won't receive emails" position="top">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 text-[var(--accent-web)] focus:ring-[var(--accent-web)] border-[var(--border-primary)] rounded"
                  />
                </Tooltip>
                <label htmlFor="isActive" className="text-[var(--text-primary)]">
                  Active subscriber
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Tooltip content="Cancel and close form" position="top">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-[var(--border-primary)] rounded-md text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-colors"
                  >
                    Cancel
                  </button>
                </Tooltip>
                <Tooltip content={editingSubscriber ? 'Save changes to subscriber' : 'Add new subscriber'} position="top">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[var(--accent-web)] text-white rounded-md hover:bg-[var(--accent-web-dark)] transition-colors"
                  >
                    {editingSubscriber ? 'Update' : 'Add'}
                  </button>
                </Tooltip>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subscribers Table */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[var(--border-primary)]">
            <thead className="bg-[var(--background-secondary)]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                  <Tooltip content="Select all subscribers for bulk actions" position="right">
                    <input
                      type="checkbox"
                      checked={selectedSubscribers.length === subscribers.length && subscribers.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSubscribers(subscribers.map(s => s.id))
                        } else {
                          setSelectedSubscribers([])
                        }
                      }}
                      className="h-4 w-4 text-[var(--accent-web)] focus:ring-[var(--accent-web)]"
                    />
                  </Tooltip>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                  Subscribed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-[var(--card-bg)] divide-y divide-[var(--border-primary)]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-[var(--text-secondary)]">
                    Loading subscribers...
                  </td>
                </tr>
              ) : subscribers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-[var(--text-secondary)]">
                    No subscribers found
                  </td>
                </tr>
              ) : (
                subscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-[var(--hover-bg)]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Tooltip content="Select this subscriber for bulk actions" position="right">
                        <input
                          type="checkbox"
                          checked={selectedSubscribers.includes(subscriber.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSubscribers([...selectedSubscribers, subscriber.id])
                            } else {
                              setSelectedSubscribers(selectedSubscribers.filter(id => id !== subscriber.id))
                            }
                          }}
                          className="h-4 w-4 text-[var(--accent-web)] focus:ring-[var(--accent-web)]"
                        />
                      </Tooltip>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-[var(--text-secondary)] mr-2" />
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          {subscriber.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(subscriber)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-[var(--text-secondary)]">
                        {formatDate(new Date(subscriber.subscribedAt))}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Tooltip content={subscriber.isActive ? 'Deactivate subscriber' : 'Activate subscriber'} position="left">
                          <button
                            onClick={() => handleToggleStatus(subscriber)}
                            className={`transition-colors ${
                              subscriber.isActive 
                                ? 'text-green-600 hover:text-green-700' 
                                : 'text-red-600 hover:text-red-700'
                            }`}
                          >
                            {subscriber.isActive ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                          </button>
                        </Tooltip>
                        <Tooltip content="Edit subscriber details" position="left">
                          <button
                            onClick={() => handleEdit(subscriber)}
                            className="text-[var(--text-secondary)] hover:text-[var(--accent-web)] transition-colors"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                        </Tooltip>
                        <Tooltip content="Delete subscriber permanently" position="left">
                          <button
                            onClick={() => handleDelete(subscriber.id)}
                            className="text-[var(--text-secondary)] hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </Tooltip>
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
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} subscribers
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