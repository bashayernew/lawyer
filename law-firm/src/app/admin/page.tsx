"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, ClipboardList, FilePlus2, LogOut, Users } from 'lucide-react'

const STORAGE_KEY = 'admin_authenticated'
const USER_STORAGE_KEY = 'admin_user'

export default function AdminDashboard() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedAuth = localStorage.getItem(STORAGE_KEY) === 'true'
    setIsAuthenticated(storedAuth)
  }, [])

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Store authentication and user info
      localStorage.setItem(STORAGE_KEY, 'true')
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user))
      setIsAuthenticated(true)
      setError(null)
      setEmail('')
      setPassword('')
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(USER_STORAGE_KEY)
    setIsAuthenticated(false)
    setEmail('')
    setPassword('')
    router.push('/admin')
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-forest flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-white/95 p-8 shadow-2xl backdrop-blur">
          <div className="mb-6 flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">Admin Login</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">Email or Username</label>
              <input
                type="text"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="admin@123123.com"
                required
                autoFocus
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-white transition hover:bg-forest disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white/90 backdrop-blur">
        <div className="container flex items-center justify-between py-5">
          <div className="flex items-center gap-3">
            <BookOpen className="h-7 w-7 text-primary" />
            <div>
              <h1 className="text-2xl font-semibold text-primary">Admin Dashboard</h1>
              <p className="text-sm text-neutral-500">Manage blog content and consultation requests.</p>
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-light flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="container py-10">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <Link
            href="/admin/blog/new"
            className="card group flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <FilePlus2 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-primary">Create blog post</h2>
                <p className="text-sm text-neutral-500">Draft a new article with bilingual content.</p>
              </div>
            </div>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary">
              Start writing →
            </span>
          </Link>

          <Link
            href="/admin/blog"
            className="card group flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-forest/10 p-3 text-forest">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-primary">Manage blog posts</h2>
                <p className="text-sm text-neutral-500">Edit, publish, or delete existing blog entries.</p>
              </div>
            </div>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-forest">
              View posts →
            </span>
          </Link>

          <Link
            href="/admin/consultations"
            className="card group flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-amber-100 p-3 text-amber-600">
                <ClipboardList className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-primary">Consultation requests</h2>
                <p className="text-sm text-neutral-500">Review inquiries, update status, and add notes.</p>
              </div>
            </div>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-amber-600">
              Open inbox →
            </span>
          </Link>

          <Link
            href="/admin/users"
            className="card group flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-primary">User Management</h2>
                <p className="text-sm text-neutral-500">Create and manage admin users and permissions.</p>
              </div>
            </div>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-purple-600">
              Manage users →
            </span>
          </Link>
        </div>
      </main>
    </div>
  )
}
