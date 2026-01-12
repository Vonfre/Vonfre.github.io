// ==================== 全局状态 ====================
let currentArticle = null;
let currentTheme = localStorage.getItem('theme') || 'light';
let collapsedSections = JSON.parse(localStorage.getItem('collapsedSections') || '{}');
let tocItems = [];

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    initMobileMenu();
    initCollapsibleSections();
    initScrollTopBtn();
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

// ==================== 侧边栏折叠功能 ====================
function initCollapsibleSections() {
    const sectionHeaders = document.querySelectorAll('.nav-section-header');

    sectionHeaders.forEach(header => {
        const sectionName = header.dataset.section;
        const section = header.closest('.nav-section');
        const navItems = section.querySelector('.nav-items');

        // 恢复保存的折叠状态
        if (collapsedSections[sectionName]) {
            section.classList.add('collapsed');
        }

        header.addEventListener('click', () => {
            section.classList.toggle('collapsed');
            collapsedSections[sectionName] = section.classList.contains('collapsed');
            localStorage.setItem('collapsedSections', JSON.stringify(collapsedSections));
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

// ==================== 滚动到顶部按钮 ====================
function initScrollTopBtn() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const mainContent = document.querySelector('.main-content');

    mainContent.addEventListener('scroll', () => {
        if (mainContent.scrollTop > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }

        // 更新TOC高亮
        updateTOCHighlight();
    });

    scrollTopBtn.addEventListener('click', () => {
        mainContent.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ==================== 路由处理 ====================
function handleRouting() {
    const hash = window.location.hash.slice(1);

    if (!hash || hash === 'home') {
        loadHomePage();
        hideTOC();
        return;
    }

    const [category, articleId] = hash.split('/');

    if (category && articleId) {
        loadArticle(category, articleId);
        // 展开对应的分类
        expandSection(category);
    } else {
        loadHomePage();
        hideTOC();
    }
}

// ==================== 展开指定分类 ====================
function expandSection(category) {
    const section = document.querySelector(`[data-section="${category}"]`);
    if (section) {
        const navSection = section.closest('.nav-section');
        navSection.classList.remove('collapsed');
        collapsedSections[category] = false;
        localStorage.setItem('collapsedSections', JSON.stringify(collapsedSections));
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
        hideTOC();
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

        // 添加代码块折叠和复制功能
        enhanceCodeBlocks();

        // 生成并显示TOC
        generateTOC();
        showTOC();

        // 滚动到顶部
        document.querySelector('.main-content').scrollTop = 0;

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
        hideTOC();
    }
}

// ==================== 生成文章目录 ====================
function generateTOC() {
    const markdownBody = document.querySelector('.markdown-body');
    if (!markdownBody) return;

    const headings = markdownBody.querySelectorAll('h2, h3');
    tocItems = [];

    headings.forEach((heading, index) => {
        const id = `heading-${index}`;
        heading.id = id;

        tocItems.push({
            id: id,
            text: heading.textContent,
            level: parseInt(heading.tagName.substring(1)),
            element: heading
        });
    });

    // 渲染TOC
    const tocNav = document.getElementById('tocNav');
    if (tocItems.length === 0) {
        tocNav.innerHTML = '<p class="toc-empty">本文暂无目录</p>';
        return;
    }

    let tocHtml = '<ul class="toc-list">';
    tocItems.forEach(item => {
        const className = item.level === 2 ? 'toc-item' : 'toc-item toc-item-sub';
        tocHtml += `
            <li class="${className}">
                <a href="#${item.id}" class="toc-link" data-target="${item.id}">
                    ${item.text}
                </a>
            </li>
        `;
    });
    tocHtml += '</ul>';

    tocNav.innerHTML = tocHtml;

    // TOC点击事件
    tocNav.querySelectorAll('.toc-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.dataset.target;
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const mainContent = document.querySelector('.main-content');
                const offsetTop = targetElement.offsetTop - 80;
                mainContent.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });
}

// ==================== 更新TOC高亮 ====================
function updateTOCHighlight() {
    if (tocItems.length === 0) return;

    const mainContent = document.querySelector('.main-content');
    const scrollTop = mainContent.scrollTop;

    let currentIndex = 0;
    for (let i = 0; i < tocItems.length; i++) {
        const heading = tocItems[i].element;
        if (heading.offsetTop - 100 <= scrollTop) {
            currentIndex = i;
        } else {
            break;
        }
    }

    // 更新TOC激活状态
    document.querySelectorAll('.toc-link').forEach((link, index) => {
        if (index === currentIndex) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ==================== 显示/隐藏TOC ====================
function showTOC() {
    const tocSidebar = document.getElementById('tocSidebar');
    tocSidebar.classList.add('visible');

    // TOC切换按钮
    const tocToggle = document.getElementById('tocToggle');
    tocToggle.onclick = () => {
        tocSidebar.classList.toggle('collapsed');
    };
}

function hideTOC() {
    const tocSidebar = document.getElementById('tocSidebar');
    tocSidebar.classList.remove('visible');
    tocItems = [];
}

// ==================== 增强代码块 ====================
function enhanceCodeBlocks() {
    const codeBlocks = document.querySelectorAll('.markdown-body pre code');

    codeBlocks.forEach((code, index) => {
        const pre = code.parentElement;
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';

        // 获取语言
        const language = [...code.classList].find(cls => cls.startsWith('language-'))?.replace('language-', '') || 'text';

        // 获取代码行数
        const lines = code.textContent.split('\n').length;

        // 创建工具栏
        const toolbar = document.createElement('div');
        toolbar.className = 'code-toolbar';
        toolbar.innerHTML = `
            <span class="code-language">${language}</span>
            <div class="code-actions">
                <button class="code-copy-btn" data-code-index="${index}" title="复制代码">
                    <span class="copy-icon">📋</span>
                </button>
                ${lines > 15 ? `<button class="code-collapse-btn" data-collapsed="true" title="展开/折叠">
                    <span class="collapse-text">展开</span>
                </button>` : ''}
            </div>
        `;

        // 包装代码块
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(toolbar);
        wrapper.appendChild(pre);

        // 如果代码行数多，默认折叠
        if (lines > 15) {
            wrapper.classList.add('collapsed');
        }
    });

    // 复制按钮事件
    document.querySelectorAll('.code-copy-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const wrapper = btn.closest('.code-block-wrapper');
            const code = wrapper.querySelector('code').textContent;

            try {
                await navigator.clipboard.writeText(code);
                const icon = btn.querySelector('.copy-icon');
                icon.textContent = '✓';
                setTimeout(() => icon.textContent = '📋', 2000);
            } catch (err) {
                console.error('复制失败:', err);
            }
        });
    });

    // 折叠按钮事件
    document.querySelectorAll('.code-collapse-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const wrapper = btn.closest('.code-block-wrapper');
            const isCollapsed = wrapper.classList.toggle('collapsed');
            btn.querySelector('.collapse-text').textContent = isCollapsed ? '展开' : '折叠';
        });
    });
}
