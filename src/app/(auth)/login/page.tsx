'use client'

import Toast from "@/components/ui/alert"
import { useAuth } from "@/context/auth.context"
import { useAuthTranslations } from "@/lib/hook/useTranslations"
import { useValidationSchemas } from "@/lib/hook/useValidation"
import { LoginFormData } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Box, Button, Card, CardContent, CircularProgress, Container, TextField, Typography } from "@mui/material"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Translation hooks
  const t = useAuthTranslations()
  const { loginSchema } = useValidationSchemas() 

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true)

      const user = await login(data)
      Toast.success(t("messages.loginSuccess"))
      if(user.role === "ADMIN" || user.role === "HCNS") {
        router.push("/")
      } else {
        router.push("/dashboard")
      }
    } catch (error: any) {
      Toast.error(error.response?.data?.message || t("messages.loginError"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box position="relative" minHeight="100vh">
      <Container maxWidth="sm">
        <Box className="flex min-h-screen items-center justify-center">
          <Card className="w-full">
            <CardContent className="p-8 bg-gray-50">
              <Box className="text-center mb-8">
                <Typography variant="h4" component="h1">
                  {t("login.title")}
                </Typography>
                <Typography variant="body1">
                  {t("login.subtitle")}
                </Typography>
              </Box>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Box display="flex" flexDirection="column" gap={2}>
                  <TextField
                    {...register('email')}
                    label={t("login.email")}
                    type="email"
                    placeholder={t("login.placeholder.email")}
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  /> 

                  <TextField
                    {...register("password")}
                    label={t("login.password")}
                    type="password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    fullWidth
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularProgress size={24}/>
                    ) : (
                      t("login.button")
                    )}
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  )
}