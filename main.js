/* Franciscan Charities — interactions
   Scroll reveal · animated stat count-up · mobile nav · footer year */

(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav ---------- */
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  if (toggle && header) {
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    header.querySelectorAll(".mobile-nav a").forEach(function (link) {
      link.addEventListener("click", function () {
        header.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  /* ---------- Number formatting ---------- */
  function formatNum(n) {
    return n.toLocaleString("en-US");
  }

  /* ---------- Count-up ---------- */
  function countUp(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    if (prefersReduced) {
      el.textContent = formatNum(target) + suffix;
      return;
    }
    var duration = 1600;
    var start = null;

    function ease(t) { return 1 - Math.pow(1 - t, 3); } // easeOutCubic

    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var val = Math.floor(ease(p) * target);
      el.textContent = formatNum(val) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = formatNum(target) + suffix;
    }
    requestAnimationFrame(step);
  }

  /* ---------- Reveal on scroll + trigger count-up ---------- */
  var revealEls = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
    document.querySelectorAll(".stat-num").forEach(countUp);
    return;
  }

  var io = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");

      var nums = entry.target.querySelectorAll(".stat-num");
      nums.forEach(function (n) {
        if (!n.dataset.done) { n.dataset.done = "1"; countUp(n); }
      });

      obs.unobserve(entry.target);
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });

  revealEls.forEach(function (el) { io.observe(el); });
})();
