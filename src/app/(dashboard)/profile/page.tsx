"use client"

import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  OutlinedInput,
  Typography,
} from "@mui/material"
import React, { useEffect, useState } from "react"
import { useAuth } from "@/context/auth.context"
import { profileSchema } from "@/lib/validation"
import { authAPI } from "@/lib/api/auth-api"
import Toast from "@/components/ui/alert"
import { useUserTranslations } from "@/lib/hook/useTranslations"

export default function ProfilePage() {
  const t = useUserTranslations()
  const { user } = useAuth()
  const [form, setForm] = useState<any>(user)
  const [errors, setErrors] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [backendError, setBackendError] = useState<string>("")
  const [showChangePassword, setShowChangePassword] = useState<boolean>(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordErrors, setPasswordErrors] = useState<any>({})
  const [passwordLoading, setPasswordLoading] = useState<boolean>(false)

  useEffect(() => {
    if (backendError) {
      Toast.error(backendError);
      // Clear error sau khi hiển thị
      setBackendError("");
    }
  }, [backendError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(form)
    setLoading(true)
    try {
      const { data, success, error } = profileSchema.safeParse(form)
      if (!success) {
        const newErrors: any = {}
        error.errors.map((err: any) => {
          newErrors[err.path[0]] = err.message
        }) || "Có lỗi xảy ra"
        setErrors(newErrors)
        setLoading(false)
        return
      }

      setBackendError("")
      await authAPI.updateProfile(data)
      Toast.success(t("messages.updateSuccess"))
    } catch (error: any) {
      setBackendError(error.response?.data?.message || t("messages.updateError"))
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPasswordLoading(true)
    
    // Reset errors
    setPasswordErrors({})
    
    // Validate passwords
    const newErrors: any = {}
    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = "Mật khẩu hiện tại là bắt buộc"
    }
    if (!passwordForm.newPassword) {
      newErrors.newPassword = "Mật khẩu mới là bắt buộc"
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp"
    }
    
    if (Object.keys(newErrors).length > 0) {
      setPasswordErrors(newErrors)
      setPasswordLoading(false)
      return
    }
    
    try {
      await authAPI.changePassword({
        oldPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      })
      Toast.success("Đổi mật khẩu thành công")
      setShowChangePassword(false)
      // Reset form
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error: any) {
      setBackendError(error.response?.data?.message || "Có lỗi xảy ra khi đổi mật khẩu")
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <>
      <Container
        className="flex flex-col justify-center items-center gap-8"
        sx={{ backgroundColor: "background.paper", p: 3, borderRadius: 2 }}
      >
        <Box className="mb-2">
          <Avatar sx={{ width: 120, height: 120 }} />
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid
            container
            rowSpacing={3}
            columnSpacing={10}
            columns={{ xs: 12, md: 12 }}
            paddingX={10}
          >
            {/* Employee Code */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <Typography fontWeight={500} mb={0.5}>
                  {t("fields.employeeCode")}:
                </Typography>
                <OutlinedInput
                  name="employeeCode"
                  value={form.employeeCode || ""}
                  fullWidth
                  sx={{ height: "40px" }}
                  disabled
                />
              </Box>
            </Grid>

            {/* Phone Number */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <Typography fontWeight={500} mb={0.5}>
                  {t("fields.phone")}: <span className="text-red-500"> *</span>
                </Typography>
                <OutlinedInput
                  name="phone"
                  value={form.phone || ""}
                  onChange={handleChange}
                  fullWidth
                  sx={{ height: "40px" }}
                  error={!!errors.phone}
                />
                {errors.phone && <FormHelperText error>{errors.phone}</FormHelperText>}
              </Box>
            </Grid>

            {/* Full Name */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <Typography fontWeight={500} mb={0.5}>
                  {t("fields.fullName")}:
                </Typography>
                <OutlinedInput
                  placeholder="Eg: Nguyễn Văn A"
                  name="fullName"
                  value={form.fullName || ""}
                  onChange={handleChange}
                  fullWidth
                  sx={{ height: "40px" }}
                  disabled
                />
              </Box>
            </Grid>

            {/* Citizen ID */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <Typography fontWeight={500} mb={0.5}>
                  {t("fields.citizenId")}: <span className="text-red-500"> *</span>
                </Typography>
                <OutlinedInput
                  name="citizenID"
                  value={form.citizenID || ""}
                  onChange={handleChange}
                  fullWidth
                  sx={{ height: "40px" }}
                  error={!!errors.citizenID}
                />
                {errors.citizenID && <FormHelperText error>{errors.citizenID}</FormHelperText>}
              </Box>
            </Grid>

            {/* Date of birth */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <Typography fontWeight={500} mb={0.5}>
                  {t("fields.dob")}:
                </Typography>
                <OutlinedInput
                  name="dob"
                  value={form.dob?.split("T")[0] || ""}
                  onChange={handleChange}
                  fullWidth
                  sx={{ height: "40px" }}
                  type="date"
                />
              </Box>
            </Grid>

            {/* Personal Email */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <Typography fontWeight={500} mb={0.5}>
                  {t("fields.personalEmail")}: <span className="text-red-500"> *</span>
                </Typography>
                <OutlinedInput
                  name="personalEmail"
                  value={form.personalEmail || ""}
                  onChange={handleChange}
                  fullWidth
                  sx={{ height: "40px" }}
                  error={!!errors.personalEmail}
                />
                {errors.personalEmail && (
                  <FormHelperText error>{errors.personalEmail}</FormHelperText>
                )}
              </Box>
            </Grid>

            {/* Account Number */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <Typography fontWeight={500} mb={0.5}>
                  {t("fields.accountNumber")}:
                </Typography>
                <OutlinedInput
                  name="accountNumber"
                  value={form.accountNumber || ""}
                  onChange={handleChange}
                  fullWidth
                  sx={{ height: "40px" }}
                />
              </Box>
            </Grid>

            {/* License Plate */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <Typography fontWeight={500} mb={0.5}>
                  {t("fields.licensePlate")}:
                </Typography>
                <OutlinedInput
                  name="licensePlate"
                  value={form.licensePlate || ""}
                  onChange={handleChange}
                  fullWidth
                  sx={{ height: "40px" }}
                />
              </Box>
            </Grid>

            {/* Email */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <Typography fontWeight={500} mb={0.5}>
                  {t("fields.email")}:
                </Typography>
                <OutlinedInput
                  name="email"
                  value={form.email || ""}
                  onChange={handleChange}
                  fullWidth
                  sx={{ height: "40px" }}
                  disabled
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 12 }} className="flex justify-center gap-4">
              <Button variant="outlined" sx={{ borderRadius: 10 }} onClick={() => {
                setShowChangePassword(true)
              }}>
                {t("profile.changePassword")}
              </Button>
              <Button type="submit" variant="contained" sx={{ borderRadius: 10 }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : t("actions.update")}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>

      {/* Change Password Dialog */}
      <Dialog open={showChangePassword} onClose={() => setShowChangePassword(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t("profile.changePassword")}</DialogTitle>
        <form onSubmit={handleChangePassword}>
          <DialogContent>
            <Box mb={2}>
              <Typography fontWeight={500} mb={0.5}>
                {t("password.current")}: <span className="text-red-500">*</span>
              </Typography>
              <OutlinedInput
                name="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                fullWidth
                sx={{ height: "40px" }}
                error={!!passwordErrors.currentPassword}
              />
              {passwordErrors.currentPassword && (
                <FormHelperText error>{passwordErrors.currentPassword}</FormHelperText>
              )}
            </Box>
            
            <Box mb={2}>
              <Typography fontWeight={500} mb={0.5}>
                {t("password.new")}: <span className="text-red-500">*</span>
              </Typography>
              <OutlinedInput
                name="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                fullWidth
                sx={{ height: "40px" }}
                error={!!passwordErrors.newPassword}
              />
              {passwordErrors.newPassword && (
                <FormHelperText error>{passwordErrors.newPassword}</FormHelperText>
              )}
            </Box>
            
            <Box mb={2}>
              <Typography fontWeight={500} mb={0.5}>
                {t("password.confirm")}: <span className="text-red-500">*</span>
              </Typography>
              <OutlinedInput
                name="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                fullWidth
                sx={{ height: "40px" }}
                error={!!passwordErrors.confirmPassword}
              />
              {passwordErrors.confirmPassword && (
                <FormHelperText error>{passwordErrors.confirmPassword}</FormHelperText>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowChangePassword(false)}>{t("actions.cancel")}</Button>
            <Button type="submit" variant="contained" disabled={passwordLoading}>
              {passwordLoading ? <CircularProgress size={24} color="inherit" /> : t("actions.confirm")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
