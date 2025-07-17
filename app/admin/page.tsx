import { Shield, AlertTriangle } from 'lucide-react'
import { getCurrentUserRole } from '@/lib/auth'
import AdminDashboard from '@/components/AdminDashboard'
import Link from 'next/link'

export default async function AdminPage() {
  const userRole = await getCurrentUserRole()

  // If user is not signed in, show sign-in prompt
  if (!userRole) {
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
