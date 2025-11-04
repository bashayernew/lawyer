import { ReactNode } from 'react'
import { Inter, Tajawal } from 'next/font/google'
import './globals.css'
import HtmlAttributes from '@/components/HtmlAttributes'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })
const tajawal = Tajawal({ subsets: ['arabic'], display: 'swap', variable: '--font-arabic', weight: ['400','500','700'] })

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${inter.variable} ${tajawal.variable}`} suppressHydrationWarning>
      <body className="min-h-screen">
        <HtmlAttributes />
        <div className="relative z-0">
          {children}
        </div>
      </body>
    </html>
  )
}


