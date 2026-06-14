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

brand: "Notebook"
description: "Learning Notes"
```

## Tag Hierarchy

Use `/` in tags to create a nested tree:

```yaml
tags:
  - "Grammar/Tenses/Present Perfect"
  - "Usage"
```

This renders as an expandable tree on the `/tags/` page.

## License

MIT
