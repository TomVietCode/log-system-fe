"use client"

import { Alert, Avatar, Box, Button, CircularProgress, Collapse, Container, FormHelperText, Grid, OutlinedInput, Typography } from "@mui/material"
import React, { useState } from "react"
import { useAuth } from "@/context/auth.context"
import { ProfileFormData, profileSchema } from "@/lib/validation"
import { authAPI } from "@/lib/auth-api"

export default function ProfilePage() {
  const { user } = useAuth()
  const [form, setForm] = useState<any>(user)
  const [errors, setErrors] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [backendError, setBackendError] = useState<string>('')

  const validate = () => {
    const newErrors: any = {}
    if (!form.phone) newErrors.phone = "Số điện thoại là bắt buộc"
    if (!form.citizenID) newErrors.citizenID = "CCCD/CMND là bắt buộc"
    if (!form.personalEmail) newErrors.personalEmail = "Email cá nhân là bắt buộc"

    return newErrors
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newErrors = validate()
    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) {
      setLoading(true)
      try {
        const validatedForm = profileSchema.parse(form)
        setBackendError('')
        await authAPI.updateProfile(validatedForm)
      } catch (error: any) {
        setBackendError(error.response?.data?.message || 'Có lỗi xảy ra')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <>
      {backendError && (
        <Collapse in={!!backendError} timeout={3000}>
          <Box position="fixed" top={24} right={24} zIndex={1300} minWidth={300}>
            <Alert
              severity="error"
              onClose={() => setBackendError("")}
              sx={{
                boxShadow: 3,
                borderRadius: 2,
              }}
            >
              {backendError}
            </Alert>
          </Box>
        </Collapse>
      )}
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
                  Mã nhân viên:
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
                  Số điện thoại: <span className="text-red-500"> *</span>
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
                  Họ và tên:
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
                  CCCD/CMND: <span className="text-red-500"> *</span>
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
                  Ngày sinh:
                </Typography>
                <OutlinedInput
                  name="dob"
                  value={form.dob || ""}
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
                  Email cá nhân: <span className="text-red-500"> *</span>
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
                  Số tài khoản TCB:
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
                  Biển số xe:
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
                  Email:
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

            <Grid size={{ xs: 12, md: 12 }} className="flex justify-center">
              <Button type="submit" variant="contained" sx={{ borderRadius: 10 }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : "Cập nhật"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </>
  )
}
