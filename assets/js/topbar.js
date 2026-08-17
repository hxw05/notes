(() => {
  'use strict';

  // Mobile top bar: drawers + headroom, fully JS-driven.
  //
  // The theme's label/checkbox drawer mechanism is replaced by real toggle
  // buttons (layouts/partials/docs/header.html) whose state lives in body
  // classes, so no CSS hacks are needed to keep taps from scrolling the page
  // (the old fix pinned the hidden checkboxes with position: fixed). The bar
  // itself is a fixed element; .book-page reserves --topbar-space (bar +
  // gap) and hiding it only toggles a transform class (headroom pattern).
  //
  // Drawer markup: layouts/baseof.html (drawers, overlay). Visuals:
  // assets/styles/custom.css under the ≤56rem breakpoint.

  const header = document.querySelector('.book-header');
  if (!header) return;

  const mq = window.matchMedia('(max-width: 56rem)');

  const menuToggle = document.getElementById('menu-toggle');
  const tocToggle = document.getElementById('toc-toggle');
  const tocDrawer = document.getElementById('toc-drawer');
  const menuOverlay = document.getElementById('menu-overlay');

  // ---- Drawers ---------------------------------------------------------

  const MENU = { name: 'menu', className: 'menu-open', toggle: menuToggle };
  const TOC = { name: 'toc', className: 'toc-open', toggle: tocToggle };
  const DRAWERS = [MENU, TOC];

  const isOpen = (d) => document.body.classList.contains(d.className);

  function setDrawer(d, open) {
    document.body.classList.toggle(d.className, open);
    d.toggle?.setAttribute('aria-expanded', String(open));
  }

  function closeDrawers() {
    for (const d of DRAWERS) {
      if (isOpen(d)) setDrawer(d, false);
    }
  }

  menuToggle.addEventListener('click', () => setDrawer(MENU, !isOpen(MENU)));
  menuOverlay.addEventListener('click', () => setDrawer(MENU, false));
  tocToggle?.addEventListener('click', () => setDrawer(TOC, !isOpen(TOC)));

  // Picking a TOC entry closes the drawer and keeps the bar visible until
  // the smooth scroll to the anchor has finished (scrollend, or a timeout
  // as a fallback), so the anchor lands exactly below the bar.
  tocDrawer?.addEventListener('click', (e) => {
    if (!e.target.closest('a')) return;
    setDrawer(TOC, false);
    pinnedUntil = performance.now() + 1500;
    update();
  });

  // The TOC drawer has no overlay: any click outside it (and outside its
  // toggle button) closes it. Clicks inside the drawer keep it open for
  // scrolling; links inside are handled above.
  document.addEventListener('click', (e) => {
    if (!isOpen(TOC)) return;
    if (e.target.closest('#toc-drawer') || e.target.closest('#toc-toggle')) return;
    setDrawer(TOC, false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && DRAWERS.some(isOpen)) closeDrawers();
  });

  // ---- Headroom ---------------------------------------------------------

  const HIDDEN_CLASS = 'headroom-hidden';
  const HIDE_TOLERANCE = 8; // px of net downward scroll before hiding

  let lastY = window.scrollY;
  let downDistance = 0;
  let hidden = false;
  let pinnedUntil = 0; // timestamp: the bar must stay visible until then

  function syncScrollPadding() {
    const root = document.documentElement;
    if (!mq.matches) {
      root.style.scrollPaddingTop = '';
      return;
    }
    // Anchors scroll below the bar (plus its gap); none is needed while
    // the bar is hidden.
    root.style.scrollPaddingTop = hidden ? '0' : 'var(--topbar-space)';
  }

  function setHidden(next) {
    if (next === hidden) return;
    hidden = next;
    header.classList.toggle(HIDDEN_CLASS, hidden);
    syncScrollPadding();
  }

  function update() {
    const y = window.scrollY;
    if (y <= 0 || DRAWERS.some(isOpen) || performance.now() < pinnedUntil) {
      downDistance = 0;
      setHidden(false);
    } else if (y > lastY) {
      downDistance += y - lastY;
      if (downDistance > HIDE_TOLERANCE) setHidden(true);
    } else if (y < lastY) {
      downDistance = 0;
      setHidden(false);
    }
    lastY = y;
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        update();
      });
    }
  }, { passive: true });

  // Any finished scroll releases the anchor-jump pin.
  window.addEventListener('scrollend', () => {
    pinnedUntil = 0;
  });

  const onMqChange = (e) => {
    if (e.matches) {
      // back to mobile: resync from the current scroll position
      lastY = window.scrollY;
      downDistance = 0;
      setHidden(false);
      update();
    } else {
      // desktop: no top bar, drop the anchor offset
      pinnedUntil = 0;
      setHidden(false);
      syncScrollPadding();
    }
  };
  if (mq.addEventListener) mq.addEventListener('change', onMqChange);
  else mq.addListener(onMqChange); // Safari < 14

  if (mq.matches) update();
  else syncScrollPadding();
})();
