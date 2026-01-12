// ==================== 全局状态 ====================
let currentArticle = null;
let currentTheme = localStorage.getItem('theme') || 'light';

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    initMobileMenu();
    handleRouting();

    // 监听 URL 变化
    window.addEventListener('hashchange', handleRouting);
});

// ==================== 主题切换 ====================
function initTheme() {
    const html = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.querySelector('.theme-icon');

    html.setAttribute('data-theme', currentTheme);
    updateThemeIcon(themeIcon, currentTheme);

    themeToggle.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', currentTheme);
        localStorage.setItem('theme', currentTheme);
        updateThemeIcon(themeIcon, currentTheme);
    });
}

function updateThemeIcon(icon, theme) {
    icon.textContent = theme === 'light' ? '🌙' : '☀️';
}

// ==================== 导航初始化 ====================
function initNavigation() {
    // 为每个分类生成导航项
    Object.keys(ARTICLES).forEach(category => {
        const navContainer = document.getElementById(`nav-${category}`);
        const articles = ARTICLES[category];

        articles.forEach(article => {
            const navItem = document.createElement('a');
            navItem.href = `#${category}/${article.id}`;
            navItem.className = 'nav-item';
            navItem.innerHTML = `<span class="nav-text">${article.title}</span>`;
            navItem.dataset.articleId = article.id;
            navItem.dataset.category = category;

            navContainer.appendChild(navItem);
        });
    });

    // 导航项点击事件
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            e.currentTarget.classList.add('active');
        });
    });
}

// ==================== 移动端菜单 ====================
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');

    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });

    // 点击内容区关闭菜单
    document.getElementById('contentWrapper').addEventListener('click', () => {
        if (sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        }
    });
}

// ==================== 路由处理 ====================
function handleRouting() {
    const hash = window.location.hash.slice(1); // 移除 #

    if (!hash || hash === 'home') {
        loadHomePage();
        return;
    }

    const [category, articleId] = hash.split('/');

    if (category && articleId) {
        loadArticle(category, articleId);
    } else {
        loadHomePage();
    }
}

// ==================== 加载首页 ====================
function loadHomePage() {
    const contentWrapper = document.getElementById('contentWrapper');

    let html = `
        <div class="home-page">
            <div class="home-header">
                <h1 class="home-title">欢迎来到我的技术博客</h1>
                <p class="home-description">记录学习历程，分享技术见解</p>
            </div>
            
            <div class="categories-grid">
    `;

    Object.keys(CATEGORIES).forEach(key => {
        const category = CATEGORIES[key];
        const articles = ARTICLES[key];

        html += `
            <div class="category-card">
                <div class="category-icon">${category.icon}</div>
                <h3 class="category-name">${category.name}</h3>
                <p class="category-description">${category.description}</p>
                <div class="category-count">${articles.length} 篇文章</div>
            </div>
        `;
    });

    html += `
            </div>
            
            <div class="recent-articles">
                <h2 class="section-title">最新文章</h2>
                <div class="articles-list">
    `;

    // 获取所有文章并按日期排序
    const allArticles = [];
    Object.keys(ARTICLES).forEach(category => {
        ARTICLES[category].forEach(article => {
            allArticles.push({ ...article, category });
        });
    });
    allArticles.sort((a, b) => new Date(b.date) - new Date(a.date));

    // 显示最新的 5 篇文章
    allArticles.slice(0, 5).forEach(article => {
        const categoryInfo = CATEGORIES[article.category];
        html += `
            <a href="#${article.category}/${article.id}" class="article-item">
                <div class="article-category-badge">${categoryInfo.icon} ${categoryInfo.name}</div>
                <h4 class="article-title">${article.title}</h4>
                <p class="article-description">${article.description}</p>
                <div class="article-date">${article.date}</div>
            </a>
        `;
    });

    html += `
                </div>
            </div>
        </div>
    `;

    contentWrapper.innerHTML = html;

    // 更新导航激活状态
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector('[data-page="home"]').classList.add('active');
}

// ==================== 加载文章 ====================
async function loadArticle(category, articleId) {
    const contentWrapper = document.getElementById('contentWrapper');
    const article = ARTICLES[category]?.find(a => a.id === articleId);

    if (!article) {
        contentWrapper.innerHTML = '<div class="error">文章未找到</div>';
        return;
    }

    currentArticle = article;

    // 显示加载状态
    contentWrapper.innerHTML = '<div class="loading">加载中...</div>';

    try {
        // 加载 Markdown 文件
        const response = await fetch(article.path);
        if (!response.ok) throw new Error('文件加载失败');

        const markdown = await response.text();

        // 配置 Marked
        marked.setOptions({
            highlight: function (code, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    return hljs.highlight(code, { language: lang }).value;
                }
                return hljs.highlightAuto(code).value;
            },
            breaks: true,
            gfm: true
        });

        // 渲染 Markdown
        const html = marked.parse(markdown);

        // 显示文章
        const categoryInfo = CATEGORIES[category];
        contentWrapper.innerHTML = `
            <article class="article-content">
                <div class="article-header">
                    <div class="article-meta">
                        <span class="article-category">${categoryInfo.icon} ${categoryInfo.name}</span>
                        <span class="article-date">${article.date}</span>
                    </div>
                    <h1 class="article-title">${article.title}</h1>
                    ${article.description ? `<p class="article-description">${article.description}</p>` : ''}
                </div>
                <div class="markdown-body">
                    ${html}
                </div>
            </article>
        `;

        // 渲染 LaTeX 公式
        renderMathInElement(contentWrapper, {
            delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$', right: '$', display: false },
                { left: '\\[', right: '\\]', display: true },
                { left: '\\(', right: '\\)', display: false }
            ],
            throwOnError: false
        });

        // 滚动到顶部
        contentWrapper.scrollTop = 0;

    } catch (error) {
        console.error('加载文章失败:', error);
        contentWrapper.innerHTML = `
            <div class="error">
                <h2>加载失败</h2>
                <p>无法加载文章内容，请检查文件路径是否正确。</p>
                <p class="error-detail">${error.message}</p>
                <a href="#home" class="btn-back">返回首页</a>
            </div>
        `;
    }
}
