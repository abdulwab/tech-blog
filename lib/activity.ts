import { prisma } from './prisma'

export type ActivityType = 
  | 'post_created'
  | 'post_published'
  | 'post_updated'
  | 'post_deleted'
  | 'post_featured'
  | 'post_unfeatured'
  | 'subscriber_added'
  | 'subscriber_removed'
  | 'subscriber_activated'
  | 'subscriber_deactivated'
  | 'notification_created'
  | 'notification_sent'
  | 'notification_scheduled'
  | 'notification_failed'
  | 'category_created'
  | 'category_updated'
  | 'category_deleted'
  | 'admin_login'
  | 'admin_logout'

export interface LogActivityParams {
  type: ActivityType
  title: string
  details?: string
  metadata?: Record<string, any>
  createdBy?: string
}

export async function logActivity({
  type,
  title,
  details,
  metadata,
  createdBy
}: LogActivityParams) {
  try {
    await prisma.activityLog.create({
      data: {
        type,
        title,
        details,
        metadata: metadata ? JSON.stringify(metadata) : null,
        createdBy
      }
    })
  } catch (error) {
    console.error('Error logging activity:', error)
    // Don't throw error to avoid breaking the main operation
  }
}

export function getActivityIcon(type: ActivityType): string {
  switch (type) {
    case 'post_created':
    case 'post_updated':
      return 'FileText'
    case 'post_published':
      return 'CheckCircle'
    case 'post_deleted':
      return 'Trash2'
    case 'post_featured':
    case 'post_unfeatured':
      return 'Star'
    case 'subscriber_added':
    case 'subscriber_activated':
      return 'Users'
    case 'subscriber_removed':
    case 'subscriber_deactivated':
      return 'UserX'
    case 'notification_created':
    case 'notification_scheduled':
      return 'Mail'
    case 'notification_sent':
      return 'Send'
    case 'notification_failed':
      return 'AlertCircle'
    case 'category_created':
    case 'category_updated':
      return 'Tag'
    case 'category_deleted':
      return 'Trash2'
    case 'admin_login':
    case 'admin_logout':
      return 'User'
    default:
      return 'Bell'
  }
}

export function getActivityColor(type: ActivityType): string {
  switch (type) {
    case 'post_created':
    case 'post_updated':
      return 'bg-blue-100 text-blue-600'
    case 'post_published':
    case 'subscriber_added':
    case 'subscriber_activated':
    case 'notification_sent':
      return 'bg-green-100 text-green-600'
    case 'post_deleted':
    case 'subscriber_removed':
    case 'subscriber_deactivated':
    case 'notification_failed':
    case 'category_deleted':
      return 'bg-red-100 text-red-600'
    case 'post_featured':
    case 'post_unfeatured':
      return 'bg-yellow-100 text-yellow-600'
    case 'notification_created':
    case 'notification_scheduled':
      return 'bg-purple-100 text-purple-600'
    case 'category_created':
    case 'category_updated':
      return 'bg-indigo-100 text-indigo-600'
    case 'admin_login':
    case 'admin_logout':
      return 'bg-gray-100 text-gray-600'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

export function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSeconds < 60) {
    return `${diffSeconds} second${diffSeconds !== 1 ? 's' : ''} ago`
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  } else {
    return date.toLocaleDateString()
  }
} 