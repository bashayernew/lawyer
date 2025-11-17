import { NextRequest, NextResponse } from 'next/server'
import { readUsers } from '@/lib/users'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email/username and password are required' }, { status: 400 })
    }

    const users = readUsers()
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

    // Return user info without password
    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json({ 
      success: true, 
      user: userWithoutPassword 
    })
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 })
  }
}

