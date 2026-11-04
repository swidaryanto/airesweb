/* AIRES — mobile navigation and section highlight. No dependencies. */
(function () {
  'use strict';

  var root = document.documentElement;
  var nav = document.getElementById('site-nav');
  var btn = document.querySelector('.menu-btn');
  if (!nav || !btn) return;

  var links = nav.querySelectorAll('a[href^="#"]:not(.btn)');

  function setOpen(open) {
    root.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  btn.addEventListener('click', function () {
    setOpen(!root.classList.contains('menu-open'));
  });

  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && root.classList.contains('menu-open')) {
      setOpen(false);
      btn.focus();
    }
  });

  document.addEventListener('click', function (e) {
    if (!root.classList.contains('menu-open')) return;
    if (e.target.closest('.site-header')) return;
    setOpen(false);
  });

  window.matchMedia('(min-width: 900px)').addEventListener('change', function (m) {
    if (m.matches) setOpen(false);
  });

  var sections = [];
  links.forEach(function (a) {
    var id = a.getAttribute('href').slice(1);
    var section = document.getElementById(id);
    if (section) sections.push(section);
  });

  function setCurrent(id) {
    links.forEach(function (a) {
      if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }

  if ('IntersectionObserver' in window && sections.length) {
    var ratios = new Map();
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
      });
      var best = null;
      var bestRatio = 0;
      ratios.forEach(function (ratio, id) {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          best = id;
        }
      });
      setCurrent(best || 'who');
    }, { rootMargin: '-18% 0px -50% 0px', threshold: [0, 0.2, 0.45, 0.7, 1] });
    sections.forEach(function (section) { observer.observe(section); });
  }
})();
