# GitHub BI 数据分析程序改造方案

## 一、候选项目评估

### 推荐项目：**datart** ⭐⭐⭐⭐⭐

**GitHub:** https://github.com/running-elephant/datart

**推荐理由：**
| 评估维度 | datart | metatron | silzila |
|---------|--------|----------|---------|
| 多数据源支持 | ✅ 完善 | ✅ 完善 | ⚠️ 基础 |
| 权限管理 | ✅ 字段级 | ✅ 工作空间级 | ⚠️ 基础 |
| 可扩展性 | ✅ 插件化架构 | ⚠️ 封闭 | ⚠️ 封闭 |
| 技术栈 | Java+Vue3 | Java+Angular | Scala+React |
| 社区活跃度 | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| 文档完善度 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| 国产化适配 | ✅ 优秀 | ⚠️ 一般 | ⚠️ 一般 |

**datart 核心优势：**
- 插件化架构，支持 Source/Chart/Visualization 层扩展
- 标准化权限体系，支持字段级权限
- 支持多数据源连接（MySQL, PostgreSQL, Oracle, SQL Server 等）
- 原 Davinci 团队出品，企业级基因
- 中文文档完善，社区活跃

---

## 二、改造内容详细方案

### 1. 多源连接改造 🔌

**现状：** datart 已支持多种数据源，但需要增强企业级特性

**改造内容：**

```
┌─────────────────────────────────────────────────────────────┐
│                    多源连接架构                              │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ 生产数据库   │  │ 数据仓库     │  │ 第三方 API   │         │
│  │ MySQL/PG    │  │ Hive/Spark  │  │ REST/SOAP   │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                │                │                 │
│         └────────────────┼────────────────┘                 │
│                          ▼                                  │
│              ┌───────────────────────┐                      │
│              │   统一连接池管理层      │                      │
│              │  - 连接复用            │                      │
│              │  - 故障转移            │                      │
│              │  - 负载均衡            │                      │
│              │  - 读写分离            │                      │
│              └───────────────────────┘                      │
│                          │                                  │
│         ┌────────────────┼────────────────┐                 │
│         ▼                ▼                ▼                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ 联合查询     │  │ 数据联邦     │  │ 跨源关联     │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

**技术实现：**
```java
// 新增：跨源查询引擎
public class CrossSourceQueryEngine {
    // 支持跨数据源 JOIN
    public DataSet executeCrossSourceQuery(CrossQuery query);
    
    // 支持数据联邦视图
    public FederatedView createFederatedView(FederatedConfig config);
    
    // 支持查询下推优化
    public QueryPlan optimizeQueryPlan(Query query);
}

// 新增：连接池管理
public class EnterpriseConnectionPool {
    // 连接健康检查
    public void healthCheck();
    
    // 自动故障转移
    public Connection getFailoverConnection(String sourceId);
    
    // 读写分离路由
    public Connection routeConnection(OperationType type);
}
```

---

### 2. 集团化组织架构 👥

**现状：** datart 支持基础的组织/用户/角色管理

**改造内容：**

```
┌─────────────────────────────────────────────────────────────┐
│                  集团化组织架构模型                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    集团总部                          │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │              数据治理委员会                   │    │   │
│  │  │  - 数据标准制定                              │    │   │
│  │  │  - 权限审批                                  │    │   │
│  │  │  - 审计监督                                  │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                  │
│         ┌────────────────┼────────────────┐                 │
│         ▼                ▼                ▼                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  事业部 A    │  │  事业部 B    │  │  事业部 C    │         │
│  │  ┌───────┐  │  │  ┌───────┐  │  │  ┌───────┐  │         │
│  │  │部门 A1│  │  │  │部门 B1│  │  │  │部门 C1│  │         │
│  │  │部门 A2│  │  │  │部门 B2│  │  │  │部门 C2│  │         │
│  │  └───────┘  │  │  └───────┘  │  │  └───────┘  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
│  权限继承规则：                                              │
│  - 上级可访问下级数据（可配置）                               │
│  - 平级隔离（可配置跨部门共享）                               │
│  - 数据行级权限自动继承                                       │
└─────────────────────────────────────────────────────────────┘
```

**数据库设计：**
```sql
-- 组织架构表
CREATE TABLE org_structure (
    id BIGINT PRIMARY KEY,
    parent_id BIGINT,              -- 父组织 ID
    org_code VARCHAR(50),          -- 组织编码
    org_name VARCHAR(100),         -- 组织名称
    org_type VARCHAR(20),          -- GROUP/COMPANY/DEPARTMENT/TEAM
    org_level INT,                 -- 组织层级
    org_path VARCHAR(500),         -- 组织路径 (用于快速查询子树)
    data_scope_type VARCHAR(20),   -- 数据范围类型
    data_scope_config JSON,        -- 数据范围配置
    created_at TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES org_structure(id)
);

