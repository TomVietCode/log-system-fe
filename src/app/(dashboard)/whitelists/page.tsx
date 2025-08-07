"use client"

import { useEffect, useState } from "react"
import { 
  Container, 
  Paper, 
  Typography, 
  Box,
  Button, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  CircularProgress,
  Divider,
  IconButton,
  Tooltip
} from "@mui/material"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { Add, Delete, Edit } from "@mui/icons-material"
import Toast from "@/components/ui/alert"
import { useAuth } from "@/context/auth.context"
import { useRouter } from "next/navigation"
import { inputStyle } from "@/styles/common"
import { adminApi } from "@/lib/api/admin-api"
import dayjs from "dayjs"

interface WhitelistDomain {
  id: string
  domain: string
  createdAt: string
  updatedAt: string
}

export default function WhitelistManagementPage() {
  const [loading, setLoading] = useState(true)
  const [domains, setDomains] = useState<WhitelistDomain[]>([])
  
  // Dialog states
  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [currentDomain, setCurrentDomain] = useState<WhitelistDomain | null>(null)
  const [domainInput, setDomainInput] = useState("")
  const [processingAction, setProcessingAction] = useState(false)
  const [error, setError] = useState("")

  // Fetch whitelist domains
  const fetchDomains = async () => {
    try {
      setLoading(true)
      const response = await adminApi.getWhitelist()
      setDomains(response.data)
    } catch (error: any) {
      Toast.error(error.response?.data?.message || "Không thể tải danh sách domain")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDomains()
  }, [])

  const handleOpenAddDialog = () => {
    setDomainInput("")
    setError("")
    setOpenAddDialog(true)
  }

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false)
    setDomainInput("")
    setError("")
  }

  const handleOpenEditDialog = (domain: WhitelistDomain) => {
    setCurrentDomain(domain)
    setDomainInput(domain.domain)
    setError("")
    setOpenEditDialog(true)
  }

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false)
    setCurrentDomain(null)
    setDomainInput("")
    setError("")
  }

  const handleAddDomain = async () => {  
    try {
      setProcessingAction(true)
      await adminApi.addWhitelist(domainInput)
      Toast.success(`Đã thêm domain ${domainInput} vào whitelist`)
      fetchDomains()
      handleCloseAddDialog()
    } catch (error: any) {
      Toast.error(error.response?.data?.message || "Không thể thêm domain vào whitelist")
    } finally {
      setProcessingAction(false)
    }
  }

  const handleEditDomain = async (id: string) => {
    if (!currentDomain) return
    
    try {
      setProcessingAction(true)
      await adminApi.updateWhiteList(id, domainInput)
      Toast.success(`Đã cập nhật domain thành ${domainInput}`)
      fetchDomains()
      handleCloseEditDialog()
    } catch (error: any) {
      Toast.error(error.response?.data?.message || "Không thể cập nhật domain")
    } finally {
      setProcessingAction(false)
    }
  }

  const handleDeleteDomain = async (id: string) => {
    try {
      await adminApi.deleteWhitelist(id)
      Toast.success("Đã xóa domain khỏi whitelist")
      fetchDomains()
    } catch (error: any) {
      Toast.error(error.response?.data?.message || "Không thể xóa domain")
    }
  }

  // Define columns for DataGrid
  const columns: GridColDef[] = [
    { 
      field: 'domain',
      headerName: 'Domain',
      flex: 1 
    },
    { 
      field: 'createdAt', 
      headerName: 'Ngày tạo',
      flex: 1,
      valueFormatter: (params: any) => dayjs(params.value).format('DD/MM/YYYY HH:mm')
    },
    { 
      field: 'updatedAt', 
      headerName: 'Ngày cập nhật',
      flex: 1,
      valueFormatter: (params: any) => dayjs(params.value).format('DD/MM/YYYY HH:mm')
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex' }}>
          <Tooltip title="Sửa">
            <IconButton
              color="primary"
              onClick={() => handleOpenEditDialog(params.row)}
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xóa">
            <IconButton
              color="error"
              onClick={() => handleDeleteDomain(params.row.id)}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  return (
    <Container sx={{ backgroundColor: "background.paper", p: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Quản lý Domain Whitelist</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={handleOpenAddDialog}
        >
          Thêm mới
        </Button>
      </Box>
      
      <Divider sx={{ mb: 2 }} />

      <Paper sx={{ height: 500, width: '100%', mb: 2 }}>
        <DataGrid
          rows={domains}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            sorting: {
              sortModel: [{ field: 'updatedAt', sort: 'desc' }],
            },
          }}
          pageSizeOptions={[10, 25, 50]}
          loading={loading}
          disableRowSelectionOnClick
        />
      </Paper>

      {/* Add New Domain Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Thêm Domain mới</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Domain"
              placeholder="example.com"
              value={domainInput}
              onChange={(e) => {
                setDomainInput(e.target.value)
                setError("") // Clear error when typing
              }}
              error={!!error}
              helperText={error || " "}
              sx={inputStyle}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Hủy</Button>
          <Button 
            onClick={handleAddDomain}
            variant="contained"
            disabled={processingAction || !domainInput.trim()}
          >
            {processingAction ? <CircularProgress size={24} /> : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Domain Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Sửa Domain</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Domain"
              placeholder="example.com"
              value={domainInput}
              onChange={(e) => {
                setDomainInput(e.target.value)
                setError("") // Clear error when typing
              }}
              error={!!error}
              helperText={error || " "}
              sx={inputStyle}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Hủy</Button>
          <Button 
            onClick={() => handleEditDomain(currentDomain?.id || "")}
            variant="contained"
            disabled={processingAction || !domainInput.trim()}
          >
            {processingAction ? <CircularProgress size={24} /> : "Cập nhật"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}