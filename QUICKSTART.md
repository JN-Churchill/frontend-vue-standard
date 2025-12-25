# 快速开始指南 (Quick Start Guide)

这是一个 5 分钟快速上手指南，帮助您快速了解和使用本模板。

## 📦 安装

```bash
# 克隆项目
git clone https://github.com/JN-Churchill/frontend-vue-standard.git
cd frontend-vue-standard

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

## 🎯 核心功能速览

### 1. 登录认证

打开 http://localhost:3000/login

默认测试账号：
- 用户名: `admin`
- 密码: `123456`

登录后会自动保存 Token，刷新页面仍然保持登录状态。

### 2. 查看示例页面

登录后会看到示例列表页面 (DemoList)，包含：
- 搜索功能
- 表格展示
- 分页控制
- 编辑和删除操作

点击"新增示例"或"编辑"按钮可以打开表单页面 (DemoForm)。

### 3. 国际化切换

当前支持中英文切换（功能已集成，需在 Layout 组件中添加切换按钮）。

## 🚀 开始开发

### 创建新页面

1. **创建 Vue 组件**

```vue
<!-- src/views/user/UserList.vue -->
<template>
  <div>
    <h1>User List</h1>
    <!-- 您的内容 -->
  </div>
</template>

<script setup lang="ts">
// 您的逻辑
</script>
```

2. **添加路由**

```typescript
// src/router/modules/user.ts
export default [
  {
    path: '/user',
    component: Layout,
    children: [
      {
        path: 'list',
        component: () => import('@/views/user/UserList.vue'),
        meta: { title: 'User List', requiresAuth: true }
      }
    ]
  }
]
```

3. **在路由入口导入**

```typescript
// src/router/index.ts
import userRoutes from './modules/user'

const asyncRoutes = [
  ...demoRoutes,
  ...userRoutes,  // 添加这行
  // ...
]
```

### 调用 API

1. **定义 API 接口**

```typescript
// src/api/modules/user.ts
import { get, post } from '../index'

export const userApi = {
  getList(params: any) {
    return get('/users', params)
  },
  
  create(data: any) {
    return post('/users', data)
  }
}
```

2. **在组件中使用**

```vue
<script setup lang="ts">
import { userApi } from '@/api/modules/user'
import { onMounted, ref } from 'vue'

const users = ref([])

onMounted(async () => {
  const response = await userApi.getList({ page: 1 })
  users.value = response.data
})
</script>
```

### 使用状态管理

```typescript
// 获取用户信息
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()
const userInfo = userStore.userInfo

// 检查权限
if (userStore.hasPermission('user:create')) {
  // 显示创建按钮
}
```

## 🔧 配置后端 API

### 开发环境

编辑 `.env.development`:

```bash
VITE_API_BASE_URL=http://localhost:5000/api
```

### 生产环境

编辑 `.env.production`:

```bash
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

### 后端响应格式要求

后端 API 应返回以下格式：

```json
{
  "code": 200,
  "success": true,
  "data": { },
  "message": "Success"
}
```

## 📝 常用命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 预览构建结果
npm run preview

# 代码检查
npm run lint

# 代码格式化
npm run format
```

## 🎨 自定义主题

编辑 `src/styles/index.scss`:

```scss
:root {
  --el-color-primary: #409eff;  // 主题色
  --el-color-success: #67c23a;  // 成功色
  // ...
}
```

## 📚 更多资源

- [完整文档](./README.md) - 详细的功能说明
- [开发指南](./DEVELOPMENT.md) - 开发最佳实践
- [更新日志](./CHANGELOG.md) - 版本历史

## ❓ 常见问题

### Q: 登录后没有跳转？

A: 检查后端 API 是否正确返回 token 和 userInfo。

### Q: API 请求 404？

A: 检查 `vite.config.ts` 中的代理配置和 `.env` 文件中的 API 地址。

### Q: 构建后白屏？

A: 检查路由模式是否为 history，如果是，需要配置服务器的 fallback。

### Q: Element Plus 样式不生效？

A: 确保已正确导入 Element Plus 样式，检查 `src/plugins/element-plus.ts`。

## 🤝 获取帮助

如果遇到问题：

1. 查看 [完整文档](./README.md)
2. 查看 [开发指南](./DEVELOPMENT.md)
3. 提交 [Issue](https://github.com/JN-Churchill/frontend-vue-standard/issues)

---

**祝您开发愉快！** 🎉
