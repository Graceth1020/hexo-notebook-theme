# Hexo Notebook Theme

A clean, responsive [Hexo](https://hexo.io/) theme with hierarchical tag tree navigation and Medium-like reading experience. Zero external JavaScript dependencies — just CSS and vanilla JS.

> The theme is an independent npm package at [`hexo-theme-notebook/`](./hexo-theme-notebook/).

---

## Contents

- [Quick Start](#quick-start)
- [Features](#features)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Tag Tree](#tag-tree)
- [Writing Posts](#writing-posts)
- [Local Development](#local-development)
- [Deployment](#deployment)
- [Branch Management](#branch-management)
- [Publishing](#publishing)
- [License](#license)

---

## Quick Start

### Prerequisites

- Node.js >= 18
- npm >= 9

### Use the demo site

```bash
cd site
npm install
npx hexo server
```

Visit [http://localhost:4000](http://localhost:4000).

### Start a new site with this theme

```bash
npm init hexo-site my-blog
cd my-blog
npm install hexo-theme-notebook
```

Then set `theme: notebook` in your `_config.yml`.

---

## Features

### 📱 Responsive Design

| Device | Breakpoint | Layout |
|--------|-----------|--------|
| Mobile | <768px | 20px padding, 15px font, hamburger menu |
| Tablet | 768–1023px | 40px padding, hamburger menu |
| Desktop | ≥1024px | 720px centered content, full nav bar |

- Slide-out mobile menu with overlay
- Touch-friendly tap targets (≥44px)
- Scrollable code blocks
- Auto-resizing images

### 🏷️ Hierarchical Tag Tree

The `/tags/` page renders an expandable tree from each post's `tag_tree` front-matter field:

```
Tutorials ────────────── click to expand
├── Getting Started ──── [post links]
└── Markdown ─────────── [post links]

Blog ──────────────────── click to expand
└── Welcome ──────────── [post links]
```

- JavaScript expand/collapse with animated arrows
- Configurable default expand depth
- Alphabetically sorted
- Posts appear only at leaf nodes

### 🎨 Design Tokens

| Role | Color | Description |
|------|-------|-------------|
| Background | `#fafafa` | Warm white, easy on eyes |
| Body text | `#2c3e50` | Dark blue-gray |
| Headings | `#1a1a1a` | Near black |
| Accent | `#3b82f6` | Clear blue |
| Code/quote bg | `#f5f5f5` | Soft gray |

- Font stack: `system-ui, -apple-system, 'Segoe UI', sans-serif`
- Code: `'JetBrains Mono', 'Fira Code', monospace`
- Body: 16px / line-height 1.8
- Content max-width: 720px (optimal reading width)

### 🚀 GitHub Pages Ready

Push to the default branch → auto-deploy via GitHub Actions. See [deployment workflow](.github/workflows/deploy.yml).

---

## Project Structure

```
hexo-notebook-theme/
├── hexo-theme-notebook/        # 📦 Standalone theme package
│   ├── layout/                 # EJS templates
│   │   ├── index.ejs           # Homepage — post list with pagination
│   │   ├── post.ejs            # Single article page
│   │   ├── tag-tree.ejs        # /tags/ — hierarchical tag tree
│   │   ├── tag.ejs             # Posts filtered by tag
│   │   ├── archive.ejs         # Monthly archive
│   │   ├── page.ejs            # Generic page (about, contact, etc.)
│   │   ├── 404.ejs             # Custom 404 page
│   │   └── partials/           # Shared components (header, footer, etc.)
│   ├── source/
│   │   ├── css/notebook.css    # Stylesheet
│   │   └── js/
│   │       ├── tag-tree.js     # Tag tree expand/collapse
│   │       └── mobile-nav.js   # Hamburger menu
│   ├── _config.yml             # Theme configuration
│   └── package.json            # npm package manifest
│
├── site/                       # 🏗️ Example site
│   ├── source/_posts/          # Sample posts (.md)
│   ├── scripts/                # Custom Hexo generators
│   ├── _config.yml             # Site configuration
│   └── package.json
│
├── .github/workflows/deploy.yml  # CI/CD
└── docs/                       # Design docs & plans
```

---

## Configuration

### Theme config (`hexo-theme-notebook/_config.yml`)

```yaml
# Navigation menu
menu:
  Home: /
  Tags: /tags
  Archive: /archives

# Site branding
brand: "Notebook"
description: "A clean Hexo theme for learning notes"

# Tag tree
tag_tree:
  enable: true
  expand_level: 0       # levels auto-expanded (0 = all collapsed)
```

### Site config (`site/_config.yml`)

```yaml
theme: notebook

# Tag directory for clean URLs
tag_dir: tags
```

---

## Tag Tree

The tag tree is powered by the `tag_tree` front-matter field — a **separate attribute** from Hexo's built-in `tags`:

```yaml
---
title: Getting Started with Hexo
tags:
  - Hexo
  - Tutorial
tag_tree: Tutorials/Getting Started
---
```

- `tags` — flat labels for Hexo's built-in tag pages (`/tags/hexo/`)
- `tag_tree` — `/`-separated path defining where the post appears in the tree on `/tags/`

They are independent: a post can have tags without a `tag_tree` (won't appear in the tree), or a `tag_tree` without matching tags.

### Tree rules

- Posts appear **only at leaf nodes** — internal nodes are expandable folders
- Sorted alphabetically at each level
- Multiple posts can share the same `tag_tree` path

---

## Writing Posts

```bash
cd site
npx hexo new "my-post-title"
```

Edit the generated file:

```markdown
---
title: My Post Title
date: 2026-06-15 20:00:00
tags:
  - Tag1
  - Tag2
tag_tree: Category/Subcategory
---

## Content goes here

Your markdown content...
```

---

## Local Development

```bash
# Start dev server
cd site && npx hexo server

# Clean and rebuild
cd site && npx hexo clean && npx hexo generate
```

The theme is linked via `npm install file:../hexo-theme-notebook` — changes to `hexo-theme-notebook/` are reflected immediately (a server restart may be required for layout changes).

---

## Deployment

### GitHub Pages (automatic)

1. Push to `main`
2. GitHub Actions builds and deploys via [the workflow](.github/workflows/deploy.yml)
3. Your site is live at `https://<username>.github.io/<repo>/`

### Other hosting

```bash
cd site
npx hexo generate
# Upload site/public/ to any static host (Netlify, Vercel, S3, etc.)
```

---

## Branch Management

This project uses a simple branch strategy:

| Branch | Purpose |
|--------|---------|
| `init` | Main development branch — contains the latest code |

The `init` branch serves as both the development and release branch for now. Future iterations may introduce a `main`/`stable` branch for production releases.

---

## Publishing (npm)

```bash
cd hexo-theme-notebook
npm publish
```

Ensure version is bumped in `package.json` first.

---

## License

MIT
