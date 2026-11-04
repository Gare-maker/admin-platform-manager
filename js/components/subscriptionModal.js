/**
 * KOVA Admin Dashboard - Subscription Assignment & Management Modal (PRD 4.5)
 * Allows admins to change user subscription between Gold, Gray, and Blue / Basic
 * Records previous subscription, new subscription, timestamp, and admin name.
 */

class SubscriptionModal {
  constructor(store) {
    this.store = store;
    this.modalEl = document.getElementById('modal-change-subscription');
    this.currentUser = null;
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

    // Handle form submission
    const form = this.modalEl.querySelector('#form-change-subscription');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.save();
      });
    }
  }

  open(userId) {
    const user = this.store.data.users.find(u => u.id === userId);
    if (!user) return;

    this.currentUser = user;

    // Populate user details in modal
    const nameEl = this.modalEl.querySelector('#sub-modal-username');
    const emailEl = this.modalEl.querySelector('#sub-modal-useremail');
    const avatarEl = this.modalEl.querySelector('#sub-modal-useravatar');
    const currentBadgeEl = this.modalEl.querySelector('#sub-modal-currentbadge');
    const selectEl = this.modalEl.querySelector('#sub-select-plan');
    const reasonEl = this.modalEl.querySelector('#sub-change-reason');

    if (nameEl) nameEl.textContent = user.name;
    if (emailEl) emailEl.textContent = `${user.email} • ${user.id} (${user.userType})`;
    if (avatarEl) avatarEl.src = user.avatar;

    // Current badge
    if (currentBadgeEl) {
      const badgeClass = user.subscription === 'Gold' ? 'sub-badge-gold' : (user.subscription === 'Gray' ? 'sub-badge-gray' : 'sub-badge-blue');
      currentBadgeEl.className = `sub-badge ${badgeClass}`;
      currentBadgeEl.textContent = user.subscription || 'None';
    }

    // Preselect current plan or option
    if (selectEl) {
      selectEl.value = user.subscription || 'Blue / Basic';
    }
    if (reasonEl) {
      reasonEl.value = 'Admin manual subscription update';
    }

    this.modalEl.classList.add('active');
  }

  close() {
    if (this.modalEl) {
      this.modalEl.classList.remove('active');
    }
    this.currentUser = null;
  }

  save() {
    if (!this.currentUser) return;

    const selectEl = this.modalEl.querySelector('#sub-select-plan');
    const reasonEl = this.modalEl.querySelector('#sub-change-reason');
    const newSub = selectEl ? selectEl.value : null;
    const reason = reasonEl ? reasonEl.value : 'Admin update';

    if (!newSub) return;

    const result = this.store.changeUserSubscription(this.currentUser.id, newSub, reason);

    if (result.success) {
      window.app.showToast(result.message, 'success');
      this.close();

      // If user modal is open for this user, refresh it
      if (window.userModal && window.userModal.currentUserId === this.currentUser.id) {
        window.userModal.open(this.currentUser.id);
      }
    } else {
      window.app.showToast(result.message, 'info');
    }
  }
}

window.SubscriptionModal = SubscriptionModal;
