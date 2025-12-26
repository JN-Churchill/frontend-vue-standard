<template>
  <el-tag :type="tagType" :effect="effect">
    {{ statusText }}
  </el-tag>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  status: number
  statusMap?: Record<number, { text: string; type: 'success' | 'info' | 'warning' | 'danger' }>
  effect?: 'light' | 'dark' | 'plain'
}

const props = withDefaults(defineProps<Props>(), {
  statusMap: () => ({
    0: { text: '禁用', type: 'info' },
    1: { text: '启用', type: 'success' },
  }),
  effect: 'light',
})

const tagType = computed(() => {
  return props.statusMap[props.status]?.type || 'info'
})

const statusText = computed(() => {
  return props.statusMap[props.status]?.text || '未知'
})
</script>

<style scoped lang="scss">
</style>
