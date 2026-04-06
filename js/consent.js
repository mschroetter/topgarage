(function () {
  var KEY = 'tonal_consent';

  function loadFonts() {
    var pc = document.createElement('link');
    pc.rel = 'preconnect';
    pc.href = 'https://fonts.googleapis.com';
    document.head.appendChild(pc);

    var pg = document.createElement('link');
    pg.rel = 'preconnect';
    pg.href = 'https://fonts.gstatic.com';
    pg.crossOrigin = '';
    document.head.appendChild(pg);

    var lk = document.createElement('link');
    lk.rel = 'stylesheet';
    lk.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap';
    document.head.appendChild(lk);
  }

  var consent = localStorage.getItem(KEY);
  if (consent === '1') { loadFonts(); return; }
  if (consent === '0') return;

  document.addEventListener('DOMContentLoaded', function () {
    var el = document.createElement('div');
    el.id = 'consent-banner';
    el.innerHTML =
      '<p>Diese Website lädt Schriften von <strong>Google Fonts</strong>. ' +
      'Dabei wird deine IP-Adresse an Google-Server in den USA übertragen. ' +
      '<a href="datenschutz.html">Mehr erfahren</a></p>' +
      '<div class="consent-actions">' +
      '<button id="consent-decline">Ablehnen</button>' +
      '<button id="consent-accept">Akzeptieren</button>' +
      '</div>';
    document.body.appendChild(el);

    document.getElementById('consent-accept').onclick = function () {
      localStorage.setItem(KEY, '1');
      loadFonts();
      el.remove();
    };
    document.getElementById('consent-decline').onclick = function () {
      localStorage.setItem(KEY, '0');
      el.remove();
    };
  });
})();
