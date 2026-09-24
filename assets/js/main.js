(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  var header = document.getElementById('header');
  var mobileQuery = window.matchMedia('(max-width: 760px)');

  function setMenuState(open) {
    var mobile = mobileQuery.matches;
    nav.classList.toggle('is-open', open && mobile);
    burger.setAttribute('aria-expanded', String(open && mobile));
    burger.setAttribute('aria-label', open && mobile ? 'Закрыть меню' : 'Открыть меню');

    if (mobile) {
      nav.setAttribute('aria-hidden', String(!open));
      nav.toggleAttribute('inert', !open);
    } else {
      nav.removeAttribute('aria-hidden');
      nav.removeAttribute('inert');
    }
  }

  if (burger && nav) {
    setMenuState(false);

    burger.addEventListener('click', function () {
      setMenuState(burger.getAttribute('aria-expanded') !== 'true');
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenuState(false);
    });

    document.addEventListener('click', function (event) {
      if (mobileQuery.matches && burger.getAttribute('aria-expanded') === 'true' && !header.contains(event.target)) {
        setMenuState(false);
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
        setMenuState(false);
        burger.focus();
      }
    });

    var onViewportChange = function () {
      setMenuState(false);
    };

    if (typeof mobileQuery.addEventListener === 'function') {
      mobileQuery.addEventListener('change', onViewportChange);
    } else {
      mobileQuery.addListener(onViewportChange);
    }
  }

  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  var items = document.querySelectorAll('.reveal');

  if (!items.length) return;

  if (reduced || !('IntersectionObserver' in window)) {
    items.forEach(function (element) {
      element.classList.add('is-in');
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var element = entry.target;
        var delay = Number(element.dataset.delay || 0);
        window.setTimeout(function () {
          element.classList.add('is-in');
        }, delay);
        observer.unobserve(element);
      });
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
  );

  var grids = document.querySelectorAll('.features, .showcase, .steps');
  grids.forEach(function (grid) {
    Array.prototype.forEach.call(grid.children, function (child, index) {
      if (child.classList.contains('reveal')) child.dataset.delay = String(index * 90);
    });
  });

  items.forEach(function (element) {
    observer.observe(element);
  });
})();
