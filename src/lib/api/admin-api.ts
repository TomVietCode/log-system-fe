import apiClient from "@/lib/api/api"

export const adminApi = {
  getWhitelist: async () => {
    const response = await apiClient.get('/whitelists')
    return response.data
  },
  
  addWhitelist: async (domain: string) => {
    const response = await apiClient.post('/whitelists', { domain })
    return response.data
  },
  
  updateWhiteList: async (id: string, domain: string) => {
    const response = await apiClient.patch(`/whitelists/${id}`, { domain })
    return response.data
  },

  deleteWhitelist: async (id: string) => {
    const response = await apiClient.delete(`/whitelists/${id}`)
    return response.data
  },
  
}