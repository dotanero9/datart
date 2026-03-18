/**
 * 新图表后端集成测试脚本
 *
 * 使用方法:
 * 1. 确保后端服务已启动: http://localhost:8080
 * 2. 运行: node test-charts-integration.js
 *
 * 测试内容:
 * - 创建每个图表类型 (POST /api/viz/datacharts)
 * - 更新图表配置 (PUT /api/viz/datacharts/{id})
 * - 获取图表配置 (GET /api/viz/datacharts/{id})
 * - 验证配置保存到数据库
 */

const axios = require('axios');

// 配置
const API_BASE = process.env.API_BASE || 'http://localhost:8080/api';
const TEST_ORG_ID = 'test-org';
const ADMIN_USER = { username: 'admin', password: 'admin' };

// 图表类型列表
const CHART_TYPES = [
  { id: 'sankey', name: '桑基图' },
  { id: 'heatmap', name: '热力图' },
  { id: 'graph', name: '关系图' },
  { id: 'funnel', name: '漏斗图' },
  { id: 'gantt', name: '甘特图' }
];

// 测试数据模板
const TEST_DATA_TEMPLATES = {
  sankey: {
    datas: {
      source: { key: 'source', type: 'aggregate', required: true },
      target: { key: 'target', type: 'aggregate', required: true },
      linkValue: { key: 'value', type: 'aggregate', required: true }
    },
    styles: {
      nodeWidth: 20,
      nodeGap: 8,
      draggable: true,
      lineOpacity: 0.5,
      curveness: 0.5
    }
  },
  heatmap: {
    datas: {
      xAxis: { key: 'x', type: 'aggregate', required: true },
      yAxis: { key: 'y', type: 'aggregate', required: true },
      value: { key: 'value', type: 'aggregate', required: true }
    },
    styles: {
      borderRadius: 4,
      showLabel: false,
      colorScheme: 'blue'
    }
  },
  graph: {
    datas: {
      source: { key: 'source', type: 'aggregate', required: true },
      target: { key: 'target', type: 'aggregate', required: true },
      linkValue: { key: 'value', type: 'aggregate', required: true },
      nodeSize: { key: 'size', type: 'aggregate', required: false }
    },
    styles: {
      layout: 'force',
      gravity: 0.1,
      edgeLength: 50,
      draggable: true
    }
  },
  funnel: {
    datas: {
      dimension: { key: 'category', type: 'aggregate', required: true },
      metrics: { key: 'value', type: 'aggregate', required: true }
    },
    styles: {
      sort: 'descending',
      gap: 2,
      minWidth: 10,
      maxWidth: 80,
      label: { position: 'inside', formatter: 'percent' }
    }
  },
  gantt: {
    datas: {
      taskName: { key: 'task', type: 'aggregate', required: true },
      startDate: { key: 'start', type: 'date', required: true },
      endDate: { key: 'end', type: 'date', required: true },
      progress: { key: 'progress', type: 'number', required: false }
    },
    styles: {
      barHeight: 20,
      barGap: 10,
      showProgress: true
    }
  }
};

// 日志工具
class TestLogger {
  constructor() {
    this.passed = 0;
    this.failed = 0;
    this.warnings = 0;
  }

  info(msg) {
    console.log(`\x1b[36m[INFO]\x1b[0m ${msg}`);
  }

  pass(msg) {
    this.passed++;
    console.log(`\x1b[32m[PASS]\x1b[0m ${msg}`);
  }

  fail(msg) {
    this.failed++;
    console.log(`\x1b[31m[FAIL]\x1b[0m ${msg}`);
  }

  warn(msg) {
    this.warnings++;
    console.log(`\x1b[33m[WARN]\x1b[0m ${msg}`);
  }

  summary() {
    console.log('\n' + '='.repeat(60));
    console.log(`测试完成: 通过=${this.passed}, 失败=${this.failed}, 警告=${this.warnings}`);
    console.log('='.repeat(60));
    return this.failed === 0;
  }
}

// 主测试类
class ChartIntegrationTest {
  constructor() {
    this.logger = new TestLogger();
    this.client = null;
    this.authToken = null;
  }

  async init() {
    this.logger.info('初始化测试...');
    this.client = axios.create({
      baseURL: API_BASE,
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' }
    });

    // 登录获取 Token
    try {
      const resp = await this.client.post('/login', ADMIN_USER);
      this.authToken = resp.data.data?.token || resp.data.token;
      if (this.authToken) {
        this.client.defaults.headers.common['Authorization'] = `Bearer ${this.authToken}`;
        this.logger.pass('登录成功，已获取认证令牌');
      } else {
        this.logger.warn('未获取到 Token，可能不需要认证或接口响应格式不同');
      }
    } catch (error) {
      this.logger.warn(`登录失败，继续无认证测试: ${error.message}`);
    }
  }

