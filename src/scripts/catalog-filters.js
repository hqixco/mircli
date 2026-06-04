function initCatalogFilters() {
  const filters = Array.from(document.querySelectorAll('.catalog-filter'));
  const toggleButton = document.querySelector('.catalog-filters__toggle');
  const panel = document.querySelector('.catalog-filters');
  const backdrop = document.querySelector('.catalog-filters__backdrop');

  if (!filters.length) {
    return;
  }

  const mobileQuery = window.matchMedia('(max-width: 720px)');

  const setPanelOpen = (isOpen) => {
    document.body.classList.toggle('catalog-filters-open', isOpen);
    toggleButton?.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    if (backdrop) {
      backdrop.hidden = !isOpen;
    }
  };

  const closePanel = () => setPanelOpen(false);

  toggleButton?.addEventListener('click', () => {
    const isOpen = document.body.classList.contains('catalog-filters-open');
    setPanelOpen(!isOpen);
  });

  backdrop?.addEventListener('click', closePanel);

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closePanel();
    }
  });

  mobileQuery.addEventListener('change', (event) => {
    if (!event.matches) {
      closePanel();
    }
  });

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
    head.setAttribute('aria-expanded', 'true');

    if (body) {
      const bodyId = `catalog-filter-body-${index}`;
      body.id = bodyId;
      head.setAttribute('aria-controls', bodyId);
    }

    setOpenState(filter, true);

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

  if (!mobileQuery.matches) {
    setPanelOpen(false);
  }
}

initCatalogFilters();
