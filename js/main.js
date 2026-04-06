/* ─────────────────────────────────────────
   TOP GARAGE — Main JS
   i18n · Nav · Scroll Reveal
   Translations loaded from js/translations.js
   ───────────────────────────────────────── */

// ─────────────────────────────────────────
// 1. TRANSLATIONS  (see js/translations.js)
// ─────────────────────────────────────────
const translations = window.translations || {};

// ─────────────────────────────────────────
// 2. LANGUAGE SWITCHER
// ─────────────────────────────────────────
function detectLang() {
  const stored = localStorage.getItem('tad_lang');
  if (stored && translations[stored]) return stored;
  const supported = ['de', 'it', 'en'];
  const browser = (navigator.languages || [navigator.language]).map(l => l.slice(0, 2).toLowerCase());
  return browser.find(l => supported.includes(l)) || 'de';
}
let currentLang = detectLang();

function setLanguage(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  document.documentElement.lang = lang;
  localStorage.setItem('tad_lang', lang);

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const val = translations[lang][key];
    if (val !== undefined) el.textContent = val;
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    const val = translations[lang][key];
    if (val !== undefined) el.placeholder = val;
  });

  // Update select options
  document.querySelectorAll('[data-i18n-option]').forEach(el => {
    const key = el.dataset.i18nOption;
    const val = translations[lang][key];
    if (val !== undefined) el.textContent = val;
  });

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.content = translations[lang].meta_description;

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Notify other modules (e.g. marquee)
  window.dispatchEvent(new CustomEvent('tad:langchange', { detail: { lang } }));
}

// ─────────────────────────────────────────
// 3. MOBILE NAVIGATION + LANG BUTTONS
// Called by components.js after navbar/footer are injected
// ─────────────────────────────────────────
function initNavbar() {
  const navbar       = document.getElementById('navbar');
  const navBurger    = document.getElementById('navbar-burger');
  const navMenuLinks = document.querySelectorAll('#navbar-menu a');

  function openNav() {
    navbar && navbar.classList.add('is-open');
    navBurger && navBurger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
  }

  function closeNav() {
    navbar && navbar.classList.remove('is-open');
    navBurger && navBurger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  }

  navBurger && navBurger.addEventListener('click', (e) => {
    e.stopPropagation();
    navbar.classList.contains('is-open') ? closeNav() : openNav();
  });

  navMenuLinks.forEach(a => a.addEventListener('click', closeNav));

  document.addEventListener('click', (e) => {
    if (navbar && !navbar.contains(e.target)) closeNav();
  });

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });

  // Generic scroll-based nav theme — reads data-nav-theme from whichever
  // section is currently behind the navbar (via elementFromPoint).
  if (navbar) {
    function updateNavTheme() {
      const y      = navbar.getBoundingClientRect().bottom + 2;
      const el     = document.elementFromPoint(window.innerWidth / 2, y);
      const themed = el && el.closest('[data-nav-theme]');
      const theme  = themed ? themed.dataset.navTheme : 'dark';
      navbar.classList.toggle('navbar--dark', theme === 'light');
    }
    window.addEventListener('scroll', updateNavTheme, { passive: true });
    updateNavTheme();
  }

  // Hide navbar on scroll down, show on scroll up (after 80px upward)
  let lastScrollY = window.scrollY;
  let scrollUpDistance = 0;
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    if (!navbar) return;
    if (currentScrollY > lastScrollY && currentScrollY > 80) {
      navbar.classList.add('is-hidden');
      if (navbar.classList.contains('is-open')) closeNav();
      scrollUpDistance = 0;
    } else {
      scrollUpDistance += lastScrollY - currentScrollY;
      if (scrollUpDistance >= 80) {
        navbar.classList.remove('is-hidden');
      }
    }
    lastScrollY = currentScrollY;
  }, { passive: true });
}

// ─────────────────────────────────────────
// 4. SMOOTH SCROLL (navbar-offset aware)
// ─────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = navbar ? navbar.offsetHeight : 0;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
  });
});

