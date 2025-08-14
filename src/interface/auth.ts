import { ProfileFormData } from "@/lib/validation"

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  email: string
  password: string
  confirmPassword?: string | null
  fullName: string
}

export interface AuthResponse {
  data: {
    accessToken: string
    user: User
  },
  message: string
}

export interface User {
  id: string
  employeeCode: string
  email: string
  personalEmail?: string
  phoneNumber?: string
  fullName: string
  phone?: string
  citizenID?: string
  accountNumber?: string
  dob?: string,
  role: 'ADMIN' | 'HCNS' | 'LEADER' | 'DEV'
  isHasDevLog?: boolean
  createdAt: string
  updatedAt: string
}

export interface UpdateUserAdminDto {
  email: string
  role: 'ADMIN' | 'HCNS' | 'LEADER' | 'DEV'
  password?: string
}

export interface CreateUserDto {
  fullName: string
  email: string
  password: string
  citizenID: string
  phone: string
  role: 'ADMIN' | 'HCNS' | 'LEADER' | 'DEV'
}

export interface ProfileResponse {
  data: User
  message?: string
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  // isAuthenticated: boolean
  login: (dto: LoginDto) => Promise<User>
  register: (dto: RegisterDto) => Promise<boolean>
  logout: () => Promise<void>
  update: (data: ProfileFormData) => Promise<void>
}