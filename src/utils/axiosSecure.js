import axios from 'axios'

// Create axios instance with base URL
const axiosSecure = axios.create({
  baseURL: 'http://localhost:5000'
})

// Request interceptor to add authorization header
axiosSecure.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('habit-tracker-token')
    if (token) {
      config.headers.authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle 401 errors
axiosSecure.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      localStorage.removeItem('habit-tracker-token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosSecure
