// WiseWear — витрина. Только прогрессивные улучшения: без JS сайт
// остаётся читаемым и рабочим, скрипт добавляет лишь анимации и меню.

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Мобильное меню ────────────────────────────────────
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
    });

    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        burger.focus();
      }
    });
  }

  // ── Тень шапки при скролле ────────────────────────────
  var header = document.getElementById('header');

  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ── Появление блоков при скролле ──────────────────────
  var items = document.querySelectorAll('.reveal');

  if (!items.length) return;

  if (reduced || !('IntersectionObserver' in window)) {
    items.forEach(function (el) {
      el.classList.add('is-in');
    });
    return;
  }

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = Number(el.dataset.delay || 0);
        setTimeout(function () {
          el.classList.add('is-in');
        }, delay);
        io.unobserve(el);
      });
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
  );

  // Лёгкий каскад внутри сеток — элементы внутри одной сетки появляются по очереди.
  var grids = document.querySelectorAll('.features, .showcase, .steps');
  grids.forEach(function (grid) {
    Array.prototype.forEach.call(grid.children, function (child, i) {
      if (child.classList.contains('reveal')) child.dataset.delay = String(i * 90);
    });
  });

  items.forEach(function (el) {
    io.observe(el);
  });
})();
