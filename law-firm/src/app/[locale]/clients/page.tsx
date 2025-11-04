import { redirect } from 'next/navigation'

export default async function ClientsPage({ params: { locale } }: { params: { locale: 'en' | 'ar' } }) {
  redirect(`/${locale}#clients`)
}


