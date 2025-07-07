export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  email: string
  password: string
  fullName: string
}

export interface AuthResponse {
  data: {
    accessToken: string
  },
  message: string
}

export interface User {
  id: string
  email: string
  personalEmail?: string
  phoneNumber?: string
  fullName: string
  phone?: string
  citizenID?: string
  accountNumber?: string
  dob?: string,
  role: 'ADMIN' | 'HCNS' | 'LEADER' | 'DEV'
  createdAt: string
  updatedAt: string
}

export interface ProfileResponse {
  data: User
  message?: string
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (dto: LoginDto) => Promise<void>
  register: (dto: RegisterDto) => Promise<void>
  logout: () => void
}