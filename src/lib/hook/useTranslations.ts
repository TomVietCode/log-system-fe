import { useTranslations as useNextIntlTranslations } from 'next-intl';

export function useCommonTranslations() {
  return useNextIntlTranslations('common')
}

export function useAuthTranslations() {
  return useNextIntlTranslations('auth')
}