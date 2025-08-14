"use client"
import Toast from "@/components/ui/alert"
import { useAuth } from "@/context/auth.context"
import { User, UpdateUserAdminDto } from "@/interface/auth"
import { devLogApi } from "@/lib/api/devlog-api"
import { userApi } from "@/lib/api/user-api"
import { Download } from "@mui/icons-material"
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
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  InputAdornment,
  Grid,
  Divider,
  SelectChangeEvent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
  Tooltip,
} from "@mui/material"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useAccountTranslations } from "@/lib/hook/useTranslations"

export default function AccountsPage() {
  const t = useAccountTranslations()
  const { user } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [editData, setEditData] = useState<UpdateUserAdminDto>({ email: "", role: "DEV" })
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("ALL")
  const isAdmin = user?.role === "ADMIN"

  const fetchUsers = async (args?: { p?: number; l?: number; q?: string; role?: string }) => {
    try {
      setLoading(true)
      const currentPage = args?.p ?? page + 1
      const limit = args?.l ?? rowsPerPage
      const q = args?.q ?? searchTerm
      const role = args?.role ?? (roleFilter === "ALL" ? "all" : roleFilter)
      const response = await userApi.getListUser({ page: currentPage, limit, q, role })
      const { users: list, total } = response.data
      setUsers(list)
      setTotal(total)
    } catch (error: any) {
      const errorMessage = error.response?.data?.message
      Toast.error(t(`errors.${errorMessage}`, { defaultValue: errorMessage }))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleEdit = (userId: string) => {
    const userToEdit = users.find((u) => u.id === userId) || null
    setCurrentUser(userToEdit)
    if (userToEdit) {
      setEditData({
        email: userToEdit.email,
        role: userToEdit.role,
        password: "",
      })
    }
    setEditDialogOpen(true)
  }

  const handleInputChange = (field: string, value: any) => {
    setEditData({
      ...editData,
      [field]: value,
    })
  }

  const handleCancel = () => {
    setEditDialogOpen(false)
    setCurrentUser(null)
    setEditData({ email: "", role: "DEV" })
  }

  const handleSave = async () => {
    if (!currentUser?.id) return

    try {
      setLoading(true)
      const updateData: any = {
        email: editData.email,
        role: editData.role,
      }

      // Only include password if it was changed and not empty
      if (editData.password) {
        updateData.password = editData.password
      }

      const response = await userApi.updateUser(currentUser.id, updateData)

      setUsers(users.map((u) => (u.id === currentUser.id ? response.data : u)))
      setEditDialogOpen(false)
      setCurrentUser(null)
      setEditData({ email: "", role: "DEV" })
      Toast.success(t("messages.updateSuccess"))
    } catch (error: any) {
      const errorMessage = error.response?.data?.message
      Toast.error(t(`errors.${errorMessage}`, { defaultValue: errorMessage }))
    } finally {
      setLoading(false)
    }
  }

  function handleSelectUser(id: string) {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((u) => u !== id))
    } else {
      setSelectedUsers([...selectedUsers, id])
    }
  }

  async function handleExport() {
    try {
      await devLogApi.exportDevLogs(selectedUsers)
      Toast.success(t("messages.exportSuccess"))
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || t("messages.exportError")
      Toast.error(t(`errors.${errorMessage}`, { defaultValue: errorMessage }))
    } finally {
      setLoading(false)
    }
  }

  // Debounced server search without useEffect
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    searchTimerRef.current = setTimeout(() => {
      setPage(0)
      fetchUsers({ p: 1, q: value.trim() })
    }, 500)
  }

  const handleRoleFilter = (e: SelectChangeEvent<string>) => {
    const role = e.target.value
    setRoleFilter(role)
    setPage(0)
    fetchUsers({ p: 1, role: role === "ALL" ? "all" : role })
  }

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
    fetchUsers({ p: newPage + 1 })
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = parseInt(event.target.value, 10)
    setRowsPerPage(next)
    setPage(0)
    fetchUsers({ p: 1, l: next })
  }

  return (
    <Container sx={{ backgroundColor: "background.paper", p: 3, borderRadius: 2 }}>
      <Box className="flex justify-center mb-4">
        <Typography variant="h6">{t("title")}</Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />

      {/* Search and filter section */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid sx={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            placeholder={t("actions.search")}
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            size="small"
          />
        </Grid>
        <Grid sx={{ xs: 12, md: 3 }}>
          <FormControl fullWidth size="small" sx={{ width: "130px" }}>
            <Select value={roleFilter} onChange={(e) => handleRoleFilter(e)} displayEmpty>
              <MenuItem value="ALL">{t("actions.filter.all")}</MenuItem>
              <MenuItem value="DEV">Developer</MenuItem>
              <MenuItem value="LEADER">Leader</MenuItem>
              <MenuItem value="HCNS">HCNS</MenuItem>
              <MenuItem value="ADMIN">Admin</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid sx={{ xs: 12, md: 6, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Download />}
            onClick={() => handleExport()}
            disabled={loading || selectedUsers.length === 0}
          >
            {t("actions.export")} ({selectedUsers.length})
          </Button>
        </Grid>
        {isAdmin && (
          <Grid sx={{ xs: 12, md: 6, display: "flex", justifyContent: "flex-end" }}>
            <Link href="/accounts/create">
              <Button variant="contained" color="primary">
                {t("actions.createAccount")}
              </Button>
            </Link>
          </Grid>
        )}
      </Grid>

      {/* Table */}
      <TableContainer component={Paper} sx={{ minHeight: "449px", position: "relative" }}>
        <Table stickyHeader size="medium" sx={{ tableLayout: "fixed" }}>
          <TableHead>
            <TableRow>
              <TableCell width="5%">
                <Checkbox
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedUsers([
                        ...selectedUsers,
                        ...users.filter((u) => u.isHasDevLog).map((u) => u.id),
                      ])
                    } else {
                      setSelectedUsers(
                        selectedUsers.filter(
                          (id) => !users.some((u) => u.id === id && u.isHasDevLog)
                        )
                      )
                    }
                  }}
                  indeterminate={
                    selectedUsers.length > 0 &&
                    users.some((u) => u.isHasDevLog && selectedUsers.includes(u.id)) &&
                    users.filter((u) => u.isHasDevLog).length > 0 &&
                    selectedUsers.filter((id) => users.some((u) => u.id === id && u.isHasDevLog))
                      .length < users.filter((u) => u.isHasDevLog).length
                  }
                  disabled={users.every((u) => !u.isHasDevLog)}
                  checked={
                    users.filter((u) => u.isHasDevLog).length > 0 &&
                    users.filter((u) => u.isHasDevLog).every((u) => selectedUsers.includes(u.id))
                  }
                />
              </TableCell>
              <TableCell width="10%">
                <strong>{t("table.code")}</strong>
              </TableCell>
              <TableCell width="25%">
                <strong>{t("table.name")}</strong>
              </TableCell>
              <TableCell width="20%">
                <strong>{t("table.email")}</strong>
              </TableCell>
              <TableCell width="10%">
                <strong>{t("table.password")}</strong>
              </TableCell>
              <TableCell width="10%">
                <strong>{t("table.role")}</strong>
              </TableCell>
              {isAdmin && (
                <TableCell width="10%">
                  <strong>{t("table.action")}</strong>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 && !loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1">{t("messages.noData")}</Typography>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Tooltip title={!user.isHasDevLog ? t("messages.userHasNoDevLog") : ""} arrow>
                      <span>
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          disabled={!user.isHasDevLog}
                        />
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{user.employeeCode}</TableCell>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>********</TableCell>
                  <TableCell>{user.role}</TableCell>
                  {isAdmin && (
                    <TableCell>
                      <Box>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => handleEdit(user.id)}
                          size="small"
                        >
                          {t("table.edit")}
                        </Button>
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Loading */}
        {loading && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(255,255,255,0.6)",
              zIndex: 1,
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelDisplayedRows={({ from, to, count }) =>
            `${page + 1}/${Math.ceil(count / rowsPerPage)}`
          }
        />
      </Box>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogTitle>{t("actions.editAccount")}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label={t("table.name")}
              value={currentUser?.fullName || ""}
              disabled
              fullWidth
            />

            <TextField
              label={t("table.email")}
              value={editData.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              fullWidth
              required
            />

            <TextField
              label={t("form.newPassword")}
              type="password"
              value={editData.password || ""}
              onChange={(e) => handleInputChange("password", e.target.value)}
              fullWidth
              placeholder={t("form.passwordPlaceholder")}
            />

            <FormControl fullWidth>
              <InputLabel>{t("table.role")}</InputLabel>
              <Select
                value={editData.role || ""}
                onChange={(e) => handleInputChange("role", e.target.value)}
                label={t("table.role")}
                disabled={!isAdmin}
              >
                <MenuItem value="DEV">Developer</MenuItem>
                <MenuItem value="LEADER">Leader</MenuItem>
                <MenuItem value="HCNS">HCNS</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>{t("actions.cancel")}</Button>
          <Button onClick={handleSave} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : t("actions.save")}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
