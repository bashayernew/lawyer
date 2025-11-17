import { NextRequest, NextResponse } from 'next/server'
import { UserRecord, readUsers, writeUsers } from '@/lib/users'
import { isAuthorized } from '@/lib/auth'

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const users = readUsers()
    // Don't send passwords in the response
    const usersWithoutPasswords = users.map(({ password, ...user }) => user)
    return NextResponse.json(usersWithoutPasswords)
  } catch (error: any) {
    console.error('Failed to fetch users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, email, password, role, active } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const users = readUsers()
    
    // Check if email already exists
    if (users.some((u) => u.email === email)) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }

    const now = new Date().toISOString()
    const newUser: UserRecord = {
      id: Date.now().toString(),
      name,
      email,
      password, // In production, hash this password
      role: role || 'admin',
      active: active !== undefined ? active : true,
      createdAt: now,
      updatedAt: now
    }

    users.push(newUser)
    writeUsers(users)

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser
    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (error: any) {
    console.error('Failed to create user:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}

