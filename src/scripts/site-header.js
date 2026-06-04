import './site-footer.js';
import logoHeader from '../images/logo.svg';
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
  { alt: 'поиск', src: searchIcon, action: 'search' },
  { alt: 'каталог', src: catalogIcon, action: 'catalog' },
  { alt: 'избранное', src: favoriteIcon, action: 'favorite' },
  { alt: 'корзина', src: cartIcon, action: 'cart' },
  { alt: 'профиль', src: profileIcon, action: 'profile' },
];

function renderNav(activePage) {
  return NAV_ITEMS.map(({ key, label, href }) => {
    const attrs = [];

    if (key === 'catalog') {
      attrs.push('class="catalog"');
    }

    if (key === activePage) {
      attrs.push('aria-current="page"');
    }

    return `<a ${attrs.join(' ')} href="${href}">${label}</a>`;
  }).join('');
}

function renderLogo() {
  return `
    <a class="site-header__logo" href="/src/pages/index.html" aria-label="На главную">
      <span class="site-header__logo-layer site-header__logo-layer--dark">
        <img class="site-header__logo-mark" src="${logoHeader}" alt="" width="140" height="40" />
      </span>
      <span class="site-header__logo-layer site-header__logo-layer--light" aria-hidden="true">
        <img class="site-header__logo-mark" src="${logoHeader}" alt="" width="140" height="40" />
      </span>
    </a>
  `;
}

function renderBurger() {
  return `
    <button
      type="button"
      class="site-header__burger"
      aria-label="Открыть меню"
      aria-expanded="false"
      aria-controls="site-header-nav"
      data-header-burger
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
  `;
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
  const topLeft = `<div class="site-header__top-left">${renderLogo()}${renderBurger()}</div>`;

  const bottom = `<div class="site-header__bottom">
        <div class="container site-header__bottom-inner">
          <a class="site-header__email" href="mailto:${EMAIL}">${EMAIL}</a>
          <a class="site-header__phone" href="tel:+79999999999">${PHONE}</a>
        </div>
      </div>`;

  host.innerHTML = `
    <div class="site-header__top">
      <div class="container">
        <div class="site-header__top-inner">
          ${topLeft}

          <nav class="site-header__nav" id="site-header-nav" aria-label="Навигация">
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
  const burger = host.querySelector('[data-header-burger]');
  const nav = host.querySelector('.site-header__nav');
  const hero = document.querySelector('.hero');
  const mobileMenuQuery = window.matchMedia('(max-width: 900px)');

  const updateScrolledState = () => {
    const isScrolled = window.scrollY > 0;
    host.classList.toggle('site-header--scrolled', isScrolled);
  };

  const closeMenu = () => {
    host.classList.remove('site-header--menu-open');
    burger?.setAttribute('aria-expanded', 'false');
  };

  const closeSearch = () => {
    host.classList.remove('site-header--search-open');
    if (actions) {
      actions.innerHTML = renderActions();
      bindSearchTrigger();
    }
  };

  const toggleMenu = () => {
    const isOpen = host.classList.toggle('site-header--menu-open');
    burger?.setAttribute('aria-expanded', String(isOpen));
  };

  const updateHeroState = () => {
    if (layout !== 'home' || !hero) {
      host.classList.remove('site-header--over-hero');
      return;
    }

    const heroRect = hero.getBoundingClientRect();
    const isOverHero = heroRect.bottom > 0 && heroRect.top < window.innerHeight;
    host.classList.toggle('site-header--over-hero', isOverHero);
  };

  const openSearch = () => {
    if (!actions) {
      return;
    }

    host.classList.add('site-header--search-open');
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
        closeSearch();
      }
    });
  };

  const bindSearchTrigger = () => {
    const trigger = actions?.querySelector('[data-header-search-trigger]');
    trigger?.addEventListener('click', (event) => {
      event.preventDefault();
      closeMenu();
      openSearch();
    });
  };

  burger?.addEventListener('click', () => {
    if (!mobileMenuQuery.matches) {
      return;
    }

    closeSearch();
    toggleMenu();
  });

  nav?.addEventListener('click', (event) => {
    if (!mobileMenuQuery.matches) {
      return;
    }

    if (event.target instanceof Element && event.target.closest('a')) {
      closeMenu();
    }
  });

  document.addEventListener('click', (event) => {
    if (!host.classList.contains('site-header--menu-open')) {
      return;
    }

    if (event.target instanceof Node && !host.contains(event.target)) {
      closeMenu();
    }
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
      closeSearch();
    }
  });

  mobileMenuQuery.addEventListener('change', closeMenu);

  bindSearchTrigger();
  updateScrolledState();
  updateHeroState();

  window.addEventListener('scroll', updateScrolledState, { passive: true });
  window.addEventListener('scroll', updateHeroState, { passive: true });
  window.addEventListener('resize', updateHeroState, { passive: true });
  window.addEventListener('resize', () => {
    if (!mobileMenuQuery.matches) {
      closeMenu();
      closeSearch();
    }
  });
}

renderHeader();
