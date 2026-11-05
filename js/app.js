/**
 * KOVA Admin Dashboard - Main Application Coordinator
 * Handles SPA navigation, store subscription, toast notifications,
 * fee settings configuration, and component initialization.
 */

class KovaApp {
  constructor() {
    this.store = window.kovaStore;
    this.views = {};
    this.currentPage = 'dashboard';
    this.loginView = null;
    this.toastContainer = document.getElementById('toast-container');
    this.feeModal = document.getElementById('modal-fee-settings');

    this.init();
  }

  init() {
    // 0. Initialize Login View
    this.loginView = new LoginView(this.store);
    // 1. Initialize Reusable Modals & Drawers
    window.subscriptionModal = new SubscriptionModal(this.store);
    window.userModal = new UserModal(this.store);
    window.reportModal = new ReportModal(this.store);
    window.transactionModal = new TransactionModal(this.store);
    window.globalSearch = new GlobalSearch(this.store);

    // 2. Initialize Views
    this.views = {
      dashboard: new DashboardView(this.store),
      users: new UsersView(this.store),
      reports: new ReportsView(this.store)
    };

    // 3. Navigation Links & URL Hash Listener
    this.setupNavigation();

    // 4. Subscribe to Store changes to re-render views automatically
    this.store.subscribe(() => {
      this.renderCurrentPage();
      this.updateSidebarBadges();
    });

    // 5. Mobile Sidebar Toggle
    this.setupMobileMenu();

    // 6. Fee Settings Modal handlers
    this.setupFeeSettings();

    // 7. Check Authentication State
    if (!this.store.state.isAuthenticated) {
      this.showLogin();
    } else {
      const hash = window.location.hash.replace('#', '') || 'dashboard';
      if (hash === 'login') {
        this.navigateTo('dashboard');
      } else {
        this.navigateTo(hash);
      }
    }
    this.updateSidebarBadges();
  }

  showLogin() {
    if (this.loginView) {
      this.loginView.show();
    }
  }

  logout() {
    this.store.logout();
    this.showLogin();
    this.showToast('Administrator session safely terminated.', 'info');
  }

