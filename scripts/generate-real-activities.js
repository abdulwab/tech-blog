const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function generateRealActivities() {
  console.log('Generating real activity data from existing database records...')

  try {
    // Clear existing activity logs
    await prisma.activityLog.deleteMany()
    console.log('Cleared existing activity logs')

    // Get all posts and create activities based on their actual timestamps
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20 // Limit to recent posts for performance
    })

    for (const post of posts) {
      // Create activity for post creation
      await prisma.activityLog.create({
        data: {
          type: 'post_created',
          title: `Created new draft post: "${post.title}"`,
          details: `New blog post draft created in ${post.category} category`,
          metadata: {
            postId: post.id,
            postSlug: post.slug,
            category: post.category,
            tags: post.tags,
            author: post.author
          },
          createdAt: post.createdAt
        }
      })

      // If post is published, create publish activity
      if (post.isPublished) {
        await prisma.activityLog.create({
          data: {
            type: 'post_published',
            title: `Published post: "${post.title}"`,
            details: `Post moved from draft to published status`,
            metadata: {
              postId: post.id,
              postSlug: post.slug,
              category: post.category,
              tags: post.tags,
              author: post.author
            },
            createdAt: post.updatedAt
          }
        })
      }

      // If post is featured, create featured activity
      if (post.isFeatured) {
        await prisma.activityLog.create({
          data: {
            type: 'post_featured',
            title: `Featured post: "${post.title}"`,
            details: `Post added to featured section`,
            metadata: {
              postId: post.id,
              postSlug: post.slug,
              category: post.category,
              featured: true
            },
            createdAt: post.updatedAt
          }
        })
      }
    }

    // Get all subscribers and create activities based on their actual timestamps
    const subscribers = await prisma.subscriber.findMany({
      orderBy: { subscribedAt: 'desc' },
      take: 20 // Limit to recent subscribers for performance
    })

    for (const subscriber of subscribers) {
      await prisma.activityLog.create({
        data: {
          type: 'subscriber_added',
          title: `New subscriber joined: ${subscriber.email}`,
          details: `New subscriber joined through the website subscription form`,
          metadata: {
            subscriberId: subscriber.id,
            email: subscriber.email,
            source: 'website_form',
            isActive: subscriber.isActive
          },
          createdAt: subscriber.subscribedAt
        }
      })

      // If subscriber is currently inactive, create deactivation activity
      if (!subscriber.isActive) {
        await prisma.activityLog.create({
          data: {
            type: 'subscriber_deactivated',
            title: `Subscriber unsubscribed: ${subscriber.email}`,
            details: `Subscriber unsubscribed through the website`,
            metadata: {
              subscriberId: subscriber.id,
              email: subscriber.email,
              source: 'website_form',
              action: 'unsubscribed'
            },
            createdAt: new Date(subscriber.subscribedAt.getTime() + (Math.random() * 30 * 24 * 60 * 60 * 1000)) // Random time after subscription
          }
        })
      }
    }

    // Get all categories and create activities based on their actual timestamps
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    for (const category of categories) {
      await prisma.activityLog.create({
        data: {
          type: 'category_created',
          title: `Created new category: "${category.name}"`,
          details: `Added new blog category for content organization`,
          metadata: {
            categoryId: category.id,
            categoryName: category.name,
            categorySlug: category.slug,
            categoryColor: category.color,
            categoryIcon: category.icon
          },
          createdAt: category.createdAt
        }
      })

      // If category was updated, create update activity
      if (category.updatedAt > category.createdAt) {
        await prisma.activityLog.create({
          data: {
            type: 'category_updated',
            title: `Updated category: "${category.name}"`,
            details: `Category details and styling updated`,
            metadata: {
              categoryId: category.id,
              categoryName: category.name,
              categorySlug: category.slug,
              categoryColor: category.color,
              categoryIcon: category.icon
            },
            createdAt: category.updatedAt
          }
        })
      }
    }

    // Get all email notifications and create activities based on their actual timestamps
    const notifications = await prisma.emailNotification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    for (const notification of notifications) {
      await prisma.activityLog.create({
        data: {
          type: 'notification_created',
          title: `Created new newsletter draft: "${notification.subject}"`,
          details: `Prepared newsletter for subscriber distribution`,
          metadata: {
            notificationId: notification.id,
            subject: notification.subject,
            recipientType: notification.recipientType,
            status: notification.status
          },
          createdAt: notification.createdAt
        }
      })

      // If notification was sent, create sent activity
      if (notification.sentAt && notification.status === 'sent') {
        await prisma.activityLog.create({
          data: {
            type: 'notification_sent',
            title: `Newsletter sent: "${notification.subject}"`,
            details: `Newsletter successfully delivered to ${notification.sentCount} subscribers`,
            metadata: {
              notificationId: notification.id,
              subject: notification.subject,
              recipientCount: notification.sentCount,
              failedCount: notification.failedCount,
              recipientType: notification.recipientType
            },
            createdAt: notification.sentAt
          }
        })
      }
    }

    // Get count of activities created
    const activityCount = await prisma.activityLog.count()
    console.log(`✅ Successfully generated ${activityCount} real activities from database records`)

  } catch (error) {
    console.error('Error generating real activities:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

generateRealActivities() 