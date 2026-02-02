"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Users, PlusCircle, Loader2, RefreshCcw, Edit, Trash2, UserPlus } from 'lucide-react'

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

export default function AdminUsersPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const router = useRouter()

  // Use relative URLs - works in both local and production
  const baseUrl = ''

  useEffect(() => {
    const storedAuth = localStorage.getItem(STORAGE_KEY)
    const authed = storedAuth === 'true'
    setIsAuthenticated(authed)
    if (!authed) {
      router.replace('/admin')
      return
    }
    void fetchUsers()
  }, [router])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const url = baseUrl ? `${baseUrl}/api/users` : '/api/users'
      const res = await fetch(url, {
        cache: 'no-store'
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to load users')
      }

      const data = (await res.json()) as User[]
      setUsers(data)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (id: string) => {
    if (!window.confirm('Delete this user? This action cannot be undone.')) return
    try {
      setError(null)
      const url = baseUrl ? `${baseUrl}/api/users/${id}` : `/api/users/${id}`
      const res = await fetch(url, {
        method: 'DELETE'
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to delete user')
      }

      setUsers((prev) => prev.filter((u) => u.id !== id))
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to delete user')
    }
  }

  const toggleActive = async (user: User) => {
    try {
      setError(null)
      const url = baseUrl ? `${baseUrl}/api/users/${user.id}` : `/api/users/${user.id}`
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ active: !user.active })
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to update user')
      }

      const updated = (await res.json()) as User
      setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)))
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to update user')
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="border-b border-neutral-200 bg-white/90 backdrop-blur">
        <div className="container flex items-center justify-between py-5">
          <div className="flex items-center gap-3">
            <Users className="h-7 w-7 text-primary" />
            <div>
              <h1 className="text-2xl font-semibold text-primary">User Management</h1>
              <p className="text-sm text-neutral-500">Create and manage admin users.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="btn btn-light">
              Back to dashboard
            </Link>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn btn-primary flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Add User
            </button>
            <button
              onClick={fetchUsers}
              className="btn btn-light flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      <main className="container py-10">
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

      {showAddForm && (
        <AddUserForm
          onSuccess={() => {
            setShowAddForm(false)
            void fetchUsers()
          }}
          onCancel={() => setShowAddForm(false)}
          baseUrl={baseUrl}
        />
      )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-10 text-center text-neutral-500">
            <Users className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
            <p>No users yet. Create your first user to get started.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-neutral-200 text-sm">
              <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Created</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-700">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-4 font-medium text-primary">{user.name}</td>
                    <td className="px-4 py-4">{user.email}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        user.role === 'admin'
                          ? 'bg-red-100 text-red-700'
                          : user.role === 'editor'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleActive(user)}
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          user.active
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {user.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-4 text-sm text-neutral-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}

function AddUserForm({
  onSuccess,
  onCancel,
  baseUrl
}: {
  onSuccess: () => void
  onCancel: () => void
  baseUrl: string
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('admin')
  const [active, setActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const url = baseUrl ? `${baseUrl}/api/users` : '/api/users'
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, role, active })
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to create user')
      }

      onSuccess()
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
        <UserPlus className="h-5 w-5" />
        Add New User
      </h2>
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              required
              minLength={6}
            />
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
        <div className="flex items-center gap-3">
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
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary disabled:opacity-60"
          >
            {loading ? 'Creating...' : 'Create User'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-light"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

