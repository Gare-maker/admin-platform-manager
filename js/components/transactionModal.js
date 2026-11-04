/**
 * KOVA Admin Dashboard - Transaction Details Modal (PRD 3.3)
 * Financial breakdown, platform fee (4.9%), buyer & seller relational cross-links.
 */

class TransactionModal {
  constructor(store) {
    this.store = store;
    this.modalEl = document.getElementById('modal-transaction-details');
    this.currentTxId = null;
    this.init();
  }

  init() {
    if (!this.modalEl) return;

    // Close on backdrop click or close button
    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl || e.target.closest('.btn-close-modal')) {
        this.close();
      }
    });
  }

  open(txId) {
    this.currentTxId = txId;
    const tx = this.store.getTransactionDetails(txId);
    if (!tx) return;

    const { buyer, seller, listing, kovaFee, platformFeeRate } = tx;

    // 1. Header Info
    const idEl = this.modalEl.querySelector('#tx-modal-id');
    const dateEl = this.modalEl.querySelector('#tx-modal-date');
    const statusBadgeEl = this.modalEl.querySelector('#tx-modal-statusbadge');
    const typeEl = this.modalEl.querySelector('#tx-modal-type');

    if (idEl) idEl.textContent = `Transaction ${tx.id}`;
    if (dateEl) dateEl.textContent = tx.date;
    if (typeEl) typeEl.textContent = tx.type;

    if (statusBadgeEl) {
      statusBadgeEl.className = `status-badge status-${tx.status.toLowerCase()}`;
      statusBadgeEl.textContent = tx.status;
    }

    // 2. Financial Breakdown
    const amountEl = this.modalEl.querySelector('#tx-modal-amount');
    const feeEl = this.modalEl.querySelector('#tx-modal-fee');
    const netEl = this.modalEl.querySelector('#tx-modal-net');
    const feeRatePercent = (platformFeeRate * 100).toFixed(1) + '%';

    if (amountEl) amountEl.textContent = this.store.formatNaira(tx.amount);
    if (feeEl) feeEl.textContent = `${this.store.formatNaira(kovaFee)} (${feeRatePercent})`;
    if (netEl) netEl.textContent = this.store.formatNaira(tx.amount - kovaFee);

    // 3. Buyer & Seller Cards
    const buyerCard = this.modalEl.querySelector('#tx-card-buyer');
    if (buyerCard && buyer) {
      buyerCard.innerHTML = `
        <div style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--text-subtle); margin-bottom: 8px;">Buyer</div>
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
          <img src="${buyer.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80'}" alt="${buyer.name}" style="width: 38px; height: 38px; border-radius: var(--radius-full); object-fit: cover;" />
          <div>
            <div style="font-weight: 600; color: var(--text-main); font-size: 0.88rem;">${buyer.name}</div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">${buyer.email}</div>
          </div>
        </div>
        <button class="btn btn-outline btn-sm" style="width: 100%;" onclick="window.transactionModal.close(); window.userModal.open('${buyer.id}');">
          View Buyer Profile
        </button>
      `;
    }

    const sellerCard = this.modalEl.querySelector('#tx-card-seller');
    if (sellerCard && seller) {
      const subBadgeClass = seller.subscription === 'Gold' ? 'sub-badge-gold' : (seller.subscription === 'Gray' ? 'sub-badge-gray' : 'sub-badge-blue');
      sellerCard.innerHTML = `
        <div style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--text-subtle); margin-bottom: 8px;">Seller / Agent</div>
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
          <img src="${seller.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80'}" alt="${seller.name}" style="width: 38px; height: 38px; border-radius: var(--radius-full); object-fit: cover;" />
          <div>
            <div style="font-weight: 600; color: var(--text-main); font-size: 0.88rem;">${seller.name}</div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">${seller.email}</div>
            <div style="margin-top: 3px;"><span class="sub-badge ${subBadgeClass}">${seller.subscription || 'Basic'}</span></div>
          </div>
        </div>
        <button class="btn btn-outline btn-sm" style="width: 100%;" onclick="window.transactionModal.close(); window.userModal.open('${seller.id}');">
          View Seller Profile
        </button>
      `;
    }

    // 4. Listing Card
    const itemCard = this.modalEl.querySelector('#tx-card-item');
    if (itemCard) {
      if (listing) {
        itemCard.innerHTML = `
          <div style="display: flex; align-items: center; gap: 12px; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 12px;">
            <img src="${listing.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}" alt="${listing.name}" style="width: 48px; height: 48px; border-radius: var(--radius-sm); object-fit: cover;" />
            <div style="flex: 1;">
              <div style="font-weight: 700; color: var(--text-main); font-size: 0.9rem;">${listing.name}</div>
              <div style="font-size: 0.74rem; color: var(--text-muted);">${listing.category} • Listing ID: ${listing.id}</div>
            </div>
            <span class="status-badge status-${listing.status.toLowerCase()}">${listing.status}</span>
          </div>
        `;
      } else {
        itemCard.innerHTML = `<div style="font-size: 0.85rem; color: var(--text-muted);">Direct platform transaction: ${tx.listingName || 'Marketplace Service'}</div>`;
      }
    }

    this.modalEl.classList.add('active');
  }

  close() {
    if (this.modalEl) {
      this.modalEl.classList.remove('active');
    }
    this.currentTxId = null;
  }
}

window.TransactionModal = TransactionModal;
