import { useUserStore } from '@/store/modules/user'

/**
 * Check if user has permission
 * @param permission - Permission code
 * @returns Whether user has the permission
 */
export function hasPermission(permission: string): boolean {
  const userStore = useUserStore()
  return userStore.hasPermission(permission)
}

/**
 * Check if user has any of the permissions
 * @param permissions - Permission codes
 * @returns Whether user has any of the permissions
 */
export function hasAnyPermission(permissions: string[]): boolean {
  const userStore = useUserStore()
  return permissions.some(permission => userStore.hasPermission(permission))
}

/**
 * Check if user has all permissions
 * @param permissions - Permission codes
 * @returns Whether user has all permissions
 */
export function hasAllPermissions(permissions: string[]): boolean {
  const userStore = useUserStore()
  return permissions.every(permission => userStore.hasPermission(permission))
}

/**
 * Check if user has role
 * @param role - Role code
 * @returns Whether user has the role
 */
export function hasRole(role: string): boolean {
  const userStore = useUserStore()
  return userStore.hasRole(role)
}

/**
 * Check if user has any of the roles
 * @param roles - Role codes
 * @returns Whether user has any of the roles
 */
export function hasAnyRole(roles: string[]): boolean {
  const userStore = useUserStore()
  return userStore.hasAnyRole(roles)
}

/**
 * Check if user has all roles
 * @param roles - Role codes
 * @returns Whether user has all roles
 */
export function hasAllRoles(roles: string[]): boolean {
  const userStore = useUserStore()
  return roles.every(role => userStore.hasRole(role))
}
