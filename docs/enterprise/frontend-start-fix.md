# 前端启动修复 - Node.js v22 兼容性

## 问题原因

Node.js v17+ 使用了 OpenSSL 3.0，webpack 4 不支持新的 OpenSSL API。

## 解决方案

### 设置环境变量

在启动前设置 `NODE_OPTIONS`:

```bash
export NODE_OPTIONS=--openssl-legacy-provider
```

### 修改 package.json

在 `frontend/package.json` 的 scripts 中添加:

```json
{
  "scripts": {
    "start": "NODE_OPTIONS=--openssl-legacy-provider craco start",
    "build": "NODE_OPTIONS=--openssl-legacy-provider cross-env GENERATE_SOURCEMAP=false craco build"
  }
}
```

### 快速启动命令

```bash
cd /root/.openclaw/workspace/datart/frontend

# 方式 1: 临时设置环境变量
export NODE_OPTIONS=--openssl-legacy-provider
npm run start --legacy-peer-deps

# 方式 2: 一行命令
NODE_OPTIONS=--openssl-legacy-provider npm run start --legacy-peer-deps
```

## 已应用修复

创建 `.env.development` 文件:

```bash
cd frontend
echo "NODE_OPTIONS=--openssl-legacy-provider" > .env.development
```
