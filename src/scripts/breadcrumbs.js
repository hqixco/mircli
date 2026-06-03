function renderBreadcrumbs() {
  document.querySelectorAll('[data-breadcrumbs]').forEach((host) => {
    const raw = host.getAttribute('data-breadcrumbs') || '[]';

    let items = [];

    try {
      items = JSON.parse(raw);
    } catch {
      items = [];
    }

    host.innerHTML = items
      .map((item, index) => {
        const isLast = index === items.length - 1;

        if (!item.href || isLast) {
          return `<span class="breadcrumbs__current">${item.label}</span>`;
        }

        return `<a href="${item.href}">${item.label}</a>`;
      })
      .join(' <span class="breadcrumbs__separator" aria-hidden="true">-</span> ');
  });
}

renderBreadcrumbs();
