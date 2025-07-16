import nodemailer from 'nodemailer'
import { logActivity } from './activity'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface EmailData {
  to: string[]
  subject: string
  html: string
  text?: string
}

export interface SMTPConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

// Create SMTP transporter
function createTransporter() {
  const config: SMTPConfig = {
    host: process.env.SMTP_HOST!,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  }

  return nodemailer.createTransport(config)
}

export async function sendEmail({ to, subject, html, text }: EmailData) {
  try {
    const transporter = createTransporter()

    // Verify SMTP connection
    await transporter.verify()

    // Send email to each recipient individually to avoid exposing email lists
    const results = []
    
    for (const email of to) {
      try {
        const info = await transporter.sendMail({
          from: `"${process.env.EMAIL_FROM_NAME || 'Abdul Wahab'}" <${process.env.EMAIL_FROM}>`,
          replyTo: process.env.EMAIL_REPLY_TO || process.env.EMAIL_FROM,
          to: email,
          subject,
          html,
          text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
          headers: {
            // Improved deliverability headers
            'List-Unsubscribe': `<${process.env.NEXT_PUBLIC_APP_URL}/api/subscribe?email=${encodeURIComponent(email)}&action=unsubscribe>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
            'X-Entity-Ref-ID': `blog-notification-${Date.now()}`,
            'X-Mailer': 'Abdul Wahab Tech Blog',
            'X-Priority': '3',
            'Importance': 'normal',
            'Auto-Submitted': 'auto-generated',
            'Precedence': 'bulk',
            'X-MC-Tags': 'transactional,blog-notification',
            'Category': 'transactional',
            'Return-Path': process.env.EMAIL_FROM,
            'Errors-To': process.env.EMAIL_FROM,
          } as any,
        })

        results.push({ email, success: true, messageId: (info as any)?.messageId || 'unknown' })
      } catch (error) {
        console.error(`Failed to send email to ${email}:`, error)
        results.push({ email, success: false, error })
      }
    }

    const successCount = results.filter(r => r.success).length
    const failedCount = results.filter(r => !r.success).length

    console.log(`Email sending complete: ${successCount} sent, ${failedCount} failed`)

    return { 
      success: failedCount === 0, 
      results,
      successCount,
      failedCount,
      total: to.length
    }
  } catch (error) {
    console.error('SMTP connection failed:', error)
    return { success: false, error, successCount: 0, failedCount: to.length, total: to.length }
  }
}

export async function testSMTPConnection() {
  try {
    const transporter = createTransporter()
    await transporter.verify()
    console.log('✅ SMTP connection successful')
    return { success: true, message: 'SMTP connection successful' }
  } catch (error) {
    console.error('❌ SMTP connection failed:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Gmail daily sending limits
export const GMAIL_DAILY_LIMIT = 500 // Free Gmail account
export const GMAIL_RATE_LIMIT = 30 // Emails per minute

// Get Gmail sending guidelines
export function getGmailLimits() {
  return {
    dailyLimit: GMAIL_DAILY_LIMIT,
    rateLimit: GMAIL_RATE_LIMIT,
    recommendations: [
      'Free Gmail: 500 emails per day',
      'Google Workspace: 2,000 emails per day',
      'Rate limit: ~30 emails per minute',
      'Limit resets every 24 hours',
      'Enable 2FA and use app password'
    ]
  }
}

// Email template interfaces
export interface NewPostEmailData {
  title: string
  description: string
  slug: string
  coverImage: string
  author: string
  category: string
  publishedAt?: string
}

export interface NewsletterEmailData {
  subject: string
  content: string
  unsubscribeUrl: string
}

// Create modern email template with full post content
export function createNewPostEmailTemplate(data: NewPostEmailData): string {
  const { title, description, slug, coverImage, author, category, publishedAt } = data
  const postUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${slug}`
  const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/subscribe?action=unsubscribe`
  const blogUrl = `${process.env.NEXT_PUBLIC_APP_URL}/blog`
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #374151;
            max-width: 680px;
            margin: 0 auto;
            padding: 0;
            background-color: #ffffff;
        }
        .container {
            background: #ffffff;
            margin: 0;
            padding: 0;
        }
        .header {
            text-align: center;
            padding: 40px 20px 20px 20px;
            border-bottom: 1px solid #e5e7eb;
        }
        .logo {
            font-size: 24px;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 8px;
            text-decoration: none;
        }
        .tagline {
            font-size: 14px;
            color: #6b7280;
            margin: 0;
        }
        .content {
            padding: 40px 20px;
        }
        .post-image {
            width: 100%;
            height: auto;
            border-radius: 12px;
            margin-bottom: 30px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .post-title {
            font-size: 32px;
            font-weight: 700;
            color: #111827;
            margin: 0 0 20px 0;
            line-height: 1.2;
        }
        .post-meta {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid #f3f4f6;
        }
        .author-info {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .author-name {
            font-weight: 600;
            color: #374151;
            font-size: 14px;
        }
        .post-date {
            color: #6b7280;
            font-size: 14px;
        }
        .category-badge {
            background: #dbeafe;
            color: #1e40af;
            padding: 4px 12px;
            border-radius: 16px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .post-content {
            font-size: 16px;
            line-height: 1.7;
            color: #374151;
        }
        .post-content h1, .post-content h2, .post-content h3 {
            color: #111827;
            margin-top: 30px;
            margin-bottom: 15px;
            font-weight: 600;
        }
        .post-content h1 { font-size: 28px; }
        .post-content h2 { font-size: 24px; }
        .post-content h3 { font-size: 20px; }
        .post-content p {
            margin-bottom: 16px;
        }
        .post-content ul, .post-content ol {
            margin-bottom: 16px;
            padding-left: 20px;
        }
        .post-content li {
            margin-bottom: 8px;
        }
        .post-content blockquote {
            border-left: 4px solid #3b82f6;
            margin: 20px 0;
            padding: 12px 20px;
            background: #f8fafc;
            border-radius: 0 8px 8px 0;
            font-style: italic;
        }
        .post-content code {
            background: #f1f5f9;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 14px;
            color: #e11d48;
        }
        .post-content pre {
            background: #1e293b;
            color: #e2e8f0;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 20px 0;
        }
        .post-content pre code {
            background: none;
            color: inherit;
            padding: 0;
        }
        .cta-section {
            text-align: center;
            margin: 40px 0;
            padding: 30px 20px;
            background: #f9fafb;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
        }
        .cta-text {
            color: #6b7280;
            margin-bottom: 20px;
            font-size: 14px;
        }
        .cta-button {
            display: inline-block;
            background: #3b82f6;
            color: white !important;
            padding: 12px 28px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 14px;
            transition: background-color 0.3s;
        }
        .cta-button:hover {
            background: #2563eb;
        }
        .footer {
            background: #f9fafb;
            padding: 30px 20px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
            margin-top: 40px;
        }
        .footer-links {
            margin-bottom: 15px;
        }
        .footer-links a {
            color: #6b7280;
            text-decoration: none;
            margin: 0 15px;
            font-size: 14px;
        }
        .footer-text {
            color: #9ca3af;
            font-size: 12px;
            line-height: 1.5;
        }
        .unsubscribe {
            color: #9ca3af;
            text-decoration: none;
            font-size: 12px;
        }
        @media (max-width: 600px) {
            .post-title {
                font-size: 24px;
            }
            .content {
                padding: 30px 15px;
            }
            .post-meta {
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        
        <!-- Header -->
        <div class="header">
            <a href="${blogUrl}" class="logo">Abdul Wahab</a>
            <p class="tagline">Tech insights and tutorials</p>
        </div>

        <!-- Main Content -->
        <div class="content">
            
            <!-- Cover Image -->
            <img src="${coverImage}" alt="${title}" class="post-image">
            
            <!-- Post Title -->
            <h1 class="post-title">${title}</h1>
            
            <!-- Post Meta -->
            <div class="post-meta">
                <div class="author-info">
                    <span class="author-name">By ${author}</span>
                </div>
                <span class="post-date">${new Date(publishedAt || new Date()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span class="category-badge">${category}</span>
            </div>
            
            <!-- Post Content -->
            <div class="post-content">
                ${description}
            </div>
            
            <!-- Call to Action -->
            <div class="cta-section">
                <p class="cta-text">Continue reading on the website for the full experience</p>
                <a href="${postUrl}" class="cta-button">View on Website</a>
            </div>
            
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="footer-links">
                <a href="${blogUrl}">Blog</a>
                <a href="${blogUrl}/about">About</a>
                <a href="${blogUrl}/contact">Contact</a>
            </div>
            <p class="footer-text">
                You're receiving this because you subscribed to Abdul Wahab's Tech Blog.<br>
                <a href="${unsubscribeUrl}" class="unsubscribe">Unsubscribe</a> • 
                <a href="${postUrl}" class="unsubscribe">View in browser</a>
            </p>
        </div>
        
    </div>
</body>
</html>`
}

// Newsletter template
export function createNewsletterTemplate(data: NewsletterEmailData): string {
  const { subject, content, unsubscribeUrl } = data
  const blogUrl = `${process.env.NEXT_PUBLIC_APP_URL}/blog`
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 30px 20px;
            text-align: center;
            color: white;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
        }
        .content {
            padding: 30px 20px;
        }
        .footer {
            background: #f7fafc;
            padding: 30px 20px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        .footer p {
            margin: 5px 0;
            font-size: 14px;
            color: #718096;
        }
        .footer a {
            color: #667eea;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📧 Newsletter</h1>
            <p>Abdul Wahab's Tech Updates</p>
        </div>
        
        <div class="content">
            ${content}
        </div>
        
        <div class="footer">
            <p>You're receiving this newsletter because you subscribed to Abdul Wahab's Tech Blog.</p>
            <p>
                <a href="${unsubscribeUrl}">Unsubscribe</a> | 
                <a href="${blogUrl}">Visit Blog</a>
            </p>
        </div>
    </div>
</body>
</html>
  `
}

// Quick send function for new post notifications
export async function sendNewPostNotification(postData: NewPostEmailData, subscribers: string[]) {
  const subject = `${postData.title}`
  const html = createNewPostEmailTemplate(postData)
  
  const result = await sendEmail({
    to: subscribers,
    subject,
    html
  })

  // Log activity
  if (result.successCount > 0) {
    await logActivity({
      type: 'notification_sent',
      title: `Post notification sent: "${postData.title}"`,
      details: `Automatic notification sent to ${result.successCount} subscribers${result.failedCount > 0 ? `, ${result.failedCount} failed` : ''}`,
      metadata: {
        postSlug: postData.slug,
        postTitle: postData.title,
        recipientCount: result.successCount,
        failedCount: result.failedCount,
        totalSubscribers: result.total,
        notificationType: 'new_post'
      }
    })
  }

  return result
}

// Send custom newsletter
export async function sendNewsletterEmail(newsletterData: NewsletterEmailData, subscribers: string[]) {
  const html = createNewsletterTemplate(newsletterData)
  
  return await sendEmail({
    to: subscribers,
    subject: newsletterData.subject,
    html
  })
}

// Create transactional-style subject lines for better inbox placement
export function createTransactionalSubject(title: string, author: string): string {
  // Avoid promotional keywords and make it more personal/notification-like
  const subjects = [
    `New post: ${title}`,
    `${author} published: ${title}`,
    `Article update: ${title}`,
    `Blog notification: ${title}`,
    `${title} - New from ${author}`
  ];
  
  // Return the first one for consistency, but you could randomize
  return subjects[0];
}

// Send blog notification with improved deliverability
export async function sendBlogNotification(postData: NewPostEmailData) {
  try {
    // Get all active subscribers
    const subscribers = await prisma.subscriber.findMany({
      where: { isActive: true },
      select: { email: true }
    })

    if (subscribers.length === 0) {
      return { success: true, message: 'No active subscribers to notify' }
    }

    // Create transactional subject
    const subject = createTransactionalSubject(postData.title, postData.author)
    
    // Create email content  
    const htmlContent = createNewPostEmailTemplate(postData)
    const textContent = `
New Article Published

${postData.title}
By ${postData.author}

${postData.description}

Read the full article: ${process.env.NEXT_PUBLIC_APP_URL}/${postData.slug}

---

This is an automated notification from Abdul Wahab's Tech Blog.
To unsubscribe: ${process.env.NEXT_PUBLIC_APP_URL}/api/subscribe?action=unsubscribe
    `.trim()

    // Send emails with improved deliverability
    const result = await sendEmail({
      to: subscribers.map(sub => sub.email),
      subject,
      html: htmlContent,
      text: textContent
    })

    return result
  } catch (error) {
    console.error('Error sending blog notification:', error)
    return { success: false, error }
  }
}

 