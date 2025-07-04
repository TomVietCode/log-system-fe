import { AuthResponse, LoginDto, ProfileResponse, RegisterDto } from "@/interface/auth"
import apiClient from "@/lib/api"

// Auth API functions
export const authAPI = {
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

  profile: async (): Promise<ProfileResponse> => {
    const response = await apiClient.get('/users/profile')
    return response.data
  }
}