import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
)

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  // Public routes (no auth required)
  const publicRoutes = ['/', '/login', '/register']
  if (publicRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  // Protected routes - require authentication
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const { payload } = await jwtVerify(token, secret)
    
    // Check role-based access
    const path = request.nextUrl.pathname

    if (path.startsWith('/dashboard') && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (path.startsWith('/trainer') && payload.role !== 'TRAINER' && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    // Invalid token
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
