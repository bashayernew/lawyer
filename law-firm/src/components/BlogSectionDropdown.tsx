"use client"

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronDown, BookOpen, ArrowRight, FileText, Video } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Blog = {
  id: string
  title: { en: string; ar: string }
  summary: { en: string; ar: string }
  image?: string | null
  date: string
  createdAt: string
}

const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  FileText,
  Video,
}

type BlogSectionDropdownProps = {
  locale: 'en' | 'ar'
  sector: 'insights' | 'updates' | 'media'
  titleAr: string
  titleEn: string
  description: string
  iconName: 'BookOpen' | 'FileText' | 'Video'
}

export default function BlogSectionDropdown({
  locale,
  sector,
  titleAr,
  titleEn,
  description,
  iconName
}: BlogSectionDropdownProps) {
  const Icon = iconMap[iconName] || BookOpen
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const isAr = locale === 'ar'

  const fetchBlogs = async () => {
    if (hasLoaded) return // Don't fetch again if already loaded
    try {
      setLoading(true)
      // Use relative URL - works in both local and production
      const res = await fetch(`/api/blogs?published=true&sector=${sector}`, {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      if (res.ok) {
        const data = await res.json()
        setBlogs(data)
        setHasLoaded(true)
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const details = detailsRef.current
    if (!details) return

    // Open by default to make content visible
    details.open = true

    const handleToggle = () => {
      if (details.open && !hasLoaded) {
        void fetchBlogs()
      }
    }

    // Fetch blogs immediately since it's open by default
    if (!hasLoaded) {
      void fetchBlogs()
    }

    details.addEventListener('toggle', handleToggle)
    return () => details.removeEventListener('toggle', handleToggle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasLoaded])

  return (
    <div className="group relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-forest/20 to-primary/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
      <details ref={detailsRef} open className="relative rounded-2xl border-2 border-primary/30 bg-primary/95 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300">
        <summary className="list-none cursor-pointer outline-none">
          <div className="p-8">
            <div className="flex flex-col items-start gap-5 mb-5">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/10 rounded-xl blur-md opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative rounded-xl bg-white/20 p-4 border-2 border-white/30 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-8 w-8 text-white" strokeWidth={2} />
                </div>
              </div>
              <div className="flex-1 w-full flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                    {isAr ? titleAr : titleEn}
                  </h3>
                  {!isAr && titleAr && (
                    <p className="text-sm text-white/70 mb-3 font-medium">{titleAr}</p>
                  )}
                </div>
                <ChevronDown className="h-6 w-6 text-white flex-shrink-0 mt-1 group-open:rotate-180 transition-transform" strokeWidth={2} />
              </div>
            </div>
            <p className="text-base text-white/90 leading-relaxed mb-4 font-medium">
              {description}
            </p>
            <div className="flex items-center gap-2 text-white font-semibold">
              <span className="text-base">{isAr ? 'استكشف المزيد' : 'Explore more'}</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" strokeWidth={2} />
            </div>
          </div>
        </summary>
        <div className="border-t-2 border-white/20 pt-6 px-8 pb-8 opacity-100 visible">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-white/30 mx-auto mb-3" />
              <p className="text-white/80 font-medium">
                {isAr ? 'لا توجد مقالات في هذا القسم بعد' : 'No blog posts in this section yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white mb-4">
                {isAr ? 'المقالات المنشورة' : 'Published Articles'}
              </h4>
              {blogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/${locale}/blog/${blog.id}`}
                  className="block group/item relative overflow-hidden rounded-xl border-2 border-white/20 bg-white/10 hover:border-white/40 p-5 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex gap-4">
                    {blog.image && (
                      <div className="relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 border-white/20">
                        <Image
                          src={blog.image}
                          alt={blog.title[locale] || blog.title.en}
                          fill
                          className="object-cover group-hover/item:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h5 className="text-lg font-bold text-white mb-1 line-clamp-2 group-hover/item:text-white/80 transition-colors">
                        {blog.title[locale] || blog.title.en}
                      </h5>
                      {blog.title[locale === 'en' ? 'ar' : 'en'] && (
                        <p className={`text-sm text-white/70 mb-2 line-clamp-1 ${locale === 'ar' ? 'text-right' : 'text-left'}`}>
                          {blog.title[locale === 'en' ? 'ar' : 'en']}
                        </p>
                      )}
                      <p className="text-sm text-white/80 line-clamp-2 mb-2">
                        {blog.summary?.[locale] || blog.summary?.en || ''}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-white/60">
                        <span>
                          {new Date(blog.date || blog.createdAt).toLocaleDateString(
                            locale === 'ar' ? 'ar-KW' : 'en-US',
                            { year: 'numeric', month: 'short', day: 'numeric' }
                          )}
                        </span>
                        <span className="text-white">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              <div className="pt-4 border-t border-white/10">
                <Link
                  href={`/${locale}/blog${sector ? `?sector=${sector}` : ''}`}
                  className={`inline-flex items-center gap-2 text-white font-semibold hover:text-white/80 transition-colors ${isAr ? 'flex-row-reverse' : ''}`}
                >
                  <span dir={isAr ? 'rtl' : 'ltr'}>{isAr ? 'عرض جميع المقالات' : 'View all articles'}</span>
                  <ArrowRight className={`h-4 w-4 ${isAr ? 'rotate-180' : ''}`} strokeWidth={2} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </details>
    </div>
  )
}
