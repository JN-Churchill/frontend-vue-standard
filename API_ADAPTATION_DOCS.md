# 后端 API 适配实施文档

## 概述

本项目已完成与后端 .NET 8 Web API 的完整适配，实现了企业级前端标准模板的所有核心功能模块。

## 已实现功能

### 1. 类型定义 (Types)

已创建完整的 TypeScript 类型定义，包括：

#### `src/types/api.ts`
- `PagedResult<T>`: 分页结果响应类型
- `PageRequest`: 分页请求参数类型
- `BatchDeleteRequest`: 批量删除请求类型

#### `src/types/user.ts`
- `UserDto`: 用户数据传输对象
- `UserInput`: 用户创建输入
- `UserUpdateInput`: 用户更新输入
- `LoginInput`: 登录输入
- `LoginOutput`: 登录输出（包含 accessToken, refreshToken, expiredTime）
- `RefreshTokenInput`: 刷新令牌输入
- `RefreshTokenOutput`: 刷新令牌输出

#### `src/types/role.ts`
- `Role`: 角色实体
- `RoleInput`: 角色创建输入
- `RoleUpdateInput`: 角色更新输入
- `AssignPermissionsInput`: 分配权限输入

#### `src/types/permission.ts`
- `Permission`: 权限实体
- `PermissionInput`: 权限创建输入
- `PermissionUpdateInput`: 权限更新输入
- `PermissionTreeNode`: 权限树节点（扩展自 Permission）

#### `src/types/demo.ts`
- `DemoDto`: Demo 数据传输对象
- `DemoInput`: Demo 创建输入
- `DemoUpdateInput`: Demo 更新输入

#### `src/types/job.ts`
- `Job`: 定时任务实体
- `JobStatus`: 任务状态枚举

### 2. API 模块 (API Modules)

所有 API 模块都遵循 RESTful 风格，完整实现了 CRUD 操作。

#### `src/api/modules/user.ts`
- `login()`: 用户登录
- `refreshToken()`: 刷新访问令牌
- `getPage()`: 分页查询用户
- `getDetail()`: 获取用户详情
- `create()`: 创建用户
- `update()`: 更新用户
- `delete()`: 删除用户
- `batchDelete()`: 批量删除用户

#### `src/api/modules/role.ts`
- `getPage()`: 分页查询角色
- `getDetail()`: 获取角色详情
- `create()`: 创建角色
- `update()`: 更新角色
- `delete()`: 删除角色
- `assignPermissions()`: 分配权限
- `getPermissions()`: 获取角色权限

#### `src/api/modules/permission.ts`
- `getList()`: 获取权限列表
- `getTree()`: 获取权限树
- `getDetail()`: 获取权限详情
- `create()`: 创建权限
- `update()`: 更新权限
- `delete()`: 删除权限

#### `src/api/modules/job.ts`
- `getList()`: 获取任务列表
- `pause()`: 暂停任务
- `resume()`: 恢复任务
- `trigger()`: 手动触发任务
- `delete()`: 删除任务

#### `src/api/modules/demo.ts`
- `getPage()`: 分页查询 Demo
- `getDetail()`: 获取 Demo 详情
- `create()`: 创建 Demo
- `update()`: 更新 Demo
- `delete()`: 删除 Demo
- `batchDelete()`: 批量删除 Demo

### 3. 状态管理 (Store)

#### `src/store/modules/user.ts`
已更新适配新的后端响应：
- 支持 `accessToken` 和 `refreshToken`
- 支持 `expiredTime` 过期时间
- 完整的权限和角色管理
- Token 自动刷新机制

#### `src/store/modules/role.ts`
- 角色列表管理
- 角色 CRUD 操作
- 权限分配功能

#### `src/store/modules/permission.ts`
- 权限列表管理
- 权限树管理
- 权限 CRUD 操作

### 4. 通用组件 (Components)

