"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header({ locale: _locale }: { locale?: 'en' | 'ar' }) {
  const pathname = usePathname()
  const current = (pathname?.startsWith('/ar') ? 'ar' : pathname?.startsWith('/en') ? 'en' : (_locale ?? 'ar')) as 'en' | 'ar'
  const otherLocale: 'en' | 'ar' = current === 'ar' ? 'en' : 'ar'
  const switched = `/${otherLocale}${pathname?.replace(/^\/(ar|en)/, '') || ''}`

  const nav = current === 'ar'
    ? { home: 'الرئيسية', about: 'من نحن', services: 'الخدمات', team: 'الفريق', clients: 'العملاء', contact: 'تواصل' }
    : { home: 'Home', about: 'About', services: 'Services', team: 'Team', clients: 'Clients', contact: 'Contact' }

  return (
    <header className="sticky top-0 z-50 bg-primary/70 text-white backdrop-blur-md border-b border-white/10 shadow-sm">
      <div className="container flex items-center justify-between py-3.5">
        <Link href={`/${current}`} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-white/20 to-white/10 grid place-items-center text-white shadow-sm">
            <span className="sr-only">Logo</span>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 5l7 14 7-14" />
            </svg>
          </div>
          <span className="font-serif text-lg font-semibold text-white">Rukaz Legal Group</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 text-sm">
          <Link href={`/${current}`} className="px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white text-sm font-medium">{nav.home}</Link>
          <Link href={`/${current}/about`} className="px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white text-sm font-medium">{nav.about}</Link>
          <Link href={`/${current}/services`} className="px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white text-sm font-medium">{nav.services}</Link>
          <Link href={`/${current}/team`} className="px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white text-sm font-medium">{nav.team}</Link>
          <Link href={`/${current}#clients`} className="px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white text-sm font-medium">{nav.clients}</Link>
          <Link href={`/${current}/contact`} className="btn btn-gold ml-2 text-sm px-5 py-2">{nav.contact}</Link>
          <Link href={switched} className="chip border-white/20 bg-white/10 ml-2 text-xs px-3 py-1.5 text-white" aria-label="Switch language">
            {otherLocale.toUpperCase()}
          </Link>
        </nav>
      </div>
    </header>
  )
}


