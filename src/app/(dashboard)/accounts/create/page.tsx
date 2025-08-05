// nextjs/log-sys-fe/src/app/(dashboard)/accounts/create/page.tsx
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

const createUserSchema = z.object({
  fullName: z.string().min(1, "Họ tên là bắt buộc"),
  email: z.string().email("Email không hợp lệ").min(1, "Email là bắt buộc"),
  phone: z.string().min(9, "Số điện thoại không hợp lệ"),
  citizenID: z.string().min(1, "CMND/CCCD là bắt buộc"),
  role: z.enum(["ADMIN", "LEADER", "HCNS", "DEV"]),
  password: z.string().min(1, "Mật khẩu không được để trống")
})

type CreateUserFormData = z.infer<typeof createUserSchema>

export default function CreateAccountPage() {
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
      Toast.success("Tạo tài khoản thành công")
      reset({
        fullName: "",
        email: "",
        phone: "",
        citizenID: "",
        role: "DEV",
        password: ""
      })
    } catch (error: any) {
      Toast.error(error.response?.data?.message || "Không thể tạo tài khoản")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container sx={{ backgroundColor: "background.paper", p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>Tạo tài khoản mới</Typography>
      
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
                        Họ tên 
                        <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                    fullWidth
                    error={!!errors.fullName}
                    helperText={errors.fullName?.message}
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
                        Email công ty
                        <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
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
                        Số điện thoại
                        <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                    fullWidth
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
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
                        CCCD/CMND 
                        <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                    fullWidth
                    error={!!errors.citizenID}
                    helperText={errors.citizenID?.message}
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
                    <InputLabel>Chức vụ</InputLabel>
                    <Select {...field} label="Chức vụ">
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
                        Mật khẩu
                        <span style={{ color: 'red' }}> *</span>
                      </span>
                    }
                    type="password"
                    fullWidth
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Link href="/accounts">
                  <Button variant="outlined">Hủy</Button>
                </Link>
                <Button 
                  type="submit" 
                  variant="contained" 
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : "Tạo tài khoản"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  )
}