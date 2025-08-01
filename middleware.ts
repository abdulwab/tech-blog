import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isAdminRoute = createRouteMatcher(['/admin(.*)'])
const isWriterRoute = createRouteMatcher(['/writer(.*)'])
const isApiAdminRoute = createRouteMatcher(['/api/admin(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = auth()
  
  // Handle admin routes
  if (isAdminRoute(req) || isApiAdminRoute(req)) {
    if (!userId) {
      // Redirect to sign-in for unauthenticated users
      return NextResponse.redirect(new URL('/sign-in', req.url))
    }

    // For API routes, we'll check roles in the route handlers
    // For pages, we'll let the components handle role checks
  }

  // Handle writer routes
  if (isWriterRoute(req)) {
    if (!userId) {
      // Redirect to sign-in for unauthenticated users
      return NextResponse.redirect(new URL('/sign-in', req.url))
    }
    
    // Role checking is handled in the page component
  }

  // Note: User sync is handled via:
  // 1. Manual sync at /api/users/sync 
  // 2. Webhook sync at /api/webhooks/clerk
  // 3. "Sync Account" button on /check-role page
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
