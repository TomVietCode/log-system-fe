"use client"

import { Box } from "@mui/material"
import Header from "@/components/layout/Header"
import ProtectedRoute from "@/components/auth/protectedRoute"
import Sidebar from "@/components/layout/Sidebar"
import { useAuth } from "@/context/auth.context"
import { getMenuByRole } from "@/config/menu"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const menuItems = user && getMenuByRole(user.role)

  return (
    <ProtectedRoute>
      <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "background.default" }}>
        <Header user={user} logout={logout} />
        <Sidebar menuItems={menuItems || []} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8,
          }}
        >
          {children}
        </Box>
      </Box>
    </ProtectedRoute>
  )
}
