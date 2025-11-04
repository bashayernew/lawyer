"use client"
import { useState } from 'react'

export default function ContactForm({ placeholders }: { placeholders: { name: string; email: string; phone: string; message: string; submit: string } }) {
  const [sent, setSent] = useState(false)
  return sent ? (
    <div className="rounded-2xl border p-6 bg-white">Thanks! We will be in touch.</div>
  ) : (
    <form action="#" method="post" className="border rounded-2xl p-6 grid gap-3" onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
      <input className="border rounded-md px-3 py-2" name="name" placeholder={placeholders.name} required />
      <input className="border rounded-md px-3 py-2" name="email" placeholder={placeholders.email} type="email" />
      <input className="border rounded-md px-3 py-2" name="phone" placeholder={placeholders.phone} />
      <textarea className="border rounded-md px-3 py-2" name="message" placeholder={placeholders.message} required />
      <button className="btn btn-primary w-fit" type="submit">{placeholders.submit}</button>
    </form>
  )
}


