/**
 * User related types
 */

/**
 * User DTO
 */
export interface UserDto {
  id: number
  userName: string
  realName: string
  phone: string
  email: string
  avatar: string
  status: number
  createTime: string
  lastLoginTime: string | null
}

/**
 * User input for creation
 */
export interface UserInput {
  userName: string
  password: string
  realName: string
  phone: string
  email: string
}

/**
 * User update input
 */
export interface UserUpdateInput {
  realName: string
  phone: string
  email: string
  avatar: string
  status: number
}

/**
 * Login input
 */
export interface LoginInput {
  userName: string
  password: string
}

/**
 * Login output
 */
export interface LoginOutput {
  accessToken: string
  refreshToken: string
  expiredTime: number
  userInfo: UserDto
}

/**
 * Refresh token input
 */
export interface RefreshTokenInput {
  refreshToken: string
  accessToken: string
}

/**
 * Refresh token output
 */
export interface RefreshTokenOutput {
  accessToken: string
  refreshToken: string
  expiredTime: number
}
