<template>
  <div class="table-actions">
    <el-button
      v-if="showView"
      type="primary"
      :icon="View"
      link
      @click="emit('view', row)"
    >
      查看
    </el-button>
    <el-button
      v-if="showEdit"
      type="primary"
      :icon="Edit"
      link
      @click="emit('edit', row)"
    >
      编辑
    </el-button>
    <el-button
      v-if="showDelete"
      type="danger"
      :icon="Delete"
      link
      @click="emit('delete', row)"
    >
      删除
    </el-button>
    <slot :row="row"></slot>
  </div>
</template>

<script setup lang="ts">
import { View, Edit, Delete } from '@element-plus/icons-vue'

interface Props {
  row: any
  showView?: boolean
  showEdit?: boolean
  showDelete?: boolean
}

interface Emits {
  (e: 'view', row: any): void
  (e: 'edit', row: any): void
  (e: 'delete', row: any): void
}

withDefaults(defineProps<Props>(), {
  showView: false,
  showEdit: true,
  showDelete: true,
})

const emit = defineEmits<Emits>()
</script>

<style scoped lang="scss">
.table-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
