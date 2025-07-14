'use client'

import React, { useState, useEffect } from 'react'
import { Mail, Send, AlertCircle, CheckCircle, Clock, Users } from 'lucide-react'

interface Post {
  id: string
  title: string
  slug: string
  description: string
  coverImage: string
  author: string
  category: string
  createdAt: string
  isPublished: boolean
}

interface NotificationResult {
  success: boolean
  message: string
  successCount?: number
  failedCount?: number
  totalSubscribers?: number
}

const PostNotificationManager: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedPosts, setSelectedPosts] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<NotificationResult | null>(null)
  const [subscriberCount, setSubscriberCount] = useState(0)

  useEffect(() => {
    fetchPosts()
    fetchSubscriberCount()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/posts?status=published&limit=50')
      const data = await response.json()
      if (data.posts) {
        setPosts(data.posts)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSubscriberCount = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()
      setSubscriberCount(data.totalSubscribers || 0)
    } catch (error) {
      console.error('Error fetching subscriber count:', error)
    }
  }

  const handlePostSelection = (postId: string) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    )
  }

  const sendNotifications = async () => {
    if (selectedPosts.length === 0) {
      setResult({
        success: false,
        message: 'Please select at least one post to send notifications'
      })
      return
    }

    setSending(true)
    setResult(null)

    try {
      const results = await Promise.all(
        selectedPosts.map(async (postId) => {
          const response = await fetch('/api/admin/send-post-notification', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ postId }),
          })
          return await response.json()
        })
      )

      const totalSuccess = results.reduce((sum, result) => sum + (result.successCount || 0), 0)
      const totalFailed = results.reduce((sum, result) => sum + (result.failedCount || 0), 0)

      setResult({
        success: true,
        message: `Notifications sent successfully!`,
        successCount: totalSuccess,
        failedCount: totalFailed,
        totalSubscribers: subscriberCount
      })
      
      setSelectedPosts([])
    } catch (error) {
      setResult({
        success: false,
        message: 'Failed to send notifications. Please try again.'
      })
    } finally {
      setSending(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg shadow p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Mail className="h-6 w-6 text-[var(--accent-web)]" />
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Send Post Notifications
          </h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-web)]"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Mail className="h-6 w-6 text-[var(--accent-web)]" />
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Send Post Notifications
          </h3>
        </div>
        <div className="flex items-center space-x-2 text-sm text-[var(--text-secondary)]">
          <Users className="h-4 w-4" />
          <span>{subscriberCount} subscribers</span>
        </div>
      </div>

      {result && (
        <div className={`mb-6 p-4 rounded-lg border ${
          result.success 
            ? 'bg-green-50 border-green-200 text-green-700' 
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <div className="flex items-center space-x-2">
            {result.success ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span className="font-medium">{result.message}</span>
          </div>
          {result.success && result.successCount !== undefined && (
            <div className="mt-2 text-sm">
              <p>✅ Successfully sent: {result.successCount} emails</p>
              {result.failedCount! > 0 && (
                <p>❌ Failed: {result.failedCount} emails</p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-[var(--text-secondary)]">
          Select posts to send notifications to your subscribers
        </p>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-[var(--text-secondary)]">
            {selectedPosts.length} selected
          </span>
          <button
            onClick={sendNotifications}
            disabled={selectedPosts.length === 0 || sending}
            className="flex items-center space-x-2 px-4 py-2 bg-[var(--accent-web)] text-white rounded-lg hover:bg-[var(--accent-web-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span>{sending ? 'Sending...' : 'Send Notifications'}</span>
          </button>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-8">
          <Mail className="h-12 w-12 text-[var(--text-secondary)] mx-auto mb-4" />
          <p className="text-[var(--text-secondary)]">No published posts found</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {posts.map((post) => (
            <div
              key={post.id}
              className={`flex items-center space-x-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedPosts.includes(post.id)
                  ? 'border-[var(--accent-web)] bg-[var(--accent-web)]/5'
                  : 'border-[var(--border-primary)] hover:border-[var(--accent-web)]/50'
              }`}
              onClick={() => handlePostSelection(post.id)}
            >
              <input
                type="checkbox"
                checked={selectedPosts.includes(post.id)}
                onChange={() => handlePostSelection(post.id)}
                className="h-4 w-4 text-[var(--accent-web)] focus:ring-[var(--accent-web)] border-[var(--border-primary)] rounded"
              />
              
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-[var(--text-primary)] truncate">
                  {post.title}
                </h4>
                <p className="text-xs text-[var(--text-secondary)] truncate mt-1">
                  {post.description}
                </p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-[var(--text-secondary)]">
                  <span>By {post.author}</span>
                  <span>•</span>
                  <span>{post.category}</span>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PostNotificationManager 