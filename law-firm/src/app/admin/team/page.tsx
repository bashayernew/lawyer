"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2, PlusCircle, RefreshCcw, Trash2, Users } from 'lucide-react'

type TeamMember = {
  id: string
  name: string
  role?: string
  description: string
  image: string
  createdAt: string
  updatedAt: string
}

const STORAGE_KEY = 'admin_authenticated'

export default function AdminTeamPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [members, setMembers] = useState<TeamMember[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const router = useRouter()

  const baseUrl = ''

  useEffect(() => {
    const storedAuth = localStorage.getItem(STORAGE_KEY)
    const authed = storedAuth === 'true'
    setIsAuthenticated(authed)
    if (!authed) {
      router.replace('/admin')
      return
    }
    void fetchMembers()
  }, [router])

  const fetchMembers = async () => {
    try {
      setLoading(true)
      setError(null)
      const url = baseUrl ? `${baseUrl}/api/team` : '/api/team'
      const res = await fetch(url, {
        cache: 'no-store'
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to load team members')
      }

      const data = (await res.json()) as TeamMember[]
      setMembers(data)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to load team members')
    } finally {
      setLoading(false)
    }
  }

  const deleteMember = async (id: string) => {
    if (!window.confirm('Delete this team member?')) return
    try {
      setError(null)
      const url = baseUrl ? `${baseUrl}/api/team/${id}` : `/api/team/${id}`
      const res = await fetch(url, {
        method: 'DELETE'
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to delete team member')
      }

      setMembers((prev) => prev.filter((member) => member.id !== id))
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to delete team member')
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
              <h1 className="text-2xl font-semibold text-primary">Team Management</h1>
              <p className="text-sm text-neutral-500">Add or remove members shown on the team page.</p>
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
              Add Member
            </button>
            <button
              onClick={fetchMembers}
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
          <AddMemberForm
            onSuccess={() => {
              setShowAddForm(false)
              void fetchMembers()
            }}
            onCancel={() => setShowAddForm(false)}
            baseUrl={baseUrl}
          />
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : members.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-10 text-center text-neutral-500">
            <Users className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
            <p>No team members yet. Add your first profile to get started.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-primary">{member.name}</h3>
                    <p className="text-sm text-neutral-500">{member.role || 'Team Member'}</p>
                  </div>
                  <button
                    onClick={() => deleteMember(member.id)}
                    className="btn bg-red-500 text-white hover:bg-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-4 text-sm text-neutral-700 leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function AddMemberForm({
  onSuccess,
  onCancel,
  baseUrl
}: {
  onSuccess: () => void
  onCancel: () => void
  baseUrl: string
}) {
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageUploading, setImageUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB')
      return
    }

    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)
    setImageUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const url = baseUrl ? `${baseUrl}/api/upload` : '/api/upload'
      const res = await fetch(url, {
        method: 'POST',
        body: formData
      })

      if (!res.ok) {
        const text = await res.text()
        let data = {}
        try {
          data = JSON.parse(text)
        } catch {
          // ignore non-JSON
        }
        throw new Error((data as { message?: string }).message || `Upload failed: ${res.status}`)
      }

      const data = await res.json()
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      setImage(data.url)
      setImagePreview(null)
    } catch (err: any) {
      setError(err.message || 'Failed to upload image')
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      setImagePreview(null)
    } finally {
      setImageUploading(false)
    }
  }

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(false)
    const file = event.dataTransfer.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const url = baseUrl ? `${baseUrl}/api/team` : '/api/team'
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          role,
          description,
          image
        })
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to create team member')
      }

      setName('')
      setRole('')
      setDescription('')
      setImage('')
      setImagePreview(null)
      onSuccess()
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to create team member')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-primary mb-4">Add Team Member</h2>
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
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-600">Role (optional)</label>
            <input
              type="text"
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Team Member"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-600">Description</label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            rows={4}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-600">Image</label>
          <div
            className={`rounded-lg border-2 border-dashed px-4 py-6 text-center transition ${
              isDragging ? 'border-primary bg-primary/5' : 'border-neutral-300'
            }`}
            onDragOver={(event) => {
              event.preventDefault()
              event.stopPropagation()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <input
              id="team-image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileInputChange}
            />
            <div className="text-sm text-neutral-600">
              Drag & drop an image here, or{' '}
              <label htmlFor="team-image-upload" className="text-primary underline cursor-pointer">
                choose a file
              </label>
            </div>
            <div className="mt-2 text-xs text-neutral-500">Max size 5MB</div>
            {(imagePreview || image) && (
              <div className="mt-4">
                <div className="mx-auto h-28 w-28 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview || image}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
                {image && (
                  <div className="mt-2 text-xs text-neutral-500 break-all">{image}</div>
                )}
              </div>
            )}
            {imageUploading && (
              <div className="mt-3 text-xs text-neutral-500">Uploading image…</div>
            )}
          </div>
          <div className="mt-3">
            <label className="mb-1 block text-xs font-medium text-neutral-500">
              Or paste an image URL
            </label>
            <input
              type="text"
              value={image}
              onChange={(event) => setImage(event.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="/team/member.jpg"
              required
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary disabled:opacity-60"
          >
            {loading ? 'Creating...' : 'Create Member'}
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
