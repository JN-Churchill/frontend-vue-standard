<template>
  <div class="permission-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>权限管理</span>
          <el-button
            type="primary"
            @click="handleCreate"
          >
            新增权限
          </el-button>
        </div>
      </template>

      <!-- Table -->
      <el-table
        v-loading="loading"
        :data="tableData"
        row-key="id"
        :tree-props="{ children: 'children' }"
        default-expand-all
      >
        <el-table-column
          prop="permissionName"
          label="权限名称"
          width="200"
        />
        <el-table-column
          prop="permissionCode"
          label="权限编码"
          width="200"
        />
        <el-table-column
          prop="permissionType"
          label="权限类型"
          width="100"
        >
          <template #default="{ row }">
            <el-tag
              v-if="row.permissionType === 0"
              type="success"
            >
              菜单
            </el-tag>
            <el-tag
              v-else-if="row.permissionType === 1"
              type="primary"
            >
              按钮
            </el-tag>
            <el-tag
              v-else
              type="info"
            >
              其他
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="path"
          label="路径"
        />
        <el-table-column
          prop="icon"
          label="图标"
          width="80"
        >
          <template #default="{ row }">
            <el-icon v-if="row.icon">
              <component :is="row.icon" />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column
          prop="sort"
          label="排序"
          width="80"
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
    </el-card>

    <!-- Permission form dialog -->
    <PermissionForm
      v-model="dialogVisible"
      :permission="currentPermission"
      :is-edit="isEdit"
      :permission-tree="tableData"
      @success="handleSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { permissionApi } from '@/api/modules/permission'
import type { PermissionTreeNode } from '@/types/permission'
import TableActions from '@/components/TableActions/index.vue'
import StatusTag from '@/components/StatusTag/index.vue'
import PermissionForm from './components/PermissionForm.vue'

const loading = ref(false)
const tableData = ref<PermissionTreeNode[]>([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const currentPermission = ref<PermissionTreeNode | null>(null)

/**
 * Load permission tree
 */
const loadPermissions = async () => {
  try {
    loading.value = true
    const response = await permissionApi.getTree()
    tableData.value = response.data
  } catch (error) {
    ElMessage.error('加载权限列表失败')
  } finally {
    loading.value = false
  }
}

/**
 * Handle create
 */
const handleCreate = () => {
  isEdit.value = false
  currentPermission.value = null
  dialogVisible.value = true
}

/**
 * Handle edit
 */
const handleEdit = (row: PermissionTreeNode) => {
  isEdit.value = true
  currentPermission.value = row
  dialogVisible.value = true
}

/**
 * Handle delete
 */
const handleDelete = async (row: PermissionTreeNode) => {
  try {
    await ElMessageBox.confirm('确定要删除该权限吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    
    await permissionApi.delete(row.id)
    ElMessage.success('删除成功')
    loadPermissions()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

/**
 * Handle form success
 */
const handleSuccess = () => {
  dialogVisible.value = false
  loadPermissions()
}

onMounted(() => {
  loadPermissions()
})
</script>

<style scoped lang="scss">
.permission-management {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
