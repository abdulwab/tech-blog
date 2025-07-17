import { getCurrentUserRole, getCurrentUser } from '@/lib/auth'
import { Shield, Edit3, Eye, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function CheckRolePage() {
  const userRole = await getCurrentUserRole()
  const user = await getCurrentUser()

  // Check if user is signed in but not in database yet
  const isNewUser = !user && userRole === null

  const getRoleInfo = (role: string | null) => {
    switch (role) {
      case 'ADMIN':
        return {
          icon: Shield,
          color: 'text-red-600 bg-red-50 border-red-200',
          description: 'Full access to everything - user management, all admin features',
          access: ['👥 User Management', '📝 Post Management', '📧 Email Campaigns', '⚙️ Settings', '📊 Analytics']
        }
      case 'WRITER':
        return {
          icon: Edit3,
          color: 'text-blue-600 bg-blue-50 border-blue-200',
          description: 'Can create and manage posts, limited admin access',
          access: ['📝 Post Creation/Editing', '📂 Category Management', '📧 Post Notifications', '📊 Basic Analytics']
        }
      case 'VIEWER':
        return {
          icon: Eye,
          color: 'text-gray-600 bg-gray-50 border-gray-200',
          description: 'Read-only access, no admin features',
          access: ['👁️ View Blog Content', '📧 Subscribe to Newsletter']
        }
      default:
        return {
          icon: Eye,
          color: 'text-gray-600 bg-gray-50 border-gray-200',
          description: 'Not signed in or role not assigned',
          access: ['🔒 Sign in required']
        }
    }
  }

  const roleInfo = getRoleInfo(userRole)
  const IconComponent = roleInfo.icon

  return (
    <div className="min-h-screen bg-[var(--background)] py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <Link href="/" className="flex items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
        </div>

        {isNewUser && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-blue-800 mb-3">🎉 Welcome! Account Setup Required</h2>
            <p className="text-blue-700 mb-4">
              You've successfully signed in! Your account needs to be synced to our database and assigned a role.
            </p>
            <div className="space-y-2 text-sm text-blue-600">
              <p><strong>Next steps:</strong></p>
              <p>1. Your account will be automatically synced when you visit any protected page</p>
              <p>2. You'll start with VIEWER role (read-only access)</p>
              <p>3. Contact an admin to upgrade your role if needed</p>
            </div>
            <div className="mt-4">
              <Link 
                href="/admin" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Sync Account & Check Admin Access
              </Link>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className={`p-3 rounded-full ${roleInfo.color.split(' ')[1]} ${roleInfo.color.split(' ')[2]}`}>
                <IconComponent className={`h-12 w-12 ${roleInfo.color.split(' ')[0]}`} />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
              Your Role Status
            </h1>
            <p className="text-[var(--text-secondary)]">
              Check your current permissions and access level
            </p>
          </div>

          {user ? (
            <div className="space-y-6">
              <div className="border rounded-lg p-4">
                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  User Information
                </h2>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Name:</span> {user.firstName} {user.lastName}</p>
                  <p><span className="font-medium">Email:</span> {user.email}</p>
                  <p><span className="font-medium">Role:</span> 
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full border ${roleInfo.color}`}>
                      {userRole || 'Not Assigned'}
                    </span>
                  </p>
                  <p><span className="font-medium">Status:</span> 
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${user.isActive ? 'text-green-800 bg-green-100' : 'text-red-800 bg-red-100'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  Role Description
                </h2>
                <p className="text-[var(--text-secondary)] mb-4">{roleInfo.description}</p>
                
                <h3 className="font-medium text-[var(--text-primary)] mb-2">Access Permissions:</h3>
                <ul className="space-y-1">
                  {roleInfo.access.map((permission, index) => (
                    <li key={index} className="text-sm text-[var(--text-secondary)]">
                      {permission}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border rounded-lg p-4 bg-blue-50">
                <h2 className="text-lg font-semibold text-blue-900 mb-2">
                  Quick Actions
                </h2>
                <div className="flex flex-wrap gap-3">
                  {userRole === 'ADMIN' && (
                    <Link href="/admin" className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm">
                      🛡️ Admin Dashboard
                    </Link>
                  )}
                  {(userRole === 'ADMIN' || userRole === 'WRITER') && (
                    <Link href="/writer" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      ✍️ Writer Dashboard
                    </Link>
                  )}
                  <Link href="/blog" className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm">
                    📖 View Blog
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-[var(--text-secondary)] mb-4">
                You need to sign in to view your role information.
              </p>
              <Link href="/sign-in" className="bg-[var(--accent-web)] text-white px-6 py-2 rounded-lg hover:bg-[var(--accent-web-dark)] transition-colors">
                Sign In
              </Link>
            </div>
          )}

          {user && userRole === 'VIEWER' && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-medium text-yellow-800 mb-2">Request Role Upgrade</h3>
              <p className="text-yellow-700 text-sm">
                If you need WRITER or ADMIN access, contact an administrator to upgrade your role.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 