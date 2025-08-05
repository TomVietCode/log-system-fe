import { useAuthTranslations, useUserTranslations, useProjectTranslations } from './useTranslations'
import { 
  createLoginSchema, 
  createRegisterSchema, 
  createProfileSchema, 
  createProjectSchema,
  createChangePasswordSchema 
} from '../validation'

export function useValidationSchemas() {
  const authT = useAuthTranslations()
  const userT = useUserTranslations()
  const projectT = useProjectTranslations()

  return {
    loginSchema: createLoginSchema((key) => authT(key as any)),
    registerSchema: createRegisterSchema((key) => authT(key as any)),
    profileSchema: createProfileSchema((key) => userT(key as any)),
    projectSchema: createProjectSchema((key) => projectT(key as any)),
    changePasswordSchema: createChangePasswordSchema((key) => userT(key as any)),
  }
}