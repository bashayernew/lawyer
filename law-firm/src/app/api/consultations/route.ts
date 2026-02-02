import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

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

async function sendEmailNotification(consultation: ConsultationRecord) {
  // Only send email if SMTP is configured
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('SMTP not configured, skipping email notification')
    return
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: { 
        user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASS 
      }
    })

    const mailTo = process.env.MAIL_TO || process.env.SMTP_USER
    const mailFrom = process.env.MAIL_FROM || process.env.SMTP_USER

    await transporter.sendMail({
      from: mailFrom,
      to: mailTo,
      subject: `New Consultation Request from ${consultation.name}`,
      text: `
New consultation request received:

Name: ${consultation.name}
${consultation.email ? `Email: ${consultation.email}` : ''}
${consultation.phone ? `Phone: ${consultation.phone}` : ''}
${consultation.preferredDate ? `Preferred Date: ${consultation.preferredDate}` : ''}

Message:
${consultation.message}

---
Submitted: ${new Date(consultation.createdAt).toLocaleString()}
      `.trim(),
      html: `
        <h2>New Consultation Request</h2>
        <p><strong>Name:</strong> ${consultation.name}</p>
        ${consultation.email ? `<p><strong>Email:</strong> <a href="mailto:${consultation.email}">${consultation.email}</a></p>` : ''}
        ${consultation.phone ? `<p><strong>Phone:</strong> <a href="tel:${consultation.phone}">${consultation.phone}</a></p>` : ''}
        ${consultation.preferredDate ? `<p><strong>Preferred Date:</strong> ${consultation.preferredDate}</p>` : ''}
        <h3>Message:</h3>
        <p>${consultation.message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>Submitted: ${new Date(consultation.createdAt).toLocaleString()}</small></p>
      `
    })
  } catch (error) {
    console.error('Failed to send email notification:', error)
    // Don't fail the request if email fails
  }
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return unauthorized()
  }

  if (process.env.NODE_ENV === 'production' && !kvConfigured()) {
    return NextResponse.json({ error: 'KV not configured' }, { status: 500 })
  }

  const consultations = await readConsultationsAsync()
  consultations.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return NextResponse.json(consultations)
}

export async function POST(req: NextRequest) {
  try {
    if (process.env.NODE_ENV === 'production' && !kvConfigured()) {
      return NextResponse.json({ error: 'KV not configured' }, { status: 500 })
    }

    const body = await req.json()
    const { name, email, phone, message, locale, preferredDate } = body

    if (!name || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const consultations = await readConsultationsAsync()
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
    await writeConsultationsAsync(consultations)

    // Send email notification (non-blocking)
    sendEmailNotification(newConsultation).catch(err => 
      console.error('Email notification error:', err)
    )

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('Consultation submission failed:', error)
    return NextResponse.json({ error: 'Failed to submit consultation' }, { status: 500 })
  }
}
