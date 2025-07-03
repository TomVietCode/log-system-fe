'use client'

import { useAuth } from "@/context/auth.context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Box, CircularProgress } from "@mui/material"

export default function protectedRoute({
  children,
  allowedRoles
}: {
  children: React.ReactNode,
  allowedRoles?: string[]
}) {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/login")
        return
      }

      if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        router.push("/login")
        return
      }
    }
  }, [loading, isAuthenticated, user, allowedRoles, router])

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