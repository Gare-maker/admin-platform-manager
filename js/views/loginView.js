/**
 * KOVA Admin Dashboard - Login View Controller
 * Clean, minimalist white-mode authentication page with 1-click demo access,
 * password visibility toggle, session persistence, and error feedback.
 */

class LoginView {
  constructor(store) {
    this.store = store;
    this.container = document.getElementById('login-container');
    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();
    this.attachEventListeners();
  }

  render() {
    this.container.innerHTML = `
      <div class="login-card">
        <!-- Brand Header -->
        <div class="login-header">
          <img src="assets/images/kova_logo.png" alt="KOVA Admin" class="login-logo" onerror="this.src='assets/images/kova_logo.svg'" />
          <div class="login-title-group">
            <h1>Administrator Portal</h1>
            <p>Enter your credentials to access the KOVA management dashboard</p>
          </div>
          <div class="login-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span>Verified 256-Bit TLS</span>
          </div>
        </div>

        <!-- Login Form -->
        <form id="admin-login-form" class="login-form">
          <div id="login-error-alert" style="display: none; padding: 10px 14px; background: #fef2f2; border: 1px solid #fecaca; border-radius: var(--radius-sm); font-size: 0.8rem; color: #dc2626;"></div>

          <div class="login-input-group">
            <label for="login-email">Administrator Email</label>
            <div class="login-input-field">
              <input type="email" id="login-email" class="login-input" value="admin@kova.ng" required autocomplete="username" />
            </div>
          </div>

          <div class="login-input-group">
            <label for="login-password">Master Password</label>
            <div class="login-input-field">
              <input type="password" id="login-password" class="login-input" value="kova2026admin" required autocomplete="current-password" />
              <button type="button" id="btn-toggle-login-pwd" class="btn-toggle-password" aria-label="Toggle password visibility">
                👁️
              </button>
            </div>
          </div>

          <div class="login-row-between">
            <label class="login-checkbox-label">
              <input type="checkbox" id="login-remember" checked />
              <span>Remember this session</span>
            </label>
            <span class="login-forgot-link" onclick="window.app.showToast('Security note: Contact KOVA Tech Ops to reset master keys.', 'info')">
              Forgot password?
            </span>
          </div>

          <button type="submit" id="btn-login-submit" class="login-btn-submit">
            <span>Sign In to Dashboard</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>

          <button type="button" id="btn-demo-login" class="login-demo-btn">
            ⚡ Quick Demo Access (1-Click)
          </button>
        </form>

        <div class="login-footer-security">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <span>KOVA Internal Administration Environment v2.4</span>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const form = this.container.querySelector('#admin-login-form');
    const emailInput = this.container.querySelector('#login-email');
    const pwdInput = this.container.querySelector('#login-password');
    const togglePwdBtn = this.container.querySelector('#btn-toggle-login-pwd');
    const demoBtn = this.container.querySelector('#btn-demo-login');
    const errorAlert = this.container.querySelector('#login-error-alert');

    // Toggle password reveal
    if (togglePwdBtn && pwdInput) {
      togglePwdBtn.addEventListener('click', () => {
        const isPwd = pwdInput.type === 'password';
        pwdInput.type = isPwd ? 'text' : 'password';
        togglePwdBtn.textContent = isPwd ? '🔒' : '👁️';
      });
    }

    // Form submit
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();
        const pwd = pwdInput.value.trim();

        const submitBtn = form.querySelector('#btn-login-submit');
        submitBtn.innerHTML = '<span>Authenticating...</span>';
        submitBtn.disabled = true;

        setTimeout(() => {
          const res = this.store.login(email, pwd);
          if (res.success) {
            this.hide();
            window.app.showToast('Welcome back, Adebayo Johnson (Super Administrator)', 'success');
            window.app.navigateTo('dashboard');
          } else {
            if (errorAlert) {
              errorAlert.textContent = res.message;
              errorAlert.style.display = 'block';
            }
          }
          submitBtn.innerHTML = `
            <span>Sign In to Dashboard</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          `;
          submitBtn.disabled = false;
        }, 350);
      });
    }

    // 1-Click Demo Login
    if (demoBtn) {
      demoBtn.addEventListener('click', () => {
        emailInput.value = 'admin@kova.ng';
        pwdInput.value = 'kova2026admin';
        this.store.login('admin@kova.ng', 'kova2026admin');
        this.hide();
        window.app.showToast('Demo Administrator session activated', 'success');
        window.app.navigateTo('dashboard');
      });
    }
  }

  show() {
    if (this.container) {
      this.container.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  hide() {
    if (this.container) {
      this.container.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
}
