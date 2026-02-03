import BlogPageClient from './BlogPageClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function BlogPage({ params: { locale } }: { params: { locale: 'en' | 'ar' } }) {
  const messages = (await import(`@/content/${locale}.json`)).default
  const blogSectionsHeading = (messages as any).team?.blogSectionsHeading ?? ''
  const blogSections = (messages as any).team?.blogSections ?? []
  return (
    <BlogPageClient
      locale={locale}
      blogSectionsHeading={blogSectionsHeading}
      blogSections={blogSections}
    />
  )
}
