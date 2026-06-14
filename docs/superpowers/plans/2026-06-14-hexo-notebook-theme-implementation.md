# Hexo Notebook Theme 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个基于 Hexo 的通用学习笔记静态网站，含独立可复用主题

**Architecture:** Hexo 站点 (`site/`) + 独立主题包 (`theme/`)，通过软链接连接开发。主题使用 EJS 模板渲染，CSS + Vanilla JS 实现响应式布局和 Tag 树交互。部署使用 GitHub Actions 推送 GitHub Pages。

**Tech Stack:** Hexo v7, EJS, CSS3, Vanilla JS, GitHub Actions, GitHub Pages

---

### Task 1: 项目初始化 & Hexo 站点脚手架

**Files:**
- Create: `package.json`
- Create: `site/package.json`
- Create: `site/_config.yml`
- Create: `site/scaffolds/post.md`
- Create: `site/source/_posts/.gitkeep`

- [ ] **Step 1: 创建根 package.json**

```json
{
  "name": "hexo-notebook-theme",
  "version": "1.0.0",
  "private": true,
  "description": "学习笔记 Hexo 站点",
  "scripts": {
    "dev": "cd site && npx hexo server",
    "build": "cd site && npx hexo generate",
    "deploy": "cd site && npx hexo deploy"
  }
}
```

- [ ] **Step 2: 创建 site/_config.yml**

```yaml
# 站点配置
title: Notebook
subtitle: 学习笔记
description: 个人学习笔记
language: zh-CN
timezone: Asia/Shanghai

# 主题
theme: notebook
theme_config:
  # 由主题 _config.yml 提供默认值

# URL
url: https://<你的用户名>.github.io
root: /
permalink: :year/:month/:title/
permalink_defaults:

# 目录
source_dir: source
public_dir: public
tag_dir: tags
archive_dir: archives
category_dir: categories
code_dir: downloads/code
i18n_dir: :lang
skip_render:

# 写作
new_post_name: :title.md
default_layout: post
titlecase: false
external_link:
  enable: true
  field: site
  exclude:
filename_case: 0
render_drafts: false
post_asset_folder: false
relative_link: false
future: true
syntax_highlighter: highlight.js
highlight:
  enable: true
  line_number: true
  auto_detect: false
  tab_replace: '  '
  wrap: true
  hljs: false
prismjs:
  enable: false

# 首页分页
index_generator:
  path: ''
  per_page: 10
  order_by: -date

# 归档生成器
archive_generator:
  per_page: 20
  yearly: true
  monthly: true

# 标签生成器
tag_generator:
  per_page: 20

# 部署
deploy:
  type: ''
```

- [ ] **Step 3: 创建 site/scaffolds/post.md**

```markdown
---
title: {{ title }}
date: {{ date }}
tags:
---
```

- [ ] **Step 4: 创建目录结构并安装 Hexo**

运行:
```bash
mkdir -p site/source/_posts
mkdir -p site/source/tags
npm init -y --prefix site
npm install --prefix site hexo hexo-generator-index hexo-generator-archive hexo-generator-tag hexo-generator-category hexo-renderer-ejs
```

Expected: Hexo 及相关依赖安装成功，`site/node_modules/` 和 `site/package-lock.json` 生成。

- [ ] **Step 5: 验证 Hexo 可运行**

```bash
cd site && npx hexo --version
```

Expected: 输出 Hexo 版本号。

- [ ] **Step 6: Commit**

```bash
git init
git add -A
git commit -m "chore: initialize Hexo site scaffold"
```


### Task 2: 主题包结构与配置

**Files:**
- Create: `theme/`
- Create: `theme/package.json`
- Create: `theme/_config.yml`

- [ ] **Step 1: 创建 theme/package.json**

```json
{
  "name": "hexo-theme-notebook",
  "version": "1.0.0",
  "description": "A clean, modern Hexo theme for learning notes with responsive design and tag tree navigation",
  "main": "package.json",
  "keywords": ["hexo", "theme", "notebook", "learning", "blog"],
  "license": "MIT",
  "peerDependencies": {
    "hexo": ">=7.0.0",
    "hexo-renderer-ejs": ">=2.0.0"
  }
}
```

- [ ] **Step 2: 创建目录结构**

```bash
mkdir -p theme/layout/partials
mkdir -p theme/source/css
mkdir -p theme/source/js
```

- [ ] **Step 3: 创建 theme/_config.yml**

