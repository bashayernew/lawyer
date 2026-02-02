"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, Filter } from 'lucide-react'

console.log('BLOG_DEPLOY_COMMIT:', process.env.VERCEL_GIT_COMMIT_SHA)

function shouldUsePlainImg(url: string) {
  return url.includes('.public.blob.vercel-storage.com')
}

type Blog = {
  id: string
  title: { en: string; ar: string }
  summary: { en: string; ar: string }
  image?: string | null
  date: string
  createdAt: string
  sectors?: string[]
  links?: Array<{ text?: { en?: string; ar?: string }; url: string; label?: string }>
}

type BlogSection = {
  sector: 'insights' | 'updates' | 'media'
  titleAr: string
  titleEn: string
}

export default function BlogPageClient({ locale }: { locale: 'en' | 'ar' }) {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([])
  const [selectedSector, setSelectedSector] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const isAr = locale === 'ar'

  const sections: BlogSection[] = [
    {
      sector: 'insights',
      titleAr: 'ركاز | دراسات وأبحاث',
      titleEn: 'Rikaz | Legal Insights'
    },
    {
      sector: 'updates',
      titleAr: 'ركاز | المستجدات القانونية',
      titleEn: 'Rikaz | Legal Updates'
    },
    {
      sector: 'media',
      titleAr: 'ركاز | الإعلام والمحتوى المرئي',
      titleEn: 'Rikaz | Media & Highlights'
    }
  ]

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true)
        // Use relative URL - works in both local and production
        const res = await fetch('/api/blogs?published=true', {
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          }
        })
        if (res.ok) {
          const data = await res.json()
          console.log('Fetched blogs:', data.length, data)
          setBlogs(data)
          setFilteredBlogs(data)
        } else {
          console.error('Failed to fetch blogs:', res.status, res.statusText)
          const errorData = await res.json().catch(() => ({}))
          console.error('Error details:', errorData)
        }
      } catch (error) {
        console.error('Error fetching blogs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  useEffect(() => {
    if (selectedSector === null) {
      setFilteredBlogs(blogs)
    } else {
      setFilteredBlogs(
        blogs.filter((blog) => blog.sectors && blog.sectors.includes(selectedSector))
      )
    }
  }, [selectedSector, blogs])

  return (
    <main className="container py-16 md:py-24">
      <div className="mb-10 flex items-center gap-3">
        <BookOpen className="h-6 w-6 text-primary" />
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          {isAr ? 'المدونة' : 'Blog'}
        </h1>
      </div>
      <div className="h-0.5 w-12 bg-gradient-to-r from-primary to-forest rounded-full mb-8"></div>

      {/* Filter Buttons */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-white">
            {isAr ? 'تصفية حسب القسم' : 'Filter by Section'}
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedSector(null)}
            className={`px-6 py-3 rounded-xl border-2 font-semibold transition-all duration-300 ${
              selectedSector === null
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30'
                : 'bg-white/10 text-white border-primary/30 hover:border-primary/50 hover:bg-white/20'
            }`}
          >
            {isAr ? 'جميع المقالات' : 'All Articles'}
          </button>
          {sections.map((section) => (
            <button
              key={section.sector}
              onClick={() => setSelectedSector(section.sector)}
              className={`px-6 py-3 rounded-xl border-2 font-semibold transition-all duration-300 ${
                selectedSector === section.sector
                  ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30'
                  : 'bg-white/10 text-white border-primary/30 hover:border-primary/50 hover:bg-white/20'
              }`}
            >
              {isAr ? section.titleAr : section.titleEn}
            </button>
          ))}
        </div>
        {selectedSector && (
          <p className="mt-4 text-white/70 text-sm">
            {isAr 
              ? `عرض ${filteredBlogs.length} مقالة في ${sections.find(s => s.sector === selectedSector)?.titleAr}`
              : `Showing ${filteredBlogs.length} article(s) in ${sections.find(s => s.sector === selectedSector)?.titleEn}`
            }
          </p>
        )}
      </div>

      {/* Blog Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-12 w-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="h-16 w-16 text-primary/30 mx-auto mb-4" />
          <p className="text-white/60 text-lg">
            {isAr 
              ? selectedSector 
                ? 'لا توجد مقالات في هذا القسم' 
                : 'لا توجد مقالات بعد'
              : selectedSector
                ? 'No blog posts in this section'
                : 'No blog posts yet'
            }
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <article
              key={blog.id}
              className="group relative overflow-hidden rounded-xl border-2 border-primary/25 bg-white/90 backdrop-blur-md p-6 shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
            >
              {blog.image && (
                <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                  {shouldUsePlainImg(blog.image) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={blog.image}
                      alt={blog.title[locale] || blog.title.en}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <Image
                      src={blog.image}
                      alt={blog.title[locale] || blog.title.en}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  )}
                </div>
              )}
              <div className="mb-3">
                <h2 className="text-xl font-semibold text-ink mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                  {blog.title[locale] || blog.title.en}
                </h2>
                {blog.title[locale === 'en' ? 'ar' : 'en'] && (
                  <h3 className={`text-base font-medium text-neutral-600 mb-1 line-clamp-2 ${locale === 'ar' ? 'text-right' : 'text-left'}`}>
                    {blog.title[locale === 'en' ? 'ar' : 'en']}
                  </h3>
                )}
              </div>
              <p className="text-neutral-700 text-sm leading-relaxed mb-4 line-clamp-3">
                {blog.summary?.[locale] || blog.summary?.en || ''}
              </p>
              {blog.sectors && blog.sectors.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {blog.sectors.map((sector) => {
                    const section = sections.find(s => s.sector === sector)
                    if (!section) return null
                    return (
                      <span
                        key={sector}
                        className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                      >
                        {isAr ? section.titleAr : section.titleEn}
                      </span>
                    )
                  })}
                </div>
              )}
              {blog.links && blog.links.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {blog.links.slice(0, 2).map((link: any, idx: number) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-1 rounded-full bg-forest/10 text-forest border border-forest/20 hover:bg-forest/20 transition-colors"
                    >
                      {link.text?.[locale] || link.text?.en || link.label || link.url}
                    </a>
                  ))}
                </div>
              )}
              <Link
                href={`/${locale}/blog/${String(blog.id)}`}
                className="inline-flex items-center gap-2 text-primary text-sm font-semibold hover:text-forest transition-colors group/link"
              >
                <span>{isAr ? 'اقرأ المزيد' : 'Read more'}</span>
                <span className="group-hover/link:translate-x-1 transition-transform">→</span>
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}
