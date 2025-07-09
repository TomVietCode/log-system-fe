"use client"

import { Box, Button, Container, Paper, Typography } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { useRouter } from "next/navigation"

export default function ProjectsPage() {
  const router = useRouter()
  const rows = [
    { id: 1, name: "Project 1", email: "project1@example.com", phone: "1234567890" },
    { id: 2, name: "Project 2", email: "project2@example.com", phone: "0987654321" },
  ]
  const paginationModel = { page: 0, pageSize: 10 }
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 150 },
    { field: "phone", headerName: "Phone", width: 150 },
  ]

  
  return (
    <Container sx={{ backgroundColor: "background.paper", p: 3, borderRadius: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="contained" color="primary" onClick={() => router.push("/projects/create")}>
          Thêm dự án
        </Button>
      </Box>
      <Paper sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          sx={{ border: 0 }}
        />
      </Paper>
    </Container>
  )
}
