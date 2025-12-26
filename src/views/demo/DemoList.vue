<template>
  <div class="demo-list-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ t('demo.list') }}</span>
          <el-button
            type="primary"
            @click="handleAdd"
          >
            <el-icon><Plus /></el-icon>
            {{ t('demo.addDemo') }}
          </el-button>
        </div>
      </template>

      <!-- Search form -->
      <el-form
        :inline="true"
        :model="searchForm"
        class="search-form"
      >
        <el-form-item :label="t('demo.name')">
          <el-input
            v-model="searchForm.keyword"
            :placeholder="t('common.pleaseEnter')"
            clearable
            @clear="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="handleSearch"
          >
            <el-icon><Search /></el-icon>
            {{ t('common.search') }}
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            {{ t('common.reset') }}
          </el-button>
        </el-form-item>
      </el-form>

      <!-- Table -->
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column
          prop="id"
          label="ID"
          width="100"
        />
        <el-table-column
          prop="name"
          :label="t('demo.name')"
        />
        <el-table-column
          prop="description"
          :label="t('demo.description')"
        />
        <el-table-column
          prop="status"
          :label="t('demo.status')"
          width="100"
        >
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? 'Active' : 'Inactive' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          :label="t('demo.createTime')"
          width="180"
        >
          <template #default="{ row }">
            {{ dateFormat(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column
          :label="t('demo.operations')"
          width="200"
          fixed="right"
        >
          <template #default="{ row }">
            <el-button
              type="primary"
              link
              @click="handleEdit(row)"
            >
              <el-icon><Edit /></el-icon>
              {{ t('common.edit') }}
            </el-button>
            <el-button
              type="danger"
              link
              @click="handleDelete(row)"
            >
              <el-icon><Delete /></el-icon>
              {{ t('common.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessageBox } from 'element-plus'
import { Plus, Search, Refresh, Edit, Delete } from '@element-plus/icons-vue'
import { demoApi, type DemoItem } from '@/api/modules/demo'
import { useTable, useMessage } from '@/hooks'
import { dateFormat } from '@/utils/helpers'

const { t } = useI18n()
const router = useRouter()
const { success, error } = useMessage()
const { loading, tableData, total, page, pageSize, handlePageChange, handleSizeChange, resetPagination } = useTable<DemoItem>()

const searchForm = reactive({
  keyword: '',
})

// Load demo list
const loadList = async () => {
  loading.value = true
  try {
    const response = await demoApi.getList({
      page: page.value,
      pageSize: pageSize.value,
      keyword: searchForm.keyword,
    })
    tableData.value = response.data.list
    total.value = response.data.total
  } catch (err) {
    error('Failed to load data')
  } finally {
    loading.value = false
  }
}

// Handle search
const handleSearch = () => {
  resetPagination()
  loadList()
}

// Handle reset
const handleReset = () => {
  searchForm.keyword = ''
  handleSearch()
}

// Handle add
const handleAdd = () => {
  router.push('/demo/form')
}

// Handle edit
const handleEdit = (row: DemoItem) => {
  router.push(`/demo/form/${row.id}`)
}

// Handle delete
const handleDelete = async (row: DemoItem) => {
  try {
    await ElMessageBox.confirm(
      t('demo.deleteConfirm'),
      'Warning',
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning',
      }
    )
    
    await demoApi.delete(row.id)
    success(t('demo.deleteSuccess'))
    loadList()
  } catch (err) {
    // User cancelled or error occurred
  }
}

onMounted(() => {
  loadList()
})
</script>

<style scoped lang="scss">
.demo-list-container {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .search-form {
    margin-bottom: 20px;
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
