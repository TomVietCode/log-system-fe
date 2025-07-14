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
  tasks?: Task[]
}

export interface updateProjectDto {
  name?: string
  description?: string | null
  memberIds?: string[] 
  tasks?: Task[]
}

export interface ProjectResponse {
  data: Project 
  message: string
}

export interface Task {
  id?: string | null
  name: string
}