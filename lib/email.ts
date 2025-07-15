import nodemailer from 'nodemailer'
import { logActivity } from './activity'

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
            'List-Unsubscribe': `<${process.env.NEXT_PUBLIC_APP_URL}/api/subscribe?email=${encodeURIComponent(email)}&action=unsubscribe>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          },
        })

        results.push({ email, success: true, messageId: info.messageId })
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

// Create beautiful HTML email template for new posts
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
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 16px;
        }
        .content {
            padding: 30px 20px;
        }
        .post-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .post-title {
            font-size: 24px;
            font-weight: 700;
            color: #1a202c;
            margin: 0 0 15px 0;
            line-height: 1.3;
        }
        .post-meta {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 20px;
            font-size: 14px;
            color: #718096;
        }
        .category-badge {
            background: #667eea;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }
        .post-description {
            font-size: 16px;
            color: #4a5568;
            margin-bottom: 30px;
            line-height: 1.6;
        }
        .cta-button {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            transition: background-color 0.3s;
        }
        .cta-button:hover {
            background: #5a67d8;
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
        .social-links {
            margin: 20px 0;
        }
        .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #667eea;
            text-decoration: none;
            font-size: 14px;
        }
        @media (max-width: 600px) {
            body {
                padding: 10px;
            }
            .header h1 {
                font-size: 24px;
            }
            .post-title {
                font-size: 20px;
            }
            .content {
                padding: 20px 15px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📚 Abdul Wahab</h1>
            <p>Published just for you!</p>
        </div>
        
        <div class="content">
        <h2 class="post-title">${title}</h2>
            <img src="${coverImage}" alt="${title}" class="post-image" />
            
            
            
            <div class="post-meta">
                <span>✍️ By ${author}</span>
                <span class="category-badge">${category}</span>
                ${publishedAt ? `<span>📅 ${new Date(publishedAt).toLocaleDateString()}</span>` : ''}
            </div>
            
            <p class="post-description">${description}</p>
            
            <a href="${postUrl}" class="cta-button">Read Full Article →</a>
        </div>
        
        <div class="footer">
            <p><strong>Thanks for being a subscriber!</strong></p>
            <p>You're receiving this because you subscribed to our newsletter.</p>
            
            <div class="social-links">
                <a href="${blogUrl}">Browse All Posts</a> •
                <a href="${postUrl}">Read Article</a> •
                <a href="${unsubscribeUrl}">Unsubscribe</a>
            </div>
            
            <p style="margin-top: 20px; font-size: 12px;">
                © ${new Date().getFullYear()} Abdul Wahab. All rights reserved.<br>
                <a href="${unsubscribeUrl}">Unsubscribe</a> from future emails.
            </p>
        </div>
    </div>
</body>
</html>`
}

// Create newsletter template
export function createNewsletterTemplate(data: NewsletterEmailData): string {
  const { subject, content, unsubscribeUrl } = data
  
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
        .newsletter-content {
            font-size: 16px;
            line-height: 1.8;
        }
        .newsletter-content h1, .newsletter-content h2, .newsletter-content h3 {
            color: #1a202c;
            margin-top: 30px;
            margin-bottom: 15px;
        }
        .newsletter-content p {
            margin-bottom: 15px;
        }
        .newsletter-content a {
            color: #667eea;
            text-decoration: none;
        }
        .newsletter-content a:hover {
            text-decoration: underline;
        }
        .footer {
            background: #f7fafc;
            padding: 30px 20px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
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
            <h1>📧 ${subject}</h1>
        </div>
        
        <div class="content">
            <div class="newsletter-content">
                ${content}
            </div>
        </div>
        
        <div class="footer">
            <p><strong>Thanks for reading!</strong></p>
            <p>© ${new Date().getFullYear()} Abdul Wahab. All rights reserved.</p>
            <p><a href="${unsubscribeUrl}">Unsubscribe</a> from future emails.</p>
        </div>
    </div>
</body>
</html>`
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

 