-- 用户组织关系表
CREATE TABLE user_org_relation (
    user_id BIGINT,
    org_id BIGINT,
    role_id BIGINT,
    is_primary BOOLEAN,            -- 是否主组织
    inherited_permissions JSON,    -- 继承的权限
    PRIMARY KEY (user_id, org_id)
);

-- 数据权限表
CREATE TABLE data_permission (
    id BIGINT PRIMARY KEY,
    resource_type VARCHAR(20),     -- DATASET/DASHBOARD/VIEW
    resource_id BIGINT,
    org_id BIGINT,                 -- 授权组织
    permission_type VARCHAR(20),   -- READ/WRITE/ADMIN/EXPORT
    field_permissions JSON,        -- 字段级权限
    row_permissions JSON,          -- 行级权限
    expire_at TIMESTAMP            -- 过期时间
);
```

---

### 3. 字段级权限分配 🔒

**现状：** datart 支持视图级权限，需要增强到字段级

**改造内容：**

```
┌─────────────────────────────────────────────────────────────┐
│                   字段级权限控制模型                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  权限粒度：                                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  数据集：销售订单表                                   │   │
│  │  ┌───────────────────────────────────────────────┐  │   │
│  │  │ 字段            │ 可见性  │ 脱敏规则  │ 备注   │  │   │
│  │  ├───────────────────────────────────────────────┤  │   │
│  │  │ 订单 ID         │ ✅     │ 无       │ 公开   │  │   │
│  │  │ 客户名称        │ ✅     │ 脱敏     │ 显示前 2 字│  │   │
│  │  │ 客户手机号      │ ⚠️     │ 脱敏     │ 中间 4 位 *│  │   │
│  │  │ 订单金额        │ ✅     │ 无       │ 公开   │  │   │
│  │  │ 成本价          │ ❌     │ 隐藏     │ 仅采购 │  │   │
│  │  │ 利润率          │ ❌     │ 隐藏     │ 仅管理层│  │   │
│  │  │ 供应商信息      │ ⚠️     │ 脱敏     │ 仅采购 │  │   │
│  │  └───────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  脱敏规则引擎：                                              │
│  - 完全隐藏                                                  │
│  - 部分脱敏 (手机号、身份证、邮箱)                            │
│  - 动态脱敏 (根据用户角色)                                    │
│  - 哈希脱敏 (不可逆)                                         │
│  - 加密脱敏 (可解密)                                         │
└─────────────────────────────────────────────────────────────┘
```

**技术实现：**
```java
// 字段权限拦截器
public class FieldPermissionInterceptor {
    
    // SQL 改写，注入字段权限过滤
    public String rewriteSQL(String originalSQL, UserContext user) {
        PermissionContext permCtx = permissionService.getFieldPermissions(user);
        
        // 1. 移除无权限字段
        SELECT original -> SELECT permitted_fields
        
        // 2. 应用脱敏函数
        SELECT phone -> SELECT mask_phone(phone) 
        
        // 3. 注入行级过滤
        WHERE -> WHERE AND org_id IN (permitted_orgs)
        
        return rewrittenSQL;
    }
    
