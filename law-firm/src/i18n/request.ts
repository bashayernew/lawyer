import {getRequestConfig} from 'next-intl/server'

export default getRequestConfig(async ({locale}) => {
  const supported = ['en', 'ar'] as const
  const current = (supported as readonly string[]).includes(locale) ? locale : 'ar'
  return {
    locales: supported as any,
    messages: (await import(`../content/${current}.json`)).default
  }
})


