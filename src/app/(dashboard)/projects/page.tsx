"use client"

import { Box, Button, Container, Paper, IconButton, Stack, CircularProgress, Tooltip } from "@mui/material"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { EditNote, Delete, VisibilityOutlined } from '@mui/icons-material';
import { useEffect, useState } from "react"
import { projectApi } from "@/lib/api/project-api";
import Link from "next/link";
import moment from "moment"
import Toast from "@/components/ui/alert";

export default function ProjectsPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const paginationModel = { page: 0, pageSize: 10 }
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await projectApi.getProjects()
        const rowData: any = response.data.map((project: any) => ({
          id: project.id,
          name: project.name,
          description: project.description,
          members: project._count.ProjectMembers,
          tasks: project._count.tasks,
          createdAt: moment(project.createdAt).format("DD/MM/YYYY"),
          updatedAt: moment(project.updatedAt).format("DD/MM/YYYY")
        }))

        setData(rowData)
        
      } catch (error) {
        console.error("Error fetching projects:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      setLoading(true)
      await projectApi.deleteProject(id)
      Toast.success("Xóa dự án thành công")
      setData(data.filter((project) => project.id !== id))
    } catch (error) {
      Toast.error("Xóa dự án thất bại")
    } finally {
      setLoading(false)
    }
  }
  
  const columns: GridColDef[] = [
    { field: "name", headerName: "Tên dự án", width: 200 },
    { field: "description", headerName: "Mô tả", width: 150 },
    { field: "members", headerName: "Thành viên", width: 150 },
    { field: "tasks", headerName: "Công việc", width: 150 },
    { field: "createdAt", headerName: "Ngày tạo", width: 150 },
    { field: "updatedAt", headerName: "Ngày cập nhật", width: 150 },
    {
      field: "actions",
      headerName: "Thao tác",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" sx={{ height: "100%" }}>
          <Tooltip title="Theo dõi DevLog">
            <IconButton size="small" color="default" aria-label="edit">
              <VisibilityOutlined fontSize="medium" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Chỉnh sửa dự án">
            <Link href={`/projects/${params.row.id}`}>
              <IconButton size="small" color="primary" aria-label="edit">
                <EditNote fontSize="medium" />
              </IconButton>
            </Link>
          </Tooltip>
          <Tooltip title="Xóa dự án">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(params.row.id)}
              aria-label="delete"
            >
              <Delete fontSize="medium" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ]

  return (
    <Container sx={{ backgroundColor: "background.paper", p: 3, borderRadius: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Link href="/projects/create">
          <Button variant="contained" size="large" color="primary">
            Thêm dự án
          </Button>
        </Link>
      </Box>
      <Paper sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={data}
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
  )
}