    // 动态脱敏规则
    public String applyMasking(String value, MaskingRule rule) {
        switch (rule.getType()) {
            case PHONE: return maskPhone(value);      // 138****1234
            case ID_CARD: return maskIdCard(value);   // 110101********1234
            case EMAIL: return maskEmail(value);      // te***@example.com
            case PARTIAL: return maskPartial(value, rule.getKeepChars());
            case HASH: return hash(value);
            case ENCRYPT: return encrypt(value);
        }
    }
}

// 权限注解
@FieldPermission(
    resource = "sales_order",
    field = "customer_phone",
    rule = MaskingType.PHONE,
    roles = {"sales", "manager"}
)
```

---

### 4. 灵活的图表控件 📊

**现状：** datart 支持基础图表，需要增强交互性和自定义能力

**改造内容：**

```
┌─────────────────────────────────────────────────────────────┐
│                   图表控件增强方案                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  新增图表类型：                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ 桑基图       │  │ 热力图       │  │ 关系图      │         │
│  │ Sankey      │  │ Heatmap     │  │ Graph       │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ 漏斗图       │  │ 甘特图       │  │ 地图下钻     │         │
│  │ Funnel      │  │ Gantt       │  │ Drill-down  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
│  交互增强：                                                  │
│  - 图表联动（点击 A 图表，B 图表自动过滤）                     │
│  - 跨仪表板联动                                              │
│  - 动态参数传递                                              │
│  - 图表间数据下钻                                            │
│  - 右键菜单自定义                                            │
│                                                             │
│  自定义图表 SDK：                                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  export default class CustomChart extends BaseChart {│   │
│  │    render(data, config) { /* 渲染逻辑 */ }           │   │
│  │    interact(event) { /* 交互逻辑 */ }                │   │
│  │    export() { /* 导出逻辑 */ }                       │   │
│  │  }                                                   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**技术实现：**
```typescript
// 图表联动配置
interface ChartLinkageConfig {
  sourceChartId: string;
  targetChartIds: string[];
  linkageType: 'filter' | 'highlight' | 'drilldown';
  fieldMapping: {
    sourceField: string;
    targetField: string;
  }[];
}

// 图表事件总线
class ChartEventBus {
  // 发布事件
  publish(eventType: string, payload: any);
  
  // 订阅事件
  subscribe(eventType: string, handler: Function);
  
  // 跨仪表板事件
  publishCrossDashboard(dashboardId: string, event: any);
}

// 自定义图表注册
ChartRegistry.register('custom-sankey', {
  component: SankeyChart,
  config: SankeyConfig,
  dataProcessor: SankeyDataProcessor
});
```

---

### 5. 耦合式集成连接 🔗

**现状：** datart 支持嵌入，需要增强深度集成能力

**改造内容：**

```
┌─────────────────────────────────────────────────────────────┐
│                   耦合式集成架构                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  集成模式：                                                  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  模式 1: SDK 嵌入                                     │   │
│  │  ┌───────────────────────────────────────────────┐  │   │
│  │  │  业务系统                                      │  │   │
│  │  │  ┌─────────────────────────────────────────┐  │  │   │
│  │  │  │  datart SDK                             │  │  │   │
│  │  │  │  - 单点登录对接                          │  │  │   │
│  │  │  │  - 权限同步                              │  │  │   │
│  │  │  │  - 主题定制                              │  │  │   │
│  │  │  └─────────────────────────────────────────┘  │  │   │
│  │  └───────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  模式 2: API 集成                                     │   │
│  │  ┌───────────────────────────────────────────────┐  │   │
│  │  │  REST API           │  GraphQL API            │  │   │
│  │  │  - 数据查询          │  - 灵活查询              │  │   │
│  │  │  - 仪表板管理        │  - 订阅推送              │  │   │
│  │  │  - 权限管理          │  - 实时数据              │  │   │
│  │  └───────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  模式 3: 微前端集成                                   │   │
│  │  ┌───────────────────────────────────────────────┐  │   │
│  │  │  qiankun / micro-app 架构                      │  │   │
│  │  │  - 独立部署                                    │  │   │
│  │  │  - 样式隔离                                    │  │   │
│  │  │  │  - 状态共享                                 │  │   │
│  │  └───────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  统一认证：                                                  │
│  - OAuth2 / OIDC                                            │
│  - CAS / SAML                                               │
│  - JWT Token                                                │
│  - LDAP / AD                                                │
└─────────────────────────────────────────────────────────────┘
```

