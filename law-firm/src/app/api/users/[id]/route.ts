import { NextRequest, NextResponse } from 'next/server'
import { UserRecord, readUsers, writeUsers } from '@/lib/users'
import { isAuthorized } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const users = readUsers()
    const user = users.find((u) => u.id === params.id)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Don't send password
    const { password, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword)
  } catch (error: any) {
    console.error('Failed to fetch user:', error)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, email, password, role, active } = body

    const users = readUsers()
    const index = users.findIndex((u) => u.id === params.id)

    if (index === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if email is being changed and if it conflicts with another user
    if (email && email !== users[index].email) {
      if (users.some((u) => u.email === email && u.id !== params.id)) {
        return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
      }
    }

    // Update user
    users[index] = {
      ...users[index],
      ...(name && { name }),
      ...(email && { email }),
      ...(password && { password }), // In production, hash this password
      ...(role && { role }),
      ...(active !== undefined && { active }),
      updatedAt: new Date().toISOString()
    }

    writeUsers(users)

    // Return user without password
    const { password: _, ...userWithoutPassword } = users[index]
    return NextResponse.json(userWithoutPassword)
  } catch (error: any) {
    console.error('Failed to update user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const users = readUsers()
    const filtered = users.filter((u) => u.id !== params.id)

    if (users.length === filtered.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    writeUsers(filtered)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Failed to delete user:', error)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}

