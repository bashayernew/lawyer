import { NextRequest, NextResponse } from 'next/server'

import {
  ConsultationRecord,
  readConsultationsAsync,
  writeConsultationsAsync
} from '@/lib/consultations'
import { isAuthorized } from '@/lib/auth'

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

function kvConfigured() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
}

async function requireConsultations() {
  const consultations = await readConsultationsAsync()
  return consultations
}

function checkAuth(req: NextRequest) {
  return isAuthorized(req)
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!checkAuth(req)) return unauthorized()
  if (process.env.NODE_ENV === 'production' && !kvConfigured()) {
    return NextResponse.json({ error: 'KV not configured' }, { status: 500 })
  }

  const consultations = await requireConsultations()
  const consultation = consultations.find((record) => record.id === params.id)

  if (!consultation) {
    return NextResponse.json({ error: 'Consultation not found' }, { status: 404 })
  }

  return NextResponse.json(consultation)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!checkAuth(req)) return unauthorized()

  try {
    if (process.env.NODE_ENV === 'production' && !kvConfigured()) {
      return NextResponse.json({ error: 'KV not configured' }, { status: 500 })
    }
    const body = await req.json()
    const consultations = await requireConsultations()
    const index = consultations.findIndex((record) => record.id === params.id)

    if (index === -1) {
      return NextResponse.json({ error: 'Consultation not found' }, { status: 404 })
    }

    const current = consultations[index]
    const updated: ConsultationRecord = {
      ...current,
      status: (body.status as ConsultationRecord['status']) ?? current.status,
      adminNotes: body.adminNotes ?? current.adminNotes,
      updatedAt: new Date().toISOString()
    }

    consultations[index] = updated
    await writeConsultationsAsync(consultations)

    return NextResponse.json(consultations[index])
  } catch (error) {
    console.error('Failed to update consultation', error)
    return NextResponse.json({ error: 'Failed to update consultation' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!checkAuth(req)) return unauthorized()
  if (process.env.NODE_ENV === 'production' && !kvConfigured()) {
    return NextResponse.json({ error: 'KV not configured' }, { status: 500 })
  }

  const consultations = await requireConsultations()
  const filtered = consultations.filter((record) => record.id !== params.id)

  if (filtered.length === consultations.length) {
    return NextResponse.json({ error: 'Consultation not found' }, { status: 404 })
  }

  await writeConsultationsAsync(filtered)

  return NextResponse.json({ ok: true })
}

