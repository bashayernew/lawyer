"use client"
import { useEffect, useRef, useState } from 'react'
import { Link as LinkIcon } from 'lucide-react'

type Service = { key: string; title: string; summary: string; body?: string; image?: string }

export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const observers: IntersectionObserver[] = []
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const ob = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id)
        },
        { rootMargin: '-40% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
      )
      ob.observe(el)
      observers.push(ob)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [ids.join('|')])
  return active
}

export default function ServiceDetail({ service }: { service: Service }) {
  const ref = useRef<HTMLDivElement | null>(null)
  return (
    <section id={service.key} ref={ref} className="scroll-mt-24">
      <div className="rounded-xl border border-primary/20 bg-white/90 backdrop-blur-md p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between gap-3">
          <div className="text-lg md:text-xl font-semibold text-ink">{service.title}</div>
          <a href={`#${service.key}`} className="chip border-primary/20 px-2 py-1 text-xs" aria-label="Anchor link">
            <LinkIcon className="h-4 w-4 text-primary" />
          </a>
        </div>
        <p className="mt-2 text-neutral-700 leading-relaxed">{service.summary}</p>
        {service.body ? (
          <div className="mt-3 text-neutral-700 leading-relaxed whitespace-pre-line">{service.body}</div>
        ) : null}
      </div>
    </section>
  )
}


