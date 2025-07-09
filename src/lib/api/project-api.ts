import { createProjectDto, ProjectResponse } from "@/interface/project";
import apiClient from "@/lib/api/api";

export const projectApi = {
  createProject: async (data: createProjectDto): Promise<ProjectResponse> => {
    try {
      const response = await apiClient.post('/projects', data)
      return response.data
    } catch (error) {
      throw error
    }
  }
}