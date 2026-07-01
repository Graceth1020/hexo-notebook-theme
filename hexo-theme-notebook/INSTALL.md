# Installing hexo-theme-notebook in Another Hexo Project

This guide covers all the ways to use this theme in a Hexo site, whether or not it's published to npm.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Method 1: Install from GitHub via npm (recommended)](#method-1-install-from-github-via-npm-recommended)
- [Method 2: Git submodule](#method-2-git-submodule)
- [Method 3: Local file reference](#method-3-local-file-reference)
- [Method 4: Manual copy](#method-4-manual-copy)
- [Method 5: Publish to npm first](#method-5-publish-to-npm-first)
- [Post-install steps](#post-install-steps)
- [Verify installation](#verify-installation)

---

## Prerequisites

- Node.js >= 18
- npm >= 9
- An existing Hexo site (create one with `npm init hexo-site my-blog`)

---

## Method 1: Install from GitHub via npm (recommended)

Install the theme directly from the GitHub repository without needing npm publish:

```bash
cd your-hexo-site
npm install git+https://github.com/Graceth1020/hexo-notebook-theme.git
```

Then create a symlink so Hexo can find the theme in its `themes/` directory:

**Windows (cmd, run as admin):**
```cmd
mklink /D themes\notebook node_modules\hexo-notebook-theme\hexo-theme-notebook
```

**macOS / Linux:**
```bash
ln -s ../node_modules/hexo-notebook-theme/hexo-theme-notebook themes/notebook
```

Then set `theme: notebook` in your site's `_config.yml`.

**To update later:**
```bash
npm update hexo-notebook-theme
```

**Pin to a specific version / branch:**
```bash
npm install git+https://github.com/Graceth1020/hexo-notebook-theme.git#v1.0.0
npm install git+https://github.com/Graceth1020/hexo-notebook-theme.git#main
```

---

## Method 2: Git submodule

Keeps the theme as a git reference — useful if you want to track upstream changes.

```bash
cd your-hexo-site
git submodule add https://github.com/Graceth1020/hexo-notebook-theme.git themes/notebook
```

The submodule pulls down the entire repo (root + site + theme), but Hexo only reads `themes/notebook/hexo-theme-notebook/`. To fix that:

**Option A — Symlink inside the submodule:**
```bash
cd themes/notebook
mklink /D notebook hexo-theme-notebook   # Windows
ln -s hexo-theme-notebook notebook       # macOS/Linux
```
Then set `theme: notebook` in your site config.

**Option B — Configure Hexo to use the subpath:**
Instead of `theme: notebook`, use `theme: notebook/hexo-theme-notebook`.

**To update later:**
```bash
cd themes/notebook
git pull origin main
cd ../..
git add themes/notebook
git commit -m "update theme"
```

---

## Method 3: Local file reference

If both projects are on the same machine, symlink the theme directly:

```bash
cd your-hexo-site/themes
ln -s /absolute/path/to/hexo-notebook-theme/hexo-theme-notebook notebook
```

**Windows (cmd, run as admin):**
```cmd
cd your-hexo-site\themes
mklink /D notebook D:\project\frontend\hexo-notebook-theme\hexo-theme-notebook
```

Then set `theme: notebook` in your site's `_config.yml`.

---

## Method 4: Manual copy

Simple, but you'll need to repeat this to get updates.

```bash
# Copy the theme directory into your site
cp -r /path/to/hexo-theme-notebook your-hexo-site/themes/notebook
```

Then set `theme: notebook` in your site's `_config.yml`.

---

## Method 5: Publish to npm first

If you publish the theme to the public npm registry:

```bash
cd hexo-theme-notebook
# Make sure you're logged in
npm login
# Check the name isn't taken
npm view hexo-theme-notebook
# Publish
npm publish
```

Then in any Hexo project:

```bash
cd your-hexo-site
npm install hexo-theme-notebook
```

Hexo automatically discovers `hexo-theme-*` packages in `node_modules` when you set `theme: notebook` — **no symlink needed**. This is the simplest workflow.

---

## Post-install steps

After installing the theme via any of the methods above:

1. **Set the theme in your site `_config.yml`:**
   ```yaml
   theme: notebook
   ```

2. **Set the tag directory** (optional, for clean URLs):
   ```yaml
   tag_dir: tags
   ```

3. **Configure theme options** (optional — the theme works with defaults).

   Copy `themes/notebook/_config.yml` to `_config.notebook.yml` in your site root — Hexo merges it automatically. This way you can track your theme config in your own repo.

4. **Add `tag_tree` to your posts** to use the hierarchical tag tree:
   ```yaml
   ---
   title: My Post
   tag_tree: Category/Subcategory
   ---
   ```

   See the main [README](../README.md#tag-tree) for full details on the tag tree feature.

---

## Verify installation

```bash
cd your-hexo-site
npx hexo generate
npx hexo server
```

Visit `http://localhost:4000`. If the theme loads correctly, you'll see the Notebook theme with its warm white background and clean typography.

**Troubleshooting:**
| Symptom | Likely cause |
|---------|-------------|
| Default Hexo theme shows | `theme: notebook` not set in `_config.yml` |
| Error: `notebook` theme does not exist | Theme folder missing from `themes/` |
| Missing CSS/styles | Symlink not working (Methods 1–3), or theme path incorrect |
| `npm install` errors | Check Node.js >= 18 |
