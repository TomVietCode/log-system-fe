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
import { DataGrid, GridColDef, useGridApiContext } from "@mui/x-data-grid"
import { Add, Delete, Edit } from "@mui/icons-material"
import Toast from "@/components/ui/alert"
import { inputStyle } from "@/styles/common"
import { useWhitelistTranslations } from "@/lib/hook/useTranslations"
import { adminApi } from "@/lib/api/admin-api"
import dayjs from "dayjs"

interface WhitelistDomain {
  id: string
  domain: string
  createdAt: string
  updatedAt: string
}

export default function WhitelistManagementPage() {
  const t = useWhitelistTranslations()
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
      Toast.error(error.response?.data?.message || t("toasts.fetchError"))
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
      Toast.success(t("toasts.addSuccess", { domain: domainInput }))
      fetchDomains()
      handleCloseAddDialog()
    } catch (error: any) {
      Toast.error(error.response?.data?.message || t("toasts.addError"))
    } finally {
      setProcessingAction(false)
    }
  }

  const handleEditDomain = async (id: string) => {
    if (!currentDomain) return
    
    try {
      setProcessingAction(true)
      await adminApi.updateWhiteList(id, domainInput)
      Toast.success(t("toasts.updateSuccess", { domain: domainInput }))
      fetchDomains()
      handleCloseEditDialog()
    } catch (error: any) {
      Toast.error(error.response?.data?.message || t("toasts.updateError"))
    } finally {
      setProcessingAction(false)
    }
  }

  const handleDeleteDomain = async (id: string) => {
    try {
      await adminApi.deleteWhitelist(id)
      Toast.success(t("toasts.deleteSuccess"))
      fetchDomains()
    } catch (error: any) {
      Toast.error(error.response?.data?.message || t("toasts.deleteError"))
    }
  }

  // Define columns for DataGrid
  const columns: GridColDef[] = [
    { 
      field: 'domain',
      headerName: t('table.domain'),
      flex: 1 
    },
    { 
      field: 'createdAt', 
      headerName: t('table.createdAt'),
      flex: 1,
      valueFormatter: (params: any) => dayjs(params.value).format('DD/MM/YYYY HH:mm')
    },
    { 
      field: 'updatedAt', 
      headerName: t('table.updatedAt'),
      flex: 1,
      valueFormatter: (params: any) => dayjs(params.value).format('DD/MM/YYYY HH:mm')
    },
    {
      field: 'actions',
      headerName: t('table.actions'),
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex' }}>
          <Tooltip title={t('actions.edit')}>
            <IconButton
              color="primary"
              onClick={() => handleOpenEditDialog(params.row)}
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('actions.delete')}>
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
        <Typography variant="h5">{t('title')}</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={handleOpenAddDialog}
        >
          {t('buttons.addNew')}
        </Button>
      </Box>
      
      <Divider sx={{ mb: 2 }} />

      <Paper sx={{ height: 500, width: '100%', mb: 2 }}>
        <DataGrid
          rows={domains}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[1, 10, 25, 50]}
          loading={loading}
          disableRowSelectionOnClick
          localeText={{
            paginationDisplayedRows: ({ from, to, count }: { from: number; to: number; count: number }) => {
              const api = useGridApiContext();
              const pageSize = api.current.state.pagination.paginationModel.pageSize;
              return `${from}/${Math.ceil(count/pageSize)}`;
            }
          }}
        />
      </Paper>

      {/* Add New Domain Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{t('dialogs.add.title')}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label={t('dialogs.add.domainLabel')}
              placeholder={t('dialogs.add.placeholder')}
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
          <Button onClick={handleCloseAddDialog}>{t('dialogs.add.cancel')}</Button>
          <Button 
            onClick={handleAddDomain}
            variant="contained"
            disabled={processingAction || !domainInput.trim()}
          >
            {processingAction ? <CircularProgress size={24} /> : t('dialogs.add.confirm')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Domain Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{t('dialogs.edit.title')}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label={t('dialogs.add.domainLabel')}
              placeholder={t('dialogs.add.placeholder')}
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
          <Button onClick={handleCloseEditDialog}>{t('dialogs.edit.cancel')}</Button>
          <Button 
            onClick={() => handleEditDomain(currentDomain?.id || "")}
            variant="contained"
            disabled={processingAction || !domainInput.trim()}
          >
            {processingAction ? <CircularProgress size={24} /> : t('dialogs.edit.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}