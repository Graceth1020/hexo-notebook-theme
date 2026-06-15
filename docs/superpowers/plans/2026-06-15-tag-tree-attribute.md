# Tag Tree Front-Matter Attribute Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move tree hierarchy out of Hexo tag names into a separate `tag_tree` front-matter attribute.

**Architecture:** `tag-tree.ejs` collects `tag_tree` values from all posts and passes them to `tag-tree.js`, which builds the visual tree from those values instead of splitting tag names. Existing tags remain flat labels for Hexo's built-in tag system.

**Tech Stack:** Hexo, EJS, vanilla JavaScript

---

### Task 1: Update tag-tree.ejs data source

**Files:**
- Modify: `hexo-theme-notebook/layout/tag-tree.ejs`

- [ ] **Step 1: Replace the TAG_TREE_DATA source**

  Change the inline script block from reading `site.tags` to collecting `tag_tree` values from `site.posts`.

  **Before** (lines 40-48):
  ```ejs
      var TAG_TREE_DATA = <%- JSON.stringify(site.tags ? site.tags.toArray().map(function(tag) {
        return {
          name: tag.name,
          path: tag.path,
          posts: tag.posts.toArray().map(function(p) {
            return { title: p.title, path: p.path }
          })
        }
      }) : []) %>;
  ```

  **After:**
  ```ejs
  <%
    var treeMap = {};
    if (site.posts) {
      site.posts.toArray().forEach(function(post) {
        if (post.tag_tree) {
          if (!treeMap[post.tag_tree]) {
            treeMap[post.tag_tree] = { tree: post.tag_tree, posts: [] };
          }
          treeMap[post.tag_tree].posts.push({ title: post.title, path: post.path });
        }
      });
    }
    var treeData = Object.keys(treeMap).map(function(key) { return treeMap[key]; });
  %>
      var TAG_TREE_DATA = <%- JSON.stringify(treeData) %>;
  ```

- [ ] **Step 2: Verify the template parses**

  Run: `cd site && npx hexo generate`
  Expected: No EJS parsing errors, `public/js/tag-tree.js` and `public/index.html` are generated.

- [ ] **Step 3: Commit**

  ```bash
  git add hexo-theme-notebook/layout/tag-tree.ejs
  git commit -m "feat: collect tag_tree from post front-matter in tag-tree template"
  ```

---

### Task 2: Update tag-tree.js tree builder

**Files:**
- Modify: `hexo-theme-notebook/source/js/tag-tree.js`

- [ ] **Step 1: Rewrite buildTagTree**

  Change from splitting tag names to building from `{tree, posts}` entries. Posts are attached only at leaf nodes.

  **Before:**
  ```js
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
  ```

  **After:**
  ```js
    function buildTagTree(treeEntries) {
      var root = { name: '__root__', children: {} };

      treeEntries.forEach(function(entry) {
        var parts = entry.tree.split('/');
        var node = root;

        parts.forEach(function(part, i) {
          if (!node.children[part]) {
            node.children[part] = { name: part, children: {}, posts: [] };
          }
          node = node.children[part];
          // Posts only at leaf node (last segment)
          if (i === parts.length - 1) {
            node.posts = entry.posts;
          }
        });
      });

      return root;
    }
  ```

- [ ] **Step 2: Simplify renderNode for leaf-only posts**

  Leaf nodes show the node name followed by post links. Internal nodes are expandable folders without post lists or count badges.

  **Before (entire renderNode function):**
  ```js
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
        arrow.textContent = '▶';
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

        // 渲染子节点（按名称排序）
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
        if (node.fullPath) {
          var parentLink = document.createElement('a');
          parentLink.href = node.fullPath;
          parentLink.className = 'tag-tree-label';
          parentLink.textContent = node.name;
          if (hasPosts) {
            var count = document.createElement('span');
            count.className = 'tag-tree-count';
            count.textContent = '(' + node.posts.length + ')';
            parentLink.appendChild(count);
          }
          li.appendChild(parentLink);
        } else {
          var label = document.createElement('span');
          label.className = 'tag-tree-label tag-tree-leaf';
          label.textContent = node.name;
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
  ```

  **After:**
  ```js
    function renderNode(node, container, expandLevel, depth) {
      var hasChildren = Object.keys(node.children).length > 0;
      var hasPosts = node.posts && node.posts.length > 0;
      if (!hasChildren && !hasPosts) return;

      var li = document.createElement('li');
      li.className = 'tag-tree-item';

      if (hasChildren) {
        // 有子节点 → 可展开/收起（文件夹节点，没有文章）
        var toggle = document.createElement('span');
        toggle.className = 'tag-tree-toggle';

        var arrow = document.createElement('span');
        arrow.className = 'tag-tree-arrow';
        arrow.textContent = '▶';
        toggle.appendChild(arrow);

        var label = document.createElement('span');
        label.className = 'tag-tree-label';
        label.textContent = node.name;
        toggle.appendChild(label);

        var childrenContainer = document.createElement('ul');
        childrenContainer.className = 'tag-tree-list tag-tree-children';

        // 渲染子节点（按名称排序）
        Object.keys(node.children).sort().forEach(function(key) {
          renderNode(node.children[key], childrenContainer, expandLevel, depth + 1);
        });

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
        // 叶子节点 → 显示名称和文章列表
        var label = document.createElement('span');
        label.className = 'tag-tree-label tag-tree-leaf';
        label.textContent = node.name;
        li.appendChild(label);

        var postsContainer = document.createElement('ul');
        postsContainer.className = 'tag-tree-list tag-tree-children expanded';
        node.posts.forEach(function(post) {
          var postLi = document.createElement('li');
          var postLink = document.createElement('a');
          postLink.className = 'tag-tree-post-link';
          postLink.href = post.path;
          postLink.textContent = post.title;
          postLi.appendChild(postLink);
          postsContainer.appendChild(postLi);
        });
        li.appendChild(postsContainer);
      }

      container.appendChild(li);
    }
  ```

