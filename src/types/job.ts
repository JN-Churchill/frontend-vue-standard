/**
 * Job (Scheduled Task) related types
 */

/**
 * Job entity
 */
export interface Job {
  jobName: string
  jobGroup: string
  description: string
  cronExpression: string
  status: number
  lastExecuteTime: string | null
  nextExecuteTime: string | null
  createTime: string
}

/**
 * Job status enum
 */
export enum JobStatus {
  Paused = 0,
  Running = 1,
}