```yaml
# === 主题配置 hexo-theme-notebook ===

# 导航菜单
menu:
  Home: /
  Tags: /tags
  Archive: /archives

# 站点品牌
brand: "Notebook"
description: "学习笔记"

# 标签树
tag_tree:
  enable: true
  expand_level: 0

# 首页
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

# 页脚版权
copyright:
  since: 2026
```

- [ ] **Step 4: 建立软链接（site → theme）**

```bash
# Windows: 使用管理员终端或 mklink
# 在 site/themes/ 下创建 note 链接到 ../../theme/
cd site/themes
ln -s ../../theme notebook
```

验证: `ls -la site/themes/notebook` 应指向 `../../theme`

- [ ] **Step 5: Commit**

```bash
git add theme/ site/themes/
git commit -m "feat: add notebook theme package structure"
```


### Task 3: 主题公共局部模板 (head, header, footer)

**Files:**
- Create: `theme/layout/partials/head.ejs`
- Create: `theme/layout/partials/header.ejs`
- Create: `theme/layout/partials/footer.ejs`

- [ ] **Step 1: 创建 head.ejs**

```html
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><%= page.title ? page.title + ' | ' + config.title : config.title %></title>
<meta name="description" content="<%= page.description || config.description %>">

<!-- 主题 CSS -->
<link rel="stylesheet" href="<%= url_for('/css/notebook.css') %>">

<!-- RSS（如果有） -->
<% if (config.feed) { %>
  <link rel="alternate" href="<%= url_for(config.feed.path) %>" type="application/atom+xml">
<% } %>
```

- [ ] **Step 2: 创建 header.ejs**

```html
<header class="site-header">
  <div class="header-inner">
    <a class="logo" href="<%= url_for('/') %>">
      <%= theme.brand || config.title %>
    </a>

    <nav class="nav-desktop" id="navDesktop">
      <% if (theme.menu) { %>
        <% for (const [label, path] of Object.entries(theme.menu)) { %>
          <a class="nav-link" href="<%= url_for(path) %>"><%= label %></a>
        <% } %>
      <% } %>
    </nav>

    <button class="hamburger" id="hamburgerBtn" aria-label="Toggle navigation">
      <span></span>
      <span></span>
      <span></span>
    </button>
  </div>

  <!-- 移动端导航遮罩 -->
  <div class="mobile-nav-overlay" id="mobileNavOverlay">
    <div class="mobile-nav-panel">
      <button class="mobile-nav-close" id="mobileNavClose" aria-label="Close navigation">&times;</button>
      <nav class="mobile-nav-links">
        <% if (theme.menu) { %>
          <% for (const [label, path] of Object.entries(theme.menu)) { %>
            <a class="mobile-nav-link" href="<%= url_for(path) %>"><%= label %></a>
          <% } %>
        <% } %>
      </nav>
    </div>
  </div>
</header>
```

- [ ] **Step 3: 创建 footer.ejs**

```html
<footer class="site-footer">
  <div class="footer-inner">
    <p class="copyright">
      &copy; <%= theme.copyright.since %>–<%= new Date().getFullYear() %>
      <a href="<%= url_for('/') %>"><%= theme.brand || config.title %></a>.
      Powered by <a href="https://hexo.io/" target="_blank" rel="noopener">Hexo</a>.
    </p>
  </div>
</footer>

<!-- JS -->
<script src="<%= url_for('/js/mobile-nav.js') %>"></script>
```

- [ ] **Step 4: Commit**

```bash
git add theme/layout/partials/
git commit -m "feat: add head, header, footer partial templates"
```


### Task 4: 首页模板 (index.ejs)

**Files:**
- Create: `theme/layout/index.ejs`

- [ ] **Step 1: 创建 index.ejs**

```html
<!DOCTYPE html>
<html lang="<%= config.language %>">
<head>
  <%- partial('partials/head') %>
</head>
<body>
  <%- partial('partials/header') %>

  <main class="main-content">
    <div class="container">
      <section class="post-list">
        <% page.posts.each(function(post) { %>
          <article class="post-card">
            <time class="post-card-date" datetime="<%= date_xml(post.date) %>">
              <%= date(post.date, 'MMM DD, YYYY') %>
            </time>
            <h2 class="post-card-title">
              <a href="<%= url_for(post.path) %>"><%= post.title %></a>
            </h2>
            <% if (theme.index.show_excerpt && post.excerpt) { %>
              <div class="post-card-excerpt">
                <%= post.excerpt %>
              </div>
            <% } %>
            <div class="post-card-tags">
              <% if (post.tags && post.tags.length) { %>
                <% post.tags.each(function(tag) { %>
                  <a class="tag-chip" href="<%= url_for(tag.path) %>"><%= tag.name %></a>
                <% }) %>
              <% } %>
            </div>
          </article>
        <% }) %>
      </section>

      <!-- 分页 -->
      <% if (page.total > 1) { %>
        <nav class="pagination">
          <% if (page.prev) { %>
            <a class="pagination-prev" href="<%= url_for(page.prev_link) %>">&larr; Newer</a>
          <% } %>
          <span class="pagination-info">Page <%= page.current %> of <%= page.total %></span>
          <% if (page.next) { %>
            <a class="pagination-next" href="<%= url_for(page.next_link) %>">Older &rarr;</a>
          <% } %>
        </nav>
      <% } %>
    </div>
  </main>

  <%- partial('partials/footer') %>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add theme/layout/index.ejs
git commit -m "feat: add homepage template with post list and pagination"
```


