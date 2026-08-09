/* Corpus browser: difficulty filter + search + optional Chinese. Vanilla JS, no dependencies. */
(function () {
  var app = document.getElementById('corpusApp');
  if (!app || typeof CORPUS_DATA === 'undefined') return;

  var data = CORPUS_DATA || [];
  var state = { q: '', tag: 'ALL', showZh: true, zhOverride: {} };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function badge(tag) {
    var label = { E: 'Easy', M: 'Medium', H: 'Hard' }[tag] || tag;
    return '<span class="tag-badge tag-' + tag + '">' + label + '</span>';
  }

  function effectiveZh(s) {
    return Object.prototype.hasOwnProperty.call(state.zhOverride, s.n)
      ? state.zhOverride[s.n]
      : state.showZh;
  }

  function matches(s) {
    if (state.tag !== 'ALL' && s.tag !== state.tag) return false;
    if (!state.q) return true;
    var q = state.q.toLowerCase();
    return (s.text + ' ' + (s.zh || '')).toLowerCase().indexOf(q) !== -1;
  }

  function zhRowButton(s) {
    var on = effectiveZh(s);
    return '<button type="button" class="corpus-zh-toggle' + (on ? ' is-on' : '') +
      '" data-n="' + s.n + '" title="Toggle Chinese translation">ZH</button>';
  }

  function render() {
    var filtered = data.filter(matches);
    var chips = ['ALL', 'E', 'M', 'H'].map(function (t) {
      var count = t === 'ALL' ? data.length : data.filter(function (s) { return s.tag === t; }).length;
      return '<button type="button" class="filter-chip' + (state.tag === t ? ' is-active' : '') + '" data-tag="' + t + '">' +
        t + ' <span class="filter-count">' + count + '</span></button>';
    }).join('');

    var list = filtered.map(function (s) {
      return '<div class="corpus-item">' +
        '<span class="corpus-num">' + s.n + '.</span>' +
        badge(s.tag) +
        '<div class="corpus-main">' +
        '<p class="corpus-text">' + esc(s.text) + '</p>' +
        (s.zh && effectiveZh(s) ? '<p class="corpus-zh">' + esc(s.zh) + '</p>' : '') +
        '</div>' +
        zhRowButton(s) +
        '</div>';
    }).join('');

    app.innerHTML =
      '<div class="corpus-toolbar">' +
      '<div class="corpus-toolbar-row">' +
      '<input type="search" id="corpusSearch" class="corpus-search" placeholder="Search sentences or Chinese translation..." value="' + esc(state.q) + '">' +
      '<button type="button" id="zhGlobal" class="zh-toggle' + (state.showZh ? ' is-active' : '') + '" title="Show or hide all Chinese translations">' +
      (state.showZh ? 'Hide Chinese' : 'Show Chinese') + '</button>' +
      '</div>' +
      '<div class="filter-chips">' + chips + '</div>' +
      '</div>' +
      '<p class="corpus-count">' + filtered.length + ' of ' + data.length + ' sentences</p>' +
      (list ? '<div class="corpus-list">' + list + '</div>' : '<p class="corpus-empty">No sentences match.</p>');

    app.querySelectorAll('.filter-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        state.tag = chip.getAttribute('data-tag');
        render();
      });
    });
    var input = document.getElementById('corpusSearch');
    input.addEventListener('input', function () { state.q = input.value; render(); });
    var zhGlobal = document.getElementById('zhGlobal');
    zhGlobal.addEventListener('click', function () {
      state.showZh = !state.showZh;
      state.zhOverride = {};
      render();
    });
    app.querySelectorAll('.corpus-zh-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var n = +btn.getAttribute('data-n');
        state.zhOverride[n] = !effectiveZh({ n: n });
        render();
      });
    });
  }

  render();
})();
