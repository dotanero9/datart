# Datart 扩展点清单与改造建议

## 📋 扩展点清单

### 1️⃣ 数据源扩展接口 (DataProvider SPI)

**接口位置**: `core/src/main/java/datart/core/data/provider/DataProvider.java`

**扩展方式**:
```java
public class MyCustomDataProvider extends DataProvider {
    @Override
    public Object test(DataProviderSource source) { /* 实现 */ }
    
    @Override
    public Dataframe execute(DataProviderSource config, QueryScript script, ExecuteParam param) { /* 实现 */ }
    
    @Override
    public Set<String> readAllDatabases(DataProviderSource source) { /* 实现 */ }
    
    @Override
    public Set<String> readTables(DataProviderSource source, String database) { /* 实现 */ }
    
    @Override
    public Set<Column> readTableColumns(DataProviderSource source, String schema, String table) { /* 实现 */ }
    
    @Override
    public String getConfigFile() { return "my-data-provider.json"; }
    
    @Override
    public boolean validateFunction(DataProviderSource source, String snippet) { /* 实现 */ }
}
```

**注册方式**: 在 `resources/META-INF/services/datart.core.data.provider.DataProvider` 中添加实现类全名

**配置文件**: 创建 `my-data-provider.json` 定义配置模板

**示例实现**:
- `JdbcDataProvider` - JDBC 通用数据源
- `FileDataProvider` - 文件数据源 (Excel/CSV)
- `HttpDataProvider` - HTTP API 数据源

**数据库适配器扩展**:
- 位置：`data-providers/jdbc-data-provider/src/main/java/datart/data/provider/jdbc/adapters/`
- 方式：继承 `JdbcDataProviderAdapter` 并重写数据库特定方法
- 配置：更新 `jdbc-driver.yml` 添加新数据库类型

---

### 2️⃣ 图表扩展接口 (Chart SPI)

**接口位置**: `frontend/src/app/types/Chart.ts`

**核心接口**:
```typescript
interface IChart extends IChartLifecycle {
  meta: ChartMetadata;
  config?: ChartConfig;
  dataset?: ChartDataSetDTO;
  dependency: string[];
  isISOContainer: boolean | string;
  useIFrame?: boolean;
  
  getDependencies(): string[];
  init(config: any);
  registerMouseEvents(events: Array<ChartMouseEvent>);
  isMatchRequirement(targetConfig?: ChartConfig): boolean;
}

interface IChartLifecycle {
  onMount(options: BrokerOption, context: BrokerContext): void;
  onUpdated(options: BrokerOption, context: BrokerContext): void;
  onUnMount(options: BrokerOption, context: BrokerContext): void;
  onResize(options: BrokerOption, context: BrokerContext): void;
}
```

**扩展方式 A - 内置图表**:
1. 创建目录：`frontend/src/app/components/ChartGraph/MyCustomChart/`
2. 实现 `IChart` 接口
3. 在 `ChartManager.ts` 的 `_basicCharts()` 方法中注册

**扩展方式 B - 插件图表**:
1. 独立开发图表组件
2. 编译为 JS 文件
3. 部署到 `frontend/public/custom-chart-plugins/`
4. 系统启动时自动加载

**图表元数据**:
```typescript
interface ChartMetadata {
  id: string;           // 唯一标识，如 'my-custom-chart'
  name: string;         // 显示名称
  icon: string;         // 图标 SVG 或 URL
  requirements: {       // 数据要求
    fields: Field[];
  };
}
```

**示例实现**: 25+ 种基础图表 (LineChart, PieChart, BarChart, MapChart 等)

---

### 3️⃣ 权限扩展接口 (Security SPI)

**接口位置**: `security/src/main/java/datart/security/manager/DatartSecurityManager.java`

**核心接口**:
```java
public interface DatartSecurityManager {
    void login(PasswordToken token) throws AuthException;
    boolean validateUser(String username, String password) throws AuthException;
    String login(String jwtToken) throws AuthException;
    void logoutCurrent();
    boolean isAuthenticated();
    void requireAllPermissions(Permission... permission) throws PermissionDeniedException;
    void requireAnyPermission(Permission... permissions) throws PermissionDeniedException;
    void requireOrgOwner(String orgId) throws PermissionDeniedException;
    boolean isOrgOwner(String orgId);
    boolean hasPermission(Permission... permission);
    User getCurrentUser();
    void runAs(String userNameOrEmail);
    void releaseRunAs();
}
```

**权限模型**:
```java
public class Permission {
    private String orgId;       // 组织 ID
    private String roleId;      // 角色 ID
    private String resourceId;  // 资源 ID
    private int permission;     // 权限值：0=无，1=读，2=写，3=管理
}
```

**扩展方式**:
1. 实现 `DatartSecurityManager` 接口
2. 自定义权限计算逻辑
3. 在 Spring 配置中替换默认实现

**OAuth2 扩展**:
- 位置：`security/src/main/java/datart/security/oauth2/`
- 方式：继承 `CustomOauth2Client` 或实现 `Oauth2Client`
- 示例：`DingTalkOauth2Client`, `WeChartOauth2Client`

