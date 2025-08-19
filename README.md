# 房贷计算和分析工具

[![部署状态](https://api.netlify.com/api/v1/badges/your-site-id/deploy-status)](https://app.netlify.com/sites/your-site-name/deploys)

一个专业的房贷对比分析工具，帮助您做出明智的购房决策。

## ✨ 功能特性

- 🏠 **财富总值对比**：租房 vs 买房的长期财富积累分析
- 💰 **月供压力评估**：详细的还款计划和压力分析
- 📊 **月度支出占比**：支出结构可视化分析
- 📈 **房价涨幅盈亏临界点**：投资回报临界点计算
- 🏘️ **房源筛选建议**：基于收入的购房能力分析
- 🤖 **智能建议**：基于计算结果的个性化建议

## 🚀 在线使用

**部署链接**：
- GitHub Pages: [https://yourusername.github.io/mortgage_calculation](https://yourusername.github.io/mortgage_calculation)
- Netlify: [https://your-site-name.netlify.app](https://your-site-name.netlify.app)
- Vercel: [https://your-project.vercel.app](https://your-project.vercel.app)

## 💻 本地运行

项目是纯静态网站，无需安装依赖：

```bash
# 克隆项目
git clone https://github.com/yourusername/mortgage_calculation.git
cd mortgage_calculation

# 直接用浏览器打开 index.html 或使用本地服务器
python -m http.server 8000
# 然后访问 http://localhost:8000
```

## 📝 使用说明

1. **填写财务情况**：输入现有存款、收入、支出等信息
2. **设置租房情况**：填入当前租金
3. **配置买房计划**：房价、首付、贷款等详细信息
4. **调整宏观参数**：利率、通胀率、投资回报率
5. **设置计算参数**：房产增值预期、灵活就业时间等
6. **点击计算**：获得详细的分析报告和可视化图表

## 🎯 计算原理

### 财富总值对比
- **租房财富** = 初始资产 + 累积现金流投资收益
- **买房财富** = 现金资产投资收益 + 房产价值 - 房贷余额

### 月供计算
- 支持等额本息和等额本金两种还款方式
- 公积金贷款和商业贷款分别计算
- 精确的利息和本金分离

### 投资假设
- 闲置资金投资年化收益率（默认5%）
- 房产年化增值率（可自定义）
- 通胀率影响（默认0.1%）

## 📊 示例场景

**假设输入**：
- 现有存款：300万
- 月收入：5万
- 房价：500万
- 首付：300万
- 贷款：200万（20年）

**分析结果**：
- 30年后租房财富：XXX万
- 30年后买房财富：XXX万
- 月供压力：XX%
- 盈亏临界点：房价需增值XX%

## 🔧 技术栈

- **前端**：原生HTML5 + CSS3 + JavaScript
- **图表**：Chart.js
- **部署**：静态托管（GitHub Pages/Netlify/Vercel）
- **特性**：响应式设计、无后端依赖

## 📂 项目结构

```
├── index.html          # 主页面
├── script.js          # 计算逻辑
├── styles.css         # 样式文件
├── images/            # 图片资源
├── DEPLOYMENT.md      # 部署指南
└── 配置文件/          # 各平台部署配置
```

## 🚀 部署指南

详细部署说明请查看 [DEPLOYMENT.md](DEPLOYMENT.md)

支持一键部署到：
- ✅ GitHub Pages（免费）
- ✅ Netlify（免费）
- ✅ Vercel（免费）
- ✅ Surge.sh（免费）
- ✅ Firebase Hosting（免费）

## 🤝 贡献指南

欢迎提交问题和改进建议！

1. Fork本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

## ⚠️ 免责声明

本工具仅供参考，实际购房决策应咨询专业人士。计算结果基于输入参数，不代表实际投资建议。

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE) - 查看LICENSE文件了解详情

## 🙏 致谢

- Chart.js - 图表库
- 各大免费托管平台的支持

---

如果这个工具对您有帮助，请给项目一个 ⭐️！