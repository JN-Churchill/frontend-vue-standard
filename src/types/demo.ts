/**
 * Demo related types
 */

/**
 * Demo DTO
 */
export interface DemoDto {
  id: number
  name: string
  description: string
  status: number
  sort: number
  createTime: string
}

/**
 * Demo input for creation
 */
export interface DemoInput {
  name: string
  description: string
  sort: number
}

/**
 * Demo update input
 */
export interface DemoUpdateInput {
  name: string
  description: string
  status: number
  sort: number
}
