import { NextRequest, NextResponse } from 'next/server'

import { BlogRecord, Locale, readBlogsAsync, writeBlogsAsync } from '@/lib/blogs'
import { isAuthorized } from '@/lib/auth'

function kvConfigured() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
}

export async function GET(request: NextRequest) {
  try {
    if (process.env.NODE_ENV === 'production' && !kvConfigured()) {
      return NextResponse.json({ error: 'KV not configured' }, { status: 500 })
    }
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') as Locale | null
    const published = searchParams.get('published')
    const sector = searchParams.get('sector') as 'insights' | 'updates' | 'media' | null

    // Use async read to support KV storage
    let blogs = await readBlogsAsync()
    console.log(`[API] Total blogs loaded: ${blogs.length}`)

    if (locale) {
      blogs = blogs.filter((blog) => blog.locale === locale)
      console.log(`[API] After locale filter (${locale}): ${blogs.length}`)
    }

    if (published === 'true') {
      const beforeCount = blogs.length
      blogs = blogs.filter((blog) => blog.status === 'published')
      console.log(`[API] After published filter: ${beforeCount} -> ${blogs.length}`)
    }

    if (sector) {
      blogs = blogs.filter((blog) => blog.sectors && blog.sectors.includes(sector))
      console.log(`[API] After sector filter (${sector}): ${blogs.length}`)
    }

    blogs.sort(
      (a, b) => new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime()
    )

    return NextResponse.json(blogs)
  } catch (error: any) {
    console.error('[API] Error in GET /api/blogs:', error)
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    if (process.env.NODE_ENV === 'production' && !kvConfigured()) {
      return NextResponse.json({ message: 'KV not configured' }, { status: 500 })
    }
    const body = await request.json()
    const { title, summary, content, image, links, locale, published, status, sectors, date } = body

    if (!title?.en || !title?.ar || !summary?.en || !summary?.ar || !content?.en || !content?.ar) {
      return NextResponse.json({ message: 'Missing required bilingual fields' }, { status: 400 })
    }

    const now = new Date().toISOString()
    // Use async read to get blogs from KV in production
    const blogs = await readBlogsAsync()

    const nextStatus = status === 'published' || status === 'draft'
      ? status
      : published
        ? 'published'
        : 'draft'

    const newBlog: BlogRecord = {
      id: String(Date.now()),
      title,
      summary,
      content,
      image: image || null,
      links: Array.isArray(links) ? links : [],
      locale: (locale as Locale) || 'en',
      status: nextStatus,
      sectors: Array.isArray(sectors) && sectors.length > 0 ? sectors : undefined,
      date: date || now,
      createdAt: now,
      updatedAt: now
    }

    blogs.push(newBlog)
    await writeBlogsAsync(blogs)

    return NextResponse.json(newBlog, { status: 201 })
  } catch (error: any) {
    console.error('Failed to create blog:', error)
    return NextResponse.json({ message: 'Failed to create blog' }, { status: 500 })
  }
}
