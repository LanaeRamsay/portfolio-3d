(function () {
  'use strict';

  const header = document.getElementById('header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav__link');
  const sections = document.querySelectorAll('section[id]');

  const backdrop = document.createElement('div');
  backdrop.className = 'nav__backdrop';
  backdrop.setAttribute('aria-hidden', 'true');
  document.body.appendChild(backdrop);

  function setMenu(open) {
    navToggle.setAttribute('aria-expanded', open);
    navMenu.classList.toggle('open', open);
    backdrop.classList.toggle('visible', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  navToggle.addEventListener('click', function () {
    setMenu(navToggle.getAttribute('aria-expanded') !== 'true');
  });
  backdrop.addEventListener('click', function () { setMenu(false); });
  navLinks.forEach(function (link) { link.addEventListener('click', function () { setMenu(false); }); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !(window.portfolioViewer && window.portfolioViewer.isOpen())) setMenu(false);
  });

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 50);
    const scrollPos = window.scrollY + header.offsetHeight + 100;
    let current = '';
    sections.forEach(function (section) {
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        current = section.id;
      }
    });
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }

  let ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { onScroll(); ticking = false; });
  }, { passive: true });

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(function (el) { revealObserver.observe(el); });

  const softwareList = document.getElementById('software-list');
  if (softwareList && typeof SOFTWARE_SKILLS !== 'undefined') {
    softwareList.innerHTML = SOFTWARE_SKILLS.map(function (item) {
      return '<li class="software-list__item card"><span class="software-list__name">' + item[0] +
        '</span><div class="software-list__bar"><div class="software-list__fill" style="--level:' + item[1] + '%"></div></div></li>';
    }).join('');
  }

  onScroll();
  setTimeout(function () {
    var aboutReveal = document.querySelector('.about .reveal');
    if (aboutReveal) aboutReveal.classList.add('visible');
  }, 200);
})();
