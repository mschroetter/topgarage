/* ─────────────────────────────────────────
   TOP GARAGE — Shared Utilities
   Used by: marquee.js, carousel.js
   ───────────────────────────────────────── */

/* global namespace */
window.TAD = window.TAD || {};

TAD.MOBILE_BREAKPOINT = 768;

TAD.isMobile = function () {
  return window.matchMedia('(max-width: ' + TAD.MOBILE_BREAKPOINT + 'px)').matches;
};

TAD.debounce = function (fn, delay) {
  var timer;
  return function () {
    var args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () { fn.apply(null, args); }, delay);
  };
};
