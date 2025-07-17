import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isAdminRoute = createRouteMatcher(['/admin(.*)'])
const isApiAdminRoute = createRouteMatcher(['/api/admin(.*)'])

export default clerkMiddleware(async (auth, req) => {
  // Handle admin routes
  if (isAdminRoute(req) || isApiAdminRoute(req)) {
    const { userId } = auth()
    
    if (!userId) {
      // Redirect to sign-in for unauthenticated users
      return NextResponse.redirect(new URL('/sign-in', req.url))
    }

    // For API routes, we'll check roles in the route handlers
    // For pages, we'll let the components handle role checks
  }

  // Auto-sync user on any authenticated request
  if (userId) {
    try {
      // Fire-and-forget sync call
      fetch(new URL('/api/users/sync', req.url), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userId}`,
          'Cookie': req.headers.get('Cookie') || ''
        }
      }).catch(() => {
        // Ignore sync errors to not block the request
      })
    } catch (error) {
      // Ignore sync errors
    }
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
  runtime: 'nodejs',
}
