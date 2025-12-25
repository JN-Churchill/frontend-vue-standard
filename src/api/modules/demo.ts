import { get, post, put, del } from '../index'

/**
 * Demo item interface
 */
export interface DemoItem {
  id: string
  name: string
  description: string
  status: number
  createTime: string
  updateTime: string
}

/**
 * Pagination params
 */
export interface PaginationParams {
  page: number
  pageSize: number
  keyword?: string
}

/**
 * Pagination response
 */
export interface PaginationResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

/**
 * Demo API module
 */
export const demoApi = {
  /**
   * Get demo list
   */
  getList(params: PaginationParams) {
    return get<PaginationResponse<DemoItem>>('/demo/list', params)
  },

  /**
   * Get demo detail
   */
  getDetail(id: string) {
    return get<DemoItem>(`/demo/${id}`)
  },

  /**
   * Create demo
   */
  create(data: Partial<DemoItem>) {
    return post<DemoItem>('/demo', data)
  },

  /**
   * Update demo
   */
  update(id: string, data: Partial<DemoItem>) {
    return put<DemoItem>(`/demo/${id}`, data)
  },

  /**
   * Delete demo
   */
  delete(id: string) {
    return del(`/demo/${id}`)
  },
}
