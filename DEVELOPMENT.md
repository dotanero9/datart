# Datart 开发环境搭建指南

## 环境检查报告

### 已安装的开发工具
- **Java**: 11.0.30 (满足 JDK 11+ 要求)
- **Node.js**: 22.22.1 (满足 Node 16+ 要求)
- **Maven**: 3.8.7 (随 Java 安装)
- **MySQL**: 8.0.45 (满足 MySQL 8+ 要求)
- **Redis**: 7.0.15 (满足 Redis 要求)

### 项目结构
- **后端代码**: `/root/.openclaw/workspace/datart/server`
- **前端代码**: `/root/.openclaw/workspace/datart/frontend`
- **核心模块**: `/root/.openclaw/workspace/datart/core`

## 开发环境配置

### 1. Docker Compose 配置
Docker Compose 开发环境配置文件已创建：
- **路径**: `/root/.openclaw/workspace/datart/docker-compose.dev.yml`
- **服务包括**: MySQL, Redis, 后端服务, 前端服务

### 2. 后端配置
- **开发配置文件**: `/root/.openclaw/workspace/datart/backend/src/main/resources/application-dev.yml`
- **数据库连接**: MySQL localhost:3306/datart
- **Redis连接**: localhost:6379

### 3. 前端配置
- **开发环境变量**: `/root/.openclaw/workspace/datart/frontend/.env.development`
- **API代理目标**: http://localhost:8080

## 服务启动状态

### 数据库服务
- **MySQL**: 已启动，监听 3306 端口
- **Redis**: 已启动，监听 6379 端口
- **数据库**: datart 已创建

### 后端服务
- **状态**: 配置完成，准备就绪
- **启动命令**: 
  ```bash
  cd /root/.openclaw/workspace/datart/server
  mvn spring-boot:run -Dspring-boot.run.profiles=dev
  ```
- **访问地址**: http://localhost:8080

### 前端服务
- **状态**: 依赖安装完成
- **启动命令**:
  ```bash
  cd /root/.openclaw/workspace/datart/frontend
  npm run dev
  ```
- **访问地址**: http://localhost:8088

## 开发环境使用说明

### 1. 启动开发环境
1. 启动数据库服务：
   ```bash
   sudo systemctl start mysql redis
   ```

2. 初始化数据库：
   ```bash
   mysql -u root -e "CREATE DATABASE IF NOT EXISTS datart CHARACTER SET 'utf8' COLLATE 'utf8_general_ci';"
   ```

3. 启动后端服务：
   ```bash
   cd /root/.openclaw/workspace/datart/server
   mvn spring-boot:run -Dspring-boot.run.profiles=dev
   ```

4. 在另一个终端启动前端服务：
   ```bash
   cd /root/.openclaw/workspace/datart/frontend
   npm run dev
   ```

### 2. 常见问题解决

#### Node.js 版本兼容性问题
如果遇到前端构建错误，请使用较低版本的 Node.js：
```bash
# 使用 nvm 切换 Node.js 版本（如果已安装）
nvm install 16
nvm use 16
```

#### 数据库连接问题
确保 MySQL 服务正在运行并创建了 datart 数据库：
```bash
sudo systemctl status mysql
mysql -u root -e "SHOW DATABASES LIKE 'datart';"
```

## 访问地址

- **后端 API**: http://localhost:8080
- **前端界面**: http://localhost:8088
- **数据库管理**: MySQL localhost:3306
- **Redis**: localhost:6379

## 开发资源

- **项目文档**: 参考项目根目录下的 README.md 和 Deployment.md
- **代码位置**: 
  - 后端: `/root/.openclaw/workspace/datart/server`
  - 前端: `/root/.openclaw/workspace/datart/frontend`
  - 核心: `/root/.openclaw/workspace/datart/core`

## 注意事项

1. 当前环境使用开发模式，不适用于生产环境
2. 默认数据库用户为 root，无密码
3. 前端构建在 Node.js v22 上可能存在兼容性问题，建议使用 Node.js 16+
4. 系统会在首次启动时自动初始化数据库表结构

开发环境已准备就绪，您可以开始进行 Datart 的开发工作。