# BI 数据分析程序改造 - 详细任务清单

**项目：** datart 企业级改造  
**版本：** v1.0.0  
**创建日期：** 2026-03-17  
**预计周期：** 13-18 周

---

## 阶段一：基础改造（第 1-6 周）

### 1.1 项目准备与环境搭建（第 1-2 周）

#### 任务 1.1.1: Fork 与仓库配置
- [ ] Fork datart 仓库到组织账户
- [ ] 创建开发分支 `feat/enterprise-edition`
- [ ] 配置分支保护规则
- [ ] 设置 CI/CD 流水线
- [ ] 创建项目看板（GitHub Projects）

**交付物：**
- 私有仓库地址
- 分支策略文档
- CI/CD 配置

**技术细节：**
```bash
# 分支策略
main            # 生产环境
release/*       # 发布分支
feat/*          # 功能分支
hotfix/*        # 热修复分支
```

---

#### 任务 1.1.2: 开发环境搭建
- [ ] 本地开发环境配置（JDK 11+, Node.js 16+, MySQL 8+）
- [ ] Docker Compose 开发环境
- [ ] IDE 配置（IntelliJ IDEA + VSCode）
- [ ] 代码规范配置（Checkstyle + ESLint）
- [ ] 单元测试环境

**交付物：**
- `docker-compose.dev.yml`
- `DEVELOPMENT.md` 文档
- IDE 配置文件

**技术细节：**
```yaml
# docker-compose.dev.yml
version: '3.8'
services:
  datart-mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: datart
      MYSQL_DATABASE: datart
    ports:
      - "3306:3306"
  
  datart-redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"
  
  datart-backend:
    build: ./backend
    ports:
      - "8080:8080"
    depends_on:
      - datart-mysql
      - datart-redis
  
  datart-frontend:
    build: ./frontend
    ports:
      - "3000:3000"
```

---

#### 任务 1.1.3: 代码架构分析
- [ ] 分析 datart 核心模块结构
- [ ] 绘制系统架构图
- [ ] 识别扩展点（SPI 接口）
- [ ] 评估改造影响范围
- [ ] 输出架构分析报告

**交付物：**
- 架构图（PlantUML）
- 模块依赖关系图
- 扩展点清单
- 架构分析报告

**关键文件分析：**
```
backend/
├── core/           # 核心模块 ⭐ 重点分析
├── data/           # 数据源模块 ⭐ 重点改造
├── security/       # 安全模块 ⭐ 重点改造
├── schedule/       # 调度模块
└── server/         # Web 服务层

frontend/
├── src/
│   ├── app/        # 应用层
│   ├── components/ # 组件库 ⭐ 重点改造
│   ├── pages/      # 页面
│   └── utils/      # 工具类
```

---

### 1.2 多源连接改造（第 3-4 周）

#### 任务 1.2.1: 跨源查询引擎设计
- [ ] 设计跨源查询语法
- [ ] 实现查询解析器
- [ ] 实现查询优化器
- [ ] 实现查询执行引擎
- [ ] 编写单元测试

**交付物：**
- `CrossSourceQueryEngine.java`
- `CrossQueryParser.java`
- `QueryOptimizer.java`
- 单元测试覆盖率 > 80%

**技术细节：**
```java
// 跨源查询 DSL
public class CrossQuery {
    private List<SourceRef> sources;      // 涉及的数据源
    private List<JoinClause> joins;       // JOIN 条件
    private List<SelectItem> selects;     // 选择字段
    private List<FilterClause> filters;   // 过滤条件
    private List<OrderBy> orderBy;        // 排序
}

// 查询执行计划
public class QueryPlan {
    private List<ExecutionNode> nodes;
    private ExecutionStrategy strategy;   // 并行/串行
    private DataDistribution distribution; // 数据分布策略
}
```

**工作量估算：** 5 人天

---

