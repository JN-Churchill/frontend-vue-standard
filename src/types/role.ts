/**
 * Role related types
 */

/**
 * Role entity
 */
export interface Role {
  id: number
  createTime: string
  updateTime: string | null
  createUserId: number | null
  updateUserId: number | null
  isDeleted: boolean
  deleteTime: string | null
  roleName: string
  roleCode: string
  description: string
  sort: number
  status: number
}

/**
 * Role input for creation
 */
export interface RoleInput {
  roleName: string
  roleCode: string
  description: string
  sort: number
}

/**
 * Role update input
 */
export interface RoleUpdateInput {
  roleName: string
  roleCode: string
  description: string
  sort: number
  status: number
}

/**
 * Assign permissions input
 */
export interface AssignPermissionsInput {
  permissionIds: number[]
}
