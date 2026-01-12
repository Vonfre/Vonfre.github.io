// ==================== 主题切换功能 ====================
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.querySelector('.theme-icon');
const html = document.documentElement;

// 从本地存储加载主题
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
}

// ==================== 博客文章数据 ====================
const blogPosts = [
    {
        id: 1,
        title: 'JavaScript 异步编程完全指南',
        excerpt: '深入探讨 JavaScript 中的异步编程模式，包括回调、Promise、async/await 等核心概念，以及实际应用场景和最佳实践。',
        category: 'tech',
        categoryName: '技术',
        date: '2026-01-10',
        link: 'posts/javascript-async.html'
    },
    {
        id: 2,
        title: '生物信息学中的序列比对算法',
        excerpt: '介绍生物信息学中常用的序列比对算法，包括 Smith-Waterman、Needleman-Wunsch 等经典算法的原理和实现。',
        category: 'bioinformatics',
        categoryName: '生物信息学',
        date: '2026-01-08',
        link: 'posts/sequence-alignment.html'
    },
    {
        id: 3,
        title: 'CSS Grid 布局实战教程',
        excerpt: '通过实际案例学习 CSS Grid 布局系统，掌握现代网页布局的核心技术，创建复杂而优雅的页面结构。',
        category: 'tutorial',
        categoryName: '教程',
        date: '2026-01-05',
        link: 'posts/css-grid-tutorial.html'
    },
    {
        id: 4,
        title: 'Python 数据分析入门',
        excerpt: '使用 Pandas 和 NumPy 进行数据分析的入门教程，涵盖数据清洗、转换、可视化等基础操作。',
        category: 'tutorial',
        categoryName: '教程',
        date: '2026-01-03',
        link: 'posts/python-data-analysis.html'
    },
    {
        id: 5,
        title: '基因组学数据可视化技术',
        excerpt: '探索基因组学数据可视化的各种方法和工具，包括热图、散点图、基因组浏览器等可视化技术。',
        category: 'bioinformatics',
        categoryName: '生物信息学',
        date: '2025-12-28',
        link: 'posts/genomics-visualization.html'
    },
    {
        id: 6,
        title: '现代前端开发工具链',
        excerpt: '介绍现代前端开发中常用的工具链，包括构建工具、包管理器、代码质量工具等，提升开发效率。',
        category: 'tech',
        categoryName: '技术',
        date: '2025-12-25',
        link: 'posts/frontend-toolchain.html'
    }
];

// ==================== 渲染文章列表 ====================
const postsGrid = document.getElementById('postsGrid');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');
const postCountElement = document.getElementById('postCount');

let currentCategory = 'all';
let searchQuery = '';

function renderPosts() {
    const filteredPosts = blogPosts.filter(post => {
        const matchesCategory = currentCategory === 'all' || post.category === currentCategory;
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    postsGrid.innerHTML = '';

    if (filteredPosts.length === 0) {
        postsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--color-text-secondary);">
                <p style="font-size: 1.25rem;">未找到匹配的文章</p>
            </div>
        `;
        return;
    }

    filteredPosts.forEach((post, index) => {
        const postCard = document.createElement('div');
        postCard.className = 'post-card';
        postCard.style.animationDelay = `${index * 0.1}s`;
        postCard.innerHTML = `
            <div class="post-meta">
                <span class="post-category">${post.categoryName}</span>
                <span class="post-date">${formatDate(post.date)}</span>
            </div>
            <h3 class="post-title">${post.title}</h3>
            <p class="post-excerpt">${post.excerpt}</p>
            <a href="${post.link}" class="post-link">
                阅读全文 →
            </a>
        `;
        
        postCard.addEventListener('click', (e) => {
            if (e.target.tagName !== 'A') {
                window.location.href = post.link;
            }
        });
        
        postsGrid.appendChild(postCard);
    });

    // 更新文章计数
    if (postCountElement) {
        postCountElement.textContent = blogPosts.length;
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// ==================== 分类筛选 ====================
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentCategory = button.getAttribute('data-category');
        renderPosts();
    });
});

// ==================== 搜索功能 ====================
searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderPosts();
});

// ==================== 平滑滚动 ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== 导航栏滚动效果 ====================
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = 'var(--shadow-md)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// ==================== 导航链接激活状态 ====================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    renderPosts();
});
