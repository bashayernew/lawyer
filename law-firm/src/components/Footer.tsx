"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Footer({ locale: _locale }: { locale?: 'en' | 'ar' }) {
  const pathname = usePathname()
  const locale = (pathname?.startsWith('/ar') ? 'ar' : pathname?.startsWith('/en') ? 'en' : (_locale ?? 'ar')) as 'en' | 'ar'
  const t = (key: string) => {
    const map = locale === 'ar'
      ? { navigate: 'تصفّح', home: 'الرئيسية', services: 'الخدمات', team: 'الفريق', blog: 'المدونة', contact: 'تواصل', address: 'الشعب البحري – قطعة ٨ – شارع الخليج العربي – برج دانة بلازا – بجانب نادي فلكس VIP – الدور الخامس – مكتب ٥٠٥', closing: 'في ختام الأمر… نثمّن ثقتكم… ومعكم تظل راية ركاز خفّاقة.' }
      : { navigate: 'Navigate', home: 'Home', services: 'Services', team: 'Team', blog: 'Blog', contact: 'Contact', address: 'Al-Shaab Al-Bahri – Block 8 – Al-Khaleej Al-Arabi Street – Dana Plaza Tower – next to Flex VIP Club – 5th floor – Office 505', closing: 'In conclusion, the family of Rekaz Legal Group extends its highest thanks and appreciation… With you, the banner of Rekaz continues to flutter.' }
    return (map as any)[key]
  }
  return (
    <footer className="mt-20 text-white">
      <div className="bg-gradient-to-b from-primary/80 to-primary/90 backdrop-blur">
        <div className="container grid md:grid-cols-4 gap-8 py-12">
          <div>
            <div className="font-serif text-xl font-semibold mb-3">Rekaz Legal Group</div>
            <p className="text-sm/6 text-white/80">{t('address')}</p>
          </div>
          <div>
            <div className="font-semibold mb-3">{t('navigate')}</div>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              <li><Link href={`/${locale}`} className="text-white/80 hover:text-white transition-colors">{t('home')}</Link></li>
              <li><Link href={`/${locale}/team`} className="text-white/80 hover:text-white transition-colors">{t('team')}</Link></li>
              <li><Link href={`/${locale}/services`} className="text-white/80 hover:text-white transition-colors">{t('services')}</Link></li>
              <li><Link href={`/${locale}/blog`} className="text-white/80 hover:text-white transition-colors">{t('blog')}</Link></li>
              <li><Link href={`/${locale}/contact`} className="text-white/80 hover:text-white transition-colors">{t('contact')}</Link></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <div className="font-semibold mb-3">{t('contact')}</div>
            <div className="flex flex-wrap gap-3">
              <a className="chip !border-white !bg-white !text-primary px-5 py-2" href="https://wa.me/96566633760" target="_blank" rel="noreferrer" aria-label="WhatsApp">WhatsApp</a>
              <a className="chip !border-white !bg-white !text-primary px-5 py-2" href="tel:+96550922149" aria-label="Call">Call</a>
              <a className="chip !border-white !bg-white !text-primary px-5 py-2" href="mailto:info@rekaz.com.kw" aria-label="Email">Email</a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 bg-primary/95 text-center py-6">
        <div className="container">
          <p className="text-sm text-white/80 mb-2">{t('closing')}</p>
          <p className="text-xs text-white/70">© {new Date().getFullYear()} Rekaz Legal Group. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}


