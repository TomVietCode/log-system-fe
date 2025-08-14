'use client'

import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContextType, LoginDto, RegisterDto, User } from "@/interface/auth";
import { authAPI } from "@/lib/api/auth-api";
import { useRouter } from "next/navigation";
import { ProfileFormData } from "@/lib/validation";

const AuthContext = createContext<AuthContextType | undefined> (undefined)

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode}) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  
  async function getProfile() {
    try {
      const profile = await authAPI.profile()
      if(profile) {
        setUser(profile.data)
      }
      setLoading(false)
    } catch (error) {
      setUser(null)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    const token = sessionStorage.getItem("accessToken")
    if(token) {
      getProfile()
    }
  }, [])

  async function login(data: LoginDto) {
    try {
      const response = await authAPI.login(data)
      sessionStorage.setItem("accessToken", response.data.accessToken)
      setUser(response.data.user)
      setLoading(false)
      return response.data.user
    } catch (error) {
      setUser(null)
      throw error
    }
  }

  async function register(data: RegisterDto) {
    try {
      await authAPI.register(data)
      setLoading(false)
      return true
    } catch (error) {
      throw error
    }
  }

  async function logout() {
    try {
      await authAPI.logout()
      sessionStorage.removeItem("accessToken")
      setUser(null)
      router.replace('/login')
    } catch (error) {
      setUser(null)
      router.replace('/login')
    }
  }

  async function update(data: ProfileFormData) {
    setUser(prevUser => {
      if (!prevUser) return null;
      
      const updatedUser: User = {
        ...prevUser,
        ...data,
        accountNumber: data.accountNumber === null ? undefined : data.accountNumber,
        dob: data.dob === null ? undefined : data.dob
      };
      return updatedUser;
    });
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      loading,
      register,
      logout,
      update
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