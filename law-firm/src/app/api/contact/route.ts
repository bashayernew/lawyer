import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const name = String(form.get('name') || '')
  const phone = String(form.get('phone') || '')
  const email = String(form.get('email') || '')
  const message = String(form.get('message') || '')

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  })

  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM || 'noreply@example.com',
      to: process.env.MAIL_TO || 'owner@example.com',
      subject: `New inquiry from ${name}`,
      text: `Phone: ${phone}\nEmail: ${email}\n\n${message}`,
    })
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 })
  }

  return NextResponse.redirect(new URL('/contact?sent=1', req.url))
}


