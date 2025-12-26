<template>
  <el-dialog
    :model-value="modelValue"
    :title="isEdit ? '编辑权限' : '新增权限'"
    width="600px"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item
        label="权限名称"
        prop="permissionName"
      >
        <el-input
          v-model="formData.permissionName"
          placeholder="请输入权限名称"
        />
      </el-form-item>
      
      <el-form-item
        label="权限编码"
        prop="permissionCode"
      >
        <el-input
          v-model="formData.permissionCode"
          placeholder="请输入权限编码"
        />
      </el-form-item>
      
      <el-form-item
        label="权限类型"
        prop="permissionType"
      >
        <el-radio-group v-model="formData.permissionType">
          <el-radio :label="0">
            菜单
          </el-radio>
          <el-radio :label="1">
            按钮
          </el-radio>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item
        label="父级权限"
        prop="parentId"
      >
        <el-tree-select
          v-model="formData.parentId"
          :data="permissionTreeOptions"
          :props="{ label: 'permissionName', value: 'id' }"
          placeholder="请选择父级权限"
          clearable
          check-strictly
        />
      </el-form-item>
      
      <el-form-item
        label="路径"
        prop="path"
      >
        <el-input
          v-model="formData.path"
          placeholder="请输入路径"
        />
      </el-form-item>
      
      <el-form-item
        label="组件"
        prop="component"
      >
        <el-input
          v-model="formData.component"
          placeholder="请输入组件路径"
        />
      </el-form-item>
      
      <el-form-item
        label="图标"
        prop="icon"
      >
        <el-input
          v-model="formData.icon"
          placeholder="请输入图标名称"
        />
      </el-form-item>
      
      <el-form-item
        label="排序"
        prop="sort"
      >
        <el-input-number
          v-model="formData.sort"
          :min="0"
        />
      </el-form-item>
      
      <el-form-item
        v-if="isEdit"
        label="状态"
        prop="status"
      >
        <el-radio-group v-model="formData.status">
          <el-radio :label="1">
            启用
          </el-radio>
          <el-radio :label="0">
            禁用
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

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
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { permissionApi } from '@/api/modules/permission'
import type { Permission, PermissionInput, PermissionUpdateInput, PermissionTreeNode } from '@/types/permission'

interface Props {
  modelValue: boolean
  permission: Permission | null
  isEdit: boolean
  permissionTree: PermissionTreeNode[]
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'success'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formRef = ref<FormInstance>()
const loading = ref(false)

const formData = reactive<Partial<PermissionInput & PermissionUpdateInput>>({
  permissionName: '',
  permissionCode: '',
  permissionType: 0,
  parentId: 0,
  path: '',
  component: '',
  icon: '',
  sort: 0,
  status: 1,
})

const rules: FormRules = {
  permissionName: [
    { required: true, message: '请输入权限名称', trigger: 'blur' },
  ],
  permissionCode: [
    { required: true, message: '请输入权限编码', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_:]+$/, message: '权限编码只能包含字母、数字、下划线和冒号', trigger: 'blur' },
  ],
  permissionType: [
    { required: true, message: '请选择权限类型', trigger: 'change' },
  ],
  sort: [
    { required: true, message: '请输入排序', trigger: 'blur' },
  ],
}

/**
 * Compute permission tree options
 */
const permissionTreeOptions = computed(() => {
  return [
    { id: 0, permissionName: '顶级权限', children: props.permissionTree },
  ]
})

/**
 * Watch permission prop to populate form
 */
watch(
  () => props.permission,
  (permission) => {
    if (permission) {
      formData.permissionName = permission.permissionName
      formData.permissionCode = permission.permissionCode
      formData.permissionType = permission.permissionType
      formData.parentId = permission.parentId
      formData.path = permission.path
      formData.component = permission.component
      formData.icon = permission.icon
      formData.sort = permission.sort
      formData.status = permission.status
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

/**
 * Reset form
 */
const resetForm = () => {
  formData.permissionName = ''
  formData.permissionCode = ''
  formData.permissionType = 0
  formData.parentId = 0
  formData.path = ''
  formData.component = ''
  formData.icon = ''
  formData.sort = 0
  formData.status = 1
  formRef.value?.clearValidate()
}

/**
 * Handle close
 */
const handleClose = () => {
  emit('update:modelValue', false)
  resetForm()
}

/**
 * Handle submit
 */
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    if (props.isEdit && props.permission) {
      // Update permission
      const updateData: PermissionUpdateInput = {
        permissionName: formData.permissionName!,
        permissionCode: formData.permissionCode!,
        permissionType: formData.permissionType!,
        parentId: formData.parentId!,
        path: formData.path!,
        component: formData.component!,
        icon: formData.icon!,
        sort: formData.sort!,
        status: formData.status!,
      }
      await permissionApi.update(props.permission.id, updateData)
      ElMessage.success('更新成功')
    } else {
      // Create permission
      const createData: PermissionInput = {
        permissionName: formData.permissionName!,
        permissionCode: formData.permissionCode!,
        permissionType: formData.permissionType!,
        parentId: formData.parentId!,
        path: formData.path!,
        component: formData.component!,
        icon: formData.icon!,
        sort: formData.sort!,
      }
      await permissionApi.create(createData)
      ElMessage.success('创建成功')
    }

    emit('success')
  } catch (error) {
    console.error('Form validation or submission failed:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
</style>
