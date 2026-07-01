(function () {
  'use strict';

  function observeIn(container, selector, options) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, options);
    container.querySelectorAll(selector).forEach(function (el) { observer.observe(el); });
    return observer;
  }

  /* Gallery */
  const gallery = document.querySelector('.gallery');
  if (gallery && typeof PORTFOLIO_ORDER !== 'undefined') {
    gallery.innerHTML = PORTFOLIO_ORDER.map(function (id, index) {
      const p = PORTFOLIO_PROJECTS[id];
      return '<article class="gallery__item reveal" role="listitem" style="animation-delay:' + (index * 0.08) + 's">' +
        '<div class="gallery__card" data-project="' + id + '">' +
          '<div class="gallery__image-wrap">' +
            '<img src="' + p.thumb + '" alt="' + p.alt + '" class="gallery__image" loading="lazy" width="800" height="450">' +
            '<div class="gallery__overlay"><button type="button" class="gallery__view">View Project</button></div>' +
          '</div>' +
          '<div class="gallery__info"><h3 class="gallery__title">' + p.title + '</h3>' +
          '<p class="gallery__desc">' + p.description + '</p></div>' +
        '</div></article>';
    }).join('');
  }

  /* Project viewer */
  const viewer = document.getElementById('project-viewer');
  if (!viewer) return;

  const els = {
    backdrop: viewer.querySelector('.project-viewer__backdrop'),
    close: viewer.querySelector('.project-viewer__close'),
    title: viewer.querySelector('.project-viewer__title'),
    desc: viewer.querySelector('.project-viewer__desc'),
    scroll: viewer.querySelector('.project-viewer__scroll'),
    gallery: viewer.querySelector('.project-viewer__gallery'),
    counter: viewer.querySelector('.project-viewer__counter'),
    progress: viewer.querySelector('.project-viewer__progress-bar')
  };

  let isOpen = false;
  let lastFocus = null;
  let imageObserver = null;

  function buildGallery(images, title) {
    els.gallery.innerHTML = images.map(function (src, i) {
      return '<figure class="project-viewer__figure reveal-image">' +
        '<img class="project-viewer__image" src="' + src + '" alt="' + title + ' — image ' + (i + 1) + '"' +
        ' loading="' + (i < 2 ? 'eager' : 'lazy') + '" decoding="async">' +
      '</figure>';
    }).join('');
  }

  function observeImages() {
    if (imageObserver) imageObserver.disconnect();
    imageObserver = observeIn(els.gallery, '.reveal-image', {
      root: els.scroll, threshold: 0.15, rootMargin: '0px 0px -20px 0px'
    });
  }

  function updateProgress() {
    const max = els.scroll.scrollHeight - els.scroll.clientHeight;
    els.progress.style.transform = 'scaleX(' + (max > 0 ? els.scroll.scrollTop / max : 0) + ')';
  }

  function open(projectId) {
    const project = PORTFOLIO_PROJECTS[projectId];
    if (!project || isOpen) return;

    lastFocus = document.activeElement;
    isOpen = true;
    els.title.textContent = project.title;
    els.desc.textContent = project.description;
    els.counter.textContent = project.images.length + (project.images.length === 1 ? ' image' : ' images');
    buildGallery(project.images, project.title);
    els.scroll.scrollTop = 0;
    els.progress.style.transform = 'scaleX(0)';
    viewer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('viewer-open');
    requestAnimationFrame(function () {
      viewer.classList.add('is-open');
      observeImages();
      els.close.focus();
    });
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    viewer.classList.remove('is-open');
    viewer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('viewer-open');
    if (imageObserver) imageObserver.disconnect();
    setTimeout(function () {
      els.gallery.innerHTML = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }, 450);
  }

  var galleryEl = document.querySelector('.gallery');
  if (galleryEl) galleryEl.addEventListener('click', function (e) {
    const card = e.target.closest('[data-project]');
    if (!card || !e.target.closest('.gallery__view, .gallery__overlay, .gallery__image-wrap')) return;
    e.preventDefault();
    open(card.getAttribute('data-project'));
  });

  els.close.addEventListener('click', close);
  els.backdrop.addEventListener('click', close);
  els.scroll.addEventListener('scroll', updateProgress, { passive: true });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) { e.stopImmediatePropagation(); close(); }
  }, true);

  viewer.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab' || !isOpen) return;
    const focusable = viewer.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  window.portfolioViewer = { open: open, close: close, isOpen: function () { return isOpen; } };
})();
