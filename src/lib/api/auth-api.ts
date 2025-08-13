import { AuthResponse, LoginDto, ProfileResponse, RegisterDto } from "@/interface/auth"
import apiClient from "@/lib/api/api"
import { ChangePasswordFormData, ProfileFormData } from "@/lib/validation"

// Auth API functions
export const authAPI = {
  checkAuth: async () => {
    try {
      const response = await apiClient.get('/auth/check')
      return response.data
    } catch (error) {
      return {
        isAuthenticated: false,
        user: null,
        message: 'Not authenticated'
      }
    }
  },
  
  login: async (data: LoginDto): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post('/auth/login', data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data)
    return response.data
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout')
  },

  profile: async (): Promise<ProfileResponse> => {
    const response = await apiClient.get('/users/profile')
    return response.data
  },

  updateProfile: async (data: ProfileFormData): Promise<ProfileResponse> => {
    const response = await apiClient.patch('/users/profile', data)
    return response.data
  },

  changePassword: async (data: ChangePasswordFormData): Promise<AuthResponse> => {
    const response = await apiClient.patch('/users/change-password', data)
    return response.data
  }
}