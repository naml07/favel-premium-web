/* ============================================================
   FAVEL — Premium Main Script
   Reveals, counters, navigation, transitions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // State management
  const FavelApp = {
    isMobile: window.innerWidth < 768,
    scrollThreshold: 50,
    elements: {
      nav: document.querySelector('.nav'),
      hamburger: document.querySelector('.nav__hamburger'),
      mobileMenu: document.querySelector('.nav__mobile'),
      scrollTopBtn: document.querySelector('.scroll-top'),
      loader: document.querySelector('.page-loader')
    },

    init() {
      this.handleLoader();
      this.initNavigation();
      this.initScrollReveal();
      this.initCounters();
      this.initScrollTop();
      this.initRippleEffect();
      this.initParallax();
      this.initSpotlight();
      this.initMagneticButtons();
      
      // Active link handler
      this.highlightActiveLink();
    },

    // ── Loader ──────────────────────────────────────────────
    handleLoader() {
      if (this.elements.loader) {
        window.addEventListener('load', () => {
          setTimeout(() => {
            this.elements.loader.classList.add('loaded');
            document.body.style.overflow = '';
          }, 400);
        });
      }
    },

    // ── Navigation & Hamburger ──────────────────────────────
    initNavigation() {
      const { nav, hamburger, mobileMenu } = this.elements;
      if (!nav) return;

      // Sticky header on scroll
      const handleScroll = () => {
        if (window.scrollY > this.scrollThreshold) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
      };
      
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Trigger immediately in case page is loaded scrolled

      // Mobile menu toggle
      if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', (e) => {
          e.stopPropagation();
          const isOpen = hamburger.classList.toggle('open');
          mobileMenu.classList.toggle('open');
          
          // Accessibility attributes
          hamburger.setAttribute('aria-expanded', isOpen);
          mobileMenu.setAttribute('aria-hidden', !isOpen);
          
          // Disable body scroll when menu is open
          document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close menu on link click
        mobileMenu.querySelectorAll('.nav__mobile-link').forEach(link => {
          link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            mobileMenu.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
            mobileMenu.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
          });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
          if (mobileMenu.classList.contains('open') && !mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('open');
            mobileMenu.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
            mobileMenu.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
          }
        });
      }
    },

    highlightActiveLink() {
      const currentPath = window.location.pathname.split('/').pop() || 'index.html';
      
      // Desktop Links
      document.querySelectorAll('.nav__link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        } else {
          link.classList.remove('active');
          link.removeAttribute('aria-current');
        }
      });

      // Mobile Links
      document.querySelectorAll('.nav__mobile-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    },

    // ── Intersection Observer (Scroll Reveal) ────────────────
    initScrollReveal() {
      const revealElements = document.querySelectorAll('[data-reveal], [data-stagger]');
      if (!revealElements.length) return;

      const observerOptions = {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      };

      const observer = new IntersectionObserver((entries, self) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            self.unobserve(entry.target); // Reveal only once
          }
        });
      }, observerOptions);

      revealElements.forEach(el => observer.observe(el));
    },

    // ── Count Up Stats ──────────────────────────────────────
    initCounters() {
      const statNumbers = document.querySelectorAll('.stat-number span');
      if (!statNumbers.length) return;

      const observer = new IntersectionObserver((entries, self) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const target = entry.target;
            const countTo = parseFloat(target.dataset.count);
            const suffix = target.dataset.suffix || '';
            const duration = 2000; // ms
            const startTime = performance.now();

            const updateCount = (currentTime) => {
              const elapsedTime = currentTime - startTime;
              const progress = Math.min(elapsedTime / duration, 1);
              
              // Easing formula (outQuad)
              const easeProgress = progress * (2 - progress);
              const currentValue = Math.floor(easeProgress * countTo);

              target.textContent = currentValue + suffix;

              if (progress < 1) {
                requestAnimationFrame(updateCount);
              } else {
                target.textContent = countTo + suffix;
              }
            };

            requestAnimationFrame(updateCount);
            self.unobserve(target);
          }
        });
      }, { threshold: 0.5 });

      statNumbers.forEach(num => observer.observe(num));
    },

    // ── Scroll to Top Button ────────────────────────────────
    initScrollTop() {
      const btn = this.elements.scrollTopBtn;
      if (!btn) return;

      window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
          btn.classList.add('visible');
        } else {
          btn.classList.remove('visible');
        }
      }, { passive: true });

      btn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    },

    // ── Ripple Effect (Buttons) ─────────────────────────────
    initRippleEffect() {
      document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
          if (this.classList.contains('btn-whatsapp')) return;

          const rect = this.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const ripple = document.createElement('span');
          ripple.classList.add('ripple');
          ripple.style.left = `${x}px`;
          ripple.style.top = `${y}px`;

          this.appendChild(ripple);

          setTimeout(() => {
            ripple.remove();
          }, 600);
        });
      });
    },

    // ── Mouse Spotlight (Cards Hover) ────────────────────────
    initSpotlight() {
      if (this.isMobile) return;
      
      document.querySelectorAll('.spotlight').forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
        });
      });
    },

    // ── Parallax Orbs (Slow background shift) ────────────────
    initParallax() {
      if (this.isMobile) return;

      window.addEventListener('mousemove', (e) => {
        const x = (e.clientX - window.innerWidth / 2) * 0.02;
        const y = (e.clientY - window.innerHeight / 2) * 0.02;

        document.querySelectorAll('.orb').forEach(orb => {
          orb.style.transform = `translate(${x}px, ${y}px)`;
        });
      }, { passive: true });
    },

    // ── Magnetic Buttons (Micro-interaction) ─────────────────
    initMagneticButtons() {
      if (this.isMobile) return;

      document.querySelectorAll('.btn-magnetic').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;

          btn.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
        });

        btn.addEventListener('mouseleave', () => {
          btn.style.transform = 'translate(0px, 0px)';
        });
      });
    },

    // ── Notification Toast Maker ────────────────────────────
    showToast(message, duration = 3000) {
      let toast = document.querySelector('.toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'polite');
        document.body.appendChild(toast);
      }

      toast.innerHTML = `<span aria-hidden="true">✨</span> ${message}`;
      
      requestAnimationFrame(() => {
        toast.classList.add('show');
      });

      setTimeout(() => {
        toast.classList.remove('show');
      }, duration);
    }
  };

  window.FavelApp = FavelApp;
  FavelApp.init();
});
