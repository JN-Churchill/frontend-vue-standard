/**
 * Request and response types
 */

// Pagination request
export interface PaginationRequest {
  page: number
  pageSize: number
  keyword?: string
}

// Pagination response
export interface PaginationResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// Standard API response
export interface ApiResult<T = any> {
  code: number
  data: T
  message: string
  success: boolean
}

// User types
export interface User {
  id: string
  username: string
  nickname: string
  email: string
  avatar?: string
  roles: string[]
  permissions: string[]
}

// Route meta type
export interface RouteMeta {
  title?: string
  icon?: string
  requiresAuth?: boolean
  roles?: string[]
  hidden?: boolean
}
