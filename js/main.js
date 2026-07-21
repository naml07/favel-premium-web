/* ============================================================
   FAVEL — Main JavaScript
   Navigation, interactions, utilities
   ============================================================ */

'use strict';

// ─── CONSTANTS ────────────────────────────────────────────────
const WHATSAPP_NUMBER = '22890000000'; // À remplacer par le vrai numéro

// ─── DOM Ready ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initPageLoader();
  initNavigation();
  initCustomCursor();
  initScrollEffects();
  initRippleButtons();
  initWhatsAppFloat();
  initScrollTop();
  initAccordions();
  setActiveNavLink();
});

// ─── PAGE LOADER ──────────────────────────────────────────────
function initPageLoader() {
  const loader = document.querySelector('.page-loader');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('loaded');
    }, 600);
  });

  // Fallback
  setTimeout(() => {
    if (loader) loader.classList.add('loaded');
  }, 2500);
}

// ─── NAVIGATION ───────────────────────────────────────────────
function initNavigation() {
  const nav       = document.querySelector('.nav');
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile');
  const mobileLinks = document.querySelectorAll('.nav__mobile-link');

  if (!nav) return;

  // Scroll behavior
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });

  // Mobile menu toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.contains('open');
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Close on link click
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on backdrop click
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // Keyboard escape to close menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu?.classList.contains('open')) {
      hamburger?.classList.remove('open');
      mobileMenu?.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

// ─── SET ACTIVE NAV LINK ──────────────────────────────────────
function setActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav__link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ─── CUSTOM CURSOR ────────────────────────────────────────────
function initCustomCursor() {
  // Only on desktop with fine pointer
  if (!window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches) return;

  const cursor   = document.createElement('div');
  const follower = document.createElement('div');
  cursor.className   = 'cursor';
  follower.className = 'cursor-follower';
  document.body.appendChild(cursor);
  document.body.appendChild(follower);

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth follower
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover effects
  const hoverTargets = 'a, button, [role="button"], .card, .product-card, .pack-card, input, textarea, .filter-tab';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor-hover');
      follower.classList.add('cursor-follower-hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-hover');
      follower.classList.remove('cursor-follower-hover');
    });
  });
}

// ─── SCROLL EFFECTS ───────────────────────────────────────────
function initScrollEffects() {
  // Reveal animations
  const reveals = document.querySelectorAll('[data-reveal]');
  const staggerGroups = document.querySelectorAll('[data-stagger]');

  if (!('IntersectionObserver' in window)) {
    // Fallback
    reveals.forEach(el => el.classList.add('revealed'));
    staggerGroups.forEach(el => el.classList.add('revealed'));
    return;
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, parseInt(delay));
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  });

  reveals.forEach(el => revealObserver.observe(el));
  staggerGroups.forEach(el => revealObserver.observe(el));

  // Stat counter animation
  initCounters();
}

// ─── COUNTER ANIMATION ────────────────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));
}

function animateCounter(el) {
  const target   = parseInt(el.dataset.count, 10);
  const suffix   = el.dataset.suffix || '';
  const duration = 2000;
  const start    = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.round(eased * target);
    el.textContent = current.toLocaleString('fr-FR') + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// ─── RIPPLE BUTTONS ───────────────────────────────────────────
function initRippleButtons() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top  - size / 2;

      ripple.className = 'ripple';
      ripple.style.cssText = `
        width: ${size}px; height: ${size}px;
        left: ${x}px; top: ${y}px;
      `;

      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });
}

// ─── WHATSAPP FLOATING BUTTON ─────────────────────────────────
function initWhatsAppFloat() {
  const float = document.querySelector('.whatsapp-float');
  if (!float) return;

  float.setAttribute('href', `https://wa.me/${WHATSAPP_NUMBER}`);
  float.setAttribute('target', '_blank');
  float.setAttribute('rel', 'noopener noreferrer');
  float.setAttribute('aria-label', 'Nous contacter sur WhatsApp');
}

// ─── SCROLL TO TOP ────────────────────────────────────────────
function initScrollTop() {
  const btn = document.querySelector('.scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ─── ACCORDIONS ───────────────────────────────────────────────
function initAccordions() {
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item    = trigger.closest('.accordion-item');
      const content = item.querySelector('.accordion-content');
      const isOpen  = item.classList.contains('open');

      // Close others
      document.querySelectorAll('.accordion-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
        }
      });

      // Toggle current
      item.classList.toggle('open', !isOpen);
      trigger.setAttribute('aria-expanded', !isOpen);
    });
  });
}

// ─── TOAST NOTIFICATION ───────────────────────────────────────
function showToast(message, duration = 3000) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }

  toast.innerHTML = `✓ ${message}`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// ─── PAGE TRANSITION ──────────────────────────────────────────
function initPageTransitions() {
  const overlay = document.querySelector('.page-transition');
  if (!overlay) return;

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel') || href.includes('wa.me')) return;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      overlay.style.transform = 'scaleY(1)';
      overlay.style.transformOrigin = 'bottom';
      overlay.style.transition = 'transform 0.4s cubic-bezier(0.4,0,0.2,1)';

      setTimeout(() => {
        window.location.href = href;
      }, 400);
    });
  });
}

// ─── TILT EFFECT ──────────────────────────────────────────────
function initTiltCards() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ─── SMOOTH SCROLL FOR ANCHOR LINKS ───────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ─── EXPOSE UTILITIES ─────────────────────────────────────────
window.FavelApp = {
  showToast,
  WHATSAPP_NUMBER
};
