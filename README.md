# 🔐 Abdul Wahab - Full-Stack Blog with Admin Panel

A secure, full-stack technical blog built with **Next.js 14+**, **Prisma**, **PostgreSQL**, and **Clerk** authentication. Features a complete CMS, email subscriptions, SEO optimization, and a beautiful responsive design.

![Abdul Wahab Blog](https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=1200&h=600&fit=crop)

## ✨ Features

- 🔐 **Clerk Authentication** - Secure admin access
- 📝 **Markdown Editor** - Rich content creation with syntax highlighting
- 📧 **Email Subscriptions** - Newsletter with Resend integration
- 🎯 **SEO Optimized** - Dynamic meta tags and Open Graph
- 📱 **Responsive Design** - Beautiful UI with Tailwind CSS
- 🏷️ **Categories & Tags** - Organized content management
- 🔍 **Search & Filter** - Easy content discovery
- 📊 **Admin Dashboard** - Complete post management
- 🚀 **Static Generation** - Optimized performance
- 📬 **Email Notifications** - Automated subscriber updates

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ (App Router), React, TypeScript
- **Styling**: Tailwind CSS, Lucide Icons
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **Email**: Resend
- **Deployment**: Vercel
- **Content**: Markdown with syntax highlighting

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or hosted)
- Clerk account
- Resend account

### 1. Clone and Install

\`\`\`bash
git clone <your-repo-url>
cd tech-blog
npm install
\`\`\`

### 2. Environment Setup

Create a \`.env.local\` file:

\`\`\`env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/techblog"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/admin
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/admin

# Email Service (Resend)
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@yourdomain.com

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 3. Database Setup

\`\`\`bash
# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# (Optional) View database
npx prisma studio
\`\`\`

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000) to see your blog!

## 📁 Project Structure

\`\`\`
tech-blog/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Homepage
│   ├── admin/            # Admin dashboard
│   ├── blog/             # Blog pages
│   │   ├── page.tsx      # Blog listing
│   │   └── [slug]/       # Individual posts
│   └── api/              # API routes
│       ├── posts/        # CRUD for posts
│       ├── subscribe/    # Email subscriptions
│       └── notify/       # Email notifications
├── components/           # React components
│   ├── BlogPost.tsx     # Markdown renderer
│   ├── PostEditor.tsx   # Admin editor
│   ├── SubscriptionForm.tsx
│   ├── Header.tsx
│   └── Footer.tsx
├── lib/                 # Utilities
│   ├── prisma.ts       # Database client
│   ├── utils.ts        # Helper functions
│   ├── markdown.ts     # Markdown processing
│   └── email.ts        # Email templates
├── prisma/
│   └── schema.prisma   # Database schema
└── middleware.ts       # Clerk route protection
\`\`\`

## 🔐 Authentication Setup

### Clerk Configuration

1. **Create Clerk Account**: Sign up at [clerk.com](https://clerk.com)
2. **Create Application**: Set up a new Next.js application
3. **Get API Keys**: Copy your publishable and secret keys
4. **Configure URLs**: Set redirect URLs in Clerk dashboard

### Protected Routes

- \`/admin\` - Admin dashboard (requires authentication)
- \`/api/posts\` - Post creation (requires authentication)
- \`/api/notify\` - Send emails (requires authentication)

## 📧 Email Setup

### Resend Integration

1. **Create Account**: Sign up at [resend.com](https://resend.com)
2. **Get API Key**: Generate API key in dashboard
3. **Verify Domain**: Add and verify your domain
4. **Configure Templates**: Email templates are in \`lib/email.ts\`

### Email Features

- **Subscription Management**: Users can subscribe/unsubscribe
- **New Post Notifications**: Automatic emails to subscribers
- **Beautiful Templates**: HTML email templates
- **Batch Processing**: Efficient bulk email sending

## 🎨 Customization

### Styling

- **Tailwind CSS**: Modify \`tailwind.config.js\`
- **Color Scheme**: Update CSS variables in \`globals.css\`
- **Components**: Customize in \`components/\` directory

### Content

- **Categories**: Add/modify in \`components/PostEditor.tsx\`
- **Logo & Branding**: Update in \`components/Header.tsx\`
- **Homepage**: Customize \`app/page.tsx\`

### Database

- **Schema Changes**: Modify \`prisma/schema.prisma\`
- **Migrations**: Run \`npx prisma db push\`

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository**: Link your GitHub repo to Vercel
2. **Environment Variables**: Add all env vars in Vercel dashboard
3. **Database**: Use hosted PostgreSQL (Supabase, Railway, PlanetScale)
4. **Custom Domain**: Configure your domain

### Environment Variables for Production

\`\`\`env
DATABASE_URL=postgresql://...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
\`\`\`

## 📝 Usage Guide

### Creating Blog Posts

1. **Access Admin**: Visit \`/admin\` and sign in
2. **Fill Form**: Add title, description, content (Markdown)
3. **Set Options**: Choose category, tags, featured status
4. **Publish**: Check "Publish Immediately" to go live
5. **Email Notification**: Subscribers automatically notified

### Content Management

- **Markdown Support**: Full markdown with syntax highlighting
- **Image Handling**: Use external URLs (Cloudinary, Unsplash)
- **SEO**: Automatic meta tags and Open Graph
- **Categories**: Organize posts by topic
- **Tags**: Add relevant keywords

### Subscriber Management

- **Database Access**: Use Prisma Studio to view subscribers
- **Export Data**: Query database for subscriber lists
- **Unsubscribe**: Built-in unsubscribe functionality

## 🔧 API Reference

### Posts API (\`/api/posts\`)

- **GET**: Fetch posts with optional filters
- **POST**: Create new post (authenticated)

### Subscribe API (\`/api/subscribe\`)

- **POST**: Add new subscriber
- **DELETE**: Unsubscribe user

### Notify API (\`/api/notify\`)

- **POST**: Send email notifications (authenticated)

## 📊 Performance

- **Static Generation**: Pages pre-rendered for speed
- **Image Optimization**: Next.js automatic optimization
- **Code Splitting**: Automatic bundle optimization
- **Caching**: Database queries cached where appropriate

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make your changes
4. Test thoroughly
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Documentation**: Check this README and code comments
- **Issues**: Create GitHub issues for bugs
- **Community**: Join discussions in GitHub Discussions

---

**Built with ❤️ using Next.js, Prisma, and Clerk** 