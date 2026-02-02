import { NextRequest, NextResponse } from 'next/server'

import { BlogRecord, Locale, readBlogsAsync, writeBlogsAsync } from '@/lib/blogs'
import { isAuthorized } from '@/lib/auth'

function kvConfigured() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (process.env.NODE_ENV === 'production' && !kvConfigured()) {
    return NextResponse.json({ message: 'KV not configured' }, { status: 500 })
  }
  const blogs = await readBlogsAsync()
  const blog = blogs.find((entry) => entry.id === params.id)

  if (!blog) {
    return NextResponse.json({ message: 'Blog not found' }, { status: 404 })
  }

  return NextResponse.json(blog)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    if (process.env.NODE_ENV === 'production' && !kvConfigured()) {
      return NextResponse.json({ message: 'KV not configured' }, { status: 500 })
    }
    const body = await request.json()
    const blogs = await readBlogsAsync()
    const index = blogs.findIndex((entry) => entry.id === params.id)

    if (index === -1) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 })
    }

    const current = blogs[index]
    const nextStatus =
      body.status === 'published' || body.status === 'draft'
        ? body.status
        : typeof body.published === 'boolean'
          ? body.published
            ? 'published'
            : 'draft'
          : current.status

    const next: BlogRecord = {
      ...current,
      title: body.title ?? current.title,
      summary: body.summary ?? current.summary,
      content: body.content ?? current.content,
      image: 'image' in body ? body.image : current.image,
      links: Array.isArray(body.links) ? body.links : current.links,
      locale: (body.locale as Locale) || current.locale,
      status: nextStatus,
      sectors: 'sectors' in body 
        ? (Array.isArray(body.sectors) && body.sectors.length > 0 ? body.sectors : undefined)
        : current.sectors,
      date: body.date || current.date,
      updatedAt: new Date().toISOString()
    }

    blogs[index] = next
    await writeBlogsAsync(blogs)

    return NextResponse.json(next)
  } catch (error: any) {
    console.error('Failed to update blog:', error)
    return NextResponse.json({ message: 'Failed to update blog' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  if (process.env.NODE_ENV === 'production' && !kvConfigured()) {
    return NextResponse.json({ message: 'KV not configured' }, { status: 500 })
  }
  const blogs = await readBlogsAsync()
  const remaining = blogs.filter((entry) => entry.id !== params.id)

  if (remaining.length === blogs.length) {
    return NextResponse.json({ message: 'Blog not found' }, { status: 404 })
  }

  await writeBlogsAsync(remaining)
  return NextResponse.json({ ok: true })
}