**技术实现：**
```java
// 统一认证服务
public class UnifiedAuthService {
    
    // OAuth2 集成
    public Token exchangeCode(String code, String provider);
    
    // LDAP 同步
    public void syncUsersFromLDAP(LDAPConfig config);
    
    // JWT 验证
    public UserContext validateJWT(String token);
}

// SDK 配置
@DataKitConfig
public class DataKitIntegration {
    private String baseUrl;
    private String appId;
    private String secret;
    private AuthType authType;
    private ThemeConfig theme;
    private PermissionSyncMode permissionMode;
}

// 前端 SDK
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
datart.renderDashboard({
  container: '#dashboard-container',
  dashboardId: 'xxx',
  theme: 'dark',
  onReady: () => console.log('Dashboard ready')
});
```

---

## 三、实施计划

### 阶段一：基础改造（4-6 周）

| 周次 | 任务 | 交付物 |
|------|------|--------|
| 1-2 | 代码 fork、环境搭建、架构分析 | 开发环境、架构文档 |
| 3-4 | 多源连接改造 | 跨源查询引擎、连接池管理 |
| 5-6 | 集团化组织架构 | 组织模型、权限继承 |

### 阶段二：权限增强（3-4 周）

| 周次 | 任务 | 交付物 |
|------|------|--------|
| 7-8 | 字段级权限 | 字段权限拦截器、脱敏引擎 |
| 9-10 | 行级权限 | 行级过滤、动态权限 |

### 阶段三：图表与集成（4-5 周）

| 周次 | 任务 | 交付物 |
|------|------|--------|
| 11-12 | 图表控件增强 | 新增图表类型、联动机制 |
| 13-14 | 自定义图表 SDK | 图表开发规范、示例 |
| 15 | 集成 SDK | 前端 SDK、API 文档 |

### 阶段四：测试与优化（2-3 周）

| 周次 | 任务 | 交付物 |
|------|------|--------|
| 16-17 | 性能测试、安全审计 | 测试报告、优化方案 |
| 18 | 文档完善、培训 | 用户手册、部署指南 |

---

## 四、技术栈

| 层级 | 技术 |
|------|------|
| 后端 | Java 11+, Spring Boot, MyBatis |
| 前端 | Vue 3, TypeScript, ECharts |
| 数据库 | MySQL 8+, Redis |
| 大数据 | Druid, Spark (可选) |
| 部署 | Docker, Kubernetes |

---

## 五、风险与应对

| 风险 | 影响 | 应对措施 |
|------|------|----------|
| 代码复杂度 | 高 | 分阶段实施，每阶段 code review |
| 性能问题 | 中 | 早期性能测试，查询优化 |
| 兼容性问题 | 中 | 保持 API 向后兼容 |
| 安全风险 | 高 | 安全审计，渗透测试 |

---

## 六、下一步行动

1. **Fork datart 仓库** - 创建私有仓库
2. **搭建开发环境** - 本地运行 datart
3. **详细架构设计** - 输出详细设计文档
4. **POC 验证** - 验证关键技术点

是否需要我帮你 fork 项目并创建详细的开发计划？
