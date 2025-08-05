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
  },

  exportDevLogs: async (userIds: string[]): Promise<void> => {
    try {
      const month = new Date().getMonth() + 1
      const year = new Date().getFullYear()

      const response = await apiClient.post(`/devlogs/export`, {
        userIds,
        month,
        year
      }, {
        responseType: "blob"
      })

      // create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `devlogs_${month}_${year}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return response.data
    } catch (error) {
      throw error
    }
  }
}