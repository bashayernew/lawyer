import { NextRequest, NextResponse } from 'next/server'
import { UserRecord, readUsersAsync, writeUsersAsync } from '@/lib/users'
import { isAuthorized } from '@/lib/auth'

function kvConfigured() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    if (process.env.NODE_ENV === 'production' && !kvConfigured()) {
      return NextResponse.json({ error: 'KV not configured' }, { status: 500 })
    }
    const users = await readUsersAsync()
    const normalizedId = String(params.id)
    const user = users.find((u) => String(u.id) === normalizedId)

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
    if (process.env.NODE_ENV === 'production' && !kvConfigured()) {
      return NextResponse.json({ error: 'KV not configured' }, { status: 500 })
    }
    const body = await request.json()
    const { name, email, password, role, active } = body

    const users = await readUsersAsync()
    const normalizedId = String(params.id)
    const index = users.findIndex((u) => String(u.id) === normalizedId)

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

    await writeUsersAsync(users)

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
    if (process.env.NODE_ENV === 'production' && !kvConfigured()) {
      return NextResponse.json({ error: 'KV not configured' }, { status: 500 })
    }
    const users = await readUsersAsync()
    const normalizedId = String(params.id)
    const filtered = users.filter((u) => String(u.id) !== normalizedId)

    if (users.length === filtered.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    await writeUsersAsync(filtered)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Failed to delete user:', error)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}

