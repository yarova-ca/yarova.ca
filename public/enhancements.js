/* ============================================================
   Yarova — Shared enhancement layer (vanilla JS)
   - Reveal on scroll (.r-up → .is-in)
   - Number flip ([data-count])
   - Scroll progress rail (data-rail on <section>)
   - Live ticker (window.__YAROVA_TICKER__)
   - Multi-step booking flow (#bookFlow)
   ============================================================ */
(function () {
  'use strict';
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Reveal on scroll --- */
  function initReveal() {
    var nodes = document.querySelectorAll('.r-up');
    if (!('IntersectionObserver' in window) || REDUCED) {
      nodes.forEach(function (n) { n.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    nodes.forEach(function (n) { io.observe(n); });
  }

  /* --- Number flip (count-up odometer) --- */
  function flipNumber(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target)) return;
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    if (REDUCED) { el.textContent = prefix + target.toLocaleString() + suffix; return; }
    var dur = 1400;
    var start = performance.now();
    function tick(now) {
      var p = Math.min(1, (now - start) / dur);
      // ease-out quint
      var ep = 1 - Math.pow(1 - p, 5);
      var val = Math.round(target * ep);
      el.textContent = prefix + val.toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  function initCounts() {
    var nodes = document.querySelectorAll('[data-count]');
    if (!nodes.length) return;
    if (!('IntersectionObserver' in window)) { nodes.forEach(flipNumber); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { flipNumber(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    nodes.forEach(function (n) { io.observe(n); });
  }

  /* --- Scroll progress rail --- */
  function initRail() {
    var sections = document.querySelectorAll('section[data-rail]');
    if (sections.length < 3) return;
    var rail = document.createElement('div');
    rail.className = 'rail';
    rail.setAttribute('aria-label', 'Section progress');
    sections.forEach(function (s, i) {
      var label = s.getAttribute('data-rail');
      var id = s.id || ('section-' + i);
      if (!s.id) s.id = id;
      var dot = document.createElement('a');
      dot.href = '#' + id;
      dot.className = 'dot';
      dot.innerHTML = '<span class="label">' + label + '</span><span class="glyph"></span>';
      rail.appendChild(dot);
    });
    document.body.appendChild(rail);
    var dots = rail.querySelectorAll('.dot');
    function onScroll() {
      var midline = window.scrollY + window.innerHeight * 0.4;
      var active = 0;
      sections.forEach(function (s, i) {
        if (s.offsetTop <= midline) active = i;
      });
      dots.forEach(function (d, i) { d.classList.toggle('on', i === active); });
    }
    onScroll();
    var raf = null;
    window.addEventListener('scroll', function () {
      if (raf) return;
      raf = requestAnimationFrame(function () { onScroll(); raf = null; });
    }, { passive: true });
  }

  /* --- Live activity ticker --- */
  function initTicker() {
    var items = window.__YAROVA_TICKER__;
    if (!items || !items.length) return;
    if (sessionStorage.getItem('yarova-ticker-dismissed')) return;
    var el = document.createElement('div');
    el.className = 'ticker';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    el.innerHTML = '<button class="x" aria-label="Dismiss">×</button>' +
      '<div class="head"><span class="live">Live activity</span><span class="when"></span></div>' +
      '<div class="msg"></div>';
    document.body.appendChild(el);
    var msg = el.querySelector('.msg');
    var when = el.querySelector('.when');
    var idx = 0;
    function show(i) {
      msg.innerHTML = items[i].msg;
      when.textContent = items[i].when;
      el.classList.add('show');
    }
    function hide() { el.classList.remove('show'); }
    function cycle() {
      show(idx);
      setTimeout(hide, 6500);
      idx = (idx + 1) % items.length;
      setTimeout(cycle, 12000);
    }
    el.querySelector('.x').addEventListener('click', function () {
      sessionStorage.setItem('yarova-ticker-dismissed', '1');
      el.remove();
    });
    setTimeout(cycle, 4200);
  }

  /* --- Multi-step booking form --- */
  function initStepForm() {
    var form = document.getElementById('bookFlow');
    if (!form) return;
    var steps = form.querySelectorAll('.step');
    var segs = form.querySelectorAll('.seg');
    var answers = {};
    var keys = [];
    var current = 0;
    steps.forEach(function (s, i) {
      if (s.dataset.key) keys[i] = s.dataset.key;
    });
    function paintBar() {
      segs.forEach(function (seg, i) {
        seg.classList.toggle('done', i < current);
        seg.classList.toggle('cur', i === current);
      });
    }
    function go(to) {
      if (to < 0 || to >= steps.length) return;
      steps[current].classList.remove('on');
      current = to;
      steps[current].classList.add('on');
      paintBar();
      if (steps[current].classList.contains('final')) renderSummary();
      window.scrollTo({ top: form.getBoundingClientRect().top + window.scrollY - 80, behavior: REDUCED ? 'auto' : 'smooth' });
    }
    function renderSummary() {
      var sum = form.querySelector('.summary');
      if (!sum) return;
      sum.innerHTML = '';
      keys.forEach(function (k, i) {
        if (!answers[i]) return;
        var row = document.createElement('div');
        row.className = 'line';
        row.innerHTML = '<span class="k">' + k + '</span><span class="v">' + answers[i] + '</span>';
        sum.appendChild(row);
      });
    }
    form.querySelectorAll('.opt').forEach(function (opt) {
      opt.addEventListener('click', function () {
        var step = opt.closest('.step');
        var idx = Array.prototype.indexOf.call(steps, step);
        step.querySelectorAll('.opt').forEach(function (o) { o.classList.remove('on'); });
        opt.classList.add('on');
        answers[idx] = opt.getAttribute('data-value') || opt.textContent.trim();
        setTimeout(function () { go(idx + 1); }, 220);
      });
    });
    form.querySelectorAll('.back').forEach(function (b) {
      b.addEventListener('click', function () { go(Math.max(0, current - 1)); });
    });
    paintBar();
  }

  /* --- Smooth-scroll for in-page anchors that aren't otherwise handled --- */
  function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top: top, behavior: REDUCED ? 'auto' : 'smooth' });
        history.pushState(null, '', id);
      });
    });
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(function () {
    initReveal();
    initCounts();
    initRail();
    initTicker();
    initStepForm();
    initAnchors();
  });
})();
