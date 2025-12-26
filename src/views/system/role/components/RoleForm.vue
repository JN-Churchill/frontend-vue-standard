<template>
  <el-dialog
    :model-value="modelValue"
    :title="isEdit ? '编辑角色' : '新增角色'"
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
        label="角色名称"
        prop="roleName"
      >
        <el-input
          v-model="formData.roleName"
          placeholder="请输入角色名称"
        />
      </el-form-item>
      
      <el-form-item
        label="角色编码"
        prop="roleCode"
      >
        <el-input
          v-model="formData.roleCode"
          :disabled="isEdit"
          placeholder="请输入角色编码"
        />
      </el-form-item>
      
      <el-form-item
        label="描述"
        prop="description"
      >
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="3"
          placeholder="请输入描述"
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
import { ref, reactive, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { roleApi } from '@/api/modules/role'
import type { Role, RoleInput, RoleUpdateInput } from '@/types/role'

interface Props {
  modelValue: boolean
  role: Role | null
  isEdit: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'success'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formRef = ref<FormInstance>()
const loading = ref(false)

const formData = reactive<Partial<RoleInput & RoleUpdateInput>>({
  roleName: '',
  roleCode: '',
  description: '',
  sort: 0,
  status: 1,
})

const rules: FormRules = {
  roleName: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
  ],
  roleCode: [
    { required: true, message: '请输入角色编码', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '角色编码只能包含字母、数字和下划线', trigger: 'blur' },
  ],
  description: [
    { required: true, message: '请输入描述', trigger: 'blur' },
  ],
  sort: [
    { required: true, message: '请输入排序', trigger: 'blur' },
  ],
}

/**
 * Watch role prop to populate form
 */
watch(
  () => props.role,
  (role) => {
    if (role) {
      formData.roleName = role.roleName
      formData.roleCode = role.roleCode
      formData.description = role.description
      formData.sort = role.sort
      formData.status = role.status
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
  formData.roleName = ''
  formData.roleCode = ''
  formData.description = ''
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

    if (props.isEdit && props.role) {
      // Update role
      const updateData: RoleUpdateInput = {
        roleName: formData.roleName!,
        roleCode: formData.roleCode!,
        description: formData.description!,
        sort: formData.sort!,
        status: formData.status!,
      }
      await roleApi.update(props.role.id, updateData)
      ElMessage.success('更新成功')
    } else {
      // Create role
      const createData: RoleInput = {
        roleName: formData.roleName!,
        roleCode: formData.roleCode!,
        description: formData.description!,
        sort: formData.sort!,
      }
      await roleApi.create(createData)
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
