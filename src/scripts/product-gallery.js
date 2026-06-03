function initProductGallery(gallery) {
  const main = gallery.querySelector('.product-gallery__main');
  const mainImage = gallery.querySelector('.product-gallery__main > img');
  const navButtons = Array.from(gallery.querySelectorAll('.product-gallery__nav'));
  const thumbs = Array.from(gallery.querySelectorAll('.product-gallery__thumbs img'));

  if (!main || !mainImage || navButtons.length < 2 || thumbs.length === 0) {
    return;
  }

  const sources = thumbs.map((thumb) => thumb.getAttribute('src') || '');
  const alts = thumbs.map((thumb) => thumb.getAttribute('alt') || '');
  const count = thumbs.length;
  const transitionDuration = 420;
  const dragThresholdRatio = 0.18;
  const dragStartThreshold = 6;
  let activeIndex = Math.max(0, thumbs.findIndex((thumb) => thumb.classList.contains('is-active')));
  let isTransitioning = false;
  let transitionTimer = null;
  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let dragDirection = 0;
  let dragging = false;
  let dragStarted = false;
  let dragWidth = 0;
  let previewImage = null;

  if (activeIndex < 0) {
    activeIndex = 0;
  }

  if (!mainImage.style.position) {
    mainImage.style.position = 'absolute';
  }

  previewImage = document.createElement('img');
  previewImage.className = 'product-gallery__drag-preview';
  previewImage.alt = '';
  previewImage.setAttribute('aria-hidden', 'true');
  previewImage.style.display = 'none';
  main.appendChild(previewImage);

  const getIndex = (index) => (index + count) % count;

  const setImageState = (image, { active = false, preview = false, transition = '', transform = '', zIndex = '', display = '' } = {}) => {
    image.classList.toggle('is-active', active);
    image.classList.toggle('is-preview', preview);
    image.style.transition = transition;
    image.style.transform = transform;
    image.style.zIndex = zIndex;
    image.style.display = display;
    image.setAttribute('aria-hidden', active ? 'false' : 'true');
  };

  const resetImageStyles = (image) => {
    image.style.transition = '';
    image.style.transform = '';
    image.style.zIndex = '';
    image.style.display = '';
  };

  function sync() {
    mainImage.src = sources[activeIndex];
    mainImage.alt = alts[activeIndex] || mainImage.alt;

    thumbs.forEach((thumb, index) => {
      thumb.classList.toggle('is-active', index === activeIndex);
    });
  }

  const applyBaseState = (nextActiveIndex) => {
    if (transitionTimer) {
      window.clearTimeout(transitionTimer);
      transitionTimer = null;
    }

    activeIndex = nextActiveIndex;
    sync();

    setImageState(mainImage, {
      active: true,
      preview: false,
      zIndex: '1',
      display: '',
    });
    resetImageStyles(mainImage);

    if (previewImage) {
      setImageState(previewImage, {
      active: false,
      preview: false,
      zIndex: '',
      display: 'none',
    });
      resetImageStyles(previewImage);
    }

    isTransitioning = false;
    gallery.classList.remove('is-dragging');
  };

  const getShortestDirection = (fromIndex, toIndex) => {
    const forwardDistance = (toIndex - fromIndex + count) % count;
    const backwardDistance = (fromIndex - toIndex + count) % count;

    if (forwardDistance === 0) {
      return 0;
    }

    if (forwardDistance <= backwardDistance) {
      return 1;
    }

    return -1;
  };

  const settleToIndex = (targetIndex, direction, startOffset = 0) => {
    if (isTransitioning) {
      return;
    }

    const nextIndex = getIndex(targetIndex);

    if (nextIndex === activeIndex) {
      return;
    }

    const effectiveDirection = direction || getShortestDirection(activeIndex, nextIndex);
    const offset = effectiveDirection === 1 ? -1 : 1;
    const width = main.getBoundingClientRect().width || 1;

    isTransitioning = true;
    gallery.classList.add('is-dragging');

    if (transitionTimer) {
      window.clearTimeout(transitionTimer);
      transitionTimer = null;
    }

    previewImage.src = sources[nextIndex];
    previewImage.alt = alts[nextIndex] || '';
    previewImage.style.display = 'block';

    const startPreviewOffset = startOffset + (effectiveDirection === 1 ? width : -width);
    const finalMainOffset = effectiveDirection === 1 ? -width : width;

    setImageState(mainImage, {
      active: true,
      preview: false,
      zIndex: '2',
      transition: 'none',
      transform: `translate3d(${startOffset}px, 0, 0)`,
    });

    setImageState(previewImage, {
      active: false,
      preview: true,
      zIndex: '3',
      transition: 'none',
      transform: `translate3d(${startPreviewOffset}px, 0, 0)`,
    });

    main.getBoundingClientRect();

    window.requestAnimationFrame(() => {
      setImageState(mainImage, {
        active: true,
        preview: false,
        zIndex: '2',
        transition: `transform ${transitionDuration}ms ease`,
        transform: `translate3d(${finalMainOffset}px, 0, 0)`,
      });

      setImageState(previewImage, {
        active: false,
        preview: true,
        zIndex: '3',
        transition: `transform ${transitionDuration}ms ease`,
        transform: 'translate3d(0, 0, 0)',
      });
    });

    transitionTimer = window.setTimeout(() => {
      activeIndex = nextIndex;
      sync();
      applyBaseState(activeIndex);
    }, transitionDuration);
  };

  const beginDrag = (event) => {
    if (isTransitioning) {
      return;
    }

    if (event.button !== 0 && event.pointerType === 'mouse') {
      return;
    }

    if (event.target.closest('button, a, input, textarea, select, label')) {
      return;
    }

    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    currentX = event.clientX;
    dragDirection = 0;
    dragging = true;
    dragStarted = false;
    dragWidth = main.getBoundingClientRect().width || 1;

    main.setPointerCapture(pointerId);
  };

  const updateDrag = (event) => {
    if (!dragging || event.pointerId !== pointerId || isTransitioning) {
      return;
    }

    currentX = event.clientX;
    const deltaX = currentX - startX;
    const deltaY = event.clientY - startY;

    if (!dragStarted) {
      if (Math.abs(deltaX) < dragStartThreshold || Math.abs(deltaX) < Math.abs(deltaY)) {
        return;
      }

      dragStarted = true;
      dragDirection = deltaX < 0 ? 1 : -1;
      gallery.classList.add('is-dragging');

      const targetIndex = getIndex(activeIndex + dragDirection);
      previewImage.src = sources[targetIndex];
      previewImage.alt = alts[targetIndex] || '';
      previewImage.style.display = 'block';
    }

    event.preventDefault();

    const progress = Math.max(-1, Math.min(1, deltaX / dragWidth));
    const absProgress = Math.abs(progress);
    const targetOffset = dragDirection === 1 ? dragWidth : -dragWidth;

    setImageState(mainImage, {
      active: true,
      preview: false,
      zIndex: '2',
      transition: 'none',
      transform: `translate3d(${deltaX}px, 0, 0)`,
    });

    setImageState(previewImage, {
      active: false,
      preview: true,
      zIndex: '3',
      transition: 'none',
      transform: `translate3d(${targetOffset + deltaX}px, 0, 0)`,
      display: 'block',
    });
  };

  const endDrag = (event) => {
    if (!dragging || event.pointerId !== pointerId) {
      return;
    }

    dragging = false;

    if (main.hasPointerCapture(pointerId)) {
      main.releasePointerCapture(pointerId);
    }

    const deltaX = currentX - startX;
    const threshold = dragWidth * dragThresholdRatio;
    const shouldChange = dragStarted && Math.abs(deltaX) > threshold;

    if (shouldChange) {
      settleToIndex(activeIndex + dragDirection, dragDirection, deltaX);
    } else {
      applyBaseState(activeIndex);
    }

    pointerId = null;
    dragStarted = false;
    dragDirection = 0;
    currentX = 0;
    startX = 0;
    startY = 0;
    dragWidth = 0;
  };

  navButtons[0].addEventListener('click', () => {
    settleToIndex(activeIndex - 1, -1, 0);
  });

  navButtons[1].addEventListener('click', () => {
    settleToIndex(activeIndex + 1, 1, 0);
  });

  thumbs.forEach((thumb, index) => {
    thumb.addEventListener('click', () => {
      if (isTransitioning) {
        return;
      }

      if (index === activeIndex) {
        return;
      }

      const direction = index > activeIndex ? 1 : -1;
      settleToIndex(index, direction, 0);
    });
  });

  main.addEventListener('pointerdown', beginDrag);
  main.addEventListener('pointermove', updateDrag);
  main.addEventListener('pointerup', endDrag);
  main.addEventListener('pointercancel', endDrag);

  sync();
  applyBaseState(activeIndex);
}

document.querySelectorAll('.product-gallery').forEach(initProductGallery);