### Task 5: 文章页模板 (post.ejs)

**Files:**
- Create: `theme/layout/post.ejs`
- Create: `theme/layout/partials/tag-breadcrumb.ejs`

- [ ] **Step 1: 创建 tag-breadcrumb.ejs**

```html
<% if (post.tags && post.tags.length) { %>
  <div class="tag-breadcrumb">
    <span class="tag-breadcrumb-label">Tags:</span>
    <% post.tags.each(function(tag, i) { %>
      <% if (i > 0) { %><span class="tag-breadcrumb-sep">|</span><% } %>
      <a class="tag-breadcrumb-link" href="<%= url_for(tag.path) %>"><%= tag.name %></a>
    <% }) %>
  </div>
<% } %>
```

- [ ] **Step 2: 创建 post.ejs**

```html
<!DOCTYPE html>
<html lang="<%= config.language %>">
<head>
  <%- partial('partials/head') %>
</head>
<body>
  <%- partial('partials/header') %>

  <main class="main-content">
    <article class="post-article">
      <header class="post-header">
        <time class="post-date" datetime="<%= date_xml(page.date) %>">
          <%= date(page.date, 'MMMM DD, YYYY') %>
        </time>
        <h1 class="post-title"><%= page.title %></h1>
      </header>

      <div class="post-body">
        <%- page.content %>
      </div>

      <footer class="post-footer">
        <%- partial('partials/tag-breadcrumb', { post: page }) %>

        <nav class="post-nav">
          <% if (page.prev) { %>
            <a class="post-nav-prev" href="<%= url_for(page.prev.path) %>">
              <span class="post-nav-label">Previous</span>
              <span class="post-nav-title"><%= page.prev.title %></span>
            </a>
          <% } %>
          <% if (page.next) { %>
            <a class="post-nav-next" href="<%= url_for(page.next.path) %>">
              <span class="post-nav-label">Next</span>
              <span class="post-nav-title"><%= page.next.title %></span>
            </a>
          <% } %>
        </nav>
      </footer>
    </article>
  </main>

  <%- partial('partials/footer') %>
</body>
</html>
```

- [ ] **Step 3: Commit**

```bash
git add theme/layout/post.ejs theme/layout/partials/tag-breadcrumb.ejs
git commit -m "feat: add post template with tag breadcrumb"
```


### Task 6: 标签页面模板 (tag-tree, tag)

**Files:**
- Create: `theme/layout/tag-tree.ejs`
- Create: `theme/layout/tag.ejs`

- [ ] **Step 1: 创建 tag.ejs（单标签文章列表页）**

```html
<!DOCTYPE html>
<html lang="<%= config.language %>">
<head>
  <%- partial('partials/head') %>
</head>
<body>
  <%- partial('partials/header') %>

  <main class="main-content">
    <div class="container">
      <h1 class="page-title">Tag: <%= page.tag %></h1>

      <section class="post-list">
        <% page.posts.each(function(post) { %>
          <article class="post-card">
            <time class="post-card-date" datetime="<%= date_xml(post.date) %>">
              <%= date(post.date, 'MMM DD, YYYY') %>
            </time>
            <h2 class="post-card-title">
              <a href="<%= url_for(post.path) %>"><%= post.title %></a>
            </h2>
          </article>
        <% }) %>
      </section>

      <% if (page.total > 1) { %>
        <nav class="pagination">
          <% if (page.prev) { %>
            <a class="pagination-prev" href="<%= url_for(page.prev_link) %>">&larr; Newer</a>
          <% } %>
          <span class="pagination-info">Page <%= page.current %> of <%= page.total %></span>
          <% if (page.next) { %>
            <a class="pagination-next" href="<%= url_for(page.next_link) %>">Older &rarr;</a>
          <% } %>
        </nav>
      <% } %>
    </div>
  </main>

  <%- partial('partials/footer') %>
  <script src="<%= url_for('/js/tag-tree.js') %>"></script>
</body>
</html>
```