- [ ] **Step 3: Verify JS syntax**

  Node has no syntax errors. Run a quick check:
  ```bash
  node -e "require('fs').readFileSync('hexo-theme-notebook/source/js/tag-tree.js', 'utf8').split('\n').forEach(function(l,i){try{Function(l)}catch(e){if(i>0)console.log('line',i+1,':',e.message)}}); console.log('Syntax OK')"
  ```
  Expected: `Syntax OK`

- [ ] **Step 4: Commit**

  ```bash
  git add hexo-theme-notebook/source/js/tag-tree.js
  git commit -m "feat: build tag tree from tag_tree front-matter entries"
  ```

---

### Task 3: Update existing post front-matter

**Files:**
- Modify: `site/source/_posts/present-perfect-tense.md`
- Modify: `site/source/_posts/usage-of-change-words.md`

- [ ] **Step 1: Update present-perfect-tense.md**

  Move hierarchy out of tag name into `tag_tree`.

  **Before:**
  ```yaml
  ---
  title: present-perfect-tense
  date: 2026-06-10 20:15:00
  tags:
    - "Grammar/Tenses/Present Perfect"
    - "Usage"
  ---
  ```

  **After:**
  ```yaml
  ---
  title: present-perfect-tense
  date: 2026-06-10 20:15:00
  tags:
    - Present Perfect
    - Usage
  tag_tree: Grammar/Tenses/Present Perfect
  ---
  ```

- [ ] **Step 2: Update usage-of-change-words.md**

  **Before:**
  ```yaml
  ---
  title: usage-of-change-words
  date: 2026-06-08 22:35:05
  tags:
    - "Grammar/Vocabulary/Change Words"
    - "Usage"
  ---
  ```

  **After:**
  ```yaml
  ---
  title: usage-of-change-words
  date: 2026-06-08 22:35:05
  tags:
    - Change Words
    - Usage
  tag_tree: Grammar/Vocabulary/Change Words
  ---
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add site/source/_posts/present-perfect-tense.md site/source/_posts/usage-of-change-words.md
  git commit -m "refactor: move tag tree hierarchy into tag_tree front-matter"
  ```

---

### Task 4: Add test post without tag_tree (edge case)

**Files:**
- Create: `site/source/_posts/test-post-no-tree.md`

- [ ] **Step 1: Create test post**

  Write `site/source/_posts/test-post-no-tree.md`:
  ```markdown
  ---
  title: A Post Without Tree
  date: 2026-06-15 12:00:00
  tags:
    - Untagged
  ---

  ## Test Post

  This post has no `tag_tree` front-matter. It should NOT appear in the tag tree on the `/tags` page.
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add site/source/_posts/test-post-no-tree.md
  git commit -m "test: add post without tag_tree to verify edge case"
  ```

---

### Task 5: Verify the build

**Files:** (no file changes)

- [ ] **Step 1: Run hexo generate and check output**

  ```bash
  cd site && npx hexo generate 2>&1
  ```
  Expected: No errors. The generated `public/tags/index.html` should show the tree with `Grammar > Tenses > Present Perfect` and `Grammar > Vocabulary > Change Words`. The post "A Post Without Tree" should NOT appear in the tree.

- [ ] **Step 2: Check tag pages still work**

  Verify that `public/tags/Present-Perfect/index.html` and `public/tags/Change-Words/index.html` exist and are valid:
  ```bash
  ls public/tags/*/index.html
  ```
  Expected: Tag pages exist for the flat tag names.

- [ ] **Step 3: Start dev server and visually verify (optional)**

  ```bash
  cd site && npx hexo server
  ```
  Open `http://localhost:4000/tags/` and confirm:
  - Tree renders with correct hierarchy
  - Post links appear only at leaf nodes
  - "A Post Without Tree" does not appear
  - Expand/collapse works
