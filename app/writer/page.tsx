import { Shield, AlertTriangle, Edit3, ArrowLeft } from 'lucide-react'
import { getCurrentUserRole, getCurrentUser } from '@/lib/auth'
import Link from 'next/link'
import WriterDashboard from '@/components/WriterDashboard'

export default async function WriterPage() {
  const userRole = await getCurrentUserRole()
  const user = await getCurrentUser()

  // If user is not signed in, show sign-in prompt
  if (!userRole || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full">
                <Edit3 className="h-12 w-12 text-blue-600" />
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-[var(--text-primary)]">
              Writer Access Required
            </h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Please sign in to access the writer dashboard
            </p>
          </div>
          <div className="mt-8 space-y-6">
            <div className="text-center">
              <Link href="/sign-in" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-colors">
                <Edit3 className="h-5 w-5 mr-2" />
                Sign In to Write
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Check if user has writer or admin access
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
              Writer Access Required
            </h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              You need WRITER or ADMIN role to access this page.
            </p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Your current role: <span className="font-medium text-gray-600">{userRole}</span>
            </p>
            <p className="mt-4 text-sm text-[var(--text-secondary)]">
              Contact an administrator to upgrade your role to WRITER.
            </p>
          </div>
          <div className="mt-8 space-y-6">
            <div className="text-center space-y-3">
              <Link href="/check-role" className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-[var(--text-primary)] bg-white hover:bg-gray-50 transition-colors">
                Check My Role
              </Link>
              <Link href="/" className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-[var(--text-primary)] bg-white hover:bg-gray-50 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // User has writer or admin access
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <WriterDashboard user={user} />
    </div>
  )
} 