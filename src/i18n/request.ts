import { getRequestConfig } from "next-intl/server"
import { cookies } from "next/headers"
import { defaultLocale, locales } from "./config"

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const locale = cookieStore.get("locale")?.value || defaultLocale
  
  // validate locale
  if (!locales.includes(locale as any)) {
    return {
      locale: defaultLocale,
      messages: (await import(`./locales/${defaultLocale}.json`)).default,
      auth: (await import(`./locales/${defaultLocale}/auth.json`)).default,
      dashboard: (await import(`./locales/${defaultLocale}/dashboard.json`)).default,
      user: (await import(`./locales/${defaultLocale}/user.json`)).default,
    }
  }

  return {
    locale,
    messages: {
      common: (await import(`./locales/${locale}/common.json`)).default,
      auth: (await import(`./locales/${locale}/auth.json`)).default,
      dashboard: (await import(`./locales/${locale}/dashboard.json`)).default,
      user: (await import(`./locales/${locale}/user.json`)).default,
    }
  }
})