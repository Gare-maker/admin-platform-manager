/**
 * KOVA Admin Dashboard - Users View Controller (PRD Page 2)
 * Comprehensive user management: search, multi-filters, Top 5 vendors/agents,
 * full relational user table, subscription assignment shortcuts, and profiles.
 */

class UsersView {
  constructor(store) {
    this.store = store;
    this.container = document.getElementById('view-users');
  }

  render() {
    if (!this.container) return;

    const filters = this.store.state.userFilters;
    const filteredUsers = this.store.getFilteredUsers();
    const categories = this.store.getAllCategories();
    const topVendors = this.store.getTopVendors(5);
    const topAgents = this.store.getTopAgents(5);

    // Counts by type
    const allUsers = this.store.data.users;
    const vendorCount = allUsers.filter(u => u.userType === 'vendor').length;
    const agentCount = allUsers.filter(u => u.userType === 'agent').length;
    const customerCount = allUsers.filter(u => u.userType === 'customer').length;

    this.container.innerHTML = `
      <!-- PAGE HEADER -->
      <div class="page-header">
        <div class="page-title-group">
          <h1>User Management</h1>
          <p>Directory of ${allUsers.length} platform users (${vendorCount} vendors, ${agentCount} agents, ${customerCount} customers)</p>
        </div>
        <div class="page-header-actions">
          <button class="btn btn-secondary btn-sm" id="btn-reset-user-filters">
            ↺ Reset Filters
          </button>
        </div>
      </div>

      <!-- 4.7 TOP PERFORMING USERS SUMMARY (Top 5 Vendors & Top 5 Agents) -->
      <div class="performers-grid">
        <!-- Top 5 Vendors Card -->
        <div class="dashboard-card" style="margin-bottom: 0; padding: 18px;">
          <div class="card-header" style="margin-bottom: 12px;">
            <div class="card-title-group">
              <h2 style="font-size: 1rem;">🏆 Top 5 Vendors by Revenue</h2>
              <p>Aggregated from verified marketplace sales</p>
            </div>
          </div>
          <div style="display: grid; gap: 8px;">
            ${topVendors.map((v, i) => `
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; padding: 8px 10px; background: var(--bg-surface); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); cursor: pointer;" onclick="window.userModal.open('${v.id}')">
                <div style="display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1;">
                  <span style="font-weight: 800; font-size: 0.82rem; color: #b45309; flex-shrink: 0;">#${i + 1}</span>
                  <img src="${v.avatar}" style="width: 28px; height: 28px; border-radius: var(--radius-full); object-fit: cover; flex-shrink: 0;" />
                  <div style="min-width: 0;">
                    <div style="font-weight: 600; color: var(--text-main); font-size: 0.82rem; overflow: hidden; text-overflow: ellipsis;">${v.name}</div>
                    <div style="font-size: 0.7rem; color: var(--text-muted);">${v.category}</div>
                  </div>
                </div>
                <div style="text-align: right; flex-shrink: 0;">
                  <div class="price-tag" style="font-size: 0.82rem;">${this.store.formatNaira(v.totalTxValue)}</div>
                  <div style="font-size: 0.7rem; color: #047857; font-weight: 600;">${v.transactionsCount} sales</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Top 5 Agents Card -->
        <div class="dashboard-card" style="margin-bottom: 0; padding: 18px;">
          <div class="card-header" style="margin-bottom: 12px;">
            <div class="card-title-group">
              <h2 style="font-size: 1rem;">🏢 Top 5 Agents by Rental Volume</h2>
              <p>Aggregated from verified real estate rentals</p>
            </div>
          </div>
          <div style="display: grid; gap: 8px;">
            ${topAgents.map((a, i) => `
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; padding: 8px 10px; background: var(--bg-surface); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); cursor: pointer;" onclick="window.userModal.open('${a.id}')">
                <div style="display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1;">
                  <span style="font-weight: 800; font-size: 0.82rem; color: #6b21a8; flex-shrink: 0;">#${i + 1}</span>
                  <img src="${a.avatar}" style="width: 28px; height: 28px; border-radius: var(--radius-full); object-fit: cover; flex-shrink: 0;" />
                  <div style="min-width: 0;">
                    <div style="font-weight: 600; color: var(--text-main); font-size: 0.82rem; overflow: hidden; text-overflow: ellipsis;">${a.name}</div>
                    <div style="font-size: 0.7rem; color: var(--text-muted);">${a.propertyListingsCount} listings</div>
                  </div>
                </div>
                <div style="text-align: right; flex-shrink: 0;">
                  <div class="price-tag" style="font-size: 0.82rem;">${this.store.formatNaira(a.totalTxValue)}</div>
                  <div style="font-size: 0.7rem; color: #6b21a8; font-weight: 600;">${a.transactionsCount} rentals</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- 4.3 & 4.4 SEARCH AND ADVANCED FILTERS -->
      <div class="filter-bar">
        <!-- Search Field -->
        <div class="search-input-wrapper">
          <span class="search-icon-inline">🔍</span>
          <input type="text" id="user-search-input" class="search-input" placeholder="Search by name, email, phone, or ID..." value="${filters.search || ''}" />
        </div>

        <!-- User Type Filter -->
        <select id="user-filter-type" class="select-custom">
          <option value="all" ${filters.userType === 'all' ? 'selected' : ''}>All User Types</option>
          <option value="vendor" ${filters.userType === 'vendor' ? 'selected' : ''}>Vendors</option>
          <option value="agent" ${filters.userType === 'agent' ? 'selected' : ''}>Agents</option>
          <option value="customer" ${filters.userType === 'customer' ? 'selected' : ''}>Customers</option>
        </select>

        <!-- Subscription Filter (PRD Required: Gold, Gray, Blue/Basic, None) -->
        <select id="user-filter-sub" class="select-custom">
          <option value="all" ${filters.subscription === 'all' ? 'selected' : ''}>All Subscriptions</option>
          <option value="Gold" ${filters.subscription === 'Gold' ? 'selected' : ''}>Gold Plan</option>
          <option value="Gray" ${filters.subscription === 'Gray' ? 'selected' : ''}>Gray Plan</option>
          <option value="Blue / Basic" ${filters.subscription === 'Blue / Basic' ? 'selected' : ''}>Blue / Basic</option>
          <option value="None" ${filters.subscription === 'None' ? 'selected' : ''}>No Subscription</option>
        </select>

        <!-- Category Filter -->
        <select id="user-filter-cat" class="select-custom">
          <option value="all" ${filters.category === 'all' ? 'selected' : ''}>All Categories</option>
          ${categories.map(c => `<option value="${c}" ${filters.category === c ? 'selected' : ''}>${c}</option>`).join('')}
        </select>

        <!-- Account Status Filter -->
        <select id="user-filter-status" class="select-custom">
          <option value="all" ${filters.accountStatus === 'all' ? 'selected' : ''}>All Statuses</option>
          <option value="active" ${filters.accountStatus === 'active' ? 'selected' : ''}>Active</option>
          <option value="suspended" ${filters.accountStatus === 'suspended' ? 'selected' : ''}>Suspended</option>
          <option value="blocked" ${filters.accountStatus === 'blocked' ? 'selected' : ''}>Blocked</option>
        </select>

        <!-- Rating Filter -->
        <select id="user-filter-rating" class="select-custom">
          <option value="all" ${filters.rating === 'all' ? 'selected' : ''}>Any Rating</option>
          <option value="4.8" ${filters.rating === '4.8' ? 'selected' : ''}>★ 4.8 & Above</option>
          <option value="4.5" ${filters.rating === '4.5' ? 'selected' : ''}>★ 4.5 & Above</option>
          <option value="4.0" ${filters.rating === '4.0' ? 'selected' : ''}>★ 4.0 & Above</option>
        </select>
      </div>

      <!-- 4.1 USERS TABLE (All required columns from PRD) -->
      <div class="dashboard-card">
        <div class="card-header">
          <div class="card-title-group">
            <h2>User Directory (${filteredUsers.length} matches)</h2>
            <p>Click any user to inspect their listings, transactions, ratings, or reports</p>
          </div>
        </div>

        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th class="sticky-col">User</th>
                <th>Type</th>
                <th>Category</th>
                <th>Subscription</th>
                <th>Listings</th>
                <th>Transactions</th>
                <th>Total Value</th>
                <th>Rating</th>
                <th>Reports</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${this.renderUserRows(filteredUsers)}
            </tbody>
          </table>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  renderUserRows(users) {
    if (!users || !users.length) {
      return `
        <tr>
          <td colspan="12">
            <div class="empty-state">
              <div class="empty-state-icon">👥</div>
              <h3>No Users Found</h3>
              <p>No users match your selected search query or filters.</p>
              <button class="btn btn-secondary btn-sm" onclick="window.app.resetUserFilters()">Clear All Filters</button>
            </div>
          </td>
        </tr>
      `;
    }

    return users.map(u => {
      const subBadgeClass = u.subscription === 'Gold' ? 'sub-badge-gold' : (u.subscription === 'Gray' ? 'sub-badge-gray' : 'sub-badge-blue');

      // Reports badge alert if user has reports
      const reportsBadge = u.reportsCount > 0 
        ? `<span class="status-badge status-failed" style="font-weight: 700;">🚨 ${u.reportsCount}</span>`
        : `<span style="color: var(--text-subtle); font-size: 0.8rem;">0</span>`;

      return `
        <tr>
          <!-- User Info -->
          <td class="sticky-col">
            <div class="entity-cell" style="cursor: pointer;" onclick="window.userModal.open('${u.id}')">
              <img src="${u.avatar}" class="entity-avatar" />
              <div class="entity-details">
                <span class="entity-name">${u.name}</span>
                <span class="entity-meta">${u.email}</span>
                <span class="entity-meta" style="color: var(--text-subtle); font-size: 0.7rem;">${u.id} • ${u.phone}</span>
              </div>
            </div>
          </td>

          <!-- Type -->
          <td><span class="type-badge type-${u.userType}">${u.userType}</span></td>

          <!-- Category -->
          <td><span style="font-size: 0.8rem; color: var(--text-muted);">${u.category}</span></td>

          <!-- Subscription Badge (PRD 4.6: clear visual badge with text always visible) -->
          <td>
            <span class="sub-badge ${subBadgeClass}" style="cursor: pointer;" onclick="window.subscriptionModal.open('${u.id}')" title="Click to change subscription">
              ${u.subscription || 'None'}
            </span>
          </td>

          <!-- Listings: Total & Active -->
          <td>
            <div style="font-weight: 600; color: var(--text-main);">${u.activeListingsCount} <span style="color: var(--text-subtle); font-size: 0.75rem;">/ ${u.listingsCount}</span></div>
            <div style="font-size: 0.7rem; color: var(--text-muted);">Active / Total</div>
          </td>

          <!-- Transactions Count -->
          <td><strong>${u.transactionsCount}</strong></td>

          <!-- Total Transaction Value -->
          <td><span class="price-tag">${this.store.formatNaira(u.totalTxValue)}</span></td>

          <!-- Rating -->
          <td><span class="rating-stars">★ ${u.rating.toFixed(1)}</span></td>

          <!-- Reports against User -->
          <td>${reportsBadge}</td>

          <!-- Account Status -->
          <td><span class="status-badge status-${u.accountStatus.toLowerCase()}">${u.accountStatus}</span></td>

          <!-- Date Joined -->
          <td><span style="font-size: 0.75rem; color: var(--text-subtle);">${u.dateJoined}</span></td>

          <!-- Actions -->
          <td>
            <div style="display: flex; align-items: center; gap: 6px;">
              <button class="btn btn-outline btn-sm" onclick="window.userModal.open('${u.id}')" title="View Full Profile">
                Profile
              </button>
              <button class="btn btn-secondary btn-sm" onclick="window.subscriptionModal.open('${u.id}')" title="Assign / Change Subscription">
                Plan
              </button>
              ${u.accountStatus !== 'Active' ? `
                <button class="btn btn-success btn-sm" onclick="window.app.setUserStatus('${u.id}', 'Active')" title="Reactivate User Account">
                  Activate
                </button>
              ` : ''}
              ${u.accountStatus !== 'Suspended' ? `
                <button class="btn btn-warning btn-sm" onclick="window.app.setUserStatus('${u.id}', 'Suspended')" title="Temporarily Suspend User">
                  Suspend
                </button>
              ` : ''}
              ${u.accountStatus !== 'Blocked' ? `
                <button class="btn btn-danger btn-sm" onclick="window.app.setUserStatus('${u.id}', 'Blocked')" title="Permanently Block User">
                  Block
                </button>
              ` : ''}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  attachEventListeners() {
    // Search input
    const searchInput = this.container.querySelector('#user-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.store.setUserFilters({ search: e.target.value });
      });
    }

    // Dropdowns
    const typeSelect = this.container.querySelector('#user-filter-type');
    if (typeSelect) {
      typeSelect.addEventListener('change', (e) => {
        this.store.setUserFilters({ userType: e.target.value });
      });
    }

    const subSelect = this.container.querySelector('#user-filter-sub');
    if (subSelect) {
      subSelect.addEventListener('change', (e) => {
        this.store.setUserFilters({ subscription: e.target.value });
      });
    }

    const catSelect = this.container.querySelector('#user-filter-cat');
    if (catSelect) {
      catSelect.addEventListener('change', (e) => {
        this.store.setUserFilters({ category: e.target.value });
      });
    }

    const statusSelect = this.container.querySelector('#user-filter-status');
    if (statusSelect) {
      statusSelect.addEventListener('change', (e) => {
        this.store.setUserFilters({ accountStatus: e.target.value });
      });
    }

    const ratingSelect = this.container.querySelector('#user-filter-rating');
    if (ratingSelect) {
      ratingSelect.addEventListener('change', (e) => {
        this.store.setUserFilters({ rating: e.target.value });
      });
    }

    // Reset button
    const resetBtn = this.container.querySelector('#btn-reset-user-filters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.store.resetUserFilters();
      });
    }
  }
}

window.UsersView = UsersView;
