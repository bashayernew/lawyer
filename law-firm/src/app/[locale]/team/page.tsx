import { Users, Briefcase } from 'lucide-react'

export default async function TeamPage({ params: { locale } }: { params: { locale: 'en' | 'ar' } }) {
  const content = (await import(`@/content/${locale}.json`)).default
  const members = content.team.members
  return (
    <main className="container py-16 md:py-24">
      <div className="mb-10 flex items-center gap-3">
        <Users className="h-6 w-6 text-accent" />
        <h1 className="text-3xl md:text-4xl font-bold text-white">{content.nav.team}</h1>
      </div>
      <div className="h-0.5 w-12 bg-gradient-to-r from-accent to-[#C19D6F] rounded-full mb-10"></div>
      <div className="grid md:grid-cols-2 gap-6">
        {members.map((m: any) => (
          <article key={m.name} className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-md">
            <div className="flex gap-4">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-forest/20 rounded-xl transform rotate-2 group-hover:rotate-3 transition-transform duration-300"></div>
                <img src={m.image} alt={m.name} className="relative h-24 w-24 rounded-xl object-cover border-2 border-neutral-200 shadow-sm group-hover:shadow-md transition-shadow" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 mb-1">
                  <Briefcase className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <h3 className="text-lg font-semibold text-primary">{m.name}</h3>
                </div>
                <p className="text-sm font-medium text-forest mb-3">{m.role}</p>
                <ul className="text-sm text-neutral-600 space-y-1.5">
                  {m.bullets.slice(0, 3).map((b: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-accent mt-1 text-xs">▸</span>
                      <span className="leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}


