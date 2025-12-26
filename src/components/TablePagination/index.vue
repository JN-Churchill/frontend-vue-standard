<template>
  <div class="table-pagination">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="pageSizes"
      :total="total"
      :background="background"
      :layout="layout"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  total: number
  page?: number
  size?: number
  pageSizes?: number[]
  background?: boolean
  layout?: string
}

interface Emits {
  (e: 'update:page', value: number): void
  (e: 'update:size', value: number): void
  (e: 'change', page: number, size: number): void
}

const props = withDefaults(defineProps<Props>(), {
  page: 1,
  size: 10,
  pageSizes: () => [10, 20, 50, 100],
  background: true,
  layout: 'total, sizes, prev, pager, next, jumper',
})

const emit = defineEmits<Emits>()

const currentPage = computed({
  get: () => props.page,
  set: (val: number) => emit('update:page', val),
})

const pageSize = computed({
  get: () => props.size,
  set: (val: number) => emit('update:size', val),
})

const handleSizeChange = (val: number) => {
  emit('change', 1, val)
}

const handleCurrentChange = (val: number) => {
  emit('change', val, pageSize.value)
}
</script>

<style scoped lang="scss">
.table-pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