#### 任务 1.2.2: 数据联邦视图
- [ ] 设计联邦视图元数据模型
- [ ] 实现联邦视图创建 API
- [ ] 实现联邦视图查询路由
- [ ] 实现联邦视图缓存策略
- [ ] 前端联邦视图管理界面

**交付物：**
- `FederatedView.java`
- `FederatedViewService.java`
- 前端管理页面组件
- API 文档

**技术细节：**
```java
// 联邦视图配置
public class FederatedViewConfig {
    private String viewName;
    private List<FieldMapping> mappings;  // 字段映射
    private List<SourceJoin> joins;       // 源关联
    private CacheStrategy cache;          // 缓存策略
    private RefreshPolicy refresh;        // 刷新策略
}

// 缓存策略
public enum CacheStrategy {
    NONE,           // 不缓存
    MEMORY,         // 内存缓存
    REDIS,          // Redis 缓存
    MATERIALIZED    // 物化视图
}
```

**工作量估算：** 4 人天

---

#### 任务 1.2.3: 企业级连接池管理
- [ ] 实现连接健康检查
- [ ] 实现自动故障转移
- [ ] 实现读写分离路由
- [ ] 实现连接池监控
- [ ] 配置管理界面

**交付物：**
- `EnterpriseConnectionPool.java`
- `ConnectionHealthChecker.java`
- `ReadWriteRouter.java`
- 监控 Dashboard

**技术细节：**
```java
// 连接池配置
public class ConnectionPoolConfig {
    private int minIdle = 5;
    private int maxActive = 50;
    private long maxWait = 30000;
    private long healthCheckInterval = 60000;
    private boolean enableFailover = true;
    private ReadWriteSplitConfig rwSplit;
}

// 故障转移策略
public class FailoverStrategy {
    private List<String> backupSources;  // 备用数据源
    private int maxRetries = 3;
    private long retryDelay = 1000;
    private FailoverMode mode;           // 自动/手动
}
```

**工作量估算：** 4 人天

---

#### 任务 1.2.4: 多源连接测试
- [ ] 编写集成测试用例
- [ ] 性能基准测试
- [ ] 故障注入测试
- [ ] 编写测试报告

**交付物：**
- 测试用例集
- 性能测试报告
- 故障测试报告

**测试场景：**
```
1. 单源查询性能基准
2. 双源 JOIN 性能测试
3. 多源联邦查询测试
4. 故障转移时间测试
5. 并发连接压力测试
```

**工作量估算：** 3 人天

---

### 1.3 集团化组织架构（第 5-6 周）

#### 任务 1.3.1: 组织架构数据模型
- [ ] 设计组织表结构
- [ ] 设计用户 - 组织关系表
- [ ] 设计角色 - 组织关系表
- [ ] 实现数据迁移脚本
- [ ] 编写实体类和 Mapper

**交付物：**
- DDL 脚本
- Entity 类
- Mapper XML
- 数据迁移脚本

**技术细节：**
```sql
-- 组织架构表
CREATE TABLE org_structure (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    parent_id BIGINT,
    org_code VARCHAR(50) NOT NULL,
    org_name VARCHAR(100) NOT NULL,
    org_type ENUM('GROUP', 'COMPANY', 'DEPT', 'TEAM'),
    org_level INT NOT NULL,
    org_path VARCHAR(500),  -- 路径：/1/5/12/
    org_sort INT DEFAULT 0,
    status TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_parent (parent_id),
    INDEX idx_path (org_path(100))
);

-- 用户组织关系表
CREATE TABLE user_org_relation (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    org_id BIGINT NOT NULL,
    role_id BIGINT,
    is_primary BOOLEAN DEFAULT FALSE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_org (user_id, org_id)
);
```

**工作量估算：** 3 人天

---

#### 任务 1.3.2: 组织管理 API
- [ ] 组织 CRUD API
- [ ] 组织树查询 API
- [ ] 用户 - 组织关联 API
- [ ] 批量导入 API
- [ ] API 文档

**交付物：**
- `OrgController.java`
- `OrgService.java`
- DTO 类
- Swagger 文档

