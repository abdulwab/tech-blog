import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailData {
  to: string[]
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailData) {
  try {
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to,
      subject,
      html,
    })
    return { success: true, data }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { success: false, error }
  }
}

export function createNewPostEmailTemplate(post: {
  title: string
  description: string
  slug: string
  coverImage: string
  author: string
}) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  const postUrl = `${baseUrl}/blog/${post.slug}`

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>New Post: ${post.title}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">New Blog Post Published!</h1>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9; border-radius: 0 0 10px 10px;">
          <img src="${post.coverImage}" alt="${post.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 20px;">
          
          <h2 style="color: #333; margin-bottom: 15px;">${post.title}</h2>
          
          <p style="color: #666; margin-bottom: 20px; font-size: 16px;">
            ${post.description}
          </p>
          
          <p style="color: #888; margin-bottom: 25px; font-size: 14px;">
            By ${post.author}
          </p>
          
          <div style="text-align: center;">
            <a href="${postUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              Read Full Article
            </a>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding: 20px; color: #888; font-size: 12px;">
          <p>You're receiving this because you subscribed to our blog updates.</p>
          <p>
            <a href="${baseUrl}/unsubscribe" style="color: #888;">Unsubscribe</a> | 
            <a href="${baseUrl}" style="color: #888;">Visit Website</a>
          </p>
        </div>
      </body>
    </html>
  `
} 