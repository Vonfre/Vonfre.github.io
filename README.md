# 我的技术博客

一个现代化、响应式的静态博客网站，托管在 GitHub Pages 上。

## ✨ 特性

- 🎨 **现代化设计**: 使用渐变色、玻璃态效果和流畅动画
- 🌓 **深色模式**: 支持浅色/深色主题切换
- 📱 **完全响应式**: 适配桌面、平板和移动设备
- 🔍 **搜索和筛选**: 快速查找感兴趣的文章
- 📝 **分类管理**: 按技术、生物信息学、教程等分类
- ⚡ **零构建工具**: 纯 HTML/CSS/JavaScript，无需编译

## 🚀 快速开始

### 本地预览

1. 克隆仓库到本地：
```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

2. 启动本地服务器：
```bash
# 使用 Python 3
python3 -m http.server 8000

# 或使用 Python 2
python -m SimpleHTTPServer 8000
```

3. 在浏览器中访问 `http://localhost:8000`

### 部署到 GitHub Pages

1. 将代码推送到 GitHub 仓库
2. 进入仓库的 Settings → Pages
3. 在 Source 下选择 `main` 分支
4. 点击 Save，等待部署完成
5. 访问 `https://your-username.github.io/your-repo`

## 📝 添加新文章

### 方法一：修改 JavaScript 数据

编辑 `script.js` 文件中的 `blogPosts` 数组，添加新文章信息：

```javascript
{
    id: 7,
    title: '你的文章标题',
    excerpt: '文章摘要...',
    category: 'tech', // tech, bioinformatics, tutorial
    categoryName: '技术',
    date: '2026-01-12',
    link: 'posts/your-post.html'
}
```

### 方法二：创建新文章页面

1. 在 `posts/` 目录下创建新的 HTML 文件
2. 复制现有文章模板（如 `javascript-async.html`）
3. 修改文章内容、标题和元信息
4. 在 `script.js` 中添加文章数据

## 🎨 自定义样式

### 修改颜色主题

编辑 `styles.css` 中的 CSS 变量：

```css
:root {
    --color-primary: hsl(250, 84%, 54%);
    --color-secondary: hsl(340, 82%, 52%);
    /* 修改其他颜色变量 */
}
```

### 修改字体

在 `index.html` 和文章页面的 `<head>` 中修改 Google Fonts 链接：

```html
<link href="https://fonts.googleapis.com/css2?family=Your+Font&display=swap" rel="stylesheet">
```

然后在 `styles.css` 中更新字体变量：

```css
:root {
    --font-sans: 'Your Font', sans-serif;
}
```

## 📁 项目结构

```
.
├── index.html          # 主页
├── styles.css          # 样式文件
├── script.js           # JavaScript 逻辑
├── posts/              # 博客文章目录
│   ├── javascript-async.html
│   ├── sequence-alignment.html
│   └── css-grid-tutorial.html
└── README.md           # 项目说明
```

## 🛠️ 技术栈

- **HTML5**: 语义化标记
- **CSS3**: 现代样式和动画
- **JavaScript**: 原生 ES6+
- **Google Fonts**: Inter 和 JetBrains Mono

## 📄 许可证

MIT License - 自由使用和修改

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

- GitHub: [@your-username](https://github.com/your-username)
- Email: your.email@example.com

---

**Built with ❤️ and hosted on GitHub Pages**
