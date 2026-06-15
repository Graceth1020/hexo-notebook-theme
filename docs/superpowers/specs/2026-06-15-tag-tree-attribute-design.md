# Tag Tree Front-Matter Attribute Design

**Date:** 2026-06-15
**Status:** Approved

## Problem

Currently, the tag tree hierarchy is encoded within Hexo tag names using `/` separators
(e.g., `tags: ["Grammar/Tenses/Present Perfect"]`). This couples two unrelated concerns:
the tag label and the tree display position.

## Solution

Introduce a separate `tag_tree` front-matter attribute to define tree hierarchy,
keeping `tags` as flat, clean labels for Hexo's built-in tag system.

## Front-Matter Format

```yaml
tags:
  - Present Perfect
  - Usage
tag_tree: Grammar/Tenses/Present Perfect
```

- `tags` — flat Hexo tags (unchanged behavior)
- `tag_tree` — single string, `/`-separated path defining the tree location
- Tags and tag_tree are completely independent

## Files Changed

### `hexo-theme-notebook/layout/tag-tree.ejs`
- Change data source from `site.tags` to `site.posts` with `tag_tree` field
- Collect: `[{ tree: "...", posts: [{title, path}] }]`

### `hexo-theme-notebook/source/js/tag-tree.js`
- `buildTagTree()` receives flat `{tree, posts}` entries
- Splits tree path by `/`, attaches posts only at leaf nodes
- Leaf nodes show post links directly (no link to tag page)

### Post front-matter (existing posts)
- Update `present-perfect-tense.md` and `usage-of-change-words.md`

### Test edge case
- Add a post without `tag_tree` — verify it doesn't appear in tree

## Unchanged
- `tag.ejs`, `index.ejs`, `tag-breadcrumb.ejs` — still use Hexo built-in tags
- `tag-tree-generator.js` — still generates Hexo tag pages
- Theme `_config.yml` — tag_tree config stays the same
- Expand/collapse rendering logic — same