// ─────────────────────────────────────────
// 6. SCROLL REVEAL (IntersectionObserver)
// ─────────────────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-up, .reveal-scale, .reveal-group').forEach(el => {
  revealObserver.observe(el);
});

// Overscroll prevention handled by Lenis + CSS overscroll-behavior

// ─────────────────────────────────────────
// TEXT SPOTLIGHT — "Let's play." heading
// ─────────────────────────────────────────
const ctaHeading = document.querySelector('.cta-content h2');
if (ctaHeading) {
  // Keep data-text in sync with i18n text
  const syncSpotlightText = () => {
    ctaHeading.dataset.text = ctaHeading.textContent.trim();
  };
  syncSpotlightText();
  window.addEventListener('tad:langchange', syncSpotlightText);

  ctaHeading.addEventListener('mousemove', (e) => {
    const rect = ctaHeading.getBoundingClientRect();
    ctaHeading.style.setProperty('--x', `${e.clientX - rect.left}px`);
    ctaHeading.style.setProperty('--y', `${e.clientY - rect.top}px`);
  });
  ctaHeading.addEventListener('mouseenter', () => ctaHeading.classList.add('is-spotlight'));
  ctaHeading.addEventListener('mouseleave', () => ctaHeading.classList.remove('is-spotlight'));
}

// ─────────────────────────────────────────
// 7. FOOTER BRAND — fit text to container width
// ─────────────────────────────────────────
function fitFooterBrand() {
  const brand = document.querySelector('.footer-brand');
  const span  = brand?.querySelector('span');
  if (!brand || !span) return;

  // Temporarily use inline-block at a known size to measure true text width
  span.style.display  = 'inline-block';
  span.style.fontSize = '100px';
  const textWidth     = span.getBoundingClientRect().width;
  span.style.display  = ''; // restore to CSS value

  const fontSize = brand.offsetWidth / textWidth * 100;
  span.style.fontSize = fontSize + 'px';

  // Height = padding-top (1.5rem) + 75% of text height (bottom crop)
  const paddingTop = parseFloat(getComputedStyle(brand).paddingTop);
  brand.style.height = (paddingTop + fontSize * 0.75) + 'px';
}

window.addEventListener('resize', fitFooterBrand);

// ─────────────────────────────────────────
// 8. CONTACT FORM (Formspree AJAX)
// ─────────────────────────────────────────
const form       = document.querySelector('.contact-form');
const successMsg = document.getElementById('form-success');

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const origText = btn.textContent;
    btn.disabled = true;
    btn.textContent = '…';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        form.reset();
        if (successMsg) {
          successMsg.hidden = false;
          successMsg.textContent = translations[currentLang].form_success;
        }
      } else {
        alert(translations[currentLang].form_error);
      }
    } catch {
      alert(translations[currentLang].form_error);
    } finally {
      btn.disabled = false;
      btn.textContent = origText;
    }
  });
}

// ─────────────────────────────────────────
// 8. LUCIDE ICONS + INIT
// ─────────────────────────────────────────
if (typeof lucide !== 'undefined') lucide.createIcons();

// ─────────────────────────────────────────
// 9. LENIS — Prevent overscroll (all browsers)
// ─────────────────────────────────────────
if (typeof Lenis !== 'undefined') {
  const lenis = new Lenis();
  function lenisRaf(time) {
    lenis.raf(time);
    requestAnimationFrame(lenisRaf);
  }
  requestAnimationFrame(lenisRaf);

  // Lenis pausieren wenn Maus über iframe-Container (AutoScout24)
  const autoscoutContainer = document.querySelector('.autoscout-container');
  if (autoscoutContainer) {
    autoscoutContainer.addEventListener('mouseenter', () => lenis.stop());
    autoscoutContainer.addEventListener('mouseleave', () => lenis.start());
  }
}


setLanguage(currentLang);
