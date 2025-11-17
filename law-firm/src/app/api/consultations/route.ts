import { NextRequest, NextResponse } from 'next/server'

import {
  ConsultationRecord,
  readConsultations,
  writeConsultations
} from '@/lib/consultations'

import { isAuthorized } from '@/lib/auth'

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return unauthorized()
  }

  const consultations = await readConsultations()
  consultations.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return NextResponse.json(consultations)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, message, locale, preferredDate } = body

    if (!name || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const consultations = await readConsultations()
    const now = new Date().toISOString()
    const newConsultation: ConsultationRecord = {
      id: Date.now().toString(),
      name,
      email: email || null,
      phone: phone || null,
      message,
      locale: locale || 'en',
      preferredDate: preferredDate || null,
      status: 'pending',
      createdAt: now,
      updatedAt: now
    }

    consultations.push(newConsultation)
    await writeConsultations(consultations)

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('Consultation submission failed:', error)
    return NextResponse.json({ error: 'Failed to submit consultation' }, { status: 500 })
  }
}