**API 清单：**
```
POST   /api/org                    # 创建组织
PUT    /api/org/{id}               # 更新组织
DELETE /api/org/{id}               # 删除组织
GET    /api/org/{id}/tree          # 获取组织树
GET    /api/org/{id}/users         # 获取组织下用户
POST   /api/org/{id}/users/batch   # 批量添加用户
POST   /api/org/import             # 批量导入组织
```

**工作量估算：** 4 人天

---

#### 任务 1.3.3: 权限继承机制
- [ ] 实现权限继承算法
- [ ] 实现权限缓存
- [ ] 实现权限计算服务
- [ ] 编写权限测试用例

**交付物：**
- `PermissionInheritanceService.java`
- `PermissionCache.java`
- 权限计算测试用例

**技术细节：**
```java
// 权限继承服务
public class PermissionInheritanceService {
    
    // 计算用户完整权限（包含继承）
    public UserPermissions calculateUserPermissions(Long userId) {
        List<OrgPermission> directPerms = getDirectPermissions(userId);
        List<OrgPermission> inheritedPerms = getInheritedPermissions(userId);
        
        // 合并权限（子集优先原则）
        return mergePermissions(directPerms, inheritedPerms);
    }
    
    // 获取组织路径上所有权限
    private List<OrgPermission> getInheritedPermissions(Long userId) {
        List<Long> orgIds = getUserOrgPath(userId);
        return permissionMapper.selectByOrgIds(orgIds);
    }
}
```

**工作量估算：** 4 人天

---

#### 任务 1.3.4: 组织管理前端
- [ ] 组织架构树组件
- [ ] 组织编辑表单
- [ ] 用户分配界面
- [ ] 批量导入界面
- [ ] 权限预览功能

**交付物：**
- `OrgTree.vue`
- `OrgEditModal.vue`
- `UserAllocation.vue`
- 组织管理页面

**工作量估算：** 4 人天

---

## 阶段二：权限增强（第 7-10 周）

### 2.1 字段级权限（第 7-8 周）

#### 任务 2.1.1: 字段权限数据模型
- [ ] 设计字段权限表
- [ ] 设计脱敏规则表
- [ ] 实现实体类和 Mapper
- [ ] 编写数据初始化脚本

**交付物：**
- DDL 脚本
- Entity 类
- 初始化数据

**技术细节：**
```sql
-- 字段权限表
CREATE TABLE field_permission (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    resource_type VARCHAR(20) NOT NULL,  -- DATASET/VIEW
    resource_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    field_name VARCHAR(100) NOT NULL,
    permission_type ENUM('VISIBLE', 'MASKED', 'HIDDEN'),
    mask_rule_id BIGINT,
    UNIQUE KEY uk_resource_field_role (resource_type, resource_id, role_id, field_name)
);

-- 脱敏规则表
CREATE TABLE masking_rule (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    rule_name VARCHAR(50) NOT NULL,
    rule_type ENUM('PHONE', 'ID_CARD', 'EMAIL', 'PARTIAL', 'HASH', 'ENCRYPT'),
    rule_pattern VARCHAR(200),
    rule_params JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 预置脱敏规则
INSERT INTO masking_rule (rule_name, rule_type, rule_pattern) VALUES
('手机号脱敏', 'PHONE', '138****1234'),
('身份证脱敏', 'ID_CARD', '110101********1234'),
('邮箱脱敏', 'EMAIL', 'te***@example.com');
```

**工作量估算：** 2 人天

---

#### 任务 2.1.2: SQL 改写引擎
- [ ] 实现 SQL 解析器
- [ ] 实现字段权限拦截器
- [ ] 实现脱敏函数注入
- [ ] 实现行级权限过滤
- [ ] 编写单元测试

**交付物：**
- `SqlRewriteEngine.java`
- `FieldPermissionInterceptor.java`
- `MaskingFunction.java`
- 单元测试

