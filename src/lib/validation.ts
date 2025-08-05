import { z } from "zod"

// Type for translation function
type TranslationFunction = (key: string) => string

// Schema factories that accept translation function
export const createLoginSchema = (t: TranslationFunction) => {
  return z.object({
    email: z
      .string()
      .email(t('validation.emailInvalid'))
      .min(1, t('validation.emailRequired')),
    password: z
      .string()
      .min(1, t('validation.passwordRequired')),
  })
}

export const createRegisterSchema = (t: TranslationFunction) => {
  return z
    .object({
      fullName: z.string().min(1, t('validation.fullNameRequired')),
      email: z
        .string()
        .email(t('validation.emailInvalid'))
        .min(1, t('validation.emailRequired')),
      password: z.string().min(1, t('validation.passwordRequired')),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('validation.passwordMismatch'),
      path: ["confirmPassword"],
    })
}

export const createProfileSchema = (t: TranslationFunction) => {
  return z.object({
    phone: z
      .string()
      .min(1, t('validation.phoneRequired'))
      .regex(/^[0-9]+$/, t('validation.phoneInvalid')),
    citizenID: z
      .string()
      .min(1, t('validation.citizenIdRequired'))
      .regex(/^[0-9]+$/, t('validation.citizenIdInvalid')),
    personalEmail: z
      .string()
      .email(t('validation.personalEmailInvalid'))
      .min(1, t('validation.personalEmailRequired')),
    dob: z.string().nullable().optional(),
    accountNumber: z.string().nullable().optional(),
    licensePlate: z.string().nullable().optional(),
  })
}

export const createProjectSchema = (t: TranslationFunction) => {
  return z.object({
    name: z.string().min(1, t('validation.nameRequired')),
    description: z.string().nullable().optional(),
    memberIds: z.array(z.string()).min(1, t('validation.membersRequired')),
    tasks: z.array(z.object({ 
      id: z.string().nullable().optional(), 
      name: z.string() 
    })).optional(),
  })
}

export const createChangePasswordSchema = (t: TranslationFunction) => {
  return z.object({
    oldPassword: z.string().min(1, t('validation.oldPasswordRequired')),
    newPassword: z.string().min(1, t('validation.newPasswordRequired')),
  })
}

// Static schemas for backward compatibility (using Vietnamese as default)
export const loginSchema = createLoginSchema((key) => {
  const messages: Record<string, string> = {
    'validation.emailInvalid': 'Email không hợp lệ',
    'validation.emailRequired': 'Email không được để trống',
    'validation.passwordRequired': 'Mật khẩu không được để trống',
  }
  return messages[key] || key
})

export const registerSchema = createRegisterSchema((key) => {
  const messages: Record<string, string> = {
    'validation.fullNameRequired': 'Tên không được để trống',
    'validation.emailInvalid': 'Email không hợp lệ',
    'validation.emailRequired': 'Email không được để trống',
    'validation.passwordRequired': 'Mật khẩu không được để trống',
    'validation.passwordMismatch': 'Mật khẩu không khớp',
  }
  return messages[key] || key
})

export const profileSchema = createProfileSchema((key) => {
  const messages: Record<string, string> = {
    'validation.phoneRequired': 'Số điện thoại không được để trống',
    'validation.phoneInvalid': 'Số điện thoại không hợp lệ',
    'validation.citizenIdRequired': 'CCCD/CMND không được để trống',
    'validation.citizenIdInvalid': 'CCCD/CMND không hợp lệ',
    'validation.personalEmailRequired': 'Email cá nhân không được để trống',
    'validation.personalEmailInvalid': 'Email không hợp lệ',
  }
  return messages[key] || key
})

export const projectSchema = createProjectSchema((key) => {
  const messages: Record<string, string> = {
    'validation.nameRequired': 'Tên dự án không được để trống',
    'validation.membersRequired': 'Cần chọn ít nhất một thành viên',
  }
  return messages[key] || key
})

export const changePasswordSchema = createChangePasswordSchema((key) => {
  const messages: Record<string, string> = {
    'validation.oldPasswordRequired': 'Mật khẩu hiện tại không được để trống',
    'validation.newPasswordRequired': 'Mật khẩu mới không được để trống',
  }
  return messages[key] || key
})

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ProfileFormData = z.infer<typeof profileSchema>
export type ProjectFormData = z.infer<typeof projectSchema>
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>