# Role-Based Access Control Setup Guide

This guide explains how to set up and configure role-based access control for your blog.

## Overview

The system includes three user roles:
- **ADMIN**: Full access to everything (user management, all admin features)
- **WRITER**: Can create/edit posts, limited admin access (no user management)
- **VIEWER**: Can only view content, no admin access

## Environment Variables

Add to your `.env` file:

```env
# Clerk Webhook Secret (get from Clerk Dashboard -> Webhooks)
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## Clerk Webhook Setup

1. Go to Clerk Dashboard -> Webhooks
2. Create a new webhook endpoint: `https://yourdomain.com/api/webhooks/clerk`
3. Select these events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
4. Copy the webhook secret and add it to your `.env` file

## Database Migration

Run these commands to update your database:

```bash
npx prisma generate
npx prisma db push
```

## Default Admin Setup

To make yourself an admin:

1. Sign up/sign in to your blog
2. Go to your database (Prisma Studio: `npx prisma studio`)
3. Find your user in the `users` table
4. Change the `role` field from `VIEWER` to `ADMIN`

## API Endpoints

### User Sync
- `POST /api/users/sync` - Manually sync current user to database

### User Management (Admin only)
- `GET /api/admin/users` - List users with analytics
- `PUT /api/admin/users` - Update user role/status

### Webhook
- `POST /api/webhooks/clerk` - Automatic user sync via Clerk webhooks

## Admin Dashboard

The admin dashboard now includes a "Users" tab with:
- User analytics (total, active, recent signups, admin count)
- User search and filtering
- Role management
- User status management
- Post count per user

## Access Control

### Routes
- `/admin/*` - Requires ADMIN or WRITER role
- `/api/admin/*` - Requires ADMIN role (except some endpoints allow WRITER)

### Components
- User management is only available to ADMINs
- Post management is available to ADMINs and WRITERs
- All other admin features are role-restricted

## Testing

1. Sign up as a new user (will be VIEWER by default)
2. Try accessing `/admin` (should be denied)
3. Upgrade to WRITER or ADMIN role in database
4. Access should now work based on role

## Role Hierarchy

```
ADMIN    -> Can do everything
WRITER   -> Can manage posts, limited admin access
VIEWER   -> Read-only access, no admin features
```

## Automatic Features

- New users are automatically synced to database via middleware
- Webhook handles user creation/updates/deletions from Clerk
- Role checks are enforced on all admin API routes
- User analytics are tracked automatically

## Security Notes

- All admin routes require authentication
- Role checks are performed server-side
- Webhook signatures are verified
- User data is automatically synced on sign-in
- Deleted users are deactivated (not deleted) to preserve data integrity
