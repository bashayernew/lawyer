"use client"
import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'

export default function Hero({ locale, title, subhead, cta }: { locale: 'en' | 'ar'; title: string; subhead: string; cta: string }) {
  const prefersReduced = useReducedMotion()
  return (
    <section className="relative overflow-hidden">
      {/* Background video */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="/law.webp"
      >
        <source src="/law-video.mp4" type="video/mp4" />
      </video>
      {/* Soft dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/40"></div>

      <div className="container relative z-10 py-24 md:py-36">
        <motion.div
          initial={prefersReduced ? undefined : { opacity: 0, y: 20 }}
          animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h1 
            className="text-3xl md:text-5xl font-bold text-white leading-tight mb-5"
            initial={prefersReduced ? undefined : { opacity: 0, y: 12 }}
            animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {title}
          </motion.h1>
          <motion.p 
            className="text-base md:text-lg text-white/90 max-w-2xl mx-auto mb-6 leading-relaxed"
            initial={prefersReduced ? undefined : { opacity: 0, y: 12 }}
            animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {subhead}
          </motion.p>
          <motion.div 
            className="mt-8 flex justify-center"
            initial={prefersReduced ? undefined : { opacity: 0, y: 12 }}
            animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Link href={`/${locale}/contact`} className="btn btn-gold text-base px-8 py-4">
              {cta}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}


