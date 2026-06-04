function initAwardsGallery() {
  const modal = document.querySelector('#site-modal');
  const modalImage = modal?.querySelector('[data-modal-image]');
  const cards = Array.from(document.querySelectorAll('.about-awards__grid img'));

  if (!(modal instanceof HTMLElement) || !(modalImage instanceof HTMLImageElement) || cards.length === 0) {
    return;
  }

  const openModal = (image) => {
    modal.classList.remove('modal--video');
    modal.classList.add('modal--image');

    modalImage.src = image.currentSrc || image.src;
    modalImage.alt = image.alt || 'Сертификат';
    modalImage.hidden = false;

    modal.classList.add('is-open');
    document.documentElement.classList.add('is-scroll-locked');
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    document.documentElement.classList.remove('is-scroll-locked');

    window.setTimeout(() => {
      if (!modal.classList.contains('is-open')) {
        modalImage.src = '';
        modalImage.alt = '';
        modalImage.hidden = true;
      }
    }, 220);

    modal.classList.remove('modal--image', 'modal--video');
  };

  cards.forEach((card) => {
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `${card.alt || 'Сертификат'}: открыть изображение`);

    card.addEventListener('click', () => openModal(card));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openModal(card);
      }
    });
  });

  document.addEventListener('click', (event) => {
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (target.closest('[data-modal-close]')) {
      closeModal();
      return;
    }

    if (target.classList.contains('modal__overlay')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') {
      return;
    }

    if (!modal.classList.contains('is-open')) {
      return;
    }

    closeModal();
  });
}

initAwardsGallery();
