const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const categories = [
  {
    name: 'Web Development',
    slug: 'web-development',
    description: 'Frontend and backend web development tutorials, frameworks, and best practices',
    color: '#3b82f6',
    icon: '💻'
  },
  {
    name: 'Artificial Intelligence',
    slug: 'artificial-intelligence',
    description: 'AI, machine learning, and deep learning content',
    color: '#8b5cf6',
    icon: '🤖'
  },
  {
    name: 'JavaScript',
    slug: 'javascript',
    description: 'JavaScript tutorials, frameworks, and modern development practices',
    color: '#f59e0b',
    icon: '⚡'
  },
  {
    name: 'React',
    slug: 'react',
    description: 'React tutorials, hooks, state management, and ecosystem',
    color: '#06b6d4',
    icon: '⚛️'
  },
  {
    name: 'Internet of Things',
    slug: 'iot',
    description: 'IoT devices, sensors, smart home technology, and embedded systems',
    color: '#10b981',
    icon: '🌐'
  },
  {
    name: 'Mobile Development',
    slug: 'mobile-development',
    description: 'iOS, Android, React Native, and cross-platform mobile development',
    color: '#f97316',
    icon: '📱'
  },
  {
    name: 'Blockchain',
    slug: 'blockchain',
    description: 'Cryptocurrency, smart contracts, Web3, and decentralized technologies',
    color: '#ef4444',
    icon: '⛓️'
  },
  {
    name: 'DevOps',
    slug: 'devops',
    description: 'CI/CD, deployment, monitoring, and infrastructure management',
    color: '#84cc16',
    icon: '🔧'
  },
  {
    name: 'Data Science',
    slug: 'data-science',
    description: 'Data analysis, visualization, statistics, and data engineering',
    color: '#ec4899',
    icon: '📊'
  },
  {
    name: 'Cybersecurity',
    slug: 'cybersecurity',
    description: 'Security best practices, ethical hacking, and data protection',
    color: '#dc2626',
    icon: '🔒'
  }
]

async function seedCategories() {
  console.log('🌱 Seeding categories...')
  
  try {
    for (const category of categories) {
      const existingCategory = await prisma.category.findFirst({
        where: {
          OR: [
            { name: category.name },
            { slug: category.slug }
          ]
        }
      })

      if (!existingCategory) {
        await prisma.category.create({
          data: category
        })
        console.log(`✅ Created category: ${category.name}`)
      } else {
        console.log(`⚠️  Category already exists: ${category.name}`)
      }
    }
    
    console.log('🎉 Categories seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding categories:', error)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  seedCategories()
}

module.exports = { seedCategories } 