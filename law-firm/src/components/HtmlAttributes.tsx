"use client"
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function HtmlAttributes() {
  const pathname = usePathname()
  
  useEffect(() => {
    const locale = pathname?.startsWith('/ar') ? 'ar' : pathname?.startsWith('/en') ? 'en' : 'ar'
    const dir = locale === 'ar' ? 'rtl' : 'ltr'
    
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale
      document.documentElement.dir = dir
    }
  }, [pathname])
  
  return null
}
