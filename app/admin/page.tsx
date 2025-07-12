import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'
import PostEditor from '@/components/PostEditor'
import { Shield } from 'lucide-react'

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <SignedIn>
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
                Admin Dashboard
              </h1>
              <p className="text-[var(--text-secondary)]">
                Create and manage your blog posts
              </p>
            </div>
            <PostEditor />
          </div>
        </div>
      </SignedIn>

      <SignedOut>
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
                <SignInButton>
                  <button className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[var(--accent-web)] hover:bg-[var(--accent-web-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-web)] focus:ring-offset-[var(--background)] transition-colors">
                    <Shield className="h-5 w-5 mr-2" />
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