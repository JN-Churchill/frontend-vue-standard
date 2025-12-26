<template>
  <div class="demo-form-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? t('demo.editDemo') : t('demo.addDemo') }}</span>
          <el-button
            link
            @click="goBack"
          >
            <el-icon><ArrowLeft /></el-icon>
            {{ t('common.back') }}
          </el-button>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        style="max-width: 600px"
      >
        <el-form-item
          :label="t('demo.name')"
          prop="name"
        >
          <el-input
            v-model="form.name"
            :placeholder="t('common.pleaseEnter')"
          />
        </el-form-item>

        <el-form-item
          :label="t('demo.description')"
          prop="description"
        >
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            :placeholder="t('common.pleaseEnter')"
          />
        </el-form-item>

        <el-form-item
          label="排序"
          prop="sort"
        >
          <el-input-number
            v-model="form.sort"
            :min="0"
          />
        </el-form-item>

        <el-form-item
          v-if="isEdit"
          :label="t('demo.status')"
          prop="status"
        >
          <el-radio-group v-model="form.status">
            <el-radio :label="1">
              Active
            </el-radio>
            <el-radio :label="0">
              Inactive
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            @click="handleSubmit"
          >
            {{ t('common.submit') }}
          </el-button>
          <el-button @click="handleReset">
            {{ t('common.reset') }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { FormInstance, FormRules } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { demoApi } from '@/api/modules/demo'
import type { DemoDto, DemoInput, DemoUpdateInput } from '@/types/demo'
import { useMessage } from '@/hooks'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const { success, error } = useMessage()

const formRef = ref<FormInstance>()
const loading = ref(false)
const isEdit = computed(() => !!route.params.id)

const form = reactive<Partial<DemoInput & DemoUpdateInput>>({
  name: '',
  description: '',
  sort: 0,
  status: 1,
})

const rules: FormRules = {
  name: [
    { required: true, message: t('validation.required'), trigger: 'blur' },
    { min: 2, max: 50, message: t('validation.minLength', { min: 2 }), trigger: 'blur' },
  ],
  description: [
    { required: true, message: t('validation.required'), trigger: 'blur' },
  ],
  status: [
    { required: true, message: t('validation.required'), trigger: 'change' },
  ],
}

// Load detail if editing
const loadDetail = async () => {
  if (!isEdit.value) return

  loading.value = true
  try {
    const response = await demoApi.getDetail(Number(route.params.id))
    Object.assign(form, response.data)
  } catch (err) {
    error('Failed to load data')
  } finally {
    loading.value = false
  }
}

// Handle submit
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    try {
      if (isEdit.value) {
        const updateData: DemoUpdateInput = {
          name: form.name!,
          description: form.description!,
          status: form.status!,
          sort: form.sort!,
        }
        await demoApi.update(Number(route.params.id), updateData)
      } else {
        const createData: DemoInput = {
          name: form.name!,
          description: form.description!,
          sort: form.sort!,
        }
        await demoApi.create(createData)
      }
      
      success(t('demo.saveSuccess'))
      goBack()
    } catch (err) {
      error('Failed to save')
    } finally {
      loading.value = false
    }
  })
}

// Handle reset
const handleReset = () => {
  formRef.value?.resetFields()
}

// Go back
const goBack = () => {
  router.back()
}

onMounted(() => {
  loadDetail()
})
</script>

<style scoped lang="scss">
.demo-form-container {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
