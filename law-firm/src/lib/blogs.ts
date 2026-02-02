import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { kv } from '@vercel/kv'

export type Locale = 'en' | 'ar'

export type BlogSector = 'insights' | 'updates' | 'media'
export type BlogStatus = 'draft' | 'published'

export type BlogRecord = {
  id: string
  title: Record<Locale, string>
  summary: Record<Locale, string>
  content: Record<Locale, string>
  image?: string | null
  links?: Array<{ text: Record<Locale, string>; url: string }>
  locale: Locale
  status: BlogStatus
  sectors?: BlogSector[] // Array of sectors this blog belongs to
  date: string
  createdAt: string
  updatedAt: string
  // Backward compatibility for old records
  published?: boolean
}

const BLOGS_FILE = join(process.cwd(), 'src', 'data', 'blogs.json')
const KV_BLOG_INDEX_KEY = 'blogs:index'
const KV_BLOG_PREFIX = 'blog:'

function normalizeBlog(record: any): BlogRecord {
  const normalizedId = record?.id !== undefined ? String(record.id) : ''
  const status: BlogStatus =
    record?.status === 'published' || record?.status === 'draft'
      ? record.status
      : record?.published === true
        ? 'published'
        : 'draft'

  return {
    ...record,
    id: normalizedId,
    status
  }
}

async function readBlogsFromKV(): Promise<BlogRecord[] | null> {
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const ids = (await kv.get<string[]>(KV_BLOG_INDEX_KEY)) || []
      if (ids.length === 0) {
        return []
      }

      const keys = ids.map((id) => `${KV_BLOG_PREFIX}${id}`)
      const records = await kv.mget<BlogRecord[]>(...keys)
      return records.filter(Boolean).map(normalizeBlog)
    }
  } catch (error) {
    console.error('Failed to read blogs from KV:', error)
  }
  return null
}

async function writeBlogsToKV(blogs: BlogRecord[]): Promise<void> {
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const normalized = blogs.map(normalizeBlog)
      const ids = normalized.map((blog) => blog.id)
      await kv.set(KV_BLOG_INDEX_KEY, ids)

      await Promise.all(
        normalized.map((blog) => kv.set(`${KV_BLOG_PREFIX}${blog.id}`, blog))
      )
      return
    }
  } catch (error) {
    console.error('Failed to write blogs to KV:', error)
  }
  throw new Error('KV not configured')
}

export function readBlogs(): BlogRecord[] {
  // For server-side rendering, we need synchronous reads
  // So we'll use file system and sync with KV in API routes
  try {
    const data = readFileSync(BLOGS_FILE, 'utf-8')
    return JSON.parse(data).map(normalizeBlog)
  } catch (error) {
    console.error('Failed to read blogs file:', error)
    return []
  }
}

export async function readBlogsAsync(): Promise<BlogRecord[]> {
  // Try KV first (for production)
  const kvBlogs = await readBlogsFromKV()
  if (kvBlogs !== null && kvBlogs.length > 0) {
    return kvBlogs
  }
  
  // Fallback to file system (for local dev or if KV is empty)
  try {
    const fileBlogs = readBlogs()
    // If we have file blogs but KV is empty, try to migrate
    if (fileBlogs.length > 0 && process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      try {
        await writeBlogsToKV(fileBlogs)
        console.log(`Migrated ${fileBlogs.length} blogs from file system to KV`)
      } catch (err) {
        console.error('Failed to migrate blogs to KV:', err)
      }
    }
    return fileBlogs
  } catch (error) {
    console.error('Failed to read blogs from file system:', error)
    return []
  }
}

export function writeBlogs(blogs: BlogRecord[]) {
  // Write to file system for local dev
  try {
    writeFileSync(BLOGS_FILE, JSON.stringify(blogs, null, 2), 'utf-8')
  } catch (error) {
    console.error('Failed to write blogs file:', error)
  }
}

export async function writeBlogsAsync(blogs: BlogRecord[]): Promise<void> {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    await writeBlogsToKV(blogs)
    // Also write to file system for backup in dev
    if (process.env.NODE_ENV !== 'production') {
      writeBlogs(blogs)
    }
    return
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('KV not configured')
  }

  writeBlogs(blogs)
}

