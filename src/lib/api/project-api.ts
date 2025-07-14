import { createProjectDto, ProjectResponse, updateProjectDto } from "@/interface/project";
import apiClient from "@/lib/api/api";

export const projectApi = {
  createProject: async (data: createProjectDto): Promise<ProjectResponse> => {
    try {
      const response = await apiClient.post('/projects', data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  getProjects: async () => {
    try {
      const response = await apiClient.get('/projects')
      return response.data
    } catch (error) {
      throw error
    }
  },

  getProject: async (projectId: string) => {
    try {
      const response = await apiClient.get(`/projects/${projectId}`)
      return response.data
    } catch (error) {
      throw error
    }
  },
  
  updateProject: async (projectId: string, data: updateProjectDto) => {
    try {
      const response = await apiClient.patch(`/projects/${projectId}`, data)
      return response.data
    } catch (error) {
      throw error
    }
  }
}