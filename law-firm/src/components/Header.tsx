"use client"
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

export default function Header({ locale: _locale }: { locale?: 'en' | 'ar' }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const current = (pathname?.startsWith('/ar') ? 'ar' : pathname?.startsWith('/en') ? 'en' : (_locale ?? 'ar')) as 'en' | 'ar'
  const otherLocale: 'en' | 'ar' = current === 'ar' ? 'en' : 'ar'
  const switched = `/${otherLocale}${pathname?.replace(/^\/(ar|en)/, '') || ''}`
  const isAr = current === 'ar'

  const nav = current === 'ar'
    ? { home: 'الرئيسية', about: 'من نحن', services: 'الخدمات', team: 'الفريق', clients: 'العملاء', blog: 'المدونة', contact: 'تواصل' }
    : { home: 'Home', about: 'About', services: 'Services', team: 'Team', clients: 'Clients', blog: 'Blog', contact: 'Contact' }

  return (
    <header className="sticky top-0 z-50 bg-primary text-white backdrop-blur-md border-b border-white/20 shadow-lg">
      <div className="container flex items-center justify-between py-4">
        <Link href={`/${current}`} className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <div className="h-10 w-10 rounded-lg bg-white/20 grid place-items-center text-white shadow-md">
            <span className="sr-only">Logo</span>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 5l7 14 7-14" />
            </svg>
          </div>
          <span className="font-serif text-xl font-bold text-white drop-shadow-sm">Rukaz Legal Group</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2 text-sm">
          <Link href={`/${current}`} className="px-4 py-2 rounded-lg hover:bg-white/20 transition-colors text-white font-semibold text-sm">{nav.home}</Link>
          <Link href={`/${current}/team`} className="px-4 py-2 rounded-lg hover:bg-white/20 transition-colors text-white font-semibold text-sm">{nav.team}</Link>
          <Link href={`/${current}/services`} className="px-4 py-2 rounded-lg hover:bg-white/20 transition-colors text-white font-semibold text-sm">{nav.services}</Link>
          <Link href={`/${current}/blog`} className="px-4 py-2 rounded-lg hover:bg-white/20 transition-colors text-white font-semibold text-sm">{nav.blog}</Link>
          <Link href={`/${current}/contact`} className="btn btn-gold ml-2 text-sm px-6 py-2.5 text-white font-bold shadow-md">{nav.contact}</Link>
          <Link href={switched} className="ml-2 px-4 py-2 rounded-lg border-2 border-white/40 bg-white/20 hover:bg-white/30 transition-all text-white font-bold text-sm min-w-[70px] text-center" aria-label="Switch language">
            {otherLocale === 'ar' ? 'عربي' : 'إنجليزي'}
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2.5 rounded-lg hover:bg-white/20 transition-colors text-white bg-white/10 border border-white/20"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-white" strokeWidth={2.5} />
          ) : (
            <Menu className="h-6 w-6 text-white" strokeWidth={2.5} />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop overlay */}
          <div 
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 top-[57px]"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Menu panel */}
          <div className="md:hidden fixed top-[57px] left-0 right-0 bg-primary border-t-2 border-white/20 shadow-2xl z-50 max-h-[calc(100vh-57px)] overflow-y-auto">
            <nav className={`container py-6 flex flex-col gap-3 ${isAr ? 'items-end' : 'items-start'}`}>
              <Link 
                href={`/${current}`} 
                onClick={() => setMobileMenuOpen(false)}
                className={`px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white font-semibold text-base w-full ${isAr ? 'text-right' : 'text-left'} border border-white/10`}
              >
                {nav.home}
              </Link>
              <Link 
                href={`/${current}/team`} 
                onClick={() => setMobileMenuOpen(false)}
                className={`px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white font-semibold text-base w-full ${isAr ? 'text-right' : 'text-left'} border border-white/10`}
              >
                {nav.team}
              </Link>
              <Link 
                href={`/${current}/services`} 
                onClick={() => setMobileMenuOpen(false)}
                className={`px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white font-semibold text-base w-full ${isAr ? 'text-right' : 'text-left'} border border-white/10`}
              >
                {nav.services}
              </Link>
              <Link 
                href={`/${current}/blog`} 
                onClick={() => setMobileMenuOpen(false)}
                className={`px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white font-semibold text-base w-full ${isAr ? 'text-right' : 'text-left'} border border-white/10`}
              >
                {nav.blog}
              </Link>
              <Link 
                href={`/${current}/contact`} 
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-gold mt-2 text-base px-6 py-4 text-white font-bold w-full text-center shadow-lg"
              >
                {nav.contact}
              </Link>
              <Link 
                href={switched} 
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 px-5 py-3 rounded-xl border-2 border-white/30 bg-white/15 hover:bg-white/25 transition-all text-white font-semibold text-sm w-full text-center"
                aria-label="Switch language"
              >
                {otherLocale === 'ar' ? 'عربي' : 'إنجليزي'}
              </Link>
            </nav>
          </div>
        </>
      )}
    </header>
  )
}


