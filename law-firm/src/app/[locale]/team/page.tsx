import { Users, Briefcase, Zap, Target, Award, BookOpen, FileText, Video, ArrowRight, ChevronDown, Building2, CheckCircle2 } from 'lucide-react'
import LogoWall from '@/components/LogoWall'
import BlogSectionDropdown from '@/components/BlogSectionDropdown'
import Link from 'next/link'

export default async function TeamPage({ params: { locale } }: { params: { locale: 'en' | 'ar' } }) {
  const content = (await import(`@/content/${locale}.json`)).default
  const members = content.team.members
  const about = content.about
  const blogSections = content.team.blogSections || []
  const icons = [Zap, Target, Award]
  const blogIcons = [BookOpen, FileText, Video]
  const isAr = locale === 'ar'
  
  return (
    <main className="container py-16 md:py-24">
      <div className="mb-12 flex items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-accent/30 rounded-xl blur-md"></div>
          <div className="relative rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 p-3 border-2 border-accent/40">
            <Users className="h-8 w-8 text-accent" strokeWidth={2} />
          </div>
        </div>
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">{content.nav.team}</h1>
          <div className="h-1 w-20 bg-gradient-to-r from-accent to-[#C19D6F] rounded-full mt-2"></div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 mb-20">
        {members.map((m: any) => (
          <article key={m.name} className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-forest/20 to-primary/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative overflow-hidden rounded-2xl border-2 border-primary/30 bg-primary/95 backdrop-blur-md p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex gap-5">
                <div className="relative flex-shrink-0">
                  <div className="absolute -inset-2 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl blur-md opacity-60 group-hover:opacity-80 transition-opacity"></div>
                  <div className="relative h-28 w-28 rounded-2xl overflow-hidden border-3 border-white/30 shadow-lg group-hover:scale-105 transition-transform duration-300">
                    <img src={m.image} alt={m.name} className="h-full w-full object-cover" />
                  </div>
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-start gap-2 mb-2">
                    <Briefcase className="h-5 w-5 text-white mt-0.5 flex-shrink-0" strokeWidth={2} />
                    <h3 className="text-xl font-bold text-white">{m.name}</h3>
                  </div>
                  <p className="text-base font-semibold text-white/90 mb-4">{m.role}</p>
                  <ul className="space-y-2.5">
                    {m.bullets.slice(0, 3).map((b: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 group/item">
                        <div className="flex-shrink-0 mt-1.5 relative">
                          <div className="absolute inset-0 bg-white/20 rounded-full blur-sm"></div>
                          <div className="relative rounded-full bg-white/20 p-1 border border-white/30">
                            <CheckCircle2 className="h-3 w-3 text-white" strokeWidth={3} />
                          </div>
                        </div>
                        <span className="text-sm text-white/90 leading-relaxed pt-0.5 font-medium">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-20 border-t-2 border-primary/30 pt-16">
        <div className="flex items-center gap-4 mb-10">
          <div className="relative">
            <div className="absolute inset-0 bg-accent/30 rounded-xl blur-md"></div>
            <div className="relative rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 p-3 border-2 border-accent/40">
              <Award className="h-7 w-7 text-accent" strokeWidth={2} />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
            {about.principlesTitle}
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {about.principles.map((p: any, i: number) => {
            const Icon = icons[i] || Award
            return (
              <div key={p.title} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-forest/20 to-primary/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative overflow-hidden rounded-2xl border-2 border-primary/30 bg-primary/95 backdrop-blur-md p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/10 rounded-xl blur-md opacity-40 group-hover:opacity-60 transition-opacity"></div>
                    <div className="relative h-14 w-14 rounded-xl bg-white/20 flex items-center justify-center border-2 border-white/30 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-7 w-7 text-white" strokeWidth={2} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{p.title}</h3>
                  <p className="text-base text-white/90 leading-relaxed font-medium">{p.text}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {blogSections.length > 0 && (
        <div className="mt-20 border-t-2 border-primary/30 pt-16">
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 rounded-xl blur-md"></div>
                <div className="relative rounded-xl bg-gradient-to-br from-primary/20 to-forest/20 p-3 border-2 border-primary/40">
                  <BookOpen className="h-7 w-7 text-primary" strokeWidth={2} />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                {isAr ? 'الأقسام والمدونة' : 'Sections & Blog'}
              </h2>
            </div>
            <p className="text-neutral-300 text-lg ml-16">
              {isAr ? 'اكتشف محتوانا القانوني المتخصص' : 'Discover our specialized legal content'}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {blogSections.map((section: any, index: number) => {
              const iconNames: ('BookOpen' | 'FileText' | 'Video')[] = ['BookOpen', 'FileText', 'Video']
              const iconName = iconNames[index] || 'BookOpen'
              const sectorMap: Record<number, 'insights' | 'updates' | 'media'> = {
                0: 'insights',
                1: 'updates',
                2: 'media'
              }
              return (
                <BlogSectionDropdown
                  key={section.sector || index}
                  locale={locale}
                  sector={section.sector || sectorMap[index]}
                  titleAr={section.titleAr}
                  titleEn={section.titleEn}
                  description={section.description}
                  iconName={iconName}
                />
              )
            })}
          </div>
        </div>
      )}

      <div className="mt-20 border-t-2 border-primary/30 pt-16">
        <details className="group">
          <summary className="list-none cursor-pointer outline-none">
            <div className="relative">
              <div className="absolute -inset-1 bg-primary/30 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
              <div className="relative flex items-center justify-between rounded-2xl border-2 border-primary/40 bg-primary/20 backdrop-blur-sm p-8 hover:bg-primary/30 transition-all hover:shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/30 rounded-xl blur-md"></div>
                    <div className="relative rounded-xl bg-white/20 backdrop-blur-sm p-3 border-2 border-white/30">
                      <Building2 className="h-6 w-6 text-white" strokeWidth={2} />
                    </div>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">{content.home.ourClients}</h2>
                </div>
                <ChevronDown className="h-7 w-7 text-white group-open:rotate-180 transition-transform" strokeWidth={2.5} />
              </div>
            </div>
          </summary>
          <div className="mt-10 animate-in fade-in slide-in-from-top-4 duration-500">
            <LogoWall />
          </div>
        </details>
      </div>
    </main>
  )
}


