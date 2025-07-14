"use client"

import { Box, Button, Container, Paper, Typography, IconButton, Stack } from "@mui/material"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { EditNote, Delete } from '@mui/icons-material';
import { useEffect, useState } from "react"
import { projectApi } from "@/lib/api/project-api";
import Link from "next/link";
import moment from "moment"

export default function ProjectsPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const paginationModel = { page: 0, pageSize: 10 }
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await projectApi.getProjects()
        console.log(response.data)
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

  const handleDelete = (id: number) => {
    // Add confirmation dialog or delete logic here
    console.log(`Delete project with id: ${id}`)
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
        <Stack direction="row" spacing={1} sx={{ height: "100%" }}>
          <Link href={`/projects/${params.row.id}`}>
            <IconButton 
              size="medium" 
              color="primary" 
              aria-label="edit"
            >
              <EditNote fontSize="medium" />
            </IconButton> 
          </Link>
          <IconButton 
            size="medium" 
            color="error" 
            onClick={() => handleDelete(params.row.id)}
            aria-label="delete"
          >
            <Delete fontSize="medium" />
          </IconButton>
        </Stack>
      )
    }
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
