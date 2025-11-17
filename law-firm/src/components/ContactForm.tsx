"use client"
import { useState, useRef } from 'react'

type ContactPlaceholders = {
  name: string
  email: string
  phone: string
  message: string
  submit: string
  preferredDate?: string
  locale?: string
  success?: string
  error?: string
}

export default function ContactForm({ placeholders }: { placeholders: ContactPlaceholders }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    setStatus('loading')
    setError(null)

    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          message: formData.get('message'),
          preferredDate: formData.get('preferredDate'),
          locale: formData.get('locale') || 'en'
        })
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to send request')
      }

      setStatus('success')
      if (formRef.current) {
        formRef.current.reset()
      }
    } catch (err: any) {
      console.error('Contact form submission failed', err)
      setError(err?.message || 'Failed to send request')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border-4 border-green-500/50 bg-gradient-to-br from-green-50 to-emerald-50 p-8 md:p-10 text-center shadow-2xl">
        <div className="mb-4 flex justify-center">
          <div className="h-16 w-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
            <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-green-700 mb-3">Success!</h3>
        <p className="text-lg md:text-xl font-semibold text-neutral-800 leading-relaxed">
          {placeholders.success || 'Thank you! Our team will reach out shortly.'}
        </p>
        <div className="mt-6 pt-6 border-t border-green-200">
          <p className="text-sm text-neutral-600 font-medium">
            {placeholders.locale === 'ar' 
              ? 'سنقوم بالرد عليك في أقرب وقت ممكن' 
              : 'We will respond to you as soon as possible'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <form
      ref={formRef}
      className="border-2 border-neutral-200 rounded-2xl p-6 grid gap-4 bg-white shadow-lg"
      onSubmit={handleSubmit}
    >
      <input 
        className="border-2 border-neutral-300 rounded-lg px-4 py-3 text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" 
        name="name" 
        placeholder={placeholders.name} 
        required 
      />
      <input 
        className="border-2 border-neutral-300 rounded-lg px-4 py-3 text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" 
        name="email" 
        placeholder={placeholders.email} 
        type="email" 
      />
      <input 
        className="border-2 border-neutral-300 rounded-lg px-4 py-3 text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" 
        name="phone" 
        placeholder={placeholders.phone} 
      />
      <textarea 
        className="border-2 border-neutral-300 rounded-lg px-4 py-3 text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px]" 
        name="message" 
        placeholder={placeholders.message} 
        required 
      />
      <input
        className="border-2 border-neutral-300 rounded-lg px-4 py-3 text-neutral-900 placeholder:text-neutral-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        name="preferredDate"
        placeholder={placeholders.preferredDate || 'Preferred date'}
        type="date"
      />
      <input type="hidden" name="locale" value={placeholders.locale ?? 'en'} />
      <button className="btn btn-primary w-fit disabled:opacity-60 font-semibold text-base px-6 py-3" type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending…' : placeholders.submit}
      </button>
      {error && (
        <p className="text-sm font-medium text-red-700 bg-red-50 p-3 rounded-lg border border-red-200" role="alert">
          {placeholders.error || error}
        </p>
      )}
    </form>
  )
}
