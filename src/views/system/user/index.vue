<template>
  <div class="user-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button
            type="primary"
            @click="handleCreate"
          >
            新增用户
          </el-button>
        </div>
      </template>

      <!-- Search form -->
      <el-form
        :inline="true"
        :model="searchForm"
        class="search-form"
      >
        <el-form-item label="关键词">
          <el-input
            v-model="searchForm.keyword"
            placeholder="用户名/姓名"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="handleSearch"
          >
            查询
          </el-button>
          <el-button @click="handleReset">
            重置
          </el-button>
        </el-form-item>
      </el-form>

      <!-- Batch operations -->
      <div class="batch-operations">
        <el-button
          type="danger"
          :disabled="!selectedRows.length"
          @click="handleBatchDelete"
        >
          批量删除
        </el-button>
        <span class="selected-tip">已选择 {{ selectedRows.length }} 项</span>
      </div>

      <!-- Table -->
      <el-table
        v-loading="loading"
        :data="tableData"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          type="index"
          label="序号"
          width="60"
          :index="(index) => formatTableIndex(index, pagination.page, pagination.size)"
        />
        <el-table-column
          prop="userName"
          label="用户名"
        />
        <el-table-column
          prop="realName"
          label="真实姓名"
        />
        <el-table-column
          prop="phone"
          label="手机号"
        />
        <el-table-column
          prop="email"
          label="邮箱"
        />
        <el-table-column
          prop="status"
          label="状态"
          width="100"
        >
          <template #default="{ row }">
            <StatusTag :status="row.status" />
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="180"
        />
        <el-table-column
          label="操作"
          width="180"
          fixed="right"
        >
          <template #default="{ row }">
            <TableActions
              :row="row"
              @edit="handleEdit"
              @delete="handleDelete"
            />
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <TablePagination
        :total="pagination.total"
        :page="pagination.page"
        :size="pagination.size"
        @change="handlePageChange"
      />
    </el-card>

    <!-- User form dialog -->
    <UserForm
      v-model="dialogVisible"
      :user="currentUser"
      :is-edit="isEdit"
      @success="handleSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { userApi } from '@/api/modules/user'
import type { UserDto } from '@/types/user'
import TablePagination from '@/components/TablePagination/index.vue'
import TableActions from '@/components/TableActions/index.vue'
import StatusTag from '@/components/StatusTag/index.vue'
import UserForm from './components/UserForm.vue'
import { formatTableIndex } from '@/utils/table'

const loading = ref(false)
const tableData = ref<UserDto[]>([])
const selectedRows = ref<UserDto[]>([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const currentUser = ref<UserDto | null>(null)

const searchForm = reactive({
  keyword: '',
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0,
})

/**
 * Load user list
 */
const loadUsers = async () => {
  try {
    loading.value = true
    const response = await userApi.getPage({
      Page: pagination.page,
      PageSize: pagination.size,
    })
    tableData.value = response.data.items
    pagination.total = response.data.total
  } catch (error) {
    ElMessage.error('加载用户列表失败')
  } finally {
    loading.value = false
  }
}

/**
 * Handle search
 */
const handleSearch = () => {
  pagination.page = 1
  loadUsers()
}

/**
 * Handle reset
 */
const handleReset = () => {
  searchForm.keyword = ''
  pagination.page = 1
  loadUsers()
}

/**
 * Handle page change
 */
const handlePageChange = (page: number, size: number) => {
  pagination.page = page
  pagination.size = size
  loadUsers()
}

/**
 * Handle selection change
 */
const handleSelectionChange = (selection: UserDto[]) => {
  selectedRows.value = selection
}

/**
 * Handle create
 */
const handleCreate = () => {
  isEdit.value = false
  currentUser.value = null
  dialogVisible.value = true
}

/**
 * Handle edit
 */
const handleEdit = (row: UserDto) => {
  isEdit.value = true
  currentUser.value = row
  dialogVisible.value = true
}

/**
 * Handle delete
 */
const handleDelete = async (row: UserDto) => {
  try {
    await ElMessageBox.confirm('确定要删除该用户吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    
    await userApi.delete(row.id)
    ElMessage.success('删除成功')
    loadUsers()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

/**
 * Handle batch delete
 */
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 个用户吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    
    const ids = selectedRows.value.map(row => row.id)
    await userApi.batchDelete({ ids })
    ElMessage.success('批量删除成功')
    loadUsers()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
    }
  }
}

/**
 * Handle form success
 */
const handleSuccess = () => {
  dialogVisible.value = false
  loadUsers()
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped lang="scss">
.user-management {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .search-form {
    margin-bottom: 16px;
  }

  .batch-operations {
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 16px;

    .selected-tip {
      color: #909399;
      font-size: 14px;
    }
  }
}
</style>
