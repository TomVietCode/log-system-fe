export interface Project {
  id: string
  name: string
  description: string
  memberIds: string[]
  tasks: string[]
}

export interface createProjectDto {
  name: string
  description?: string | null
  memberIds?: string[] 
  tasks?: string[]
}

export interface ProjectResponse {
  data: Project | boolean
  message: string
}