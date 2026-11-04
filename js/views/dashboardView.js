/**
 * KOVA Admin Dashboard - Dashboard View Controller (PRD Page 1)
 * Renders summary statistics, filters, transaction chart, top products,
 * top vendors, top agents, subscription overview, and recent activity.
 */

class DashboardView {
  constructor(store) {
    this.store = store;
    this.container = document.getElementById('view-dashboard');
    this.chart = null;
  }

  render() {
    if (!this.container) return;

    const stats = this.store.getSummaryStats();
    const dateRange = this.store.state.dashboardDateRange;
    const chartMetric = this.store.state.chartMetric;

    // Top performers
    const bestCategories = this.store.getBestCategories(5);
    const bestProperties = this.store.getBestProperties(5);
    const topVendors = this.store.getTopVendors(5);
    const topAgents = this.store.getTopAgents(5);
    const recentTx = this.store.getRecentTransactions(8);
    const recentActivities = this.store.getRecentActivities(8);

    const feePercent = (this.store.data.config.platformFeeRate * 100).toFixed(1) + '%';

    this.container.innerHTML = `
      <!-- PAGE HEADER -->
      <div class="page-header">
        <div class="page-title-group">
          <h1>Platform Dashboard</h1>
          <p>Real-time marketplace oversight, revenue metrics, subscriptions & transactions</p>
        </div>
        <div class="page-header-actions">
          <button class="btn btn-secondary btn-sm" onclick="window.app.refreshAll()">
            🔄 Refresh Data
          </button>
          <button class="btn btn-primary btn-sm" onclick="window.app.openFeeSettings()">
            ⚙️ Platform Fee: ${feePercent}
          </button>
        </div>
      </div>

      <!-- 3.2 DASHBOARD DATE FILTERS -->
      <div class="filter-bar">
        <div style="font-size: 0.76rem; font-weight: 700; text-transform: uppercase; color: var(--text-subtle); margin-right: 4px;">Timeframe:</div>
        <div class="date-filter-group">
          <button class="filter-chip ${dateRange === 'today' ? 'active' : ''}" data-range="today">Today</button>
          <button class="filter-chip ${dateRange === '7d' ? 'active' : ''}" data-range="7d">Last 7 Days</button>
          <button class="filter-chip ${dateRange === '30d' ? 'active' : ''}" data-range="30d">Last 30 Days</button>
          <button class="filter-chip ${dateRange === 'this_month' ? 'active' : ''}" data-range="this_month">This Month</button>
          <button class="filter-chip ${dateRange === 'last_month' ? 'active' : ''}" data-range="last_month">Last Month</button>
          <button class="filter-chip ${dateRange === 'this_year' ? 'active' : ''}" data-range="this_year">This Year</button>
          <button class="filter-chip ${dateRange === 'custom' ? 'active' : ''}" data-range="custom">Custom</button>
        </div>

        <!-- Custom Date Range Picker Inputs (Visible if custom selected) -->
        <div id="custom-date-box" class="custom-date-inputs" style="display: ${dateRange === 'custom' ? 'flex' : 'none'};">
          <span>From</span>
          <input type="date" id="dash-custom-start" value="${this.store.state.customStartDate || '2026-01-01'}" />
          <span>To</span>
          <input type="date" id="dash-custom-end" value="${this.store.state.customEndDate || '2026-09-16'}" />
          <button class="btn btn-primary btn-sm" id="btn-apply-custom-date">Apply</button>
        </div>
      </div>

      <!-- 3.1 SUMMARY STATISTICS (PRD Required Stats) -->
      <div class="stat-grid">
        <!-- 1. Total Users -->
        <div class="stat-card" style="cursor: pointer;" onclick="window.app.navigateTo('users')">
          <div class="stat-card-top">
            <span class="stat-card-title">Total Users</span>
            <div class="stat-card-icon">👥</div>
          </div>
          <div class="stat-card-value">${this.store.formatNumber(stats.totalUsers)}</div>
          <div class="stat-card-footer">
            <span class="stat-pill">Active on Kova</span>
            <span>Vendors, Agents & Buyers</span>
          </div>
        </div>

        <!-- 2. Total Products -->
        <div class="stat-card">
          <div class="stat-card-top">
            <span class="stat-card-title">Total Products</span>
            <div class="stat-card-icon">🛍️</div>
          </div>
          <div class="stat-card-value">${this.store.formatNumber(stats.totalProducts)}</div>
          <div class="stat-card-footer">
            <span class="stat-pill">Catalog</span>
            <span>Retail & Wholesale items</span>
          </div>
        </div>

        <!-- 3. Total Property Listings -->
        <div class="stat-card">
          <div class="stat-card-top">
            <span class="stat-card-title">Property Listings</span>
            <div class="stat-card-icon">🏢</div>
          </div>
          <div class="stat-card-value">${this.store.formatNumber(stats.totalProperties)}</div>
          <div class="stat-card-footer">
            <span class="stat-pill">Real Estate</span>
            <span>Rentals, Lodges & Suites</span>
          </div>
        </div>

        <!-- 4. Active Listings -->
        <div class="stat-card">
          <div class="stat-card-top">
            <span class="stat-card-title">Active Listings</span>
            <div class="stat-card-icon">⚡</div>
          </div>
          <div class="stat-card-value" style="color: #34d399;">${this.store.formatNumber(stats.activeListings)}</div>
          <div class="stat-card-footer">
            <span class="stat-pill">Live Now</span>
            <span>Products & Properties</span>
          </div>
        </div>

        <!-- 5. Total Transactions -->
        <div class="stat-card">
          <div class="stat-card-top">
            <span class="stat-card-title">Total Transactions</span>
            <div class="stat-card-icon">💳</div>
          </div>
          <div class="stat-card-value">${this.store.formatNumber(stats.totalTransactions)}</div>
          <div class="stat-card-footer">
            <span class="stat-pill">Completed</span>
            <span>${stats.filteredTransactionsCount} in period</span>
          </div>
        </div>

        <!-- 6. Total Money Transacted (CRITICAL DISTINCTION) -->
        <div class="stat-card card-transacted">
          <div class="stat-card-top">
            <span class="stat-card-title">Total Transacted Value</span>
            <div class="stat-card-icon">💰</div>
          </div>
          <div class="stat-card-value" style="color: #38bdf8;">${this.store.formatNaira(stats.totalMoneyTransacted)}</div>
          <div class="stat-card-footer">
            <span style="color: #38bdf8; font-weight: 700;">Gross Volume</span>
            <span>All sales & rentals in period</span>
          </div>
        </div>

        <!-- 7. Monthly Transaction Value -->
        <div class="stat-card">
          <div class="stat-card-top">
            <span class="stat-card-title">Monthly Tx Value</span>
            <div class="stat-card-icon">📅</div>
          </div>
          <div class="stat-card-value">${this.store.formatNaira(stats.monthlyTransactionValue)}</div>
          <div class="stat-card-footer">
            <span class="stat-pill">Current Month</span>
            <span>September 2026 volume</span>
          </div>
        </div>

        <!-- 8. Monthly Revenue (CRITICAL DISTINCTION: Kova fee on current month) -->
        <div class="stat-card card-revenue">
          <div class="stat-card-top">
            <span class="stat-card-title">Monthly Revenue</span>
            <div class="stat-card-icon">📈</div>
          </div>
          <div class="stat-card-value" style="color: #c084fc;">${this.store.formatNaira(stats.monthlyRevenue)}</div>
          <div class="stat-card-footer">
            <span style="color: #c084fc; font-weight: 700;">Sep 2026</span>
            <span>Kova ${feePercent} commission</span>
          </div>
        </div>

        <!-- 9. Kova Profit (CRITICAL DISTINCTION: Platform fee for selected period) -->
        <div class="stat-card card-profit">
          <div class="stat-card-top">
            <span class="stat-card-title">Kova Profit (${feePercent})</span>
            <div class="stat-card-icon">✨</div>
          </div>
          <div class="stat-card-value" style="color: #10b981;">${this.store.formatNaira(stats.kovaProfit)}</div>
          <div class="stat-card-footer">
            <span style="color: #10b981; font-weight: 700;">Net Platform Fee</span>
            <span>Lifetime: ${this.store.formatNaira(stats.lifetimeKovaProfit)}</span>
          </div>
        </div>
      </div>

      <!-- 3.8 SUBSCRIPTION OVERVIEW CARDS (Gold, Gray, Blue/Basic with % of Subscribed) -->
      <div style="margin-bottom: 24px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <div>
            <h2 style="font-size: 1.1rem; font-weight: 700; color: var(--text-main);">Active Subscriptions Overview</h2>
            <p style="font-size: 0.78rem; color: var(--text-muted);">${stats.activeSubscriptions.total} total subscribed users across active plans. Click plan to view users.</p>
          </div>
          <span style="font-size: 0.76rem; color: var(--text-subtle);">Click a card to filter users</span>
        </div>

        <div class="sub-overview-grid">
          <!-- Gold Plan Card -->
          <div class="sub-plan-card plan-gold" onclick="window.app.navigateTo('users', { subscription: 'Gold' })">
            <div class="sub-plan-header">
              <span class="sub-badge sub-badge-gold">GOLD PLAN</span>
              <span class="sub-plan-percent">${stats.activeSubscriptions.gold.percent.toFixed(1)}% of subscribers</span>
            </div>
            <div class="sub-plan-count">${stats.activeSubscriptions.gold.count} Users</div>
            <div class="sub-plan-bar">
              <div class="sub-plan-progress" style="width: ${stats.activeSubscriptions.gold.percent}%;"></div>
            </div>
          </div>

          <!-- Gray Plan Card -->
          <div class="sub-plan-card plan-gray" onclick="window.app.navigateTo('users', { subscription: 'Gray' })">
            <div class="sub-plan-header">
              <span class="sub-badge sub-badge-gray">GRAY PLAN</span>
              <span class="sub-plan-percent">${stats.activeSubscriptions.gray.percent.toFixed(1)}% of subscribers</span>
            </div>
            <div class="sub-plan-count">${stats.activeSubscriptions.gray.count} Users</div>
            <div class="sub-plan-bar">
              <div class="sub-plan-progress" style="width: ${stats.activeSubscriptions.gray.percent}%;"></div>
            </div>
          </div>

          <!-- Blue / Basic Plan Card -->
          <div class="sub-plan-card plan-blue" onclick="window.app.navigateTo('users', { subscription: 'Blue / Basic' })">
            <div class="sub-plan-header">
              <span class="sub-badge sub-badge-blue">BLUE / BASIC</span>
              <span class="sub-plan-percent">${stats.activeSubscriptions.blue.percent.toFixed(1)}% of subscribers</span>
            </div>
            <div class="sub-plan-count">${stats.activeSubscriptions.blue.count} Users</div>
            <div class="sub-plan-bar">
              <div class="sub-plan-progress" style="width: ${stats.activeSubscriptions.blue.percent}%;"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3.4 TRANSACTION GRAPH -->
      <div class="chart-container">
        <div class="chart-header">
          <div>
            <h2 style="font-size: 1.12rem; font-weight: 700; color: var(--text-main);">Transaction Activity & Revenue Curve</h2>
            <p style="font-size: 0.8rem; color: var(--text-muted);">Platform growth timeline from January to September 2026</p>
          </div>
          <div class="metric-tabs">
            <button class="metric-tab ${chartMetric === 'value' ? 'active' : ''}" data-metric="value">Transaction Value</button>
            <button class="metric-tab ${chartMetric === 'volume' ? 'active' : ''}" data-metric="volume">Transaction Volume</button>
            <button class="metric-tab ${chartMetric === 'revenue' ? 'active' : ''}" data-metric="revenue">Kova Revenue</button>
            <button class="metric-tab ${chartMetric === 'profit' ? 'active' : ''}" data-metric="profit">Kova Profit (${feePercent})</button>
          </div>
        </div>
        <div id="dash-chart-svg" class="svg-chart-wrapper"></div>
      </div>

      <!-- TWO-COLUMN SECTION: TOP VENDORS & TOP AGENTS -->
      <div class="performers-grid">
        <!-- 3.6 TOP 5 VENDORS -->
        <div class="dashboard-card" style="margin-bottom: 0;">
          <div class="card-header">
            <div class="card-title-group">
              <h2>Top 5 Vendors</h2>
              <p>Ranked by completed marketplace sales volume</p>
            </div>
            <button class="btn btn-outline btn-sm" onclick="window.app.navigateTo('users', { userType: 'vendor' })">View All Vendors</button>
          </div>
          <div style="display: grid; gap: 10px;">
            ${this.renderTopVendors(topVendors)}
          </div>
        </div>

        <!-- 3.7 TOP 5 AGENTS -->
        <div class="dashboard-card" style="margin-bottom: 0;">
          <div class="card-header">
            <div class="card-title-group">
              <h2>Top 5 Agents</h2>
              <p>Ranked by completed property rental volume</p>
            </div>
            <button class="btn btn-outline btn-sm" onclick="window.app.navigateTo('users', { userType: 'agent' })">View All Agents</button>
          </div>
          <div style="display: grid; gap: 10px;">
            ${this.renderTopAgents(topAgents)}
          </div>
        </div>
      </div>

      <!-- 3.5 BEST-PERFORMING CATEGORIES -->
      <div class="dashboard-card">
        <div class="card-header">
          <div class="card-title-group">
            <h2>🏆 Best-Performing Category in Marketplace</h2>
            <p>Top retail, electronic, and marketplace product sectors</p>
          </div>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th class="sticky-col">Category Name</th>
                <th>Sector</th>
                <th>Active Listings</th>
                <th>Completed Orders</th>
                <th>Gross Transacted Value</th>
                <th>Kova Platform Fee</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${this.renderBestCategories(bestCategories)}
            </tbody>
          </table>
        </div>
      </div>

      <!-- BEST-PERFORMING REAL ESTATE -->
      <div class="dashboard-card">
        <div class="card-header">
          <div class="card-title-group">
            <h2>🏢 Best-Performing Real Estate Properties</h2>
            <p>Highest grossing real estate rentals, serviced lodges & luxury suites</p>
          </div>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th class="sticky-col">Property Name</th>
                <th>Category</th>
                <th>Managing Agent</th>
                <th>Rental Rate</th>
                <th>Completed Rentals</th>
                <th>Total Rental Value</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${this.renderBestProperties(bestProperties)}
            </tbody>
          </table>
        </div>
      </div>

      <!-- 3.3 TRANSACTION OVERVIEW TABLE & 3.9 RECENT ACTIVITY -->
      <div class="transactions-activity-grid">
        <!-- Recent Transactions -->
        <div class="dashboard-card" style="margin-bottom: 0;">
          <div class="card-header">
            <div class="card-title-group">
              <h2>Recent Marketplace Transactions</h2>
              <p>Live transaction stream across products & real estate</p>
            </div>
          </div>
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th class="sticky-col">Counterparties</th>
                  <th>ID & Date</th>
                  <th>Item / Property</th>
                  <th>Amount</th>
                  <th>Kova Fee (4.9%)</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${this.renderRecentTransactions(recentTx)}
              </tbody>
            </table>
          </div>
        </div>

        <!-- 3.9 Recent Activity Stream -->
        <div class="dashboard-card" style="margin-bottom: 0;">
          <div class="card-header">
            <div class="card-title-group">
              <h2>Recent Platform Activity</h2>
              <p>Key administrative & user actions</p>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 12px; max-height: 480px; overflow-y: auto;">
            ${this.renderRecentActivities(recentActivities)}
          </div>
        </div>
      </div>
    `;

    // Initialize interactive chart
    this.chart = new KovaChart('dash-chart-svg', this.store);

    // Attach view listeners
    this.attachEventListeners();
  }

