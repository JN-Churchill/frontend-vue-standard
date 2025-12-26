import { get, post, put, del } from '../index'
import type { Permission, PermissionInput, PermissionUpdateInput, PermissionTreeNode } from '@/types/permission'

/**
 * Permission API module
 */
export const permissionApi = {
  /**
   * Get permission list
   */
  getList() {
    return get<Permission[]>('/Permission/list')
  },

  /**
   * Get permission tree
   */
  getTree() {
    return get<PermissionTreeNode[]>('/Permission/tree')
  },

  /**
   * Get permission detail by id
   * @param id - Permission id
   */
  getDetail(id: number) {
    return get<Permission>(`/Permission/${id}`)
  },

  /**
   * Create permission
   * @param data - Permission creation data
   */
  create(data: PermissionInput) {
    return post<Permission>('/Permission', data)
  },

  /**
   * Update permission
   * @param id - Permission id
   * @param data - Permission update data
   */
  update(id: number, data: PermissionUpdateInput) {
    return put<Permission>(`/Permission/${id}`, data)
  },

  /**
   * Delete permission
   * @param id - Permission id
   */
  delete(id: number) {
    return del(`/Permission/${id}`)
  },
}
