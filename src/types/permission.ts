/**
 * Permission related types
 */

/**
 * Permission entity
 */
export interface Permission {
  id: number
  createTime: string
  updateTime: string | null
  createUserId: number | null
  updateUserId: number | null
  isDeleted: boolean
  deleteTime: string | null
  permissionName: string
  permissionCode: string
  permissionType: number
  parentId: number
  path: string
  component: string
  icon: string
  sort: number
  status: number
}

/**
 * Permission input for creation
 */
export interface PermissionInput {
  permissionName: string
  permissionCode: string
  permissionType: number
  parentId: number
  path: string
  component: string
  icon: string
  sort: number
}

/**
 * Permission update input
 */
export interface PermissionUpdateInput {
  permissionName: string
  permissionCode: string
  permissionType: number
  parentId: number
  path: string
  component: string
  icon: string
  sort: number
  status: number
}

/**
 * Permission tree node
 */
export interface PermissionTreeNode extends Permission {
  children?: PermissionTreeNode[]
}
