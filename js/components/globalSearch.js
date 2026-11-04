/**
 * KOVA Admin Dashboard - Universal Global Search (PRD 7)
 * Instant search across Users, Products, Properties, Transactions, Reports
 * Shortcut: Ctrl + K or Cmd + K
 */

class GlobalSearch {
  constructor(store) {
    this.store = store;
    this.modalEl = document.getElementById('modal-global-search');
    this.inputEl = document.getElementById('global-search-input');
    this.resultsEl = document.getElementById('global-search-results');
    this.init();
  }

  init() {
    if (!this.modalEl || !this.inputEl) return;

    // Keyboard shortcut (Ctrl+K / Cmd+K)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.open();
      } else if (e.key === 'Escape' && this.modalEl.classList.contains('active')) {
        this.close();
      }
    });

    // Close on backdrop click
    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl || e.target.closest('.btn-close-modal')) {
        this.close();
      }
    });

    // Real-time search
    this.inputEl.addEventListener('input', (e) => {
      this.handleSearch(e.target.value);
    });
  }

  open() {
    this.modalEl.classList.add('active');
    this.inputEl.value = '';
    this.inputEl.focus();
    this.renderInitialState();
  }

  close() {
    this.modalEl.classList.remove('active');
  }

  renderInitialState() {
    this.resultsEl.innerHTML = `
      <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
        <div style="font-size: 1.5rem; margin-bottom: 8px;">🔍</div>
        <div style="font-weight: 600; color: var(--text-main); margin-bottom: 4px;">Universal Search</div>
        <div>Search by user name, phone, email, product/property title, transaction ID, or report category</div>
      </div>
    `;
  }

  handleSearch(query) {
    if (!query || query.trim().length === 0) {
      this.renderInitialState();
      return;
    }

    const results = this.store.globalSearch(query);
    const { users, listings, transactions, reports } = results;

    const totalCount = users.length + listings.length + transactions.length + reports.length;

    if (totalCount === 0) {
      this.resultsEl.innerHTML = `
        <div style="padding: 32px; text-align: center; color: var(--text-muted);">
          <div style="font-size: 1.8rem; margin-bottom: 8px;">🤷‍♂️</div>
          <div style="font-weight: 700; color: var(--text-main);">No records found</div>
          <div style="font-size: 0.8rem; color: var(--text-subtle);">No matching users, listings, transactions, or reports for "${query}"</div>
        </div>
      `;
      return;
    }

    let html = `<div style="display: grid; gap: 16px; padding: 12px 16px;">`;

    // 1. Users Results
    if (users.length > 0) {
      html += `
        <div>
          <div style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--text-subtle); margin-bottom: 6px;">Users (${users.length})</div>
          <div style="display: grid; gap: 6px;">
      `;
      users.forEach(u => {
        const subBadgeClass = u.subscription === 'Gold' ? 'sub-badge-gold' : (u.subscription === 'Gray' ? 'sub-badge-gray' : 'sub-badge-blue');
        html += `
          <div class="search-result-item" onclick="window.globalSearch.close(); window.userModal.open('${u.id}')" style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; border-radius: var(--radius-md); background: var(--bg-surface); cursor: pointer; transition: background 0.15s;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <img src="${u.avatar}" style="width: 32px; height: 32px; border-radius: var(--radius-full); object-fit: cover;" />
              <div>
                <div style="font-weight: 600; color: var(--text-main); font-size: 0.86rem;">${u.name}</div>
                <div style="font-size: 0.72rem; color: var(--text-muted);">${u.email} • ${u.category}</div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span class="type-badge type-${u.userType}">${u.userType}</span>
              <span class="sub-badge ${subBadgeClass}">${u.subscription || 'Basic'}</span>
            </div>
          </div>
        `;
      });
      html += `</div></div>`;
    }

    // 2. Listings Results
    if (listings.length > 0) {
      html += `
        <div>
          <div style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--text-subtle); margin-bottom: 6px;">Listings (${listings.length})</div>
          <div style="display: grid; gap: 6px;">
      `;
      listings.forEach(l => {
        html += `
          <div class="search-result-item" onclick="window.globalSearch.close(); window.userModal.open('${l.userId}')" style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; border-radius: var(--radius-md); background: var(--bg-surface); cursor: pointer; transition: background 0.15s;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <img src="${l.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80'}" style="width: 32px; height: 32px; border-radius: var(--radius-sm); object-fit: cover;" />
              <div>
                <div style="font-weight: 600; color: var(--text-main); font-size: 0.86rem;">${l.name}</div>
                <div style="font-size: 0.72rem; color: var(--text-muted);">${l.listingType.toUpperCase()} • ${l.category} • by ${l.ownerName}</div>
              </div>
            </div>
            <div style="text-align: right;">
              <div class="price-tag">${this.store.formatNaira(l.price)}</div>
              <span class="status-badge status-${l.status.toLowerCase()}">${l.status}</span>
            </div>
          </div>
        `;
      });
      html += `</div></div>`;
    }

    // 3. Transactions Results
    if (transactions.length > 0) {
      html += `
        <div>
          <div style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--text-subtle); margin-bottom: 6px;">Transactions (${transactions.length})</div>
          <div style="display: grid; gap: 6px;">
      `;
      transactions.forEach(t => {
        html += `
          <div class="search-result-item" onclick="window.globalSearch.close(); window.transactionModal.open('${t.id}')" style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; border-radius: var(--radius-md); background: var(--bg-surface); cursor: pointer; transition: background 0.15s;">
            <div>
              <div style="font-weight: 600; color: var(--text-main); font-size: 0.86rem;">${t.id} - ${t.listingName}</div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">${t.type} • ${t.date}</div>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <span class="price-tag">${this.store.formatNaira(t.amount)}</span>
              <span class="status-badge status-${t.status.toLowerCase()}">${t.status}</span>
            </div>
          </div>
        `;
      });
      html += `</div></div>`;
    }

    // 4. Reports Results
    if (reports.length > 0) {
      html += `
        <div>
          <div style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--text-subtle); margin-bottom: 6px;">Reports (${reports.length})</div>
          <div style="display: grid; gap: 6px;">
      `;
      reports.forEach(r => {
        html += `
          <div class="search-result-item" onclick="window.globalSearch.close(); window.reportModal.open('${r.id}')" style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; border-radius: var(--radius-md); background: var(--bg-surface); cursor: pointer; transition: background 0.15s;">
            <div>
              <div style="font-weight: 600; color: #dc2626; font-size: 0.86rem;">${r.id} - ${r.category}</div>
              <div style="font-size: 0.72rem; color: var(--text-muted); max-width: 320px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${r.content}</div>
            </div>
            <span class="status-badge status-${r.status.toLowerCase()}">${r.status}</span>
          </div>
        `;
      });
      html += `</div></div>`;
    }

    html += `</div>`;
    this.resultsEl.innerHTML = html;
  }
}

window.GlobalSearch = GlobalSearch;
