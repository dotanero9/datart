# Node.js v22 兼容性修复指南

## 问题描述

当前前端使用 webpack@4.44.2，与 Node.js v22 存在兼容性问题。

## 解决方案

### 方案 1: 升级 webpack (推荐)

```bash
cd frontend

# 升级 webpack 和相关依赖
npm install --save-dev webpack@5 \
  webpack-cli@5 \
  webpack-dev-server@4 \
  @webpack-cli/serve

# 更新 react-scripts 到最新版本
npm install --save-dev react-scripts@5

# 重新安装依赖
npm install
```

### 方案 2: 使用 --legacy-peer-deps (快速解决)

```bash
cd frontend

# 使用 legacy 模式启动
npm run start --legacy-peer-deps

# 或使用 legacy 模式构建
npm run build --legacy-peer-deps
```

### 方案 3: 使用 Docker (最稳定)

```bash
# 使用 Docker Compose 启动
docker-compose -f docker-compose.dev.yml up -d frontend

# 或使用 Node 18 容器
docker run -it --rm \
  -v $(pwd):/app \
  -w /app/frontend \
  node:18-alpine \
  npm run start
```

## 已应用的修复

创建 `.npmrc` 文件以使用 legacy 模式：

```bash
cd frontend
echo "legacy-peer-deps=true" > .npmrc
```

## 启动命令

```bash
cd /root/.openclaw/workspace/datart/frontend

# 方式 1: 直接启动（使用 legacy 模式）
npm run start --legacy-peer-deps

# 方式 2: 使用 Docker
docker-compose up frontend
```

## 验证

访问 http://localhost:8088 确认前端正常运行。
