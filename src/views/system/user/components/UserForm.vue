<template>
  <el-dialog
    :model-value="modelValue"
    :title="isEdit ? '编辑用户' : '新增用户'"
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
        label="用户名"
        prop="userName"
      >
        <el-input
          v-model="formData.userName"
          :disabled="isEdit"
          placeholder="请输入用户名"
        />
      </el-form-item>
      
      <el-form-item
        v-if="!isEdit"
        label="密码"
        prop="password"
      >
        <el-input
          v-model="formData.password"
          type="password"
          placeholder="请输入密码"
          show-password
        />
      </el-form-item>
      
      <el-form-item
        label="真实姓名"
        prop="realName"
      >
        <el-input
          v-model="formData.realName"
          placeholder="请输入真实姓名"
        />
      </el-form-item>
      
      <el-form-item
        label="手机号"
        prop="phone"
      >
        <el-input
          v-model="formData.phone"
          placeholder="请输入手机号"
        />
      </el-form-item>
      
      <el-form-item
        label="邮箱"
        prop="email"
      >
        <el-input
          v-model="formData.email"
          placeholder="请输入邮箱"
        />
      </el-form-item>
      
      <el-form-item
        v-if="isEdit"
        label="头像"
        prop="avatar"
      >
        <el-input
          v-model="formData.avatar"
          placeholder="请输入头像URL"
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
import { userApi } from '@/api/modules/user'
import type { UserDto, UserInput, UserUpdateInput } from '@/types/user'

interface Props {
  modelValue: boolean
  user: UserDto | null
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

const formData = reactive<Partial<UserInput & UserUpdateInput>>({
  userName: '',
  password: '',
  realName: '',
  phone: '',
  email: '',
  avatar: '',
  status: 1,
})

const rules: FormRules = {
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于 6 个字符', trigger: 'blur' },
  ],
  realName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
  ],
}

/**
 * Watch user prop to populate form
 */
watch(
  () => props.user,
  (user) => {
    if (user) {
      formData.userName = user.userName
      formData.realName = user.realName
      formData.phone = user.phone
      formData.email = user.email
      formData.avatar = user.avatar
      formData.status = user.status
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
  formData.userName = ''
  formData.password = ''
  formData.realName = ''
  formData.phone = ''
  formData.email = ''
  formData.avatar = ''
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

    if (props.isEdit && props.user) {
      // Update user
      const updateData: UserUpdateInput = {
        realName: formData.realName!,
        phone: formData.phone!,
        email: formData.email!,
        avatar: formData.avatar || '',
        status: formData.status!,
      }
      await userApi.update(props.user.id, updateData)
      ElMessage.success('更新成功')
    } else {
      // Create user
      const createData: UserInput = {
        userName: formData.userName!,
        password: formData.password!,
        realName: formData.realName!,
        phone: formData.phone!,
        email: formData.email!,
      }
      await userApi.create(createData)
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
