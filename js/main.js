/* FRAXEL: interacciones livianas, sin dependencias externas. */
(() => {
  'use strict';
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const query = (selector) => document.querySelector(selector);
  const all = (selector) => Array.from(document.querySelectorAll(selector));
  const WA_NUMBER = '51902707751';
  const makeWhatsAppUrl = (message) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;

  // Mantener el año correcto sin mantenimiento manual.
  const year = query('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Menú para tablets y zoom. Se cierra al elegir sección o pulsar Escape.
  const menuButton = query('.menu-toggle');
  const mobileMenu = query('#mobile-menu');
  const setMenu = (open) => {
    if (!mobileMenu || !menuButton) return;
    mobileMenu.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    menuButton.querySelector('use')?.setAttribute('href', open ? '#i-close' : '#i-menu');
  };
  menuButton?.addEventListener('click', () => setMenu(mobileMenu.hidden));
  mobileMenu?.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });
  document.addEventListener('click', (event) => {
    if (!mobileMenu?.hidden && !event.target.closest('#mobile-menu, .menu-toggle')) setMenu(false);
  });

  // Entradas escalonadas al hacer scroll: cada elemento se revela una sola vez.
  if (!reduceMotion && 'IntersectionObserver' in window) {
    root.classList.add('motion-ready');
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
    all('.reveal').forEach(el => revealObserver.observe(el));
  }

  // Iluminación LED contextual para tarjetas (hover, teclado, toque).
  all('.led-card').forEach(card => {
    card.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'touch') return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
      card.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
    }, { passive: true });
    if ('ontouchstart' in window) {
      card.addEventListener('pointerdown', () => {
        card.classList.add('is-lit');
        window.setTimeout(() => card.classList.remove('is-lit'), 700);
      }, { passive: true });
    }
  });

  // CTA inteligente: al seleccionar un plan, WhatsApp sabe qué plan interesa.
  const contactWhatsApp = query('#contact-whatsapp');
  all('[data-plan]').forEach(link => {
    link.addEventListener('click', () => {
      const plan = link.dataset.plan;
      const greeting = plan === 'Tu idea'
        ? 'Hola, FRAXEL. Tengo una idea para un proyecto web personalizado y me gustaría contarles de qué se trata.'
        : `Hola, FRAXEL. Me interesa el plan ${plan}. ¿Podrían contarme más detalles y orientarme con una cotización?`;
      if (contactWhatsApp) contactWhatsApp.href = makeWhatsAppUrl(greeting);
    });
  });
  const sectionLinks = all('.main-nav a, .bottom-nav a');
  const ids = ['inicio', 'nosotros', 'beneficios', 'planes', 'portafolio', 'proceso', 'preguntas', 'contacto'];
  if ('IntersectionObserver' in window) {
    const activeObserver = new IntersectionObserver((entries) => {
      const current = entries.filter(x => x.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!current) return;
      const id = current.target.id;
      sectionLinks.forEach(link => {
        const isCurrent = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('active', isCurrent);
        link.classList.toggle('is-current', isCurrent);
        if (isCurrent) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { threshold: [0.1,0.3,0.5], rootMargin:'-18% 0px -52% 0px' });
    ids.map(id => document.getElementById(id)).filter(Boolean).forEach(section => activeObserver.observe(section));
  }

  // El video real de Anthony aparece sólo al llegar a Sobre mí. Termina y queda congelado.
  const video = query('#anthony-video');
  if (video && !reduceMotion) {
    const mobileLayout = window.matchMedia('(max-width:760px)');
    let observer;
    const selectVideo = () => {
      observer?.disconnect();
      const source = mobileLayout.matches ? video.dataset.mobile : video.dataset.desktop;
      video.classList.remove('is-playing', 'is-finished');
      video.src = source;
      video.load();
      const playOnce = () => {
        video.play().then(() => {
          if (video.getAttribute('src') === source && !video.ended) video.classList.add('is-playing');
        }).catch(() => {});
      };
      if ('IntersectionObserver' in window) {
        observer = new IntersectionObserver((entries, current) => {
          if (current !== observer || !entries.some(entry => entry.isIntersecting)) return;
          current.disconnect();
          playOnce();
        }, { threshold: 0.38 });
        observer.observe(query('.about-media'));
      } else playOnce();
    };
    video.addEventListener('ended', () => {
      video.classList.remove('is-playing');
      video.classList.add('is-finished');
    });
    mobileLayout.addEventListener('change', selectVideo);
    selectVideo();
  }

  // Línea de progreso en la sección del proceso.
  const process = query('#process-steps');
  const progressBar = query('.steps-progress span');
  if (process && progressBar && !reduceMotion) {
    let scheduled = false;
    const update = () => {
      const r = process.getBoundingClientRect();
      const v = Math.max(0, Math.min(1, (window.innerHeight * .76 - r.top) / (r.height + window.innerHeight * .24)));
      const isVertical = window.matchMedia('(max-width:760px)').matches;
      progressBar.style.transform = isVertical ? `scaleY(${v})` : `scaleX(${v})`;
      scheduled = false;
    };
    const schedule = () => { if (!scheduled) { scheduled = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', schedule, {passive:true});
    window.addEventListener('resize', schedule, {passive:true});
    update();
  }

  // Un acordeón abierto a la vez para evitar una columna interminable.
  all('.faq-item').forEach(item => item.addEventListener('toggle', () => {
    if (item.open) all('.faq-item').filter(other => other !== item).forEach(other => other.open = false);
  }));
})();