**技术细节：**
```java
// SQL 改写引擎
public class SqlRewriteEngine {
    
    public RewrittenSql rewrite(String originalSql, UserContext user) {
        // 1. 解析 SQL
        Statement stmt = sqlParser.parse(originalSql);
        
        // 2. 获取用户权限
        FieldPermissions perms = permissionService.getFieldPermissions(user);
        
        // 3. 移除无权限字段
        stmt = removeUnauthorizedFields(stmt, perms);
        
        // 4. 应用脱敏函数
        stmt = applyMaskingFunctions(stmt, perms);
        
        // 5. 注入行级过滤
        stmt = injectRowFilters(stmt, perms);
        
        return new RewrittenSql(stmt.toString());
    }
}

// 脱敏函数
public class MaskingFunction {
    
    @UDF(name = "mask_phone")
    public static String maskPhone(String phone) {
        if (phone == null || phone.length() < 7) return phone;
        return phone.substring(0, 3) + "****" + phone.substring(7);
    }
    
    @UDF(name = "mask_id_card")
    public static String maskIdCard(String idCard) {
        if (idCard == null || idCard.length() < 14) return idCard;
        return idCard.substring(0, 6) + "********" + idCard.substring(14);
    }
}
```

**工作量估算：** 5 人天

---

#### 任务 2.1.3: 字段权限管理界面
- [ ] 数据集字段列表
- [ ] 权限配置弹窗
- [ ] 脱敏规则选择器
- [ ] 权限预览功能
- [ ] 批量配置功能

**交付物：**
- `FieldPermissionConfig.vue`
- `MaskingRuleSelector.vue`
- 权限配置页面

**工作量估算：** 4 人天

---

#### 任务 2.1.4: 权限测试与验证
- [ ] 编写权限测试用例
- [ ] 性能影响测试
- [ ] 安全审计测试
- [ ] 编写测试报告

**交付物：**
- 测试用例集
- 性能测试报告
- 安全审计报告

**工作量估算：** 3 人天

---

### 2.2 行级权限（第 9-10 周）

#### 任务 2.2.1: 行级权限数据模型
- [ ] 设计行级权限表
- [ ] 设计数据范围配置
- [ ] 实现实体类和 Mapper

**交付物：**
- DDL 脚本
- Entity 类

**技术细节：**
```sql
-- 行级权限表
CREATE TABLE row_permission (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    resource_type VARCHAR(20) NOT NULL,
    resource_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    filter_type ENUM('ORG', 'CUSTOM', 'SQL'),
    filter_config JSON,  -- 过滤配置
    filter_sql TEXT,     -- 自定义 SQL
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- filter_config 示例
-- {
--   "type": "org",
--   "field": "org_id",
--   "scope": "self_and_children",
--   "orgId": 123
-- }
```

**工作量估算：** 2 人天

---

#### 任务 2.2.2: 行级权限引擎
- [ ] 实现行级权限解析
- [ ] 实现动态 SQL 注入
- [ ] 实现权限缓存
- [ ] 编写单元测试

**交付物：**
- `RowPermissionEngine.java`
- `RowFilterInjector.java`
- 单元测试

**工作量估算：** 4 人天

---

#### 任务 2.2.3: 行级权限管理界面
- [ ] 行级权限配置页面
- [ ] 数据范围选择器
- [ ] 权限测试工具
- [ ] 权限预览功能

**交付物：**
- `RowPermissionConfig.vue`
- 权限配置页面

**工作量估算：** 3 人天

---

## 阶段三：图表与集成（第 11-15 周）

### 3.1 图表控件增强（第 11-12 周）

#### 任务 3.1.1: 新增图表类型
- [ ] 桑基图（Sankey）
- [ ] 热力图（Heatmap）
- [ ] 关系图（Graph）
- [ ] 漏斗图（Funnel）
- [ ] 甘特图（Gantt）

**交付物：**
- 5 种新图表组件
- 图表配置 Schema
- 使用示例

