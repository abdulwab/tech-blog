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
  RefreshCw,
  Send,
  Trash2,
  UserX,
  Bell
} from 'lucide-react'
import Tooltip from '../Tooltip'
import { formatTimeAgo, getActivityColor, getActivityIcon } from '@/lib/activity'

type Tab = 'overview' | 'posts' | 'categories' | 'notifications' | 'subscribers' | 'settings'

interface Activity {
  id: string
  type: string
  title: string
  details: string | null
  metadata: any
  createdBy: string | null
  createdAt: string
}

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
  onNavigateToTab: (tab: Tab) => void
}

export default function AdminStats({ stats, onRefresh, onNavigateToTab }: AdminStatsProps) {
  const [refreshing, setRefreshing] = useState(false)
  const [activities, setActivities] = useState<Activity[]>([])
  const [loadingActivities, setLoadingActivities] = useState(true)

  // Fetch activities on component mount
  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      setLoadingActivities(true)
      const response = await fetch('/api/admin/activity?limit=5')
      if (response.ok) {
        const data = await response.json()
        setActivities(data.activities)
      }
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setLoadingActivities(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await onRefresh()
    // Also refresh activities
    await fetchActivities()
    setTimeout(() => setRefreshing(false), 1000)
  }

  const renderActivityIcon = (type: string) => {
    const iconName = getActivityIcon(type as any)
    const colorClass = getActivityColor(type as any)
    
    const IconComponent = {
      FileText,
      CheckCircle,
      Trash2,
      Star,
      Users,
      UserX,
      Mail,
      Send,
      AlertCircle,
      Tag,
      Bell
    }[iconName] || Bell

    return (
      <div className={`p-2 rounded-full ${colorClass}`}>
        <IconComponent className="h-4 w-4" />
      </div>
    )
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
        <Tooltip content="Refresh dashboard statistics" position="bottom">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-[var(--accent-web)] text-white px-4 py-2 rounded-md hover:bg-[var(--accent-web-dark)] transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </Tooltip>
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
          <Tooltip content="Navigate to posts section to create a new blog post" position="top">
            <button 
              onClick={() => onNavigateToTab('posts')}
              className="bg-[var(--accent-web)] text-white p-4 rounded-lg hover:bg-[var(--accent-web-dark)] transition-colors flex items-center space-x-2"
            >
              <FileText className="h-5 w-5" />
              <span>Create Post</span>
            </button>
          </Tooltip>
          <Tooltip content="Navigate to categories section to add a new category" position="top">
            <button 
              onClick={() => onNavigateToTab('categories')}
              className="bg-[var(--accent-iot)] text-white p-4 rounded-lg hover:bg-[var(--accent-iot-dark)] transition-colors flex items-center space-x-2"
            >
              <Tag className="h-5 w-5" />
              <span>Add Category</span>
            </button>
          </Tooltip>
          <Tooltip content="Navigate to notifications section to send a newsletter" position="top">
            <button 
              onClick={() => onNavigateToTab('notifications')}
              className="bg-[var(--accent-ai)] text-white p-4 rounded-lg hover:bg-[var(--accent-ai-dark)] transition-colors flex items-center space-x-2"
            >
              <Mail className="h-5 w-5" />
              <span>Send Newsletter</span>
            </button>
          </Tooltip>
          <Tooltip content="Navigate to subscribers section to manage email list" position="top">
            <button 
              onClick={() => onNavigateToTab('subscribers')}
              className="bg-[var(--accent-mobile)] text-white p-4 rounded-lg hover:bg-[var(--accent-mobile-dark)] transition-colors flex items-center space-x-2"
            >
              <Users className="h-5 w-5" />
              <span>View Subscribers</span>
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {loadingActivities ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-web)]"></div>
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-8 text-[var(--text-secondary)]">
              No recent activity found
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 bg-[var(--background-secondary)] rounded-lg">
                {renderActivityIcon(activity.type)}
                <div className="flex-1">
                  <div className="text-sm font-medium text-[var(--text-primary)]">
                    {activity.title}
                  </div>
                  {activity.details && (
                    <div className="text-xs text-[var(--text-secondary)] mt-1">
                      {activity.details}
                    </div>
                  )}
                  <div className="text-xs text-[var(--text-secondary)] mt-1">
                    {formatTimeAgo(new Date(activity.createdAt))}
                  </div>
                </div>
              </div>
            ))
          )}
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