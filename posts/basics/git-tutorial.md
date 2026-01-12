# Git 版本控制

Git 是目前最流行的分布式版本控制系统，由 Linux 之父 Linus Torvalds 创建。掌握 Git 是现代软件开发的必备技能。

## 什么是版本控制？

版本控制系统（VCS）可以记录文件的历史变化，让你能够：

- 📝 追踪每次修改
- ⏮️ 回退到之前的版本
- 🤝 多人协作开发
- 🔀 管理不同的开发分支

## Git 基础概念

### 工作区、暂存区和仓库

```
工作区 (Working Directory)
    ↓  git add
暂存区 (Staging Area)
    ↓  git commit
本地仓库 (Local Repository)
    ↓  git push
远程仓库 (Remote Repository)
```

## 安装和配置

### 安装 Git

```bash
# macOS
brew install git

# Ubuntu/Debian
sudo apt-get install git

# Windows
# 下载安装包：https://git-scm.com/download/win
```

### 初始配置

```bash
# 配置用户名和邮箱
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 查看配置
git config --list

# 配置默认编辑器
git config --global core.editor "code --wait"
```

## 基本操作

### 创建仓库

```bash
# 初始化新仓库
git init

# 克隆现有仓库
git clone https://github.com/username/repo.git
```

### 添加和提交

```bash
# 查看状态
git status

# 添加文件到暂存区
git add file.txt           # 添加单个文件
git add .                  # 添加所有文件
git add *.py              # 添加所有 Python 文件

# 提交到本地仓库
git commit -m "Add new feature"

# 添加并提交（跳过暂存区）
git commit -am "Update existing files"
```

### 查看历史

```bash
# 查看提交历史
git log

# 简洁显示
git log --oneline

# 图形化显示分支
git log --graph --oneline --all

# 查看某个文件的历史
git log -- file.txt

# 查看具体的修改内容
git show commit_hash
```

## 分支管理

分支是 Git 最强大的功能之一：

```bash
# 查看分支
git branch              # 本地分支
git branch -a           # 所有分支（包括远程）

# 创建分支
git branch feature-x

# 切换分支
git checkout feature-x

# 创建并切换分支（推荐）
git checkout -b feature-x

# 合并分支
git checkout main
git merge feature-x

# 删除分支
git branch -d feature-x      # 安全删除
git branch -D feature-x      # 强制删除
```

## 远程仓库

### 基本操作

```bash
# 查看远程仓库
git remote -v

# 添加远程仓库
git remote add origin https://github.com/username/repo.git

# 推送到远程
git push origin main

# 首次推送并设置上游
git push -u origin main

# 拉取更新
git pull origin main

# 获取远程更新（不合并）
git fetch origin
```

### SSH 密钥配置

使用 SSH 可以避免每次输入密码：

```bash
# 生成 SSH 密钥
ssh-keygen -t ed25519 -C "your.email@example.com"

# 复制公钥
cat ~/.ssh/id_ed25519.pub

# 在 GitHub 添加 SSH 密钥
# Settings → SSH and GPG keys → New SSH key

# 测试连接
ssh -T git@github.com

# 使用 SSH URL
git remote set-url origin git@github.com:username/repo.git
```

## 撤销和回退

### 撤销修改

```bash
# 撤销工作区的修改
git checkout -- file.txt

# 撤销暂存区的修改
git reset HEAD file.txt

# 撤销最后一次提交（保留修改）
git reset --soft HEAD^

# 撤销最后一次提交（丢弃修改）
git reset --hard HEAD^

# 回退到指定提交
git reset --hard commit_hash
```

### 修改提交

```bash
# 修改最后一次提交信息
git commit --amend -m "New message"

# 添加遗漏的文件到最后一次提交
git add forgotten_file.txt
git commit --amend --no-edit
```

## 实用技巧

### .gitignore

创建 `.gitignore` 文件忽略不需要版本控制的文件：

```gitignore
# Python
__pycache__/
*.py[cod]
*.so
.Python
env/
venv/

# IDE
.vscode/
.idea/
*.swp

# 系统文件
.DS_Store
Thumbs.db

# 日志
*.log

# 环境变量
.env
```

### Git 别名

设置常用命令的别名：

```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.lg "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"

# 使用别名
git st
git lg
```

### Stash（暂存）

临时保存工作进度：

```bash
# 暂存当前修改
git stash

# 查看暂存列表
git stash list

# 恢复最近的暂存
git stash pop

# 恢复指定的暂存
git stash apply stash@{0}

# 删除暂存
git stash drop stash@{0}

# 清空所有暂存
git stash clear
```

## 协作工作流

### Feature Branch 工作流

```bash
# 1. 创建功能分支
git checkout -b feature/new-feature

# 2. 开发并提交
git add .
git commit -m "Implement new feature"

# 3. 推送到远程
git push -u origin feature/new-feature

# 4. 创建 Pull Request
# 在 GitHub 上创建 PR

# 5. 代码审查后合并
git checkout main
git pull origin main
git merge feature/new-feature

# 6. 删除功能分支
git branch -d feature/new-feature
git push origin --delete feature/new-feature
```

## 常见问题

### 合并冲突

当合并分支时出现冲突：

```bash
# 1. 尝试合并
git merge feature-branch

# 2. 查看冲突文件
git status

# 3. 手动解决冲突
# 编辑冲突文件，删除冲突标记

# 4. 标记为已解决
git add conflicted_file.txt

# 5. 完成合并
git commit
```

### 误删文件恢复

```bash
# 恢复已删除的文件
git checkout HEAD -- deleted_file.txt

# 从历史提交恢复
git checkout commit_hash -- file.txt
```

## 最佳实践

1. **频繁提交**：小步快跑，每个提交只做一件事
2. **清晰的提交信息**：使用有意义的提交信息
3. **使用分支**：不要直接在 main 分支开发
4. **定期同步**：经常 pull 远程更新
5. **代码审查**：使用 Pull Request 进行代码审查

## 提交信息规范

推荐使用 Conventional Commits 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

类型（type）：
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具相关

示例：
```
feat(auth): add user login functionality

Implement JWT-based authentication system
- Add login endpoint
- Add token validation middleware
- Update user model

Closes #123
```

## 总结

Git 是强大而灵活的工具，掌握它需要时间和实践。记住：

- 🎯 从基础命令开始
- 💪 多动手练习
- 📚 遇到问题查文档
- 🤝 参与开源项目

Happy coding! 🚀
