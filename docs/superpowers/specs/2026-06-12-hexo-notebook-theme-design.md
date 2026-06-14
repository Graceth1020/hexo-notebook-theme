# Hexo Notebook Theme — 学习笔记静态网站设计

> 日期: 2026-06-12
> 状态: 已批准设计

## 1. 项目概述

基于 Hexo + GitHub Pages 构建一个通用学习笔记静态网站。核心定位为个人学习笔记工具，具有干净现代的阅读体验。主题作为独立 npm 包发布，可复用于其他 Hexo 站点。当前使用场景为英语笔记记录，但主题本身不绑定任何学科。

## 2. 技术栈

| 层级 | 技术 |
|------|------|
| 静态站点生成器 | Hexo v7+ |
| 模板引擎 | EJS |
| 主题语言 | EJS + CSS + Vanilla JS |
| 部署 | GitHub Actions → GitHub Pages |
| 翻译 API 代理 | Cloudflare Workers（预留，后续实现） |
| 翻译存储 | Adapter 模式（预留，当前不实现） |

## 3. 项目结构

```
hexo-notebook-theme/
├── site/                          # Hexo 站点目录
│   ├── scaffolds/                 # 文章模板
│   │   └── post.md
│   ├── source/
│   │   └── _posts/                # 学习笔记文章 (.md)
│   ├── themes/
│   │   └── notebook/ → ../../theme/  # 软链接到主题开发目录
│   ├── _config.yml                # 网站配置
│   └── package.json
│
├── theme/                         # 独立主题包（可发布到 npm）
│   ├── layout/
│   │   ├── index.ejs              # 首页 — 文章列表（分页）
│   │   ├── post.ejs               # 文章页
│   │   ├── page.ejs               # 通用页面
│   │   ├── archive.ejs            # 归档页
│   │   ├── tag-tree.ejs           # /tags/ — 树形标签导航
│   │   ├── tag.ejs                # /tags/:tag — 标签过滤的文章列表
│   │   ├── 404.ejs                # 自定义 404
│   │   └── partials/
│   │       ├── header.ejs         # 导航栏（响应式汉堡菜单）
│   │       ├── footer.ejs         # 页脚
│   │       ├── head.ejs           # <head> 公共元素
│   │       └── tag-breadcrumb.ejs # 标签面包屑
│   ├── source/
│   │   ├── css/
│   │   │   └── notebook.css       # 主题样式（响应式）
│   │   └── js/
│   │       ├── tag-tree.js        # Tag 树展开收起
│   │       ├── mobile-nav.js      # 汉堡菜单
│   │       └── translator.js      # （预留）翻译工具
│   ├── _config.yml                # 主题配置
│   └── package.json               # 独立 npm 包
│
├── cloudflare-worker/             # （预留）翻译 API 代理
├── .github/workflows/
│   └── deploy.yml                 # GitHub Pages 部署
└── package.json                   # 根项目
```

## 4. 视觉设计

### 4.1 色彩

| 用途 | 色值 | 说明 |
|------|------|------|
| 背景 | `#fafafa` | 暖白，护眼 |
| 正文 | `#2c3e50` | 深蓝灰，长时间阅读舒适 |
| 标题 | `#1a1a1a` | 纯黑 |
| 链接/强调 | `#3b82f6` | 清水蓝 |
| 引用/代码块底色 | `#f5f5f5` | 柔和灰 |
| 边框/分割线 | `#e8e8e8` | 浅灰 |
| Tag 标签底色 | `#eef2ff` | 极淡蓝底 |

### 4.2 排版

- 字体栈：`system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`
- 正文：16px，行高 1.8
- 标题渐进：h1 32px → h2 26px → h3 22px → h4 18px
- 文章最大宽度：720px（阅读黄金宽度）
- 代码字体：`"JetBrains Mono", "Fira Code", monospace`

### 4.3 响应式断点

