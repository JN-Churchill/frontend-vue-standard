import { defineStore } from 'pinia'
import { ref } from 'vue'
import { permissionApi } from '@/api/modules/permission'
import type { Permission, PermissionInput, PermissionUpdateInput, PermissionTreeNode } from '@/types/permission'
import { logger } from '@/utils/logger'

/**
 * Permission store for permission management
 */
export const usePermissionStore = defineStore('permission', () => {
  // State
  const permissions = ref<Permission[]>([])
  const permissionTree = ref<PermissionTreeNode[]>([])
  const currentPermission = ref<Permission | null>(null)
  const loading = ref(false)

  /**
   * Get permission list
   */
  const getPermissionList = async () => {
    try {
      loading.value = true
      const response = await permissionApi.getList()
      permissions.value = response.data
      logger.info('Permissions loaded successfully', response.data)
      return response
    } catch (error) {
      logger.error('Failed to load permissions', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * Get permission tree
   */
  const getPermissionTree = async () => {
    try {
      loading.value = true
      const response = await permissionApi.getTree()
      permissionTree.value = response.data
      logger.info('Permission tree loaded successfully', response.data)
      return response
    } catch (error) {
      logger.error('Failed to load permission tree', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * Get permission detail
   */
  const getPermissionDetail = async (id: number) => {
    try {
      loading.value = true
      const response = await permissionApi.getDetail(id)
      currentPermission.value = response.data
      logger.info('Permission detail loaded', response.data)
      return response
    } catch (error) {
      logger.error('Failed to load permission detail', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * Create permission
   */
  const createPermission = async (data: PermissionInput) => {
    try {
      loading.value = true
      const response = await permissionApi.create(data)
      logger.info('Permission created successfully', response.data)
      return response
    } catch (error) {
      logger.error('Failed to create permission', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * Update permission
   */
  const updatePermission = async (id: number, data: PermissionUpdateInput) => {
    try {
      loading.value = true
      const response = await permissionApi.update(id, data)
      logger.info('Permission updated successfully', response.data)
      return response
    } catch (error) {
      logger.error('Failed to update permission', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete permission
   */
  const deletePermission = async (id: number) => {
    try {
      loading.value = true
      await permissionApi.delete(id)
      logger.info('Permission deleted successfully', id)
    } catch (error) {
      logger.error('Failed to delete permission', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    permissions,
    permissionTree,
    currentPermission,
    loading,
    
    // Actions
    getPermissionList,
    getPermissionTree,
    getPermissionDetail,
    createPermission,
    updatePermission,
    deletePermission,
  }
})
