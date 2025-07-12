const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedActivities() {
  console.log('Seeding sample activities...')

  const activities = [
    {
      type: 'post_published',
      title: 'Published new post: "Getting Started with React Hooks"',
      details: 'A comprehensive guide to using React hooks effectively in modern applications',
      metadata: {
        postId: 'sample-post-1',
        postSlug: 'getting-started-with-react-hooks',
        category: 'React'
      },
      createdAt: new Date(Date.now() - 2 * 60 * 1000) // 2 minutes ago
    },
    {
      type: 'subscriber_added',
      title: 'New subscriber joined',
      details: 'john.doe@example.com subscribed to the newsletter',
      metadata: {
        email: 'john.doe@example.com',
        source: 'blog_footer'
      },
      createdAt: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes ago
    },
    {
      type: 'notification_sent',
      title: 'Newsletter sent to 150 subscribers',
      details: 'Monthly newsletter "Tech Updates December 2024" successfully delivered',
      metadata: {
        subject: 'Tech Updates December 2024',
        recipientCount: 150,
        successCount: 150,
        failedCount: 0
      },
      createdAt: new Date(Date.now() - 60 * 60 * 1000) // 1 hour ago
    },
    {
      type: 'post_created',
      title: 'Created new draft post: "Advanced TypeScript Patterns"',
      details: 'New blog post draft created and saved for review',
      metadata: {
        postId: 'sample-post-2',
        postSlug: 'advanced-typescript-patterns',
        category: 'TypeScript'
      },
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    },
    {
      type: 'category_created',
      title: 'Created new category: "Machine Learning"',
      details: 'Added new blog category for ML-related content',
      metadata: {
        categoryName: 'Machine Learning',
        categorySlug: 'machine-learning',
        categoryColor: '#ef4444'
      },
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
    },
    {
      type: 'post_featured',
      title: 'Featured post: "Complete Guide to Next.js 14"',
      details: 'Marked post as featured on the homepage',
      metadata: {
        postId: 'sample-post-3',
        postSlug: 'complete-guide-nextjs-14',
        category: 'Web Development'
      },
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
    },
    {
      type: 'subscriber_activated',
      title: 'Subscriber reactivated',
      details: 'jane.smith@example.com reactivated their subscription',
      metadata: {
        email: 'jane.smith@example.com',
        previousStatus: 'inactive'
      },
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
    },
    {
      type: 'notification_created',
      title: 'Created new newsletter draft',
      details: 'Prepared newsletter about upcoming webinar series',
      metadata: {
        subject: 'Webinar Series: Advanced React Patterns',
        recipientType: 'all'
      },
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
    },
    {
      type: 'post_updated',
      title: 'Updated post: "Vue.js Best Practices"',
      details: 'Updated content and added new examples',
      metadata: {
        postId: 'sample-post-4',
        postSlug: 'vuejs-best-practices',
        category: 'Vue.js'
      },
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
    },
    {
      type: 'category_updated',
      title: 'Updated category: "JavaScript"',
      details: 'Updated category description and color scheme',
      metadata: {
        categoryName: 'JavaScript',
        categorySlug: 'javascript',
        changes: ['description', 'color']
      },
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    }
  ]

  for (const activity of activities) {
    await prisma.activityLog.create({
      data: {
        type: activity.type,
        title: activity.title,
        details: activity.details,
        metadata: activity.metadata,
        createdAt: activity.createdAt
      }
    })
  }

  console.log(`✅ Successfully seeded ${activities.length} activities`)
}

async function main() {
  try {
    await seedActivities()
  } catch (error) {
    console.error('Error seeding activities:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main() 