/**
 * KOVA Admin Dashboard - Report Details Drawer (PRD 5.3)
 * Provides bidirectional links to reporter & reported user profiles,
 * report evidence, status updater (New, Under Review, Resolved, Dismissed).
 */

class ReportModal {
  constructor(store) {
    this.store = store;
    this.drawerEl = document.getElementById('drawer-report-details');
    this.currentReportId = null;
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

    // Handle status change
    const statusSelect = this.drawerEl.querySelector('#report-status-updater');
    if (statusSelect) {
      statusSelect.addEventListener('change', (e) => {
        if (!this.currentReportId) return;
        const newStatus = e.target.value;
        const res = this.store.updateReportStatus(this.currentReportId, newStatus);
        if (res.success) {
          window.app.showToast(res.message, 'success');
          // Re-render report details header badge
          this.open(this.currentReportId);
        }
      });
    }
  }

  open(reportId) {
    this.currentReportId = reportId;
    const details = this.store.getReportDetails(reportId);
    if (!details) return;

    const { report, reporter, reportedUser, listing, transaction } = details;

    // 1. Report Header Info & Two Main Components (Report Type & Description)
    const idEl = this.drawerEl.querySelector('#report-drawer-id');
    const targetBadgeEl = this.drawerEl.querySelector('#report-drawer-targetbadge');
    const catEl = this.drawerEl.querySelector('#report-drawer-category');
    const dateEl = this.drawerEl.querySelector('#report-drawer-date');
    const statusBadgeEl = this.drawerEl.querySelector('#report-drawer-statusbadge');
    const statusSelect = this.drawerEl.querySelector('#report-status-updater');
    const typeTitleEl = this.drawerEl.querySelector('#report-drawer-type-title');
    const catPillEl = this.drawerEl.querySelector('#report-drawer-cat-pill');
    const contentEl = this.drawerEl.querySelector('#report-drawer-content');

    const targetLabel = report.targetType === 'product'
      ? '🛍️ Product Report'
      : (report.targetType === 'property' ? '🏢 Property Listing Report' : '👤 User Account Report');
    const targetClass = report.targetType === 'product'
      ? 'type-vendor'
      : (report.targetType === 'property' ? 'type-agent' : 'type-customer');

    if (idEl) idEl.textContent = `Report ${report.id}`;
    if (targetBadgeEl) {
      targetBadgeEl.className = `type-badge ${targetClass}`;
      targetBadgeEl.textContent = targetLabel;
    }
    if (catEl) catEl.textContent = report.reportType || report.category;
    if (dateEl) dateEl.textContent = `Filed on ${report.date}`;

    if (statusBadgeEl) {
      statusBadgeEl.className = `status-badge status-${report.status.toLowerCase().replace(/\s+/g, '-')}`;
      statusBadgeEl.textContent = report.status;
    }

    if (statusSelect) {
      statusSelect.value = report.status;
    }

    if (typeTitleEl) {
      typeTitleEl.textContent = report.reportType || report.category;
    }
    if (catPillEl) {
      catPillEl.textContent = `${targetLabel} • ${report.category}`;
    }

    if (contentEl) {
      contentEl.textContent = report.description || report.content;
    }

    // 2. Party 1: Reporter Profile Card (Complainant)
    const reporterCard = this.drawerEl.querySelector('#report-card-reporter');
    if (reporterCard && reporter) {
      const subBadgeClass = reporter.subscription === 'Gold' ? 'sub-badge-gold' : (reporter.subscription === 'Gray' ? 'sub-badge-gray' : 'sub-badge-blue');
      reporterCard.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; gap: 6px; flex-wrap: wrap;">
          <div style="font-size: 0.74rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-subtle);">Party 1: Reporter (Complainant)</div>
          <span class="type-badge type-${reporter.userType}">${reporter.userType}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 14px;">
          <img src="${reporter.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}" alt="${reporter.name}" style="width: 44px; height: 44px; border-radius: var(--radius-full); object-fit: cover; border: 2px solid var(--border-light); flex-shrink: 0;" />
          <div style="min-width: 0;">
            <div style="font-weight: 700; color: var(--text-main); font-size: 0.95rem;">${reporter.name}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); word-break: break-word;">${reporter.email} • ${reporter.phone}</div>
            <div style="margin-top: 4px;"><span class="sub-badge ${subBadgeClass}">${reporter.subscription || 'Basic'}</span></div>
          </div>
        </div>
        <button class="btn btn-outline btn-sm" style="width: 100%;" onclick="window.userModal.open('${reporter.id}', { fromReport: true })">
          👤 View Reporter Profile
        </button>
      `;
    }

    // 3. Party 2: Reported User Profile Card (Owner / Target Account)
    const reportedCard = this.drawerEl.querySelector('#report-card-reported');
    if (reportedCard && reportedUser) {
      const subBadgeClass = reportedUser.subscription === 'Gold' ? 'sub-badge-gold' : (reportedUser.subscription === 'Gray' ? 'sub-badge-gray' : 'sub-badge-blue');
      const warningText = reportedUser.totalReportsCount > 1 
        ? `<div style="margin-top: 8px; padding: 6px 10px; background: #fef2f2; border: 1px solid #fecaca; border-radius: var(--radius-sm); font-size: 0.74rem; color: #dc2626; font-weight: 600;">⚠️ ${reportedUser.totalReportsCount} total reports logged against this user</div>`
        : '';

      const party2RoleLabel = report.targetType === 'product'
        ? 'Party 2: Reported Vendor (Product Owner)'
        : (report.targetType === 'property' ? 'Party 2: Reported Agent (Listing Owner)' : 'Party 2: Reported User Account');

      reportedCard.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; gap: 6px; flex-wrap: wrap;">
          <div style="font-size: 0.74rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #dc2626;">${party2RoleLabel}</div>
          <span class="status-badge status-${reportedUser.accountStatus.toLowerCase()}">${reportedUser.accountStatus}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 14px;">
          <img src="${reportedUser.avatar || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100'}" alt="${reportedUser.name}" style="width: 44px; height: 44px; border-radius: var(--radius-full); object-fit: cover; border: 2px solid #ef4444; flex-shrink: 0;" />
          <div style="min-width: 0;">
            <div style="font-weight: 700; color: var(--text-main); font-size: 0.95rem;">${reportedUser.name}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); word-break: break-word;">${reportedUser.email} • ${reportedUser.phone}</div>
            <div style="margin-top: 4px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
              <span class="type-badge type-${reportedUser.userType}">${reportedUser.userType}</span>
              <span class="sub-badge ${subBadgeClass}">${reportedUser.subscription || 'Basic'}</span>
              <span class="rating-stars">★ ${reportedUser.rating || 0}</span>
            </div>
          </div>
        </div>
        ${warningText}
        <div style="display: flex; gap: 6px; margin-top: 10px; flex-wrap: wrap;">
          <button class="btn btn-outline btn-sm" style="flex: 1;" onclick="window.userModal.open('${reportedUser.id}', { fromReport: true })">
            🚨 Inspect
          </button>
          ${reportedUser.accountStatus !== 'Suspended' ? `
            <button class="btn btn-warning btn-sm" onclick="window.app.setUserStatus('${reportedUser.id}', 'Suspended')">
              Suspend
            </button>
          ` : ''}
          ${reportedUser.accountStatus !== 'Blocked' ? `
            <button class="btn btn-danger btn-sm" onclick="window.app.setUserStatus('${reportedUser.id}', 'Blocked')">
              Block
            </button>
          ` : ''}
          ${reportedUser.accountStatus !== 'Active' ? `
            <button class="btn btn-success btn-sm" onclick="window.app.setUserStatus('${reportedUser.id}', 'Active')">
              Activate
            </button>
          ` : ''}
        </div>
      `;
    }

