import apiClient from "./api"

export const dashboardApi = {
  getDashboardData: async () => {
    try {
      const result = await apiClient.get(`/statistics/dashboard`)
      return result.data
    } catch (error) {
      throw error
    }
  }
}