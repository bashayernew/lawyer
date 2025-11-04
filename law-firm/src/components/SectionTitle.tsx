"use client"
import { ReactNode } from 'react'
import { Gavel } from 'lucide-react'

export default function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <Gavel className="h-5 w-5 text-accent" />
        <h2 className="text-2xl md:text-3xl font-bold text-white">{children}</h2>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-0.5 w-12 bg-gradient-to-r from-accent to-[#C19D6F] rounded-full"></div>
        <div className="h-px flex-1 bg-neutral-200"></div>
      </div>
    </div>
  )
}


