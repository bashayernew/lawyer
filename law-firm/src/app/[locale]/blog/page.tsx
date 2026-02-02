import BlogPageClient from './BlogPageClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function BlogPage({ params: { locale } }: { params: { locale: 'en' | 'ar' } }) {
  return <BlogPageClient locale={locale} />
}
