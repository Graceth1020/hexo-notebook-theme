(function() {
  'use strict';

  // 1. Extract language name → data-lang attribute for title bar
  // 2. Add copy button
  var figures = document.querySelectorAll('figure.highlight');
  if (!figures.length) return;

  var langNames = {
    javascript: 'JavaScript',   js: 'JavaScript',
    python: 'Python',           py: 'Python',
    css: 'CSS',
    html: 'HTML',
    bash: 'Bash',               sh: 'Bash',      shell: 'Bash',
    json: 'JSON',
    markdown: 'Markdown',       md: 'Markdown',
    yaml: 'YAML',               yml: 'YAML',
    typescript: 'TypeScript',   ts: 'TypeScript',
    jsx: 'JSX',                 tsx: 'TSX',
    ruby: 'Ruby',               rb: 'Ruby',
    php: 'PHP',
    rust: 'Rust',               rs: 'Rust',
    go: 'Go',
    sql: 'SQL',
    xml: 'XML',
    c: 'C',                     cpp: 'C++',       cs: 'C#',
    swift: 'Swift',
    kotlin: 'Kotlin',           kt: 'Kotlin',
    scala: 'Scala',
    dart: 'Dart',
    docker: 'Docker',           dockerfile: 'Dockerfile',
    diff: 'Diff',
    text: 'Text',               plain: 'Text',    plaintext: 'Text'
  };

  // Wrap tables in responsive container for horizontal scroll
  var tables = document.querySelectorAll('.post-body > table');
  tables.forEach(function(table) {
    var wrapper = document.createElement('div');
    wrapper.className = 'table-wrap';
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
  });

  figures.forEach(function(fig) {
    // Extract language from className
    var classes = fig.className.split(/\s+/);
    var lang = '';
    for (var i = 0; i < classes.length; i++) {
      if (classes[i] !== 'highlight' && classes[i] !== 'hljs') {
        lang = classes[i];
        break;
      }
    }

    // Build display name
    var displayName = langNames[lang] || lang.charAt(0).toUpperCase() + lang.slice(1);

    // Create title bar
    var bar = document.createElement('div');
    bar.className = 'highlight-bar';

    var label = document.createElement('span');
    label.className = 'highlight-lang';
    label.textContent = displayName;
    bar.appendChild(label);

    var copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.textContent = 'Copy';
    copyBtn.setAttribute('aria-label', 'Copy code to clipboard');
    bar.appendChild(copyBtn);

    fig.insertBefore(bar, fig.firstChild);

    // Copy functionality
    copyBtn.addEventListener('click', function() {
      var code = fig.querySelector('.code pre') || fig.querySelector('pre');
      var text = code ? code.textContent : '';
      text = text.replace(/\n+$/, '');

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function() {
          copyBtn.textContent = 'Copied!';
          setTimeout(function() { copyBtn.textContent = 'Copy'; }, 2000);
        }).catch(function() { fallbackCopy(text, copyBtn); });
      } else {
        fallbackCopy(text, copyBtn);
      }
    });
  });

  function fallbackCopy(text, btn) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      btn.textContent = 'Copied!';
      setTimeout(function() { btn.textContent = 'Copy'; }, 2000);
    } catch (e) {
      btn.textContent = 'Failed';
    }
    document.body.removeChild(ta);
  }
})();