**技术细节：**
```typescript
// 桑基图组件
interface SankeyChartConfig {
  type: 'sankey';
  data: {
    nodes: Array<{ id: string; name: string }>;
    links: Array<{ source: string; target: string; value: number }>;
  };
  config: {
    nodeWidth: number;
    nodeGap: number;
    layout: 'horizontal' | 'vertical';
  };
}
```

**工作量估算：** 6 人天

---

#### 任务 3.1.2: 图表联动机制
- [ ] 设计联动事件总线
- [ ] 实现联动配置
- [ ] 实现跨仪表板联动
- [ ] 编写联动示例

**交付物：**
- `ChartEventBus.ts`
- `LinkageConfig.vue`
- 联动示例

**工作量估算：** 4 人天

---

#### 任务 3.1.3: 自定义图表 SDK
- [ ] 设计图表 SDK API
- [ ] 实现图表注册机制
- [ ] 编写开发文档
- [ ] 创建示例图表

**交付物：**
- `@datart/chart-sdk`
- 开发文档
- 示例代码

**工作量估算：** 4 人天

---

### 3.2 耦合式集成（第 13-15 周）

#### 任务 3.2.1: 统一认证服务
- [ ] 实现 OAuth2 客户端
- [ ] 实现 LDAP 同步
- [ ] 实现 JWT 验证
- [ ] 实现 CAS/SAML（可选）

**交付物：**
- `UnifiedAuthService.java`
- `OAuth2Client.java`
- `LdapSyncService.java`
- 认证配置文档

**工作量估算：** 5 人天

---

#### 任务 3.2.2: 前端 SDK 开发
- [ ] 设计 SDK API
- [ ] 实现认证模块
- [ ] 实现仪表板嵌入
- [ ] 实现权限同步
- [ ] 编写 SDK 文档

**交付物：**
- `@datart/sdk` npm 包
- SDK 文档
- 使用示例

**技术细节：**
```typescript
// SDK 使用示例
import { DataKit } from '@datart/sdk';

const datart = new DataKit({
  baseUrl: 'https://datart.example.com',
  appId: 'my-app',
  auth: {
    type: 'oauth2',
    getToken: () => getAuthToken()
  }
});

// 嵌入仪表板
await datart.renderDashboard({
  container: '#dashboard-container',
  dashboardId: 'xxx',
  theme: 'dark'
});

// 监听事件
datart.on('filterChange', (filters) => {
  console.log('Filters changed:', filters);
});
```

**工作量估算：** 5 人天

---

#### 任务 3.2.3: REST API 增强
- [ ] 数据查询 API
- [ ] 仪表板管理 API
- [ ] 权限管理 API
- [ ] API 版本管理
- [ ] API 文档（Swagger）

**交付物：**
- REST API 清单
- Swagger 文档
- API SDK（Java/Python/JS）

**工作量估算：** 4 人天

---

#### 任务 3.2.4: 集成测试
- [ ] 单点登录测试
- [ ] SDK 嵌入测试
- [ ] API 集成测试
- [ ] 编写集成文档

**交付物：**
- 集成测试报告
- 集成文档

**工作量估算：** 3 人天

---

## 阶段四：测试与优化（第 16-18 周）

### 4.1 性能测试（第 16 周）

#### 任务 4.1.1: 性能基准测试
- [ ] 查询性能测试
- [ ] 并发性能测试
- [ ] 内存使用测试
- [ ] 响应时间测试

**交付物：**
- 性能测试报告
- 性能优化建议

**工作量估算：** 3 人天

---

#### 任务 4.1.2: 性能优化
- [ ] SQL 查询优化
- [ ] 缓存策略优化
- [ ] 前端渲染优化
- [ ] 打包体积优化

**交付物：**
- 优化报告
- 性能对比数据

**工作量估算：** 4 人天

---

### 4.2 安全审计（第 17 周）

#### 任务 4.2.1: 安全测试
- [ ] SQL 注入测试
- [ ] XSS 测试
- [ ] CSRF 测试
- [ ] 权限绕过测试
- [ ] 数据泄露测试