- [ ] **Step 2: 创建 tag-tree.ejs（树形标签总览页）**

```html
<!DOCTYPE html>
<html lang="<%= config.language %>">
<head>
  <%- partial('partials/head') %>
  <style>
    /* 内联初始样式避免 FOUC */
    .tag-tree-list { list-style: none; padding-left: 1.5em; margin: 0; }
    .tag-tree-root { padding-left: 0; }
    .tag-tree-toggle { cursor: pointer; user-select: none; }
    .tag-tree-item { margin: 4px 0; }
    .tag-tree-label { cursor: pointer; padding: 6px 8px; border-radius: 4px; display: inline-block; }
    .tag-tree-label:hover { background: #eef2ff; }
    .tag-tree-count { color: #999; font-size: 0.85em; margin-left: 4px; }
    .tag-tree-children { display: none; }
    .tag-tree-children.expanded { display: block; }
    .tag-tree-post-link { display: block; padding: 3px 8px 3px 1.2em; font-size: 0.9em; color: #3b82f6; text-decoration: none; }
    .tag-tree-post-link:hover { text-decoration: underline; }
    .tag-tree-arrow { display: inline-block; width: 16px; transition: transform 0.2s; }
    .tag-tree-arrow.expanded { transform: rotate(90deg); }
  </style>
</head>
<body>
  <%- partial('partials/header') %>

  <main class="main-content">
    <div class="container">
      <h1 class="page-title">Tags</h1>

      <div id="tagTreeContainer" class="tag-tree-container">
        <!-- JS 动态渲染 -->
      </div>
    </div>
  </main>

  <%- partial('partials/footer') %>
  <script src="<%= url_for('/js/tag-tree.js') %>"></script>
  <script>
    // 从 Hexo 侧透传标签数据
    const TAG_TREE_DATA = <%- JSON.stringify(hexo.locals.get('tags').map(function(tag) {
      return {
        name: tag.name,
        path: tag.path,
        posts: tag.posts.map(function(p) {
          return { title: p.title, path: p.path }
        })
      }
    })) %>;
    document.addEventListener('DOMContentLoaded', function() {
      renderTagTree(TAG_TREE_DATA, <%= theme.tag_tree.expand_level %>);
    });
  </script>
</body>
</html>
```

- [ ] **Step 3: Commit**

```bash
git add theme/layout/tag.ejs theme/layout/tag-tree.ejs
git commit -m "feat: add tag page and tag tree page templates"
```


### Task 7: 归档 & 通用页面模板

**Files:**
- Create: `theme/layout/archive.ejs`
- Create: `theme/layout/page.ejs`
- Create: `theme/layout/404.ejs`

- [ ] **Step 1: 创建 archive.ejs**

```html
<!DOCTYPE html>
<html lang="<%= config.language %>">
<head>
  <%- partial('partials/head') %>
</head>
<body>
  <%- partial('partials/header') %>

  <main class="main-content">
    <div class="container">
      <h1 class="page-title">Archive</h1>

      <section class="archive-list">
        <% page.posts.each(function(post) { %>
          <article class="archive-item">
            <time class="archive-item-date" datetime="<%= date_xml(post.date) %>">
              <%= date(post.date, 'MMM DD, YYYY') %>
            </time>
            <h2 class="archive-item-title">
              <a href="<%= url_for(post.path) %>"><%= post.title %></a>
            </h2>
          </article>
        <% }) %>
      </section>

      <% if (page.total > 1) { %>
        <nav class="pagination">
          <% if (page.prev) { %>
            <a class="pagination-prev" href="<%= url_for(page.prev_link) %>">&larr; Newer</a>
          <% } %>
          <span class="pagination-info">Page <%= page.current %> of <%= page.total %></span>
          <% if (page.next) { %>
            <a class="pagination-next" href="<%= url_for(page.next_link) %>">Older &rarr;</a>
          <% } %>
        </nav>
      <% } %>
    </div>
  </main>

  <%- partial('partials/footer') %>
</body>
</html>
```

- [ ] **Step 2: 创建 page.ejs**

```html
<!DOCTYPE html>
<html lang="<%= config.language %>">
<head>
  <%- partial('partials/head') %>
</head>
<body>
  <%- partial('partials/header') %>

  <main class="main-content">
    <article class="post-article">
      <header class="post-header">
        <h1 class="post-title"><%= page.title %></h1>
      </header>
      <div class="post-body">
        <%- page.content %>
      </div>
    </article>
  </main>

  <%- partial('partials/footer') %>
</body>
</html>
```

