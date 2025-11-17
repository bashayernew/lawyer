"use client"
import Image from 'next/image'
import { useState } from 'react'

// Use the 23 uploaded logos renamed to brand-01.png ... brand-23.png
const logos = Array.from({ length: 23 }, (_v, i) => `brand-${String(i + 1).padStart(2, '0')}.png`)

export default function LogoWall() {
  const [hidden, setHidden] = useState<Record<string, boolean>>({})
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
      {logos.map((f) => {
        if (hidden[f]) return null
        return (
          <div
            key={f}
            className="aspect-[4/3] rounded-xl border border-primary/20 bg-primary/10 grid place-items-center p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <Image
              src={`/clients/${f}`}
              alt={f.replace(/[-.]/g, ' ')}
              width={220}
              height={140}
              className="max-h-full max-w-full object-contain"
              onError={() => setHidden((h) => ({ ...h, [f]: true }))}
            />
          </div>
        )
      })}
    </div>
  )
}


