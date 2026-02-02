import { NextRequest, NextResponse } from 'next/server'
import { isAuthorized } from '@/lib/auth'
import { readTeamAsync, writeTeamAsync, TeamMemberRecord } from '@/lib/team'

function kvConfigured() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
}

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return unauthorized()
  }

  try {
    if (process.env.NODE_ENV === 'production' && !kvConfigured()) {
      return NextResponse.json({ error: 'KV not configured' }, { status: 500 })
    }
    const members = await readTeamAsync()
    return NextResponse.json(members)
  } catch (error: any) {
    console.error('Failed to fetch team members:', error)
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return unauthorized()
  }

  try {
    if (process.env.NODE_ENV === 'production' && !kvConfigured()) {
      return NextResponse.json({ error: 'KV not configured' }, { status: 500 })
    }
    const body = await request.json()
    const { name, role, description, image } = body

    if (!name || !description || !image) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const members = await readTeamAsync()
    const now = new Date().toISOString()
    const newMember: TeamMemberRecord = {
      id: Date.now().toString(),
      name: name.trim(),
      role: role?.trim() || 'Team Member',
      description: description.trim(),
      image: image.trim(),
      createdAt: now,
      updatedAt: now
    }

    members.push(newMember)
    await writeTeamAsync(members)

    return NextResponse.json(newMember, { status: 201 })
  } catch (error: any) {
    console.error('Failed to create team member:', error)
    return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 })
  }
}
