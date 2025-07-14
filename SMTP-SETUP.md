# 📧 SMTP Email System Setup Guide

## Overview

Your Abdul Wahab blog now uses **Nodemailer with SMTP** for sending email notifications instead of third-party services like Resend. This gives you full control over email delivery and better reliability.

## ✅ Features Implemented

- **Automatic Post Notifications**: Sends beautiful emails to subscribers when new posts are published
- **Custom Newsletter System**: Send styled newsletters through the admin dashboard
- **Real-time Activity Logging**: All email activities are logged in the admin dashboard
- **SMTP Connection Testing**: Built-in test button in admin settings
- **Beautiful Email Templates**: Mobile-responsive HTML templates with your branding
- **Unsubscribe Support**: One-click unsubscribe functionality
- **Batch Processing**: Efficient email sending to avoid rate limits

## 🔧 Environment Variables Setup

Add these variables to your `.env.local` file:

```bash
# SMTP Email Configuration (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Email Settings
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=TechBlog
```

## 📧 SMTP Provider Configurations

### 🔵 Gmail (Recommended for Development)

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-app-password
```

**Setup Steps:**
1. Enable 2-Factor Authentication on your Gmail account
2. Go to [Google Account Settings](https://myaccount.google.com/security)
3. Generate an "App Password" for your application
4. Use the 16-character app password (not your Gmail password)

### 🔵 Outlook/Hotmail

```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

### 🟡 Yahoo Mail

```bash
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
```

**Note:** Yahoo also requires app passwords for security.

### 🟠 Custom SMTP Server

```bash
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=username
SMTP_PASS=password
```

### 🟢 Popular Email Services

| Provider | SMTP Host | Port | Secure |
|----------|-----------|------|---------|
| Gmail | smtp.gmail.com | 587 | false |
| Outlook | smtp-mail.outlook.com | 587 | false |
| Yahoo | smtp.mail.yahoo.com | 587 | false |
| SendGrid | smtp.sendgrid.net | 587 | false |
| Mailgun | smtp.mailgun.org | 587 | false |
| Amazon SES | email-smtp.region.amazonaws.com | 587 | false |

## 🔐 Security Best Practices

### 1. Use App Passwords
- Never use your main email password
- Generate app-specific passwords for better security
- Enable 2-factor authentication on your email accounts

### 2. Environment Variables
- Never commit real credentials to version control
- Use different SMTP settings for development/production
- Rotate passwords regularly

### 3. Production Considerations
- Use dedicated email service (SendGrid, Mailgun, etc.) for production
- Monitor email delivery rates and bounces
- Implement proper error handling and retry logic

## 🧪 Testing Your Setup

### 1. Admin Dashboard Test
1. Go to `/admin` → Settings tab
2. Scroll to "Email Server Test" section
3. Click "Test SMTP Connection"
4. Check for success/error messages

### 2. Manual Testing
```bash
# In your project directory
node -e "
const { testSMTPConnection } = require('./lib/email');
testSMTPConnection().then(result => console.log(result));
"
```

### 3. Test Email Sending
1. Create a test post in admin dashboard
2. Publish it with email notifications enabled
3. Check subscriber emails for delivery

## 📱 Email Templates

The system includes beautiful, responsive email templates:

### New Post Notification Template
- **Mobile responsive design**
- **Post cover image display**
- **Category badges**
- **Author information**
- **One-click "Read Article" button**
- **Automatic unsubscribe links**

### Newsletter Template
- **Custom HTML content support**
- **Professional styling**
- **Branded header and footer**
- **Unsubscribe compliance**

## 🔄 How Email Notifications Work

### Automatic Post Notifications
1. Admin publishes a post in dashboard
2. System fetches all active subscribers
3. Generates beautiful HTML email template
4. Sends emails individually (not in bulk) for privacy
5. Logs success/failure in activity dashboard
6. Updates notification status in real-time

### Manual Newsletter Sending
1. Admin creates newsletter in Notifications section
2. Chooses recipient type (all, active, specific emails)
3. Composes content with HTML support
4. Sends immediately or schedules for later
5. Tracks delivery statistics and logs activity

## 🐛 Troubleshooting

### Common Issues

**"SMTP connection failed"**
- Check SMTP host and port settings
- Verify username/password credentials
- Ensure app passwords are used (not account passwords)
- Check firewall/network restrictions

**"Authentication failed"**
- Verify SMTP_USER and SMTP_PASS are correct
- Use app passwords instead of account passwords
- Enable "Less secure app access" if using older systems

**"Connection timeout"**
- Try different SMTP ports (587, 465, 2525)
- Check if your hosting provider blocks SMTP ports
- Consider using SMTP relay services

**"Email not delivered"**
- Check spam/junk folders
- Verify sender email domain reputation
- Ensure proper SPF/DKIM records if using custom domain

### Debug Mode
Add this to your `.env.local` for detailed logging:
```bash
NODE_ENV=development
```

Check the server console for detailed SMTP connection logs.

## 🚀 Production Deployment

### Environment Variables for Production
Set these in your deployment platform (Vercel, Netlify, etc.):

```bash
SMTP_HOST=your-production-smtp-host
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-production-email
SMTP_PASS=your-production-password
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=Your Blog Name
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Recommended Production Services
- **SendGrid**: Reliable with generous free tier
- **Mailgun**: Developer-friendly with good APIs
- **Amazon SES**: Cost-effective for high volume
- **Postmark**: Excellent deliverability rates

## 📊 Monitoring & Analytics

### Built-in Activity Logging
- All email sending activities are logged
- Success/failure counts tracked
- Real-time dashboard updates
- Historical activity timeline

### Admin Dashboard Features
- SMTP connection testing
- Email delivery statistics
- Subscriber management
- Newsletter scheduling and tracking

## 🔧 Advanced Configuration

### Custom Email Templates
Edit templates in `lib/email.ts`:
- `createNewPostEmailTemplate()`: Post notification emails
- `createNewsletterTemplate()`: Newsletter emails

### Batch Size Configuration
Adjust email sending rate in `lib/email.ts`:
```javascript
// Send emails individually to avoid rate limits
// Automatically handles delays between sends
```

### Retry Logic
The system includes built-in retry logic for failed emails:
- Individual email tracking
- Automatic error logging
- Graceful failure handling

## 🆘 Support

If you encounter issues:
1. Check the admin dashboard activity logs
2. Test SMTP connection using the built-in test button
3. Verify environment variables are set correctly
4. Check server logs for detailed error messages
5. Consult your SMTP provider's documentation

---

**Your email notification system is now fully configured and ready for production use!** 📧✨ 