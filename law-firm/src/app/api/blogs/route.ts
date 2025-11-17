import { NextRequest, NextResponse } from 'next/server'

import { BlogRecord, Locale, readBlogs, readBlogsAsync, writeBlogsAsync } from '@/lib/blogs'
import { isAuthorized } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const locale = searchParams.get('locale') as Locale | null
  const published = searchParams.get('published')
  const sector = searchParams.get('sector') as 'insights' | 'updates' | 'media' | null

  // Use async read to support KV storage
  let blogs = await readBlogsAsync()

  if (locale) {
    blogs = blogs.filter((blog) => blog.locale === locale)
  }

  if (published === 'true') {
    blogs = blogs.filter((blog) => blog.published)
  }

  if (sector) {
    blogs = blogs.filter((blog) => blog.sectors && blog.sectors.includes(sector))
  }

  blogs.sort(
    (a, b) => new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime()
  )

  return NextResponse.json(blogs)
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, summary, content, image, links, locale, published, sectors, date } = body

    if (!title?.en || !title?.ar || !summary?.en || !summary?.ar || !content?.en || !content?.ar) {
      return NextResponse.json({ message: 'Missing required bilingual fields' }, { status: 400 })
    }

    const now = new Date().toISOString()
    const blogs = readBlogs()

    const newBlog: BlogRecord = {
      id: Date.now().toString(),
      title,
      summary,
      content,
      image: image || null,
      links: Array.isArray(links) ? links : [],
      locale: (locale as Locale) || 'en',
      published: Boolean(published),
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
