import logoHeader from '../images/logo-header.png';
import searchIcon from '../images/search-icon.svg';
import catalogIcon from '../images/catalog-icon.svg';
import favoriteIcon from '../images/favorite-icon.svg';
import cartIcon from '../images/cart-icon.svg';
import profileIcon from '../images/profile-icon.svg';

const NAV_ITEMS = [
  { key: 'catalog', label: 'каталог', href: '/src/pages/catalog.html' },
  { key: 'service', label: 'установка и обслуживание', href: '/src/pages/service.html' },
  { key: 'promotions', label: 'акции', href: '/src/pages/promotions.html' },
  { key: 'about', label: 'о компании', href: '/src/pages/about.html' },
  { key: 'reviews', label: 'отзывы', href: '/src/pages/reviews.html' },
  { key: 'blog', label: 'блог', href: '/src/pages/blog.html' },
  { key: 'contacts', label: 'контакты', href: '/src/pages/contacts.html' },
];

const PHONE = '+7 999 999 99 99';
const EMAIL = 'info@mircl.ru';
const ICONS = [
  { alt: 'Поиск', src: searchIcon, action: 'search' },
  { alt: 'Каталог', src: catalogIcon, action: 'catalog' },
  { alt: 'Избранное', src: favoriteIcon, action: 'favorite' },
  { alt: 'Корзина', src: cartIcon, action: 'cart' },
  { alt: 'Профиль', src: profileIcon, action: 'profile' },
];

function renderNav(activePage) {
  return NAV_ITEMS.map(({ key, label, href }) => {
    const activeAttrs = key === activePage ? ` class="${key}" aria-current="page"` : '';
    return `<a${activeAttrs} href="${href}">${label}</a>`;
  }).join('');
}

function renderActions() {
  return ICONS.map(({ alt, src, action }) => {
    if (action === 'search') {
      return `<button type="button" class="site-header__action-search" aria-label="${alt}" data-header-action="search" data-header-search-trigger><img src="${src}" alt="" aria-hidden="true" /></button>`;
    }

    const ariaLabel = ` aria-label="${alt}"`;
    return `<a href="#"${ariaLabel} data-header-action="${action}"><img src="${src}" alt="" aria-hidden="true" /></a>`;
  }).join('');
}

function renderSearchModule() {
  return `
    <form class="site-header__search" data-header-search-form action="/src/pages/catalog.html" method="get">
      <input type="search" name="query" placeholder="введите название" aria-label="Поиск по сайту" />
      <button type="submit" aria-label="Искать">поиск</button>
    </form>
  `;
}

function renderHeader() {
  const host = document.querySelector('[data-site-header]');

  if (!host) {
    return;
  }

  const layout = document.body.dataset.headerLayout || 'standard';
  const activePage = document.body.dataset.headerActive || '';
  const topLeft = layout === 'home'
    ? `<div class="site-header__top-left">
        <a class="site-header__logo" href="/src/pages/index.html" aria-label="На главную">
          <img class="site-header__logo-mark" src="${logoHeader}" alt="" width="140" height="40" />
        </a>
      </div>`
    : `<div class="site-header__top-left">
        <a class="site-header__logo" href="/src/pages/index.html" aria-label="На главную">
          <img class="site-header__logo-mark" src="${logoHeader}" alt="" width="140" height="40" />
        </a>
        <a class="site-header__email" href="mailto:${EMAIL}">${EMAIL}</a>
      </div>`;

  const bottom = layout === 'home'
    ? `<div class="site-header__bottom">
        <div class="container site-header__bottom-inner">
          <a class="site-header__email" href="mailto:${EMAIL}">${EMAIL}</a>
          <a class="site-header__phone" href="tel:+79999999999">${PHONE}</a>
        </div>
      </div>`
    : layout === 'phone'
      ? `<div class="site-header__phone container">
          <a href="tel:+79999999999">${PHONE}</a>
        </div>`
      : '';

  host.innerHTML = `
    <div class="site-header__top">
      <div class="container">
        <div class="site-header__top-inner">
          ${topLeft}

          <nav class="site-header__nav" aria-label="Навигация">
            ${renderNav(activePage)}
          </nav>

          <div class="site-header__actions">
            ${renderActions()}
          </div>
        </div>
      </div>
    </div>
    ${bottom}
  `;

  const actions = host.querySelector('.site-header__actions');
  const updateScrolledState = () => {
    const isScrolled = window.scrollY > 0;
    host.classList.toggle('site-header--scrolled', isScrolled);
  };

  const openSearch = () => {
    if (!actions) {
      return;
    }

    actions.innerHTML = renderSearchModule();

    const form = actions.querySelector('[data-header-search-form]');
    const input = form?.querySelector('input[type="search"]');

    if (input) {
      window.requestAnimationFrame(() => {
        input.focus();
      });
    }

    form?.addEventListener('submit', (event) => {
      event.preventDefault();
      const value = new FormData(form).get('query')?.toString().trim() || '';
      const target = new URL('/src/pages/catalog.html', window.location.origin);

      if (value) {
        target.searchParams.set('query', value);
      }

      window.location.href = target.toString();
    });

    form?.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        actions.innerHTML = renderActions();
        bindSearchTrigger();
      }
    });
  };

  const bindSearchTrigger = () => {
    const trigger = actions?.querySelector('[data-header-search-trigger]');
    trigger?.addEventListener('click', (event) => {
      event.preventDefault();
      openSearch();
    });
  };

  bindSearchTrigger();
  updateScrolledState();

  window.addEventListener('scroll', updateScrolledState, { passive: true });
}

renderHeader();