- [ ] **Step 3: 创建 404.ejs**

```html
<!DOCTYPE html>
<html lang="<%= config.language %>">
<head>
  <%- partial('partials/head') %>
</head>
<body>
  <%- partial('partials/header') %>

  <main class="main-content">
    <div class="container" style="text-align: center; padding: 80px 0;">
      <h1 style="font-size: 72px; margin: 0; color: #ddd;">404</h1>
      <p style="font-size: 18px; color: #999;">Page not found</p>
      <a href="<%= url_for('/') %>" class="btn" style="display: inline-block; margin-top: 20px; padding: 10px 24px; background: #3b82f6; color: #fff; border-radius: 6px; text-decoration: none;">Back to Home</a>
    </div>
  </main>

  <%- partial('partials/footer') %>
</body>
</html>
```

- [ ] **Step 4: Commit**

```bash
git add theme/layout/archive.ejs theme/layout/page.ejs theme/layout/404.ejs
git commit -m "feat: add archive, page, and 404 templates"
```


### Task 8: 主题 CSS — 响应式样式

**Files:**
- Create: `theme/source/css/notebook.css`

- [ ] **Step 1: 创建 notebook.css**

```css
/* === 重置 & 基础 === */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; -webkit-font-smoothing: antialiased; }
body {
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  color: #2c3e50;
  background: #fafafa;
  line-height: 1.8;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
a { color: #3b82f6; text-decoration: none; }
a:hover { text-decoration: underline; }
img { max-width: 100%; height: auto; }
code, pre { font-family: 'JetBrains Mono', 'Fira Code', monospace; }
pre {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
  font-size: 0.9em;
  line-height: 1.5;
}
blockquote {
  border-left: 4px solid #3b82f6;
  background: #f5f5f5;
  margin: 1.5em 0;
  padding: 12px 20px;
  color: #555;
  border-radius: 0 8px 8px 0;
}
code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
}

/* === 布局 === */
.container { max-width: 720px; margin: 0 auto; padding: 0 24px; }
.main-content { flex: 1; padding: 48px 0; }

/* === Header === */
.site-header {
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  position: sticky;
  top: 0;
  z-index: 100;
}
.header-inner {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 24px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.logo {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  text-decoration: none;
  letter-spacing: -0.5px;
}
.logo:hover { text-decoration: none; }

/* 桌面导航 */
.nav-desktop { display: flex; gap: 24px; }
.nav-link {
  font-size: 14px;
  color: #555;
  transition: color 0.2s;
}
.nav-link:hover { color: #3b82f6; text-decoration: none; }

/* 汉堡菜单 */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}
.hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  background: #2c3e50;
  border-radius: 2px;
  transition: all 0.3s;
}

/* 移动端导航遮罩 */
.mobile-nav-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 200;
}
.mobile-nav-overlay.active { display: block; }
.mobile-nav-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  height: 100%;
  background: #fff;
  padding: 24px;
  box-shadow: -4px 0 20px rgba(0,0,0,0.1);
}
.mobile-nav-close {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  float: right;
  color: #999;
}
.mobile-nav-close:hover { color: #333; }
.mobile-nav-links { margin-top: 60px; display: flex; flex-direction: column; gap: 16px; }
.mobile-nav-link {
  font-size: 18px;
  color: #2c3e50;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}
.mobile-nav-link:hover { color: #3b82f6; text-decoration: none; }

/* === 文章列表 === */
.post-list { display: flex; flex-direction: column; gap: 32px; }
.post-card {
  border-bottom: 1px solid #e8e8e8;
  padding-bottom: 24px;
}
.post-card-date {
  font-size: 13px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.post-card-title {
  font-size: 24px;
  margin: 8px 0 12px;
  line-height: 1.4;
}
.post-card-title a { color: #1a1a1a; }
.post-card-title a:hover { color: #3b82f6; text-decoration: none; }
.post-card-excerpt { color: #666; font-size: 15px; margin-bottom: 12px; }
.post-card-tags { display: flex; gap: 8px; flex-wrap: wrap; }

/* Tag chip */
.tag-chip {
  display: inline-block;
  padding: 3px 10px;
  background: #eef2ff;
  color: #3b82f6;
  border-radius: 12px;
  font-size: 12px;
  transition: background 0.2s;
}
.tag-chip:hover { background: #dbeafe; text-decoration: none; }

/* === 文章页 === */
.post-article { max-width: 720px; margin: 0 auto; padding: 0 24px; }
.post-header { margin-bottom: 32px; }
.post-date {
  font-size: 13px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.post-title {
  font-size: 32px;
  color: #1a1a1a;
  margin-top: 8px;
  line-height: 1.3;
}
.post-body { font-size: 16px; }
.post-body h2 { font-size: 26px; margin: 1.5em 0 0.5em; color: #1a1a1a; }
.post-body h3 { font-size: 22px; margin: 1.2em 0 0.4em; color: #1a1a1a; }
.post-body h4 { font-size: 18px; margin: 1em 0 0.3em; color: #1a1a1a; }
.post-body p { margin: 1em 0; }
.post-body ul, .post-body ol { margin: 1em 0; padding-left: 24px; }
.post-body li { margin: 0.3em 0; }

/* 标签面包屑 */
.tag-breadcrumb { margin: 24px 0; padding: 12px 0; border-top: 1px solid #e8e8e8; font-size: 14px; }
.tag-breadcrumb-label { color: #999; margin-right: 8px; }
.tag-breadcrumb-sep { color: #ccc; margin: 0 8px; }
.tag-breadcrumb-link { color: #3b82f6; }

/* 上一篇/下一篇 */
.post-nav {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e8e8e8;
}
.post-nav-prev, .post-nav-next { flex: 1; }
.post-nav-next { text-align: right; }
.post-nav-label { display: block; font-size: 12px; color: #999; text-transform: uppercase; }
.post-nav-title { display: block; margin-top: 4px; color: #1a1a1a; font-weight: 500; }
.post-nav-prev:hover .post-nav-title { color: #3b82f6; }
.post-nav-next:hover .post-nav-title { color: #3b82f6; }

/* === 分页 === */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid #e8e8e8;
}
.pagination-prev, .pagination-next {
  padding: 8px 16px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s;
}
.pagination-prev:hover, .pagination-next:hover {
  background: #3b82f6;
  color: #fff;
  border-color: #3b82f6;
  text-decoration: none;
}
.pagination-info { font-size: 14px; color: #999; }

/* === 归档 === */
.archive-item { display: flex; align-items: baseline; gap: 16px; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
.archive-item-date { font-size: 13px; color: #999; white-space: nowrap; min-width: 100px; }
.archive-item-title { font-size: 16px; font-weight: 500; }
.archive-item-title a { color: #1a1a1a; }
.archive-item-title a:hover { color: #3b82f6; }

/* === 页面标题 === */
.page-title { font-size: 28px; margin-bottom: 32px; color: #1a1a1a; }

/* === Footer === */
.site-footer {
  border-top: 1px solid #e8e8e8;
  padding: 24px 0;
  margin-top: auto;
}
.footer-inner { max-width: 720px; margin: 0 auto; padding: 0 24px; }
.copyright { font-size: 13px; color: #999; }
.copyright a { color: #999; }
.copyright a:hover { color: #3b82f6; }

/* === 响应式 === */

/* 平板 */
@media (max-width: 1023px) {
  .nav-desktop { display: none; }
  .hamburger { display: flex; }
}

/* 手机 */
@media (max-width: 767px) {
  html { font-size: 15px; }
  .container { padding: 0 20px; }
  .header-inner { padding: 0 20px; }
  .post-article { padding: 0 20px; }
  .main-content { padding: 32px 0; }
  .post-title { font-size: 26px; }
  .post-card-title { font-size: 20px; }
  .page-title { font-size: 24px; }
  .archive-item { flex-direction: column; gap: 4px; }
  .archive-item-date { min-width: auto; }
  .pagination { flex-wrap: wrap; }
  .post-nav { flex-direction: column; }
  .post-nav-next { text-align: left; }
}
```

