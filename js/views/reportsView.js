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

    const userReportsCount = allReports.filter(r => (r.targetType || 'user') === 'user').length;
    const productReportsCount = allReports.filter(r => r.targetType === 'product').length;
    const propertyReportsCount = allReports.filter(r => r.targetType === 'property').length;

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
          <p>Monitor user, product & property listing reports with Report Type, Description, and Both Parties' Invoice</p>
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
          <div class="stat-card-footer"><span>${userReportsCount} User • ${productReportsCount} Product • ${propertyReportsCount} Listing</span></div>
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
        <!-- QUICK TARGET TYPE FILTER PILLS -->
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px;">
          <button type="button" class="btn btn-sm ${(filters.targetType || 'all') === 'all' ? 'btn-primary' : 'btn-outline'}" data-target-pill="all">
            All Targets (${allReports.length})
          </button>
          <button type="button" class="btn btn-sm ${filters.targetType === 'user' ? 'btn-primary' : 'btn-outline'}" data-target-pill="user">
            👤 User Reports (${userReportsCount})
          </button>
          <button type="button" class="btn btn-sm ${filters.targetType === 'product' ? 'btn-primary' : 'btn-outline'}" data-target-pill="product">
            🛍️ Product Reports (${productReportsCount})
          </button>
          <button type="button" class="btn btn-sm ${filters.targetType === 'property' ? 'btn-primary' : 'btn-outline'}" data-target-pill="property">
            🏢 Property Listing Reports (${propertyReportsCount})
          </button>
        </div>

        <!-- 5.2 FILTER TOOLBAR -->
        <div class="filter-bar">
          <div class="search-input-wrapper">
            <span class="search-icon-inline">🔍</span>
            <input type="text" id="report-search-input" class="search-input" placeholder="Search report type, description, product/listing, invoice, or user..." value="${filters.search || ''}" />
          </div>

          <!-- Reported Target Filter (User / Product / Property Listing) -->
          <select id="report-filter-target" class="select-custom">
            <option value="all" ${(filters.targetType || 'all') === 'all' ? 'selected' : ''}>All Report Targets</option>
            <option value="user" ${filters.targetType === 'user' ? 'selected' : ''}>👤 User Account</option>
            <option value="product" ${filters.targetType === 'product' ? 'selected' : ''}>🛍️ Product</option>
            <option value="property" ${filters.targetType === 'property' ? 'selected' : ''}>🏢 Property Listing</option>
          </select>

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
              <h2>Submitted User, Product & Listing Reports (${filteredReports.length} results)</h2>
              <p>Each report displays its two main components (<strong>Report Type</strong> & <strong>Report Description</strong>), the reported target (User, Product, or Listing), and both parties with their transaction invoice</p>
            </div>
          </div>

          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th class="sticky-col">Both Parties & Invoice</th>
                  <th>Report ID & Date</th>
                  <th>Reported Target (User / Product / Listing)</th>
                  <th>Report Type & Description</th>
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
          <td colspan="6">
            <div class="empty-state">
              <div class="empty-state-icon">🛡️</div>
              <h3>No Reports Found</h3>
              <p>No reports match your current target, search query, or category filters.</p>
              <button class="btn btn-secondary btn-sm" onclick="window.app.resetReportFilters()">Clear Filters</button>
            </div>
          </td>
        </tr>
      `;
    }

    return reports.map(r => {
      const reporter = r.reporter;
      const reportedUser = r.reportedUser;
      const listing = r.listing;
      const transaction = r.transaction;
      const targetType = r.targetType || 'user';
      const reportTypeTitle = r.reportType || r.category;
      const descriptionText = r.description || r.content;

      const reporterSubBadge = reporter ? (reporter.subscription === 'Gold' ? 'sub-badge-gold' : (reporter.subscription === 'Gray' ? 'sub-badge-gray' : 'sub-badge-blue')) : 'sub-badge-none';
      const reportedSubBadge = reportedUser ? (reportedUser.subscription === 'Gold' ? 'sub-badge-gold' : (reportedUser.subscription === 'Gray' ? 'sub-badge-gray' : 'sub-badge-blue')) : 'sub-badge-none';

      // Target Type Badge & Card
      let targetBadgeHtml = '';
      if (targetType === 'product') {
        targetBadgeHtml = `<span style="display: inline-flex; align-items: center; gap: 4px; background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: 999px; margin-bottom: 6px;">🛍️ Product Reported</span>`;
      } else if (targetType === 'property') {
        targetBadgeHtml = `<span style="display: inline-flex; align-items: center; gap: 4px; background: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe; font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: 999px; margin-bottom: 6px;">🏢 Property Listing Reported</span>`;
      } else {
        targetBadgeHtml = `<span style="display: inline-flex; align-items: center; gap: 4px; background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: 999px; margin-bottom: 6px;">👤 User Account Reported</span>`;
      }

      let targetDetailsHtml = '';
      if (listing) {
        const isInactive = listing.status === 'Inactive';
        const listingName = listing.name || listing.title;
        targetDetailsHtml = `
          <div style="display: flex; align-items: center; gap: 9px; background: #f8fafc; border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 7px 9px; max-width: 260px;">
            <img src="${listing.image}" style="width: 38px; height: 38px; border-radius: 6px; object-fit: cover; flex-shrink: 0; border: 1px solid var(--border-subtle);" />
            <div style="min-width: 0; flex: 1;">
              <div style="font-size: 0.78rem; font-weight: 700; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${listingName}">${listingName}</div>
              <div style="font-size: 0.7rem; color: #475569; margin-top: 1px;">${listing.id} • <strong style="color: #065f46;">${this.store.formatNaira(listing.price)}</strong></div>
              <div style="display: flex; align-items: center; gap: 6px; margin-top: 3px;">
                <span class="status-badge status-${listing.status.toLowerCase()}" style="font-size: 0.63rem; padding: 1px 6px;">${listing.status}</span>
                <button type="button" class="btn btn-outline btn-sm" style="padding: 1px 6px; font-size: 0.65rem; color: ${isInactive ? '#065f46' : '#b91c1c'};" onclick="window.app.setListingStatus('${listing.id}', '${isInactive ? 'Active' : 'Inactive'}')">
                  ${isInactive ? 'Restore' : 'Take Down'}
                </button>
              </div>
            </div>
          </div>
        `;
      } else if (reportedUser) {
        targetDetailsHtml = `
          <div style="font-size: 0.76rem; color: #334155; background: #f8fafc; border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 6px 9px; max-width: 240px;">
            Direct complaint against <strong>${reportedUser.name}</strong> (${reportedUser.category})
          </div>
        `;
      }

      return `
        <tr>
          <!-- Both Parties & Invoice (Sticky Column) -->
          <td class="sticky-col">
            <div style="display: flex; flex-direction: column; gap: 7px; min-width: 225px;">
              <!-- Party 1: Reporter -->
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; background: #f8fafc; border: 1px solid var(--border-subtle); border-radius: 6px; padding: 5px 8px;">
                ${reporter ? `
                  <div class="entity-cell" style="cursor: pointer;" onclick="window.userModal.open('${reporter.id}')" title="Inspect Reporter Profile">
                    <img src="${reporter.avatar}" class="entity-avatar" style="width: 26px; height: 26px;" />
                    <div class="entity-details">
                      <div style="font-size: 0.63rem; font-weight: 700; text-transform: uppercase; color: #475569; letter-spacing: 0.03em;">Party 1: Reporter</div>
                      <span class="entity-name" style="font-size: 0.78rem; color: #0f172a;">${reporter.name}</span>
                    </div>
                  </div>
                  <span class="sub-badge ${reporterSubBadge}" style="font-size: 0.62rem;">${reporter.subscription || 'Basic'}</span>
                ` : '<span style="color: var(--text-subtle); font-size: 0.75rem;">Anonymous Reporter</span>'}
              </div>

              <!-- Party 2: Reported Account -->
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 5px 8px;">
                ${reportedUser ? `
                  <div class="entity-cell" style="cursor: pointer;" onclick="window.userModal.open('${reportedUser.id}')" title="Inspect Reported Account">
                    <img src="${reportedUser.avatar}" class="entity-avatar" style="width: 26px; height: 26px; border-color: #ef4444;" />
                    <div class="entity-details">
                      <div style="font-size: 0.63rem; font-weight: 700; text-transform: uppercase; color: #991b1b; letter-spacing: 0.03em;">Party 2: Reported</div>
                      <span class="entity-name" style="font-size: 0.78rem; color: #0f172a;">${reportedUser.name}</span>
                    </div>
                  </div>
                  <span class="sub-badge ${reportedSubBadge}" style="font-size: 0.62rem;">${reportedUser.subscription || 'Basic'}</span>
                ` : '<span style="color: var(--text-subtle); font-size: 0.75rem;">Unknown Account</span>'}
              </div>

              <!-- Linked Invoice Between Both Parties -->
              ${transaction ? `
                <button type="button" class="btn btn-outline btn-sm" style="width: 100%; justify-content: space-between; padding: 4px 8px; font-size: 0.72rem; background: #ecfdf5; border-color: #a7f3d0; color: #065f46; font-weight: 700;" onclick="window.transactionModal.open('${transaction.id}')" title="View Both Parties' Transaction Invoice">
                  <span>🧾 Invoice ${transaction.id}</span>
                  <span>${this.store.formatNaira(transaction.amount)} →</span>
                </button>
              ` : `
                <div style="font-size: 0.68rem; color: #64748b; padding: 2px 4px;">No direct invoice on file</div>
              `}
            </div>
          </td>

          <!-- Report ID & Date -->
          <td>
            <div style="font-weight: 700; color: #b91c1c; font-size: 0.84rem;">${r.id}</div>
            <div style="font-size: 0.73rem; color: #475569; margin-top: 3px;">${r.date}</div>
          </td>

          <!-- Reported Target (User / Product / Property Listing) -->
          <td>
            <div>${targetBadgeHtml}</div>
            ${targetDetailsHtml}
          </td>

          <!-- 2 Main Components: 1. Report Type & 2. Report Description -->
          <td>
            <div style="max-width: 370px; background: #ffffff; border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 9px 11px;">
              <!-- Component 1: Report Type -->
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; flex-wrap: wrap; padding-bottom: 6px; margin-bottom: 6px; border-bottom: 1px dashed var(--border-subtle);">
                <div>
                  <span style="font-size: 0.63rem; font-weight: 700; text-transform: uppercase; color: #64748b; display: block;">1. Report Type</span>
                  <span style="font-weight: 700; color: #0f172a; font-size: 0.83rem;">${reportTypeTitle}</span>
                </div>
                <span style="background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; padding: 2px 7px; border-radius: 999px; font-size: 0.68rem; font-weight: 700;">${r.category}</span>
              </div>

              <!-- Component 2: Report Description -->
              <div>
                <span style="font-size: 0.63rem; font-weight: 700; text-transform: uppercase; color: #64748b; display: block; margin-bottom: 2px;">2. Report Description</span>
                <div style="font-size: 0.79rem; color: #1e293b; line-height: 1.45;">
                  ${descriptionText}
                </div>
              </div>
            </div>
          </td>

          <!-- Status -->
          <td>
            <span class="status-badge status-${r.status.toLowerCase()}">${r.status}</span>
          </td>

          <!-- Action -->
          <td>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <button class="btn btn-primary btn-sm" onclick="window.reportModal.open('${r.id}')">
                Review Case
              </button>
              ${transaction ? `
                <button class="btn btn-secondary btn-sm" onclick="window.transactionModal.open('${transaction.id}')">
                  🧾 View Invoice
                </button>
              ` : ''}
            </div>
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

    // Target Type filter dropdown (User / Product / Property Listing)
    const targetSelect = this.container.querySelector('#report-filter-target');
    if (targetSelect) {
      targetSelect.addEventListener('change', (e) => {
        this.store.setReportFilters({ targetType: e.target.value });
      });
    }

    // Quick Target Type filter pills
    const targetPills = this.container.querySelectorAll('[data-target-pill]');
    targetPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const targetVal = pill.getAttribute('data-target-pill');
        this.store.setReportFilters({ targetType: targetVal });
      });
    });

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
