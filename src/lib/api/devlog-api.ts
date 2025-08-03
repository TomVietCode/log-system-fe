import apiClient from "@/lib/api/api"

export const devLogApi = { 
  addDevLog: async (data: any) => {
    try {
      const result = await apiClient.post('/devlogs', data)
      return result.data
    } catch (error) {
      throw error
    }
  },

  getDevLogs: async (userId: string, month: number, year: number) => {
    try {
      const result = await apiClient.get(`/devlogs/${userId}?month=${month}&year=${year}`)
      return result.data
    } catch (error) {
      throw error
    }
  }
}