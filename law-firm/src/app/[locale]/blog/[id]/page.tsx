import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Calendar } from 'lucide-react'
import { readBlogs } from '@/lib/blogs'

async function getBlog(id: string) {
  try {
    const blogs = readBlogs()
    return blogs.find(blog => blog.id === id) || null
  } catch (error) {
    console.error('Error fetching blog:', error)
    return null
  }
}

export default async function BlogPostPage({
  params: { locale, id }
}: {
  params: { locale: 'en' | 'ar'; id: string }
}) {
  const blog = await getBlog(id)
  const isAr = locale === 'ar'

  if (!blog || (!blog.published && process.env.NODE_ENV === 'production')) {
    return (
      <main className="container py-16 md:py-24 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">
          {isAr ? 'المقال غير موجود' : 'Blog post not found'}
        </h1>
        <Link href={`/${locale}/blog`} className="text-primary hover:underline">
          {isAr ? '← العودة للمدونة' : '← Back to blog'}
        </Link>
      </main>
    )
  }

  return (
    <main className="container py-16 md:py-24 max-w-4xl">
      <Link
        href={`/${locale}/blog`}
        className="inline-flex items-center gap-2 text-primary hover:text-forest mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>{isAr ? 'العودة للمدونة' : 'Back to blog'}</span>
      </Link>

      <article className="rounded-xl border border-primary/25 bg-white/90 backdrop-blur-md p-8 md:p-12 shadow-sm">
        {blog.image && (
          <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={blog.image}
              alt={blog.title[locale] || blog.title.en}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="flex items-center gap-3 text-sm text-neutral-500 mb-4">
          <Calendar className="h-4 w-4" />
          <time dateTime={blog.date || blog.createdAt}>
            {new Date(blog.date || blog.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-KW' : 'en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-ink mb-2">
            {blog.title[locale] || blog.title.en}
          </h1>
          {blog.title[locale === 'en' ? 'ar' : 'en'] && (
            <h2 className={`text-2xl md:text-3xl font-semibold text-neutral-600 mb-4 ${locale === 'ar' ? 'text-right' : 'text-left'}`}>
              {blog.title[locale === 'en' ? 'ar' : 'en']}
            </h2>
          )}
          {blog.summary && (blog.summary[locale] || blog.summary.en) && (
            <div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
              <p className="text-lg text-neutral-700 leading-relaxed">
                {blog.summary[locale] || blog.summary.en}
              </p>
              {blog.summary[locale === 'en' ? 'ar' : 'en'] && (
                <p className={`text-base text-neutral-600 mt-3 leading-relaxed ${locale === 'ar' ? 'text-right' : 'text-left'}`}>
                  {blog.summary[locale === 'en' ? 'ar' : 'en']}
                </p>
              )}
            </div>
          )}
        </div>

        <div
          className="prose prose-lg max-w-none text-neutral-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: blog.content[locale] || blog.content.en }}
        />

        {blog.links && blog.links.length > 0 && (
          <div className="mt-8 pt-8 border-t border-neutral-200">
            <h2 className="text-xl font-semibold text-ink mb-4">
              {isAr ? 'روابط ذات صلة' : 'Related Links'}
            </h2>
            <div className="flex flex-wrap gap-3">
              {blog.links.map((link: any, idx: number) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                >
                  {link.text?.[locale] || link.text?.en || link.label || link.url}
                </a>
              ))}
            </div>
          </div>
        )}
      </article>
    </main>
  )
}

