/*
 * Grouped nav items (theme.menu entries whose value is an object).
 *
 * CSS already opens a dropdown on hover, which covers mouse users. This adds
 * the two behaviours CSS cannot express: click/tap to toggle on touch devices
 * where :hover never fires, and keyboard access via the toggle button.
 */
(function () {
  'use strict';

  var groups = Array.prototype.slice.call(document.querySelectorAll('.nav-group'));
  if (!groups.length) return;

  function closeAll(except) {
    groups.forEach(function (g) {
      if (g === except) return;
      g.classList.remove('is-open');
      var t = g.querySelector('.nav-group-toggle');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  }

  groups.forEach(function (group) {
    var toggle = group.querySelector('.nav-group-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var open = group.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      closeAll(group);
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest || !e.target.closest('.nav-group')) closeAll(null);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAll(null);
  });
})();
