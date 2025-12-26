<template>
  <div class="role-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>角色管理</span>
          <el-button
            type="primary"
            @click="handleCreate"
          >
            新增角色
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
            placeholder="角色名称/编码"
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

      <!-- Table -->
      <el-table
        v-loading="loading"
        :data="tableData"
      >
        <el-table-column
          type="index"
          label="序号"
          width="60"
          :index="(index) => formatTableIndex(index, pagination.page, pagination.size)"
        />
        <el-table-column
          prop="roleName"
          label="角色名称"
        />
        <el-table-column
          prop="roleCode"
          label="角色编码"
        />
        <el-table-column
          prop="description"
          label="描述"
        />
        <el-table-column
          prop="sort"
          label="排序"
          width="100"
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
          width="250"
          fixed="right"
        >
          <template #default="{ row }">
            <el-button
              type="primary"
              link
              @click="handleAssignPermission(row)"
            >
              分配权限
            </el-button>
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

    <!-- Role form dialog -->
    <RoleForm
      v-model="dialogVisible"
      :role="currentRole"
      :is-edit="isEdit"
      @success="handleSuccess"
    />

    <!-- Permission tree dialog -->
    <PermissionTreeDialog
      v-model="permissionDialogVisible"
      :role="currentRole"
      @success="handleSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { roleApi } from '@/api/modules/role'
import type { Role } from '@/types/role'
import TablePagination from '@/components/TablePagination/index.vue'
import TableActions from '@/components/TableActions/index.vue'
import StatusTag from '@/components/StatusTag/index.vue'
import RoleForm from './components/RoleForm.vue'
import PermissionTreeDialog from './components/PermissionTreeDialog.vue'
import { formatTableIndex } from '@/utils/table'

const loading = ref(false)
const tableData = ref<Role[]>([])
const dialogVisible = ref(false)
const permissionDialogVisible = ref(false)
const isEdit = ref(false)
const currentRole = ref<Role | null>(null)

const searchForm = reactive({
  keyword: '',
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0,
})

/**
 * Load role list
 */
const loadRoles = async () => {
  try {
    loading.value = true
    const response = await roleApi.getPage({
      Page: pagination.page,
      PageSize: pagination.size,
    })
    tableData.value = response.data.items
    pagination.total = response.data.total
  } catch (error) {
    ElMessage.error('加载角色列表失败')
  } finally {
    loading.value = false
  }
}

/**
 * Handle search
 */
const handleSearch = () => {
  pagination.page = 1
  loadRoles()
}

/**
 * Handle reset
 */
const handleReset = () => {
  searchForm.keyword = ''
  pagination.page = 1
  loadRoles()
}

/**
 * Handle page change
 */
const handlePageChange = (page: number, size: number) => {
  pagination.page = page
  pagination.size = size
  loadRoles()
}

/**
 * Handle create
 */
const handleCreate = () => {
  isEdit.value = false
  currentRole.value = null
  dialogVisible.value = true
}

/**
 * Handle edit
 */
const handleEdit = (row: Role) => {
  isEdit.value = true
  currentRole.value = row
  dialogVisible.value = true
}

/**
 * Handle delete
 */
const handleDelete = async (row: Role) => {
  try {
    await ElMessageBox.confirm('确定要删除该角色吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    
    await roleApi.delete(row.id)
    ElMessage.success('删除成功')
    loadRoles()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

/**
 * Handle assign permission
 */
const handleAssignPermission = (row: Role) => {
  currentRole.value = row
  permissionDialogVisible.value = true
}

/**
 * Handle form success
 */
const handleSuccess = () => {
  dialogVisible.value = false
  permissionDialogVisible.value = false
  loadRoles()
}

onMounted(() => {
  loadRoles()
})
</script>

<style scoped lang="scss">
.role-management {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .search-form {
    margin-bottom: 16px;
  }
}
</style>
