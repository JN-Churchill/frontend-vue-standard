<template>
  <el-tree
    ref="treeRef"
    :data="treeData"
    :props="defaultProps"
    :show-checkbox="true"
    :check-strictly="checkStrictly"
    :default-checked-keys="checkedKeys"
    :default-expanded-keys="expandedKeys"
    node-key="id"
    @check="handleCheck"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ElTree } from 'element-plus'
import type { PermissionTreeNode } from '@/types/permission'

interface Props {
  treeData: PermissionTreeNode[]
  checkedKeys?: number[]
  expandedKeys?: number[]
  checkStrictly?: boolean
}

interface Emits {
  (e: 'update:checkedKeys', keys: number[]): void
  (e: 'change', checkedKeys: number[], checkedNodes: PermissionTreeNode[]): void
}

const props = withDefaults(defineProps<Props>(), {
  checkedKeys: () => [],
  expandedKeys: () => [],
  checkStrictly: false,
})

const emit = defineEmits<Emits>()

const treeRef = ref<InstanceType<typeof ElTree>>()

const defaultProps = {
  children: 'children',
  label: 'permissionName',
}

const handleCheck = () => {
  if (!treeRef.value) return
  
  const checkedKeys = treeRef.value.getCheckedKeys(false) as number[]
  const checkedNodes = treeRef.value.getCheckedNodes(false) as PermissionTreeNode[]
  
  emit('update:checkedKeys', checkedKeys)
  emit('change', checkedKeys, checkedNodes)
}

watch(
  () => props.checkedKeys,
  (newKeys) => {
    if (treeRef.value) {
      treeRef.value.setCheckedKeys(newKeys)
    }
  }
)

defineExpose({
  getCheckedKeys: () => treeRef.value?.getCheckedKeys(false) as number[],
  getCheckedNodes: () => treeRef.value?.getCheckedNodes(false) as PermissionTreeNode[],
  setCheckedKeys: (keys: number[]) => treeRef.value?.setCheckedKeys(keys),
})
</script>

<style scoped lang="scss">
</style>
