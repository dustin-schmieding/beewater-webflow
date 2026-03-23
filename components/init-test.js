/**
 * Component: Init Test
 * Description: Confirms the Cursor → GitHub → jsDelivr → Webflow
 *              pipeline is working. Safe to remove once pipeline is verified.
 * Dependencies: jQuery (global in Webflow)
 * Webflow Load: Site-wide (temporary, for testing)
 * CDN URL: https://cdn.jsdelivr.net/gh/[YOUR_USERNAME]/[YOUR_REPO]@main/components/init-test.js
 */

(function ($) {
  'use strict';

  window.Webflow.push(function () {

    // ---------------------------------------------------------
    // Pipeline confirmation
    // ---------------------------------------------------------
    // If you see this message in the browser console, it means:
    //   ✅ GitHub received your file
    //   ✅ jsDelivr is serving it
    //   ✅ Webflow loaded it
    //   ✅ window.Webflow.push() executed correctly
    // ---------------------------------------------------------

    console.log('%c[Webflow Dev] ✅ Pipeline confirmed — Cursor → GitHub → jsDelivr → Webflow is working!', 
      'background: #0066FF; color: white; padding: 4px 10px; border-radius: 4px; font-weight: bold;'
    );

    console.log('[Webflow Dev] jQuery version:', $.fn.jquery);
    console.log('[Webflow Dev] Page loaded at:', new Date().toLocaleTimeString());

  });

})(jQuery);