  async testChartCreation(chartType) {
    const { id, name } = chartType;
    this.logger.info(`测试创建图表: ${name} (${id})`);

    try {
      const payload = {
        name: `Test ${name} ${Date.now()}`,
        orgId: TEST_ORG_ID,
        viewId: null,
        type: 'DATACHART',
        config: JSON.stringify(TEST_DATA_TEMPLATES[id])
      };

      const resp = await this.client.post('/viz/datacharts', payload);
      const chartId = resp.data.data?.id || resp.data.id;

      if (chartId) {
        this.logger.pass(`创建成功: chartId=${chartId}`);
        return chartId;
      } else {
        this.logger.fail(`创建失败，未返回ID`);
        return null;
      }
    } catch (error) {
      this.logger.fail(`创建异常: ${error.response?.status} ${error.message}`);
      return null;
    }
  }

  async testConfigUpdate(chartId, chartType) {
    const { id } = chartType;
    this.logger.info(`测试更新配置: chartId=${chartId}`);

    try {
      const newConfig = { ...TEST_DATA_TEMPLATES[id], _testUpdate: Date.now() };
      const payload = {
        id: chartId,
        config: JSON.stringify(newConfig)
      };

      const resp = await this.client.put(`/viz/datacharts/${chartId}`, payload);
      const success = resp.data.code === 0 || resp.data.success === true;

      if (success) {
        this.logger.pass('更新配置成功');
        return true;
      } else {
        this.logger.fail(`更新失败: ${JSON.stringify(resp.data)}`);
        return false;
      }
    } catch (error) {
      this.logger.fail(`更新异常: ${error.response?.status} ${error.message}`);
      return false;
    }
  }

  async testConfigLoad(chartId) {
    this.logger.info(`测试加载配置: chartId=${chartId}`);

    try {
      const resp = await this.client.get(`/viz/datacharts/${chartId}`);
      const data = resp.data.data || resp.data;
      const config = data.config;

      if (config && typeof config === 'string') {
        try {
          const parsed = JSON.parse(config);
          this.logger.pass(`加载成功，配置包含 ${Object.keys(parsed).length} 个顶级字段`);
          return parsed;
        } catch (e) {
          this.logger.fail('配置不是有效的JSON');
          return null;
        }
      } else {
        this.logger.fail('响应中未找到config字段');
        return null;
      }
    } catch (error) {
      this.logger.fail(`加载异常: ${error.response?.status} ${error.message}`);
      return null;
    }
  }

  async testChartType(chartType) {
    this.logger.info(`\n开始测试图表类型: ${chartType.name}`);

    // 1. 创建图表
    const chartId = await this.testChartCreation(chartType);
    if (!chartId) return false;

    // 2. 更新配置
    const updateOk = await this.testConfigUpdate(chartId, chartType);
    if (!updateOk) return false;

    // 3. 加载配置
    const loadedConfig = await this.testConfigLoad(chartId);
    if (!loadedConfig) return false;

    // 4. 验证配置内容
    const isValid = this.validateConfig(chartType.id, loadedConfig);
    return isValid;
  }

  validateConfig(chartTypeId, config) {
    const requiredSections = ['datas', 'styles'];
    const hasSections = requiredSections.every(sec => config[sec] && Array.isArray(config[sec]));

    if (!hasSections) {
      this.logger.fail('配置缺少必需的 sections (datas, styles)');
      return false;
    }

    // 检查 i18n（可选但建议有）
    if (config.i18ns && Array.isArray(config.i18ns)) {
      this.logger.pass(`配置包含 ${config.i18ns.length} 种语言国际化`);
    } else {
      this.logger.warn('配置缺少 i18n 国际化支持');
    }

    this.logger.pass('配置结构验证通过');
    return true;
  }

  async run() {
    this.logger.info('='.repeat(60));
    this.logger.info('新图表后端集成测试');

    // 初始化客户端
    await this.init();

    // 检查后端连接
    try {
      const health = await this.client.get('/health').catch(() => null);
      if (health) {
        this.logger.pass('后端健康检查通过');
      } else {
        this.logger.warn('健康检查端点不可用或服务未启动');
      }
    } catch (e) {
      this.logger.warn(`无法连接后端: ${e.message}`);
    }

    // 依次测试每种图表
    const results = [];
    for (const chartType of CHART_TYPES) {
      try {
        const result = await this.testChartType(chartType);
        results.push({ chart: chartType.name, passed: result });
      } catch (e) {
        this.logger.fail(`测试异常: ${e.message}`);
        results.push({ chart: chartType.name, passed: false, error: e.message });
      }
    }

    // 输出总结
    this.logger.summary();

    console.log('\n详细结果:');
    results.forEach(r => {
      const status = r.passed ? '\x1b[32m✓\x1b[0m' : '\x1b[31m✗\x1b[0m';
      console.log(`  ${status} ${r.chart}${r.error ? ` - ${r.error}` : ''}`);
    });

    return this.logger.passed === CHART_TYPES.length;
  }
}

// 运行测试
const test = new ChartIntegrationTest();
test.run()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('测试运行失败:', err);
    process.exit(1);
  });
