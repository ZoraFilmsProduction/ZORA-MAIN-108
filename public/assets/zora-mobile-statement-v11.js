/* Rooted in Minimalism mobile wipe: same desktop scroll geometry, smoothed
   at the compositor like the existing mobile Analog Softness animation.
   The source React animation and all desktop behavior stay unchanged. */
(() => {
  'use strict';
  const mobile = window.matchMedia('(max-width: 767px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const RESPONSE_MS = 52; // Exactly the Analog Softness mobile response.
  const EPSILON = 0.0002;
  let section = null;
  let progress = null;
  let lastTime = 0;
  let frame = 0;

  const clamp01 = n => Math.max(0, Math.min(1, n));

  function schedule() {
    if (mobile.matches && !frame) frame = requestAnimationFrame(render);
  }

  function render(time) {
    frame = 0;
    if (!mobile.matches) return;
    const currentSection = document.querySelector('.first-build-page .statement');
    if (!currentSection) {
      section = null;
      progress = null;
      return;
    }
    if (section !== currentSection) {
      section = currentSection;
      progress = null;
      lastTime = 0;
    }

    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    // The desktop application uses these same thresholds and travel distance.
    const target = clamp01(
      (viewportHeight * 0.98 - rect.top) /
      Math.min(480, viewportHeight * 0.65)
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

    section.style.setProperty('--zora-statement-p', String(progress));
    const title = section.querySelector('.statement-copy');
    if (title) {
      // One edge shared by paper, grain, lettering and filled emblem.
      const paperEdgeY = rect.top + progress * rect.height;
      const textTop = title.getBoundingClientRect().top;
      section.style.setProperty('--zora-statement-wipe-text', `${paperEdgeY - textTop}px`);
    }
    if (progress !== target) schedule();
  }

  function modeChanged() {
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
    mobile.addEventListener('change', modeChanged);
    // The homepage may be mounted later during client-side navigation.
    const observer = new MutationObserver(() => {
      if (mobile.matches && (!section || !section.isConnected)) schedule();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    schedule();
  }

  // Wait for the original React app to hydrate before reading section metrics.
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
})();
