'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Send, 
  Mail, 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Eye,
  PlusCircle 
} from 'lucide-react'
import Tooltip from '../Tooltip'

interface EmailNotification {
  id: string
  subject: string
  content: string
  recipientType: 'all' | 'active' | 'specific'
  recipientList: string[]
  sentAt: string | null
  sentCount: number
  failedCount: number
  status: 'draft' | 'scheduled' | 'sent' | 'failed'
  scheduledAt: string | null
  createdAt: string
  updatedAt: string
  createdBy: string
}

interface NotificationsResponse {
  notifications: EmailNotification[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function NotificationsManager() {
  const [notifications, setNotifications] = useState<EmailNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingNotification, setEditingNotification] = useState<EmailNotification | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })
  const [subscriberCount, setSubscriberCount] = useState(0)
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    recipientType: 'all' as 'all' | 'active' | 'specific',
    recipientList: [] as string[],
    scheduledAt: ''
  })

  useEffect(() => {
    fetchNotifications()
    fetchSubscriberCount()
  }, [currentPage, statusFilter])

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        status: statusFilter
      })

      const response = await fetch(`/api/admin/notifications?${params}`)
      if (response.ok) {
        const data: NotificationsResponse = await response.json()
        setNotifications(data.notifications)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSubscriberCount = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setSubscriberCount(data.totalSubscribers)
      }
    } catch (error) {
      console.error('Error fetching subscriber count:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = '/api/admin/notifications'
      const method = editingNotification ? 'PUT' : 'POST'
      const body = editingNotification 
        ? { ...formData, id: editingNotification.id }
        : formData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        fetchNotifications()
        resetForm()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save notification')
      }
    } catch (error) {
      console.error('Error saving notification:', error)
      alert('Failed to save notification')
    }
  }

  const handleSendNotification = async (notificationId: string) => {
    if (!confirm('Are you sure you want to send this notification?')) return

    try {
      const response = await fetch('/api/admin/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId })
      })

      if (response.ok) {
        const result = await response.json()
        alert(`Notification sent successfully! Sent to ${result.sentCount} recipients.`)
        fetchNotifications()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to send notification')
      }
    } catch (error) {
      console.error('Error sending notification:', error)
      alert('Failed to send notification')
    }
  }

  const handleEdit = (notification: EmailNotification) => {
    setEditingNotification(notification)
    setFormData({
      subject: notification.subject,
      content: notification.content,
      recipientType: notification.recipientType,
      recipientList: notification.recipientList,
      scheduledAt: notification.scheduledAt || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (notificationId: string) => {
    if (!confirm('Are you sure you want to delete this notification?')) return

    try {
      const response = await fetch(`/api/admin/notifications?id=${notificationId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchNotifications()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete notification')
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
      alert('Failed to delete notification')
    }
  }

  const resetForm = () => {
    setFormData({
      subject: '',
      content: '',
      recipientType: 'all',
      recipientList: [],
      scheduledAt: ''
    })
    setEditingNotification(null)
    setShowForm(false)
  }

  const getStatusBadge = (notification: EmailNotification) => {
    switch (notification.status) {
      case 'sent':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Sent
          </span>
        )
      case 'draft':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <Edit3 className="h-3 w-3 mr-1" />
            Draft
          </span>
        )
      case 'scheduled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="h-3 w-3 mr-1" />
            Scheduled
          </span>
        )
      case 'failed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            Failed
          </span>
        )
      default:
        return null
    }
  }

  const getRecipientInfo = (notification: EmailNotification) => {
    switch (notification.recipientType) {
      case 'all':
        return 'All subscribers'
      case 'active':
        return 'Active subscribers'
      case 'specific':
        return `${notification.recipientList.length} specific recipients`
      default:
        return 'Unknown'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Email Notifications</h2>
          <p className="text-[var(--text-secondary)]">
            Manage your email campaigns and notifications ({subscriberCount} subscribers)
          </p>
        </div>
        <Tooltip content="Create a new email notification campaign" position="bottom">
          <button
            onClick={() => setShowForm(true)}
            className="bg-[var(--accent-web)] text-white px-4 py-2 rounded-md hover:bg-[var(--accent-web-dark)] transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Notification</span>
          </button>
        </Tooltip>
      </div>

      {/* Filter */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-4">
        <Tooltip content="Filter notifications by status" position="top">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-[var(--border-primary)] rounded-md bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-web)]"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="sent">Sent</option>
            <option value="failed">Failed</option>
          </select>
        </Tooltip>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
              {editingNotification ? 'Edit Notification' : 'Create New Notification'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Subject
                </label>
                <Tooltip content="Enter the email subject line" position="top">
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-md bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-web)]"
                    required
                  />
                </Tooltip>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Content
                </label>
                <Tooltip content="Write your email content - HTML tags are supported for formatting" position="top">
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={8}
                    className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-md bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-web)]"
                    placeholder="You can use HTML tags for formatting..."
                    required
                  />
                </Tooltip>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Recipients
                </label>
                <Tooltip content="Choose who should receive this notification" position="top">
                  <select
                    value={formData.recipientType}
                    onChange={(e) => setFormData({ ...formData, recipientType: e.target.value as 'all' | 'active' | 'specific' })}
                    className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-md bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-web)]"
                  >
                    <option value="all">All Subscribers</option>
                    <option value="active">Active Subscribers Only</option>
                    <option value="specific">Specific Recipients</option>
                  </select>
                </Tooltip>
              </div>

              {formData.recipientType === 'specific' && (
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Email Addresses (one per line)
                  </label>
                  <Tooltip content="Enter specific email addresses, one per line" position="top">
                    <textarea
                      value={formData.recipientList.join('\n')}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        recipientList: e.target.value.split('\n').filter(email => email.trim()) 
                      })}
                      rows={4}
                      className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-md bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-web)]"
                      placeholder="user@example.com"
                    />
                  </Tooltip>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Schedule (optional)
                </label>
                <Tooltip content="Schedule when to send this notification - leave empty to save as draft" position="top">
                  <input
                    type="datetime-local"
                    value={formData.scheduledAt}
                    onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-md bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-web)]"
                  />
                </Tooltip>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  Leave empty to save as draft
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Tooltip content="Cancel and close the notification form" position="top">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-[var(--border-primary)] rounded-md text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-colors"
                  >
                    Cancel
                  </button>
                </Tooltip>
                <Tooltip content={editingNotification ? 'Update notification' : 'Create notification'} position="top">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[var(--accent-web)] text-white rounded-md hover:bg-[var(--accent-web-dark)] transition-colors"
                  >
                    {editingNotification ? 'Update' : 'Create'}
                  </button>
                </Tooltip>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[var(--border-primary)]">
            <thead className="bg-[var(--background-secondary)]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                  Recipients
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                  Created
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
                    Loading notifications...
                  </td>
                </tr>
              ) : notifications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-[var(--text-secondary)]">
                    No notifications found
                  </td>
                </tr>
              ) : (
                notifications.map((notification) => (
                  <tr key={notification.id} className="hover:bg-[var(--hover-bg)]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[var(--text-primary)]">
                        {notification.subject}
                      </div>
                      <div className="text-sm text-[var(--text-secondary)] truncate max-w-xs">
                        {notification.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(notification)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[var(--text-primary)]">
                        {getRecipientInfo(notification)}
                      </div>
                      {notification.sentCount > 0 && (
                        <div className="text-xs text-[var(--text-secondary)]">
                          Sent: {notification.sentCount}
                          {notification.failedCount > 0 && `, Failed: ${notification.failedCount}`}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[var(--text-secondary)]">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {notification.status === 'draft' && (
                          <button
                            onClick={() => handleSendNotification(notification.id)}
                            className="text-green-600 hover:text-green-700 transition-colors"
                            title="Send Now"
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(notification)}
                          className="text-[var(--text-secondary)] hover:text-[var(--accent-web)] transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="text-[var(--text-secondary)] hover:text-red-600 transition-colors"
                          title="Delete"
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
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} notifications
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