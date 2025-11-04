import ServiceDetail from '@/components/ServiceDetail'
import Toc from './Toc'

export default async function ServicesPage({ params: { locale } }: { params: { locale: 'en' | 'ar' } }) {
  const content = (await import(`@/content/${locale}.json`)).default
  const services = content.services.list
  return (
    <main className="container py-12 md:py-16 grid md:grid-cols-[220px_1fr] gap-6">
      <Toc locale={locale} title={content.services.title} services={services} />
      <div className="grid sm:grid-cols-2 gap-4">
        {services.map((s: any) => (
          <div key={s.key} className="h-full">
            <ServiceDetail service={s} />
          </div>
        ))}
        <div className="sm:col-span-2 text-right"><a href="#top" className="chip border-primary/30" aria-label="Back to top">↑</a></div>
      </div>
    </main>
  )
}


