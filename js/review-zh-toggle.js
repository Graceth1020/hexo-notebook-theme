/* Summary review cards: per-card toggle for the Chinese fields. Vanilla JS, no dependencies. */
(function () {
  var btns = document.querySelectorAll('[data-card-zh]');
  Array.prototype.forEach.call(btns, function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.review-card');
      if (!card) return;
      var show = card.classList.toggle('show-zh');
      btn.classList.toggle('is-on', show);
      btn.textContent = show ? 'Hide 中文' : 'Show 中文';
    });
  });
})();
