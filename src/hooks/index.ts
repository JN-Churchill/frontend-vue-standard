import { ref, Ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'

/**
 * Table hook for common table operations
 */
export function useTable<T = any>() {
  const loading = ref(false)
  const tableData = ref<T[]>([]) as Ref<T[]>
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(10)

  /**
   * Handle page change
   */
  const handlePageChange = (newPage: number) => {
    page.value = newPage
  }

  /**
   * Handle page size change
   */
  const handleSizeChange = (newSize: number) => {
    pageSize.value = newSize
    page.value = 1
  }

  /**
   * Reset pagination
   */
  const resetPagination = () => {
    page.value = 1
    total.value = 0
  }

  return {
    loading,
    tableData,
    total,
    page,
    pageSize,
    handlePageChange,
    handleSizeChange,
    resetPagination,
  }
}

/**
 * Form hook for common form operations
 */
export function useForm() {
  const formLoading = ref(false)
  const formVisible = ref(false)

  /**
   * Open form dialog
   */
  const openForm = () => {
    formVisible.value = true
  }

  /**
   * Close form dialog
   */
  const closeForm = () => {
    formVisible.value = false
  }

  return {
    formLoading,
    formVisible,
    openForm,
    closeForm,
  }
}

/**
 * Confirm dialog hook
 */
export function useConfirm() {
  /**
   * Show confirm dialog
   */
  const confirm = (
    message: string,
    title = 'Confirm',
    options?: {
      confirmButtonText?: string
      cancelButtonText?: string
      type?: 'success' | 'warning' | 'info' | 'error'
    }
  ): Promise<Action> => {
    return ElMessageBox.confirm(message, title, {
      confirmButtonText: options?.confirmButtonText || 'Confirm',
      cancelButtonText: options?.cancelButtonText || 'Cancel',
      type: options?.type || 'warning',
    })
  }

  return {
    confirm,
  }
}

/**
 * Message hook
 */
export function useMessage() {
  const success = (message: string) => {
    ElMessage.success(message)
  }

  const error = (message: string) => {
    ElMessage.error(message)
  }

  const warning = (message: string) => {
    ElMessage.warning(message)
  }

  const info = (message: string) => {
    ElMessage.info(message)
  }

  return {
    success,
    error,
    warning,
    info,
  }
}
