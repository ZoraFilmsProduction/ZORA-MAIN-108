/* Zora Films: reversible mobile-only scroll reveal.
   Uses the original desktop scroll-position formula, but sends one smoothly
   interpolated progress value to the background, watercolor and both texts.
   All desktop rendering and mobile layout metrics remain untouched. */
(() => {
  'use strict';

  const mobile = window.matchMedia('(max-width: 767px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const EPSILON = 0.0002;
  const RESPONSE_MS = 52;
  let section = null;
  let progress = null;
  let lastTime = 0;
  let frame = 0;

  const clamp01 = n => Math.max(0, Math.min(1, n));

  function findSection() {
    if (!mobile.matches) return null;
    const next = document.querySelector('.first-build-page #about.intro-section');
    if (!next) {
      section = null;
      progress = null;
      return null;
    }
    if (section !== next) {
      section = next;
      progress = null;
      lastTime = 0;
    }

    const title = next.querySelector('.intro h2.water-text[data-water-text]');
    if (title && !title.querySelector('.zora-title-ink')) {
      const ink = document.createElement('span');
      ink.className = 'zora-title-ink';
      ink.setAttribute('aria-hidden', 'true');
      // Exact same children, typography and line breaks as the source title.
      for (const child of Array.from(title.childNodes)) {
        ink.appendChild(child.cloneNode(true));
      }
      title.appendChild(ink);
    }
    return next;
  }

  function schedule() {
    if (mobile.matches && !frame) frame = requestAnimationFrame(render);
  }

  function render(time) {
    frame = 0;
    const el = findSection();
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Same reveal thresholds and total travel distance as the desktop code.
    const target = clamp01(
      (viewportHeight * 0.8 - Math.min(280, viewportHeight * 0.3) - rect.top) /
      (rect.height * 0.5)
    );

    if (progress === null || reducedMotion.matches) {
      progress = target;
    } else {
      const dt = lastTime ? Math.max(1, Math.min(64, time - lastTime)) : 16.667;
      const smoothing = 1 - Math.exp(-dt / RESPONSE_MS);
      progress += (target - progress) * smoothing;
      if (Math.abs(target - progress) < EPSILON) progress = target;
    }
    lastTime = time;

    el.style.setProperty('--zora-wipe-p', String(progress));

    // The paper edge and black-letter clipping derive from ONE common line.
    // This stays correct even while the page and heading move on mobile Safari.
    const edgeY = rect.top + rect.height * (1 - progress);
    for (const text of el.querySelectorAll('[data-water-text]')) {
      const textRect = text.getBoundingClientRect();
      text.style.setProperty('--zora-wipe-at', `${edgeY - textRect.top}px`);
    }

    // Continue drawing after a touch-scroll event until caught up. The same
    // equation also runs when scrolling back up, restoring the black layer.
    if (progress !== target) schedule();
  }

  function handleModeChange() {
    if (!mobile.matches) {
      cancelAnimationFrame(frame);
      frame = 0;
      section = null;
      progress = null;
    } else {
      lastTime = 0;
      schedule();
    }
  }

  function start() {
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    window.addEventListener('pageshow', schedule, { passive: true });
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', schedule, { passive: true });
      window.visualViewport.addEventListener('scroll', schedule, { passive: true });
    }
    mobile.addEventListener('change', handleModeChange);

    // React may replace a server-rendered heading on navigation. Reinstall
    // its visual-only text copy without moving the heading or adding height.
    const observer = new MutationObserver(() => {
      if (!mobile.matches) return;
      if (!section || !section.isConnected || !section.querySelector('.zora-title-ink')) {
        schedule();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    schedule();
  }

  // Do not modify SSR DOM before React hydration has completed.
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
})();
