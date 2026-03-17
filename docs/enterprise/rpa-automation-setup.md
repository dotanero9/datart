# RPA 自动化技能配置指南

## 已安装技能清单

✅ **已安装并可用：**

| 技能名称 | 版本 | 用途 | 状态 |
|---------|------|------|------|
| automation-workflows | 0.1.0 | 自动化工作流设计和实施 | ✅ 就绪 |
| web-browser-automation | 1.0.0 | 基于 Apify 的网页自动化 | ⚠️ 需配置 API |
| task-automation-workflows | 1.0.0 | 任务自动化和脚本 | ✅ 就绪 |
| browser-automation | 1.0.1 | 本地浏览器自动化 (Stagehand) | ⚠️ 需额外配置 |
| playwright | 1.0.3 | Playwright 浏览器自动化 (MCP) | ✅ 就绪 |
| puppeteer | 1.0.0 | Puppeteer Chrome 自动化 | ✅ 就绪 |
| n8n-workflow-automation | 1.0.0 | n8n 工作流自动化 | ✅ 就绪 |

---

## 技能详细说明

### 1. automation-workflows（自动化工作流）

**用途：** 设计和实施自动化工作流，识别可自动化的重复任务

**触发词：** "automate", "automation", "workflow automation", "save time", "reduce manual work"

**功能：**
- 自动化机会识别
- 工作流设计（Zapier, Make, n8n）
- 工具选择和比较
- 测试和维护指南

**无需额外配置，直接使用。**

---

### 2. web-browser-automation（网页自动化 - Apify）

**用途：** 使用 Apify 平台进行网页表单填写、数据抓取、UI 测试

**触发词：** 网页交互、表单填写、数据抓取

**配置步骤：**

1. 注册 Apify 免费账户：https://www.apify.com/?fpr=dx06p
2. 获取 Personal API Token（Settings → Integrations）
3. 设置环境变量：
   ```bash
   export AUTOMATION_TOKEN=api_xxxxxxxxxxxxxxxx
   ```

**示例命令：**
```javascript
const response = await fetch(
  "https://api.apify.com/v2/acts/apify~puppeteer-scraper/runs",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.AUTOMATION_TOKEN}`
    },
    body: JSON.stringify({
      startUrls: [{ url: "https://example.com" }],
      pageFunction: `async function pageFunction({ page }) {
        await page.waitForSelector('#name');
        await page.type('#name', 'Jane Smith');
        await page.click('button[type="submit"]');
        return { success: true };
      }`
    })
  }
);
```

---

### 3. task-automation-workflows（任务自动化）

**用途：** 创建自动化脚本处理文件操作、数据处理、API 调用和定时任务

**触发词：** "automate", "workflow", "schedule", "repetitive", "batch", "cron"

**功能：**
- 文件批量操作（重命名、转换、整理）
- 数据处理管道
- API 批量调用（带限流和重试）
- 定时任务（cron、Python scheduler）
- 工作流模式（顺序、并行、条件）

**无需额外配置，直接使用。**

**示例脚本：**
```python
# 批量重命名文件
def batch_rename(directory, pattern, replacement):
    import os, re
    for filename in os.listdir(directory):
        if re.match(pattern, filename):
            new_name = re.sub(pattern, replacement, filename)
            os.rename(os.path.join(directory, filename),
                     os.path.join(directory, new_name))
```

---

### 4. browser-automation（浏览器自动化 - Stagehand）

**用途：** 使用 Stagehand CLI 进行本地浏览器自动化

**状态：** ⚠️ 需要额外配置

**当前状态：**
- ✅ Chrome 已安装 (/usr/bin/google-chrome)
- ❌ 缺少 package.json（技能包不完整）
- ❌ 未配置 ANTHROPIC_API_KEY

**建议：** 优先使用 `playwright` 或 `puppeteer` 技能。

---

### 5. playwright（Playwright 浏览器自动化）⭐ 推荐

**用途：** 使用 Playwright MCP 进行浏览器自动化，支持导航、点击、表单填写、截图、数据提取

**触发词：** 浏览器自动化、Playwright、网页测试、截图、PDF 生成

**功能：**
- MCP 模式：`npx @playwright/mcp --headless`
- 直接脚本模式
- 测试套件：`npx playwright test`
- 代码生成：`npx playwright codegen https://example.com`

