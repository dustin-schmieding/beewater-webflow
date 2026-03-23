/**
 * Component: Nav BeeWater
 * Description: Adds bw-scrolled class to nav on scroll (for all pages).
 *              Works alongside hero-beewater-v2 which does the same on the homepage.
 * Dependencies: none (vanilla JS)
 * Webflow Load: site-wide (Footer or Before </body>)
 * CDN URL: https://cdn.jsdelivr.net/gh/[dustin-schmieding]/[beewater-webflow]@main/components/nav-beewater.js
 */

(function () {
  'use strict';

  const THRESHOLD = 400; // px scrolled before bw-scrolled is added

  window.Webflow = window.Webflow || [];
  window.Webflow.push(function () {
    const nav = document.getElementById('bw-nav-min');
    if (!nav) return;

    function updateScrollState() {
      nav.classList.toggle('bw-scrolled', window.scrollY >= THRESHOLD);
    }

    updateScrollState(); // Run once on load
    window.addEventListener('scroll', updateScrollState, { passive: true });
  });
})();
