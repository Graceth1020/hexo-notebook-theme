# Hexo Notebook Theme

A clean, modern [Hexo](https://hexo.io/) theme for learning notes. Features a responsive design with Medium-like reading experience, hierarchical tag tree navigation, and GitHub Pages deployment support.

> The theme is an independent npm package: [`hexo-theme-notebook`](./hexo-theme-notebook/)

---

## Quick Start

### Prerequisites

- Node.js >= 18
- npm >= 9

### 1. Use the existing site

```bash
# Clone or navigate to the project
cd hexo-notebook-theme/site

# Install dependencies
npm install

# Start the dev server
npx hexo server
```

Visit http://localhost:4000

### 2. Or start from scratch with this theme

```bash
npm init hexo-site my-notes
cd my-notes
npm install hexo-theme-notebook
```

Then set `theme: notebook` in `_config.yml`.

---

## Project Structure

```
hexo-notebook-theme/
├── hexo-theme-notebook/        # 📦 Standalone theme package (publishable to npm)
│   ├── layout/                 # EJS templates
│   │   ├── index.ejs           # Homepage — post list with pagination
│   │   ├── post.ejs            # Single article page
│   │   ├── tag-tree.ejs        # /tags/ — hierarchical tag tree
│   │   ├── tag.ejs             # Posts filtered by tag
│   │   ├── archive.ejs         # Monthly archive
│   │   ├── page.ejs            # Generic page
│   │   ├── 404.ejs             # Custom 404
│   │   └── partials/           # Shared components
│   ├── source/
│   │   ├── css/notebook.css    # Responsive stylesheet
│   │   └── js/
│   │       ├── tag-tree.js     # Tag tree expand/collapse
│   │       └── mobile-nav.js   # Hamburger menu
│   ├── _config.yml             # Theme configuration
│   └── package.json            # npm package manifest
│
├── site/                       # 🏗️ Example Hexo site
│   ├── source/_posts/          # Your learning notes (.md)
│   ├── scripts/                # Custom Hexo generators
│   ├── _config.yml             # Site configuration
│   └── package.json
│
├── .github/workflows/deploy.yml  # 🚀 GitHub Pages auto-deploy
└── docs/                       # Design docs & implementation plans
```

---

## Features

### 📱 Responsive Design

| Device | Breakpoint | Layout |
|--------|-----------|--------|
| Mobile | <768px | 20px padding, 15px font, hamburger menu |
| Tablet | 768–1023px | 40px padding, hamburger menu |
| Desktop | ≥1024px | 720px centered content, full nav bar |

- Hamburger menu with slide-out panel and overlay
- Touch-friendly tap targets (≥44px)
- Scrollable code blocks
- Auto-resizing images

### 🏷️ Hierarchical Tag Tree

Use `/` in your front-matter to create nested tags:

```yaml
---
title: present-perfect-tense
tags:
  - "Grammar/Tenses/Present Perfect"
  - "Usage"
---
```

The `/tags/` page renders this as an expandable tree:

```
Grammar ──────────────────── click to expand
├── Tenses
│   ├── Present Perfect ··· [article links]
│   └── Past Simple ······· [article links]
└── Articles ·············· [article links]

Usage ────────────────────── [article links]
```

- JavaScript-powered expand/collapse
- All folded by default (configurable via `expand_level`)
- Sorted alphabetically

### 🎨 Design Tokens

| Role | Color | Description |
|------|-------|-------------|
| Background | `#fafafa` | Warm white, easy on eyes |
| Body text | `#2c3e50` | Dark blue-gray |
| Headings | `#1a1a1a` | Pure black |
| Accent | `#3b82f6` | Clear blue |
| Code/quote bg | `#f5f5f5` | Soft gray |
| Tag chip | `#eef2ff` | Pale blue |

- Font stack: `system-ui, -apple-system, 'Segoe UI', sans-serif`
- Code: `'JetBrains Mono', 'Fira Code', monospace`
- Body: 16px / line-height 1.8
- Content max-width: 720px (optimal reading width)

### 🚀 GitHub Pages Deployment

Push to `main` → automatically deployed via GitHub Actions.

---

## Usage

### Writing notes

Create a new post:

```bash
cd site
npx hexo new "my-new-note"
```

Edit the generated file in `site/source/_posts/my-new-note.md`:

```markdown
---
title: my-new-note
date: 2026-06-14 20:00:00
tags:
  - "Category/Subcategory"
  - "Another Tag"
---

## Your content here
```

### Theme configuration

Edit `hexo-theme-notebook/_config.yml`:

```yaml
menu:
  Home: /
  Tags: /tags
  Archive: /archives

brand: "Notebook"
description: "Learning Notes"

tag_tree:
  enable: true
  expand_level: 0       # Auto-expand depth (0 = all collapsed)
```

### Publish the theme

```bash
cd hexo-theme-notebook
npm publish
```

---

## Local Development

```bash
# Start dev server with live reload
cd site && npx hexo server

# Clean and rebuild
cd site && npx hexo clean && npx hexo generate

# Create a new post
cd site && npx hexo new "post-title"
```

The theme is linked via `npm install file:../hexo-theme-notebook` — changes to the theme source are reflected immediately.

---

## Translation Feature (Planned)

Translation support via Tencent Cloud API is designed but not yet implemented. The storage layer uses an **Adapter pattern** to support future backends:

```typescript
interface TranslationStorage {
  save(record): Promise<TranslationRecord>
  getAll(): Promise<TranslationRecord[]>
  getById(id: string): Promise<TranslationRecord | null>
  delete(id: string): Promise<void>
  search(query: string): Promise<TranslationRecord[]>
}
```

Planned adapters: localStorage, IndexedDB, remote API.

---

## License

MIT
