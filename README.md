# 我的技术博客

一个现代化的侧边栏布局博客系统，支持 Markdown 和 LaTeX，托管在 GitHub Pages 上。

## ✨ 特性

- 📝 **Markdown 支持**: 直接写 `.md` 文件，自动渲染
- 🧮 **LaTeX 数学公式**: 支持行内和块级公式
- 💻 **代码高亮**: 自动语法高亮
- 🌓 **深色模式**: 浅色/深色主题切换
- 📱 **完全响应式**: 适配桌面、平板和移动设备
- �️ **模块化组织**: 基础学习、代码复现、实用工具、文献精读
- ⚡ **零构建工具**: 纯 HTML/CSS/JavaScript

## 🚀 快速开始

### 本地预览

```bash
# 克隆仓库
git clone https://github.com/Vonfre/Vonfre.github.io.git
cd Vonfre.github.io

# 启动本地服务器
python3 -m http.server 8000

# 访问 http://localhost:8000
```

### 部署到 GitHub Pages

1. 推送代码到 GitHub
2. 在仓库 Settings → Pages 中启用 GitHub Pages
3. 选择 `main` 分支，`/ (root)` 目录
4. 访问 `https://vonfre.github.io/`

## 📝 添加新文章

### 三步添加文章

#### 1. 创建 Markdown 文件

在对应模块目录下创建 `.md` 文件：

```bash
posts/basics/your-article.md          # 基础学习
posts/reproduction/your-article.md    # 代码复现
posts/tools/your-article.md           # 实用工具
posts/literature/your-article.md      # 文献精读
```

#### 2. 编写内容

使用标准 Markdown 语法：

```markdown
# 文章标题

文章内容...

## 代码示例

\`\`\`python
def hello():
    print("Hello, World!")
\`\`\`

## 数学公式

$$
E = mc^2
$$
```

#### 3. 更新配置

编辑 `config.js`，添加文章信息：

```javascript
const ARTICLES = {
    basics: [
        {
            id: 'your-article',
            title: '你的文章标题',
            path: 'posts/basics/your-article.md',
            date: '2026-01-12',
            description: '文章简短描述'
        }
    ]
};
```

### 推送到 GitHub

```bash
git add .
git commit -m "Add new article"
git push origin main
```

## 📁 项目结构

```
.
├── index.html          # 主页面
├── styles.css          # 样式文件
├── app.js              # 应用逻辑
├── config.js           # 文章配置
├── README.md           # 项目说明
└── posts/              # Markdown 文章
    ├── basics/         # 基础学习
    ├── reproduction/   # 代码复现
    ├── tools/          # 实用工具
    └── literature/     # 文献精读
```

## 🎨 Markdown 语法

### 代码块

````markdown
```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
```
````

### LaTeX 公式

```markdown
# 行内公式
这是行内公式 $E = mc^2$ 的示例。

# 块级公式
$$
\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$
```

### 表格

```markdown
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 数据1 | 数据2 | 数据3 |
```

## 🛠️ 技术栈

- **HTML/CSS/JavaScript**: 核心技术
- **Marked.js**: Markdown 渲染
- **KaTeX**: LaTeX 数学公式
- **Highlight.js**: 代码语法高亮
- **Google Fonts**: Inter 和 JetBrains Mono

## 🎯 模块分类

- **📚 基础学习**: 编程语言、算法、数据结构
- **🔬 代码复现**: 论文和模型的代码实现
- **🛠️ 实用工具**: 开发工具、效率提升
- **📖 文献精读**: 重要论文的深度解读

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

- GitHub: [@Vonfre](https://github.com/Vonfre)
- Website: https://vonfre.github.io/

---

**Built with ❤️ and hosted on GitHub Pages**
