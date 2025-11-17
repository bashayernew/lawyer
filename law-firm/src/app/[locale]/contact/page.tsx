import dynamic from 'next/dynamic'
const ContactForm = dynamic(() => import('@/components/ContactForm'), { ssr: false })
import Image from 'next/image'
import { MapPin, Phone, Mail, Globe, MessageCircle } from 'lucide-react'

export default async function ContactPage({ params: { locale } }: { params: { locale: 'en' | 'ar' } }) {
  const messages = (await import(`@/content/${locale}.json`)).default
  const c = messages.contact
  return (
    <main className="container py-16 md:py-24">
      <div className="mb-10 flex items-center gap-3">
        <MessageCircle className="h-6 w-6 text-accent" />
        <h1 className="text-3xl md:text-4xl font-bold text-white">{messages.nav.contact}</h1>
      </div>
      <div className="h-0.5 w-12 bg-gradient-to-r from-accent to-[#C19D6F] rounded-full mb-8"></div>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="group rounded-xl border border-neutral-200 bg-white p-5 shadow-sm hover:border-primary/50 hover:shadow-md transition-all duration-300">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/10 to-forest/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-neutral-700 mb-1">Address</div>
                <div className="text-sm font-medium text-neutral-900">{c.address}</div>
              </div>
            </div>
          </div>
          <a href={`tel:+965${c.phones.legal}`} className="group rounded-xl border border-neutral-200 bg-white p-5 shadow-sm hover:border-primary/50 hover:shadow-md transition-all duration-300 block">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/10 to-forest/10 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-neutral-700 mb-1">Legal Admin (WhatsApp)</div>
                <div className="text-base font-bold text-primary">{c.phones.legal}</div>
              </div>
            </div>
          </a>
          <a href={`tel:+965${c.phones.financial}`} className="group rounded-xl border border-neutral-200 bg-white p-5 shadow-sm hover:border-primary/50 hover:shadow-md transition-all duration-300 block">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/10 to-forest/10 flex items-center justify-center flex-shrink-0">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-neutral-700 mb-1">Financial Admin</div>
                <div className="text-base font-bold text-primary">{c.phones.financial}</div>
              </div>
            </div>
          </a>
          <a href={`mailto:${c.email}`} className="group rounded-xl border border-neutral-200 bg-white p-5 shadow-sm hover:border-primary/50 hover:shadow-md transition-all duration-300 block">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/10 to-forest/10 flex items-center justify-center flex-shrink-0">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-neutral-700 mb-1">Email</div>
                <div className="text-base font-bold text-primary">{c.email}</div>
              </div>
            </div>
          </a>
          <a href={`https://${c.website}`} target="_blank" rel="noreferrer" className="group rounded-xl border border-neutral-200 bg-white p-5 shadow-sm hover:border-primary/50 hover:shadow-md transition-all duration-300 block">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/10 to-forest/10 flex items-center justify-center flex-shrink-0">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-neutral-700 mb-1">Website</div>
                <div className="text-base font-bold text-primary">{c.website}</div>
              </div>
            </div>
          </a>
        </div>
        {/* Client-only form to avoid serializing handlers during SSG */}
        <ContactForm
          placeholders={{
            name: locale === 'ar' ? 'الاسم الكامل' : 'Full Name',
            email: locale === 'ar' ? 'البريد الإلكتروني' : 'Email',
            phone: locale === 'ar' ? 'الهاتف' : 'Phone',
            message: locale === 'ar' ? 'الرسالة' : 'Message',
            preferredDate: locale === 'ar' ? 'التاريخ المفضل' : 'Preferred date',
            submit: locale === 'ar' ? 'إرسال' : 'Send',
            success: locale === 'ar' ? 'شكراً لك! سيتواصل معك فريقنا قريباً.' : 'Thank you! Our team will reach out shortly.',
            error: locale === 'ar' ? 'تعذّر إرسال الطلب، حاول مرة أخرى.' : 'Unable to send your request. Please try again.',
            locale
          }}
        />
        {/* Map placed directly under the cards/form section */}
        <div className="md:col-span-2">
          <div className="relative w-full overflow-hidden rounded-xl border aspect-[16/9] max-h-[300px]">
            <iframe
              title={locale === 'ar' ? 'خريطة الوصول إلى المكتب' : 'Map to office'}
              className="absolute inset-0 h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=Kuwait%20City&output=embed"
            />
          </div>
        </div>
      </div>
    </main>
  )
}

// no client wrapper needed; ContactForm is dynamically imported client-only


