(function() {
  'use strict';

  var hamburger = document.getElementById('hamburgerBtn');
  var overlay = document.getElementById('mobileNavOverlay');
  var closeBtn = document.getElementById('mobileNavClose');

  if (!hamburger || !overlay) return;

  function openNav() {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openNav);

  if (closeBtn) {
    closeBtn.addEventListener('click', closeNav);
  }

  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) {
      closeNav();
    }
  });

  // ESC 键关闭
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeNav();
    }
  });
})();
