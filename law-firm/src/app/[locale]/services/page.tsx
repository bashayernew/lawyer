import SectionTitle from '@/components/SectionTitle'
import Link from 'next/link'
import { 
  FileText, 
  Briefcase, 
  Shield, 
  Gavel, 
  Users, 
  Building2, 
  Scale, 
  Handshake, 
  Laptop,
  CheckCircle2
} from 'lucide-react'

// Icon mapping for services - professional icons matching each service
const serviceIconMap: Record<string, any> = {
  '📑': FileText,        // Consultations and Contracts
  '💼': Briefcase,       // Commercial and Labor Cases
  '⚖': Shield,          // Intellectual Property and Trademarks
  '⚙': Gavel,          // Criminal Cases
  '👨‍👩‍👧': Users,         // Personal Status Cases
  '🏦': Building2,      // Banking and Financial Cases
  '🏛': Scale,          // Administrative and Constitutional Cases
  '🕊': Handshake,      // Arbitration and Dispute Resolution
  '💻': Laptop,         // RZ Solutions - Compliance and Digital Transformation
  '🌐': CheckCircle2,   // Conclusion
}

export default async function ServicesPage({ params: { locale } }: { params: { locale: 'en' | 'ar' } }) {
  const messages = (await import(`@/content/${locale}.json`)).default
  const isAr = locale === 'ar'
  
  const services = messages.services || {}
  const intro = services.intro || {}
  const detailedServices = services.detailedServices || []
    
  return (
    <main className="container py-16 md:py-24">
      <div className="max-w-5xl mx-auto space-y-20">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-forest/20 to-primary/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
          <div className="relative">
            <SectionTitle>{intro.title?.replace(/⚖\s*/, '') || ''}</SectionTitle>
            <div className="rounded-2xl border-2 border-primary/30 bg-primary/95 backdrop-blur-md p-10 md:p-12 shadow-2xl">
              <div className="text-lg md:text-xl text-white leading-relaxed whitespace-pre-line font-medium">
                {intro.description || ''}
              </div>
            </div>
          </div>
        </div>

        {detailedServices.map((service: any, index: number) => {
          const IconComponent = service.icon && serviceIconMap[service.icon] 
            ? serviceIconMap[service.icon] 
            : FileText
          
          return (
            <div key={index} className="border-t-2 border-primary/30 pt-16 first:border-t-0 first:pt-0">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-forest/20 to-primary/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative rounded-2xl border-2 border-primary/30 bg-primary/95 backdrop-blur-md p-10 md:p-12 shadow-2xl hover:shadow-3xl transition-all duration-300">
                  <div className="flex items-start gap-6 mb-8">
                    <div className="flex-shrink-0 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl blur-md opacity-40 group-hover:opacity-60 transition-opacity"></div>
                      <div className="relative rounded-2xl bg-white/20 p-5 border-2 border-white/30 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="h-10 w-10 text-white" strokeWidth={2} />
                      </div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white flex-1 pt-2">
                      {service.title || ''}
                    </h2>
                  </div>
                  <div className="text-lg md:text-xl text-white leading-relaxed whitespace-pre-line font-medium">
                    {service.description || ''}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

      </div>
    </main>
  )
}


