/* ==================== 核心应用逻辑 (app.js) ==================== */

class PersonalWebApp {
  constructor() {
    this.currentPage = 'home';
    this.notes = [];
    this.projects = [];
    this.lifeRecords = [];
    this.init();
  }

  init() {
    this.setupTheme();
    this.setupNavigation();
    this.setupNotesSystem();
    this.setupProjectsSystem();
    this.setupLifeSystem();
    this.setupSearch();
  }

  // ========== Theme Management ==========
  setupTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
    }
    
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  // ========== Navigation ==========
  setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Update active nav link
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Get page name from data attribute or href
        const pageName = link.dataset.page || link.getAttribute('href').substring(1);
        this.navigateTo(pageName);
        
        // Close mobile menu
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
      });
    });
    
    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });
  }

  navigateTo(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageName);
    if (targetPage) {
      targetPage.classList.add('active');
      this.currentPage = pageName;
      window.history.pushState({ page: pageName }, '', `#${pageName}`);
    }
  }

  // ========== Notes System ==========
  setupNotesSystem() {
    // Sample notes data
    this.notes = [
      {
        id: 1,
        title: 'React Hooks 完全指南',
        category: 'frontend',
        date: '2024-01-15',
        excerpt: '深入理解React Hooks的原理和最佳实践...',
        content: `# React Hooks 完全指南

## 什么是 Hooks?
Hooks 是 React 16.8+ 推出的新特性，让你在函数组件中使用状态等 React 特性。

### useState Hook
\`\`\`javascript
const [count, setCount] = useState(0);

return (
  <button onClick={() => setCount(count + 1)}>
    Count: {count}
  </button>
);
\`\`\`

### useEffect Hook
副作用函数，用于处理组件挂载、更新和卸载逻辑：
\`\`\`javascript
useEffect(() => {
  console.log('Component mounted');
  
  return () => {
    console.log('Component unmounted');
  };
}, []);
\`\`\`

### 自定义 Hooks
创建可复用的逻辑：
\`\`\`javascript
function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return size;
}
\`\`\`

## 最佳实践
1. **只在 React 函数顶层调用 Hooks**
2. **只在 React 函数或自定义 Hooks 中调用 Hooks**
3. **使用 ESLint 插件 \`eslint-plugin-react-hooks\`**
4. **Hooks 依赖数组必须包含所有依赖项**

## 常见 Hooks
- \`useState\`: 状态管理
- \`useEffect\`: 副作用处理
- \`useContext\`: 跨层级通信
- \`useReducer\`: 复杂状态管理
- \`useCallback\`: 缓存函数
- \`useMemo\`: 缓存计算结果
- \`useRef\`: 获取 DOM 引用

## 总结
Hooks 改变了 React 函数式编程的方式，使代码更简洁易维护。`
      },
      {
        id: 2,
        title: 'Node.js 事件循环深解',
        category: 'backend',
        date: '2024-01-10',
        excerpt: 'Node.js 事件循环机制详解，包括 libuv 原理...',
        content: `# Node.js 事件循环深解

## 事件循环概述
Node.js 是单线程异步 I/O 驱动的 JavaScript 运行环境，事件循环是其核心。

## 事件循环阶段

### 1. timers 阶段
执行 \`setTimeout\` 和 \`setInterval\` 的回调。

### 2. pending callbacks 阶段
执行延迟到下一个循环迭代的 I/O 回调。

### 3. idle, prepare 阶段
内部使用。

### 4. poll 阶段
轮询检查新的 I/O 事件。

### 5. check 阶段
执行 \`setImmediate\` 回调。

### 6. close callbacks 阶段
执行关闭回调。

## 代码示例
\`\`\`javascript
console.log('Start');

setTimeout(() => {
  console.log('setTimeout');
}, 0);

setImmediate(() => {
  console.log('setImmediate');
});

console.log('End');

// 输出：
// Start
// End
// setTimeout
// setImmediate
\`\`\`

## 微任务队列
Promises 和 \`process.nextTick()\` 都在微任务队列中执行，优先级高于 macrotasks。`
      },
      {
        id: 3,
        title: '数据结构：二叉树与二叉搜索树',
        category: 'algorithm',
        date: '2024-01-05',
        excerpt: '掌握树形结构，从二叉树到平衡树的完整学习...',
        content: `# 数据结构：二叉树与二叉搜索树

## 二叉树基础

### 定义
二叉树是每个节点最多有两个子树的树结构。

### 树的遍历
\`\`\`javascript
class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

// 前序遍历 (Pre-order)
function preorder(root, result = []) {
  if (!root) return result;
  result.push(root.val);
  preorder(root.left, result);
  preorder(root.right, result);
  return result;
}

// 中序遍历 (In-order)
function inorder(root, result = []) {
  if (!root) return result;
  inorder(root.left, result);
  result.push(root.val);
  inorder(root.right, result);
  return result;
}

// 后序遍历 (Post-order)
function postorder(root, result = []) {
  if (!root) return result;
  postorder(root.left, result);
  postorder(root.right, result);
  result.push(root.val);
  return result;
}

// 层序遍历 (Level-order)
function levelorder(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];
  
  while (queue.length) {
    const level = [];
    const size = queue.length;
    
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    result.push(level);
  }
  
  return result;
}
\`\`\`

## 二叉搜索树 (BST)

### 性质
- 左子树所有节点值小于根节点
- 右子树所有节点值大于根节点
- 递归地，每个子树也都是二叉搜索树

### 查找
时间复杂度 \\(O(\\log n)\\)（平衡）或 \\(O(n)\\)（不平衡）

## 平衡二叉树
AVL 树、红黑树等确保树的高度为 \\(O(\\log n)\\)`
      }
    ];
    
    this.renderNotesList();
  }

  renderNotesList() {
    const notesGrid = document.getElementById('notesGrid');
    notesGrid.innerHTML = this.notes.map(note => `
      <div class="note-card" data-note-id="${note.id}">
        <div class="note-category">${note.category}</div>
        <h3>${note.title}</h3>
        <p class="note-excerpt">${note.excerpt}</p>
        <div class="note-footer">
          <span class="note-date">${note.date}</span>
          <button class="btn btn-sm btn-outline" data-note-id="${note.id}">阅读</button>
        </div>
      </div>
    `).join('');
    
    // Add click listeners
    document.querySelectorAll('[data-note-id]').forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('btn')) return;
        const noteId = parseInt(e.target.dataset.noteId);
        this.showNote(noteId);
      });
    });
  }

  showNote(noteId) {
    const note = this.notes.find(n => n.id === noteId);
    if (!note) return;
    
    const modal = document.getElementById('noteModal');
    const noteDisplay = document.getElementById('noteDisplay');
    
    // Render markdown
    const htmlContent = marked.parse(note.content);
    noteDisplay.innerHTML = `<h2>${note.title}</h2><div class="note-content">${htmlContent}</div>`;
    
    // Render math equations
    if (window.renderMathInElement) {
      renderMathInElement(noteDisplay, { delimiters: [
        {left: '$$', right: '$$', display: true},
        {left: '$', right: '$', display: false}
      ]});
    }
    
    // Highlight code
    noteDisplay.querySelectorAll('pre code').forEach(el => {
      hljs.highlightElement(el);
    });
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  setupSearch() {
    const searchInput = document.getElementById('noteSearch');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
      const keyword = e.target.value.toLowerCase();
      const cards = document.querySelectorAll('.note-card');
      
      cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const excerpt = card.querySelector('.note-excerpt').textContent.toLowerCase();
        const isVisible = title.includes(keyword) || excerpt.includes(keyword);
        card.style.display = isVisible ? 'block' : 'none';
      });
    });
  }

  // ========== Projects System ==========
  setupProjectsSystem() {
    this.projects = [
      {
        id: 1,
        title: '个人博客平台',
        description: '基于 Next.js + Tailwind CSS 构建的高性能博客，支持 Markdown、评论、搜索等功能',
        tags: ['Next.js', 'React', 'Tailwind CSS', 'MongoDB'],
        image: '🚀',
        github: 'https://github.com/yourname/blog',
        demo: 'https://yourblog.com'
      },
      {
        id: 2,
        title: 'TODO 应用',
        description: '功能完整的任务管理应用，包含拖拽排序、分类、时间提醒等高级功能',
        tags: ['Vue 3', 'TypeScript', 'Pinia', 'CSS Modules'],
        image: '✓',
        github: 'https://github.com/yourname/todo-app',
        demo: 'https://todo-app.com'
      }
    ];
    
    this.renderProjects();
  }

  renderProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    projectsGrid.innerHTML = this.projects.map(project => `
      <div class="project-card">
        <div class="project-image">${project.image}</div>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="project-tags">
          ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <div class="project-links">
          <a href="${project.github}" target="_blank" class="btn btn-sm btn-outline">GitHub</a>
          <a href="${project.demo}" target="_blank" class="btn btn-sm btn-primary">预览</a>
        </div>
      </div>
    `).join('');
  }

  // ========== Life Records System ==========
  setupLifeSystem() {
    this.lifeRecords = [
      {
        date: '2024-01-20',
        title: '成功完成第一个开源项目',
        content: '经过三个月的开发和优化，终于发布了我的第一个开源项目，获得了 500+ stars。'
      },
      {
        date: '2024-01-10',
        title: '分享技术演讲',
        content: '在公司技术分享会上分享了"React Hooks 最佳实践"，获得了很多积极反馈。'
      },
      {
        date: '2024-01-01',
        title: '新年计划',
        content: '2024年的目标：1. 完成2个大型项目 2. 发布10篇技术文章 3. 学习云原生技术'
      }
    ];
    
    this.renderLifeRecords();
  }

  renderLifeRecords() {
    const timeline = document.getElementById('lifeTimeline');
    timeline.innerHTML = this.lifeRecords.map((record, idx) => `
      <div class="timeline-item">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
          <div class="timeline-date">${record.date}</div>
          <h3>${record.title}</h3>
          <p>${record.content}</p>
        </div>
      </div>
    `).join('');
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new PersonalWebApp();
  
  // Close modal on click outside
  const modal = document.getElementById('noteModal');
  const closeBtn = document.querySelector('.modal-close');
  
  if (modal && closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  }
});
