import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { kv } from '@vercel/kv'

export type Locale = 'en' | 'ar'

export type BlogSector = 'insights' | 'updates' | 'media'

export type BlogRecord = {
  id: string
  title: Record<Locale, string>
  summary: Record<Locale, string>
  content: Record<Locale, string>
  image?: string | null
  links?: Array<{ text: Record<Locale, string>; url: string }>
  locale: Locale
  published: boolean
  sectors?: BlogSector[] // Array of sectors this blog belongs to
  date: string
  createdAt: string
  updatedAt: string
}

const BLOGS_FILE = join(process.cwd(), 'src', 'data', 'blogs.json')
const KV_BLOGS_KEY = 'blogs:all'

// Try to use Vercel KV, fallback to file system for local development
async function readBlogsFromKV(): Promise<BlogRecord[] | null> {
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      let blogs = await kv.get<BlogRecord[]>(KV_BLOGS_KEY)
      
      // If KV is empty but file system has blogs, migrate them
      if (!blogs || blogs.length === 0) {
        const fileBlogs = readBlogs()
        if (fileBlogs.length > 0) {
          await kv.set(KV_BLOGS_KEY, fileBlogs)
          blogs = fileBlogs
        }
      }
      
      return blogs || []
    }
  } catch (error) {
    console.error('Failed to read blogs from KV:', error)
  }
  return null
}

async function writeBlogsToKV(blogs: BlogRecord[]): Promise<boolean> {
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      await kv.set(KV_BLOGS_KEY, blogs)
      return true
    }
  } catch (error) {
    console.error('Failed to write blogs to KV:', error)
  }
  return false
}

export function readBlogs(): BlogRecord[] {
  // For server-side rendering, we need synchronous reads
  // So we'll use file system and sync with KV in API routes
  try {
    const data = readFileSync(BLOGS_FILE, 'utf-8')
    return JSON.parse(data)
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
        await kv.set(KV_BLOGS_KEY, fileBlogs)
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
  // Write to both KV (for production) and file system (for local dev)
  const kvWritten = await writeBlogsToKV(blogs)
  if (!kvWritten) {
    // Fallback to file system if KV is not available
    writeBlogs(blogs)
  } else {
    // Also write to file system for backup
    writeBlogs(blogs)
  }
}

