import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { logger } from '@/utils/logger'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

/**
 * API Response interface
 */
export interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
  success: boolean
}

/**
 * Create Axios instance with default configuration
 */
const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request interceptor
 * Attach JWT token to requests
 */
instance.interceptors.request.use(
  (config) => {
    NProgress.start()
    
    const userStore = useUserStore()
    const token = userStore.token
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    logger.info(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data)
    return config
  },
  (error: AxiosError) => {
    NProgress.done()
    logger.error('Request error:', error)
    return Promise.reject(error)
  }
)

/**
 * Response interceptor
 * Handle token refresh and error responses
 */
instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    NProgress.done()
    
    const { code, message, success } = response.data
    
    logger.info(`API Response: ${response.config.url}`, response.data)
    
    // Handle successful response
    if (success || code === 200) {
      return response.data
    }
    
    // Handle business logic errors
    ElMessage.error(message || 'Request failed')
    return Promise.reject(new Error(message || 'Request failed'))
  },
  async (error: AxiosError<ApiResponse>) => {
    NProgress.done()
    
    if (!error.response) {
      ElMessage.error('Network error, please check your connection')
      return Promise.reject(error)
    }
    
    const { status } = error.response
    const userStore = useUserStore()
    
    switch (status) {
      case 401:
        // Token expired, try to refresh
        if (userStore.refreshToken) {
          try {
            await userStore.refreshAccessToken()
            // Retry original request
            return instance.request(error.config as AxiosRequestConfig)
          } catch (refreshError) {
            // Refresh failed, logout
            ElMessageBox.confirm('Login expired, please login again', 'Session Expired', {
              confirmButtonText: 'Login',
              cancelButtonText: 'Cancel',
              type: 'warning',
            }).then(() => {
              userStore.logout()
              window.location.href = '/login'
            })
          }
        } else {
          ElMessage.error('Authentication failed, please login')
          userStore.logout()
          window.location.href = '/login'
        }
        break
      case 403:
        ElMessage.error('Access denied, insufficient permissions')
        break
      case 404:
        ElMessage.error('Resource not found')
        break
      case 500:
        ElMessage.error('Server error, please try again later')
        break
      default:
        ElMessage.error(error.response.data?.message || 'Request failed')
    }
    
    logger.error('API Error:', error)
    return Promise.reject(error)
  }
)

/**
 * Generic request method
 */
export function request<T = any>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
  return instance.request(config)
}

/**
 * GET request
 */
export function get<T = any>(url: string, params?: any): Promise<ApiResponse<T>> {
  return instance.get(url, { params })
}

/**
 * POST request
 */
export function post<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
  return instance.post(url, data)
}

/**
 * PUT request
 */
export function put<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
  return instance.put(url, data)
}

/**
 * DELETE request
 */
export function del<T = any>(url: string, params?: any): Promise<ApiResponse<T>> {
  return instance.delete(url, { params })
}

/**
 * PATCH request
 */
export function patch<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
  return instance.patch(url, data)
}

/**
 * Upload file
 */
export function upload<T = any>(url: string, formData: FormData): Promise<ApiResponse<T>> {
  return instance.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

/**
 * Download file
 */
export function download(url: string, params?: any): Promise<Blob> {
  return instance.get(url, {
    params,
    responseType: 'blob',
  })
}

export default instance
