"use client"

import Toast from "@/components/ui/alert"
import { useAuth } from "@/context/auth.context"
import { RegisterDto } from "@/interface/auth"
import { useAuthTranslations } from "@/lib/hook/useTranslations"
import { inputStyle } from "@/styles/common"
import { zodResolver } from "@hookform/resolvers/zod"
import { Box, CircularProgress, Button, TextField, Typography, Link } from "@mui/material"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useValidationSchemas } from "@/lib/hook/useValidation"

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const { register: signUp } = useAuth()
  const { registerSchema } = useValidationSchemas()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterDto>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterDto) => {
    try {
      const { confirmPassword, ...rest } = data
      setLoading(true)
      await signUp(rest)
      setLoading(false)
      Toast.success(t("register.success"))
      router.push("/profile")
    } catch (error: any) {
      Toast.error(error.response.data.message)
    } finally {
      setLoading(false)
    }
  }
  const t = useAuthTranslations()
  
  
  return (
    <>
      <Box className="text-center mb-8">
        <Typography variant="h4" component="h1">
          {t("register.title")}
        </Typography>
        <Typography variant="body1">{t("register.subtitle")}</Typography>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            {...register("fullName")}
            label={t("register.fullName")}
            type="text"
            placeholder={t("register.placeholder.fullName")}
            fullWidth
            error={!!errors.fullName}
            helperText={errors.fullName?.message || " "}
            sx={inputStyle}
          />

          <TextField
            {...register("email")}
            label={t("register.email")}
            type="text"
            placeholder={t("login.placeholder.email")}
            fullWidth
            error={!!errors.email}
            helperText={errors.email?.message || " "}
            sx={inputStyle}
          />

          <TextField
            {...register("password")}
            label={t("login.password")}
            type="password"
            error={!!errors.password}
            helperText={errors.password?.message || " "}
            fullWidth
            sx={inputStyle}
          />

          <TextField
            {...register("confirmPassword")}
            label={t("register.confirmPassword")}
            type="password"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message || " "}
            fullWidth
            sx={inputStyle}
          />

          <Button type="submit" variant="contained" fullWidth size="large" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : t("register.button")}
          </Button>
          <Box textAlign="center" mt={2}>
            <Typography variant="body2">
              {t("register.haveAccount")}
              <Link href="/login">
                <Typography component="span" sx={{ marginLeft: 1 }}>{t("register.loginLink")}</Typography>
              </Link>
            </Typography>
          </Box>
        </Box>
      </form>
    </>
  )
}
