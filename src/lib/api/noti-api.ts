import apiClient from "./api"

export const notificationApi = {
  getNotifications: async () => {
    try {
      const response = await apiClient.get('/notifications')
      return response.data
    } catch (error) {
      throw error
    }
  },

  markAsRead: async (id: string) => {
    try {
      const response = await apiClient.post(`/notifications/${id}/read`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  sendReminder: async (userId: string, projectId: string) => {
    try {
      const data = { userId, projectId }
      const response = await apiClient.post('/notifications/send-reminder', data)
      return response.data
    } catch (error) {
      throw error
    }
  }
}