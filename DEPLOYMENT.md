# 部署指南

## 环境配置

项目使用不同的环境变量文件来管理不同环境的配置：

### 开发环境 (`.env.development`)
```bash
# 使用相对路径，通过 Vite 代理转发
VITE_API_BASE_URL=/api

# 开发服务器地址（用于 Vite 代理配置）
VITE_DEV_SERVER_URL=http://192.168.5.112:5000
```

开发环境运行：
```bash
npm run dev
```

### 生产环境 (`.env.production`)
```bash
# 配置实际的后端 API 地址
VITE_API_BASE_URL=http://192.168.5.112:5000/api
```

## 部署步骤

### 1. 修改生产环境配置

编辑 `.env.production` 文件，修改 `VITE_API_BASE_URL` 为实际的后端地址：

```bash
# 示例 1: 使用 HTTPS 域名
VITE_API_BASE_URL=https://api.yourdomain.com/api

# 示例 2: 使用 HTTP IP 地址
VITE_API_BASE_URL=http://192.168.5.112:5000/api

# 示例 3: 同域部署（前后端同一域名）
VITE_API_BASE_URL=/api
```

### 2. 构建生产版本

```bash
npm run build
```

构建完成后，会在 `dist` 目录生成静态文件。

### 3. 部署静态文件

将 `dist` 目录的内容部署到你的 Web 服务器（Nginx、Apache、IIS 等）。

#### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/dist;
    index index.html;

    # 处理前端路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 如果使用相对路径 /api，需要代理到后端
    location /api {
        proxy_pass http://192.168.5.112:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 不同部署场景

### 场景 1: 前后端分离部署（不同域名）

**配置：**
```bash
# .env.production
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

**特点：**
- 前端部署在 `https://www.yourdomain.com`
- 后端部署在 `https://api.yourdomain.com`
- 后端需要配置 CORS 支持跨域

### 场景 2: 同域部署（通过 Nginx 代理）

**配置：**
```bash
# .env.production
VITE_API_BASE_URL=/api
```

**Nginx 配置：**
```nginx
location / {
    root /path/to/dist;
    try_files $uri $uri/ /index.html;
}

location /api {
    proxy_pass http://localhost:5000;
}
```

**特点：**
- 前后端使用同一域名
- 通过 Nginx 代理 `/api` 到后端
- 无跨域问题

### 场景 3: Docker 部署

**Dockerfile 示例：**
```dockerfile
# 构建阶段
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG API_URL=http://localhost:5000/api
RUN echo "VITE_API_BASE_URL=$API_URL" > .env.production
RUN npm run build

# 运行阶段
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**构建时指定 API 地址：**
```bash
docker build --build-arg API_URL=https://api.yourdomain.com/api -t frontend-app .
```

## 环境变量说明

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `VITE_API_BASE_URL` | 后端 API 基础地址 | `https://api.yourdomain.com/api` |
| `VITE_DEV_SERVER_URL` | 开发环境代理目标（仅开发环境使用） | `http://192.168.5.112:5000` |

## 验证部署

1. 访问前端地址，打开浏览器控制台
2. 尝试登录，检查网络请求
3. 确认 API 请求地址正确
4. 检查是否有 CORS 错误

## 常见问题

### Q: 部署后登录失败，提示跨域错误
A: 检查后端 CORS 配置，确保允许前端域名访问。

### Q: 部署后所有页面刷新都是 404
A: Web 服务器需要配置将所有请求指向 `index.html`（参考上面的 Nginx 配置）。

### Q: 如何在不重新构建的情况下修改 API 地址？
A: 可以使用运行时配置。在 `public` 目录创建 `config.js`，在 `index.html` 中加载，然后在代码中读取。

## 更多信息

- [Vite 部署文档](https://vitejs.dev/guide/static-deploy.html)
- [Vite 环境变量](https://vitejs.dev/guide/env-and-mode.html)
