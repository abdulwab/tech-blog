import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'
import PostEditor from '@/components/PostEditor'
import { Shield } from 'lucide-react'

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SignedIn>
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Create and manage your blog posts
              </p>
            </div>
            <PostEditor />
          </div>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <Shield className="mx-auto h-12 w-12 text-blue-600" />
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Admin Access Required
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Please sign in to access the admin dashboard
              </p>
            </div>
            <div className="mt-8 space-y-6">
              <div className="text-center">
                <SignInButton>
                  <button className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Sign In to Admin
                  </button>
                </SignInButton>
              </div>
            </div>
          </div>
        </div>
      </SignedOut>
    </div>
  )
} 