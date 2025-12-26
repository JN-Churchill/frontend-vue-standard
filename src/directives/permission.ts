import type { App, Directive } from 'vue'
import { hasPermission, hasAnyPermission, hasAllPermissions } from '@/utils/permission'

/**
 * Permission directive
 * Usage:
 * - v-permission="'user:create'" - Single permission
 * - v-permission="['user:create', 'user:edit']" - Any of the permissions
 * - v-permission.all="['user:create', 'user:edit']" - All permissions required
 */
const permissionDirective: Directive = {
  mounted(el, binding) {
    const { value, modifiers } = binding
    
    if (!value) {
      throw new Error('Permission value is required')
    }

    let hasAuth = false

    if (Array.isArray(value)) {
      // Multiple permissions
      if (modifiers.all) {
        // Require all permissions
        hasAuth = hasAllPermissions(value)
      } else {
        // Require any permission
        hasAuth = hasAnyPermission(value)
      }
    } else {
      // Single permission
      hasAuth = hasPermission(value)
    }

    if (!hasAuth) {
      // Remove element if no permission
      el.parentNode?.removeChild(el)
    }
  },
}

/**
 * Register permission directive
 */
export function setupPermissionDirective(app: App) {
  app.directive('permission', permissionDirective)
}

export default permissionDirective
