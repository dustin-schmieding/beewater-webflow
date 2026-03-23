<script>
/* ==========================================================
   BEEWATER — Hero Animation
   
   Handles:
     1. Entrance sequence — image, headline, service label
     2. Scroll-driven fade + lift — content floats up and
        fades as user scrolls into the next section
     3. Scroll parallax — background scales on scroll
     4. Nav state — bw-scrolled class toggle

   All elements targeted by ID — nothing changes in Webflow.
   No dependencies. Pure vanilla JS.
   
   IDs expected in Webflow DOM:
     #bw-hero           — section wrapper
     #bw-hero-bg        — absolutely positioned background image
     #bw-vignette       — vignette overlay layer
     #bw-content        — content wrapper (headline + label)
     #bw-headline       — main headline element
     #bw-service-label  — spaced descriptor line at bottom
     #bw-nav-min        — nav bar (for scroll state class)
     
   Paste this entire <script> block into:
   Webflow → Homepage → Page Settings → Before </body>
========================================================== */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     CONFIG
     All timing values in milliseconds.
     Tweak these first before touching anything else.
  ---------------------------------------------------------- */
  var CONFIG = {

    // Entrance timing
    imageDelay:          0,     // when background starts fading in
    headlineDelay:       900,   // when headline fades in

    // Entrance durations
    imageFadeDuration:   1800,
    imageScaleDuration:  2000,
    headlineFadeDuration: 900,
    labelFadeDuration:    700,

    // Scroll
    scrollScale:         0.07,  // bg scale amount on scroll
    scrollFadeStart:     0.08,  // progress (0-1) when content starts fading
    scrollFadeEnd:       0.38,  // progress (0-1) when content fully gone
    contentLift:         48,    // px content rises during scroll fade
    navScrollThreshold:  400,   // px before nav gets bw-scrolled
  };


  /* ----------------------------------------------------------
     ELEMENTS
  ---------------------------------------------------------- */
  var hero         = document.getElementById('bw-hero');
  var heroBg       = document.getElementById('bw-hero-bg');
  var headline     = document.getElementById('bw-headline');
  var serviceLabel = document.getElementById('bw-service-label');
  var nav          = document.getElementById('bw-nav-min');

  // Exit cleanly if not on hero page
  if (!hero || !heroBg || !headline) return;


  /* ----------------------------------------------------------
     STYLES — injected so Webflow CSS doesn't interfere
  ---------------------------------------------------------- */
  var css = [

    // Entrance transitions
    '#bw-hero-bg {',
    '  transition:',
    '    opacity '   + CONFIG.imageFadeDuration  + 'ms cubic-bezier(0.4,0,0.2,1),',
    '    transform ' + CONFIG.imageScaleDuration + 'ms cubic-bezier(0.4,0,0.2,1);',
    '}',

    '#bw-headline {',
    '  transition:',
    '    opacity '   + CONFIG.headlineFadeDuration + 'ms ease,',
    '    transform ' + CONFIG.headlineFadeDuration + 'ms ease;',
    '}',

    '#bw-service-label {',
    '  transition: opacity ' + CONFIG.labelFadeDuration + 'ms ease;',
    '}',

  ].join('\n');

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);


  /* ----------------------------------------------------------
     INITIAL STATES
  ---------------------------------------------------------- */
  heroBg.style.opacity   = '0';
  heroBg.style.transform = 'scale(1.08)';
  headline.style.opacity   = '0';
  headline.style.transform = 'translateY(12px)';
  if (serviceLabel) serviceLabel.style.opacity = '0';


  /* ----------------------------------------------------------
     ENTRANCE SEQUENCE
  ---------------------------------------------------------- */
  var entranceDone = false;

  function runSequence() {
    // 1 — Background fades and scales in
    setTimeout(function () {
      heroBg.style.opacity   = '1';
      heroBg.style.transform = 'scale(1)';

      // After scale completes, hand transform over to scroll handler
      setTimeout(function () {
        entranceDone = true;
        heroBg.style.transition = 'opacity 1s cubic-bezier(0.4,0,0.2,1)';
      }, CONFIG.imageScaleDuration);

    }, CONFIG.imageDelay);

    // 2 — Headline rises in, label follows
    setTimeout(function () {
      headline.style.opacity   = '1';
      headline.style.transform = 'translateY(0)';
      if (serviceLabel) serviceLabel.style.opacity = '1';
    }, CONFIG.headlineDelay);
  }


  /* ----------------------------------------------------------
     SCROLL HANDLER
     
     Three things happen:
       a) Nav gets bw-scrolled class after threshold
       b) Background scales up slightly (parallax weight)
       c) Headline and label fade out and lift away
  ---------------------------------------------------------- */
  var ticking = false;

  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(function () {
      var scrollY  = window.scrollY;
      var heroH    = hero.offsetHeight;
      var progress = Math.min(scrollY / heroH, 1);

      // a) Nav state
      if (nav) {
        nav.classList.toggle('bw-scrolled', scrollY >= CONFIG.navScrollThreshold);
      }

      // b) Background parallax (only after entrance scale completes)
      if (entranceDone) {
        heroBg.style.transform = 'scale(' + (1 + CONFIG.scrollScale * progress) + ')';
      }

      // c) Content fade + lift
      // Normalise progress to the fade window
      var fp = Math.max(0, Math.min(1,
        (progress - CONFIG.scrollFadeStart) / (CONFIG.scrollFadeEnd - CONFIG.scrollFadeStart)
      ));

      var opacity = 1 - fp;
      var lift    = fp * CONFIG.contentLift;

      headline.style.opacity   = opacity;
      headline.style.transform = 'translateY(-' + lift + 'px)';

      // Label fades faster than headline — feels like it peels away first
      if (serviceLabel) {
        var labelFP = Math.max(0, Math.min(1,
          (progress - CONFIG.scrollFadeStart) /
          ((CONFIG.scrollFadeEnd - CONFIG.scrollFadeStart) * 0.7)
        ));
        serviceLabel.style.opacity = 1 - labelFP;
      }

      ticking = false;
    });

  }, { passive: true });


  /* ----------------------------------------------------------
     BOOT — wait for fonts so headline dimensions are accurate
  ---------------------------------------------------------- */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { setTimeout(runSequence, 100); });
  } else {
    window.addEventListener('load', function () { setTimeout(runSequence, 300); });
  }

})();
</script>
