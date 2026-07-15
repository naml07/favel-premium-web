/* ============================================================
   FAVEL — Premium Purchase Flow
   Modal logic, validation, WhatsApp generation
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const PurchaseFlow = {
    selectedProduct: null,
    contactMethod: 'whatsapp',

    init() {
      this.createModalMarkup();
      this.bindTriggers();
      this.initAccordion();
    },

    createModalMarkup() {
      if (document.querySelector('.modal-overlay')) return;

      const overlay = document.createElement('div');
      overlay.className = 'modal-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-hidden', 'true');
      overlay.id = 'purchase-modal-container';

      overlay.innerHTML = `
        <div class="modal" id="purchase-modal">
          <button class="modal__close" aria-label="Fermer la fenêtre">&times;</button>
          
          <h2 class="modal__title">Finaliser votre commande</h2>
          <p class="modal__subtitle">Redirection WhatsApp instantanée</p>
          
          <div class="modal__product-summary">
            <p style="font-size:var(--text-xs);color:var(--gray-500);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">Produit sélectionné</p>
            <div class="modal__product-name" id="modal-product-name">Nom du produit</div>
            <div class="modal__product-price" id="modal-product-price">0 CFA</div>
          </div>
          
          <form id="purchase-form" novalidate>
            <div class="form-group" style="margin-bottom:var(--space-4);">
              <label class="form-label" for="user-prenom">Votre Prénom *</label>
              <input class="form-input" type="text" id="user-prenom" name="prenom" required placeholder="Kofi" autocomplete="given-name">
            </div>
            
            <div class="form-group" style="margin-bottom:var(--space-4);">
              <label class="form-label" for="user-nom">Votre Nom *</label>
              <input class="form-input" type="text" id="user-nom" name="nom" required placeholder="Mensah" autocomplete="family-name">
            </div>
            
            <div class="form-group" style="margin-bottom:var(--space-6);">
              <label class="form-label" for="user-contact">Numéro de téléphone / WhatsApp *</label>
              <input class="form-input" type="tel" id="user-contact" name="contact" required placeholder="+228 90 00 00 00" autocomplete="tel">
            </div>

            <button type="submit" class="btn btn-primary btn-lg w-full" style="justify-content:center;min-height:54px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="margin-right:8px;"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Confirmer sur WhatsApp
            </button>
          </form>
        </div>
      </div>
      `;

      document.body.appendChild(overlay);

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) this.closeModal();
      });

      overlay.querySelector('.modal__close').addEventListener('click', () => {
        this.closeModal();
      });

      overlay.querySelector('#purchase-form').addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit();
      });
    },

    bindTriggers() {
      document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-order]');
        if (btn) {
          e.preventDefault();
          this.selectedProduct = {
            order: btn.dataset.order,
            product: btn.dataset.product || btn.dataset.order,
            price: btn.dataset.price || 'A négocier',
            type: btn.dataset.type || 'Service'
          };
          this.openModal();
        }
      });
    },

    openModal() {
      const overlay = document.querySelector('.modal-overlay');
      if (!overlay || !this.selectedProduct) return;

      document.getElementById('modal-product-name').textContent = this.selectedProduct.order;
      const formattedPrice = isNaN(this.selectedProduct.price) 
        ? this.selectedProduct.price 
        : new Intl.NumberFormat('fr-FR').format(this.selectedProduct.price) + ' CFA';
      document.getElementById('modal-product-price').textContent = formattedPrice;

      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      const firstInput = document.getElementById('user-prenom');
      if (firstInput) setTimeout(() => firstInput.focus(), 100);
    },

    closeModal() {
      const overlay = document.querySelector('.modal-overlay');
      if (!overlay) return;

      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      
      document.getElementById('purchase-form').reset();
      this.selectedProduct = null;
    },

    handleSubmit() {
      const prenomInput  = document.getElementById('user-prenom');
      const nomInput     = document.getElementById('user-nom');
      const contactInput = document.getElementById('user-contact');

      const prenom  = prenomInput.value.trim();
      const nom     = nomInput.value.trim();
      const contact = contactInput.value.trim();

      if (!prenom || !nom || !contact) {
        window.FavelApp?.showToast('Veuillez remplir tous les champs obligatoires.');
        return;
      }

      const formattedPrice = isNaN(this.selectedProduct.price) 
        ? this.selectedProduct.price 
        : new Intl.NumberFormat('fr-FR').format(this.selectedProduct.price) + ' CFA';

      const orderRef = 'FAV-' + Math.floor(100000 + Math.random() * 900000);

      const message = [
        `Bonjour FAVEL ! 👋`,
        ``,
        `Je souhaite finaliser ma commande avec les informations suivantes :`,
        `Référence : *${orderRef}*`,
        `Type : *${this.selectedProduct.type}*`,
        `Produit : *${this.selectedProduct.product}*`,
        `Tarif : *${formattedPrice}*`,
        ``,
        `Mes Coordonnées :`,
        `Nom complet : *${prenom} ${nom}*`,
        `WhatsApp / Contact : *${contact}*`,
        ``,
        `Merci de me confirmer la prise en charge de ma commande ! ✨`
      ].join('\n');

      const encodedMessage = encodeURIComponent(message);
      const whatsappURL = `https://wa.me/22890000000?text=${encodedMessage}`;

      window.open(whatsappURL, '_blank', 'noopener,noreferrer');
      window.FavelApp?.showToast('Redirection vers WhatsApp...');
      setTimeout(() => this.closeModal(), 1000);
    },

    initAccordion() {
      const triggers = document.querySelectorAll('.accordion-trigger');
      if (!triggers.length) return;

      triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
          const item = trigger.closest('.accordion-item');
          const isOpen = item.classList.contains('open');

          document.querySelectorAll('.accordion-item').forEach(i => {
            i.classList.remove('open');
            i.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
          });

          if (!isOpen) {
            item.classList.add('open');
            trigger.setAttribute('aria-expanded', 'true');
          }
        });
      });
    }
  };

  PurchaseFlow.init();
});
