# hexo-theme-notebook

A clean, modern [Hexo](https://hexo.io/) theme for learning notes. Responsive design, hierarchical tag tree, Medium-like reading experience.

## Install

```bash
npm install hexo-theme-notebook
```

Then set `theme: notebook` in your Hexo `_config.yml`.

## Features

- **Responsive** — mobile, tablet, desktop
- **Tag tree** — hierarchical tags with `/` separator, JS expand/collapse
- **Clean typography** — 720px golden width, warm white background
- **Zero external dependencies** — CSS + vanilla JS only
- **GitHub Pages ready** — works with any static hosting

## Configuration

See [`_config.yml`](./_config.yml) for all options.

```yaml
menu:
  Home: /
  Tags: /tags
  Archive: /archives

tag_tree:
  enable: true
  expand_level: 0
  mode: folder          # "folder" | "frontmatter"

brand: "Notebook"
description: "Learning Notes"
```

## Grouped Nav Items

A `menu` value is normally a path. Give it a map instead and it renders as a
dropdown, which keeps the bar short on sites that grow many sections:

```yaml
menu:
  Home: /
  Learning:
    Overview: /learning
    Daily Chat: /chat
    Coach: /coach
  Tags: /tags
```

Nesting is one level deep by design - the nav is a shortcut, not a sitemap, so
deeper structure belongs on a landing page. The group opens on hover for mouse
users and on click/tap elsewhere (`source/js/nav-group.js`), and the item
matching the current URL gets `.is-active`, with its parent group highlighted
too. On mobile the group becomes a labelled, indented block rather than a
dropdown, since a slide-out panel has the room to show everything at once.

## Tag Tree

The theme provides a hierarchical tag tree on the `/tags/` page. There are two modes controlled by `tag_tree.mode`:

### `mode: folder` (default)

Auto-generates the tree structure from the post's location under `source/_posts/`:

```
source/_posts/
├── NCE-02/
│   └── lessons/
│       └── Composition/
│           ├── lesson-1.md    →  tagged under NCE-02/lessons/Composition
│           └── lesson-2.md    →  tagged under NCE-02/lessons/Composition
├── quick-note.md              →  rendered as a direct post at root level
└── todo.md                    →  rendered as a direct post at root level
```

Posts inside subdirectories are grouped in expandable folders. Posts directly in `_posts/` (no subdirectory) are shown at the root level without a wrapper node. The `tag_tree` front-matter field is **ignored** in this mode.

### `mode: frontmatter`

Uses the `tag_tree` field from each post's front-matter, independent from `tags`:

```yaml
title: Getting Started
tags:
  - Hexo
tag_tree: Tutorials/Getting Started
```

This renders the post under `Tutorials > Getting Started` in the tag tree.

## License

MIT
