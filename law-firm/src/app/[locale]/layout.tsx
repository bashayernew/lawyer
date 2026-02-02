import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    default: 'Rukaz Legal Group',
    template: '%s | Rukaz Legal Group'
  },
  description: 'Rekaz Legal Group — legal consulting, litigation, contracts, and advisory.',
  icons: {
    icon: '/favicon.svg'
  },
  openGraph: {
    title: 'Rukaz Legal Group',
    description: 'Rekaz Legal Group — legal consulting, litigation, contracts, and advisory.',
    type: 'website',
    images: ['/og.svg']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rukaz Legal Group',
    description: 'Rekaz Legal Group — legal consulting, litigation, contracts, and advisory.',
    images: ['/og.svg']
  }
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

type Params = { params: { locale: 'en' | 'ar' } }

export default async function LocaleLayout({ children, params }: Readonly<{ children: React.ReactNode } & Params>) {
  console.log('DEPLOY_COMMIT_LOCALE_LAYOUT:', process.env.VERCEL_GIT_COMMIT_SHA)
  const { locale } = params
  const messages = (await import(`@/content/${locale}.json`).catch(() => null))?.default
  if (!messages) return notFound()
  const dir = locale === 'ar' ? 'rtl' : 'ltr'
  const lang = locale
  return (
    <>
      <Header locale={locale} />
      {children}
      <Footer locale={locale} />
    </>
  )
}


