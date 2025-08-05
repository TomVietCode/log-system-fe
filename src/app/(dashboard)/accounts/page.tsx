"use client"
import Toast from "@/components/ui/alert"
import { useAuth } from "@/context/auth.context"
import { User } from "@/interface/auth"
import { devLogApi } from "@/lib/api/devlog-api"
import { userApi } from "@/lib/api/user-api"
import { Cancel, Download, Edit, Save, Search } from "@mui/icons-material"
import {
  Box,
  Container,
  TableContainer,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Checkbox,
  TextField,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  CircularProgress,
  InputAdornment,
  Grid,
  Divider,
} from "@mui/material"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function AccountsPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({})
  const [editData, setEditData] = useState<{ [key: string]: any }>({})
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("ALL")

  const isAdmin = user?.role === "ADMIN"

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await userApi.getListUser()
      const filteredUsers = response.data.filter((item: User) => item.id !== user?.id)
      setUsers(filteredUsers)
      setFilteredUsers(filteredUsers)
      setLoading(false)
    } catch (error: any) {
      Toast.error(error.response?.data?.message || "Không thể lấy dữ liệu")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    // Apply filters whenever search term or role filter changes
    let result = users

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      result = result.filter(
        (user) =>
          user.fullName?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          user.employeeCode?.toLowerCase().includes(searchLower)
      )
    }

    // Apply role filter
    if (roleFilter !== "ALL") {
      result = result.filter((user) => user.role === roleFilter)
    }

    setFilteredUsers(result)
  }, [searchTerm, roleFilter, users])

  const handleEdit = (userId: string) => {
    setEditMode({ ...editMode, [userId]: true })
    setEditData({ ...editData, [userId]: users.find((u) => u.id === userId) })
  }

  const handleInputChange = (userId: string, field: string, value: any) => {
    setEditData({
      ...editData,
      [userId]: {
        ...editData[userId],
        [field]: value,
      },
    })
  }

  const handleCancel = (userId: string) => {
    setEditMode({ ...editMode, [userId]: false })
    delete editData[userId]
  }

  const handleSave = async (userId: string) => {
    try {
      setLoading(true)
      const updateData: any = {
        email: editData[userId].email,
        role: editData[userId].role,
      }

      // Only include password if it was changed and not empty
      if (editData[userId].password) {
        updateData.password = editData[userId].password
      }

      const response = await userApi.updateUser(userId, updateData)

      setUsers(users.map((u) => (u.id === userId ? response.data : u)))
      setEditMode({ ...editMode, [userId]: false })
      delete editData[userId]
      Toast.success("Cập nhật thành công")
    } catch (error: any) {
      Toast.error(error.response?.data?.message || "Không thể lưu dữ liệu")
    } finally {
      setLoading(false)
    }
  }

  function handleSelectUser(id: string): void {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((u) => u !== id))
    } else {
      setSelectedUsers([...selectedUsers, id])
    }
  }

  async function handleExport() {
    try {
      await devLogApi.exportDevLogs(selectedUsers)
      Toast.success("Xuất file thành công")
    } catch (error: any) {
      Toast.error(error.response?.data?.message || "Không thể xuất file")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container sx={{ backgroundColor: "background.paper", p: 3, borderRadius: 2 }}>
      <Box className="flex justify-center mb-4">
        <Typography variant="h6">DANH SÁCH NHÂN VIÊN</Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid sx={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            size="small"
          />
        </Grid>
        <Grid sx={{ xs: 12, md: 6 }}>
          <FormControl fullWidth size="small">
            <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} displayEmpty>
              <MenuItem value="ALL">Tất cả vai trò</MenuItem>
              <MenuItem value="DEV">Developer</MenuItem>
              <MenuItem value="LEADER">Leader</MenuItem>
              <MenuItem value="HCNS">HCNS</MenuItem>
              <MenuItem value="ADMIN">Admin</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {selectedUsers.length > 0 && (
          <Grid sx={{ xs: 12, md: 6, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Download />}
              onClick={() => handleExport()}
              disabled={loading}
            >
              Xuất file
            </Button>
          </Grid>
        )}
        {isAdmin && (
          <Grid sx={{ xs: 12, md: 6, display: "flex", justifyContent: "flex-end" }}>
            <Link href="/accounts/create">
              <Button variant="contained" color="primary">
                Tạo tài khoản
              </Button>
            </Link>
          </Grid>
        )}
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedUsers(
                        filteredUsers.map((u) => {
                          if (u.role === "ADMIN" || u.role === "HCNS") {
                            return ""
                          }
                          return u.id
                        })
                      )
                    } else {
                      setSelectedUsers([])
                    }
                  }}
                  indeterminate={
                    selectedUsers.length > 0 && selectedUsers.length < filteredUsers.length
                  }
                  checked={
                    filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length
                  }
                />
              </TableCell>
              <TableCell>
                <strong>MÃ NV</strong>
              </TableCell>
              <TableCell>
                <strong>HỌ TÊN</strong>
              </TableCell>
              <TableCell>
                <strong>EMAIL</strong>
              </TableCell>
              <TableCell>
                <strong>MẬT KHẨU</strong>
              </TableCell>
              <TableCell>
                <strong>VAI TRÒ</strong>
              </TableCell>
              {isAdmin && (
                <TableCell>
                  <strong>HÀNH ĐỘNG</strong>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                    <CircularProgress />
                  </Box>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1">Không tìm thấy nhân viên nào</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      disabled={user.role === "ADMIN" || user.role === "HCNS"}
                    />
                  </TableCell>{" "}
                  <TableCell>{user.employeeCode}</TableCell>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>
                    {editMode[user.id] ? (
                      <TextField
                        value={editData[user.id]?.email || ""}
                        onChange={(e) => handleInputChange(user.id, "email", e.target.value)}
                        size="small"
                        sx={{ maxWidth: 150 }}
                      />
                    ) : (
                      user.email
                    )}
                  </TableCell>
                  <TableCell>
                    {editMode[user.id] ? (
                      <TextField
                        onChange={(e) => handleInputChange(user.id, "password", e.target.value)}
                        size="small"
                        sx={{ maxWidth: 150 }}
                        type="password"
                        placeholder="Mật khẩu mới"
                      />
                    ) : (
                      "********"
                    )}
                  </TableCell>
                  <TableCell>
                    {editMode[user.id] ? (
                      <FormControl fullWidth size="small">
                        <Select
                          value={editData[user.id]?.role || ""}
                          onChange={(e) => handleInputChange(user.id, "role", e.target.value)}
                          disabled={!isAdmin}
                        >
                          <MenuItem value="DEV">Developer</MenuItem>
                          <MenuItem value="LEADER">Leader</MenuItem>
                          <MenuItem value="HCNS">HCNS</MenuItem>
                          <MenuItem value="ADMIN">Admin</MenuItem>
                        </Select>
                      </FormControl>
                    ) : (
                      user.role
                    )}
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      {editMode[user.id] ? (
                        <Box className="flex gap-2">
                          {loading ? (
                            <CircularProgress size={20} />
                          ) : (
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleSave(user.id)}
                              size="small"
                            >
                              Lưu
                            </Button>
                          )}
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleCancel(user.id)}
                            size="small"
                          >
                            Hủy
                          </Button>
                        </Box>
                      ) : (
                        <Box>
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => handleEdit(user.id)}
                            size="small"
                          >
                            Sửa
                          </Button>
                        </Box>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
}
