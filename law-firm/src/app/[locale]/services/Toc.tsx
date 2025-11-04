"use client"
import Link from 'next/link'
import { useActiveSection } from '@/components/ServiceDetail'
import { useEffect, useState } from 'react'

export default function Toc({ locale, title, services }: { locale: 'en' | 'ar'; title: string; services: any[] }) {
  const ids = services.map((s) => s.key)
  const active = useActiveSection(ids)
  const [messages, setMessages] = useState<any>(null)
  
  useEffect(() => {
    import(`@/content/${locale}.json`).then(mod => setMessages(mod.default))
  }, [locale])
  
  if (!messages) return null
  
  return (
    <aside className="md:sticky md:top-20 self-start">
      <div className="rounded-xl border border-primary/20 bg-white/85 backdrop-blur-md p-4 shadow-sm">
        <div className="text-sm font-semibold text-ink mb-2">{title}</div>
        <ul className="space-y-1 text-sm">
          {services.map((s) => (
            <li key={s.key}>
              <a
                href={`#${s.key}`}
                className={`block rounded-lg px-2 py-1 transition-colors ${active === s.key ? 'bg-primary/10 text-primary' : 'text-neutral-700 hover:bg-neutral-100'}`}
              >
                {s.title}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-3"><Link href={`/${locale}/contact`} className="btn btn-primary w-full justify-center">{messages.nav.contact}</Link></div>
      </div>
    </aside>
  )
}