- [ ] **Step 2: Commit**

```bash
git add theme/source/css/notebook.css
git commit -m "feat: add responsive stylesheet"
```


### Task 9: JS — 移动端导航

**Files:**
- Create: `theme/source/js/mobile-nav.js`

- [ ] **Step 1: 创建 mobile-nav.js**

```javascript
(function() {
  'use strict';

  var hamburger = document.getElementById('hamburgerBtn');
  var overlay = document.getElementById('mobileNavOverlay');
  var closeBtn = document.getElementById('mobileNavClose');

  if (!hamburger || !overlay) return;

  function openNav() {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openNav);

  if (closeBtn) {
    closeBtn.addEventListener('click', closeNav);
  }

  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) {
      closeNav();
    }
  });

  // ESC 键关闭
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeNav();
    }
  });
})();
```

- [ ] **Step 2: Commit**

```bash
git add theme/source/js/mobile-nav.js
git commit -m "feat: add mobile navigation with hamburger menu"
```


### Task 10: JS — Tag 树展开收起

**Files:**
- Create: `theme/source/js/tag-tree.js`

- [ ] **Step 1: 创建 tag-tree.js**

```javascript
(function() {
  'use strict';

  /**
   * 将扁平标签列表转换为树形结构
   * @param {Array} tags - [{name: "Grammar/Tenses/Present", path: "...", posts: [...]}]
   * @returns {Object} 树根节点
   */
  function buildTagTree(tags) {
    var root = { name: '__root__', children: {}, posts: [] };

    tags.forEach(function(tag) {
      var parts = tag.name.split('/');
      var node = root;

      parts.forEach(function(part) {
        if (!node.children[part]) {
          node.children[part] = { name: part, children: {}, posts: [], fullPath: '' };
        }
        node = node.children[part];
      });

      // 完整路径用于 Hexo 链接
      node.fullPath = tag.path;
      node.posts = tag.posts;
    });

    return root;
  }

  /**
   * 递归渲染树节点
   */
  function renderNode(node, container, expandLevel, depth) {
    var hasChildren = Object.keys(node.children).length > 0;
    var hasPosts = node.posts && node.posts.length > 0;
    if (!hasChildren && !hasPosts) return;

    var li = document.createElement('li');
    li.className = 'tag-tree-item';

    if (hasChildren) {
      // 有子节点 → 可展开/收起
      var toggle = document.createElement('span');
      toggle.className = 'tag-tree-toggle';

      var arrow = document.createElement('span');
      arrow.className = 'tag-tree-arrow';
      arrow.textContent = '▶'; // ▶
      toggle.appendChild(arrow);

      var label = document.createElement('span');
      label.className = 'tag-tree-label';
      label.textContent = node.name;

      if (hasPosts) {
        var count = document.createElement('span');
        count.className = 'tag-tree-count';
        count.textContent = '(' + node.posts.length + ')';
        label.appendChild(count);
      }

      toggle.appendChild(label);

      var childrenContainer = document.createElement('ul');
      childrenContainer.className = 'tag-tree-list tag-tree-children';

      // 渲染子节点
      Object.keys(node.children).sort().forEach(function(key) {
        renderNode(node.children[key], childrenContainer, expandLevel, depth + 1);
      });

      // 如果有文章，在子节点底部添加文章链接
      if (hasPosts) {
        node.posts.forEach(function(post) {
          var postLi = document.createElement('li');
          var postLink = document.createElement('a');
          postLink.className = 'tag-tree-post-link';
          postLink.href = post.path;
          postLink.textContent = post.title;
          postLi.appendChild(postLink);
          childrenContainer.appendChild(postLi);
        });
      }

      li.appendChild(toggle);
      li.appendChild(childrenContainer);

      // 展开/收起逻辑
      toggle.addEventListener('click', function(e) {
        e.stopPropagation();
        var isExpanded = childrenContainer.classList.toggle('expanded');
        arrow.classList.toggle('expanded', isExpanded);
      });

      // 自动展开到指定层级
      if (depth < expandLevel) {
        childrenContainer.classList.add('expanded');
        arrow.classList.add('expanded');
      }
    } else {
      // 叶子节点（纯文章列表）
      var label = document.createElement('span');
      label.className = 'tag-tree-label tag-tree-leaf';
      label.textContent = node.name;

      if (node.fullPath) {
        var parentLink = document.createElement('a');
        parentLink.href = node.fullPath;
        parentLink.className = 'tag-tree-label';
        // 用 a 替换 label
        parentLink.textContent = node.name;
        if (hasPosts) {
          var count = document.createElement('span');
          count.className = 'tag-tree-count';
          count.textContent = '(' + node.posts.length + ')';
          parentLink.appendChild(count);
        }
        li.appendChild(parentLink);
      } else {
        li.appendChild(label);
      }

      // 直接显示文章链接
      if (hasPosts) {
        var childrenContainer = document.createElement('ul');
        childrenContainer.className = 'tag-tree-list tag-tree-children expanded';
        node.posts.forEach(function(post) {
          var postLi = document.createElement('li');
          var postLink = document.createElement('a');
          postLink.className = 'tag-tree-post-link';
          postLink.href = post.path;
          postLink.textContent = post.title;
          postLi.appendChild(postLink);
          childrenContainer.appendChild(postLi);
        });
        li.appendChild(childrenContainer);
      }
    }

    container.appendChild(li);
  }

  /**
   * 主入口：渲染 tag 树到 DOM
   * @param {Array} flatTags - 扁平标签数据
   * @param {number} expandLevel - 默认展开层级
   */
  window.renderTagTree = function(flatTags, expandLevel) {
    expandLevel = expandLevel || 0;
    var container = document.getElementById('tagTreeContainer');
    if (!container) return;

    var root = buildTagTree(flatTags);
    var treeList = document.createElement('ul');
    treeList.className = 'tag-tree-list tag-tree-root';

    Object.keys(root.children).sort().forEach(function(key) {
      renderNode(root.children[key], treeList, expandLevel, 0);
    });

    container.appendChild(treeList);
  };
})();
```