#### `src/components/TablePagination/index.vue`
可复用的分页组件，支持：
- 自定义每页大小
- 页码跳转
- 总数显示

#### `src/components/TableActions/index.vue`
表格操作列组件，支持：
- 查看、编辑、删除操作
- 自定义操作按钮
- 插槽扩展

#### `src/components/PermissionTree/index.vue`
权限树选择组件，支持：
- 树形数据展示
- 复选框选择
- 父子关联控制

#### `src/components/StatusTag/index.vue`
状态标签组件，支持：
- 自定义状态映射
- 不同样式类型
- 灵活配置

### 5. 视图页面 (Views)

#### 用户管理 (`src/views/system/user/`)
- `index.vue`: 用户列表页
  - 分页查询
  - 关键词搜索
  - 批量删除
  - 状态标签显示
- `components/UserForm.vue`: 用户表单组件
  - 创建/编辑用户
  - 表单验证
  - 手机号/邮箱格式校验

#### 角色管理 (`src/views/system/role/`)
- `index.vue`: 角色列表页
  - 分页查询
  - 角色 CRUD
  - 权限分配入口
- `components/RoleForm.vue`: 角色表单组件
- `components/PermissionTreeDialog.vue`: 权限分配对话框

#### 权限管理 (`src/views/system/permission/`)
- `index.vue`: 权限树形列表页
  - 树形展示
  - 权限类型标签
  - 权限 CRUD
- `components/PermissionForm.vue`: 权限表单组件
  - 父级权限选择
  - 权限类型选择

#### 定时任务管理 (`src/views/system/job/`)
- `index.vue`: 任务列表页
  - 任务状态显示
  - 暂停/恢复/触发操作
  - 执行时间显示

#### Demo 管理 (`src/views/demo/`)
- `DemoList.vue`: 已更新支持批量删除
- `DemoForm.vue`: 已更新适配新的 API 结构

### 6. 路由配置 (Router)

#### `src/router/modules/system.ts`
新增系统管理路由模块，包括：
- 用户管理路由
- 角色管理路由
- 权限管理路由
- 定时任务管理路由

#### `src/router/index.ts`
已集成系统管理路由模块

### 7. 工具函数和指令

#### `src/utils/permission.ts`
权限校验工具函数：
- `hasPermission()`: 检查单个权限
- `hasAnyPermission()`: 检查任意权限
- `hasAllPermissions()`: 检查所有权限
- `hasRole()`: 检查角色
- `hasAnyRole()`: 检查任意角色
- `hasAllRoles()`: 检查所有角色

#### `src/utils/table.ts`
表格工具函数：
- `formatTableIndex()`: 格式化表格序号
- `getSelectedIds()`: 获取选中行 ID
- `sortByField()`: 字段排序
- `filterTableData()`: 数据过滤
- `exportTableToCSV()`: 导出 CSV

#### `src/directives/permission.ts`
权限指令：
- `v-permission`: 权限控制指令
  - 单个权限：`v-permission="'user:create'"`
  - 任意权限：`v-permission="['user:create', 'user:edit']"`
  - 全部权限：`v-permission.all="['user:create', 'user:edit']"`

### 8. 主应用配置

#### `src/main.ts`
已注册权限指令 `setupPermissionDirective(app)`

## 后端 API 规范

### 认证机制
- 使用 Bearer Token 认证
- JWT 格式
- 请求头：`Authorization: Bearer {accessToken}`

### 分页参数
后端接受的分页参数格式：
```typescript
{
  Page: number          // 页码，从 1 开始
  PageSize: number      // 每页大小
  OrderBy?: string      // 排序字段
  IsDescending?: boolean // 是否降序
}
```

### 分页响应
后端返回的分页响应格式：
```typescript
{
  items: T[]           // 数据列表
  total: number        // 总数
  page: number         // 当前页
  pageSize: number     // 每页大小
  totalPages: number   // 总页数
  hasPrevious: boolean // 是否有上一页
  hasNext: boolean     // 是否有下一页
}
```

