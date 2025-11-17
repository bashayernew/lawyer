import { NextRequest } from 'next/server'

/**
 * Check if a request is authorized for admin operations
 * Supports both ADMIN_SECRET and NEXT_PUBLIC_ADMIN_SECRET environment variables
 */
export function isAuthorized(request: NextRequest): boolean {
  const adminSecret = request.headers.get('x-admin-secret')
  // Support both ADMIN_SECRET and NEXT_PUBLIC_ADMIN_SECRET for compatibility
  const expectedSecret = process.env.ADMIN_SECRET || process.env.NEXT_PUBLIC_ADMIN_SECRET
  return !!(adminSecret && expectedSecret && adminSecret === expectedSecret)
}

