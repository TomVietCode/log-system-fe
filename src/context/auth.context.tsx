'use client'

import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContextType, LoginDto, RegisterDto, User } from "@/interface/auth";
import { authAPI } from "@/lib/auth-api";

const AuthContext = createContext<AuthContextType | undefined> (undefined)

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode}) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check if user is authenticated
  useEffect(() => {
    checkAuthStatus()
  }, [])

  async function checkAuthStatus() {
    try {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        setLoading(false)
        return
      }

      const response = await authAPI.profile()
      setUser(response.data)
      setLoading(false)
    } catch (error) {
      localStorage.removeItem("accessToken")
      setUser(null)
      setLoading(false)
    }
  }

  async function login(data: LoginDto) {
    try {
      const response = await authAPI.login(data)
      const { accessToken } = response.data

      localStorage.setItem("accessToken", accessToken)
      const userResponse = await authAPI.profile()
      setUser(userResponse.data)
    } catch (error) {
      localStorage.removeItem("accessToken")
      setUser(null)
      throw error
    }
  }

  async function register(data: RegisterDto) {
    try {
      const response = await authAPI.register(data)
      const { accessToken } = response.data
      localStorage.setItem("accessToken", accessToken)
      const userResponse = await authAPI.profile()
      setUser(userResponse.data)
    } catch (error) {
      localStorage.removeItem("accessToken")
      setUser(null)
    }
  }

  function logout() {
    localStorage.removeItem("accessToken")
    setUser(null)
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated
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