  setupNavigation() {
    // Nav Items in Sidebar
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const page = item.getAttribute('data-page');
        if (page) {
          this.navigateTo(page);
          // Close mobile menu if open
          document.querySelector('.sidebar').classList.remove('mobile-open');
        }
      });
    });

    // Hash change event (supports browser back/forward)
    window.addEventListener('hashchange', () => {
      const page = window.location.hash.replace('#', '') || 'dashboard';
      if (page !== this.currentPage && this.views[page]) {
        this.navigateTo(page, {}, false);
      }
    });

    // Global Search trigger buttons
    const searchTriggers = document.querySelectorAll('.global-search-trigger');
    searchTriggers.forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.globalSearch) window.globalSearch.open();
      });
    });
  }

  navigateTo(page, params = {}, updateHash = true) {
    if (page === 'login') {
      this.showLogin();
      return;
    }
    if (!this.store.state.isAuthenticated) {
      this.showLogin();
      return;
    }
    if (this.loginView) {
      this.loginView.hide();
    }

    if (!this.views[page]) page = 'dashboard';

    this.currentPage = page;
    if (updateHash) {
      window.location.hash = page;
    }

    // Update active nav item styling
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
      if (item.getAttribute('data-page') === page) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Hide all view containers, show target
    document.querySelectorAll('.view-container').forEach(c => c.classList.remove('active'));
    const targetEl = document.getElementById(`view-${page}`);
    if (targetEl) targetEl.classList.add('active');

    // Apply any preset parameters (e.g. from subscription cards)
    if (page === 'users' && params.subscription) {
      this.store.setUserFilters({ subscription: params.subscription });
    } else if (page === 'users' && params.userType) {
      this.store.setUserFilters({ userType: params.userType });
    }

    // Render active view
    this.renderCurrentPage();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  renderCurrentPage() {
    const view = this.views[this.currentPage];
    if (view && typeof view.render === 'function') {
      view.render();
    }
  }

  updateSidebarBadges() {
    // Update reports badge count (New reports)
    const newReports = this.store.data.reports.filter(r => r.status === 'New').length;
    const reportBadgeEl = document.getElementById('sidebar-reports-badge');
    if (reportBadgeEl) {
      if (newReports > 0) {
        reportBadgeEl.textContent = newReports;
        reportBadgeEl.style.display = 'inline-block';
      } else {
        reportBadgeEl.style.display = 'none';
      }
    }
  }

  setupMobileMenu() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const closeBtn = document.getElementById('sidebar-close-btn');
    const overlay = document.getElementById('sidebar-overlay');
    const sidebar = document.querySelector('.sidebar');

    const openSidebar = () => {
      if (sidebar) sidebar.classList.add('mobile-open');
      if (overlay) overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeSidebar = () => {
      if (sidebar) sidebar.classList.remove('mobile-open');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (sidebar && sidebar.classList.contains('mobile-open')) {
          closeSidebar();
        } else {
          openSidebar();
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeSidebar();
      });
    }

    if (overlay) {
      overlay.addEventListener('click', () => {
        closeSidebar();
      });
    }

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (sidebar && sidebar.classList.contains('mobile-open')) {
        if (!sidebar.contains(e.target) && (!toggleBtn || !toggleBtn.contains(e.target))) {
          closeSidebar();
        }
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar && sidebar.classList.contains('mobile-open')) {
        closeSidebar();
      }
    });

    // Close when navigating
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
      item.addEventListener('click', () => {
        closeSidebar();
      });
    });
  }

  // Configurable Platform Fee Settings (PRD 15 & 23)
  setupFeeSettings() {
    if (!this.feeModal) return;

    this.feeModal.addEventListener('click', (e) => {
      if (e.target === this.feeModal || e.target.closest('.btn-close-modal')) {
        this.closeFeeSettings();
      }
    });

    const form = this.feeModal.querySelector('#form-fee-settings');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = this.feeModal.querySelector('#fee-rate-input');
        const percentVal = parseFloat(input.value);
        if (isNaN(percentVal) || percentVal < 0 || percentVal > 50) {
          this.showToast('Please enter a valid rate between 0% and 50%', 'error');
          return;
        }

        const rateFraction = percentVal / 100;
        const res = this.store.setPlatformFeeRate(rateFraction);
        if (res.success) {
          this.showToast(res.message, 'success');
          this.closeFeeSettings();
        } else {
          this.showToast(res.message, 'error');
        }
      });
    }
  }

  openFeeSettings() {
    if (!this.feeModal) return;
    const input = this.feeModal.querySelector('#fee-rate-input');
    if (input) {
      input.value = (this.store.data.config.platformFeeRate * 100).toFixed(1);
    }
    this.feeModal.classList.add('active');
  }

  closeFeeSettings() {
    if (this.feeModal) this.feeModal.classList.remove('active');
  }

  refreshAll() {
    this.showToast('Data refreshed successfully.', 'info');
    this.renderCurrentPage();
  }

  resetUserFilters() {
    this.store.resetUserFilters();
    this.showToast('User filters cleared.', 'info');
  }

  resetReportFilters() {
    this.store.resetReportFilters();
    this.showToast('Report filters cleared.', 'info');
  }

  // Suspend, Block, or Activate User Account
  setUserStatus(userId, newStatus) {
    const res = this.store.updateUserAccountStatus(userId, newStatus);
    if (res.success) {
      const toastType = newStatus === 'Blocked' ? 'error' : (newStatus === 'Suspended' ? 'info' : 'success');
      this.showToast(res.message, toastType);

      // Refresh open drawers if currently inspecting this user or a report
      if (window.userModal && window.userModal.currentUserId === userId) {
        window.userModal.open(userId);
      }
      if (window.reportModal && window.reportModal.currentReportId) {
        window.reportModal.open(window.reportModal.currentReportId);
      }
    } else {
      this.showToast(res.message, 'error');
    }
  }

  // Activate or Deactivate Reported Product / Property Listing
  setListingStatus(listingId, newStatus) {
    const res = this.store.updateListingStatus(listingId, newStatus);
    if (res.success) {
      const toastType = newStatus === 'Inactive' ? 'info' : 'success';
      this.showToast(res.message, toastType);

      if (window.reportModal && window.reportModal.currentReportId) {
        window.reportModal.open(window.reportModal.currentReportId);
      }
      if (window.userModal && window.userModal.currentUserId) {
        window.userModal.open(window.userModal.currentUserId);
      }
    } else {
      this.showToast(res.message, 'error');
    }
  }

  // Toast Notifications
  showToast(message, type = 'success') {
    if (!this.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = '✅';
    if (type === 'error') icon = '❌';
    else if (type === 'info') icon = 'ℹ️';

    toast.innerHTML = `
      <span style="font-size: 1.1rem;">${icon}</span>
      <span style="flex: 1;">${message}</span>
      <button style="color: var(--text-subtle); padding: 4px; font-size: 0.9rem;" onclick="this.parentElement.remove()">✕</button>
    `;

    this.toastContainer.appendChild(toast);

    // Auto remove after 3.5s
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease-out';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}

// Bootstrap application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new KovaApp();
});
