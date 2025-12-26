import { get, post, put, del } from '../index'
import type { PagedResult, PageRequest, BatchDeleteRequest } from '@/types/api'
import type {
  UserDto,
  UserInput,
  UserUpdateInput,
  LoginInput,
  LoginOutput,
  RefreshTokenInput,
  RefreshTokenOutput,
} from '@/types/user'

/**
 * User API module
 */
export const userApi = {
  /**
   * User login
   * @param data - Login credentials
   */
  login(data: LoginInput) {
    return post<LoginOutput>('/User/login', data)
  },

  /**
   * Refresh access token
   * @param data - Refresh token data
   */
  refreshToken(data: RefreshTokenInput) {
    return post<RefreshTokenOutput>('/User/refresh-token', data)
  },

  /**
   * Get user list with pagination
   * @param params - Pagination parameters
   */
  getPage(params: PageRequest) {
    return get<PagedResult<UserDto>>('/User/page', params)
  },

  /**
   * Get user detail by id
   * @param id - User id
   */
  getDetail(id: number) {
    return get<UserDto>(`/User/${id}`)
  },

  /**
   * Create user
   * @param data - User creation data
   */
  create(data: UserInput) {
    return post<UserDto>('/User', data)
  },

  /**
   * Update user
   * @param id - User id
   * @param data - User update data
   */
  update(id: number, data: UserUpdateInput) {
    return put<UserDto>(`/User/${id}`, data)
  },

  /**
   * Delete user
   * @param id - User id
   */
  delete(id: number) {
    return del(`/User/${id}`)
  },

  /**
   * Batch delete users
   * @param data - Batch delete request with user ids
   */
  batchDelete(data: BatchDeleteRequest) {
    return del('/User/batch', data)
  },
}
