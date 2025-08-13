"use client"

import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material"
import React, { useState } from "react"
import { useAuth } from "@/context/auth.context"
import { authAPI } from "@/lib/api/auth-api"
import Toast from "@/components/ui/alert"
import { useUserTranslations } from "@/lib/hook/useTranslations"
import { useValidationSchemas } from "@/lib/hook/useValidation"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChangePasswordFormData, ProfileFormData } from "@/lib/validation"
import { profileInputStyle } from "@/styles/common"
import dayjs from "dayjs"

export default function ProfilePage() {
  const t = useUserTranslations()
  const { profileSchema, changePasswordSchema } = useValidationSchemas()
  const { user: userData } = useAuth()
  const [user, setUser] = useState<any>(userData)
  const [loading, setLoading] = useState<boolean>(false)
  const [showChangePassword, setShowChangePassword] = useState<boolean>(false)
  const [passwordLoading, setPasswordLoading] = useState<boolean>(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      phone: user?.phone ?? '',
      citizenID: user?.citizenID ?? '',
      personalEmail: user?.personalEmail ?? '',
      dob: dayjs(user?.dob).format("YYYY-MM-DD") ?? '',                
      accountNumber: user?.accountNumber ?? '',
      licensePlate: user?.licensePlate ?? '',
    },
  })

  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors }
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: ''
    }
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    setLoading(true)
    try {
      await authAPI.updateProfile(data)
      Toast.success(t("messages.updateSuccess"))
      setUser({ ...user, ...data })
      console.log(data)
    } catch (error: any) {
      Toast.error(error.response?.data?.message || t("messages.updateError"))
    } finally {
      setLoading(false)
    }
  }

  const onPasswordSubmit = async (data: ChangePasswordFormData) => {
    try {
      setPasswordLoading(true)
      await authAPI.changePassword(data)
      Toast.success(t("messages.passwordChangeSuccess"))
      setShowChangePassword(false)
      resetPasswordForm()
    } catch (error: any) {
      Toast.error(error.response?.data?.message || t("messages.passwordChangeError"))
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

        <form onSubmit={handleSubmit(onProfileSubmit)}>
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
                <TextField
                  fullWidth
                  value={user?.employeeCode || ""}
                  sx={profileInputStyle}
                  disabled
                  helperText=" "
                />
              </Box>
            </Grid>

            {/* Phone Number */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <Typography fontWeight={500} mb={0.5}>
                  {t("fields.phone")}: <span className="text-red-500"> *</span>
                </Typography>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      sx={profileInputStyle}
                      error={!!errors.phone}
                      helperText={errors.phone?.message ? String(errors.phone.message) : " "}
                    />
                  )}
                />
              </Box>
            </Grid>

            {/* Full Name */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <Typography fontWeight={500} mb={0.5}>
                  {t("fields.fullName")}:
                </Typography>
                <TextField
                  fullWidth
                  value={user?.fullName || ""}
                  sx={profileInputStyle}
                  disabled
                  helperText=" "
                />
              </Box>
            </Grid>

            {/* Citizen ID */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <Typography fontWeight={500} mb={0.5}>
                  {t("fields.citizenId")}: <span className="text-red-500"> *</span>
                </Typography>
                <Controller
                  name="citizenID"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      sx={profileInputStyle}
                      error={!!errors.citizenID}
                      helperText={
                        errors.citizenID?.message ? String(errors.citizenID.message) : " "
                      }
                    />
                  )}
                />
              </Box>
            </Grid>

            {/* Date of birth */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <Typography fontWeight={500} mb={0.5}>
                  {t("fields.dob")}:
                </Typography>
                <Controller
                  name="dob"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="date"
                      fullWidth
                      sx={profileInputStyle}
                      error={!!errors.dob}
                      helperText={errors.dob?.message ? String(errors.dob.message) : " "}
                    />
                  )}
                />
              </Box>
            </Grid>

            {/* Personal Email */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <Typography fontWeight={500} mb={0.5}>
                  {t("fields.personalEmail")}: <span className="text-red-500"> *</span>
                </Typography>
                <Controller
                  name="personalEmail"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      sx={profileInputStyle}
                      error={!!errors.personalEmail}
                      helperText={
                        errors.personalEmail?.message ? String(errors.personalEmail.message) : " "
                      }
                    />
                  )}
                />
              </Box>
            </Grid>

            {/* Account Number */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <Typography fontWeight={500} mb={0.5}>
                  {t("fields.accountNumber")}:
                </Typography>
                <Controller
                  name="accountNumber"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      sx={profileInputStyle}
                      error={!!errors.accountNumber}
                      helperText={errors.accountNumber?.message ? String(errors.accountNumber.message) : " "}
                    />
                  )}
                />
              </Box>
            </Grid>

            {/* License Plate */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <Typography fontWeight={500} mb={0.5}>
                  {t("fields.licensePlate")}:
                </Typography>
                <Controller
                  name="licensePlate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      sx={profileInputStyle}
                      error={!!errors.licensePlate}
                      helperText={errors.licensePlate?.message ? String(errors.licensePlate.message) : " "}
                    />
                  )}
                />
              </Box>
            </Grid>

            {/* Email */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <Typography fontWeight={500} mb={0.5}>
                  {t("fields.email")}:
                </Typography>
                <TextField
                  fullWidth
                  value={user?.email || ""}
                  sx={profileInputStyle}
                  disabled
                  helperText=" "
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 12 }} className="flex justify-center gap-4">
              <Button
                variant="outlined"
                sx={{ borderRadius: 10 }}
                onClick={() => {
                  setShowChangePassword(true)
                }}
              >
                {t("profile.changePassword")}
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{ borderRadius: 10 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : t("actions.update")}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>

      {/* Change Password Dialog */}
      <Dialog 
        open={showChangePassword} 
        onClose={() => setShowChangePassword(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>{t("profile.changePassword")}</DialogTitle>
        <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
          <DialogContent>
            <Box mb={2}>
              <Typography fontWeight={500} mb={0.5}>
                {t("password.current")}: <span className="text-red-500">*</span>
              </Typography>
              <Controller
                name="oldPassword"
                control={passwordControl}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="password"
                    fullWidth
                    sx={profileInputStyle}
                    error={!!passwordErrors.oldPassword}
                    helperText={passwordErrors.oldPassword?.message || " "}
                  />
                )}
              />
            </Box>
            
            <Box mb={2}>
              <Typography fontWeight={500} mb={0.5}>
                {t("password.new")}: <span className="text-red-500">*</span>
              </Typography>
              <Controller
                name="newPassword"
                control={passwordControl}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="password"
                    fullWidth
                    sx={profileInputStyle}
                    error={!!passwordErrors.newPassword}
                    helperText={passwordErrors.newPassword?.message || " "}
                  />
                )}
              />
            </Box>
          </DialogContent>
          
          <DialogActions>
            <Button onClick={() => setShowChangePassword(false)}>
              {t("actions.cancel")}
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={passwordLoading}
            >
              {passwordLoading ? 
                <CircularProgress size={24} color="inherit" /> : 
                t("actions.confirm")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
