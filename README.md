# Vue 3 企业级前端标准模板

一个开箱即用的 Vue 3 + TypeScript 企业级前端模板，专为配合 C# Furion 后端 API 使用而设计。

## ✨ 特性

- 🚀 **现代技术栈**: Vue 3 + Vite + TypeScript + Pinia
- 🎨 **UI 组件库**: Element Plus 按需引入
- 🔐 **认证机制**: JWT + RefreshToken 自动刷新
- 🌍 **国际化**: 内置中英文支持
- 📦 **状态管理**: Pinia + 持久化存储
- 🛣️ **路由守卫**: 动态路由 + 权限控制
- 📝 **表单验证**: VeeValidate 集成
- 🔧 **工具函数**: 常用工具函数封装
- 📊 **日志系统**: 增强的控制台日志
- 🎯 **代码规范**: ESLint + Prettier

## 📚 技术栈

- **框架**: Vue 3.4+ (Composition API)
- **构建工具**: Vite 5
- **状态管理**: Pinia 2
- **路由**: Vue Router 4
- **UI 组件库**: Element Plus 2.5+
- **HTTP 请求**: Axios
- **表单验证**: VeeValidate 4
- **国际化**: Vue I18n 9
- **工具库**: dayjs, lodash-es
- **TypeScript**: 5.3+

## 🏗️ 项目结构

```
frontend-vue-standard/
├── public/                     # 静态资源
│   └── index.html             # HTML 模板
├── src/
│   ├── api/                   # API 接口封装
│   │   ├── index.ts           # Axios 实例和拦截器
│   │   └── modules/           # 业务接口模块
│   │       ├── user.ts        # 用户相关接口
│   │       └── demo.ts        # 示例接口
│   ├── assets/                # 资源文件
│   ├── components/            # 全局组件
│   │   ├── Form/              # 表单组件
│   │   ├── Table/             # 表格组件
│   │   └── Layout/            # 布局组件
│   │       └── Layout.vue     # 主布局组件
│   ├── hooks/                 # 组合式函数
│   │   └── index.ts           # 通用 Hooks
│   ├── locales/               # 国际化文件
│   │   ├── zh-CN.ts           # 中文
│   │   └── en-US.ts           # 英文
│   ├── plugins/               # 插件配置
│   │   ├── element-plus.ts    # Element Plus 配置
│   │   └── i18n.ts            # 国际化配置
│   ├── router/                # 路由配置
│   │   ├── index.ts           # 路由入口
│   │   └── modules/           # 业务路由模块
│   │       └── demo.ts        # 示例路由
│   ├── store/                 # 状态管理
│   │   ├── index.ts           # Pinia 入口
│   │   └── modules/           # 业务状态模块
│   │       ├── user.ts        # 用户状态
│   │       └── app.ts         # 应用状态
│   ├── styles/                # 全局样式
│   │   └── index.scss         # 全局样式文件
│   ├── utils/                 # 工具函数
│   │   ├── storage.ts         # 存储工具
│   │   ├── logger.ts          # 日志工具
│   │   ├── helpers.ts         # 通用工具函数
│   │   └── validation.ts      # 表单验证规则
│   ├── views/                 # 页面组件
│   │   ├── Login.vue          # 登录页
│   │   ├── NotFound.vue       # 404 页面
│   │   └── demo/              # 示例模块
│   │       ├── DemoList.vue   # 列表页
│   │       └── DemoForm.vue   # 表单页
│   ├── App.vue                # 根组件
│   └── main.ts                # 应用入口
├── .env                       # 环境变量
├── .env.development           # 开发环境变量
├── .env.production            # 生产环境变量
├── .eslintrc.cjs              # ESLint 配置
├── .prettierrc.json           # Prettier 配置
├── .gitignore                 # Git 忽略配置
├── package.json               # 项目依赖
├── tsconfig.json              # TypeScript 配置
├── tsconfig.node.json         # Node TypeScript 配置
├── vite.config.ts             # Vite 配置
└── README.md                  # 项目说明
```

## 🚀 快速开始

### 环境要求

- Node.js 18+ 
- npm 9+ 或 pnpm 8+

### 安装依赖

```bash
npm install
```

### 开发环境启动

```bash
npm run dev
```

访问 http://localhost:3000

### 生产环境打包

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

### 代码检查和格式化

```bash
# ESLint 检查
npm run lint

# Prettier 格式化
npm run format
```

## 🔧 核心功能

### 1. 路由守卫 & 权限控制

- 基于 JWT Token 的登录状态验证
- 动态路由加载
- 角色权限控制 (meta.roles)
- 自动重定向到登录页

**示例:**

```typescript
// 在路由 meta 中配置权限
{
  path: '/admin',
  meta: {
    requiresAuth: true,
    roles: ['admin', 'superadmin']
  }
}
```

### 2. Axios 全局封装

- 自动附加 Authorization Header
- 请求/响应拦截器
- Token 过期自动刷新 (RefreshToken 机制)
- 统一错误处理
- 加载进度条 (NProgress)

