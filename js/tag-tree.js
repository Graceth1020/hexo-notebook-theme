(function() {
  'use strict';

  /**
   * 将 tag_tree front-matter 条目转换为树形结构
   * @param {Array} treeEntries - [{tree: "Grammar/Tenses/Present Perfect", posts: [...]}]
   * @returns {Object} 树根节点
   */
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
        // 文章仅挂载到叶子节点（最后一段）
        if (i === parts.length - 1) {
          node.posts = entry.posts;
        }
      });
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
      // 有子节点 → 可展开/收起（文件夹节点，也可能自身挂有文章）
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

      // 如果该节点自身也有文章，优先渲染（作为该分类下的直接文章）
      if (hasPosts) {
        node.posts.forEach(function(post) {
          var postLi = document.createElement('li');
          postLi.className = 'tag-tree-post-item';
          var postLink = document.createElement('a');
          postLink.className = 'tag-tree-post-link';
          postLink.href = post.path;
          postLink.textContent = post.title;
          postLi.appendChild(postLink);
          // 显示文章日期
          if (post.date) {
            var postDate = document.createElement('span');
            postDate.className = 'tag-tree-post-date';
            var d = new Date(post.date);
            var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            postDate.textContent = months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
            postLi.appendChild(postDate);
          }
          childrenContainer.appendChild(postLi);
        });
      }

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
        postLi.className = 'tag-tree-post-item';
        var postLink = document.createElement('a');
        postLink.className = 'tag-tree-post-link';
        postLink.href = post.path;
        postLink.textContent = post.title;
        postLi.appendChild(postLink);
        // 显示文章日期
        if (post.date) {
          var postDate = document.createElement('span');
          postDate.className = 'tag-tree-post-date';
          var date = new Date(post.date);
          var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
          postDate.textContent = months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
          postLi.appendChild(postDate);
        }
        postsContainer.appendChild(postLi);
      });
      li.appendChild(postsContainer);
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
