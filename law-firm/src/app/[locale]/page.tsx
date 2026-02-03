import Hero from '@/components/Hero'
import SectionTitle from '@/components/SectionTitle'
import LogoWall from '@/components/LogoWall'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Scale, 
  Shield, 
  Users, 
  Building2, 
  Target, 
  CheckCircle2, 
  ArrowRight,
  ChevronDown,
  Sparkles,
  Zap,
  Award,
  Trophy
} from 'lucide-react'

export default async function HomePage({ params: { locale } }: { params: { locale: 'en' | 'ar' } }) {
  const isAr = locale === 'ar'
  const messages = (await import(`@/content/${locale}.json`)).default

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
            <div className="text-base text-white leading-relaxed mb-6 whitespace-pre-line">{messages.about.whoWeAre}</div>
            <Link href={`/${locale}/team`} className="btn btn-primary text-sm">{messages.home.learnMore}</Link>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-primary/20 via-forest/15 to-primary/20 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,53,15,0.1),transparent_50%)]"></div>
        <div className="container relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 rounded-xl blur-md"></div>
                <div className="relative rounded-xl bg-gradient-to-br from-primary/20 to-forest/20 p-3 border-2 border-primary/40">
                  <Target className="h-7 w-7 text-primary" strokeWidth={2} />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                {messages.about.principlesTitle}
              </h2>
            </div>
            <div className="text-lg md:text-xl text-white leading-relaxed mb-8 font-medium text-center">
              {isAr ? 'تستمد مجموعة ركاز القانونية هويتها المؤسسية من منظومة قيمية راسخة تقوم على ثلاث ركائز رئيسية:' : 'Rekaz Legal Group derives its institutional identity from a solid value system based on three main pillars:'}
            </div>
            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              {messages.about.principles.map((principle: any, index: number) => {
                const icons = [Zap, Award, Trophy]
                const Icon = icons[index] || Target
                return (
                  <div key={index} className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-forest/20 to-primary/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative overflow-hidden rounded-2xl border-2 border-primary/30 bg-primary/95 backdrop-blur-md p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/10 rounded-xl blur-md opacity-40 group-hover:opacity-60 transition-opacity"></div>
                        <div className="relative h-14 w-14 rounded-xl bg-white/20 flex items-center justify-center border-2 border-white/30 group-hover:scale-110 transition-transform duration-300">
                          <Icon className="h-7 w-7 text-white" strokeWidth={2.5} />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">{principle.title}</h3>
                      <p className="text-base text-white/90 leading-relaxed font-medium mb-4">{principle.text}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="flex justify-center pt-4">
              <Link href={`/${locale}/team`} className="btn btn-primary text-base px-8 py-3 flex items-center gap-2 group shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                <span className="font-semibold">{isAr ? 'تعرف على فريقنا' : 'Meet Our Team'}</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <SectionTitle>{messages.home.legalServicesTitle}</SectionTitle>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-forest/20 to-primary/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative rounded-2xl border-2 border-primary/40 bg-primary/95 backdrop-blur-md p-10 md:p-12 shadow-2xl">
              <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl blur-md opacity-30"></div>
                    <div className="relative rounded-2xl bg-gradient-to-br from-white/20 to-white/10 p-5 border-2 border-white/30">
                      <Scale className="h-10 w-10 text-white" strokeWidth={1.5} />
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-lg md:text-xl text-white leading-relaxed whitespace-pre-line font-medium">
                    {messages.home.legalServicesDescription}
                  </div>
                </div>
              </div>
              <div className="flex justify-center pt-6 border-t-2 border-gradient-to-r from-transparent via-primary/20 to-transparent">
                <Link href={`/${locale}/services`} className="btn btn-primary text-base px-10 py-4 flex items-center gap-3 group shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                  <span className="font-semibold">{messages.home.viewOurServices}</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-neutral-900/50 via-primary/5 to-neutral-900/50 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(120,53,15,0.1),transparent_50%)]"></div>
        <div className="container relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 rounded-xl blur-md"></div>
                <div className="relative rounded-xl bg-gradient-to-br from-primary/20 to-forest/20 p-3 border-2 border-primary/40">
                  <Shield className="h-7 w-7 text-primary" strokeWidth={2} />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                {messages.services.ipSection.title}
              </h2>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-forest/30 to-primary/30 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity"></div>
              <div className="relative rounded-2xl border-2 border-primary/40 bg-primary/95 backdrop-blur-md p-10 md:p-12 shadow-2xl">
                <div className="text-lg md:text-xl text-white leading-relaxed mb-8 font-medium">
                  {messages.services.ipSection.description}
                </div>
                <div className="flex justify-center pt-6 border-t-2 border-gradient-to-r from-transparent via-primary/20 to-transparent">
                  <Link href={`/${locale}/services`} className="btn btn-primary text-base px-10 py-4 flex items-center gap-3 group shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                    <span className="font-semibold">{messages.services.learnMore}</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-primary/20 via-forest/15 to-primary/20 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(34,197,94,0.15),transparent_50%)]"></div>
        <div className="container relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-white/30 rounded-xl blur-md"></div>
                <div className="relative rounded-xl bg-white/30 backdrop-blur-sm p-3 border-2 border-white/40">
                  <Users className="h-7 w-7 text-white" strokeWidth={2} />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                {messages.services.teamSection.title?.replace(/🔶\s*/, '') || ''}
              </h2>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-white/20 via-white/30 to-white/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
              <div className="relative rounded-2xl border-2 border-white/40 bg-primary/95 backdrop-blur-md p-10 md:p-12 shadow-2xl">
                <div className="text-lg md:text-xl text-white leading-relaxed whitespace-pre-line font-medium mb-8">
                  {messages.services.teamSection.description}
                </div>
                <div className="flex justify-center pt-6 border-t-2 border-gradient-to-r from-transparent via-white/20 to-transparent">
                  <Link href={`/${locale}/team`} className="btn bg-forest hover:bg-[#0d4a2a] text-white border-2 border-forest text-base px-10 py-4 flex items-center gap-3 group shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                    <span className="font-semibold">{isAr ? 'عرض الفريق الكامل' : 'View Full Team'}</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-xl blur-md"></div>
              <div className="relative rounded-xl bg-gradient-to-br from-primary/20 to-forest/20 p-3 border-2 border-primary/40">
                <Building2 className="h-7 w-7 text-primary" strokeWidth={2} />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
              {messages.services.clientsPartnersSection.title}
            </h2>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-forest/20 to-primary/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative rounded-2xl border-2 border-primary/30 bg-primary/95 backdrop-blur-md p-10 md:p-12 shadow-2xl">
              <div className="text-lg md:text-xl text-white leading-relaxed mb-8 font-medium">
                {messages.services.clientsPartnersSection.description}
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {messages.services.clientsPartnersSection.sectors.map((sector: string, index: number) => (
                  <div key={index} className="flex items-start gap-4 group p-4 rounded-xl bg-white/10 border-2 border-white/20 hover:border-white/40 transition-all">
                    <div className="flex-shrink-0 mt-1 relative">
                      <div className="absolute inset-0 bg-white/20 rounded-full blur-sm"></div>
                      <div className="relative rounded-full bg-white/20 p-2 border-2 border-white/30 group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="h-5 w-5 text-white" strokeWidth={2.5} />
                      </div>
                    </div>
                    <span className="text-lg text-white pt-1 font-medium">{sector}</span>
                  </div>
                ))}
              </div>
              <div className="text-lg md:text-xl text-white leading-relaxed pt-6 border-t-2 border-gradient-to-r from-transparent via-white/20 to-transparent font-medium mb-6">
                {messages.services.clientsPartnersSection.closing}
              </div>
              <div className="flex justify-center pt-4">
                <Link href={`/${locale}/contact`} className="btn btn-primary text-base px-10 py-4 flex items-center gap-3 group shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                  <span className="font-semibold">{isAr ? 'تواصل معنا' : 'Get In Touch'}</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-forest/20 via-primary/15 to-forest/20 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(120,53,15,0.15),transparent_50%)]"></div>
        <div className="container relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-white/30 rounded-xl blur-md"></div>
                <div className="relative rounded-xl bg-white/30 backdrop-blur-sm p-3 border-2 border-white/40">
                  <Target className="h-7 w-7 text-white" strokeWidth={2} />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                {messages.services.visionSection.title}
              </h2>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-white/20 via-white/30 to-white/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
              <div className="relative rounded-2xl border-2 border-white/40 bg-primary/95 backdrop-blur-md p-10 md:p-12 shadow-2xl">
                <div className="text-lg md:text-xl text-white leading-relaxed mb-8 font-medium">
                  {messages.services.visionSection.description}
                </div>
                <div className="space-y-5 mb-8">
                  {messages.services.visionSection.points.map((point: string, index: number) => (
                    <div key={index} className="flex items-start gap-4 group p-4 rounded-xl bg-white/10 border-2 border-white/20 hover:border-white/40 transition-all">
                      <div className="flex-shrink-0 mt-1 relative">
                        <div className="absolute inset-0 bg-white/20 rounded-full blur-sm"></div>
                        <div className="relative rounded-full bg-white/20 p-2 border-2 border-white/30 group-hover:scale-110 transition-transform">
                          <Sparkles className="h-5 w-5 text-white" strokeWidth={2.5} />
                        </div>
                      </div>
                      <span className="text-lg text-white pt-1 font-medium">{point}</span>
                    </div>
                  ))}
                </div>
                <div className="text-lg md:text-xl text-white leading-relaxed whitespace-pre-line pt-6 border-t-2 border-gradient-to-r from-transparent via-white/20 to-transparent font-medium mb-6">
                  {messages.services.visionSection.vision}
                </div>
                <div className="flex justify-center pt-4">
                  <Link href={`/${locale}/services`} className="btn bg-forest hover:bg-[#0d4a2a] text-white border-2 border-forest text-base px-10 py-4 flex items-center gap-3 group shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                    <span className="font-semibold">{isAr ? 'اكتشف خدماتنا' : 'Explore Our Services'}</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-xl blur-md"></div>
              <div className="relative rounded-xl bg-gradient-to-br from-primary/20 to-forest/20 p-3 border-2 border-primary/40">
                <CheckCircle2 className="h-7 w-7 text-primary" strokeWidth={2} />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
              {messages.services.closingSection.title}
            </h2>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-forest/20 to-primary/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative rounded-2xl border-2 border-primary/30 bg-primary/95 backdrop-blur-md p-10 md:p-12 shadow-2xl">
              <div className="text-lg md:text-xl text-white leading-relaxed whitespace-pre-line font-medium">
                {messages.services.closingSection.description}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-primary via-primary to-forest py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]"></div>
        <div className="container relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-2 bg-white/20 rounded-2xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity"></div>
              <div className="relative bg-white/95 backdrop-blur-md rounded-2xl border-2 border-white/40 p-10 md:p-14 grid md:grid-cols-2 gap-8 items-center shadow-2xl">
                <div className="space-y-4">
                  <div className="text-3xl md:text-4xl font-bold text-primary leading-tight">{messages.home.ctaTitle}</div>
                  <div className="h-1.5 w-24 bg-gradient-to-r from-primary via-forest to-primary rounded-full"></div>
                </div>
                <div className={`flex ${isAr ? 'md:justify-start' : 'md:justify-end'}`}>
                  <Link href={`/${locale}/contact`} className="btn btn-primary text-lg px-12 py-5 flex items-center gap-3 group shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all font-semibold">
                    {messages.home.contactUs}
                    <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="clients" className="py-16 md:py-24">
        <div className="container">
          <details className="group">
            <summary className="list-none cursor-pointer outline-none">
              <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/20 backdrop-blur-sm p-6 hover:bg-primary/30 transition-all hover:shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-white/20 backdrop-blur-sm p-2 border border-white/30">
                    <Building2 className="h-5 w-5 text-white" strokeWidth={1.5} />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">{messages.home.ourClients}</h2>
                </div>
                <ChevronDown className="h-6 w-6 text-white group-open:rotate-180 transition-transform" strokeWidth={2} />
              </div>
            </summary>
            <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
              <LogoWall />
            </div>
          </details>
        </div>
      </section>
    </main>
  )
}