  renderTopVendors(vendors) {
    if (!vendors || !vendors.length) {
      return '<div class="empty-state"><p>No vendor data available.</p></div>';
    }

    return vendors.map((v, i) => {
      const subBadgeClass = v.subscription === 'Gold' ? 'sub-badge-gold' : (v.subscription === 'Gray' ? 'sub-badge-gray' : 'sub-badge-blue');
      return `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); transition: all 0.15s; cursor: pointer;" onclick="window.userModal.open('${v.id}')">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="font-weight: 800; color: ${i === 0 ? '#fbbf24' : (i === 1 ? '#cbd5e1' : '#64748b')}; font-size: 0.95rem; width: 18px;">#${i + 1}</div>
            <img src="${v.avatar}" alt="${v.name}" style="width: 36px; height: 36px; border-radius: var(--radius-full); object-fit: cover;" />
            <div>
              <div style="font-weight: 700; color: var(--text-main); font-size: 0.88rem;">${v.name}</div>
              <div style="font-size: 0.73rem; color: var(--text-muted);">${v.category} • ${v.activeListingsCount} active listings</div>
            </div>
          </div>
          <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 3px;">
            <div class="price-tag">${this.store.formatNaira(v.totalTxValue)}</div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span class="rating-stars">★ ${v.rating}</span>
              <span class="sub-badge ${subBadgeClass}">${v.subscription}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  renderTopAgents(agents) {
    if (!agents || !agents.length) {
      return '<div class="empty-state"><p>No agent data available.</p></div>';
    }

    return agents.map((a, i) => {
      const subBadgeClass = a.subscription === 'Gold' ? 'sub-badge-gold' : (a.subscription === 'Gray' ? 'sub-badge-gray' : 'sub-badge-blue');
      return `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); transition: all 0.15s; cursor: pointer;" onclick="window.userModal.open('${a.id}')">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="font-weight: 800; color: ${i === 0 ? '#fbbf24' : (i === 1 ? '#cbd5e1' : '#64748b')}; font-size: 0.95rem; width: 18px;">#${i + 1}</div>
            <img src="${a.avatar}" alt="${a.name}" style="width: 36px; height: 36px; border-radius: var(--radius-full); object-fit: cover;" />
            <div>
              <div style="font-weight: 700; color: var(--text-main); font-size: 0.88rem;">${a.name}</div>
              <div style="font-size: 0.73rem; color: var(--text-muted);">${a.propertyListingsCount} properties • ${a.transactionsCount} rentals</div>
            </div>
          </div>
          <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 3px;">
            <div class="price-tag">${this.store.formatNaira(a.totalTxValue)}</div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span class="rating-stars">★ ${a.rating}</span>
              <span class="sub-badge ${subBadgeClass}">${a.subscription}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  renderBestCategories(categories) {
    if (!categories || !categories.length) {
      return `<tr><td colspan="7"><div class="empty-state"><p>No category performance data found.</p></div></td></tr>`;
    }

    return categories.map(c => `
      <tr>
        <td class="sticky-col">
          <div style="font-weight: 700; color: var(--text-main);">${c.category}</div>
        </td>
        <td>
          <span class="type-badge type-${c.typeBadge}">${c.type}</span>
        </td>
        <td><strong>${c.activeListings}</strong> active</td>
        <td><strong>${c.transactionsCount}</strong> orders</td>
        <td><span class="price-tag">${this.store.formatNaira(c.totalTxValue)}</span></td>
        <td><span class="fee-tag">${this.store.formatNaira(c.platformRevenue)}</span></td>
        <td>
          <button class="btn btn-outline btn-sm" onclick="window.app.navigateTo('users', { category: '${c.category}' })">
            Filter Users
          </button>
        </td>
      </tr>
    `).join('');
  }

  renderBestProperties(properties) {
    if (!properties || !properties.length) {
      return `<tr><td colspan="8"><div class="empty-state"><p>No property performance data found.</p></div></td></tr>`;
    }

    return properties.map(p => `
      <tr>
        <td class="sticky-col">
          <div style="font-weight: 700; color: var(--text-main); font-size: 0.88rem;">${p.name}</div>
          <div style="font-size: 0.72rem; color: var(--text-subtle); margin-top: 2px;">Ref: ${p.id}</div>
        </td>
        <td><span style="font-size: 0.8rem; color: var(--text-muted);">${p.category}</span></td>
        <td>
          <a href="javascript:void(0)" onclick="window.userModal.open('${p.agentId}')" style="color: var(--kova-emerald); font-weight: 600;">
            ${p.agentName}
          </a>
        </td>
        <td><span class="price-tag">${this.store.formatNaira(p.price)}/yr</span></td>
        <td><strong>${p.rentalsCount}</strong> completed</td>
        <td><span class="price-tag" style="color: #0284c7;">${this.store.formatNaira(p.totalTxValue)}</span></td>
        <td><span class="status-badge status-${p.status.toLowerCase()}">${p.status}</span></td>
        <td>
          <button class="btn btn-outline btn-sm" onclick="window.userModal.open('${p.agentId}')">
            View Agent
          </button>
        </td>
      </tr>
    `).join('');
  }

  renderRecentTransactions(txs) {
    if (!txs || !txs.length) {
      return `<tr><td colspan="7"><div class="empty-state"><p>No transactions recorded for this period.</p></div></td></tr>`;
    }

    return txs.map(t => `
      <tr>
        <td class="sticky-col">
          <div style="font-size: 0.82rem;">
            <div style="color: var(--text-main); font-weight: 600;">Buyer: ${t.buyerName}</div>
            <div style="color: var(--text-muted); font-size: 0.74rem;">Seller: ${t.sellerName}</div>
          </div>
        </td>
        <td>
          <div style="font-weight: 600; color: var(--text-main);">${t.id}</div>
          <div style="font-size: 0.72rem; color: var(--text-subtle);">${t.date}</div>
        </td>
        <td>
          <div style="font-weight: 600; color: var(--text-main);">${t.listingName}</div>
          <div style="font-size: 0.72rem; color: var(--text-muted);">${t.type}</div>
        </td>
        <td><span class="price-tag">${this.store.formatNaira(t.amount)}</span></td>
        <td><span class="fee-tag">${this.store.formatNaira(t.fee)}</span></td>
        <td><span class="status-badge status-${t.status.toLowerCase()}">${t.status}</span></td>
        <td>
          <button class="btn btn-outline btn-sm" onclick="window.transactionModal.open('${t.id}')">
            Details
          </button>
        </td>
      </tr>
    `).join('');
  }

  renderRecentActivities(activities) {
    if (!activities || !activities.length) {
      return '<div class="empty-state"><p>No recent activity.</p></div>';
    }

    return activities.map(act => `
      <div style="display: flex; align-items: flex-start; gap: 10px; padding: 10px; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); font-size: 0.8rem;">
        <span style="font-size: 1.1rem; line-height: 1;">${act.icon || '📌'}</span>
        <div style="flex: 1;">
          <div style="color: var(--text-main); font-weight: 500; line-height: 1.3;">${act.text}</div>
          <div style="font-size: 0.72rem; color: var(--text-subtle); margin-top: 2px;">${act.date}</div>
        </div>
      </div>
    `).join('');
  }

  attachEventListeners() {
    // 1. Date Range Chips
    const chips = this.container.querySelectorAll('.date-filter-group .filter-chip');
    const customBox = this.container.querySelector('#custom-date-box');

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const range = chip.getAttribute('data-range');
        if (range === 'custom') {
          if (customBox) customBox.style.display = 'flex';
        } else {
          if (customBox) customBox.style.display = 'none';
          this.store.setDashboardDateRange(range);
        }
      });
    });

    // Custom date apply button
    const applyBtn = this.container.querySelector('#btn-apply-custom-date');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        const start = this.container.querySelector('#dash-custom-start').value;
        const end = this.container.querySelector('#dash-custom-end').value;
        this.store.setDashboardDateRange('custom', start, end);
      });
    }

    // 2. Chart Metric Switchers
    const metricTabs = this.container.querySelectorAll('.metric-tabs .metric-tab');
    metricTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const metric = tab.getAttribute('data-metric');
        metricTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        if (this.chart) {
          this.chart.setMetric(metric);
        }
      });
    });
  }
}

window.DashboardView = DashboardView;
