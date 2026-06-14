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
