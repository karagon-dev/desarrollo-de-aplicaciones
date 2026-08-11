import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

function resetScrollPosition() {
  const root = document.documentElement;
  const body = document.body;
  const previousRootBehavior = root.style.scrollBehavior;
  const previousBodyBehavior = body.style.scrollBehavior;

  root.style.scrollBehavior = 'auto';
  body.style.scrollBehavior = 'auto';

  window.scrollTo(0, 0);
  document.getElementById('main-content')?.scrollTo(0, 0);

  requestAnimationFrame(() => {
    root.style.scrollBehavior = previousRootBehavior;
    body.style.scrollBehavior = previousBodyBehavior;
  });
}

export function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useLayoutEffect(() => {
    resetScrollPosition();

    if (!hash) {
      return;
    }

    const targetId = decodeURIComponent(hash.slice(1));
    window.setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }, [pathname, search, hash]);

  return null;
}
