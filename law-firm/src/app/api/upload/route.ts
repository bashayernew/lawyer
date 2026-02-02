import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { isAuthorized } from '@/lib/auth'

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ message: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ message: 'File must be an image' }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ message: 'File size must be less than 5MB' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const timestamp = Date.now()
    const extension = file.name.split('.').pop() || 'jpg'
    const filename = `blog-${timestamp}.${extension}`

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { url } = await put(`uploads/blogs/${filename}`, buffer, {
        access: 'public',
        contentType: file.type
      })
      return NextResponse.json({ url }, { status: 200 })
    }

    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { message: 'Vercel Blob not configured. Set up Blob storage to enable uploads.' },
        { status: 500 }
      )
    }

    // Local fallback for development (Vercel production FS is read-only)
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'blogs')
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true })
    }

    const filepath = join(uploadsDir, filename)
    await writeFile(filepath, buffer)

    const url = `/uploads/blogs/${filename}`
    return NextResponse.json({ url }, { status: 200 })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ 
      message: error.message || 'Failed to upload image',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}

