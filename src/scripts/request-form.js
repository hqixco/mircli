import './request-form-mask.js';

const selectSelector = '.request-form__select';
const triggerSelector = '[data-request-select-trigger]';

const setSelectOpenState = (select, isOpen) => {
  const panel = select.querySelector('.request-form__select-panel');
  const trigger = select.querySelector(triggerSelector);

  select.classList.toggle('request-form__select--open', isOpen);

  if (trigger instanceof HTMLButtonElement) {
    trigger.setAttribute('aria-expanded', String(isOpen));
  }

  if (panel instanceof HTMLElement) {
    panel.hidden = !isOpen;
  }
};

const closeOtherSelects = (currentSelect) => {
  document.querySelectorAll(`${selectSelector}.request-form__select--open`).forEach((select) => {
    if (select instanceof HTMLElement && select !== currentSelect) {
      setSelectOpenState(select, false);
    }
  });
};

document.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  const trigger = event.target.closest(triggerSelector);

  if (trigger instanceof HTMLElement) {
    const select = trigger.closest(selectSelector);

    if (select instanceof HTMLElement) {
      event.preventDefault();
      closeOtherSelects(select);
      setSelectOpenState(select, !select.classList.contains('request-form__select--open'));
    }

    return;
  }

  const radio = event.target.closest('.request-form__radio');

  if (radio instanceof HTMLElement) {
    const select = radio.closest(selectSelector);

    if (select instanceof HTMLElement) {
      setSelectOpenState(select, false);
    }
    return;
  }

  const select = event.target.closest(selectSelector);

  if (!(select instanceof HTMLElement)) {
    document.querySelectorAll(`${selectSelector}.request-form__select--open`).forEach((openSelect) => {
      if (openSelect instanceof HTMLElement) {
        setSelectOpenState(openSelect, false);
      }
    });
  }
});
