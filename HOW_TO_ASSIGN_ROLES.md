# How to Assign Roles to Users

## 🚀 Quick Setup Guide

### 1. **Make Yourself Admin (First Time Setup)**

After signing up for the first time:

1. **Sign in to your blog** at `/sign-in`
2. **Open Prisma Studio**: Run `npx prisma studio` in terminal
3. **Go to Users table** in Prisma Studio
4. **Find your user** (look for your email)
5. **Change role from `VIEWER` to `ADMIN`**
6. **Save the changes**

### 2. **Check Your Current Role**

Visit `/check-role` to see:
- Your current role and permissions
- Quick access links to dashboards

### 3. **Assign Roles to Other Users**

As an **ADMIN**, you can manage user roles:

1. **Go to Admin Dashboard**: `/admin`
2. **Click "Users" tab**
3. **Find the user** you want to update
4. **Use the role dropdown** to change their role:
   - **VIEWER**: Read-only access (default for new users)
   - **WRITER**: Can create/edit posts
   - **ADMIN**: Full access to everything

### 4. **Access Dashboards**

Different roles have different access:

- **ADMIN**: `/admin` (full admin dashboard)
- **WRITER**: `/writer` (simple post creation dashboard)
- **VIEWER**: No dashboard access (blog viewing only)

## 🎯 Role Permissions

### **ADMIN** 🛡️
- ✅ User management
- ✅ All post operations
- ✅ Email campaigns
- ✅ Settings management
- ✅ Analytics

### **WRITER** ✍️
- ✅ Create/edit posts
- ✅ Category management
- ✅ Basic analytics
- ❌ User management
- ❌ Email campaigns

### **VIEWER** 👁️
- ✅ View blog content
- ✅ Subscribe to newsletter
- ❌ No admin access

## 🔄 Automatic User Sync

New users are automatically:
1. **Created in database** when they sign up via Clerk
2. **Assigned VIEWER role** by default
3. **Synced on every login** via middleware

## 🛠 Quick Commands

```bash
# Open database to manage roles
npx prisma studio

# Check if build works
npm run build

# Start development server
npm run dev
```

## 📝 Example Workflow

1. **New user signs up** → Gets VIEWER role automatically
2. **Admin promotes to WRITER** → User can access `/writer` page
3. **Writer creates posts** → Simple dashboard, no complex admin features
4. **Admin manages everything** → Full access via `/admin` page

This keeps it simple: Writers focus on writing, Admins handle everything else! 