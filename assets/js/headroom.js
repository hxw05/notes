(() => {
  // Mobile top bar: sticky (CSS) + headroom behavior.
  // Hide on scroll down, reveal on scroll up; always visible at the top of
  // the page and while the menu/TOC drawer is open.
  const header = document.querySelector('.book-header');
  if (!header) return;

  const mq = window.matchMedia('(max-width: 56rem)');
  const tocControl = document.getElementById('toc-control');
  const menuControl = document.getElementById('menu-control');

  const show = () => header.classList.remove('headroom-hidden');
  const hide = () => header.classList.add('headroom-hidden');

  let lastY = window.scrollY;
  let ticking = false;

  const update = () => {
    ticking = false;
    const y = window.scrollY;
    const drawerOpen = (tocControl && tocControl.checked) || (menuControl && menuControl.checked);
    if (y <= 0 || drawerOpen) {
      show();
    } else if (y > lastY) {
      hide();
    } else if (y < lastY) {
      show();
    }
    lastY = y;
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  for (const ctl of [tocControl, menuControl]) {
    if (ctl) ctl.addEventListener('change', update);
  }
  mq.addEventListener('change', (e) => {
    if (!e.matches) show(); // desktop: header is display:none anyway, keep state clean
  });

  update();
})();
