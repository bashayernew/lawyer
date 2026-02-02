import { NextRequest, NextResponse } from 'next/server'
import { createSessionToken, getSessionCookieName, getSessionTtlMs } from '@/lib/auth'
import { readUsersAsync } from '@/lib/users'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email/username and password are required' }, { status: 400 })
    }

    const users = await readUsersAsync()
    const emailOrUsername = email.toLowerCase().trim()
    
    // Check if user exists by email or name (username) and credentials match
    const user = users.find(
      (u) => 
        (u.email.toLowerCase() === emailOrUsername || u.name.toLowerCase() === emailOrUsername) &&
        u.password === password &&
        u.active
    )

    if (!user) {
      return NextResponse.json({ error: 'Invalid email/username or password' }, { status: 401 })
    }

    const token = createSessionToken(user.email)
    const response = NextResponse.json({
      success: true,
      user: (({ password: _password, ...rest }) => rest)(user)
    })
    response.cookies.set({
      name: getSessionCookieName(),
      value: token,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: Math.floor(getSessionTtlMs() / 1000)
    })
    return response
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 })
  }
}

