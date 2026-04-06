/* ─────────────────────────────────────────
   TOP GARAGE — Visual Effects
   ─ Hero entrance (typewriter + stagger)
   ─ Hero parallax
   ───────────────────────────────────────── */

(function () {
  'use strict';

  // ─────────────────────────────────────────
  // 1. HERO ENTRANCE
  //    - Eyebrow:  fade-up bei 100ms
  //    - Headline: Typewriter startet bei 350ms
  //    - Subline:  fade-up nach Typewriter + 200ms
  //    - CTAs:     fade-up nach Subline + 150ms
  // ─────────────────────────────────────────
  function initHeroEntrance() {
    const hero     = document.querySelector('#hero');
    const title    = hero?.querySelector('.hero-title');
    const eyebrow  = hero?.querySelector('.hero-eyebrow');
    const subtitle = hero?.querySelector('.hero-subtitle');
    const actions  = hero?.querySelector('.hero-actions');

    if (!hero || !title) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Initial: Eyebrow, Subline, CTAs verstecken
    [eyebrow, subtitle, actions].forEach(el => {
      if (!el) return;
      el.style.opacity   = '0';
      el.style.transform = 'translateY(24px)';
    });

    // Hilfsfunktion: sanftes Einblenden
    function fadeIn(el, delay) {
      if (!el) return;
      setTimeout(() => {
        el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        el.style.opacity    = '1';
        el.style.transform  = 'translateY(0)';
      }, delay);
    }

    // prefers-reduced-motion: alles sofort sichtbar, kein Effekt
    if (reduced) {
      [eyebrow, title, subtitle, actions].forEach(el => {
        if (!el) return;
        el.style.opacity   = '1';
        el.style.transform = 'none';
      });
      return;
    }

    // Text merken, dann leeren
    // data-i18n temporär entfernen, damit setLanguage (aus components.js)
    // den Titel nicht während des Tippens überschreibt.
    const text       = title.textContent.trim();
    const i18nKey    = title.getAttribute('data-i18n');
    title.removeAttribute('data-i18n');
    title.textContent = '';
    title.style.opacity = '1'; // sichtbar aber leer

    // Cursor einfügen
    const cursor = document.createElement('span');
    cursor.className   = 'hero-cursor';
    cursor.textContent = '|';
    title.appendChild(cursor);

    // Eyebrow einblenden
    fadeIn(eyebrow, 100);

    // Safety fallback: falls Animation stockt alles nach 4s sichtbar machen
    const safetyTimer = setTimeout(() => {
      [eyebrow, title, subtitle, actions].forEach(el => {
        if (!el) return;
        el.style.transition = 'opacity 0.5s ease';
        el.style.opacity    = '1';
        el.style.transform  = 'translateY(0)';
      });
      if (i18nKey) title.setAttribute('data-i18n', i18nKey);
    }, 4000);

    // Typewriter startet nach 350ms
    let i = 0;
    const speed = 45; // ms pro Zeichen

    setTimeout(() => {
      const interval = setInterval(() => {
        title.insertBefore(document.createTextNode(text[i]), cursor);
        i++;

        if (i >= text.length) {
          clearInterval(interval);
          clearTimeout(safetyTimer);
          // Cursor kurz stehen lassen, dann entfernen
          setTimeout(() => {
            cursor.remove();
            // data-i18n wiederherstellen (für spätere Sprachänderungen)
            if (i18nKey) title.setAttribute('data-i18n', i18nKey);
            // Subline + CTAs einblenden
            fadeIn(subtitle, 200);
            fadeIn(actions,  350);
          }, 500);
        }
      }, speed);
    }, 350);
  }

  // ─────────────────────────────────────────
  // 2. SUBTLE HERO PARALLAX
  // ─────────────────────────────────────────
  function initParallax() {
    const heroBg = document.querySelector('.hero-bg');
    if (!heroBg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          heroBg.style.transform = `translateY(${window.scrollY * 0.35}px)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ─────────────────────────────────────────
  // INIT
  // ─────────────────────────────────────────
  function init() {
    initHeroEntrance();
    initParallax();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
