import apiClient from "./api"
import { CreateUserDto, UpdateUserAdminDto } from "@/interface/auth"

export const userApi = {
  getListUser: async (role: string = "all") => {
    try {
      const response = await apiClient.get('/users', { params: { role } })
      return response.data
    } catch (error) {
      throw error
    }
  },

  createUser: async (data: CreateUserDto) => {
    try {
      const response = await apiClient.post('/auth/register', data)
      return response.data
    } catch (error) {
      throw error
    }
  },
  
  updateUser: async (userId: string, data: UpdateUserAdminDto) => {
    try {
      const response = await apiClient.patch(`/users/${userId}`, data)
      return response.data
    } catch (error) {
      throw error
    }
  }
}