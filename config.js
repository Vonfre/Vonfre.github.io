// 文章配置
const ARTICLES = {
    basics: [
        {
            id: 'python-basics',
            title: 'Python 基础入门',
            path: 'posts/basics/python-basics.md',
            date: '2026-01-12',
            description: 'Python 编程语言基础知识入门'
        },
        {
            id: 'git-tutorial',
            title: 'Git 版本控制',
            path: 'posts/basics/git-tutorial.md',
            date: '2026-01-10',
            description: 'Git 版本控制系统使用指南'
        }
    ],
    reproduction: [
        {
            id: 'transformer-implementation',
            title: 'Transformer 模型实现',
            path: 'posts/reproduction/transformer-implementation.md',
            date: '2026-01-08',
            description: '从零实现 Transformer 模型'
        }
    ],
    tools: [
        {
            id: 'vscode-setup',
            title: 'VS Code 配置指南',
            path: 'posts/tools/vscode-setup.md',
            date: '2026-01-05',
            description: '高效的 VS Code 开发环境配置'
        }
    ],
    literature: [
        {
            id: 'attention-paper',
            title: 'Attention Is All You Need 论文精读',
            path: 'posts/literature/attention-paper.md',
            date: '2026-01-03',
            description: 'Transformer 开山之作论文解读'
        }
    ]
};

// 分类配置
const CATEGORIES = {
    basics: {
        name: '基础学习',
        icon: '📚',
        description: '编程语言、算法、数据结构等基础知识'
    },
    reproduction: {
        name: '代码复现',
        icon: '🔬',
        description: '经典论文和模型的代码实现'
    },
    tools: {
        name: '实用工具',
        icon: '🛠️',
        description: '开发工具、效率提升技巧'
    },
    literature: {
        name: '文献精读',
        icon: '📖',
        description: '重要论文的深度解读'
    }
};
