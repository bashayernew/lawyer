"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CalendarClock, CheckCircle2, ClipboardList, Loader2, RefreshCcw, Trash2 } from 'lucide-react'

type Consultation = {
  id: string
  name: string
  email: string | null
  phone: string | null
  message: string
  locale: string
  preferredDate?: string | null
  status: 'pending' | 'confirmed' | 'completed'
  adminNotes?: string
  createdAt: string
  updatedAt: string
}

const statusOptions: { value: Consultation['status']; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' }
]

function formatDate(value?: string | null) {
  if (!value) return '—'
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(value))
  } catch {
    return value
  }
}

export default function AdminConsultationsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const router = useRouter()

  // Use relative URLs - works in both local and production
  const baseUrl = ''

  useEffect(() => {
    const storedAuth = localStorage.getItem('admin_authenticated')
    const authed = storedAuth === 'true'
    setIsAuthenticated(authed)
    if (!authed) {
      router.replace('/admin')
      return
    }
    void fetchConsultations()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchConsultations = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`${baseUrl || ''}/api/consultations`, {
        cache: 'no-store'
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to load consultations')
      }

      const data = (await res.json()) as Consultation[]
      setConsultations(data)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to load consultations')
    } finally {
      setLoading(false)
    }
  }

  const updateConsultation = async (id: string, payload: Partial<Consultation>) => {
    try {
      const res = await fetch(`${baseUrl || ''}/api/consultations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to update consultation')
      }

      const updated = (await res.json()) as Consultation
      setConsultations((prev) => prev.map((item) => (item.id === id ? updated : item)))
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to update consultation')
    }
  }

  const deleteConsultation = async (id: string) => {
    if (!window.confirm('Delete this consultation request?')) return
    try {
      const res = await fetch(`${baseUrl || ''}/api/consultations/${id}`, {
        method: 'DELETE'
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to delete consultation')
      }
      setConsultations((prev) => prev.filter((item) => item.id !== id))
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to delete consultation')
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
              <ClipboardList className="h-7 w-7 text-forest" />
              Consultations
            </h1>
            <p className="text-neutral-500 text-sm mt-1">
              Track inbound consultation requests and update their status.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="btn btn-light">
              Back to dashboard
            </Link>
            <button
              type="button"
              onClick={fetchConsultations}
              className="btn btn-primary flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading
                </>
              ) : (
                <>
                  <RefreshCcw className="h-4 w-4" /> Refresh
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : consultations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-10 text-center text-neutral-500">
            <CalendarClock className="mx-auto mb-3 h-10 w-10 text-primary/60" />
            No consultation requests yet.
          </div>
        ) : (
          <div className="space-y-4">
            {consultations.map((consultation) => (
              <div
                key={consultation.id}
                className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-primary">{consultation.name}</h2>
                    <div className="mt-2 space-y-1 text-sm text-neutral-600">
                      {consultation.email && <div>Email: {consultation.email}</div>}
                      {consultation.phone && <div>Phone: {consultation.phone}</div>}
                      <div>Locale: {consultation.locale.toUpperCase()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      className="rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm text-neutral-700"
                      value={consultation.status}
                      onChange={(event) =>
                        updateConsultation(consultation.id, { status: event.target.value as Consultation['status'] })
                      }
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => deleteConsultation(consultation.id)}
                      className="btn bg-red-500 text-white hover:bg-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-neutral-50 p-4 text-sm text-neutral-700">
                  <p className="whitespace-pre-line leading-relaxed">{consultation.message}</p>
                </div>

                <div className="mt-4 grid gap-3 text-sm text-neutral-500 md:grid-cols-3">
                  <div className="flex items-center gap-2">
                    <ClockBadge status={consultation.status} />
                    Requested: {formatDate(consultation.createdAt)}
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-forest" />
                    Last update: {formatDate(consultation.updatedAt)}
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-primary" />
                    Preferred date: {consultation.preferredDate ? formatDate(consultation.preferredDate) : '—'}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ClockBadge({ status }: { status: Consultation['status'] }) {
  if (status === 'completed') {
    return <CheckCircle2 className="h-4 w-4 text-forest" />
  }
  if (status === 'confirmed') {
    return <CheckCircle2 className="h-4 w-4 text-amber-500" />
  }
  return <Loader2 className="h-4 w-4 animate-spin text-primary" />
}

