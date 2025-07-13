'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  Mail,
  Settings,
  BarChart3,
  FileText,
  Tag,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Send
} from 'lucide-react'
import PostsManager from './admin/PostsManager'
import CategoriesManager from './admin/CategoriesManager'
import NotificationsManager from './admin/NotificationsManager'
import SubscribersManager from './admin/SubscribersManager'
import AdminStats from './admin/AdminStats'
import Tooltip from './Tooltip'

type Tab = 'overview' | 'posts' | 'categories' | 'notifications' | 'subscribers' | 'settings'

interface AdminDashboardProps {
  initialTab?: Tab
}

export default function AdminDashboard({ initialTab = 'overview' }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab)
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalSubscribers: 0,
    totalCategories: 0,
    pendingNotifications: 0
  })

  // Fetch dashboard stats
  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'posts', label: 'Posts', icon: FileText },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'notifications', label: 'Notifications', icon: Mail },
    { id: 'subscribers', label: 'Subscribers', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminStats stats={stats} onRefresh={fetchStats} onNavigateToTab={setActiveTab} />
      case 'posts':
        return <PostsManager />
      case 'categories':
        return <CategoriesManager />
      case 'notifications':
        return <NotificationsManager />
      case 'subscribers':
        return <SubscribersManager />
      case 'settings':
        return <AdminSettings />
      default:
        return <AdminStats stats={stats} onRefresh={fetchStats} onNavigateToTab={setActiveTab} />
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-[var(--border-primary)] bg-[var(--background)]">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">
              Admin Dashboard
            </h1>
            <p className="text-[var(--text-secondary)] mt-2">
              Manage your blog content, categories, and notifications
            </p>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const getTooltipText = () => {
                switch (tab.id) {
                  case 'overview':
                    return 'View dashboard overview and key metrics'
                  case 'posts':
                    return 'Manage blog posts, create, edit, and publish content'
                  case 'categories':
                    return 'Create and manage blog categories'
                  case 'notifications':
                    return 'Send email notifications to subscribers'
                  case 'subscribers':
                    return 'Manage email subscribers and mailing list'
                  case 'settings':
                    return 'Configure admin settings and preferences'
                  default:
                    return tab.label
                }
              }
              return (
                <Tooltip key={tab.id} content={getTooltipText()} position="bottom">
                  <button
                    onClick={() => setActiveTab(tab.id as Tab)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-[var(--accent-web)] text-[var(--accent-web)]'
                        : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-secondary)]'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                    {/* Badge for notifications */}
                    {tab.id === 'notifications' && stats.pendingNotifications > 0 && (
                      <Tooltip content={`${stats.pendingNotifications} pending notifications`} position="top">
                        <span className="bg-[var(--accent-web)] text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {stats.pendingNotifications}
                        </span>
                      </Tooltip>
                    )}
                  </button>
                </Tooltip>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="py-8">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

// Admin Settings Component
function AdminSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    autoNotifyNewPost: true,
    autoNotifyNewSubscriber: true,
    notificationFromEmail: 'noreply@techblog.com',
    notificationFromName: 'TechBlog'
  })

  const [loading, setLoading] = useState(false)
  const [testingSmtp, setTestingSmtp] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        alert('Settings saved successfully!')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  const handleTestSmtp = async () => {
    setTestingSmtp(true)
    try {
      const response = await fetch('/api/admin/test-smtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()
      
      if (result.success) {
        alert(result.message)
      } else {
        alert(result.error)
      }
    } catch (error) {
      console.error('Error testing SMTP:', error)
      alert('Failed to test SMTP connection')
    } finally {
      setTestingSmtp(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-6">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">
          Admin Settings
        </h2>
        
        <div className="space-y-6">
          {/* Email Notifications */}
          <div>
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">
              Email Notifications
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[var(--text-primary)]">
                  Enable Email Notifications
                </label>
                <Tooltip content="Toggle email notifications system on/off" position="left">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                    className="h-4 w-4 text-[var(--accent-web)] focus:ring-[var(--accent-web)]"
                  />
                </Tooltip>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-[var(--text-primary)]">
                  Auto-notify on new post
                </label>
                <Tooltip content="Automatically send notification to subscribers when a new post is published" position="left">
                  <input
                    type="checkbox"
                    checked={settings.autoNotifyNewPost}
                    onChange={(e) => setSettings({...settings, autoNotifyNewPost: e.target.checked})}
                    className="h-4 w-4 text-[var(--accent-web)] focus:ring-[var(--accent-web)]"
                  />
                </Tooltip>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-[var(--text-primary)]">
                  Auto-notify on new subscriber
                </label>
                <Tooltip content="Automatically send welcome email to new subscribers" position="left">
                  <input
                    type="checkbox"
                    checked={settings.autoNotifyNewSubscriber}
                    onChange={(e) => setSettings({...settings, autoNotifyNewSubscriber: e.target.checked})}
                    className="h-4 w-4 text-[var(--accent-web)] focus:ring-[var(--accent-web)]"
                  />
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Email Settings */}
          <div>
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">
              Email Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  From Email
                </label>
                <Tooltip content="Email address that will appear as sender in notifications" position="top">
                  <input
                    type="email"
                    value={settings.notificationFromEmail}
                    onChange={(e) => setSettings({...settings, notificationFromEmail: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-md bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-web)]"
                  />
                </Tooltip>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  From Name
                </label>
                <Tooltip content="Name that will appear as sender in notifications" position="top">
                  <input
                    type="text"
                    value={settings.notificationFromName}
                    onChange={(e) => setSettings({...settings, notificationFromName: e.target.value})}
                    className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-md bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-web)]"
                  />
                </Tooltip>
              </div>
            </div>
          </div>

          {/* SMTP Test */}
          <div>
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">
              Email Server Test
            </h3>
            <div className="bg-[var(--background-secondary)] p-4 rounded-lg border border-[var(--border-primary)]">
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                Test your SMTP connection to ensure email notifications are working properly.
              </p>
              <Tooltip content="Test SMTP server connection and configuration" position="top">
                <button
                  onClick={handleTestSmtp}
                  disabled={testingSmtp}
                  className="bg-[var(--accent-iot)] text-white px-4 py-2 rounded-md hover:bg-[var(--accent-iot-dark)] disabled:opacity-50 transition-colors flex items-center space-x-2"
                >
                  <Mail className="h-4 w-4" />
                  <span>{testingSmtp ? 'Testing...' : 'Test SMTP Connection'}</span>
                </button>
              </Tooltip>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-[var(--border-primary)]">
            <Tooltip content="Save all admin settings and preferences" position="top">
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-[var(--accent-web)] text-white px-4 py-2 rounded-md hover:bg-[var(--accent-web-dark)] disabled:opacity-50 transition-colors"
              >
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  )
} 