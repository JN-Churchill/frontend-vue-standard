import { defineStore } from 'pinia'
import { ref } from 'vue'
import { roleApi } from '@/api/modules/role'
import type { Role, RoleInput, RoleUpdateInput, AssignPermissionsInput } from '@/types/role'
import type { PageRequest } from '@/types/api'
import { logger } from '@/utils/logger'

/**
 * Role store for role management
 */
export const useRoleStore = defineStore('role', () => {
  // State
  const roles = ref<Role[]>([])
  const currentRole = ref<Role | null>(null)
  const loading = ref(false)

  /**
   * Get role list with pagination
   */
  const getRolePage = async (params: PageRequest) => {
    try {
      loading.value = true
      const response = await roleApi.getPage(params)
      roles.value = response.data.items
      logger.info('Roles loaded successfully', response.data)
      return response
    } catch (error) {
      logger.error('Failed to load roles', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * Get role detail
   */
  const getRoleDetail = async (id: number) => {
    try {
      loading.value = true
      const response = await roleApi.getDetail(id)
      currentRole.value = response.data
      logger.info('Role detail loaded', response.data)
      return response
    } catch (error) {
      logger.error('Failed to load role detail', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * Create role
   */
  const createRole = async (data: RoleInput) => {
    try {
      loading.value = true
      const response = await roleApi.create(data)
      logger.info('Role created successfully', response.data)
      return response
    } catch (error) {
      logger.error('Failed to create role', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * Update role
   */
  const updateRole = async (id: number, data: RoleUpdateInput) => {
    try {
      loading.value = true
      const response = await roleApi.update(id, data)
      logger.info('Role updated successfully', response.data)
      return response
    } catch (error) {
      logger.error('Failed to update role', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete role
   */
  const deleteRole = async (id: number) => {
    try {
      loading.value = true
      await roleApi.delete(id)
      logger.info('Role deleted successfully', id)
    } catch (error) {
      logger.error('Failed to delete role', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * Assign permissions to role
   */
  const assignPermissions = async (id: number, data: AssignPermissionsInput) => {
    try {
      loading.value = true
      await roleApi.assignPermissions(id, data)
      logger.info('Permissions assigned successfully', { roleId: id, data })
    } catch (error) {
      logger.error('Failed to assign permissions', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * Get role permissions
   */
  const getRolePermissions = async (id: number) => {
    try {
      loading.value = true
      const response = await roleApi.getPermissions(id)
      logger.info('Role permissions loaded', response.data)
      return response
    } catch (error) {
      logger.error('Failed to load role permissions', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    roles,
    currentRole,
    loading,
    
    // Actions
    getRolePage,
    getRoleDetail,
    createRole,
    updateRole,
    deleteRole,
    assignPermissions,
    getRolePermissions,
  }
})
