/**
 * KOVA Admin Dashboard - Reports View Controller (PRD Page 3)
 * Handles user and listing reports, category & status filters,
 * bidirectional profile cross-links, and ratings moderation overview (PRD 5.5).
 */

class ReportsView {
  constructor(store) {
    this.store = store;
    this.container = document.getElementById('view-reports');
    this.currentSubTab = 'reports'; // 'reports' | 'ratings'
  }

  render() {
    if (!this.container) return;

    const filters = this.store.state.reportFilters;
    const filteredReports = this.store.getFilteredReports();

    // Summary counts
    const allReports = this.store.data.reports;
    const newCount = allReports.filter(r => r.status === 'New').length;
    const reviewCount = allReports.filter(r => r.status === 'Under Review').length;
    const resolvedCount = allReports.filter(r => r.status === 'Resolved').length;
    const dismissedCount = allReports.filter(r => r.status === 'Dismissed').length;

    // Flagged users for ratings moderation (users with reports > 0 or rating < 4.0)
    const flaggedUsers = this.store.data.users.filter(u => {
      const reportsCount = allReports.filter(r => r.reportedUserId === u.id).length;
      return reportsCount > 0 || u.rating < 4.0;
    });

    this.container.innerHTML = `
      <!-- PAGE HEADER -->
      <div class="page-header">
        <div class="page-title-group">
          <h1>Trust & Safety Reports</h1>
          <p>Monitor user-submitted reports, content moderation, fraud alerts & review ratings</p>
        </div>
        <div class="page-header-actions">
          <button class="btn btn-secondary btn-sm" id="btn-reset-report-filters">
            ↺ Reset Filters
          </button>
        </div>
      </div>

      <!-- STATUS SUMMARY CARDS -->
      <div class="reports-stat-grid">
        <!-- Total Reports -->
        <div class="stat-card">
          <div class="stat-card-top">
            <span class="stat-card-title">Total Reports</span>
            <div class="stat-card-icon">📋</div>
          </div>
          <div class="stat-card-value">${allReports.length}</div>
          <div class="stat-card-footer"><span>Platform complaints</span></div>
        </div>

        <!-- New Reports -->
        <div class="stat-card" style="border-color: rgba(245, 158, 11, 0.4);">
          <div class="stat-card-top">
            <span class="stat-card-title" style="color: #92400e;">New / Unreviewed</span>
            <div class="stat-card-icon" style="background: #fef3c7; color: #b45309; border-color: #fde68a;">⚠️</div>
          </div>
          <div class="stat-card-value" style="color: #0f172a;">${newCount}</div>
          <div class="stat-card-footer"><span style="color: #92400e; font-weight: 600;">Needs investigation</span></div>
        </div>

        <!-- Under Review -->
        <div class="stat-card" style="border-color: rgba(8, 145, 178, 0.4);">
          <div class="stat-card-top">
            <span class="stat-card-title" style="color: #155e75;">Under Review</span>
            <div class="stat-card-icon" style="background: #ecfeff; color: #0e7490; border-color: #a5f3fc;">🔍</div>
          </div>
          <div class="stat-card-value" style="color: #0f172a;">${reviewCount}</div>
          <div class="stat-card-footer"><span style="color: #155e75; font-weight: 600;">Admin case active</span></div>
        </div>

        <!-- Resolved -->
        <div class="stat-card">
          <div class="stat-card-top">
            <span class="stat-card-title" style="color: #065f46;">Resolved</span>
            <div class="stat-card-icon" style="background: #ecfdf5; color: #059669; border-color: #a7f3d0;">✅</div>
          </div>
          <div class="stat-card-value" style="color: #0f172a;">${resolvedCount}</div>
          <div class="stat-card-footer"><span style="color: #065f46; font-weight: 600;">Action taken / closed</span></div>
        </div>

        <!-- Dismissed -->
        <div class="stat-card">
          <div class="stat-card-top">
            <span class="stat-card-title">Dismissed</span>
            <div class="stat-card-icon">❌</div>
          </div>
          <div class="stat-card-value" style="color: #334155;">${dismissedCount}</div>
          <div class="stat-card-footer"><span>False claim / invalid</span></div>
        </div>
      </div>

      <!-- VIEW SUB-TABS (Reports vs Ratings Moderation) -->
      <div class="reports-subtabs" style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 10px;">
        <button class="btn ${this.currentSubTab === 'reports' ? 'btn-primary' : 'btn-outline'}" id="subtab-btn-reports">
          🛡️ Incident Reports (${allReports.length})
        </button>
        <button class="btn ${this.currentSubTab === 'ratings' ? 'btn-primary' : 'btn-outline'}" id="subtab-btn-ratings">
          ⭐ Ratings & Review Moderation (${this.store.data.ratings.length})
        </button>
      </div>

      <!-- SUB-TAB 1: INCIDENT REPORTS TABLE -->
      <div id="subtab-pane-reports" style="display: ${this.currentSubTab === 'reports' ? 'block' : 'none'};">
        <!-- 5.2 FILTER TOOLBAR -->
        <div class="filter-bar">
          <div class="search-input-wrapper">
            <span class="search-icon-inline">🔍</span>
            <input type="text" id="report-search-input" class="search-input" placeholder="Search report content, ID, reporter, or reported user..." value="${filters.search || ''}" />
          </div>

          <!-- Category Filter -->
          <select id="report-filter-cat" class="select-custom">
            <option value="all" ${filters.category === 'all' ? 'selected' : ''}>All Categories</option>
            <option value="Fraud" ${filters.category === 'Fraud' ? 'selected' : ''}>Fraud</option>
            <option value="Scam" ${filters.category === 'Scam' ? 'selected' : ''}>Scam</option>
            <option value="Fake listing" ${filters.category === 'Fake listing' ? 'selected' : ''}>Fake listing</option>
            <option value="Misleading information" ${filters.category === 'Misleading information' ? 'selected' : ''}>Misleading information</option>
            <option value="Harassment" ${filters.category === 'Harassment' ? 'selected' : ''}>Harassment</option>
            <option value="Inappropriate behaviour" ${filters.category === 'Inappropriate behaviour' ? 'selected' : ''}>Inappropriate behaviour</option>
          </select>

          <!-- Status Filter -->
          <select id="report-filter-status" class="select-custom">
            <option value="all" ${filters.status === 'all' ? 'selected' : ''}>All Statuses</option>
            <option value="New" ${filters.status === 'New' ? 'selected' : ''}>New</option>
            <option value="Under Review" ${filters.status === 'Under Review' ? 'selected' : ''}>Under Review</option>
            <option value="Resolved" ${filters.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
            <option value="Dismissed" ${filters.status === 'Dismissed' ? 'selected' : ''}>Dismissed</option>
          </select>
        </div>

        <!-- 5.1 REPORTS TABLE -->
        <div class="dashboard-card">
          <div class="card-header">
            <div class="card-title-group">
              <h2>Submitted User Reports (${filteredReports.length} results)</h2>
              <p>Click any report to inspect evidence, reporter identity, and update case status</p>
            </div>
          </div>

          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th class="sticky-col">Reporter</th>
                  <th>Report ID</th>
                  <th>Reported Account</th>
                  <th>Category</th>
                  <th>Report Content</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${this.renderReportRows(filteredReports)}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- SUB-TAB 2: RATINGS & REVIEW MONITORING (PRD 5.5) -->
      <div id="subtab-pane-ratings" style="display: ${this.currentSubTab === 'ratings' ? 'block' : 'none'};">
        <!-- Flagged Accounts Alert -->
        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: var(--radius-lg); padding: 18px; margin-bottom: 24px;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
            <span style="font-size: 1.25rem;">⚠️</span>
            <h3 style="font-size: 0.95rem; font-weight: 700; color: #dc2626;">Accounts Receiving Multiple Complaints or Low Ratings</h3>
          </div>
          <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 14px;">The following users have been flagged for administrator review due to active reports or below-average customer satisfaction ratings:</p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px;">
            ${flaggedUsers.map(u => {
              const repCount = allReports.filter(r => r.reportedUserId === u.id).length;
              return `
                <div style="display: flex; align-items: center; justify-content: space-between; background: #ffffff; border: 1px solid var(--border-subtle); box-shadow: var(--shadow-sm); padding: 10px 14px; border-radius: var(--radius-md);">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="${u.avatar}" style="width: 34px; height: 34px; border-radius: var(--radius-full); object-fit: cover;" />
                    <div>
                      <div style="font-weight: 600; color: var(--text-main); font-size: 0.85rem;">${u.name}</div>
                      <div style="font-size: 0.72rem; color: var(--text-muted);">${u.category}</div>
                    </div>
                  </div>
                  <div style="text-align: right;">
                    <div style="font-size: 0.76rem; color: #dc2626; font-weight: 700;">${repCount} Reports</div>
                    <div class="rating-stars" style="font-size: 0.75rem;">★ ${u.rating}</div>
                    <button class="btn btn-outline btn-sm" style="margin-top: 4px;" onclick="window.userModal.open('${u.id}')">Inspect</button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- All Platform Ratings Table -->
        <div class="dashboard-card">
          <div class="card-header">
            <div class="card-title-group">
              <h2>Platform Ratings Feed (${this.store.data.ratings.length} reviews)</h2>
              <p>Ratings and written reviews submitted by buyers and tenants across Kova</p>
            </div>
          </div>

          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th class="sticky-col">Reviewer</th>
                  <th>Score</th>
                  <th>Rated User</th>
                  <th>Review Comment</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${this.renderRatingsRows(this.store.data.ratings)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  renderReportRows(reports) {
    if (!reports || !reports.length) {
      return `
        <tr>
          <td colspan="8">
            <div class="empty-state">
              <div class="empty-state-icon">🛡️</div>
              <h3>No Reports Found</h3>
              <p>No reports match your current search query or category filters.</p>
              <button class="btn btn-secondary btn-sm" onclick="window.app.resetReportFilters()">Clear Filters</button>
            </div>
          </td>
        </tr>
      `;
    }

    return reports.map(r => {
      const reporter = r.reporter;
      const reportedUser = r.reportedUser;

      const reporterSubBadge = reporter ? (reporter.subscription === 'Gold' ? 'sub-badge-gold' : (reporter.subscription === 'Gray' ? 'sub-badge-gray' : 'sub-badge-blue')) : 'sub-badge-none';
      const reportedSubBadge = reportedUser ? (reportedUser.subscription === 'Gold' ? 'sub-badge-gold' : (reportedUser.subscription === 'Gray' ? 'sub-badge-gray' : 'sub-badge-blue')) : 'sub-badge-none';

      return `
        <tr>
          <!-- Reporter (Sticky Column) -->
          <td class="sticky-col">
            ${reporter ? `
              <div class="entity-cell" style="cursor: pointer;" onclick="window.userModal.open('${reporter.id}')" title="View Reporter Profile">
                <img src="${reporter.avatar}" class="entity-avatar" style="width: 32px; height: 32px;" />
                <div class="entity-details">
                  <span class="entity-name" style="font-size: 0.82rem;">${reporter.name}</span>
                  <div style="display: flex; gap: 4px; margin-top: 2px;">
                    <span class="type-badge type-${reporter.userType}">${reporter.userType}</span>
                    <span class="sub-badge ${reporterSubBadge}">${reporter.subscription || 'Basic'}</span>
                  </div>
                </div>
              </div>
            ` : '<span style="color: var(--text-subtle);">Anonymous</span>'}
          </td>

          <!-- Report ID -->
          <td>
            <div style="font-weight: 700; color: #b91c1c;">${r.id}</div>
          </td>

          <!-- Reported User (With link to profile) -->
          <td>
            ${reportedUser ? `
              <div class="entity-cell" style="cursor: pointer;" onclick="window.userModal.open('${reportedUser.id}')" title="View Reported Profile">
                <img src="${reportedUser.avatar}" class="entity-avatar" style="width: 32px; height: 32px; border-color: #ef4444;" />
                <div class="entity-details">
                  <span class="entity-name" style="font-size: 0.82rem;">${reportedUser.name}</span>
                  <div style="display: flex; gap: 4px; margin-top: 2px;">
                    <span class="type-badge type-${reportedUser.userType}">${reportedUser.userType}</span>
                    <span class="sub-badge ${reportedSubBadge}">${reportedUser.subscription || 'Basic'}</span>
                  </div>
                </div>
              </div>
            ` : '<span style="color: var(--text-subtle);">Unknown</span>'}
          </td>

          <!-- Category -->
          <td>
            <span style="font-weight: 600; color: var(--text-main); font-size: 0.82rem;">${r.category}</span>
          </td>

          <!-- Content Snippet -->
          <td>
            <div style="max-width: 320px; font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
              ${r.content}
            </div>
          </td>

          <!-- Date -->
          <td><span style="font-size: 0.75rem; color: var(--text-subtle);">${r.date}</span></td>

          <!-- Status -->
          <td>
            <span class="status-badge status-${r.status.toLowerCase()}">${r.status}</span>
          </td>

          <!-- Action -->
          <td>
            <button class="btn btn-secondary btn-sm" onclick="window.reportModal.open('${r.id}')">
              Review
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  renderRatingsRows(ratings) {
    if (!ratings || !ratings.length) {
      return `<tr><td colspan="6"><div class="empty-state"><p>No ratings recorded.</p></div></td></tr>`;
    }

    return ratings.map(r => {
      const reviewer = this.store.data.users.find(u => u.id === r.reviewerId);
      const ratedUser = this.store.data.users.find(u => u.id === r.ratedUserId);

      let stars = '';
      for (let i = 1; i <= 5; i++) {
        stars += i <= r.score ? '★' : '☆';
      }

      return `
        <tr>
          <!-- Reviewer (Sticky Column) -->
          <td class="sticky-col">
            ${reviewer ? `
              <div style="display: flex; align-items: center; gap: 8px;">
                <img src="${reviewer.avatar}" style="width: 26px; height: 26px; border-radius: var(--radius-full); object-fit: cover;" />
                <span style="font-weight: 600; font-size: 0.82rem; color: var(--text-main);">${reviewer.name}</span>
              </div>
            ` : 'Customer'}
          </td>
          <td>
            <span class="rating-stars">${stars} <strong style="color: var(--text-main); font-size: 0.85rem; margin-left: 4px;">${r.score.toFixed(1)}</strong></span>
          </td>
          <td>
            ${ratedUser ? `
              <a href="javascript:void(0)" onclick="window.userModal.open('${ratedUser.id}')" style="display: flex; align-items: center; gap: 8px; color: var(--kova-emerald); font-weight: 600;">
                <img src="${ratedUser.avatar}" style="width: 26px; height: 26px; border-radius: var(--radius-full); object-fit: cover;" />
                <span>${ratedUser.name}</span>
              </a>
            ` : 'User'}
          </td>
          <td>
            <div style="font-size: 0.8rem; color: var(--text-main); max-width: 360px;">"${r.review}"</div>
          </td>
          <td><span style="font-size: 0.75rem; color: var(--text-subtle);">${r.date}</span></td>
          <td>
            ${ratedUser ? `
              <button class="btn btn-outline btn-sm" onclick="window.userModal.open('${ratedUser.id}')">
                View Account
              </button>
            ` : ''}
          </td>
        </tr>
      `;
    }).join('');
  }

  attachEventListeners() {
    // Search input
    const searchInput = this.container.querySelector('#report-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.store.setReportFilters({ search: e.target.value });
      });
    }

    // Category filter
    const catSelect = this.container.querySelector('#report-filter-cat');
    if (catSelect) {
      catSelect.addEventListener('change', (e) => {
        this.store.setReportFilters({ category: e.target.value });
      });
    }

    // Status filter
    const statusSelect = this.container.querySelector('#report-filter-status');
    if (statusSelect) {
      statusSelect.addEventListener('change', (e) => {
        this.store.setReportFilters({ status: e.target.value });
      });
    }

    // Reset button
    const resetBtn = this.container.querySelector('#btn-reset-report-filters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.store.resetReportFilters();
      });
    }

    // Sub-tab toggles (Incident Reports vs Ratings Moderation)
    const btnReports = this.container.querySelector('#subtab-btn-reports');
    const btnRatings = this.container.querySelector('#subtab-btn-ratings');
    const paneReports = this.container.querySelector('#subtab-pane-reports');
    const paneRatings = this.container.querySelector('#subtab-pane-ratings');

    if (btnReports && btnRatings) {
      btnReports.addEventListener('click', () => {
        this.currentSubTab = 'reports';
        btnReports.className = 'btn btn-primary';
        btnRatings.className = 'btn btn-outline';
        if (paneReports) paneReports.style.display = 'block';
        if (paneRatings) paneRatings.style.display = 'none';
      });

      btnRatings.addEventListener('click', () => {
        this.currentSubTab = 'ratings';
        btnRatings.className = 'btn btn-primary';
        btnReports.className = 'btn btn-outline';
        if (paneReports) paneReports.style.display = 'none';
        if (paneRatings) paneRatings.style.display = 'block';
      });
    }
  }
}

window.ReportsView = ReportsView;
