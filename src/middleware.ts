import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

// Role hierarchy for authorization
const roleHierarchy: Record<string, number> = {
  CUSTOMER: 1,
  BANKER: 2,
  MARKETING_MANAGER: 3,
  FINANCE_MANAGER: 4,
  GENERAL_MANAGER: 5,
  CEO: 6,
  ADMIN: 7,
  SUPER_ADMIN: 8,
}

// Route protection configuration
const protectedRoutes = {
  // Customer routes
  customer: ['/api/loans', '/api/documents', '/api/applications'],
  // Banker routes (requires BANKER role or higher)
  banker: ['/api/banker', '/api/reviews'],
  // Admin routes (requires ADMIN role or higher)
  admin: ['/api/admin', '/api/users', '/api/banks', '/api/oauth-providers', '/api/settings'],
}

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token
    const userRole = token?.role as string | undefined

    // Allow public routes
    const publicPaths = ['/', '/about', '/api/auth', '/api/health', '/api/public', '/api/settings/oauth']
    if (publicPaths.some(path => pathname.startsWith(path))) {
      return NextResponse.next()
    }

    // Check role-based access for admin routes
    if (pathname.startsWith('/api/admin') || pathname.startsWith('/api/users') || pathname.startsWith('/api/oauth-providers')) {
      if (!userRole || roleHierarchy[userRole] < roleHierarchy['ADMIN']) {
        return NextResponse.json(
          { error: 'Forbidden', message: 'You do not have permission to access this resource' },
          { status: 403 }
        )
      }
    }

    // Check role-based access for banker routes
    if (pathname.startsWith('/api/banker') || pathname.startsWith('/api/reviews')) {
      if (!userRole || roleHierarchy[userRole] < roleHierarchy['BANKER']) {
        return NextResponse.json(
          { error: 'Forbidden', message: 'You do not have permission to access this resource' },
          { status: 403 }
        )
      }
    }

    // Add security headers to all responses
    const response = NextResponse.next()
    
    // Prevent clickjacking
    response.headers.set('X-Frame-Options', 'DENY')
    
    // Prevent MIME type sniffing
    response.headers.set('X-Content-Type-Options', 'nosniff')
    
    // XSS Protection
    response.headers.set('X-XSS-Protection', '1; mode=block')
    
    // Referrer Policy
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    
    // Permissions Policy
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
    
    // Content Security Policy (basic)
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' https:;"
    )

    return response
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Public routes don't need authentication
        const publicPaths = ['/', '/about', '/api/auth', '/api/health', '/api/public', '/api/settings/oauth']
        if (publicPaths.some(path => pathname.startsWith(path))) {
          return true
        }

        // Protected routes require authentication
        return !!token
      },
    },
    pages: {
      signIn: '/',
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
