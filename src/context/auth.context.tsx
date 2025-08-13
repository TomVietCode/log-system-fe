'use client'

import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContextType, LoginDto, RegisterDto, User } from "@/interface/auth";
import { authAPI } from "@/lib/api/auth-api";
import { useRouter } from "next/navigation";

const AuthContext = createContext<AuthContextType | undefined> (undefined)

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode}) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  async function checkAuthStatus() {
    try {
      setLoading(true)
      const response = await authAPI.checkAuth()
      
      if (response.isAuthenticated) {
        setUser(response.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    } 
  }
  
  async function login(data: LoginDto) {
    try {
      const response = await authAPI.login(data)
      setUser(response.data.user)
      return response.data.user
    } catch (error) {
      setUser(null)
      throw error
    }
  }

  async function register(data: RegisterDto) {
    try {
      const response = await authAPI.register(data)
      setUser(response.data.user)
      return response.data.user
    } catch (error) {
      setUser(null)
      throw error
    }
  }

  async function logout() {
    try {
      await authAPI.logout()
      setUser(null)
      router.replace('/login')
    } catch (error) {
      setUser(null)
      router.replace('/login')
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      loading,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext) 
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}