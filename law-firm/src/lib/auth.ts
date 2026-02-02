import { NextRequest } from 'next/server'
import { createHmac, timingSafeEqual } from 'node:crypto'

/**
 * Check if a request is authorized for admin operations
 * Supports both ADMIN_SECRET and NEXT_PUBLIC_ADMIN_SECRET environment variables
 */
const SESSION_COOKIE = 'admin_session'
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000

type SessionPayload = {
  email: string
  exp: number
}

function getAuthSecret() {
  return process.env.ADMIN_SECRET || process.env.NEXT_PUBLIC_ADMIN_SECRET || ''
}

function base64UrlEncode(value: string) {
  return Buffer.from(value, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

function base64UrlDecode(value: string) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/')
  const padLength = (4 - (padded.length % 4)) % 4
  const withPadding = padded + '='.repeat(padLength)
  return Buffer.from(withPadding, 'base64').toString('utf8')
}

function signPayload(payload: string, secret: string) {
  return createHmac('sha256', secret).update(payload).digest('base64url')
}

export function createSessionToken(email: string) {
  const secret = getAuthSecret()
  if (!secret) {
    throw new Error('ADMIN_SECRET is not configured')
  }
  const payload: SessionPayload = {
    email,
    exp: Date.now() + SESSION_TTL_MS
  }
  const encoded = base64UrlEncode(JSON.stringify(payload))
  const signature = signPayload(encoded, secret)
  return `${encoded}.${signature}`
}

export function clearSessionCookie() {
  return {
    name: SESSION_COOKIE,
    value: '',
    path: '/',
    maxAge: 0
  }
}

export function isAuthorized(request: NextRequest): boolean {
  const secret = getAuthSecret()
  if (!secret) {
    return false
  }
  const token = request.cookies.get(SESSION_COOKIE)?.value
  if (!token) {
    return false
  }
  const [encoded, signature] = token.split('.')
  if (!encoded || !signature) {
    return false
  }
  const expected = signPayload(encoded, secret)
  const signatureOk =
    expected.length === signature.length &&
    timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  if (!signatureOk) {
    return false
  }
  try {
    const payload = JSON.parse(base64UrlDecode(encoded)) as SessionPayload
    if (!payload?.email || !payload?.exp) {
      return false
    }
    return payload.exp > Date.now()
  } catch {
    return false
  }
}

export function getSessionCookieName() {
  return SESSION_COOKIE
}

export function getSessionTtlMs() {
  return SESSION_TTL_MS
}

