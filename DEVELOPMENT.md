# DatArt 开发环境配置指南

## 环境要求

### 硬件要求
- 内存：至少 8GB RAM（推荐 16GB）
- 存储：至少 10GB 可用空间
- CPU：双核或以上

### 软件要求
- Docker Engine >= 20.10
- Docker Compose >= 1.29
- Git
- Node.js (本地开发可选)
- Java JDK 11 (本地开发可选)

## 快速启动指南

### 1. 克隆项目
```bash
git clone <repository-url>
cd datart
```

### 2. 启动开发环境
```bash
# 进入项目根目录
cd datart

# 启动所有服务
docker-compose -f docker-compose.dev.yml up -d
```

### 3. 服务访问地址
- 前端应用：http://localhost:3000
- 后端 API：http://localhost:8080
- MySQL 数据库：localhost:3306
- Redis 缓存：localhost:6379

### 4. 查看服务日志
```bash
# 查看所有服务日志
docker-compose -f docker-compose.dev.yml logs -f

# 查看特定服务日志
docker-compose -f docker-compose.dev.yml logs -f backend
```

### 5. 停止开发环境
```bash
# 停止所有服务
docker-compose -f docker-compose.dev.yml down

# 停止服务但保留数据卷
docker-compose -f docker-compose.dev.yml down -v
```

## 开发工作流

### 后端开发
- 源码修改会自动重新加载（需要配置 Spring Boot DevTools）
- 测试端点：http://localhost:8080/api/test

### 前端开发
- 源码修改会触发热重载
- 代理设置已配置，API 请求将转发到后端服务

### 数据库管理
- 默认数据库：datart
- 用户名：datart
- 密码：datart123

## 常见问题排查

### Q: 端口已被占用
A: 修改 `docker-compose.dev.yml` 中的端口映射，例如：
```yaml
ports:
  - "3307:3306"  # MySQL
  - "6380:6379"  # Redis
  - "8081:8080"  # Backend
  - "3001:3000"  # Frontend
```

### Q: 内存不足
A: 在 Docker 设置中增加内存分配，或减少服务资源限制：
```yaml
backend:
  deploy:
    resources:
      limits:
        memory: 2G
      reservations:
        memory: 1G
```

### Q: 构建失败
A: 清理 Docker 构建缓存：
```bash
docker builder prune -a
docker-compose -f docker-compose.dev.yml build --no-cache
```

### Q: 依赖下载缓慢
A: 配置国内镜像源：
```bash
# Maven 镜像配置
# 在 .mvn/maven.config 或 settings.xml 中添加阿里云镜像

# NPM 镜像配置
npm config set registry https://registry.npmmirror.com
```

### Q: 数据库连接失败
A: 确认 MySQL 服务状态：
```bash
docker-compose -f docker-compose.dev.yml logs mysql
docker exec -it datart-mysql-dev mysql -u datart -pdatart123 datart
```

### Q: 前端无法连接后端
A: 检查环境变量配置，确认 `REACT_APP_API_URL` 指向正确的后端地址。

## 开发工具配置

### IDE 推荐
- 后端：IntelliJ IDEA 或 Eclipse
- 前端：VS Code 或 WebStorm

### 调试配置
- 后端：通过暴露的 8080 端口进行远程调试
- 前端：使用浏览器开发者工具

## 数据持久化

开发环境中的数据卷：
- `mysql_data_dev`: MySQL 数据持久化
- `redis_data_dev`: Redis 数据持久化

如需清理数据：
```bash
docker volume rm datart_mysql_data_dev
docker volume rm datart_redis_data_dev
```