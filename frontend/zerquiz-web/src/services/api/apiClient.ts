import axios from 'axios'

// API Gateway or direct service URLs
const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_GATEWAY_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  // Use 'token' key instead of 'accessToken' (matches useAuth.tsx)
  const token = localStorage.getItem('token') || localStorage.getItem('accessToken')
  const tenantId = localStorage.getItem('tenantId')
  const userId = localStorage.getItem('userId')
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (tenantId) {
    config.headers['X-Tenant-Id'] = tenantId
  }
  if (userId) {
    config.headers['X-User-Id'] = userId
  }
  
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient

