<script>
/* ==========================================================
   BEEWATER — Hero Animation
   
   Handles:
     1. Entrance sequence — image, headline, service label
     2. Corner marks — gold viewfinder brackets that travel
        from headline centre out to corners on entrance
     3. Scroll-driven fade + lift — content floats up and
        fades as user scrolls into the next section
     4. Scroll parallax — background scales on scroll
     5. Nav state — bw-scrolled class toggle

   All elements targeted by ID — nothing changes in Webflow.
   No dependencies. Pure vanilla JS.
   
   IDs expected in Webflow DOM:
     #bw-hero           — section wrapper
     #bw-hero-bg        — absolutely positioned background image
     #bw-vignette       — vignette overlay layer
     #bw-content        — content wrapper (headline + label)
     #bw-headline       — main headline element
     #bw-service-label  — spaced descriptor line at bottom
     #bw-mark-tl        — top-left corner mark
     #bw-mark-tr        — top-right corner mark
     #bw-mark-bl        — bottom-left corner mark
     #bw-mark-br        — bottom-right corner mark
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
    marksDelay:          1100,  // when marks appear and travel

    // Entrance durations
    imageFadeDuration:   1800,
    imageScaleDuration:  2000,
    headlineFadeDuration: 900,
    labelFadeDuration:    700,
    markFadeDuration:     400,  // how fast marks fade in at centre
    markTravelDuration:  1400,  // how long marks take to reach corners

    // Scroll
    scrollScale:         0.07,  // bg scale amount on scroll
    scrollFadeStart:     0.08,  // progress (0-1) when content starts fading
    scrollFadeEnd:       0.38,  // progress (0-1) when content fully gone
    contentLift:         48,    // px content rises during scroll fade
    navScrollThreshold:  400,   // px before nav gets bw-scrolled

    // Marks
    markPadding:         24,    // px outside headline bounding box
    markSize:            14,    // px — arm length of each L-bracket
    markWeight:          1.5,   // px — stroke width
  };


  /* ----------------------------------------------------------
     ELEMENTS
  ---------------------------------------------------------- */
  var hero         = document.getElementById('bw-hero');
  var heroBg       = document.getElementById('bw-hero-bg');
  var headline     = document.getElementById('bw-headline');
  var serviceLabel = document.getElementById('bw-service-label');
  var nav          = document.getElementById('bw-nav-min');

  var markEls = {
    tl: document.getElementById('bw-mark-tl'),
    tr: document.getElementById('bw-mark-tr'),
    bl: document.getElementById('bw-mark-bl'),
    br: document.getElementById('bw-mark-br'),
  };

  // Exit cleanly if not on hero page
  if (!hero || !heroBg || !headline) return;

  var marks    = [markEls.tl, markEls.tr, markEls.bl, markEls.br].filter(Boolean);
  var hasMarks = marks.length === 4;


  /* ----------------------------------------------------------
     STYLES — injected so Webflow CSS doesn't interfere
  ---------------------------------------------------------- */
  var s = CONFIG.markSize   + 'px';
  var w = CONFIG.markWeight + 'px';
  var c = '#F5A623'; // BW Gold
  var mt = CONFIG.markTravelDuration + 'ms';
  var mf = CONFIG.markFadeDuration   + 'ms';

  var css = [

    // Corner mark base — 0x0 anchor, arms drawn via pseudo-elements
    '[id^="bw-mark-"] {',
    '  position: absolute;',
    '  width: 0; height: 0;',
    '  opacity: 0;',
    '  pointer-events: none;',
    '  z-index: 20;',
    '  transition:',
    '    opacity ' + mf + ' ease,',
    '    top '    + mt + ' cubic-bezier(0.76, 0, 0.24, 1),',
    '    left '   + mt + ' cubic-bezier(0.76, 0, 0.24, 1);',
    '}',

    '[id^="bw-mark-"]::before,',
    '[id^="bw-mark-"]::after {',
    '  content: "";',
    '  position: absolute;',
    '  background: ' + c + ';',
    '}',

    // TL — arms go right and down
    '#bw-mark-tl::before { width:' + s + '; height:' + w + '; top:0; left:0; }',
    '#bw-mark-tl::after  { width:' + w + '; height:' + s + '; top:0; left:0; }',

    // TR — arms go left and down
    '#bw-mark-tr::before { width:' + s + '; height:' + w + '; top:0; right:0; left:auto; }',
    '#bw-mark-tr::after  { width:' + w + '; height:' + s + '; top:0; right:0; left:auto; }',

    // BL — arms go right and up
    '#bw-mark-bl::before { width:' + s + '; height:' + w + '; bottom:0; left:0; top:auto; }',
    '#bw-mark-bl::after  { width:' + w + '; height:' + s + '; bottom:0; left:0; top:auto; }',

    // BR — arms go left and up
    '#bw-mark-br::before { width:' + s + '; height:' + w + '; bottom:0; right:0; left:auto; top:auto; }',
    '#bw-mark-br::after  { width:' + w + '; height:' + s + '; bottom:0; right:0; left:auto; top:auto; }',

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
     MARK POSITION HELPERS
  ---------------------------------------------------------- */

  function getTargets() {
    var hr   = hero.getBoundingClientRect();
    var hlr  = headline.getBoundingClientRect();
    var pad  = CONFIG.markPadding;
    var size = CONFIG.markSize;
    var half = size / 2;

    return {
      // Collapsed start — marks stack at headline centre
      centre: {
        top:  hlr.top  - hr.top  + hlr.height / 2 - half,
        left: hlr.left - hr.left + hlr.width  / 2 - half,
      },
      // Expanded destinations
      tl: { top: hlr.top    - hr.top    - pad,        left: hlr.left  - hr.left - pad        },
      tr: { top: hlr.top    - hr.top    - pad,        left: hlr.right - hr.left + pad - size },
      bl: { top: hlr.bottom - hr.top    + pad - size, left: hlr.left  - hr.left - pad        },
      br: { top: hlr.bottom - hr.top    + pad - size, left: hlr.right - hr.left + pad - size },
    };
  }

  function setPos(el, top, left) {
    if (!el) return;
    el.style.top  = top  + 'px';
    el.style.left = left + 'px';
  }

  function collapseMarks(t) {
    setPos(markEls.tl, t.centre.top, t.centre.left);
    setPos(markEls.tr, t.centre.top, t.centre.left);
    setPos(markEls.bl, t.centre.top, t.centre.left);
    setPos(markEls.br, t.centre.top, t.centre.left);
  }

  function expandMarks(t) {
    setPos(markEls.tl, t.tl.top, t.tl.left);
    setPos(markEls.tr, t.tr.top, t.tr.left);
    setPos(markEls.bl, t.bl.top, t.bl.left);
    setPos(markEls.br, t.br.top, t.br.left);
  }


  /* ----------------------------------------------------------
     ENTRANCE SEQUENCE
  ---------------------------------------------------------- */
  var entranceDone = false;

  function runSequence() {
    var targets = hasMarks ? getTargets() : null;

    // Pre-position marks at centre before they're visible
    if (hasMarks && targets) collapseMarks(targets);

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

    // 3 — Marks fade in at centre, then travel outward
    if (hasMarks && targets) {
      setTimeout(function () {

        // Fade marks in (still at centre)
        marks.forEach(function (m) { m.style.opacity = '1'; });

        // Two rAF frames to ensure opacity transition fires before position change
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            expandMarks(targets);
          });
        });

      }, CONFIG.marksDelay);
    }
  }


  /* ----------------------------------------------------------
     RESIZE — snap marks to new positions instantly
  ---------------------------------------------------------- */
  var resizeTimer;

  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (!hasMarks || !entranceDone) return;
      var targets = getTargets();

      // Kill position transitions temporarily for clean snap
      marks.forEach(function (m) {
        m.style.transition = 'opacity ' + mf + ' ease';
      });

      expandMarks(targets);

      // Restore transitions after snap
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          marks.forEach(function (m) { m.style.transition = ''; });
        });
      });

    }, 150);
  });


  /* ----------------------------------------------------------
     SCROLL HANDLER
     
     Three things happen:
       a) Nav gets bw-scrolled class after threshold
       b) Background scales up slightly (parallax weight)
       c) Headline, label, and marks fade out and lift away
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

      // Marks track headline opacity
      if (hasMarks) {
        marks.forEach(function (m) { m.style.opacity = opacity; });
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
