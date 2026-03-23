/**
 * Component: Hero — BeeWater
 * Description: Cinematic entrance animation, atmospheric mousemove parallax,
 *              scroll-driven exit, and ambient background breathing for the
 *              BeeWater hero section. Stillness-first. Restraint over complexity.
 *
 * Dependencies: GSAP (loaded natively via Webflow Site Settings)
 *               GSAP ScrollTrigger (loaded natively via Webflow Site Settings)
 *               Lenis (loaded via CDN in Webflow head)
 *               jQuery (global in Webflow)
 *
 * Webflow Load: Page-specific — Homepage only
 *               Add to: Page Settings → Custom Code → Before </body>
 *
 * Webflow Classes Used:
 *   .hero-section     — outer section wrapper
 *   .hero-texture     — film grain / texture layer (position absolute)
 *   .hero-vignette    — vignette overlay (position absolute)
 *   .hero-content     — content container (headline + sub)
 *   .hero-headline    — main display headline
 *   .hero-gold        — gold accent word(s) inside headline
 *   .hero-sub         — subheading below headline
 *   .scroll-indicator — scroll cue element at bottom of hero
 *
 * CDN URL: https://cdn.jsdelivr.net/gh/[YOUR_USERNAME]/[YOUR_REPO]@main/components/hero-beewater.js
 *
 * WEBFLOW: window.Webflow.push() used to ensure IX2 and DOM are fully ready
 *          before any animation or DOM queries run.
 */

