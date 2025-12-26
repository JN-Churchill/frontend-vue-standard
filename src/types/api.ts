/**
 * Common API types
 */

/**
 * Paged result response
 */
export interface PagedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
}

/**
 * Pagination request parameters
 */
export interface PageRequest {
  Page: number
  PageSize: number
  OrderBy?: string
  IsDescending?: boolean
}

/**
 * Batch delete request
 */
export interface BatchDeleteRequest {
  ids: number[]
}