**使用示例:**

```typescript
import { get, post } from '@/api'

// GET 请求
const data = await get('/users')

// POST 请求
const result = await post('/users', { name: 'John' })
```

### 3. 状态管理 (Pinia)

**用户状态管理:**
- JWT Token 管理
- 用户信息存储
- 权限和角色管理
- 自动持久化到 localStorage

**应用状态管理:**
- 全局 Loading 状态
- 侧边栏折叠状态
- 语言切换
- 主题切换

**使用示例:**

```typescript
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()

// 登录
await userStore.login({ username, password })

// 检查权限
const hasAccess = userStore.hasPermission('user:create')
```

### 4. Element Plus 集成

- 按需自动导入
- 全局图标注册
- 主题定制支持
- 中文语言包

### 5. 表单验证

使用 VeeValidate 提供的验证规则:

- required: 必填
- email: 邮箱格式
- phone: 手机号格式
- minLength: 最小长度
- maxLength: 最大长度
- pattern: 正则表达式
- confirmed: 确认匹配

**使用示例:**

```typescript
const rules = {
  username: [
    { required: true, message: '用户名必填' },
    { minLength: 3, message: '用户名至少3个字符' }
  ],
  email: [
    { required: true, message: '邮箱必填' },
    { email: true, message: '邮箱格式不正确' }
  ]
}
```

### 6. 国际化

内置中英文支持，可轻松扩展其他语言:

```typescript
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

// 使用翻译
const title = t('common.confirm')

// 切换语言
locale.value = 'en-US'
```

### 7. 工具函数

提供常用工具函数:

```typescript
import {
  dateFormat,      // 日期格式化
  deepClone,       // 深拷贝
  debounce,        // 防抖
  throttle,        // 节流
  generateId,      // 生成唯一 ID
  downloadFile,    // 下载文件
  isEmpty,         // 判断空值
} from '@/utils/helpers'
```

### 8. 持久化存储

封装的存储工具支持:

```typescript
import { setStorage, getStorage, removeStorage } from '@/utils/storage'

// 设置存储（支持过期时间）
setStorage('key', value, { expire: 3600000 }) // 1小时后过期

// 获取存储
const value = getStorage('key')

// 删除存储
removeStorage('key')
```

### 9. 日志系统

增强的控制台日志:

```typescript
import { logger } from '@/utils/logger'

logger.info('Info message')
logger.warn('Warning message')
logger.error('Error message')
```

### 10. 自定义 Hooks

提供常用的组合式函数:

```typescript
import { useTable, useForm, useConfirm, useMessage } from '@/hooks'

// 表格 Hook
const { loading, tableData, total, page, pageSize } = useTable()

// 表单 Hook
const { formLoading, formVisible, openForm, closeForm } = useForm()

// 确认对话框
const { confirm } = useConfirm()

// 消息提示
const { success, error, warning, info } = useMessage()
```

## 🔐 JWT 认证流程

1. **登录**: 用户登录成功后，后端返回 `token` 和 `refreshToken`
2. **存储**: Token 存储在 Pinia Store 中，并持久化到 localStorage
3. **请求**: 每次 API 请求自动携带 `Authorization: Bearer {token}`
4. **刷新**: Token 过期时，自动使用 `refreshToken` 获取新的 token
5. **登出**: 清除所有 token 和用户信息，重定向到登录页

## 🎨 主题定制

Element Plus 支持主题定制，可在 `src/styles/` 目录下创建主题文件:

```scss
// 修改主题色
:root {
  --el-color-primary: #409eff;
}
```

## 📝 代码规范

### 命名规范

- **组件**: PascalCase (例: `DemoList.vue`)
- **工具函数**: camelCase (例: `dateFormat`)
- **常量**: UPPER_CASE (例: `API_BASE_URL`)
- **变量/函数**: camelCase

### 注释规范

所有公共函数、组件、接口都应该有清晰的注释:

```typescript
/**
 * Get user list
 * @param params Query parameters
 * @returns User list
 */
export function getUserList(params: QueryParams) {
  return get('/users', params)
}
```

## 🔌 与 Furion 后端集成

### API 响应格式

后端应返回以下格式的响应:

```json
{
  "code": 200,
  "success": true,
  "data": {},
  "message": "Success"
}
```

### 配置代理

在 `vite.config.ts` 中配置代理:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',  // Furion 后端地址
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

### 环境变量

在 `.env.development` 和 `.env.production` 中配置不同环境的 API 地址。

## 📦 打包优化

- **代码分割**: 自动分割 Vue、Element Plus 和工具库
- **按需加载**: 路由懒加载
- **Tree Shaking**: 自动删除未使用的代码
- **资源压缩**: Terser 压缩 JavaScript

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 📧 联系方式

如有问题或建议，请提交 Issue。

---

**开始你的 Vue 3 企业级项目吧！** 🎉
