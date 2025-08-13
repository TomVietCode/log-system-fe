import apiClient from "./api"
import { CreateUserDto, UpdateUserAdminDto } from "@/interface/auth"

export const userApi = {
  getListUser: async (
    params: { role?: string; page?: number; limit?: number; q?: string } = {}
  ) => {
    try {
      const { role = 'all', page = 1, limit = 10, q = '' } = params
      const response = await apiClient.get('/users', { params: { role, page, limit, q } })
      return response.data
    } catch (error) {
      throw error
    }
  },
  
  getListDev: async () => {
    try {
      const response = await apiClient.get('/users/dev')
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