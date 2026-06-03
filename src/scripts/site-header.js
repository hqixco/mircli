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
const LOGO = '/src/images/logo-header.png';
const ICONS = [
  { alt: 'Поиск', src: '/src/images/search-icon.svg' },
  { alt: 'Каталог', src: '/src/images/catalog-icon.svg' },
  { alt: 'Избранное', src: '/src/images/favorite-icon.svg' },
  { alt: 'Корзина', src: '/src/images/cart-icon.svg' },
  { alt: 'Профиль', src: '/src/images/profile-icon.svg' },
];

function renderNav(activePage) {
  return NAV_ITEMS.map(({ key, label, href }) => {
    const activeAttrs = key === activePage ? ` class="${key}" aria-current="page"` : '';
    return `<a${activeAttrs} href="${href}">${label}</a>`;
  }).join('');
}

function renderActions() {
  return ICONS.map(({ alt, src }, index) => {
    const ariaLabel = ` aria-label="${alt}"`;
    return `<a href="#"${ariaLabel}><img src="${src}" alt="" aria-hidden="true" /></a>`;
  }).join('');
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
          <img class="site-header__logo-mark" src="${LOGO}" alt="" width="140" height="40" />
        </a>
      </div>`
    : `<div class="site-header__top-left">
        <a class="site-header__logo" href="/src/pages/index.html" aria-label="На главную">
          <img class="site-header__logo-mark" src="${LOGO}" alt="" width="140" height="40" />
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
}

renderHeader();
