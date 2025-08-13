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
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login")
      }
    }
  }, [loading, user, router])

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