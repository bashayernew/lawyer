"use client"

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Save, Trash2 } from 'lucide-react'

type EditableLink = { textEn: string; textAr: string; url: string }

const STORAGE_KEY = 'admin_authenticated'

export default function EditBlogPostPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const blogId = params?.id

  const [titleEn, setTitleEn] = useState('')
  const [titleAr, setTitleAr] = useState('')
  const [summaryEn, setSummaryEn] = useState('')
  const [summaryAr, setSummaryAr] = useState('')
  const [contentEn, setContentEn] = useState('')
  const [contentAr, setContentAr] = useState('')
  const [image, setImage] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageUploading, setImageUploading] = useState(false)
  const [links, setLinks] = useState<EditableLink[]>([{ textEn: '', textAr: '', url: '' }])
  const [locale, setLocale] = useState<'en' | 'ar'>('en')
  const [published, setPublished] = useState(false)
  const [sectors, setSectors] = useState<string[]>([])
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
    if (blogId) {
      void loadBlog(blogId)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogId])

  const loadBlog = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${baseUrl || ''}/api/blogs/${id}`, {
        headers: {
          'x-admin-secret': adminSecret
        },
        cache: 'no-store'
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { message?: string }
        throw new Error(data.message || 'Failed to fetch blog post')
      }
      const blog = await res.json()

      setTitleEn(blog.title?.en ?? '')
      setTitleAr(blog.title?.ar ?? '')
      setSummaryEn(blog.summary?.en ?? '')
      setSummaryAr(blog.summary?.ar ?? '')
      setContentEn(blog.content?.en ?? '')
      setContentAr(blog.content?.ar ?? '')
      setImage(blog.image ?? '')
      setLocale(blog.locale ?? 'en')
      setPublished(blog.status === 'published')
      setSectors(Array.isArray(blog.sectors) ? blog.sectors : [])
      setLinks(
        blog.links && blog.links.length
          ? blog.links.map((link: any) => ({
              textEn: link.text?.en ?? '',
              textAr: link.text?.ar ?? '',
              url: link.url ?? ''
            }))
          : [{ textEn: '', textAr: '', url: '' }]
      )
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to load blog post')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!blogId) return
    
    // Validate that at least one sector is selected
    if (sectors.length === 0) {
      setError('Please select at least one blog section (Rikaz | Legal Insights, Rikaz | Legal Updates, or Rikaz | Media & Highlights)')
      return
    }
    
    setSaving(true)
    setError(null)

    const updatedBlog = {
      title: { en: titleEn, ar: titleAr },
      summary: { en: summaryEn, ar: summaryAr },
      content: { en: contentEn, ar: contentAr },
      image,
      links: links
        .filter((item) => item.url.trim() !== '')
        .map((item) => ({
          text: { en: item.textEn, ar: item.textAr },
          url: item.url
        })),
      locale,
      status: published ? 'published' : 'draft',
      sectors: sectors,
      date: new Date().toISOString()
    }

    try {
      const res = await fetch(`${baseUrl || ''}/api/blogs/${blogId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': adminSecret
        },
        body: JSON.stringify(updatedBlog)
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { message?: string }
        throw new Error(data.message || 'Failed to update blog post')
      }

      router.push('/admin/blog')
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to update blog post')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!blogId) return
    if (!window.confirm('Delete this blog post? This action cannot be undone.')) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`${baseUrl || ''}/api/blogs/${blogId}`, {
        method: 'DELETE',
        headers: { 'x-admin-secret': adminSecret }
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { message?: string }
        throw new Error(data.message || 'Failed to delete blog post')
      }
      router.push('/admin/blog')
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to delete blog post')
    } finally {
      setSaving(false)
    }
  }

  const handleLinkChange = (index: number, field: keyof EditableLink, value: string) => {
    setLinks((prev) =>
      prev.map((link, idx) => (idx === index ? { ...link, [field]: value } : link))
    )
  }

  const handleAddLink = () => {
    setLinks((prev) => [...prev, { textEn: '', textAr: '', url: '' }])
  }

  const handleRemoveLink = (index: number) => {
    setLinks((prev) => prev.filter((_, idx) => idx !== index))
  }

  const handleImageUpload = async (file: File) => {
    console.log('Uploading image:', file.name, file.type, file.size)
    
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB')
      return
    }

    // Show preview immediately
    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)
    setImageUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const url = baseUrl ? `${baseUrl}/api/upload` : '/api/upload'
      console.log('Uploading to:', url)
      
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'x-admin-secret': adminSecret
        },
        body: formData
      })

      console.log('Upload response status:', res.status)

      if (!res.ok) {
        const text = await res.text()
        console.error('Upload failed:', text)
        let data = {}
        try {
          data = JSON.parse(text)
        } catch {
          // Not JSON
        }
        throw new Error((data as { message?: string }).message || `Upload failed: ${res.status}`)
      }

      const data = await res.json()
      console.log('Upload successful, URL:', data.url)
      
      // Clean up preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      
      setImage(data.url)
      setImagePreview(null)
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Failed to upload image')
      // Clean up preview on error
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      setImagePreview(null)
    } finally {
      setImageUploading(false)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items
    console.log('Paste event, items:', items.length)
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      console.log('Item type:', item.type)
      if (item.type.startsWith('image/')) {
        e.preventDefault()
        e.stopPropagation()
        const file = item.getAsFile()
        if (file) {
          console.log('Pasted image file:', file.name, file.type)
          handleImageUpload(file)
        } else {
          console.error('Failed to get file from clipboard item')
        }
        break
      }
    }
  }

  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return
      
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item.type.startsWith('image/')) {
          e.preventDefault()
          const file = item.getAsFile()
          if (file) {
            console.log('Global paste detected, uploading:', file.name)
            handleImageUpload(file)
          }
          break
        }
      }
    }

    document.addEventListener('paste', handleGlobalPaste)
    return () => {
      document.removeEventListener('paste', handleGlobalPaste)
      // Clean up any preview URLs on unmount
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
            <Link href="/admin/blog" className="rounded-full border border-neutral-200 p-2 hover:bg-neutral-100">
              <ArrowLeft className="h-5 w-5 text-primary" />
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-primary">Edit Blog Post</h1>
              <p className="text-sm text-neutral-500">Update bilingual content, visibility, and related links.</p>
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
        <form onSubmit={handleUpdate} className="space-y-8">
          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-primary mb-4">Metadata</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-600">Locale focus</label>
                <select
                  value={locale}
                  onChange={(event) => setLocale(event.target.value as 'en' | 'ar')}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="en">English default</option>
                  <option value="ar">Arabic default</option>
                </select>
              </div>
              <div className="flex items-center gap-3 pt-6">
                <input
                  id="published"
                  type="checkbox"
                  checked={published}
                  onChange={(event) => setPublished(event.target.checked)}
                  className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
                />
                <label htmlFor="published" className="text-sm font-medium text-neutral-700">
                  Publish immediately
                </label>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-neutral-200">
              <label className="mb-3 block text-sm font-medium text-neutral-600">
                Blog Sectors <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-neutral-500 mb-4">Select which section(s) this blog should appear in (at least one required):</p>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={sectors.includes('insights')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSectors([...sectors, 'insights'])
                      } else {
                        setSectors(sectors.filter(s => s !== 'insights'))
                      }
                    }}
                    className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-neutral-700 group-hover:text-primary transition-colors">Rikaz | Legal Insights</div>
                    <div className="text-xs text-neutral-500">دراسات وأبحاث</div>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={sectors.includes('updates')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSectors([...sectors, 'updates'])
                      } else {
                        setSectors(sectors.filter(s => s !== 'updates'))
                      }
                    }}
                    className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-neutral-700 group-hover:text-primary transition-colors">Rikaz | Legal Updates</div>
                    <div className="text-xs text-neutral-500">المستجدات القانونية</div>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={sectors.includes('media')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSectors([...sectors, 'media'])
                      } else {
                        setSectors(sectors.filter(s => s !== 'media'))
                      }
                    }}
                    className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-neutral-700 group-hover:text-primary transition-colors">Rikaz | Media & Highlights</div>
                    <div className="text-xs text-neutral-500">الإعلام والمحتوى المرئي</div>
                  </div>
                </label>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-primary mb-4">Headlines & summaries</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">English</h3>
                <div>
                  <label className="mb-1 block text-sm font-medium text-neutral-600">Title</label>
                  <input
                    value={titleEn}
                    onChange={(event) => setTitleEn(event.target.value)}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-neutral-600">Summary</label>
                  <textarea
                    value={summaryEn}
                    onChange={(event) => setSummaryEn(event.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    required
                  />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Arabic</h3>
                <div>
                  <label className="mb-1 block text-sm font-medium text-neutral-600">العنوان</label>
                  <input
                    value={titleAr}
                    onChange={(event) => setTitleAr(event.target.value)}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-neutral-600">الملخص</label>
                  <textarea
                    value={summaryAr}
                    onChange={(event) => setSummaryAr(event.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    required
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-primary mb-4">Body content</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-600">English HTML</label>
                <textarea
                  value={contentEn}
                  onChange={(event) => setContentEn(event.target.value)}
                  rows={10}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 font-mono text-sm text-neutral-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-600">النص العربي (HTML)</label>
                <textarea
                  value={contentAr}
                  onChange={(event) => setContentAr(event.target.value)}
                  rows={10}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 font-mono text-sm text-neutral-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm" onPaste={handlePaste}>
            <h2 className="text-lg font-semibold text-primary mb-4">Media & links</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-600">Featured image</label>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileInputChange}
                        className="hidden"
                        disabled={imageUploading}
                      />
                      <div className="w-full rounded-lg border-2 border-dashed border-neutral-300 px-4 py-6 text-center hover:border-primary transition-colors">
                        {imageUploading ? (
                          <div className="text-primary">Uploading...</div>
                        ) : (
                          <div>
                            <div className="text-sm font-medium text-neutral-700 mb-1">Click to upload</div>
                            <div className="text-xs text-neutral-500">or paste image (Ctrl+V)</div>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                  <div className="text-sm text-neutral-500">Or enter image URL or path:</div>
                  <input
                    type="text"
                    value={image}
                    onChange={(event) => {
                      setImage(event.target.value)
                      setImagePreview(null)
                    }}
                    placeholder="/uploads/blogs/image.jpg or https://your-cdn.com/image.jpg"
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  {(imagePreview || image) && (
                    <div className="mt-4 overflow-hidden rounded-xl border border-neutral-200">
                      <img 
                        src={imagePreview || image} 
                        alt="Preview" 
                        className="h-48 w-full object-cover"
                        onError={(e) => {
                          console.error('Image preview error:', e)
                          setError('Failed to load image preview')
                        }}
                      />
                      {imageUploading && (
                        <div className="mt-2 text-sm text-primary font-medium text-center">
                          Uploading...
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setImage('')
                          if (imagePreview) {
                            URL.revokeObjectURL(imagePreview)
                            setImagePreview(null)
                          }
                        }}
                        className="mt-2 text-sm text-red-600 hover:text-red-700"
                        disabled={imageUploading}
                      >
                        Remove image
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-sm font-medium text-neutral-600">Related links</label>
                  <button type="button" onClick={handleAddLink} className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-forest">
                    <PlusIcon />
                    Add link
                  </button>
                </div>
                <div className="space-y-3">
                  {links.map((link, index) => (
                    <div key={index} className="rounded-xl border border-neutral-200 p-4">
                      <div className="mb-3 grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-xs font-semibold uppercase text-neutral-500">English label</label>
                          <input
                            value={link.textEn}
                            onChange={(event) => handleLinkChange(index, 'textEn', event.target.value)}
                            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-semibold uppercase text-neutral-500">النص العربي</label>
                          <input
                            value={link.textAr}
                            onChange={(event) => handleLinkChange(index, 'textAr', event.target.value)}
                            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 md:flex-row md:items-center">
                        <input
                          type="url"
                          value={link.url}
                          onChange={(event) => handleLinkChange(index, 'url', event.target.value)}
                          className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                          placeholder="https://"
                        />
                        {links.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveLink(index)}
                            className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary flex items-center gap-2 disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            <Link href="/admin/blog" className="btn btn-light">
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}

function PlusIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  )
}
