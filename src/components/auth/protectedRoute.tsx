'use client'

import { useAuth } from "@/context/auth.context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Box, CircularProgress } from "@mui/material"

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode,
}) {
  const { loading } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    const token = sessionStorage.getItem("accessToken")
    if(!token) {
      router.replace("/login")
      return
    }
  }, [router])

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