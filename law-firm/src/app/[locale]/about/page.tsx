import { Zap, Target, Award } from 'lucide-react'

export default async function AboutPage({ params: { locale } }: { params: { locale: 'en' | 'ar' } }) {
  const about = (await import(`@/content/${locale}.json`)).default.about
  const icons = [Zap, Target, Award]
  
  return (
    <main className="container py-16 md:py-24">
      <div className="max-w-3xl mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-5">{about.title}</h1>
        <p className="text-base md:text-lg text-white leading-relaxed">{about.whoWeAre}</p>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl md:text-2xl font-bold text-white mb-8 flex items-center gap-2">
          <Award className="h-5 w-5 text-accent" />
          Principles & Values
        </h2>
        <div className="grid sm:grid-cols-3 gap-5">
          {about.principles.map((p: any, i: number) => {
            const Icon = icons[i] || Award
            return (
              <div key={p.title} className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-md">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/10 to-forest/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">{p.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{p.text}</p>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}


