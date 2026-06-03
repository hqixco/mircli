const inactiveFavoriteIcon = new URL('../images/favorite-icon.svg', import.meta.url).href;
const activeFavoriteIcon = new URL('../images/favorite-icon-active.svg', import.meta.url).href;
const productPageHref = '/src/pages/product.html';

function setFavoriteState(icon, isActive) {
  icon.dataset.favoriteActive = String(isActive);
  icon.src = isActive ? activeFavoriteIcon : inactiveFavoriteIcon;
  icon.setAttribute('aria-pressed', String(isActive));
  icon.classList.toggle('is-favorite', isActive);
}

document.querySelectorAll('.product-card__icons, .product-summary__icons').forEach((icons) => {
  const favoriteIcon = icons.querySelector('img:first-child');

  if (!favoriteIcon) {
    return;
  }

  favoriteIcon.tabIndex = 0;
  favoriteIcon.setAttribute('role', 'button');
  favoriteIcon.setAttribute('aria-pressed', 'false');
  favoriteIcon.dataset.favoriteActive = 'false';

  favoriteIcon.addEventListener('click', () => {
    setFavoriteState(favoriteIcon, favoriteIcon.dataset.favoriteActive !== 'true');
  });

  favoriteIcon.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setFavoriteState(favoriteIcon, favoriteIcon.dataset.favoriteActive !== 'true');
    }
  });
});

document.querySelectorAll('.product-card').forEach((card) => {
  if (card.classList.contains('product-card--empty')) {
    return;
  }

  card.style.cursor = 'pointer';

  card.addEventListener('click', (event) => {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    if (target.closest('.product-card__buttons a, .product-card__icons img, .product-card__icons [role="button"], .product-card__link')) {
      return;
    }

    window.location.href = productPageHref;
  });
});
