/**
 * KOVA Admin Dashboard - User Details Profile Drawer (PRD 4.8)
 * Complete relational profile: Info, Subscription, Marketplace Stats,
 * Listings, Transactions, Ratings, Reports against user, and Audit History.
 */

class UserModal {
  constructor(store) {
    this.store = store;
    this.drawerEl = document.getElementById('drawer-user-profile');
    this.currentUserId = null;
    this.activeTab = 'listings';
    this.init();
  }

  init() {
    if (!this.drawerEl) return;

    // Close on backdrop click or close button
    this.drawerEl.addEventListener('click', (e) => {
      if (e.target === this.drawerEl || e.target.closest('.btn-close-drawer')) {
        this.close();
      }
    });

    // Tab switching
    const tabs = this.drawerEl.querySelectorAll('.drawer-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.activeTab = tab.getAttribute('data-tab');
        this.renderTabContent();
      });
    });
  }

  open(userId, options = {}) {
    this.currentUserId = userId;
    const userDetails = this.store.getUserDetails(userId);
    if (!userDetails) return;

    const { user, stats, listings, transactions, ratings, reports, subscriptionHistory } = userDetails;

    // Check if opened from report drawer
    const reportDrawer = document.getElementById('drawer-report-details');
    const isFromReport = options.fromReport || (reportDrawer && reportDrawer.classList.contains('active'));
    const drawerContent = this.drawerEl.querySelector('.drawer-content');

    if (isFromReport && reportDrawer && reportDrawer.classList.contains('active')) {
      this.drawerEl.classList.add('drawer-side-by-side');
      const reportDrawerContent = reportDrawer.querySelector('.drawer-content');
      const reportWidth = reportDrawerContent ? reportDrawerContent.offsetWidth : 650;
      if (drawerContent) {
        if (window.innerWidth > 1200) {
          drawerContent.style.right = `${reportWidth}px`;
          drawerContent.style.left = 'auto';
        } else {
          drawerContent.style.right = '0';
          drawerContent.style.left = '0';
        }
      }
    } else {
      this.drawerEl.classList.remove('drawer-side-by-side');
      if (drawerContent) {
        drawerContent.style.right = '';
        drawerContent.style.left = '';
      }
    }

    // 1. Populate Basic Header Info
    const avatarEl = this.drawerEl.querySelector('#user-drawer-avatar');
    const nameEl = this.drawerEl.querySelector('#user-drawer-name');
    const emailEl = this.drawerEl.querySelector('#user-drawer-email');
    const phoneEl = this.drawerEl.querySelector('#user-drawer-phone');
    const typeEl = this.drawerEl.querySelector('#user-drawer-type');
    const statusEl = this.drawerEl.querySelector('#user-drawer-status');
    const joinedEl = this.drawerEl.querySelector('#user-drawer-joined');

    if (avatarEl) avatarEl.src = user.avatar;
    if (nameEl) nameEl.textContent = user.name;
    if (emailEl) emailEl.textContent = user.email;
    if (phoneEl) phoneEl.textContent = user.phone;
    if (joinedEl) joinedEl.textContent = `Joined ${user.dateJoined}`;

    if (typeEl) {
      typeEl.className = `type-badge type-${user.userType}`;
      typeEl.textContent = user.userType;
    }

    if (statusEl) {
      statusEl.className = `status-badge status-${user.accountStatus.toLowerCase()}`;
      statusEl.textContent = user.accountStatus;
    }

    // 2. Subscription Card
    const subBadgeEl = this.drawerEl.querySelector('#user-drawer-subbadge');
    const subAssignedEl = this.drawerEl.querySelector('#user-drawer-subassigned');
    const changeSubBtn = this.drawerEl.querySelector('#btn-open-change-sub');

    if (subBadgeEl) {
      const badgeClass = user.subscription === 'Gold' ? 'sub-badge-gold' : (user.subscription === 'Gray' ? 'sub-badge-gray' : 'sub-badge-blue');
      subBadgeEl.className = `sub-badge ${badgeClass}`;
      subBadgeEl.textContent = user.subscription || 'None';
    }

    if (subAssignedEl) {
      subAssignedEl.textContent = `Assigned on ${user.subscriptionAssignedDate || 'N/A'}`;
    }

    if (changeSubBtn) {
      changeSubBtn.onclick = () => {
        if (window.subscriptionModal) {
          window.subscriptionModal.open(user.id);
        }
      };
    }

    // 2b. Account Moderation & Status Control Card
    const moderationCard = this.drawerEl.querySelector('#user-drawer-moderation-card');
    if (moderationCard) {
      const statusLower = user.accountStatus.toLowerCase();
      moderationCard.innerHTML = `
        <div>
          <div style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--text-subtle); margin-bottom: 4px;">Account Access & Moderation</div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="status-badge status-${statusLower}">${user.accountStatus}</span>
            <span style="font-size: 0.75rem; color: var(--text-muted);">
              ${user.accountStatus === 'Active' ? 'Full platform access enabled' : (user.accountStatus === 'Suspended' ? 'Account & listings temporarily suspended' : 'Account permanently blocked from platform')}
            </span>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          ${user.accountStatus !== 'Active' ? `
            <button class="btn btn-success btn-sm" onclick="window.app.setUserStatus('${user.id}', 'Active')">
              ✓ Activate User
            </button>
          ` : ''}
          ${user.accountStatus !== 'Suspended' ? `
            <button class="btn btn-warning btn-sm" onclick="window.app.setUserStatus('${user.id}', 'Suspended')">
              ⏸ Suspend User
            </button>
          ` : ''}
          ${user.accountStatus !== 'Blocked' ? `
            <button class="btn btn-danger btn-sm" onclick="window.app.setUserStatus('${user.id}', 'Blocked')">
              🚫 Block User
            </button>
          ` : ''}
        </div>
      `;
    }

    // 3. Marketplace Statistics Cards
    this.drawerEl.querySelector('#u-stat-listings').textContent = `${stats.activeListings} / ${stats.totalListings}`;
    this.drawerEl.querySelector('#u-stat-tx-count').textContent = stats.totalTransactions;
    this.drawerEl.querySelector('#u-stat-tx-value').textContent = this.store.formatNaira(stats.totalMoneyTransacted);
    this.drawerEl.querySelector('#u-stat-rating').textContent = `${user.rating} ★ (${stats.ratingsCount})`;

    const reportsStatEl = this.drawerEl.querySelector('#u-stat-reports');
    if (reportsStatEl) {
      reportsStatEl.textContent = stats.reportsCount;
      if (stats.reportsCount > 0) {
        reportsStatEl.style.color = '#ef4444';
      } else {
        reportsStatEl.style.color = 'inherit';
      }
    }

    // 4. Update Tab Counters
    const tabListings = this.drawerEl.querySelector('[data-tab="listings"]');
    const tabTx = this.drawerEl.querySelector('[data-tab="transactions"]');
    const tabRatings = this.drawerEl.querySelector('[data-tab="ratings"]');
    const tabReports = this.drawerEl.querySelector('[data-tab="reports"]');
    const tabHistory = this.drawerEl.querySelector('[data-tab="history"]');

    if (tabListings) tabListings.textContent = `Listings (${listings.length})`;
    if (tabTx) tabTx.textContent = `Transactions (${transactions.length})`;
    if (tabRatings) tabRatings.textContent = `Ratings (${ratings.length})`;
    if (tabReports) tabReports.textContent = `Reports (${reports.length})`;
    if (tabHistory) tabHistory.textContent = `Sub History (${subscriptionHistory.length})`;

    // Render active tab content
    this.renderTabContent();

    this.drawerEl.classList.add('active');
  }

  close() {
    if (this.drawerEl) {
      this.drawerEl.classList.remove('active');
      this.drawerEl.classList.remove('drawer-side-by-side');
      const drawerContent = this.drawerEl.querySelector('.drawer-content');
      if (drawerContent) {
        drawerContent.style.right = '';
        drawerContent.style.left = '';
      }
    }
    this.currentUserId = null;
  }

  renderTabContent() {
    const details = this.store.getUserDetails(this.currentUserId);
    if (!details) return;

    const container = this.drawerEl.querySelector('#user-drawer-tab-pane');
    if (!container) return;

    if (this.activeTab === 'listings') {
      this.renderListings(container, details.listings);
    } else if (this.activeTab === 'transactions') {
      this.renderTransactions(container, details.transactions);
    } else if (this.activeTab === 'ratings') {
      this.renderRatings(container, details.ratings);
    } else if (this.activeTab === 'reports') {
      this.renderReports(container, details.reports);
    } else if (this.activeTab === 'history') {
      this.renderSubscriptionHistory(container, details.subscriptionHistory);
    }
  }

  renderListings(container, listings) {
    if (!listings || !listings.length) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📦</div>
          <h3>No Listings Found</h3>
          <p>This user currently has no product or property listings on Kova.</p>
        </div>
      `;
      return;
    }

    let html = `
      <div style="display: grid; gap: 12px;">
    `;

    listings.forEach(l => {
      const typeLabel = l.listingType === 'property' ? '🏠 Property' : '🛍️ Product';
      html += `
        <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 12px 14px; gap: 12px;">
          <img src="${l.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}" alt="${l.name}" style="width: 48px; height: 48px; border-radius: var(--radius-sm); object-fit: cover; border: 1px solid var(--border-subtle); flex-shrink: 0;" />
          <div style="flex: 1; min-width: 0;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-weight: 600; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${l.name}</span>
              <span class="status-badge status-${l.status.toLowerCase()}">${l.status}</span>
            </div>
            <div style="font-size: 0.76rem; color: var(--text-muted); display: flex; gap: 10px; margin-top: 2px;">
              <span>${typeLabel}</span>
              <span>•</span>
              <span>${l.category}</span>
              <span>•</span>
              <span>Created ${l.dateCreated}</span>
            </div>
          </div>
          <div style="text-align: right; flex-shrink: 0;">
            <div class="price-tag">${this.store.formatNaira(l.price)}</div>
            <div style="font-size: 0.72rem; color: var(--text-subtle);">${l.views || 0} views • ${l.transactionsCount || 0} orders</div>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  }

  renderTransactions(container, transactions) {
    if (!transactions || !transactions.length) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">💳</div>
          <h3>No Transactions Found</h3>
          <p>No transactions have been recorded for this user.</p>
        </div>
      `;
      return;
    }

    let html = `
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID & Date</th>
              <th>Type / Item</th>
              <th>Counterparty</th>
              <th>Amount</th>
              <th>Kova Fee (4.9%)</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
    `;

    transactions.forEach(t => {
      const isSeller = t.sellerId === this.currentUserId;
      const counterparty = isSeller ? `Buyer: ${t.buyerName}` : `Seller: ${t.sellerName}`;

      html += `
        <tr>
          <td>
            <div style="font-weight: 600; color: var(--text-main);">${t.id}</div>
            <div style="font-size: 0.72rem; color: var(--text-subtle);">${t.date}</div>
          </td>
          <td>
            <div style="font-weight: 500;">${t.listingName}</div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">${t.type}</div>
          </td>
          <td>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${counterparty}</div>
          </td>
          <td>
            <div class="price-tag">${this.store.formatNaira(t.amount)}</div>
          </td>
          <td>
            <div class="fee-tag">${this.store.formatNaira(t.fee)}</div>
          </td>
          <td>
            <span class="status-badge status-${t.status.toLowerCase()}">${t.status}</span>
          </td>
          <td>
            <button class="btn btn-outline btn-sm" onclick="window.transactionModal.open('${t.id}')">View</button>
          </td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
    `;

    container.innerHTML = html;
  }

  renderRatings(container, ratings) {
    if (!ratings || !ratings.length) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">⭐</div>
          <h3>No Reviews Yet</h3>
          <p>This user has not received customer reviews or ratings yet.</p>
        </div>
      `;
      return;
    }

    let html = `<div style="display: grid; gap: 12px;">`;

    ratings.forEach(r => {
      let stars = '';
      for (let i = 1; i <= 5; i++) {
        stars += i <= r.score ? '★' : '☆';
      }

      html += `
        <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 14px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <img src="${r.reviewerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80'}" alt="${r.reviewerName}" style="width: 30px; height: 30px; border-radius: var(--radius-full); object-fit: cover;" />
              <div>
                <span style="font-weight: 600; color: var(--text-main); font-size: 0.85rem;">${r.reviewerName}</span>
                <span style="font-size: 0.72rem; color: var(--text-subtle); margin-left: 6px;">(${r.reviewerType})</span>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="rating-stars">${stars} <span style="font-size: 0.82rem; color: var(--text-main);">${r.score.toFixed(1)}</span></span>
              <span style="font-size: 0.72rem; color: var(--text-subtle);">${r.date}</span>
            </div>
          </div>
          <p style="font-size: 0.84rem; color: var(--text-muted); line-height: 1.4; background: #ffffff; border: 1px solid var(--border-subtle); padding: 8px 12px; border-radius: var(--radius-sm);">"${r.review}"</p>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  }

  renderReports(container, reports) {
    if (!reports || !reports.length) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🛡️</div>
          <h3>Clean Record</h3>
          <p>No user reports or complaints have been submitted against this user.</p>
        </div>
      `;
      return;
    }

    let html = `<div style="display: grid; gap: 12px;">`;

    reports.forEach(r => {
      html += `
        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: var(--radius-md); padding: 14px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-weight: 700; color: #dc2626; font-size: 0.82rem;">${r.id}</span>
              <span class="status-badge status-${r.status.toLowerCase()}">${r.status}</span>
              <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">Category: ${r.category}</span>
            </div>
            <span style="font-size: 0.72rem; color: var(--text-subtle);">${r.date}</span>
          </div>
          <p style="font-size: 0.84rem; color: var(--text-main); line-height: 1.4;">${r.content}</p>
          <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border-subtle); padding-top: 8px; margin-top: 4px;">
            <span style="font-size: 0.75rem; color: var(--text-muted);">Reported by: <strong style="color: var(--text-main);">${r.reporterName}</strong></span>
            <button class="btn btn-secondary btn-sm" onclick="window.reportModal.open('${r.id}')">Open Report Details</button>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  }

  renderSubscriptionHistory(container, history) {
    if (!history || !history.length) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📜</div>
          <h3>No Plan Changes Recorded</h3>
          <p>Initial plan assignment has not been modified yet.</p>
        </div>
      `;
      return;
    }

    let html = `
      <div style="position: relative; padding-left: 20px; border-left: 2px solid var(--border-light); display: grid; gap: 16px;">
    `;

    history.forEach(h => {
      const newBadgeClass = h.newSubscription === 'Gold' ? 'sub-badge-gold' : (h.newSubscription === 'Gray' ? 'sub-badge-gray' : 'sub-badge-blue');
      const prevBadgeClass = h.previousSubscription === 'Gold' ? 'sub-badge-gold' : (h.previousSubscription === 'Gray' ? 'sub-badge-gray' : 'sub-badge-blue');

      html += `
        <div style="position: relative;">
          <div style="position: absolute; left: -26px; top: 3px; width: 10px; height: 10px; border-radius: var(--radius-full); background: var(--kova-emerald); box-shadow: 0 0 8px var(--kova-emerald);"></div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="sub-badge ${prevBadgeClass}">${h.previousSubscription}</span>
              <span style="color: var(--text-subtle);">➔</span>
              <span class="sub-badge ${newBadgeClass}">${h.newSubscription}</span>
            </div>
            <span style="font-size: 0.72rem; color: var(--text-subtle);">${h.dateChanged}</span>
          </div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">
            Updated by <strong>${h.adminName}</strong> • <em>"${h.reason}"</em>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  }
}

window.UserModal = UserModal;
