# 开发指南

## 目录结构说明

### API 层 (`src/api/`)

API 层负责与后端通信，包含以下部分：

- **index.ts**: Axios 实例配置、请求/响应拦截器、全局错误处理
- **modules/**: 按业务模块组织的 API 接口

#### 添加新的 API 模块

```typescript
// src/api/modules/product.ts
import { get, post, put, del } from '../index'

export interface Product {
  id: string
  name: string
  price: number
}

export const productApi = {
  getList(params: any) {
    return get<Product[]>('/products', params)
  },
  
  getDetail(id: string) {
    return get<Product>(`/products/${id}`)
  },
  
  create(data: Partial<Product>) {
    return post<Product>('/products', data)
  },
  
  update(id: string, data: Partial<Product>) {
    return put<Product>(`/products/${id}`, data)
  },
  
  delete(id: string) {
    return del(`/products/${id}`)
  },
}
```

### 路由配置 (`src/router/`)

#### 添加新的路由模块

```typescript
// src/router/modules/product.ts
import { RouteRecordRaw } from 'vue-router'
import Layout from '@/components/Layout/Layout.vue'

const productRoutes: RouteRecordRaw[] = [
  {
    path: '/product',
    component: Layout,
    redirect: '/product/list',
    meta: {
      title: 'Product Management',
      icon: 'Goods',
    },
    children: [
      {
        path: 'list',
        name: 'ProductList',
        component: () => import('@/views/product/ProductList.vue'),
        meta: {
          title: 'Product List',
          requiresAuth: true,
          roles: ['admin', 'user'], // 可选：角色限制
        },
      },
    ],
  },
]

export default productRoutes
```

然后在 `src/router/index.ts` 中导入：

```typescript
import productRoutes from './modules/product'

const asyncRoutes: RouteRecordRaw[] = [
  ...demoRoutes,
  ...productRoutes,
  // ...
]
```

### 状态管理 (`src/store/`)

#### 创建新的 Store 模块

```typescript
// src/store/modules/product.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { productApi, type Product } from '@/api/modules/product'

export const useProductStore = defineStore(
  'product',
  () => {
    const products = ref<Product[]>([])
    const currentProduct = ref<Product | null>(null)
    
    const fetchProducts = async () => {
      const response = await productApi.getList({})
      products.value = response.data
    }
    
    return {
      products,
      currentProduct,
      fetchProducts,
    }
  },
  {
    persist: false, // 是否持久化
  }
)
```

### 组合式函数 (`src/hooks/`)

#### 创建自定义 Hook

```typescript
// src/hooks/useProduct.ts
import { ref } from 'vue'
import { productApi, type Product } from '@/api/modules/product'
import { useMessage } from '@/hooks'

export function useProduct() {
  const { success, error } = useMessage()
  const loading = ref(false)
  const products = ref<Product[]>([])
  
  const loadProducts = async () => {
    loading.value = true
    try {
      const response = await productApi.getList({})
      products.value = response.data
    } catch (err) {
      error('Failed to load products')
    } finally {
      loading.value = false
    }
  }
  
  return {
    loading,
    products,
    loadProducts,
  }
}
```

### 表单验证

#### 使用内置验证规则

```vue
<template>
  <el-form :model="form" :rules="rules">
    <el-form-item label="Email" prop="email">
      <el-input v-model="form.email" />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { FormRules } from 'element-plus'

const form = reactive({
  email: '',
})

const rules: FormRules = {
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    { type: 'email', message: 'Invalid email format', trigger: 'blur' },
  ],
}
</script>
```

#### 自定义验证规则

```typescript
const validatePhone = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error('Phone number is required'))
  } else if (!/^1[3-9]\d{9}$/.test(value)) {
    callback(new Error('Invalid phone number format'))
  } else {
    callback()
  }
}

const rules: FormRules = {
  phone: [
    { validator: validatePhone, trigger: 'blur' },
  ],
}
```

## 环境配置

### 环境变量

- `.env`: 所有环境通用
- `.env.development`: 开发环境
- `.env.production`: 生产环境

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:5000/api
```

使用环境变量：

```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL
```

### API 代理配置

在 `vite.config.ts` 中配置代理：

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

## 权限控制

### 路由级别权限

在路由 meta 中配置：

```typescript
{
  path: '/admin',
  meta: {
    requiresAuth: true,
    roles: ['admin', 'superadmin']
  }
}
```

### 组件级别权限

使用 `v-if` 配合 store：

```vue
<template>
  <el-button v-if="userStore.hasPermission('user:create')">
    Create User
  </el-button>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()
</script>
```

### 指令级别权限

使用自定义指令：

```vue
<template>
  <el-button v-permission="'user:create'">
    Create User
  </el-button>
</template>
```

## 国际化

### 添加新语言

```typescript
// src/locales/ja-JP.ts
export default {
  common: {
    confirm: '確認',
    cancel: 'キャンセル',
    // ...
  },
}
```

```typescript
// src/plugins/i18n.ts
import jaJP from '@/locales/ja-JP'

const i18n = createI18n({
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
    'ja-JP': jaJP,
  },
})
```

### 使用翻译

```vue
<template>
  <div>{{ t('common.confirm') }}</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
```

## 样式管理

### 全局样式

在 `src/styles/index.scss` 中添加：

```scss
// 自定义主题色
:root {
  --primary-color: #409eff;
  --success-color: #67c23a;
  --warning-color: #e6a23c;
  --danger-color: #f56c6c;
}

// 工具类
.mt-20 {
  margin-top: 20px;
}
```

### 组件样式

使用 scoped 样式：

```vue
<style scoped lang="scss">
.my-component {
  padding: 20px;
  
  .title {
    font-size: 20px;
    font-weight: bold;
  }
}
</style>
```

## 打包部署

### 构建生产版本

```bash
npm run build
```

构建产物在 `dist/` 目录。

### 预览构建

```bash
npm run preview
```

### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /path/to/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 常见问题

### Q: 如何处理 CORS 问题？

A: 在开发环境使用 Vite 代理，在生产环境配置 Nginx 反向代理。

### Q: 如何添加全局组件？

A: 在 `src/main.ts` 中注册：

```typescript
import MyComponent from './components/MyComponent.vue'

app.component('MyComponent', MyComponent)
```

### Q: 如何实现页面缓存？

A: 使用 Vue Router 的 keep-alive：

```vue
<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>
```

## 代码规范

### Commit Message 规范

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具相关

示例：
```
feat: add user management module
fix: resolve login redirect issue
docs: update API documentation
```

### 代码格式化

运行格式化：

```bash
npm run format
```

运行 ESLint：

```bash
npm run lint
```

## 性能优化

### 路由懒加载

```typescript
{
  path: '/user',
  component: () => import('@/views/User.vue')
}
```

### 组件懒加载

```vue
<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const HeavyComponent = defineAsyncComponent(
  () => import('./HeavyComponent.vue')
)
</script>
```

### 图片懒加载

使用 Element Plus 的 Image 组件：

```vue
<el-image :src="imageUrl" lazy />
```

## 测试

### 单元测试

建议使用 Vitest + Vue Test Utils（可选）。

### E2E 测试

建议使用 Playwright 或 Cypress（可选）。

---

更多问题请提交 Issue 或查看官方文档。
