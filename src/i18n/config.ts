export const defaultLocale = 'vi' as const
export const locales = ['vi', 'en'] as const

export type Locale = (typeof locales)[number]

export const localeNames: Record<Locale, string> = {
  vi: 'Tiếng Việt',
  en: 'English'
}

export const localeFlags: Record<Locale, string> = {
  vi: '🇻🇳',
  en: '🇺🇸'
};