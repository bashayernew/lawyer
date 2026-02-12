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
    const {
      name,
      role,
      description,
      image,
      nameEn,
      nameAr,
      roleEn,
      roleAr,
      descriptionEn,
      descriptionAr
    } = body

    const displayName = (nameEn ?? nameAr ?? name ?? '').toString().trim()
    const displayDesc = (descriptionEn ?? descriptionAr ?? description ?? '').toString().trim()
    if (!displayName || !displayDesc || !image) {
      return NextResponse.json({ error: 'Provide at least name (EN or AR), description (EN or AR), and image' }, { status: 400 })
    }

    const members = await readTeamAsync()
    const now = new Date().toISOString()
    const newMember: TeamMemberRecord = {
      id: Date.now().toString(),
      name: (name ?? nameEn ?? nameAr ?? '').toString().trim(),
      role: (role ?? roleEn ?? roleAr ?? 'Team Member').toString().trim(),
      description: (description ?? descriptionEn ?? descriptionAr ?? '').toString().trim(),
      image: image.trim(),
      nameEn: nameEn !== undefined && nameEn !== '' ? String(nameEn).trim() : undefined,
      nameAr: nameAr !== undefined && nameAr !== '' ? String(nameAr).trim() : undefined,
      roleEn: roleEn !== undefined && roleEn !== '' ? String(roleEn).trim() : undefined,
      roleAr: roleAr !== undefined && roleAr !== '' ? String(roleAr).trim() : undefined,
      descriptionEn: descriptionEn !== undefined && descriptionEn !== '' ? String(descriptionEn).trim() : undefined,
      descriptionAr: descriptionAr !== undefined && descriptionAr !== '' ? String(descriptionAr).trim() : undefined,
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
