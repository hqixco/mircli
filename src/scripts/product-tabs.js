const tabs = Array.from(document.querySelectorAll('.product-tabs a'));
const overview = document.querySelector('.product-overview');

if (tabs.length > 0 && overview) {
  const panes = Array.from(overview.querySelectorAll('[data-product-tab]'));
  const defaultTab = tabs.findIndex((tab) => tab.classList.contains('is-active'));
  let activeIndex = defaultTab >= 0 ? defaultTab : 0;

  const activateTab = (index) => {
    activeIndex = (index + tabs.length) % tabs.length;

    tabs.forEach((tab, tabIndex) => {
      tab.classList.toggle('is-active', tabIndex === activeIndex);
      tab.setAttribute('aria-selected', String(tabIndex === activeIndex));
      tab.tabIndex = tabIndex === activeIndex ? 0 : -1;
    });

    panes.forEach((pane, paneIndex) => {
      pane.hidden = paneIndex !== activeIndex;
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', (event) => {
      event.preventDefault();
      activateTab(index);
    });
  });

  activateTab(activeIndex);
}
