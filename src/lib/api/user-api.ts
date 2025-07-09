import apiClient from "./api"

export const userApi = {
  getListUser: async (role: string = "all") => {
    try {
      const response = await apiClient.get('/users', { params: { role } })
      return response.data
    } catch (error) {
      throw error
    }
  }
}