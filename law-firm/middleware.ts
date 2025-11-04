import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // If accessing root, redirect to /ar
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/ar', request.url))
  }
  
  // Allow /ar and /en routes to pass through
  if (pathname.startsWith('/ar') || pathname.startsWith('/en')) {
    return NextResponse.next()
  }
  
  // Redirect any other root-level routes to /ar
  if (!pathname.startsWith('/_next') && !pathname.startsWith('/api') && !pathname.startsWith('/favicon')) {
    return NextResponse.redirect(new URL(`/ar${pathname}`, request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/((?!_next|api|favicon).*)'],
}