**无需额外配置，直接使用。**

**示例脚本：**
```javascript
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://example.com');
  await page.screenshot({ path: 'page.png', fullPage: true });
  await browser.close();
})();
```

---

### 6. puppeteer（Puppeteer Chrome 自动化）⭐ 推荐

**用途：** 使用 Puppeteer 自动化 Chrome/Chromium，用于抓取、测试、截图

**触发词：** Puppeteer、Chrome 自动化、无头浏览器

**功能：**
- 网页抓取
- E2E 测试
- PDF 生成
- 截图
- 浏览器工作流

**无需额外配置，直接使用。**

**示例脚本：**
```javascript
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('https://example.com');
  await page.waitForSelector('#button');
  await page.click('#button');
  await page.screenshot({ path: 'screenshot.png' });
  await browser.close();
})();
```

---

### 7. n8n-workflow-automation（n8n 工作流自动化）

**用途：** 设计和输出 n8n 工作流 JSON，包含触发器、幂等性、错误处理、日志、重试和人工审核队列

**触发词：** n8n、工作流、自动化、定时任务、webhook

**功能：**
- 定时触发器（cron）
- Webhook 触发器
- 错误处理和重试
- 审计日志
- 人工审核队列
- 幂等性设计

**无需额外配置，直接使用。**

**输出：** n8n 工作流 JSON（可导入）+ runbook.md

---

## 推荐使用场景

| 场景 | 推荐技能 | 说明 |
|------|---------|------|
| 网页数据抓取 | `playwright` / `puppeteer` | 本地浏览器自动化，最灵活 |
| 网页数据抓取（云） | `web-browser-automation` | 基于 Apify，免配置浏览器 |
| 设计自动化工作流 | `automation-workflows` | Zapier/Make/n8n 设计指南 |
| n8n 工作流实现 | `n8n-workflow-automation` | 生成可导入的 n8n JSON |
| 文件批量处理 | `task-automation-workflows` | Python 脚本批量操作 |
| 定时任务 | `task-automation-workflows` | cron / Python scheduler |
| E2E 测试 | `playwright` | 专业测试框架 |
| 截图/PDF 生成 | `playwright` / `puppeteer` | 浏览器渲染 |
| 表单自动填写 | `playwright` / `puppeteer` | 本地执行 |
| 表单自动填写（云） | `web-browser-automation` | Apify 执行 |

---

## 快速开始

告诉我要自动化的任务，例如：

- "帮我抓取某个网站的产品数据"
- "设计一个自动化工作流来处理客户邮件"
- "批量重命名这些文件"
- "每天自动发送报告"
- "用 Playwright 写一个测试脚本"
- "创建一个 n8n 工作流"

我会选择合适的技能来完成任务。

---

## 配置检查

运行以下命令检查配置状态：

```bash
# 检查已安装技能
clawhub list

# 检查 Apify API Token（如使用 web-browser-automation）
echo $AUTOMATION_TOKEN

# 检查 Chrome（用于 puppeteer/playwright）
which google-chrome

# 检查 Node.js（用于所有技能）
node --version
```

---

## 下一步建议

1. **本地优先**：优先使用 `playwright` 和 `puppeteer` 进行本地自动化
2. **云备用**：如需避免反爬虫，使用 `web-browser-automation`（Apify）
3. **工作流设计**：使用 `automation-workflows` 学习最佳实践
4. **n8n 实现**：使用 `n8n-workflow-automation` 生成可导入的工作流

所有技能均已本地化部署，无需外部 API（除 Apify 外）。
