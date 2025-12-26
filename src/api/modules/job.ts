import { get, post, del } from '../index'
import type { Job } from '@/types/job'

/**
 * Job (Scheduled Task) API module
 */
export const jobApi = {
  /**
   * Get job list
   */
  getList() {
    return get<Job[]>('/Job/list')
  },

  /**
   * Pause job
   * @param jobName - Job name
   */
  pause(jobName: string) {
    return post(`/Job/${jobName}/pause`)
  },

  /**
   * Resume job
   * @param jobName - Job name
   */
  resume(jobName: string) {
    return post(`/Job/${jobName}/resume`)
  },

  /**
   * Trigger job manually
   * @param jobName - Job name
   */
  trigger(jobName: string) {
    return post(`/Job/${jobName}/trigger`)
  },

  /**
   * Delete job
   * @param jobName - Job name
   */
  delete(jobName: string) {
    return del(`/Job/${jobName}`)
  },
}
