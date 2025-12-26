<template>
  <el-dialog
    :model-value="modelValue"
    title="分配权限"
    width="600px"
    @close="handleClose"
  >
    <el-alert
      type="info"
      :closable="false"
      style="margin-bottom: 16px;"
    >
      为角色"{{ role?.roleName }}"分配权限
    </el-alert>

    <PermissionTree
      ref="permissionTreeRef"
      v-loading="loading"
      :tree-data="permissionTree"
      :checked-keys="checkedKeys"
      :expanded-keys="expandedKeys"
    />

    <template #footer>
      <el-button @click="handleClose">
        取消
      </el-button>
      <el-button
        type="primary"
        :loading="loading"
        @click="handleSubmit"
      >
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { roleApi } from '@/api/modules/role'
import { permissionApi } from '@/api/modules/permission'
import type { Role } from '@/types/role'
import type { PermissionTreeNode } from '@/types/permission'
import PermissionTree from '@/components/PermissionTree/index.vue'

interface Props {
  modelValue: boolean
  role: Role | null
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'success'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const permissionTreeRef = ref<InstanceType<typeof PermissionTree>>()
const loading = ref(false)
const permissionTree = ref<PermissionTreeNode[]>([])
const checkedKeys = ref<number[]>([])
const expandedKeys = ref<number[]>([])

/**
 * Load permission tree
 */
const loadPermissionTree = async () => {
  try {
    loading.value = true
    const response = await permissionApi.getTree()
    permissionTree.value = response.data
    
    // Auto expand first level
    expandedKeys.value = response.data.map(item => item.id)
  } catch (error) {
    ElMessage.error('加载权限树失败')
  } finally {
    loading.value = false
  }
}

/**
 * Load role permissions
 */
const loadRolePermissions = async (roleId: number) => {
  try {
    loading.value = true
    const response = await roleApi.getPermissions(roleId)
    checkedKeys.value = response.data
  } catch (error) {
    ElMessage.error('加载角色权限失败')
  } finally {
    loading.value = false
  }
}

/**
 * Watch role change
 */
watch(
  () => props.role,
  async (role) => {
    if (role) {
      await loadPermissionTree()
      await loadRolePermissions(role.id)
    }
  },
  { immediate: true }
)

/**
 * Handle close
 */
const handleClose = () => {
  emit('update:modelValue', false)
}

/**
 * Handle submit
 */
const handleSubmit = async () => {
  if (!props.role || !permissionTreeRef.value) return

  try {
    loading.value = true
    const permissionIds = permissionTreeRef.value.getCheckedKeys()
    await roleApi.assignPermissions(props.role.id, { permissionIds })
    ElMessage.success('分配权限成功')
    emit('success')
  } catch (error) {
    ElMessage.error('分配权限失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
</style>
