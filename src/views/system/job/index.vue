<template>
  <div class="job-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>定时任务管理</span>
          <el-button
            type="primary"
            @click="loadJobs"
          >
            刷新
          </el-button>
        </div>
      </template>

      <!-- Table -->
      <el-table
        v-loading="loading"
        :data="tableData"
      >
        <el-table-column
          type="index"
          label="序号"
          width="60"
        />
        <el-table-column
          prop="jobName"
          label="任务名称"
        />
        <el-table-column
          prop="jobGroup"
          label="任务组"
        />
        <el-table-column
          prop="description"
          label="描述"
        />
        <el-table-column
          prop="cronExpression"
          label="Cron表达式"
          width="150"
        />
        <el-table-column
          prop="status"
          label="状态"
          width="100"
        >
          <template #default="{ row }">
            <StatusTag
              :status="row.status"
              :status-map="{
                0: { text: '暂停', type: 'warning' },
                1: { text: '运行中', type: 'success' },
              }"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="lastExecuteTime"
          label="上次执行时间"
          width="180"
        >
          <template #default="{ row }">
            {{ row.lastExecuteTime || '-' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="nextExecuteTime"
          label="下次执行时间"
          width="180"
        >
          <template #default="{ row }">
            {{ row.nextExecuteTime || '-' }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="300"
          fixed="right"
        >
          <template #default="{ row }">
            <el-button
              v-if="row.status === 1"
              type="warning"
              link
              @click="handlePause(row)"
            >
              暂停
            </el-button>
            <el-button
              v-else
              type="success"
              link
              @click="handleResume(row)"
            >
              恢复
            </el-button>
            <el-button
              type="primary"
              link
              @click="handleTrigger(row)"
            >
              立即执行
            </el-button>
            <el-button
              type="danger"
              link
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { jobApi } from '@/api/modules/job'
import type { Job } from '@/types/job'
import StatusTag from '@/components/StatusTag/index.vue'

const loading = ref(false)
const tableData = ref<Job[]>([])

/**
 * Load job list
 */
const loadJobs = async () => {
  try {
    loading.value = true
    const response = await jobApi.getList()
    tableData.value = response.data
  } catch (error) {
    ElMessage.error('加载任务列表失败')
  } finally {
    loading.value = false
  }
}

/**
 * Handle pause
 */
const handlePause = async (row: Job) => {
  try {
    await ElMessageBox.confirm('确定要暂停该任务吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    
    await jobApi.pause(row.jobName)
    ElMessage.success('暂停成功')
    loadJobs()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('暂停失败')
    }
  }
}

/**
 * Handle resume
 */
const handleResume = async (row: Job) => {
  try {
    await ElMessageBox.confirm('确定要恢复该任务吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    
    await jobApi.resume(row.jobName)
    ElMessage.success('恢复成功')
    loadJobs()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('恢复失败')
    }
  }
}

/**
 * Handle trigger
 */
const handleTrigger = async (row: Job) => {
  try {
    await ElMessageBox.confirm('确定要立即执行该任务吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    
    await jobApi.trigger(row.jobName)
    ElMessage.success('执行成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('执行失败')
    }
  }
}

/**
 * Handle delete
 */
const handleDelete = async (row: Job) => {
  try {
    await ElMessageBox.confirm('确定要删除该任务吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    
    await jobApi.delete(row.jobName)
    ElMessage.success('删除成功')
    loadJobs()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

onMounted(() => {
  loadJobs()
})
</script>

<style scoped lang="scss">
.job-management {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
