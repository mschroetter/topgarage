/* ─────────────────────────────────────────
   TONAL ACOUSTIC DUO — Component Loader
   Loads shared navbar & footer via fetch(),
   sets active nav link, then initialises
   navbar interactions and translations.
   ───────────────────────────────────────── */

async function loadComponents() {
  try {
    const [navRes, footRes] = await Promise.all([
      fetch('components/navbar.html'),
      fetch('components/footer.html')
    ]);

    if (!navRes.ok || !footRes.ok) throw new Error('Component fetch failed');

    const [navHTML, footHTML] = await Promise.all([
      navRes.text(),
      footRes.text()
    ]);

    const navPlaceholder  = document.getElementById('navbar-placeholder');
    const footPlaceholder = document.getElementById('footer-placeholder');

    if (navPlaceholder)  navPlaceholder.innerHTML  = navHTML;
    if (footPlaceholder) footPlaceholder.innerHTML = footHTML;

  } catch (err) {
    console.warn('components.js: could not load navbar/footer via fetch().', err);
    console.warn('Serving via a local HTTP server (e.g. "npx serve .") is required.');
    return;
  }

  // ── Set active nav link via data-page attribute (robust, no URL parsing)
  const currentPage = document.body.dataset.page;
  if (currentPage) {
    document.querySelectorAll(
      '.navbar__desktop-links a, .navbar__menu a'
    ).forEach(a => {
      if (a.getAttribute('href') === currentPage) a.classList.add('active');
    });
  }

  // ── Logo + Start link → navigate to root ('/'), reload if already there
  document.querySelectorAll(
    '.navbar__logo, .navbar__desktop-links a[href="index.html"], .navbar__menu a[href="index.html"]'
  ).forEach(el => el.addEventListener('click', e => {
    e.preventDefault();
    if (location.pathname === '/' || location.pathname === '/index.html') {
      location.reload();
    } else {
      window.location.href = '/';
    }
  }));

  // ── Initialise navbar interactions (burger menu, lang buttons)
  if (typeof initNavbar === 'function') initNavbar();

  // ── Apply current language to newly injected navbar/footer elements
  if (typeof setLanguage === 'function' && typeof currentLang !== 'undefined') {
    setLanguage(currentLang);
  }

  // ── Initialise Lucide icons inside navbar and footer
  if (typeof lucide !== 'undefined') lucide.createIcons();

  // ── Fit footer brand text to container width
  if (typeof fitFooterBrand === 'function') fitFooterBrand();
}

document.addEventListener('DOMContentLoaded', loadComponents);
