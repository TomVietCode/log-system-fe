"use client"

import { useState } from "react"
import { userApi } from "@/lib/api/user-api"
import { 
  Container, 
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Box,
  CircularProgress
} from "@mui/material"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Toast from "@/components/ui/alert"
import Link from "next/link"
import { useAccountTranslations } from "@/lib/hook/useTranslations"
import { inputStyle } from "@/styles/common"

export default function CreateAccountPage() {
  const t = useAccountTranslations()

  const createUserSchema = z.object({
    fullName: z.string().min(1, t("validate.fullNameRequired")),
    email: z.string().email(t("validate.emailInvalid")).min(1, t("validate.emailRequired")),
    phone: z.string().min(9, t("validate.phoneInvalid")),
    citizenID: z.string().min(1, t("validate.citizenIdRequired")),
    role: z.enum(["ADMIN", "LEADER", "HCNS", "DEV"]),
    password: z.string().min(1, t("validate.passwordRequired"))
  })
  
  type CreateUserFormData = z.infer<typeof createUserSchema>
  
  const [loading, setLoading] = useState(false)
  
  const { 
    control, 
    handleSubmit,
    reset,
    formState: { errors } 
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      role: "DEV",
      password: ""
    }
  })
  
  const onSubmit = async (data: CreateUserFormData) => {
    try {
      setLoading(true)
      await userApi.createUser(data)
      Toast.success(t("messages.createSuccess"))
      reset({
        fullName: "",
        email: "",
        phone: "",
        citizenID: "",
        role: "DEV",
        password: ""
      })
    } catch (error: any) {
      Toast.error(t("messages.createError"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container sx={{ backgroundColor: "background.paper", p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>{t("actions.createAccount")}</Typography>
      
      <Paper sx={{ p: 3, mt: 2 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={
                      <span>
                        {t("form.fullName")}
                        <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                    fullWidth
                    error={!!errors.fullName}
                    helperText={errors.fullName?.message}
                    sx={inputStyle}
                  />
                )}
              />
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={
                      <span>
                        {t("form.email")}
                        <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    sx={inputStyle}
                  />
                )}
              />
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={
                      <span>
                        {t("form.phone")}
                        <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                    fullWidth
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    sx={inputStyle}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="citizenID"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={
                      <span>
                        {t("form.citizenId")}
                        <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                    fullWidth
                    error={!!errors.citizenID}
                    helperText={errors.citizenID?.message}
                    sx={inputStyle}
                  />
                )}
              />
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.role}>
                    <InputLabel>{t("form.role")}</InputLabel>
                    <Select {...field} label={t("form.role")}>
                      <MenuItem value="DEV">DEV</MenuItem>
                      <MenuItem value="LEADER">LEADER</MenuItem>
                      <MenuItem value="HCNS">HCNS</MenuItem>
                      <MenuItem value="ADMIN">ADMIN</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={
                      <span>
                        {t("form.password")}
                        <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                    type="password"
                    fullWidth
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    sx={inputStyle}
                  />
                )}
              />
            </Grid>
            
            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Link href="/accounts">
                  <Button variant="outlined">{t("actions.cancel")}</Button>
                </Link>
                <Button 
                  type="submit" 
                  variant="contained" 
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : t("actions.createAccount")}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  )
}