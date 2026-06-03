function initCatalogFilters() {
  const filters = Array.from(document.querySelectorAll('.catalog-filter'));

  if (!filters.length) {
    return;
  }

  const setOpenState = (filter, isOpen) => {
    filter.classList.toggle('is-open', isOpen);
    const head = filter.querySelector('.catalog-filter__head');
    head?.classList.toggle('is-open', isOpen);
  };

  filters.forEach((filter, index) => {
    const head = filter.querySelector('.catalog-filter__head');
    const body = filter.querySelector('.catalog-filter__body');

    if (!head) {
      return;
    }

    head.setAttribute('role', 'button');
    head.setAttribute('tabindex', '0');
    head.setAttribute('aria-expanded', index === 0 ? 'true' : 'false');

    if (body) {
      const bodyId = `catalog-filter-body-${index}`;
      body.id = bodyId;
      head.setAttribute('aria-controls', bodyId);
    }

    setOpenState(filter, index === 0);

    const toggle = () => {
      const nextState = !filter.classList.contains('is-open');
      setOpenState(filter, nextState);
      head.setAttribute('aria-expanded', nextState ? 'true' : 'false');
    };

    head.addEventListener('click', toggle);
    head.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggle();
      }
    });
  });
}

initCatalogFilters();
