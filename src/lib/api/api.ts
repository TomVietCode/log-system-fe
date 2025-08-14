import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL

//Axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: false, // Explicitly disable credentials
})

// Request Interceptor - Auto add token to headers
apiClient.interceptors.request.use((config) => {
  // Get token from sessionStorage and add to Authorization header
  const token = sessionStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// Response Interceptor - Handle token expiration
apiClient.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default apiClient