    // 4. Reported Product / Property Listing Card (If reporting a product or listing)
    const listingBox = this.drawerEl.querySelector('#report-box-listing');
    if (listingBox) {
      if (listing) {
        const isProperty = listing.listingType === 'property';
        const listingHeading = isProperty ? '🏢 Reported Property Listing' : '🛍️ Reported Marketplace Product';
        listingBox.style.display = 'block';
        listingBox.innerHTML = `
          <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: var(--radius-lg); padding: 14px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; flex-wrap: wrap; gap: 6px;">
              <div style="font-size: 0.74rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #92400e;">${listingHeading} (${listing.id})</div>
              <span class="status-badge status-${listing.status.toLowerCase()}">${listing.status}</span>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; background: #ffffff; border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 12px;">
              <div style="display: flex; align-items: center; gap: 12px; flex: 1; min-width: 180px;">
                <img src="${listing.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}" alt="${listing.name}" style="width: 48px; height: 48px; border-radius: var(--radius-sm); object-fit: cover; flex-shrink: 0;" />
                <div style="min-width: 0;">
                  <div style="font-weight: 700; color: var(--text-main); font-size: 0.88rem;">${listing.name}</div>
                  <div style="font-size: 0.74rem; color: var(--text-muted);">${listing.category} • ${this.store.formatNaira(listing.price)}${isProperty ? '/yr' : ''}</div>
                </div>
              </div>
              <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                ${listing.status === 'Active' ? `
                  <button class="btn btn-danger btn-sm" onclick="window.app.setListingStatus('${listing.id}', 'Inactive')">
                    🚫 Take Down Listing
                  </button>
                ` : `
                  <button class="btn btn-success btn-sm" onclick="window.app.setListingStatus('${listing.id}', 'Active')">
                    ✓ Restore Listing
                  </button>
                `}
              </div>
            </div>
          </div>
        `;
      } else {
        listingBox.style.display = 'none';
      }
    }

    // 5. Associated Transaction / Invoice between the Two Parties (if any)
    const txBox = this.drawerEl.querySelector('#report-box-transaction');
    if (txBox) {
      if (transaction) {
        txBox.style.display = 'block';
        txBox.innerHTML = `
          <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 14px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
            <div>
              <div style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-subtle);">Associated Transaction / Invoice Between Both Parties</div>
              <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-main); margin-top: 2px;">
                ${transaction.id} • <span class="price-tag">${this.store.formatNaira(transaction.amount)}</span> • <span class="status-badge status-${transaction.status.toLowerCase()}">${transaction.status}</span>
              </div>
              <div style="font-size: 0.74rem; color: var(--text-muted); margin-top: 2px;">${transaction.type} on ${transaction.date}</div>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="window.transactionModal.open('${transaction.id}')">
              🧾 View Invoice / Transaction
            </button>
          </div>
        `;
      } else {
        txBox.style.display = 'none';
      }
    }

    this.drawerEl.classList.add('active');
  }

  close() {
    if (this.drawerEl) {
      this.drawerEl.classList.remove('active');
    }
    this.currentReportId = null;
  }
}

window.ReportModal = ReportModal;
