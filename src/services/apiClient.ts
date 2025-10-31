import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'

// Read build-time env var and normalize. If not provided, leave empty so dev proxy
// (configured in vite.config.ts) will handle `/api` paths on localhost.
const _envBase = import.meta.env.VITE_API_BASE_URL as string | undefined
const API_BASE_URL = _envBase ? _envBase.replace(/\/$/, '') : ''

// Create axios instance with base configuration. When API_BASE_URL is empty,
// axios will send requests to the same origin (useful for dev proxy).
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL || undefined,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
})

// Request interceptor for adding auth tokens if needed
apiClient.interceptors.request.use(
  (config) => {
    // Add any authentication headers here if needed
    // const token = localStorage.getItem('authToken')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    // Handle common errors here
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access')
    } else if (error.response?.status === 500) {
      // Handle server errors
      console.error('Server error')
    }
    return Promise.reject(error)
  }
)

export default apiClient
