import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userApi, type LoginParams, type UserInfo } from '@/api/modules/user'
import { setStorage, getStorage, removeStorage } from '@/utils/storage'
import { logger } from '@/utils/logger'

/**
 * User store for authentication and user info management
 */
export const useUserStore = defineStore(
  'user',
  () => {
    // State
    const token = ref<string>('')
    const refreshToken = ref<string>('')
    const userInfo = ref<UserInfo | null>(null)
    const permissions = ref<string[]>([])
    const roles = ref<string[]>([])

    /**
     * Set token
     */
    const setToken = (newToken: string) => {
      token.value = newToken
    }

    /**
     * Set refresh token
     */
    const setRefreshToken = (newRefreshToken: string) => {
      refreshToken.value = newRefreshToken
    }

    /**
     * Set user info
     */
    const setUserInfo = (info: UserInfo) => {
      userInfo.value = info
      permissions.value = info.permissions || []
      roles.value = info.roles || []
    }

    /**
     * User login
     */
    const login = async (loginParams: LoginParams) => {
      try {
        const response = await userApi.login(loginParams)
        const { token: accessToken, refreshToken: refresh, userInfo: info } = response.data

        setToken(accessToken)
        setRefreshToken(refresh)
        setUserInfo(info)

        logger.info('User logged in successfully', info)
        return response
      } catch (error) {
        logger.error('Login failed', error)
        throw error
      }
    }

    /**
     * User logout
     */
    const logout = async () => {
      try {
        await userApi.logout()
      } catch (error) {
        logger.error('Logout error', error)
      } finally {
        // Clear all state
        token.value = ''
        refreshToken.value = ''
        userInfo.value = null
        permissions.value = []
        roles.value = []
        
        // Clear storage
        removeStorage('user')
        
        logger.info('User logged out')
      }
    }

    /**
     * Refresh access token
     */
    const refreshAccessToken = async () => {
      if (!refreshToken.value) {
        throw new Error('No refresh token available')
      }

      try {
        const response = await userApi.refreshToken(refreshToken.value)
        const { token: newToken, refreshToken: newRefreshToken } = response.data

        setToken(newToken)
        setRefreshToken(newRefreshToken)

        logger.info('Token refreshed successfully')
        return response
      } catch (error) {
        logger.error('Token refresh failed', error)
        // Clear tokens on refresh failure
        await logout()
        throw error
      }
    }

    /**
     * Get user info from server
     */
    const getUserInfo = async () => {
      try {
        const response = await userApi.getUserInfo()
        setUserInfo(response.data)
        return response
      } catch (error) {
        logger.error('Failed to get user info', error)
        throw error
      }
    }

    /**
     * Check if user has permission
     */
    const hasPermission = (permission: string): boolean => {
      return permissions.value.includes(permission)
    }

    /**
     * Check if user has role
     */
    const hasRole = (role: string): boolean => {
      return roles.value.includes(role)
    }

    /**
     * Check if user has any of the roles
     */
    const hasAnyRole = (roleList: string[]): boolean => {
      return roleList.some(role => roles.value.includes(role))
    }

    return {
      // State
      token,
      refreshToken,
      userInfo,
      permissions,
      roles,
      
      // Actions
      setToken,
      setRefreshToken,
      setUserInfo,
      login,
      logout,
      refreshAccessToken,
      getUserInfo,
      hasPermission,
      hasRole,
      hasAnyRole,
    }
  },
  {
    persist: {
      key: 'user',
      storage: localStorage,
      paths: ['token', 'refreshToken', 'userInfo', 'permissions', 'roles'],
    },
  }
)
