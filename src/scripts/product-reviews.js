function initProductReviews(section) {
  const grid = section.querySelector('.product-reviews__grid');
  const navButtons = Array.from(section.querySelectorAll('.product-reviews__nav button'));

  if (!grid || navButtons.length < 2) {
    return;
  }

  const cards = Array.from(grid.querySelectorAll('.review-card'));

  if (cards.length === 0) {
    return;
  }

  const getStep = () => cards[0].getBoundingClientRect().width || 1;
  const getMaxScroll = () => Math.max(0, grid.scrollWidth - grid.clientWidth);

  const updateNavState = () => {
    const maxScroll = getMaxScroll();
    const currentScroll = grid.scrollLeft;
    const atStart = currentScroll <= 1;
    const atEnd = currentScroll >= maxScroll - 1;

    navButtons[0].disabled = atStart || maxScroll === 0;
    navButtons[1].disabled = atEnd || maxScroll === 0;
    navButtons[0].setAttribute('aria-disabled', String(navButtons[0].disabled));
    navButtons[1].setAttribute('aria-disabled', String(navButtons[1].disabled));
  };

  const scrollByCard = (direction) => {
    const step = getStep();
    grid.scrollBy({
      left: direction * step,
      behavior: 'smooth',
    });
  };

  navButtons[0].addEventListener('click', () => {
    scrollByCard(-1);
  });

  navButtons[1].addEventListener('click', () => {
    scrollByCard(1);
  });

  grid.addEventListener('scroll', updateNavState, { passive: true });
  window.addEventListener('resize', updateNavState);

  updateNavState();
}

document.querySelectorAll('.product-reviews').forEach(initProductReviews);
