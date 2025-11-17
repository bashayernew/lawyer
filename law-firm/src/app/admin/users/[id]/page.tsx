"use client"

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Save, Trash2, User } from 'lucide-react'

type UserRole = 'admin' | 'editor' | 'viewer'

type User = {
  id: string
  name: string
  email: string
  role: UserRole
  active: boolean
  createdAt: string
  updatedAt: string
}

const STORAGE_KEY = 'admin_authenticated'

export default function EditUserPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const userId = params?.id

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('viewer')
  const [active, setActive] = useState(true)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const adminSecret = useMemo(
    () => process.env.NEXT_PUBLIC_ADMIN_SECRET || '',
    []
  )

  // Use relative URLs - works in both local and production
  const baseUrl = ''

  useEffect(() => {
    const authenticated = localStorage.getItem(STORAGE_KEY) === 'true'
    if (!authenticated) {
      router.replace('/admin')
      return
    }
    if (userId) {
      void loadUser(userId)
    }
  }, [userId, router])

  const loadUser = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const url = baseUrl ? `${baseUrl}/api/users/${id}` : `/api/users/${id}`
      const res = await fetch(url, {
        headers: {
          'x-admin-secret': adminSecret
        },
        cache: 'no-store'
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to fetch user')
      }
      const user = (await res.json()) as User
      setName(user.name)
      setEmail(user.email)
      setRole(user.role)
      setActive(user.active)
      setPassword('') // Don't pre-fill password
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to load user')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!userId) return
    setSaving(true)
    setError(null)

    const updateData: any = {
      name,
      email,
      role,
      active
    }

    // Only include password if it's been changed
    if (password.trim() !== '') {
      updateData.password = password
    }

    try {
      const url = baseUrl ? `${baseUrl}/api/users/${userId}` : `/api/users/${userId}`
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': adminSecret
        },
        body: JSON.stringify(updateData)
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to update user')
      }

      router.push('/admin/users')
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to update user')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!userId) return
    if (!window.confirm('Delete this user? This action cannot be undone.')) return
    setSaving(true)
    setError(null)
    try {
      const url = baseUrl ? `${baseUrl}/api/users/${userId}` : `/api/users/${userId}`
      const res = await fetch(url, {
        method: 'DELETE',
        headers: { 'x-admin-secret': adminSecret }
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to delete user')
      }
      router.push('/admin/users')
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to delete user')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="border-b border-neutral-200 bg-white/90 backdrop-blur">
        <div className="container flex items-center justify-between gap-3 py-5">
          <div className="flex items-center gap-3">
            <Link href="/admin/users" className="rounded-full border border-neutral-200 p-2 hover:bg-neutral-100">
              <ArrowLeft className="h-5 w-5 text-primary" />
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-primary flex items-center gap-2">
                <User className="h-6 w-6" />
                Edit User
              </h1>
              <p className="text-sm text-neutral-500">Update user information and permissions.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDelete}
            className="btn bg-red-500 text-white hover:bg-red-600"
            disabled={saving}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
      {error && (
        <div className="container mt-6">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        </div>
      )}

      <main className="container py-10">
        <form onSubmit={handleUpdate} className="max-w-2xl space-y-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-primary mb-4">User Information</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-600">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-600">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-600">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to keep current password"
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  minLength={6}
                />
                <p className="mt-1 text-xs text-neutral-500">Leave blank to keep current password</p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-600">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <input
                id="active"
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
              />
              <label htmlFor="active" className="text-sm font-medium text-neutral-700">
                Active
              </label>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary flex items-center gap-2 disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving…' : 'Update User'}
            </button>
            <Link href="/admin/users" className="btn btn-light">
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}

