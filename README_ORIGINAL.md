# 房贷计算和分析工具 - Claude AI版

这是一个集成了Claude AI的专业房贷计算和分析工具，能够提供详细的财务分析和购房建议。

## 🚀 快速开始

### 1. 安装依赖

```bash
cd /Users/liuchang/Code/mortgage_calculation
npm install
```

### 2. 启动代理服务器

```bash
npm start
```

服务器将在 http://localhost:3001 启动

### 3. 打开网页

在浏览器中打开 `index.html` 或访问 http://localhost:3001/index.html

### 4. 配置Claude API Key

1. 访问 [Anthropic Console](https://console.anthropic.com/) 获取API Key
2. 在网页上点击"配置"按钮
3. 输入您的Claude API Key
4. 选择"Claude AI智能计算"模式

## 📋 功能特性

### 双模式计算
- **Claude AI智能计算**：使用Claude AI进行复杂的房贷分析，提供更准确和智能的结果
- **本地JavaScript计算**：传统的本地计算模式，无需API连接

### 全面的分析报告
1. 📊 财富总值对比
2. 💰 月供压力评估  
3. 📊 月度支出占比
4. ⚖️ 成本支出总值对比
5. 📈 房价涨幅盈亏临界点
6. 📊 投资回报对比
7. 💳 可支配现金流对比
8. 📊 机会成本模拟
9. 🏃 现金流续航能力对比
10. 🏘️ 筛选目标区域房源

### 智能建议
Claude AI基于计算结果提供个性化的购房建议

## 🔧 技术架构

- **前端**：HTML + CSS + JavaScript
- **AI集成**：Claude API (Anthropic)
- **代理服务器**：Node.js + Express
- **图表库**：Chart.js

## 🛠️ 故障排除

### 常见问题

**Q: 出现 "Failed to fetch" 错误**
A: 这是跨域问题，请确保：
1. 代理服务器已启动 (`npm start`)
2. API Key配置正确
3. 网络连接正常

**Q: 代理服务器无法启动**
A: 请检查：
1. Node.js版本 >= 14
2. 端口3001是否被占用
3. 运行 `npm install` 安装依赖

**Q: Claude API Key在哪里获取？**
A: 访问 https://console.anthropic.com/ 注册账户并创建API Key

### 调试模式

开启浏览器开发者工具查看详细的错误信息和日志。

## 📦 项目结构

```
mortgage_calculation/
├── index.html              # 主页面
├── styles.css              # 样式文件  
├── script.js               # 主要逻辑
├── claude-api.js           # Claude API集成
├── proxy-server.js         # 代理服务器
├── package.json            # 项目配置
└── README.md               # 说明文档
```

## 🔒 安全说明

- API Key仅存储在浏览器本地存储中
- 代理服务器不会记录或存储API Key
- 所有API调用都通过HTTPS加密传输

## 📞 支持

如有问题，请检查：
1. 控制台错误信息
2. 代理服务器日志
3. 网络连接状态

## 🎯 使用建议

1. 首次使用建议先用本地计算模式熟悉功能
2. 配置Claude API后享受AI智能分析
3. 定期更新API Key确保服务可用
4. 建议在网络稳定的环境下使用Claude AI模式