(function ($) {
  'use strict';

  window.Webflow.push(function () {

    // ----------------------------------------------------------
    // 0. GUARD — exit cleanly if hero isn't on this page
    // ----------------------------------------------------------
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    const heroTexture    = document.querySelector('.hero-texture');
    const heroVignette   = document.querySelector('.hero-vignette');
    const heroContent    = document.querySelector('.hero-content');
    const heroHeadline   = document.querySelector('.hero-headline');
    const heroGold       = document.querySelectorAll('.hero-gold');
    const heroSub        = document.querySelector('.hero-sub');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    // ----------------------------------------------------------
    // 1. INITIAL STATE — everything hidden before entrance plays
    // ----------------------------------------------------------
    // Set everything to invisible before the timeline runs.
    // This prevents a flash of unstyled content on load.

    gsap.set(heroContent, {
      autoAlpha: 0,
    });

    gsap.set(heroHeadline, {
      y: 28,
      autoAlpha: 0,
    });

    gsap.set(heroSub, {
      y: 18,
      autoAlpha: 0,
    });

    gsap.set(scrollIndicator, {
      autoAlpha: 0,
    });

    // Gold words start invisible — they'll light up mid-entrance
    if (heroGold.length) {
      gsap.set(heroGold, { autoAlpha: 0 });
    }

    // ----------------------------------------------------------
    // 2. ENTRANCE TIMELINE — cinematic, unhurried
    // ----------------------------------------------------------
    // The feeling here is a film title card fading into existence.
    // Nothing snaps. Nothing bounces. Everything breathes in slowly.
    //
    // Sequence:
    //   → Section fades from pure black (already is black — seamless)
    //   → Headline rises and fades in
    //   → Gold word(s) light up with a slight additional delay
    //   → Subhead follows
    //   → Scroll indicator drifts in last

    const entrance = gsap.timeline({
      delay: 0.3, // brief pause — let the page settle before anything moves
      defaults: {
        ease: 'power3.out',
      }
    });

    entrance
      // Content wrapper becomes visible first (no movement — just unlocks children)
      .to(heroContent, {
        autoAlpha: 1,
        duration: 0.1,
      })

      // Headline rises and appears
      .to(heroHeadline, {
        y: 0,
        autoAlpha: 1,
        duration: 1.6,
      }, '-=0.1')

      // Gold accent words light up — slightly after headline starts moving
      // This creates a secondary beat: you read the headline, then the gold lands
      .to(heroGold, {
        autoAlpha: 1,
        duration: 1.2,
        stagger: 0.12,
      }, '-=1.1')

      // Subhead follows — shorter travel distance, slightly faster
      .to(heroSub, {
        y: 0,
        autoAlpha: 1,
        duration: 1.2,
      }, '-=0.8')

      // Scroll indicator drifts in last — quietly
      .to(scrollIndicator, {
        autoAlpha: 1,
        duration: 1.0,
      }, '-=0.4');


    // ----------------------------------------------------------
    // 3. MOUSEMOVE PARALLAX — atmospheric, not playful
    // ----------------------------------------------------------
    // The texture and vignette layers drift very slowly on mouse move.
    // The content drifts a tiny amount in the opposite direction.
    // The result is a subtle diorama depth — the scene has thickness.
    //
    // WEBFLOW NOTE: These layers are position:absolute inside the hero.
    // The movement is intentionally minimal — this is atmosphere, not interaction.
    // If it ever feels "game-like" it's too much. Reduce the depth values.

    const depth = {
      texture:  14,   // background texture moves most (furthest back)
      vignette: 6,    // vignette moves less (sits above texture)
      content:  3,    // content moves least and opposite (feels closest)
    };

    // Smoothed normalized mouse position (-1 to 1 on each axis)
    let normX = 0;
    let normY = 0;
    let targetNX = 0;
    let targetNY = 0;

    document.addEventListener('mousemove', (e) => {
      targetNX = (e.clientX / window.innerWidth  - 0.5) * 2;
      targetNY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Lerp loop — smooth easing toward mouse target every frame
    // Using requestAnimationFrame directly to avoid GSAP ticker conflicts with Lenis
    function parallaxLoop() {
      normX += (targetNX - normX) * 0.04; // 0.04 = very slow follow (lower = slower)
      normY += (targetNY - normY) * 0.04;

      if (heroTexture) {
        gsap.set(heroTexture, {
          x: normX * -depth.texture,
          y: normY * -depth.texture,
        });
      }

      if (heroVignette) {
        gsap.set(heroVignette, {
          x: normX * -depth.vignette,
          y: normY * -depth.vignette,
        });
      }

      if (heroContent) {
        // Content moves opposite direction at minimal depth — creates foreground feel
        gsap.set(heroContent, {
          x: normX * depth.content,
          y: normY * depth.content,
        });
      }

      requestAnimationFrame(parallaxLoop);
    }

    parallaxLoop();


    // ----------------------------------------------------------
    // 4. SCROLL EXIT — content pulls away as user scrolls down
    // ----------------------------------------------------------
    // As the user scrolls past the hero, the content drifts upward
    // and fades out. The texture layer drifts down (opposite) —
    // the layers separate, reinforcing the depth illusion.
    //
    // This is scroll-scrubbed so it's directly tied to scroll position.
    // scrub: 1.5 means it lags 1.5s behind scroll for a weighty feel.

    gsap.to(heroContent, {
      y: -60,
      autoAlpha: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
      }
    });

    if (heroTexture) {
      gsap.to(heroTexture, {
        y: 40,     // texture drifts DOWN as content drifts UP — they peel apart
        ease: 'none',
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: 'bottom top',
          scrub: 2,
        }
      });
    }

    if (scrollIndicator) {
      gsap.to(scrollIndicator, {
        autoAlpha: 0,
        y: 10,
        ease: 'none',
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: '20% top', // fades out fast — it's done its job once you scroll
          scrub: 1,
        }
      });
    }


    // ----------------------------------------------------------
    // 5. AMBIENT BREATHING — barely perceptible background pulse
    // ----------------------------------------------------------
    // A very slow, very subtle opacity oscillation on the texture layer.
    // This is the "film grain breathing" effect. If you can consciously
    // notice it, it's too much. It should only be felt, not seen.
    //
    // Only runs if texture layer exists and user has no motion preference.

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (heroTexture && !prefersReducedMotion) {
      gsap.to(heroTexture, {
        opacity: 0.85,          // barely moves — from 1 down to 0.85
        duration: 4.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    }


    // ----------------------------------------------------------
    // 6. REDUCED MOTION — respect system preference
    // ----------------------------------------------------------
    // If the user has requested reduced motion, skip all animation
    // and show everything at full opacity immediately.

    if (prefersReducedMotion) {
      entrance.kill();
      gsap.set([heroContent, heroHeadline, heroSub, scrollIndicator], {
        autoAlpha: 1,
        y: 0,
      });
      if (heroGold.length) {
        gsap.set(heroGold, { autoAlpha: 1 });
      }
    }

  }); // end window.Webflow.push

})(jQuery);

