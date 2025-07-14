import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ").min(1, "Email không được để trống"),
  password: z.string().min(1, "Mật khẩu không được để trống"),
})

export const registerSchema = z
  .object({
    fullName: z.string().min(1, "Tên không được để trống"),
    email: z.string().email("Email không hợp lệ").min(1, "Email không được để trống"),
    password: z.string().min(1, "Mật khẩu không được để trống"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  })

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>

export const profileSchema = z.object({
  phone: z
    .string()
    .min(1, "Số điện thoại không được để trống")
    .regex(/^[0-9]+$/, "Số điện thoại không hợp lệ"),
  citizenID: z
    .string()
    .min(1, "CCCD/CMND không được để trống")
    .regex(/^[0-9]+$/, "CCCD/CMND không hợp lệ"),
  personalEmail: z.string().email("Email không hợp lệ").min(1, "Email cá nhân không được để trống"),
  dob: z.string().nullable().optional(),
  accountNumber: z.string().nullable().optional(),
  licensePlate: z.string().nullable().optional(),
})

export type ProfileFormData = z.infer<typeof profileSchema>

export const projectSchema = z.object({
  name: z.string().min(1, "Tên dự án không được để trống"),
  description: z.string().nullable().optional(),
  memberIds: z.array(z.string()).min(1, "Cần chọn ít nhất một thành viên"),
  tasks: z.array(z.object({ id: z.string().nullable().optional(), name: z.string() })).optional(),
})

export type ProjectFormData = z.infer<typeof projectSchema>
