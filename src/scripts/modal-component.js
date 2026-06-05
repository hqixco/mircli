const modalSelector = '[data-modal]';
const openSelector = '[data-modal-open]';
const closeSelector = '[data-modal-close]';

const setModalState = (modal, isOpen) => {
  modal.classList.toggle('is-open', isOpen);
  modal.setAttribute('aria-hidden', String(!isOpen));
};

const updateScrollLock = () => {
  const hasOpenModal = document.querySelector(`${modalSelector}.is-open`);

  document.documentElement.classList.toggle('is-scroll-locked', Boolean(hasOpenModal));
};

const openModal = (modal) => {
  if (!(modal instanceof HTMLElement)) {
    return;
  }

  setModalState(modal, true);
  updateScrollLock();
};

const closeModal = (modal) => {
  if (!(modal instanceof HTMLElement)) {
    return;
  }

  setModalState(modal, false);
  updateScrollLock();
};

const findModalByName = (name) => {
  if (!name) {
    return null;
  }

  return document.querySelector(`${modalSelector}#${CSS.escape(name)}`);
};

document.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  const openTrigger = event.target.closest(openSelector);

  if (openTrigger instanceof HTMLElement) {
    const modal = findModalByName(openTrigger.getAttribute('data-modal-open'));

    if (modal instanceof HTMLElement) {
      event.preventDefault();
      openModal(modal);
    }

    return;
  }

  const closeTrigger = event.target.closest(closeSelector);

  if (closeTrigger instanceof HTMLElement) {
    const modal = closeTrigger.closest(modalSelector);

    if (modal instanceof HTMLElement) {
      event.preventDefault();
      closeModal(modal);
    }

    return;
  }

  const modal = event.target.closest(modalSelector);

  if (modal instanceof HTMLElement && event.target === modal) {
    closeModal(modal);
  }
});

window.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') {
    return;
  }

  const openModals = Array.from(document.querySelectorAll(`${modalSelector}.is-open`));
  const topmostModal = openModals.at(-1);

  if (topmostModal instanceof HTMLElement) {
    closeModal(topmostModal);
  }
});

