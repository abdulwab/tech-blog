import { Shield, AlertTriangle, UserPlus } from 'lucide-react'
import { getCurrentUserRole, getCurrentUser, syncUserToDatabase } from '@/lib/auth'
import AdminDashboard from '@/components/AdminDashboard'
import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import SyncUserButton from '@/components/SyncUserButton'

export default async function AdminPage() {
  const { userId } = auth()
  const userRole = await getCurrentUserRole()
  const user = await getCurrentUser()

  // If user is not signed in, show sign-in prompt
  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-[var(--accent-web)]/10 p-3 rounded-full">
                <Shield className="h-12 w-12 text-[var(--accent-web)]" />
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-[var(--text-primary)]">
              Admin Access Required
            </h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Please sign in to access the admin dashboard
            </p>
          </div>
          <div className="mt-8 space-y-6">
            <div className="text-center">
              <Link href="/sign-in?redirect_url=/admin" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[var(--accent-web)] hover:bg-[var(--accent-web-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-web)] focus:ring-offset-[var(--background)] transition-colors">
                <Shield className="h-5 w-5 mr-2" />
                Sign In to Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If user is signed in but not in database, show sync prompt
  if (userId && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full">
                <UserPlus className="h-12 w-12 text-blue-600" />
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-[var(--text-primary)]">
              Account Setup Required
            </h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Your account needs to be synced to our database before accessing admin features.
            </p>
          </div>
          <div className="mt-8 space-y-6">
            <div className="text-center">
              <SyncUserButton className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-colors">
                <UserPlus className="h-5 w-5 mr-2" />
                Sync My Account
              </SyncUserButton>
            </div>
            <div className="text-center">
              <Link href="/check-role" className="text-sm text-blue-600 hover:text-blue-700">
                Check my role status
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Check if user has admin or writer access
  if (userRole === 'VIEWER') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="h-12 w-12 text-red-600" />
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-[var(--text-primary)]">
              Access Denied
            </h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              You don't have permission to access the admin dashboard.
            </p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Your current role: <span className="font-medium text-gray-600">{userRole}</span>
            </p>
            <p className="mt-4 text-sm text-[var(--text-secondary)]">
              Contact an administrator to request access.
            </p>
          </div>
          <div className="mt-8 space-y-6">
            <div className="text-center">
              <Link href="/check-role" className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-[var(--text-primary)] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-web)] focus:ring-offset-[var(--background)] transition-colors">
                Check My Role
              </Link>
            </div>
            <div className="text-center">
              <a
                href="/"
                className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-[var(--text-primary)] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-web)] focus:ring-offset-[var(--background)] transition-colors"
              >
                Back to Blog
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // User has admin or writer access
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <AdminDashboard />
    </div>
  )
}