- [ ] **Step 2: Commit**

```bash
git add theme/source/js/tag-tree.js
git commit -m "feat: add tag tree JS with expand/collapse"
```


### Task 11: 示例文章

**Files:**
- Create: `site/source/_posts/usage-of-change-words.md`
- Create: `site/source/_posts/present-perfect-tense.md`

- [ ] **Step 1: 创建第一篇文章（匹配 front-matter 规范）**

```markdown
---
title: usage-of-change-words
date: 2026-06-08 22:35:05
tags:
  - "Grammar/Vocabulary/Change Words"
  - "Usage"
---

## Common Change Words

### Alter
To change something in a small but significant way.

> "We need to **alter** our approach to this problem."

### Modify
To make partial changes to something.

> "The design was **modified** to meet new requirements."

### Transform
A complete and dramatic change.

> "The internet has **transformed** how we communicate."

### Shift
A subtle change in direction or position.

> "There has been a **shift** in public opinion."
```

- [ ] **Step 2: 创建第二篇文章（演示 tag 树结构）**

```markdown
---
title: present-perfect-tense
date: 2026-06-10 20:15:00
tags:
  - "Grammar/Tenses/Present Perfect"
  - "Usage"
---

## Present Perfect Tense

### Form
**Subject + have/has + past participle**

### Usage 1: Experience
> "I have **visited** Japan three times."

### Usage 2: Change over time
> "Your English **has improved** since last year."

### Usage 3: Accomplishments
> "Scientists **have discovered** a new species."

### Keywords
- ever, never, already, yet, just, recently, so far
```

