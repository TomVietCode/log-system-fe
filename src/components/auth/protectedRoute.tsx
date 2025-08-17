'use client'

import { useAuth } from "@/context/auth.context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Box, CircularProgress } from "@mui/material"

export default function ProtectedRoute({
  children,
  isAllowed
}: {
  children: React.ReactNode,
  isAllowed?: boolean | undefined
}) {
  const { loading } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    const token = sessionStorage.getItem("accessToken")
    if(!token) {
      router.replace("/login")
      return
    }

    if(!isAllowed) {
      router.replace("/not-found")
      return
    }
  }, [isAllowed, router])

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