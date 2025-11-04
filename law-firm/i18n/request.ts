import {getRequestConfig} from 'next-intl/server'

export default getRequestConfig(async ({locale}) => {
  const supported = ['en', 'ar'] as const
  const current = (supported as readonly string[]).includes(locale) ? locale : 'ar'
  try {
    const messages = (await import(`../src/content/${current}.json`)).default
    return {
      messages
    }
  } catch (error) {
    console.error('Failed to load messages:', error)
    return {
      messages: {}
    }
  }
})


