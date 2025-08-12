'use client'

import { useAuth } from "@/context/auth.context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Box, CircularProgress } from "@mui/material"

export default function ProtectedRoute({
  children,
  allowedRoles
}: {
  children: React.ReactNode,
  allowedRoles?: string[]
}) {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()
  
  if (!loading) {
    const noAccess = !isAuthenticated || (allowedRoles && user && !allowedRoles.includes(user.role))

    if (noAccess) {
      router.replace("/login")
      return
    }
  }

  if (loading) {
    return (
      <Box
        className="flex items-center justify-center h-screen"
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      {children}
    </>
  )
}