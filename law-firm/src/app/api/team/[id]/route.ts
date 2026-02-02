import { NextRequest, NextResponse } from 'next/server'
import { isAuthorized } from '@/lib/auth'
import { readTeamAsync, writeTeamAsync } from '@/lib/team'

function kvConfigured() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
}

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthorized(request)) {
    return unauthorized()
  }

  try {
    if (process.env.NODE_ENV === 'production' && !kvConfigured()) {
      return NextResponse.json({ error: 'KV not configured' }, { status: 500 })
    }
    const body = await request.json()
    const { name, role, description, image } = body
    const members = await readTeamAsync()
    const index = members.findIndex((member) => member.id === params.id)

    if (index === -1) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 })
    }

    const updated = {
      ...members[index],
      name: name !== undefined ? String(name).trim() : members[index].name,
      role: role !== undefined ? String(role).trim() : members[index].role,
      description: description !== undefined ? String(description).trim() : members[index].description,
      image: image !== undefined ? String(image).trim() : members[index].image,
      updatedAt: new Date().toISOString()
    }

    members[index] = updated
    await writeTeamAsync(members)

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error('Failed to update team member:', error)
    return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthorized(request)) {
    return unauthorized()
  }

  try {
    if (process.env.NODE_ENV === 'production' && !kvConfigured()) {
      return NextResponse.json({ error: 'KV not configured' }, { status: 500 })
    }
    const members = await readTeamAsync()
    const nextMembers = members.filter((member) => member.id !== params.id)

    if (nextMembers.length === members.length) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 })
    }

    await writeTeamAsync(nextMembers)
    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('Failed to delete team member:', error)
    return NextResponse.json({ error: 'Failed to delete team member' }, { status: 500 })
  }
}
