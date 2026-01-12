# VS Code 配置指南

Visual Studio Code 是一款强大的代码编辑器。通过合理配置，可以大幅提升开发效率。

## 基础配置

### 安装 VS Code

访问 [官网](https://code.visualstudio.com/) 下载安装。

### 必装扩展

#### Python 开发
- **Python** - 官方 Python 扩展
- **Pylance** - 快速的 Python 语言服务器
- **Python Indent** - 智能缩进

#### 通用工具
- **GitLens** - 增强的 Git 功能
- **Prettier** - 代码格式化
- **ESLint** - JavaScript 代码检查
- **Live Server** - 本地服务器

#### 主题和图标
- **One Dark Pro** - 流行的深色主题
- **Material Icon Theme** - 文件图标主题

## settings.json 配置

按 `Cmd/Ctrl + Shift + P`，搜索 "Preferences: Open Settings (JSON)"：

```json
{
  // 编辑器
  "editor.fontSize": 14,
  "editor.fontFamily": "JetBrains Mono, Menlo, Monaco, 'Courier New', monospace",
  "editor.fontLigatures": true,
  "editor.lineHeight": 1.6,
  "editor.tabSize": 4,
  "editor.insertSpaces": true,
  "editor.wordWrap": "on",
  "editor.minimap.enabled": true,
  "editor.cursorBlinking": "smooth",
  "editor.cursorSmoothCaretAnimation": "on",
  "editor.smoothScrolling": true,
  
  // 格式化
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  
  // Python
  "[python]": {
    "editor.defaultFormatter": "ms-python.black-formatter",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.organizeImports": true
    }
  },
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": false,
  "python.linting.flake8Enabled": true,
  
  // 文件
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 1000,
  "files.exclude": {
    "**/__pycache__": true,
    "**/.pytest_cache": true,
    "**/.git": true,
    "**/.DS_Store": true
  },
  
  // 终端
  "terminal.integrated.fontSize": 13,
  "terminal.integrated.fontFamily": "JetBrains Mono",
  "terminal.integrated.cursorBlinking": true,
  
  // Git
  "git.autofetch": true,
  "git.confirmSync": false,
  "git.enableSmartCommit": true,
  
  // 工作台
  "workbench.colorTheme": "One Dark Pro",
  "workbench.iconTheme": "material-icon-theme",
  "workbench.startupEditor": "none",
  
  // 其他
  "explorer.confirmDelete": false,
  "explorer.confirmDragAndDrop": false,
  "breadcrumbs.enabled": true
}
```

## 快捷键

### 常用快捷键

| 功能 | macOS | Windows/Linux |
|------|-------|---------------|
| 命令面板 | `Cmd+Shift+P` | `Ctrl+Shift+P` |
| 快速打开文件 | `Cmd+P` | `Ctrl+P` |
| 切换侧边栏 | `Cmd+B` | `Ctrl+B` |
| 终端 | `Ctrl+\`` | `Ctrl+\`` |
| 多光标 | `Cmd+D` | `Ctrl+D` |
| 格式化代码 | `Shift+Alt+F` | `Shift+Alt+F` |
| 查找 | `Cmd+F` | `Ctrl+F` |
| 替换 | `Cmd+H` | `Ctrl+H` |
| 跳转到定义 | `F12` | `F12` |
| 重命名符号 | `F2` | `F2` |

### 自定义快捷键

`keybindings.json`:

```json
[
  {
    "key": "cmd+shift+d",
    "command": "editor.action.duplicateSelection"
  },
  {
    "key": "cmd+shift+k",
    "command": "editor.action.deleteLines"
  }
]
```

## 代码片段

创建自定义代码片段：`Preferences: Configure User Snippets`

Python 示例：

```json
{
  "Python Main": {
    "prefix": "main",
    "body": [
      "def main():",
      "    $1",
      "",
      "",
      "if __name__ == '__main__':",
      "    main()"
    ],
    "description": "Python main function"
  },
  "Python Class": {
    "prefix": "class",
    "body": [
      "class ${1:ClassName}:",
      "    def __init__(self${2:, args}):",
      "        ${3:pass}",
      "",
      "    def ${4:method_name}(self${5:, args}):",
      "        ${6:pass}"
    ],
    "description": "Python class template"
  }
}
```

## 工作区配置

在项目根目录创建 `.vscode/settings.json`：

```json
{
  "python.defaultInterpreterPath": "./venv/bin/python",
  "python.testing.pytestEnabled": true,
  "python.testing.pytestArgs": [
    "tests"
  ],
  "editor.rulers": [80, 120],
  "files.exclude": {
    "**/__pycache__": true,
    "**/*.pyc": true
  }
}
```

## 调试配置

`.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: Current File",
      "type": "python",
      "request": "launch",
      "program": "${file}",
      "console": "integratedTerminal",
      "justMyCode": true
    },
    {
      "name": "Python: Django",
      "type": "python",
      "request": "launch",
      "program": "${workspaceFolder}/manage.py",
      "args": [
        "runserver"
      ],
      "django": true
    }
  ]
}
```

## 任务自动化

`.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Run Tests",
      "type": "shell",
      "command": "pytest",
      "group": {
        "kind": "test",
        "isDefault": true
      }
    },
    {
      "label": "Format Code",
      "type": "shell",
      "command": "black .",
      "group": "build"
    }
  ]
}
```

## 实用技巧

### 1. 多光标编辑

- `Alt + Click`: 添加光标
- `Cmd/Ctrl + D`: 选择下一个相同内容
- `Cmd/Ctrl + Shift + L`: 选择所有相同内容

### 2. Emmet

HTML/CSS 快速编写：

```
div.container>ul>li*5>a
```

按 Tab 展开为：

```html
<div class="container">
  <ul>
    <li><a href=""></a></li>
    <li><a href=""></a></li>
    <li><a href=""></a></li>
    <li><a href=""></a></li>
    <li><a href=""></a></li>
  </ul>
</div>
```

### 3. 正则表达式搜索

在搜索框中启用正则表达式（`.*` 图标），例如：

```
import (\w+)
```

替换为：

```
from module import $1
```

### 4. Zen Mode

`Cmd/Ctrl + K Z` 进入专注模式，隐藏所有干扰元素。

## 远程开发

安装 **Remote - SSH** 扩展，连接远程服务器：

```bash
# 1. 打开命令面板
# 2. 选择 "Remote-SSH: Connect to Host"
# 3. 输入: user@hostname
```

## 总结

合理配置 VS Code 可以：

- ⚡ 提升编码效率
- 🎨 改善视觉体验
- 🔧 自动化重复任务
- 🐛 简化调试流程

花时间优化你的开发环境是值得的投资！
