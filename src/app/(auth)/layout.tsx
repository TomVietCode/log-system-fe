"use client"

import { Box, Card, CardContent, Container } from "@mui/material"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box position="relative" minHeight="100vh">
      <Container maxWidth="sm">
        <Box className="flex min-h-screen items-center justify-center">
          <Card className="w-full">
            <CardContent className="p-8 bg-gray-50">
              {children}
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
    
  )
}