- [ ] **Step 3: 验证 Hexo generate 生成成功**

```bash
cd site && npx hexo generate
```

Expected: 无错误，`site/public/` 目录生成，包含 index.html、tags/、archives/ 等

- [ ] **Step 4: Commit**

```bash
git add site/source/_posts/
git commit -m "docs: add sample posts to verify theme rendering"
```


### Task 12: 自定义 Tag 生成器（处理层级标签）

**Files:**
- Create: `site/scripts/tag-tree-generator.js`

- [ ] **Step 1: 创建 site/scripts/tag-tree-generator.js**

```javascript
/**
 * Tag 树生成器
 * 确保使用 '/' 分隔的层级标签能在 /tags/:path 路由下正确访问
 */
hexo.extend.generator.register('tag-tree-page', function(locals) {
  var tags = locals.tags;
  if (!tags || !tags.length) return [];

  var pages = [];

  tags.each(function(tag) {
    // 将 "Grammar/Tenses/Present Perfect" 映射为 URL 路径
    var tagPath = tag.path;

    pages.push({
      path: tagPath,
      layout: 'tag',
      data: {
        tag: tag.name
      }
    });
  });

  return pages;
});
```

- [ ] **Step 2: Commit**

```bash
git add site/scripts/tag-tree-generator.js
git commit -m "feat: add custom tag generator for hierarchical tags"
```


### Task 13: GitHub Pages 部署

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: 创建 deploy.yml**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: site
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Generate static files
        run: npx hexo generate

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: site/public

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Pages deployment workflow"
```


### Task 14: 最终验证

- [ ] **Step 1: 完整构建测试**

```bash
cd site && npx hexo clean && npx hexo generate
```

Expected: 无错误，`site/public/` 结构完整

- [ ] **Step 2: 启动 Hexo 本地服务器预览**

```bash
cd site && npx hexo server
```

访问 http://localhost:4000 查看：
- 首页显示文章列表
- 文章页面显示正常
- /tags/ 显示标签树（可展开收起）
- 点击标签跳转到标签文章列表
- 响应式断点正常工作（缩窄浏览器窗口）
- 汉堡菜单可展开和关闭
- 归档页面正常

- [ ] **Step 3: 终提交**

```bash
git add -A
git commit -m "chore: finalize theme implementation"
```
