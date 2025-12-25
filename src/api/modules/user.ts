import { get, post, put, del } from '../index'

/**
 * User login interface
 */
export interface LoginParams {
  username: string
  password: string
}

/**
 * Login response
 */
export interface LoginResponse {
  token: string
  refreshToken: string
  userInfo: UserInfo
}

/**
 * User info interface
 */
export interface UserInfo {
  id: string
  username: string
  nickname: string
  email: string
  avatar?: string
  roles: string[]
  permissions: string[]
}

/**
 * User API module
 */
export const userApi = {
  /**
   * User login
   */
  login(data: LoginParams) {
    return post<LoginResponse>('/auth/login', data)
  },

  /**
   * User logout
   */
  logout() {
    return post('/auth/logout')
  },

  /**
   * Refresh access token
   */
  refreshToken(refreshToken: string) {
    return post<{ token: string; refreshToken: string }>('/auth/refresh', { refreshToken })
  },

  /**
   * Get current user info
   */
  getUserInfo() {
    return get<UserInfo>('/user/info')
  },

  /**
   * Update user info
   */
  updateUserInfo(data: Partial<UserInfo>) {
    return put<UserInfo>('/user/info', data)
  },

  /**
   * Change password
   */
  changePassword(data: { oldPassword: string; newPassword: string }) {
    return post('/user/password', data)
  },
}
