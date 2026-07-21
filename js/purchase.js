/* ============================================================
   FAVEL — Purchase Flow
   Formulaire minimaliste → Redirection WhatsApp
   ============================================================ */

'use strict';

// ─── PURCHASE MODULE ──────────────────────────────────────────
const PurchaseFlow = (() => {

  let currentProduct = null;
  let selectedContactType = 'phone';

  // ─── Init ────────────────────────────────────────────────────
  function init() {
    renderModal();
    bindCTAButtons();
    bindModalEvents();
  }

  // ─── Render Modal HTML ────────────────────────────────────────
  function renderModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'purchase-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'modal-title');
    modal.innerHTML = `
      <div class="modal" id="modal-content">
        <button class="modal__close" id="modal-close" aria-label="Fermer">✕</button>

        <div class="modal__header">
          <p class="section-label">Commande</p>
          <h2 class="modal__title" id="modal-title">Finaliser votre commande</h2>
          <p class="modal__subtitle">Remplissez vos informations pour être redirigé vers WhatsApp</p>
        </div>

        <div class="modal__product-summary" id="modal-product-summary">
          <div class="modal__product-name" id="modal-product-name">—</div>
          <div class="modal__product-price" id="modal-product-price">—</div>
        </div>

        <form class="modal__form" id="purchase-form" novalidate>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
            <div class="form-group">
              <label class="form-label" for="field-prenom">Prénom *</label>
              <input
                class="form-input"
                type="text"
                id="field-prenom"
                name="prenom"
                placeholder="Kofi"
                required
                autocomplete="given-name"
              >
            </div>
            <div class="form-group">
              <label class="form-label" for="field-nom">Nom *</label>
              <input
                class="form-input"
                type="text"
                id="field-nom"
                name="nom"
                placeholder="Asante"
                required
                autocomplete="family-name"
              >
            </div>
          </div>

          <fieldset style="border:none;padding:0;margin-bottom:16px;">
            <legend class="form-label" style="margin-bottom:8px;">Comment vous contacter ? *</legend>
            <div class="contact-choice" role="group" aria-label="Type de contact">
              <button type="button" class="contact-choice-btn active" id="choice-phone" data-type="phone" aria-pressed="true">
                📱 Téléphone
              </button>
              <button type="button" class="contact-choice-btn" id="choice-email" data-type="email" aria-pressed="false">
                ✉️ Email
              </button>
            </div>
          </fieldset>

          <div class="form-group" id="phone-group" style="margin-bottom:16px;">
            <label class="form-label" for="field-phone">Numéro de téléphone *</label>
            <input
              class="form-input"
              type="tel"
              id="field-phone"
              name="phone"
              placeholder="+228 90 00 00 00"
              autocomplete="tel"
            >
          </div>

          <div class="form-group" id="email-group" style="margin-bottom:16px;display:none;">
            <label class="form-label" for="field-email">Adresse email *</label>
            <input
              class="form-input"
              type="email"
              id="field-email"
              name="email"
              placeholder="kofi@exemple.com"
              autocomplete="email"
            >
          </div>

          <button type="submit" class="btn btn-whatsapp w-full btn-lg" style="margin-top:8px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Commander via WhatsApp
          </button>

          <p style="text-align:center;font-size:12px;color:var(--gray-600);margin-top:10px;">
            🔒 Vos informations restent confidentielles
          </p>
        </form>
      </div>
    `;

    document.body.appendChild(modal);
  }

  // ─── Bind CTA Buttons ─────────────────────────────────────────
  function bindCTAButtons() {
    document.querySelectorAll('[data-order]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productName  = btn.dataset.product  || btn.dataset.order;
        const productPrice = btn.dataset.price     || '';
        const productType  = btn.dataset.type      || 'Produit';

        openModal({ name: productName, price: productPrice, type: productType });
      });
    });
  }

  // ─── Open Modal ───────────────────────────────────────────────
  function openModal(product) {
    currentProduct = product;

    const overlay    = document.getElementById('purchase-modal');
    const nameEl     = document.getElementById('modal-product-name');
    const priceEl    = document.getElementById('modal-product-price');

    if (nameEl)  nameEl.textContent  = product.name;
    if (priceEl) priceEl.textContent = product.price ? `${product.price} CFA` : '';

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Focus trap
    setTimeout(() => {
      document.getElementById('field-prenom')?.focus();
    }, 300);
  }

  // ─── Close Modal ──────────────────────────────────────────────
  function closeModal() {
    const overlay = document.getElementById('purchase-modal');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    document.getElementById('purchase-form')?.reset();
  }

  // ─── Bind Modal Events ────────────────────────────────────────
  function bindModalEvents() {
    // Close button
    document.addEventListener('click', (e) => {
      if (e.target.id === 'modal-close') closeModal();
      if (e.target.id === 'purchase-modal') closeModal();
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const overlay = document.getElementById('purchase-modal');
        if (overlay?.classList.contains('open')) closeModal();
      }
    });

    // Contact type toggle
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.contact-choice-btn');
      if (!btn) return;

      const type = btn.dataset.type;
      selectedContactType = type;

      document.querySelectorAll('.contact-choice-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.type === type);
        b.setAttribute('aria-pressed', b.dataset.type === type);
      });

      document.getElementById('phone-group').style.display = type === 'phone' ? '' : 'none';
      document.getElementById('email-group').style.display = type === 'email' ? '' : 'none';

      // Update required
      const phoneInput = document.getElementById('field-phone');
      const emailInput = document.getElementById('field-email');
      if (phoneInput) phoneInput.required = type === 'phone';
      if (emailInput) emailInput.required = type === 'email';
    });

    // Form submit
    document.addEventListener('submit', (e) => {
      if (e.target.id !== 'purchase-form') return;
      e.preventDefault();

      const prenom = document.getElementById('field-prenom')?.value.trim();
      const nom    = document.getElementById('field-nom')?.value.trim();
      const phone  = document.getElementById('field-phone')?.value.trim();
      const email  = document.getElementById('field-email')?.value.trim();

      // Validation
      if (!prenom || !nom) {
        markError('field-prenom', !prenom);
        markError('field-nom', !nom);
        return;
      }

      if (selectedContactType === 'phone' && !phone) {
        markError('field-phone', true);
        return;
      }

      if (selectedContactType === 'email' && !email) {
        markError('field-email', true);
        return;
      }

      // Build WhatsApp message
      const contact = selectedContactType === 'phone'
        ? `Tél: ${phone}`
        : `Email: ${email}`;

      const productLine = currentProduct
        ? `Produit: *${currentProduct.name}*${currentProduct.price ? ` — ${currentProduct.price} CFA` : ''}`
        : '';

      const message = [
        `Bonjour FAVEL ! 👋`,
        ``,
        `Je souhaite commander :`,
        productLine,
        ``,
        `Mes informations :`,
        `Nom complet: *${prenom} ${nom}*`,
        contact,
        ``,
        `Merci de me confirmer la disponibilité. 🙏`
      ].filter(Boolean).join('\n');

      const waNumber  = window.FavelApp?.WHATSAPP_NUMBER || '22890000000';
      const waUrl     = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

      // Close modal and redirect
      closeModal();
      window.open(waUrl, '_blank', 'noopener,noreferrer');

      if (window.FavelApp?.showToast) {
        window.FavelApp.showToast('Redirection vers WhatsApp...');
      }
    });
  }

  // ─── Mark Error ───────────────────────────────────────────────
  function markError(fieldId, hasError) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    if (hasError) {
      field.style.borderColor = '#EF4444';
      field.style.boxShadow   = '0 0 0 3px rgba(239,68,68,0.2)';
      field.focus();
      field.addEventListener('input', () => {
        field.style.borderColor = '';
        field.style.boxShadow   = '';
      }, { once: true });
    }
  }

  return { init, openModal };
})();

// ─── INIT ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  PurchaseFlow.init();
});

// Expose globally
window.PurchaseFlow = PurchaseFlow;
