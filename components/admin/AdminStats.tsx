'use client'

import { useState, useEffect } from 'react'
import { 
  FileText, 
  Users, 
  Tag, 
  Mail, 
  Eye, 
  Star, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import Tooltip from '../Tooltip'

interface AdminStatsProps {
  stats: {
    totalPosts: number
    publishedPosts: number
    draftPosts: number
    totalSubscribers: number
    totalCategories: number
    pendingNotifications: number
  }
  onRefresh: () => void
}

export default function AdminStats({ stats, onRefresh }: AdminStatsProps) {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    await onRefresh()
    setTimeout(() => setRefreshing(false), 1000)
  }

  const statCards = [
    {
      title: 'Total Posts',
      value: stats.totalPosts,
      icon: FileText,
      color: 'bg-blue-500',
      trend: '+12%',
      description: 'All blog posts'
    },
    {
      title: 'Published Posts',
      value: stats.publishedPosts,
      icon: CheckCircle,
      color: 'bg-green-500',
      trend: '+8%',
      description: 'Live on website'
    },
    {
      title: 'Draft Posts',
      value: stats.draftPosts,
      icon: Clock,
      color: 'bg-yellow-500',
      trend: '+3%',
      description: 'Unpublished drafts'
    },
    {
      title: 'Subscribers',
      value: stats.totalSubscribers,
      icon: Users,
      color: 'bg-purple-500',
      trend: '+25%',
      description: 'Email subscribers'
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      icon: Tag,
      color: 'bg-indigo-500',
      trend: '+2%',
      description: 'Blog categories'
    },
    {
      title: 'Pending Notifications',
      value: stats.pendingNotifications,
      icon: Mail,
      color: 'bg-red-500',
      trend: '0%',
      description: 'Unsent notifications'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Dashboard Overview</h2>
          <p className="text-[var(--text-secondary)]">
            Key metrics and statistics for your blog
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="bg-[var(--accent-web)] text-white px-4 py-2 rounded-md hover:bg-[var(--accent-web-dark)] transition-colors flex items-center space-x-2 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <div
              key={index}
              className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full ${card.color} text-white`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[var(--text-primary)]">
                    {card.value}
                  </div>
                  <div className="text-sm text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {card.trend}
                  </div>
                </div>
              </div>
              <div>
                <div className="text-lg font-semibold text-[var(--text-primary)] mb-1">
                  {card.title}
                </div>
                <div className="text-sm text-[var(--text-secondary)]">
                  {card.description}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-[var(--accent-web)] text-white p-4 rounded-lg hover:bg-[var(--accent-web-dark)] transition-colors flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Create Post</span>
          </button>
          <button className="bg-[var(--accent-iot)] text-white p-4 rounded-lg hover:bg-[var(--accent-iot-dark)] transition-colors flex items-center space-x-2">
            <Tag className="h-5 w-5" />
            <span>Add Category</span>
          </button>
          <button className="bg-[var(--accent-ai)] text-white p-4 rounded-lg hover:bg-[var(--accent-ai-dark)] transition-colors flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Send Newsletter</span>
          </button>
          <button className="bg-[var(--accent-mobile)] text-white p-4 rounded-lg hover:bg-[var(--accent-mobile-dark)] transition-colors flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>View Subscribers</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-[var(--background-secondary)] rounded-lg">
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-[var(--text-primary)]">
                New post published
              </div>
              <div className="text-xs text-[var(--text-secondary)]">
                2 minutes ago
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-[var(--background-secondary)] rounded-lg">
            <div className="p-2 bg-blue-100 rounded-full">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-[var(--text-primary)]">
                New subscriber joined
              </div>
              <div className="text-xs text-[var(--text-secondary)]">
                15 minutes ago
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-[var(--background-secondary)] rounded-lg">
            <div className="p-2 bg-purple-100 rounded-full">
              <Mail className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-[var(--text-primary)]">
                Newsletter sent to 150 subscribers
              </div>
              <div className="text-xs text-[var(--text-secondary)]">
                1 hour ago
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            Content Performance
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">Published Posts</span>
              <span className="text-[var(--text-primary)] font-semibold">
                {stats.publishedPosts}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">Draft Posts</span>
              <span className="text-[var(--text-primary)] font-semibold">
                {stats.draftPosts}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">Categories</span>
              <span className="text-[var(--text-primary)] font-semibold">
                {stats.totalCategories}
              </span>
            </div>
            <div className="pt-2 border-t border-[var(--border-primary)]">
              <div className="text-sm text-[var(--text-secondary)]">
                Publishing Rate: {stats.totalPosts > 0 ? Math.round((stats.publishedPosts / stats.totalPosts) * 100) : 0}%
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            Engagement Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">Total Subscribers</span>
              <span className="text-[var(--text-primary)] font-semibold">
                {stats.totalSubscribers}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">Pending Notifications</span>
              <span className="text-[var(--text-primary)] font-semibold">
                {stats.pendingNotifications}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">Avg. Posts/Month</span>
              <span className="text-[var(--text-primary)] font-semibold">
                {Math.round(stats.totalPosts / 3)}
              </span>
            </div>
            <div className="pt-2 border-t border-[var(--border-primary)]">
              <div className="text-sm text-[var(--text-secondary)]">
                Growth trending upward
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 