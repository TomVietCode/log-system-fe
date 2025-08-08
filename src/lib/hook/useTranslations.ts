import { useLocale, useTranslations as useNextIntlTranslations } from 'next-intl';

export function useCommonTranslations() {
  return useNextIntlTranslations('common');
}

export function useAuthTranslations() {
  return useNextIntlTranslations('auth');
}

export function useDashboardTranslations() {
  return useNextIntlTranslations('dashboard');
}

export function useUserTranslations() {
  return useNextIntlTranslations('user');
}

export function useDevlogTranslations() {
  return useNextIntlTranslations('devlog');
}

export function useProjectTranslations() {
  return useNextIntlTranslations('project');
}

export function useAccountTranslations() {
  return useNextIntlTranslations('account');
}

export function useNotificationTranslations() {
  return useNextIntlTranslations('notification');
}

export function useWhitelistTranslations() {
  return useNextIntlTranslations('whitelist');
}

export function useCurrentLocale() {
  return useLocale() as 'vi' | 'en';
}