const slider = document.querySelector('[data-hero-slider]');

if (slider) {
  const slides = Array.from(slider.querySelectorAll('[data-hero-slide]'));
  const prevButton = document.querySelector('.hero__controls-prev');
  const nextButton = document.querySelector('.hero__controls-next');
  const transitionDuration = 450;
  const dragThresholdRatio = 0.18;
  const dragStartThreshold = 6;

  if (slides.length > 0 && prevButton && nextButton) {
    let activeIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains('is-active')));
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

    if (activeIndex === -1) {
      activeIndex = 0;
    }

    const getIndex = (index) => (index + slides.length) % slides.length;

    const setSlideState = (slide, { active = false, leaving = false, zIndex = '', transition = '', transform = '', opacity = '' } = {}) => {
      slide.classList.toggle('is-active', active);
      slide.classList.toggle('is-leaving', leaving);

      slide.style.zIndex = zIndex;
      slide.style.transition = transition;
      slide.style.transform = transform;
      slide.style.opacity = opacity;
      slide.setAttribute('aria-hidden', active ? 'false' : 'true');
    };

    const resetSlideStyles = (slide) => {
      slide.style.zIndex = '';
      slide.style.transition = '';
      slide.style.transform = '';
      slide.style.opacity = '';
    };

    const applyBaseState = (nextActiveIndex) => {
      if (transitionTimer) {
        window.clearTimeout(transitionTimer);
        transitionTimer = null;
      }

      slides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === nextActiveIndex;
        setSlideState(slide, {
          active: isActive,
          leaving: false,
          zIndex: isActive ? '1' : '',
        });
        resetSlideStyles(slide);
      });

      activeIndex = nextActiveIndex;
      isTransitioning = false;
      slider.classList.remove('is-dragging');
    };

    const settleToIndex = (targetIndex) => {
      if (isTransitioning) {
        return;
      }

      const nextIndex = getIndex(targetIndex);
      const currentSlide = slides[activeIndex];
      const nextSlide = slides[nextIndex];

      if (nextIndex === activeIndex || !currentSlide || !nextSlide) {
        return;
      }

      isTransitioning = true;
      slider.classList.add('is-dragging');

      if (transitionTimer) {
        window.clearTimeout(transitionTimer);
        transitionTimer = null;
      }

      const movingForward = targetIndex > activeIndex;
      const offset = movingForward ? -1 : 1;
      const width = slider.getBoundingClientRect().width || 1;

      setSlideState(currentSlide, {
        leaving: true,
        zIndex: '2',
        transition: `transform ${transitionDuration}ms ease, opacity ${transitionDuration}ms ease`,
        transform: `translate3d(${offset * width}px, 0, 0)`,
        opacity: '0',
      });

      setSlideState(nextSlide, {
        active: true,
        zIndex: '3',
        transition: `transform ${transitionDuration}ms ease, opacity ${transitionDuration}ms ease`,
        transform: 'translate3d(0, 0, 0)',
        opacity: '1',
      });

      transitionTimer = window.setTimeout(() => {
        slides.forEach((slide, slideIndex) => {
          const isActive = slideIndex === nextIndex;
          setSlideState(slide, {
            active: isActive,
            leaving: false,
            zIndex: isActive ? '1' : '',
          });
          resetSlideStyles(slide);
        });

        activeIndex = nextIndex;
        isTransitioning = false;
        slider.classList.remove('is-dragging');
        transitionTimer = null;
      }, transitionDuration);
    };

    const beginDrag = (event) => {
      if (isTransitioning) {
        return;
      }

      if (event.button !== 0 && event.pointerType === 'mouse') {
        return;
      }

      if (event.target.closest('a,button,input,textarea,select,label')) {
        return;
      }

      pointerId = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
      currentX = event.clientX;
      dragDirection = 0;
      dragging = true;
      dragStarted = false;
      dragWidth = slider.getBoundingClientRect().width || 1;

      slider.setPointerCapture(pointerId);
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
        slider.classList.add('is-dragging');
      }

      event.preventDefault();

      const progress = Math.max(-1, Math.min(1, deltaX / dragWidth));
      const absProgress = Math.abs(progress);
      const currentSlide = slides[activeIndex];
      const targetSlide = slides[getIndex(activeIndex + dragDirection)];
      const targetOffset = dragDirection === 1 ? dragWidth : -dragWidth;

      slides.forEach((slide, slideIndex) => {
        if (slideIndex !== activeIndex && slideIndex !== getIndex(activeIndex + dragDirection)) {
          setSlideState(slide, {
            active: false,
            leaving: false,
            zIndex: '',
            transition: 'none',
            transform: 'translate3d(0, 0, 0)',
            opacity: '0',
          });
        }
      });

      if (currentSlide) {
        setSlideState(currentSlide, {
          active: true,
          leaving: false,
          zIndex: '2',
          transition: 'none',
          transform: `translate3d(${deltaX}px, 0, 0)`,
          opacity: `${1 - absProgress}`,
        });
      }

      if (targetSlide) {
        setSlideState(targetSlide, {
          active: false,
          leaving: false,
          zIndex: '3',
          transition: 'none',
          transform: `translate3d(${targetOffset + deltaX}px, 0, 0)`,
          opacity: `${absProgress}`,
        });
      }
    };

    const endDrag = (event) => {
      if (!dragging || event.pointerId !== pointerId) {
        return;
      }

      dragging = false;

      if (slider.hasPointerCapture(pointerId)) {
        slider.releasePointerCapture(pointerId);
      }

      const deltaX = currentX - startX;
      const threshold = dragWidth * dragThresholdRatio;
      const shouldChange = dragStarted && Math.abs(deltaX) > threshold;

      if (shouldChange) {
        settleToIndex(activeIndex + dragDirection);
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

    prevButton.addEventListener('click', () => {
      settleToIndex(activeIndex - 1);
    });

    nextButton.addEventListener('click', () => {
      settleToIndex(activeIndex + 1);
    });

    slider.addEventListener('pointerdown', beginDrag);
    slider.addEventListener('pointermove', updateDrag);
    slider.addEventListener('pointerup', endDrag);
    slider.addEventListener('pointercancel', endDrag);

    applyBaseState(activeIndex);
  }
}
