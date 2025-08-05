import { useTranslations as useNextIntlTranslations } from 'next-intl';

export function useCommonTranslations() {
  return useNextIntlTranslations('common')
}

export function useAuthTranslations() {
  return useNextIntlTranslations('auth')
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