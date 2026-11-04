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

    const { report, reporter, reportedUser, listing } = details;

    // 1. Report Header Info
    const idEl = this.drawerEl.querySelector('#report-drawer-id');
    const catEl = this.drawerEl.querySelector('#report-drawer-category');
    const dateEl = this.drawerEl.querySelector('#report-drawer-date');
    const statusBadgeEl = this.drawerEl.querySelector('#report-drawer-statusbadge');
    const statusSelect = this.drawerEl.querySelector('#report-status-updater');
    const contentEl = this.drawerEl.querySelector('#report-drawer-content');

    if (idEl) idEl.textContent = `Report ${report.id}`;
    if (catEl) catEl.textContent = report.category;
    if (dateEl) dateEl.textContent = `Filed on ${report.date}`;

    if (statusBadgeEl) {
      statusBadgeEl.className = `status-badge status-${report.status.toLowerCase()}`;
      statusBadgeEl.textContent = report.status;
    }

    if (statusSelect) {
      statusSelect.value = report.status;
    }

    if (contentEl) {
      contentEl.textContent = report.content;
    }

    // 2. Reporter Profile Card
    const reporterCard = this.drawerEl.querySelector('#report-card-reporter');
    if (reporterCard && reporter) {
      const subBadgeClass = reporter.subscription === 'Gold' ? 'sub-badge-gold' : (reporter.subscription === 'Gray' ? 'sub-badge-gray' : 'sub-badge-blue');
      reporterCard.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <div style="font-size: 0.76rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-subtle);">Reporting User (Complainant)</div>
          <span class="type-badge type-${reporter.userType}">${reporter.userType}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 14px;">
          <img src="${reporter.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}" alt="${reporter.name}" style="width: 44px; height: 44px; border-radius: var(--radius-full); object-fit: cover; border: 2px solid var(--border-light);" />
          <div>
            <div style="font-weight: 700; color: var(--text-main); font-size: 0.95rem;">${reporter.name}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${reporter.email} • ${reporter.phone}</div>
            <div style="margin-top: 4px;"><span class="sub-badge ${subBadgeClass}">${reporter.subscription || 'Basic'}</span></div>
          </div>
        </div>
        <button class="btn btn-outline btn-sm" style="width: 100%;" onclick="window.userModal.open('${reporter.id}', { fromReport: true })">
          👤 View Reporter Profile
        </button>
      `;
    }

    // 3. Reported User Profile Card (With total complaints badge)
    const reportedCard = this.drawerEl.querySelector('#report-card-reported');
    if (reportedCard && reportedUser) {
      const subBadgeClass = reportedUser.subscription === 'Gold' ? 'sub-badge-gold' : (reportedUser.subscription === 'Gray' ? 'sub-badge-gray' : 'sub-badge-blue');
      const warningText = reportedUser.totalReportsCount > 1 
        ? `<div style="margin-top: 8px; padding: 6px 10px; background: #fef2f2; border: 1px solid #fecaca; border-radius: var(--radius-sm); font-size: 0.74rem; color: #dc2626; font-weight: 600;">⚠️ ${reportedUser.totalReportsCount} total reports logged against this user</div>`
        : '';

      reportedCard.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <div style="font-size: 0.76rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #dc2626;">Reported Account (Target)</div>
          <span class="type-badge type-${reportedUser.userType}">${reportedUser.userType}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 14px;">
          <img src="${reportedUser.avatar || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100'}" alt="${reportedUser.name}" style="width: 44px; height: 44px; border-radius: var(--radius-full); object-fit: cover; border: 2px solid #ef4444;" />
          <div>
            <div style="font-weight: 700; color: var(--text-main); font-size: 0.95rem;">${reportedUser.name}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${reportedUser.email} • ${reportedUser.phone}</div>
            <div style="margin-top: 4px; display: flex; align-items: center; gap: 6px;">
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

    // 4. Associated Listing (If any)
    const listingBox = this.drawerEl.querySelector('#report-box-listing');
    if (listingBox) {
      if (listing) {
        listingBox.style.display = 'block';
        listingBox.innerHTML = `
          <div style="font-size: 0.76rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-subtle); margin-bottom: 8px;">Associated Marketplace Listing</div>
          <div style="display: flex; align-items: center; gap: 12px; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 10px;">
            <img src="${listing.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}" alt="${listing.name}" style="width: 42px; height: 42px; border-radius: var(--radius-sm); object-fit: cover;" />
            <div style="flex: 1;">
              <div style="font-weight: 600; color: var(--text-main); font-size: 0.85rem;">${listing.name}</div>
              <div style="font-size: 0.74rem; color: var(--text-muted);">${listing.category} • ${this.store.formatNaira(listing.price)}</div>
            </div>
            <span class="status-badge status-${listing.status.toLowerCase()}">${listing.status}</span>
          </div>
        `;
      } else {
        listingBox.style.display = 'none';
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
