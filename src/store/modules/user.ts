import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userApi } from '@/api/modules/user'
import type { LoginInput, UserDto } from '@/types/user'
import { removeStorage } from '@/utils/storage'
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
    const expiredTime = ref<number>(0)
    const userInfo = ref<UserDto | null>(null)
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
     * Set expired time
     */
    const setExpiredTime = (time: number) => {
      expiredTime.value = time
    }

    /**
     * Set user info
     */
    const setUserInfo = (info: UserDto) => {
      userInfo.value = info
    }

    /**
     * User login
     */
    const login = async (loginParams: LoginInput) => {
      try {
        const response = await userApi.login(loginParams)
        const { accessToken, refreshToken: refresh, expiredTime: expired, userInfo: info } = response.data

        setToken(accessToken)
        setRefreshToken(refresh)
        setExpiredTime(expired)
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
        // Clear all state
        token.value = ''
        refreshToken.value = ''
        expiredTime.value = 0
        userInfo.value = null
        permissions.value = []
        roles.value = []
        
        // Clear storage
        removeStorage('user')
        
        logger.info('User logged out')
      } catch (error) {
        logger.error('Logout error', error)
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
        const response = await userApi.refreshToken({
          refreshToken: refreshToken.value,
          accessToken: token.value,
        })
        const { accessToken: newToken, refreshToken: newRefreshToken, expiredTime: expired } = response.data

        setToken(newToken)
        setRefreshToken(newRefreshToken)
        setExpiredTime(expired)

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
      expiredTime,
      userInfo,
      permissions,
      roles,
      
      // Actions
      setToken,
      setRefreshToken,
      setExpiredTime,
      setUserInfo,
      login,
      logout,
      refreshAccessToken,
      hasPermission,
      hasRole,
      hasAnyRole,
    }
  },
  {
    persist: {
      key: 'user',
      storage: localStorage,
      paths: ['token', 'refreshToken', 'expiredTime', 'userInfo', 'permissions', 'roles'],
    },
  }
)
