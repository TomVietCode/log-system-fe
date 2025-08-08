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
      messages: {
        common: (await import(`./locales/${defaultLocale}/common.json`)).default,
        auth: (await import(`./locales/${defaultLocale}/auth.json`)).default,
        dashboard: (await import(`./locales/${defaultLocale}/dashboard.json`)).default,
        user: (await import(`./locales/${defaultLocale}/user.json`)).default,
        devlog: (await import(`./locales/${defaultLocale}/devlog.json`)).default,
        project: (await import(`./locales/${defaultLocale}/project.json`)).default,
        account: (await import(`./locales/${defaultLocale}/account.json`)).default,
        notification: (await import(`./locales/${defaultLocale}/notification.json`)).default,
        whitelist: (await import(`./locales/${defaultLocale}/whitelist.json`)).default,
      }
    }
  }

  return {
    locale,
    messages: {
      common: (await import(`./locales/${locale}/common.json`)).default,
      auth: (await import(`./locales/${locale}/auth.json`)).default,
      dashboard: (await import(`./locales/${locale}/dashboard.json`)).default,
      user: (await import(`./locales/${locale}/user.json`)).default,
      devlog: (await import(`./locales/${locale}/devlog.json`)).default,
      project: (await import(`./locales/${locale}/project.json`)).default,
      account: (await import(`./locales/${locale}/account.json`)).default,
      notification: (await import(`./locales/${locale}/notification.json`)).default,
      whitelist: (await import(`./locales/${locale}/whitelist.json`)).default,
    }
  }
})