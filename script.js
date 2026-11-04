/* AIRES — menu, section highlight, and one-shot motion. No dependencies. */
(function () {
  'use strict';

  var root = document.documentElement;
  var nav = document.getElementById('site-nav');
  var btn = document.querySelector('.menu-btn');
  if (!nav || !btn) return;

  var links = nav.querySelectorAll('a[href^="#"]:not(.btn)');
  var desktop = window.matchMedia('(min-width: 1024px)');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  function trapItems() {
    var items = [btn];
    nav.querySelectorAll('a').forEach(function (a) { items.push(a); });
    return items;
  }

  function setOpen(open) {
    root.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) {
      var first = nav.querySelector('a');
      if (first) first.focus();
    }
  }

  btn.addEventListener('click', function () {
    setOpen(!root.classList.contains('menu-open'));
  });

  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', function (e) {
    if (!root.classList.contains('menu-open') || desktop.matches) return;
    if (e.key === 'Escape') {
      setOpen(false);
      btn.focus();
      return;
    }
    if (e.key !== 'Tab') return;
    var items = trapItems();
    var first = items[0];
    var last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  document.addEventListener('click', function (e) {
    if (!root.classList.contains('menu-open')) return;
    if (e.target.closest('.site-header')) return;
    setOpen(false);
    btn.focus();
  });

  desktop.addEventListener('change', function (m) {
    if (m.matches) setOpen(false);
  });

  var sections = [];
  links.forEach(function (a) {
    var section = document.getElementById(a.getAttribute('href').slice(1));
    if (section) sections.push(section);
  });

  function setCurrent(id) {
    links.forEach(function (a) {
      if (id && a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }

  var hero = document.getElementById('top');
  if ('IntersectionObserver' in window && sections.length) {
    var ratios = new Map();
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
      });
      var best = null;
      var bestRatio = 0;
      sections.forEach(function (section) {
        var ratio = ratios.get(section.id) || 0;
        if (ratio > bestRatio) {
          bestRatio = ratio;
          best = section.id;
        }
      });
      var heroRatio = ratios.get('top') || 0;
      if (heroRatio > bestRatio) setCurrent(null);
      else if (best) setCurrent(best);
    }, { rootMargin: '-18% 0px -50% 0px', threshold: [0, 0.2, 0.45, 0.7, 1] });
    if (hero) spy.observe(hero);
    sections.forEach(function (section) { spy.observe(section); });
  }

  document.addEventListener('animationend', function (e) {
    if (e.target && e.target.style) e.target.style.willChange = 'auto';
    var node = e.target;
    if (node && node.classList && (node.classList.contains('member') || node.classList.contains('panel') || node.classList.contains('cta') || node.classList.contains('step-icon'))) {
      node.classList.add('settled');
    }
  });

  var targets = document.querySelectorAll('.member, .panel, .steps li, #contact');

  function revealAll() {
    targets.forEach(function (el) { el.classList.add('is-in'); });
  }

  function partlyInView(el) {
    var rect = el.getBoundingClientRect();
    var height = window.innerHeight || document.documentElement.clientHeight;
    var visible = Math.min(rect.bottom, height) - Math.max(rect.top, 0);
    return rect.width > 0 && visible >= Math.min(rect.height, height) * 0.1;
  }

  if (reduce.matches || !('IntersectionObserver' in window)) {
    revealAll();
    return;
  }

  root.classList.add('js-motion');
  var seen = new WeakSet();
  var reveal = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting || seen.has(entry.target)) return;
      seen.add(entry.target);
      entry.target.classList.add('is-in');
      reveal.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

  targets.forEach(function (el) {
    if (partlyInView(el)) {
      seen.add(el);
      el.classList.add('is-in');
    } else {
      reveal.observe(el);
    }
  });

  window.setTimeout(function () {
    revealAll();
    reveal.disconnect();
  }, 1500);
})();
