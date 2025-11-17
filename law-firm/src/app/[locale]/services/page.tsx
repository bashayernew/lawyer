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
  CheckCircle2,
  Sparkles
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
  const finalNote = services.finalNote || {}
  const teamSection = services.teamSection || {}
  const clientsPartnersSection = services.clientsPartnersSection || { sectors: [], closing: '' }
  const visionSection = services.visionSection || { points: [], vision: '' }
  const closingSection = services.closingSection || { description: '' }
    
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

        <div className="border-t-2 border-primary/30 pt-16">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-forest/30 to-primary/30 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity"></div>
            <div className="relative rounded-2xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-forest/10 to-primary/10 backdrop-blur-md p-10 md:p-12 shadow-2xl">
              <div className="flex items-start gap-6 mb-6">
                <div className="flex-shrink-0 relative">
                  <div className="absolute inset-0 bg-white/30 rounded-2xl blur-md"></div>
                  <div className="relative rounded-2xl bg-white/30 backdrop-blur-sm p-4 border-2 border-white/40">
                    <CheckCircle2 className="h-8 w-8 text-primary" strokeWidth={2} />
                  </div>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg flex-1 pt-2">
                  {finalNote.title?.replace(/🌐\s*/, '') || ''}
                </h2>
              </div>
              <div className="text-lg md:text-xl text-white leading-relaxed whitespace-pre-line font-medium">
                {finalNote.description || ''}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t-2 border-primary/30 pt-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-xl blur-md"></div>
              <div className="relative rounded-xl bg-gradient-to-br from-primary/20 to-forest/20 p-3 border-2 border-primary/40">
                <Users className="h-7 w-7 text-primary" strokeWidth={2} />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
              {teamSection.title?.replace(/🔶\s*/, '') || ''}
            </h2>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-forest/20 to-primary/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative rounded-2xl border-2 border-primary/30 bg-primary/95 backdrop-blur-md p-10 md:p-12 shadow-2xl">
              <div className="text-lg md:text-xl text-white leading-relaxed whitespace-pre-line font-medium">
                {teamSection.description || ''}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t-2 border-primary/30 pt-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-xl blur-md"></div>
              <div className="relative rounded-xl bg-gradient-to-br from-primary/20 to-forest/20 p-3 border-2 border-primary/40">
                <Building2 className="h-7 w-7 text-primary" strokeWidth={2} />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
              {clientsPartnersSection.title || ''}
            </h2>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-forest/20 to-primary/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative rounded-2xl border-2 border-primary/30 bg-primary/95 backdrop-blur-md p-10 md:p-12 shadow-2xl">
              <div className="text-lg md:text-xl text-white leading-relaxed mb-8 font-medium">
                {clientsPartnersSection.description || ''}
              </div>
              {Array.isArray(clientsPartnersSection.sectors) && clientsPartnersSection.sectors.length > 0 && (
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  {clientsPartnersSection.sectors.map((sector: string, index: number) => (
                    <div key={index} className="flex items-start gap-4 group/item p-4 rounded-xl bg-white/10 border-2 border-white/20 hover:border-white/40 transition-all">
                      <div className="flex-shrink-0 mt-1 relative">
                        <div className="absolute inset-0 bg-white/20 rounded-full blur-sm"></div>
                        <div className="relative rounded-full bg-white/20 p-2 border-2 border-white/30 group-hover/item:scale-110 transition-transform">
                          <CheckCircle2 className="h-5 w-5 text-white" strokeWidth={2.5} />
                        </div>
                      </div>
                      <span className="text-lg text-white pt-1 font-medium">{sector}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="text-lg md:text-xl text-white leading-relaxed pt-6 border-t-2 border-gradient-to-r from-transparent via-white/20 to-transparent font-medium">
                {clientsPartnersSection.closing || ''}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t-2 border-primary/30 pt-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-xl blur-md"></div>
              <div className="relative rounded-xl bg-gradient-to-br from-primary/20 to-forest/20 p-3 border-2 border-primary/40">
                <Sparkles className="h-7 w-7 text-primary" strokeWidth={2} />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
              {visionSection.title || ''}
            </h2>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-forest/20 to-primary/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative rounded-2xl border-2 border-primary/30 bg-primary/95 backdrop-blur-md p-10 md:p-12 shadow-2xl">
              <div className="text-lg md:text-xl text-white leading-relaxed mb-8 font-medium">
                {visionSection.description || ''}
              </div>
              {Array.isArray(visionSection.points) && visionSection.points.length > 0 && (
                <div className="space-y-5 mb-8">
                  {visionSection.points.map((point: string, index: number) => (
                    <div key={index} className="flex items-start gap-4 group/item p-4 rounded-xl bg-white/10 border-2 border-white/20 hover:border-white/40 transition-all">
                      <div className="flex-shrink-0 mt-1 relative">
                        <div className="absolute inset-0 bg-white/20 rounded-full blur-sm"></div>
                        <div className="relative rounded-full bg-white/20 p-2 border-2 border-white/30 group-hover/item:scale-110 transition-transform">
                          <Sparkles className="h-5 w-5 text-white" strokeWidth={2.5} />
                        </div>
                      </div>
                      <span className="text-lg text-white pt-1 font-medium">{point}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="text-lg md:text-xl text-white leading-relaxed whitespace-pre-line pt-6 border-t-2 border-gradient-to-r from-transparent via-white/20 to-transparent font-medium">
                {visionSection.vision || ''}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t-2 border-primary/30 pt-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-xl blur-md"></div>
              <div className="relative rounded-xl bg-gradient-to-br from-primary/20 to-forest/20 p-3 border-2 border-primary/40">
                <CheckCircle2 className="h-7 w-7 text-primary" strokeWidth={2} />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
              {closingSection.title || ''}
            </h2>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-forest/20 to-primary/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative rounded-2xl border-2 border-primary/30 bg-primary/95 backdrop-blur-md p-10 md:p-12 shadow-2xl">
              <div className="text-lg md:text-xl text-white leading-relaxed whitespace-pre-line font-medium">
                {closingSection.description || ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}


