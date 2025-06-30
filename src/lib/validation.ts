import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ").min(1, "Email không được để trống"),
  password: z.string().min(1, "Mật khẩu không được để trống"),
})

export const registerSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  email: z.string().email("Email không hợp lệ").min(1, "Email không được để trống"),
  password: z.string().min(1, "Mật khẩu không được để trống"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu không khớp",
  path: ["confirmPassword"],
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>