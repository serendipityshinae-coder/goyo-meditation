const PAGES = ['home', 'meditation', 'records', 'content'];
let currentPage = 'home';
let onPageChange = null;

export function initNavigation(callback) {
  onPageChange = callback;

  document.querySelectorAll('[data-nav-page]').forEach((btn) => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.navPage));
  });

  const hash = window.location.hash.replace('#', '');
  if (PAGES.includes(hash)) {
    navigateTo(hash, false);
  } else {
    navigateTo('home', false);
  }

  window.addEventListener('hashchange', () => {
    const next = window.location.hash.replace('#', '');
    if (PAGES.includes(next) && next !== currentPage) {
      navigateTo(next, false);
    }
  });
}

export function navigateTo(pageId, updateHash = true) {
  if (!PAGES.includes(pageId)) return;

  currentPage = pageId;

  document.querySelectorAll('[data-page]').forEach((el) => {
    el.hidden = el.dataset.page !== pageId;
  });

  document.querySelectorAll('[data-nav-page]').forEach((btn) => {
    const isActive = btn.dataset.navPage === pageId;
    btn.classList.toggle('sidebar__link--active', isActive);
    if (isActive) btn.setAttribute('aria-current', 'page');
    else btn.removeAttribute('aria-current');
  });

  if (updateHash) {
    window.location.hash = pageId;
  }

  onPageChange?.(pageId);
}

export function getCurrentPage() {
  return currentPage;
}
