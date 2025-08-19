# 房贷计算网站部署指南

本项目是一个纯静态的房贷计算分析工具，支持本地JavaScript计算，无需后端服务。

## 🚀 快速部署

### 方案一：GitHub Pages（推荐）

**优点**：完全免费、自动部署、支持自定义域名
**适合**：个人项目、开源项目

#### 步骤：
1. 在GitHub创建新仓库
2. 上传项目文件到仓库
3. 在仓库设置中开启GitHub Pages
4. 选择源分支（main/master）
5. 访问 `https://yourusername.github.io/reponame`

#### 自动部署：
- 项目已包含 `.github/workflows/deploy.yml` 配置
- 每次推送到main分支会自动部署

### 方案二：Netlify

**优点**：易于使用、功能丰富、支持表单处理
**适合**：需要更多功能的项目

#### 步骤：
1. 访问 [netlify.com](https://netlify.com)
2. 选择 "New site from Git" 或拖拽文件夹
3. 连接GitHub仓库或直接上传文件
4. 构建设置：
   - Build command: （留空）
   - Publish directory: （留空或填 `.`）
5. 部署完成，获得免费域名

#### 配置文件：
- `netlify.toml` 已包含优化配置
- 支持重定向、缓存优化、安全头部

### 方案三：Vercel

**优点**：极快速度、优秀的开发体验
**适合**：现代Web应用

#### 步骤：
1. 访问 [vercel.com](https://vercel.com)
2. 导入GitHub仓库或上传文件
3. Framework Preset: 选择 "Other" 
4. 构建设置：
   - Build Command: （留空）
   - Output Directory: （留空）
   - Install Command: （留空）
5. 部署完成

#### 配置文件：
- `vercel.json` 已包含静态资源优化配置

### 方案四：其他免费托管平台

#### Surge.sh
```bash
npm install -g surge
cd /path/to/your/project
surge
```

#### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 📁 项目文件结构

```
mortgage_calculation/
├── index.html          # 主页面
├── script.js          # 计算逻辑（纯JavaScript）
├── styles.css         # 样式文件
├── images/            # 图片资源
├── netlify.toml       # Netlify配置
├── vercel.json        # Vercel配置
├── _config.yml        # GitHub Pages配置
├── .github/workflows/deploy.yml  # GitHub Actions配置
├── .gitignore         # Git忽略文件
└── DEPLOYMENT.md      # 本部署说明
```

## ⚙️ 自定义配置

### 修改网站标题和描述
编辑 `index.html` 文件：
```html
<title>你的网站标题</title>
<meta name="description" content="你的网站描述">
```

### 修改默认参数
编辑 `script.js` 文件，找到默认值设置：
```javascript
document.getElementById('savings').value = '300';  // 修改默认存款
document.getElementById('house-price').value = '500';  // 修改默认房价
// ... 其他默认值
```

### 添加自定义域名

#### GitHub Pages：
1. 在仓库根目录创建 `CNAME` 文件
2. 文件内容写入你的域名：`yourdomain.com`
3. 在域名DNS设置中添加CNAME记录指向 `yourusername.github.io`

#### Netlify/Vercel：
1. 在控制台的Domain设置中添加自定义域名
2. 按照提示配置DNS记录

## 🔧 故障排除

### 常见问题

#### 1. 计算功能不工作
- 检查浏览器控制台是否有JavaScript错误
- 确认 `script.js` 文件加载正常
- 检查Chart.js CDN是否可访问

#### 2. 样式显示异常
- 确认 `styles.css` 文件路径正确
- 检查CSS文件是否完整

#### 3. 图片不显示
- 确认图片文件路径正确
- 检查图片文件是否上传到正确位置

#### 4. GitHub Pages部署失败
- 检查仓库是否为公开（或有GitHub Pro账户）
- 确认Actions权限已启用
- 查看Actions运行日志排查错误

### 性能优化建议

1. **图片优化**：
   - 压缩图片文件大小
   - 使用WebP格式（如果支持）

2. **缓存优化**：
   - 配置文件已包含缓存设置
   - 静态资源会被浏览器缓存一年

3. **加载速度**：
   - Chart.js使用CDN加载
   - CSS和JS文件尽量精简

## 🔒 安全配置

项目已包含基本的安全头部配置：
- `X-Frame-Options: DENY` - 防止页面被嵌入iframe
- `X-XSS-Protection: 1; mode=block` - XSS保护
- `X-Content-Type-Options: nosniff` - MIME类型保护

## 📈 使用统计（可选）

如需添加访问统计，可以集成：
- Google Analytics
- 百度统计
- Umami（开源替代方案）

在 `index.html` 的 `<head>` 部分添加对应的跟踪代码。

## 🆘 获取帮助

如果遇到部署问题：
1. 检查本文档的故障排除部分
2. 查看各平台的官方文档
3. 在项目GitHub仓库提交Issue

## 📄 许可证

本项目遵循 MIT 许可证，可自由使用和修改。