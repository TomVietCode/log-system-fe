"use client"

import {
  Box,
  Button,
  Container,
  Paper,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { EditNote, VisibilityOutlined, AddTask } from "@mui/icons-material"
import { useEffect, useState } from "react"
import { projectApi } from "@/lib/api/project-api"
import Link from "next/link"
import Toast from "@/components/ui/alert"
import { useAuth } from "@/context/auth.context"
import DevLogTracker from "@/components/ui/DevLogTracker"
import { useProjectTranslations } from "@/lib/hook/useTranslations"
import dayjs from "dayjs"
import AddTaskDialog from "@/components/ui/AddTaskDialog"

export default function ProjectsPage() {
  const t = useProjectTranslations()
  const { user } = useAuth()
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false)

  const paginationModel = { page: 0, pageSize: 10 }

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await projectApi.getProjects()
      const rowData: any = response.data.map((project: any) => ({
        ...project,
        membersCount: project._count.ProjectMembers,
        tasksCount: project._count.tasks,
        createdAt: dayjs(project.createdAt).format("DD/MM/YYYY"),
        updatedAt: dayjs(project.updatedAt).format("DD/MM/YYYY"),
      }))

      setData(rowData)
    } catch (error) {
      Toast.error(t("messages.fetchError"))
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchData()
  }, [])

  const columns: GridColDef[] = [
    { field: "name", headerName: t("form.name"), width: 200 },
    { field: "description", headerName: t("form.description"), width: 150 },
    { field: "membersCount", headerName: t("form.members"), width: 150 },
    { field: "tasksCount", headerName: t("form.tasks"), width: 150 },
    { field: "createdAt", headerName: t("form.createdAt"), width: 150 },
    { field: "updatedAt", headerName: t("form.updatedAt"), width: 150 },
    {
      field: "actions",
      headerName: t("form.actions"),
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" sx={{ height: "100%" }}>
          {user?.role === "LEADER" && (
            <Tooltip title={t("actions.trackDevlog")}>
              <IconButton
                size="small"
                color="default"
                aria-label="edit"
                onClick={() => {
                  setSelectedProject(params.row)
                  setIsDialogOpen(true)
                }}
              >
                <VisibilityOutlined fontSize="medium" />
              </IconButton>
            </Tooltip>
          )}
          {user?.role === "LEADER" ? (
            // LEADER: Edit Project (Full Access)
            <Tooltip title={t("actions.editProject")}>
              <Link href={`/projects/${params.row.id}`}>
                <IconButton size="small" color="primary">
                  <EditNote fontSize="small" />
                </IconButton>
              </Link>
            </Tooltip>
          ) : user?.role === "DEV" ? (
            // DEV: Add Tasks (Limited Access)
            <Tooltip title={t("actions.addTasks")}>
              <IconButton
                size="small"
                color="primary"
                onClick={() => {
                  setSelectedProject(params.row)
                  setIsAddTaskDialogOpen(true)
                }}
              >
                <AddTask fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : null}
        </Stack>
      ),
    },
  ]

  return (
    <>
      <Container sx={{ backgroundColor: "background.paper", p: 3, borderRadius: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Link href="/projects/create">
            <Button variant="contained" size="large" color="primary">
              {t("actions.create")}
            </Button>
          </Link>
        </Box>
        <Paper sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={data}
            loading={loading}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            sx={{ border: 0 }}
            disableRowSelectionOnClick
            disableColumnSelector
            disableColumnMenu
          />
        </Paper>
      </Container>
      {isDialogOpen && (
        <DevLogTracker
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          project={selectedProject}
        />
      )}
      {isAddTaskDialogOpen && selectedProject && (
        <AddTaskDialog
          open={isAddTaskDialogOpen}
          onClose={() => {
            setIsAddTaskDialogOpen(false)
            setSelectedProject(null)
          }}
          project={selectedProject}
          onTasksAdded={() => {
            fetchData() // ✅ Refresh data after adding tasks
            Toast.success(t("messages.tasksAddedSuccess"))
          }}
        />
      )}
    </>
  )
}
