/* Rephrase hub: folder trees for corpus, days, and summaries. Vanilla JS, no dependencies. */
(function () {
  var root = document.getElementById('rephraseTrees');
  if (!root || typeof REPHRASE_TREES === 'undefined') return;

  var data = REPHRASE_TREES || {};
  var EXPAND_LEVEL = 2;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function leafCount(nodes) {
    return (nodes || []).reduce(function (n, node) {
      return n + (node.children ? leafCount(node.children) : 1);
    }, 0);
  }

  function renderNodes(nodes, depth) {
    if (!nodes || !nodes.length) return '';
    return nodes.map(function (node) {
      if (node.children) {
        var expanded = depth < EXPAND_LEVEL;
        return '<li class="tree-item tree-folder">' +
          '<span class="tree-label tree-folder-label' + (expanded ? ' is-open' : '') + '">' +
          '<span class="tree-arrow">&#9656;</span>' +
          '<span class="tree-name">' + esc(node.name) + '</span>' +
          '<span class="tree-count">' + leafCount(node.children) + '</span></span>' +
          '<ul class="tree-children' + (expanded ? ' expanded' : '') + '">' +
          renderNodes(node.children, depth + 1) +
          '</ul></li>';
      }
      var meta = node.count != null
        ? '<span class="tree-count">' + node.count + '</span>'
        : (node.date ? '<span class="tree-date">' + esc(node.date) + '</span>' : '');
      return '<li class="tree-item tree-leaf">' +
        '<a class="tree-link" href="' + esc(node.url || '#') + '">' + esc(node.name) + '</a>' + meta +
        '</li>';
    }).join('');
  }

  function render() {
    var titles = { corpus: 'Corpus', days: 'Days', summaries: 'Summaries' };
    var sections = Object.keys(titles).filter(function (k) {
      return data[k] && data[k].length;
    }).map(function (k) {
      return '<section class="rephrase-section">' +
        '<h2 class="rephrase-section-title">' + titles[k] +
        ' <span class="tree-count">' + leafCount(data[k]) + '</span></h2>' +
        '<ul class="tree-children expanded tree-root">' + renderNodes(data[k], 0) + '</ul>' +
        '</section>';
    }).join('');

    root.innerHTML = sections || '<p class="notes-empty">No rephrase content yet.</p>';

    root.querySelectorAll('.tree-folder-label').forEach(function (label) {
      label.addEventListener('click', function () {
        var children = label.parentNode.querySelector('.tree-children');
        if (!children) return;
        var open = children.classList.contains('expanded');
        children.classList.toggle('expanded', !open);
        label.classList.toggle('is-open', !open);
      });
    });
  }

  render();
})();
