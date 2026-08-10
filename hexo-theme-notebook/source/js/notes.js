/* Language note cards: grouped by type, searchable. Vanilla JS, no dependencies. */
(function () {
  var app = document.getElementById('notesApp');
  if (!app || typeof NOTES_DATA === 'undefined') return;

  var data = NOTES_DATA || [];
  var state = { q: '', type: 'ALL' };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function label(t) {
    return t.charAt(0).toUpperCase() + t.slice(1);
  }

  function sortKey(n) {
    return (n.date || '').replace(/-/g, '') + (n.time || '').replace(/:/g, '');
  }

  function card(n) {
    var f = n.fields || {};
    var title = f.Word || f.Input || f.Original || f.Sentence || f['Sentence 1'] || n.type + ' note';
    var rows = Object.keys(f).filter(function (k) { return k !== title; }).map(function (k) {
      return '<div class="note-field"><span class="note-field-key">' + esc(k) + '</span>' +
        '<span class="note-field-value">' + esc(f[k]) + '</span></div>';
    }).join('');
    var examples = (n.examples && n.examples.length)
      ? '<ul class="note-examples">' + n.examples.map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('') + '</ul>'
      : '';
    return '<article class="note-card">' +
      '<header class="note-card-head">' +
      '<span class="tag-badge note-type">' + esc(label(n.type)) + '</span>' +
      '<h3 class="note-card-title">' + esc(title) + '</h3>' +
      '<time class="note-card-date">' + esc(n.date) + (n.time ? ' ' + esc(n.time) : '') + '</time>' +
      '</header>' +
      '<div class="note-card-body">' + rows + examples + '</div>' +
      '</article>';
  }

  function matches(n) {
    if (state.type !== 'ALL' && n.type !== state.type) return false;
    if (!state.q) return true;
    return JSON.stringify(n).toLowerCase().indexOf(state.q.toLowerCase()) !== -1;
  }

  function render() {
    var filtered = data.filter(matches);
    var types = data.reduce(function (acc, n) {
      if (acc.indexOf(n.type) === -1) acc.push(n.type);
      return acc;
    }, []).sort();

    var chips = ['ALL'].concat(types).map(function (t) {
      var count = t === 'ALL' ? data.length : data.filter(function (n) { return n.type === t; }).length;
      return '<button type="button" class="filter-chip' + (state.type === t ? ' is-active' : '') + '" data-type="' + t + '">' +
        esc(label(t)) + ' <span class="filter-count">' + count + '</span></button>';
    }).join('');

    var groups = types.filter(function (t) {
      return filtered.some(function (n) { return n.type === t; });
    }).map(function (t) {
      var items = filtered.filter(function (n) { return n.type === t; })
        .sort(function (a, b) { return sortKey(b).localeCompare(sortKey(a)); });
      return '<section class="note-group"><h2 class="note-group-title">' + esc(label(t)) +
        ' <span class="note-group-count">' + items.length + '</span></h2>' +
        '<div class="note-cards">' + items.map(card).join('') + '</div></section>';
    }).join('');

    app.innerHTML =
      '<div class="corpus-toolbar">' +
      '<input type="search" id="notesSearch" class="corpus-search" placeholder="Search words, definitions, examples..." value="' + esc(state.q) + '">' +
      '<div class="filter-chips">' + chips + '</div>' +
      '</div>' +
      '<p class="corpus-count">' + filtered.length + ' of ' + data.length + ' entries</p>' +
      (groups || '<p class="notes-empty">No notes match.</p>');

    app.querySelectorAll('.filter-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        state.type = chip.getAttribute('data-type');
        render();
      });
    });
    var input = document.getElementById('notesSearch');
    input.addEventListener('input', function () {
      state.q = input.value;
      render();
      var next = document.getElementById('notesSearch');
      if (next && document.activeElement !== next) {
        next.focus();
        try { next.setSelectionRange(next.value.length, next.value.length); } catch (e) {}
      }
    });
  }

  render();
})();