| 设备 | 断点 | 布局调整 |
|------|------|---------|
| 手机 | <768px | 左右边距 20px，正文 15px，汉堡菜单 |
| 平板 | 768px–1023px | 左右边距 40px，导航仍为汉堡菜单 |
| 桌面 | ≥1024px | 正文 720px 居中，全宽导航 |

### 4.4 移动端交互

- **汉堡菜单**: 点击滑出式导航面板，全屏半透明遮罩，点击遮罩或关闭按钮收回
- **文章卡片**: 占满屏宽，日期上置
- **Tag 树**: 独立页面，点击区域 ≥44px（触屏友好）
- **代码块**: 可横向滚动
- **图片**: `max-width: 100%` 自适应

## 5. Tag 树形结构

### 5.1 Front-matter 约定

```yaml
---
title: present-perfect-tense
tags:
  - "Grammar/Tenses/Present Perfect"
  - "Usage"
---
```

用 `/` 分隔层级。

### 5.2 标签页（/tags/）

- JS 驱动的树形展开收起
- 非叶子节点：点击展开/收起子节点
- 叶子节点（有文章）：点击展开文章列表
- 默认全部折叠（由 `theme._config.yml` 的 `expand_level` 控制）
- 使用 `<ul>` 嵌套实现无障碍语义

### 5.3 标签面包屑

文章底部显示层级导航，如：

```
标签: Grammar > Tenses > Present Perfect  |  Usage
```

每段可点击跳转到对应标签的文章列表页。

## 6. 翻译功能（预留，当前不实现）

### 6.1 TranslationStorage 接口

```typescript
interface TranslationRecord {
  id: string
  sourceText: string
  translatedText: string
  sourceLang: string
  targetLang: string
  createdAt: string
  context?: string
  sourceUrl?: string
  tags?: string[]
}

interface TranslationStorage {
  save(record: Omit<TranslationRecord, 'id'>): Promise<TranslationRecord>
  getAll(): Promise<TranslationRecord[]>
  getById(id: string): Promise<TranslationRecord | null>
  delete(id: string): Promise<void>
  search(query: string): Promise<TranslationRecord[]>
}
```

### 6.2 交互入口（预留）

- **选中翻译**: 文章阅读时选中英文 → 浮窗翻译
- **输入翻译**: 翻译工具面板，中译英

### 6.3 存储适配器

使用 Adapter 模式，当前预留接口定义，后续可接入：
- localStorage Adapter
- IndexedDB Adapter
- 远程 API Adapter（数据库）

## 7. 主题配置

### 7.1 主题 _config.yml

```yaml
# 导航菜单
menu:
  Home: /
  Tags: /tags
  Archive: /archives

# 站点信息
brand: "Notebook"
description: "学习笔记"

# 标签树配置
tag_tree:
  enable: true
  expand_level: 0

# 首页文章列表
index:
  posts_per_page: 10
  show_excerpt: true
  excerpt_length: 150

# 社交链接
social:
  github: ""
  twitter: ""

# 响应式断点
breakpoints:
  tablet: 768px
  desktop: 1024px
```

## 8. 部署方案

GitHub Actions 自动部署：

```yaml
# .github/workflows/deploy.yml 概要
# 触发: push 到 main 分支
# 步骤:
#   1. Checkout
#   2. Setup Node.js
#   3. npm install
#   4. hexo generate
#   5. Deploy to gh-pages 分支
```

用户只需 push 到 main，网站自动更新。

## 9. 非功能性需求

- 首次加载 JS 体积 < 30KB（gzip）
- 无需外部 CDN 依赖（自托管字体可选）
- 所有页面 Lighthouse > 90 分
- 主题无外部 runtime 依赖

## 10. 路线图

| 阶段 | 内容 | 时间估计 |
|------|------|---------|
| Phase 1 | 核心主题（响应式布局、首页、文章页） | 基础 |
| Phase 2 | Tag 树形结构页面 | 基础 |
| Phase 3 | 独立主题包发布能力 | 基础 |
| Phase 4 | GitHub Pages 部署 | 基础 |
| Phase 5 | 翻译功能（预留接口实现） | 未来 |
