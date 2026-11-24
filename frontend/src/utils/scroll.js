let activeScroll = null;

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function jumpToScrollPosition(top) {
  window.scrollTo({ top, behavior: 'instant' });
}

export function animatePageScroll(top, duration, onComplete) {
  activeScroll?.();
  const startY = window.scrollY;
  const maxY = Math.max(0, document.scrollingElement.scrollHeight - window.innerHeight);
  const targetY = Math.min(maxY, Math.max(0, top));
  const distance = targetY - startY;

  if (prefersReducedMotion() || Math.abs(distance) < 2) {
    jumpToScrollPosition(targetY);
    onComplete?.();
    return null;
  }

  let frame;
  let startedAt;
  function cancel() {
    cancelAnimationFrame(frame);
    if (activeScroll === cancel) activeScroll = null;
  }

  function advance(now) {
    startedAt ??= now;
    const progress = Math.min((now - startedAt) / duration, 1);
    const eased = progress * progress * (3 - 2 * progress);
    jumpToScrollPosition(startY + distance * eased);

    if (progress < 1) {
      frame = requestAnimationFrame(advance);
    } else {
      activeScroll = null;
      onComplete?.();
    }
  }

  frame = requestAnimationFrame(advance);
  activeScroll = cancel;
  return cancel;
}