---

### 4️⃣ 数据查询处理器扩展

**前置处理器**: `core/src/main/java/datart/core/data/provider/processor/DataProviderPreProcessor.java`
**后置处理器**: `core/src/main/java/datart/core/data/provider/processor/DataProviderPostProcessor.java`

**用途**:
- 前置：SQL 改写、权限过滤、参数注入
- 后置：数据脱敏、结果转换、审计日志

---

### 5️⃣ 调度任务扩展

**实体类**: `core/src/main/java/datart/core/entity/Schedule.java`

**扩展方式**:
1. 定义新任务类型
2. 实现任务执行逻辑
3. 通过 Quartz 调度

---

### 6️⃣ 第三方认证扩展

**位置**: `security/src/main/java/datart/security/oauth2/`

**扩展方式**:
1. 继承 `CustomOauth2Client`
2. 实现 OAuth2 流程
3. 配置客户端 ID 和密钥

**示例**:
- `DingTalkOauth2Client` - 钉钉
- `WeChartOauth2Client` - 企业微信

---

## 🎯 改造建议优先级

### P0 - 高优先级 (核心功能，建议优先实施)

| # | 改造项 | 工作量 | 风险 | 说明 |
|---|--------|--------|------|------|
| 1 | **数据源扩展** | 中 | 中 | 支持企业所需数据库 (如 StarRocks, Doris, Oracle 等) |
| 2 | **SSO 认证集成** | 低 | 中 | 对接企业现有 OAuth2/LDAP/AD 认证系统 |
| 3 | **权限模型扩展** | 中 | 高 | 对接企业 RBAC/ABAC 权限系统 |

**实施建议**:
- 数据源扩展：优先使用 JDBC 适配器模式，减少开发量
- SSO 集成：利用现有 OAuth2 框架，配置为主
- 权限扩展：保持接口兼容，逐步迁移

---

### P1 - 中优先级 (增强功能，根据需求实施)

| # | 改造项 | 工作量 | 风险 | 说明 |
|---|--------|--------|------|------|
| 4 | **自定义图表开发** | 中 | 低 | 开发企业专属图表类型 |
| 5 | **数据源性能优化** | 中 | 中 | 连接池优化、查询缓存、预编译 |
| 6 | **调度任务扩展** | 低 | 低 | 自定义数据刷新、导出、通知任务 |
| 7 | **数据脱敏** | 中 | 中 | 敏感数据自动脱敏处理 |

**实施建议**:
- 图表开发：优先使用插件机制，独立于主代码
- 性能优化：先监控分析，再针对性优化
- 数据脱敏：通过后置处理器实现

---

### P2 - 低优先级 (优化改进，长期规划)

| # | 改造项 | 工作量 | 风险 | 说明 |
|---|--------|--------|------|------|
| 8 | **前端性能优化** | 高 | 低 | 大数据量渲染优化、虚拟滚动 |
| 9 | **UI/UX 定制** | 中 | 低 | 企业主题、品牌定制 |
| 10 | **日志和监控** | 中 | 低 | 增强可观测性、接入 APM |
| 11 | **多租户增强** | 高 | 中 | 更细粒度的租户隔离 |
| 12 | **集群部署优化** | 高 | 中 | 高可用、负载均衡 |

**实施建议**:
- 作为技术债务逐步偿还
- 结合版本升级同步进行

---

## 📁 架构分析报告位置

**完整架构分析报告**: `/root/.openclaw/workspace/datart/docs/enterprise/architecture.md`

**报告内容**:
- ✅ 后端模块结构分析 (core, data-providers, security, server)
- ✅ 前端模块结构分析 (app, components, pages)
- ✅ SPI 扩展接口详细文档
- ✅ PlantUML 架构图 (5 张)
- ✅ 关键类/接口清单
- ✅ 改造影响范围评估
- ✅ 风险点识别
- ✅ 改造建议优先级

---

## 🚀 快速开始指南

### 开发新数据源

```bash
# 1. 创建数据源类
mkdir -p data-providers/my-provider/src/main/java/datart/data/provider
# 2. 继承 DataProvider 并实现接口
# 3. 创建配置文件 resources/my-data-provider.json
# 4. 注册服务 resources/META-INF/services/datart.core.data.provider.DataProvider
# 5. 在 pom.xml 中添加模块依赖
# 6. 测试连接和查询
```

### 开发新图表

```bash
# 1. 创建图表组件目录
mkdir -p frontend/src/app/components/ChartGraph/MyChart
# 2. 实现 IChart 接口
# 3. 在 ChartManager.ts 中注册
# 4. 或使用插件机制部署到 public/custom-chart-plugins/
# 5. 测试渲染和交互
```

### 集成 SSO

```bash
# 1. 配置 OAuth2 客户端
# 2. 修改 application.yml 添加认证提供商
# 3. 或实现 CustomOauth2Client
# 4. 测试登录流程
```

---

**文档版本**: 1.0  
**创建日期**: 2026-03-17  
**联系**: 架构分析代理
