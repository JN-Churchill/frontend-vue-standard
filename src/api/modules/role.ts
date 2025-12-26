import { get, post, put, del } from '../index'
import type { PagedResult, PageRequest } from '@/types/api'
import type { Role, RoleInput, RoleUpdateInput, AssignPermissionsInput } from '@/types/role'

/**
 * Role API module
 */
export const roleApi = {
  /**
   * Get role list with pagination
   * @param params - Pagination parameters
   */
  getPage(params: PageRequest) {
    return get<PagedResult<Role>>('/Role/page', params)
  },

  /**
   * Get role detail by id
   * @param id - Role id
   */
  getDetail(id: number) {
    return get<Role>(`/Role/${id}`)
  },

  /**
   * Create role
   * @param data - Role creation data
   */
  create(data: RoleInput) {
    return post<Role>('/Role', data)
  },

  /**
   * Update role
   * @param id - Role id
   * @param data - Role update data
   */
  update(id: number, data: RoleUpdateInput) {
    return put<Role>(`/Role/${id}`, data)
  },

  /**
   * Delete role
   * @param id - Role id
   */
  delete(id: number) {
    return del(`/Role/${id}`)
  },

  /**
   * Assign permissions to role
   * @param id - Role id
   * @param data - Permission ids
   */
  assignPermissions(id: number, data: AssignPermissionsInput) {
    return post(`/Role/${id}/permissions`, data)
  },

  /**
   * Get role permissions
   * @param id - Role id
   */
  getPermissions(id: number) {
    return get<number[]>(`/Role/${id}/permissions`)
  },
}
