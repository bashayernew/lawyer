import Hero from '@/components/Hero'
import SectionTitle from '@/components/SectionTitle'
import ServiceCard from '@/components/ServiceCard'
import LogoWall from '@/components/LogoWall'
import Link from 'next/link'
import Image from 'next/image'

export default async function HomePage({ params: { locale } }: { params: { locale: 'en' | 'ar' } }) {
  const isAr = locale === 'ar'
  const messages = (await import(`@/content/${locale}.json`)).default
  const services = messages.services.list.slice(0, 6)

  return (
    <main>
      <Hero locale={locale} title={messages.home.headline} subhead={messages.home.subhead} cta={messages.home.contactUs} />

      <section className="container py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-forest/5 rounded-xl transform rotate-2"></div>
            <Image src="/law-home.png" alt={messages.home.aboutAlt} className="relative w-full rounded-xl shadow-lg border border-neutral-100 bg-white" width={960} height={720} />
          </div>
          <div>
            <SectionTitle>{messages.about.title}</SectionTitle>
            <p className="text-base text-white leading-relaxed mb-6">{messages.about.whoWeAre}</p>
            <Link href={`/${locale}/about`} className="btn btn-primary text-sm">{messages.home.learnMore}</Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <SectionTitle>{messages.home.ourServices}</SectionTitle>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {services.map((s: any) => (
              <ServiceCard key={s.key} icon={s.icon} title={s.title} description={s.summary} />
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Link href={`/${locale}/services`} className="btn btn-gold text-base">{messages.home.viewAll}</Link>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-primary via-primary to-forest py-16 md:py-24">
        <div className="container">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-accent/30 p-6 md:p-10 grid md:grid-cols-2 gap-6 items-center shadow-xl">
            <div className="text-2xl md:text-3xl font-bold text-primary leading-tight">{messages.home.ctaTitle}</div>
            <div className={`flex ${isAr ? 'md:justify-start' : 'md:justify-end'}`}>
              <Link href={`/${locale}/contact`} className="btn btn-primary text-sm px-6 py-3">{messages.home.contactUs}</Link>
            </div>
          </div>
        </div>
      </section>

      <section id="clients" className="py-16 md:py-24">
        <div className="container">
          <details className="group">
            <summary className="list-none cursor-pointer outline-none">
              <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/20 backdrop-blur-sm p-6 hover:bg-primary/30 transition-all">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl md:text-3xl font-bold text-white">{messages.home.ourClients}</h2>
                </div>
                <span className="text-white text-2xl group-open:rotate-180 transition-transform">▼</span>
              </div>
            </summary>
            <div className="mt-8">
              <LogoWall />
            </div>
          </details>
        </div>
      </section>
    </main>
  )
}


