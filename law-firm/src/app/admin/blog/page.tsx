"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { BookOpen, Loader2, PenSquare, PlusCircle, RefreshCcw, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react'

type BlogRecord = {
  id: string
  title: { en: string; ar: string }
  summary: { en: string; ar: string }
  locale: 'en' | 'ar'
  status: 'draft' | 'published'
  date: string
  createdAt?: string
  updatedAt?: string
  image?: string
}

export default function AdminBlogListPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [blogs, setBlogs] = useState<BlogRecord[]>([])
  const router = useRouter()
  const pathname = usePathname()

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
    void fetchBlogs()

    // Refresh when page becomes visible (e.g., after navigation back)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void fetchBlogs()
      }
    }
    
    // Refresh when window gains focus (e.g., tab switch back)
    const handleFocus = () => {
      void fetchBlogs()
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      setError(null)
      // Use relative path if baseUrl is not set, otherwise use absolute URL
      const url = baseUrl ? `${baseUrl}/api/blogs` : '/api/blogs'
      console.log('Fetching blogs from:', url, 'baseUrl:', baseUrl)
      const res = await fetch(url, { 
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      console.log('Response status:', res.status, res.ok)
      if (!res.ok) {
        const text = await res.text()
        console.error('Failed to fetch blogs - response text:', text)
        let data: { error?: string; message?: string } = {}
        try {
          data = JSON.parse(text)
        } catch {
          // Not JSON
        }
        throw new Error((data as { error?: string; message?: string }).error || (data as { error?: string; message?: string }).message || `Failed to load blogs: ${res.status} ${res.statusText}`)
      }
      const data = (await res.json()) as BlogRecord[]
      console.log('Fetched blogs:', data.length, data)
      data.sort((a, b) => new Date(b.date || b.createdAt || 0).getTime() - new Date(a.date || a.createdAt || 0).getTime())
      setBlogs(data)
    } catch (err: any) {
      console.error('Error fetching blogs:', err)
      setError(err.message || 'Failed to load blogs')
    } finally {
      setLoading(false)
    }
  }

  const togglePublish = async (blog: BlogRecord) => {
    try {
      setError(null)
      const url = baseUrl ? `${baseUrl}/api/blogs/${blog.id}` : `/api/blogs/${blog.id}`
      const nextStatus = blog.status === 'published' ? 'draft' : 'published'
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: nextStatus })
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to update blog')
      }
      const updated = (await res.json()) as BlogRecord
      setBlogs((prev) => prev.map((item) => (item.id === blog.id ? updated : item)))
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to update blog')
    }
  }

  const deleteBlog = async (id: string) => {
    if (!window.confirm('Delete this blog post?')) return
    try {
      setError(null)
      const url = baseUrl ? `${baseUrl}/api/blogs/${id}` : `/api/blogs/${id}`
      const res = await fetch(url, {
        method: 'DELETE'
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to delete blog')
      }
      setBlogs((prev) => prev.filter((item) => item.id !== id))
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to delete blog')
    }
  }

  if (!isAuthenticated) {
    return null
  }

  const handleRowClick = (id: string) => {
    router.push(`/admin/blog/${id}`)
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
              <BookOpen className="h-7 w-7 text-forest" />
              Blog posts
            </h1>
            <p className="text-neutral-500 text-sm mt-1">
              Review, publish, or edit blog entries for both locales.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="btn btn-light">
              Back to dashboard
            </Link>
            <button
              type="button"
              onClick={fetchBlogs}
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
            <Link href="/admin/blog/new" className="btn btn-primary flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              New post
            </Link>
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
        ) : blogs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-10 text-center text-neutral-500">
            No blog posts yet. Create your first article to get started.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-neutral-200 text-sm">
              <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
                <tr>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Locale</th>
                  <th className="px-4 py-3 text-left">Published</th>
                  <th className="px-4 py-3 text-left">Updated</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-700">
                {blogs.map((blog) => (
                  <tr
                    key={blog.id}
                    className="hover:bg-neutral-50 cursor-pointer"
                    onClick={() => handleRowClick(blog.id)}
                  >
                    <td className="px-4 py-4">
                      <Link
                        href={`/admin/blog/${blog.id}`}
                        className="font-medium text-primary hover:underline"
                        onClick={(event) => event.stopPropagation()}
                      >
                        {blog.title.en}
                      </Link>
                      <div className="text-xs text-neutral-500 line-clamp-2">{blog.summary.en}</div>
                    </td>
                    <td className="px-4 py-4 font-medium uppercase">{blog.locale}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                        blog.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-200 text-neutral-600'
                      }`}>
                        {blog.status === 'published' ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                        {blog.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-neutral-500">
                      {new Date(blog.date).toLocaleString()}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation()
                            togglePublish(blog)
                          }}
                          className="btn btn-light flex items-center gap-1"
                        >
                          {blog.status === 'published' ? 'Unpublish' : 'Publish'}
                        </button>
                        <Link
                          href={`/admin/blog/${blog.id}`}
                          className="btn btn-primary flex items-center gap-1"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <PenSquare className="h-4 w-4" /> Edit
                        </Link>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation()
                            deleteBlog(blog.id)
                          }}
                          className="btn bg-red-500 text-white hover:bg-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

