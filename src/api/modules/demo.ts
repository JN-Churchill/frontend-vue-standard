import { get, post, put, del } from '../index'
import type { PagedResult, PageRequest, BatchDeleteRequest } from '@/types/api'
import type { DemoDto, DemoInput, DemoUpdateInput } from '@/types/demo'

/**
 * Demo API module
 */
export const demoApi = {
  /**
   * Get demo list with pagination
   * @param params - Pagination parameters
   */
  getPage(params: PageRequest) {
    return get<PagedResult<DemoDto>>('/Demo/page', params)
  },

  /**
   * Get demo detail by id
   * @param id - Demo id
   */
  getDetail(id: number) {
    return get<DemoDto>(`/Demo/${id}`)
  },

  /**
   * Create demo
   * @param data - Demo creation data
   */
  create(data: DemoInput) {
    return post<DemoDto>('/Demo', data)
  },

  /**
   * Update demo
   * @param id - Demo id
   * @param data - Demo update data
   */
  update(id: number, data: DemoUpdateInput) {
    return put<DemoDto>(`/Demo/${id}`, data)
  },

  /**
   * Delete demo
   * @param id - Demo id
   */
  delete(id: number) {
    return del(`/Demo/${id}`)
  },

  /**
   * Batch delete demos
   * @param data - Batch delete request with demo ids
   */
  batchDelete(data: BatchDeleteRequest) {
    return del('/Demo/batch', data)
  },
}