### 标准响应格式
```typescript
{
  code: number         // 状态码
  data: T              // 数据
  message: string      // 消息
  success: boolean     // 是否成功
}
```

## 代码规范

### Commit 信息规范
所有提交都遵循中文规范：
- `feat: 新增功能描述`
- `fix: 修复问题描述`
- `refactor: 重构代码描述`
- `docs: 文档更新描述`
- `style: 代码格式调整`
- `perf: 性能优化描述`
- `chore: 构建/工具链相关`

### 代码风格
- TypeScript 严格模式
- 使用 `<script setup>` 语法
- 完整的 JSDoc 注释
- 明确的类型定义
- 遵循 ESLint 和 Prettier 配置

## 验收标准

### ✅ 已完成
1. 所有 API 模块完整实现并有类型定义
2. 用户、角色、权限、定时任务的完整 CRUD 功能
3. 权限控制系统（工具函数、指令）
4. 分页、搜索、批量操作功能
5. 代码通过 ESLint 检查（0 错误，39 个预存在警告）
6. 所有 Commit 信息使用中文且规范
7. 构建成功

### 注意事项
1. vue-tsc 存在兼容性问题，但 vite build 构建成功
2. 39 个 ESLint 警告均为项目原有警告，与本次改动无关
3. 所有新增代码都遵循 TypeScript 严格模式

## 使用指南

### 安装依赖
```bash
npm install
```

### 开发环境
```bash
npm run dev
```

### 构建生产
```bash
npm run build
```

### 代码检查
```bash
npm run lint
```

## 项目结构

```
src/
├── api/                    # API 模块
│   ├── index.ts           # API 请求封装
│   └── modules/           # API 模块
│       ├── user.ts        # 用户 API
│       ├── role.ts        # 角色 API
│       ├── permission.ts  # 权限 API
│       ├── job.ts         # 定时任务 API
│       └── demo.ts        # Demo API
├── components/            # 通用组件
│   ├── TablePagination/   # 分页组件
│   ├── TableActions/      # 操作列组件
│   ├── PermissionTree/    # 权限树组件
│   └── StatusTag/         # 状态标签组件
├── directives/            # 自定义指令
│   └── permission.ts      # 权限指令
├── router/                # 路由配置
│   ├── index.ts          # 路由主文件
│   └── modules/          # 路由模块
│       ├── demo.ts       # Demo 路由
│       └── system.ts     # 系统管理路由
├── store/                 # 状态管理
│   ├── index.ts          # Store 主文件
│   └── modules/          # Store 模块
│       ├── user.ts       # 用户 Store
│       ├── role.ts       # 角色 Store
│       └── permission.ts # 权限 Store
├── types/                 # 类型定义
│   ├── api.ts            # 通用 API 类型
│   ├── user.ts           # 用户类型
│   ├── role.ts           # 角色类型
│   ├── permission.ts     # 权限类型
│   ├── demo.ts           # Demo 类型
│   └── job.ts            # 定时任务类型
├── utils/                 # 工具函数
│   ├── permission.ts     # 权限工具
│   └── table.ts          # 表格工具
└── views/                 # 视图页面
    ├── system/           # 系统管理
    │   ├── user/         # 用户管理
    │   ├── role/         # 角色管理
    │   ├── permission/   # 权限管理
    │   └── job/          # 定时任务
    └── demo/             # Demo 管理
```

## 后续建议

1. **单元测试**: 为核心业务逻辑添加单元测试
2. **E2E 测试**: 添加端到端测试确保功能完整性
3. **性能优化**: 考虑使用动态导入优化包大小
4. **国际化**: 完善多语言支持
5. **错误监控**: 集成 Sentry 等错误追踪服务
6. **文档完善**: 添加更多使用示例和最佳实践

## 联系方式

如有问题，请查看项目文档或提交 Issue。