**交付物：**
- 安全测试报告
- 漏洞修复清单

**工作量估算：** 3 人天

---

#### 任务 4.2.2: 安全加固
- [ ] 修复安全漏洞
- [ ] 实现审计日志
- [ ] 实现操作追溯
- [ ] 实现异常检测

**交付物：**
- 安全加固报告
- 审计日志功能

**工作量估算：** 4 人天

---

### 4.3 文档与培训（第 18 周）

#### 任务 4.3.1: 文档完善
- [ ] 用户手册
- [ ] 部署指南
- [ ] API 文档
- [ ] 开发文档
- [ ] FAQ

**交付物：**
- 完整文档集
- 在线文档站点

**工作量估算：** 3 人天

---

#### 任务 4.3.2: 培训材料
- [ ] 管理员培训 PPT
- [ ] 开发者培训 PPT
- [ ] 培训视频录制
- [ ] 培训环境搭建

**交付物：**
- 培训材料
- 培训视频

**工作量估算：** 2 人天

---

## 任务汇总

### 按阶段统计

| 阶段 | 任务数 | 工作量（人天） | 周期 |
|------|--------|---------------|------|
| 一：基础改造 | 11 | 38 | 6 周 |
| 二：权限增强 | 7 | 23 | 4 周 |
| 三：图表与集成 | 7 | 31 | 5 周 |
| 四：测试与优化 | 6 | 19 | 3 周 |
| **总计** | **31** | **111** | **18 周** |

### 按模块统计

| 模块 | 任务数 | 工作量（人天） | 占比 |
|------|--------|---------------|------|
| 后端开发 | 15 | 52 | 47% |
| 前端开发 | 10 | 35 | 31% |
| 测试 | 4 | 13 | 12% |
| 文档 | 2 | 11 | 10% |

---

## 里程碑

| 里程碑 | 日期 | 交付物 |
|--------|------|--------|
| M1: 环境就绪 | 第 2 周末 | 开发环境、架构文档 |
| M2: 多源连接完成 | 第 4 周末 | 跨源查询、连接池 |
| M3: 组织架构完成 | 第 6 周末 | 组织管理、权限继承 |
| M4: 字段权限完成 | 第 8 周末 | 字段权限、脱敏引擎 |
| M5: 行级权限完成 | 第 10 周末 | 行级权限、数据范围 |
| M6: 图表增强完成 | 第 12 周末 | 新图表、联动机制 |
| M7: 集成功能完成 | 第 15 周末 | SDK、API、认证 |
| M8: 发布就绪 | 第 18 周末 | 完整产品、文档 |

---

## 风险清单

| 风险 | 概率 | 影响 | 应对措施 |
|------|------|------|----------|
| 跨源查询性能不达标 | 中 | 高 | 早期性能测试，查询优化 |
| 权限系统复杂度高 | 高 | 中 | 分阶段实施，充分测试 |
| 图表兼容性问题 | 中 | 中 | 多浏览器测试，降级方案 |
| 集成接口变更 | 低 | 高 | API 版本管理，向后兼容 |
| 人员流动 | 中 | 高 | 文档完善，代码审查 |

---

## 资源配置建议

| 角色 | 人数 | 技能要求 |
|------|------|----------|
| 后端开发 | 2-3 | Java, Spring Boot, MySQL |
| 前端开发 | 2 | Vue 3, TypeScript, ECharts |
| 测试工程师 | 1 | 自动化测试，性能测试 |
| 产品经理 | 0.5 | 需求分析，文档编写 |

**总计：** 5.5-6.5 人

---

## 下一步行动

1. ✅ **评审任务清单** - 确认任务范围和优先级
2. ⏳ **分配开发人员** - 确定团队成员
3. ⏳ **创建 GitHub Projects** - 建立项目看板
4. ⏳ **启动开发环境** - 开始第 1 周任务

需要我帮你创建 GitHub Projects 看板或者开始某个具体任务吗？
