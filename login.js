// ============================================================
// JUSTICE-KP  |  login.js — Authentication Logic
// ============================================================

(function () {
  'use strict';

  // ── Demo credentials ─────────────────────────────────────
  const VALID_USERS = [
    { username: 'admin',   password: 'admin123',   role: 'Administrator', barangay: 'Barangay 1 Santa Cruz' },
    { username: 'kapitan', password: 'kapitan2025', role: 'Punong Barangay', barangay: 'Barangay Pila Proper' },
    { username: 'lupon',   password: 'lupon2025',  role: 'Lupon Member',   barangay: 'Barangay 2 Pagsanjan' },
  ];

  // ── Element references ────────────────────────────────────
  const form        = document.getElementById('loginForm');
  const inputUser   = document.getElementById('username');
  const inputPass   = document.getElementById('password');
  const togglePw    = document.getElementById('togglePw');
  const btnLogin    = document.getElementById('btnLogin');
  const btnText     = btnLogin.querySelector('.btn-text');
  const btnLoader   = document.getElementById('loginLoader');
  const loginError  = document.getElementById('loginError');
  const errUsername = document.getElementById('errUsername');
  const errPassword = document.getElementById('errPassword');
  const groupUser   = document.getElementById('groupUsername');
  const groupPass   = document.getElementById('groupPassword');

  // ── Toggle password visibility ────────────────────────────
  togglePw.addEventListener('click', () => {
    const isText = inputPass.type === 'text';
    inputPass.type = isText ? 'password' : 'text';
    togglePw.textContent = isText ? '👁' : '🙈';
  });

  // ── Inline validation on blur ─────────────────────────────
  inputUser.addEventListener('blur', () => validateUsername());
  inputPass.addEventListener('blur', () => validatePassword());
  inputUser.addEventListener('input', () => clearError(groupUser, errUsername));
  inputPass.addEventListener('input', () => clearError(groupPass, errPassword));

  function validateUsername() {
    const val = inputUser.value.trim();
    if (!val) {
      setError(groupUser, errUsername, 'Username is required.');
      return false;
    }
    clearError(groupUser, errUsername);
    return true;
  }

  function validatePassword() {
    const val = inputPass.value;
    if (!val) {
      setError(groupPass, errPassword, 'Password is required.');
      return false;
    }
    clearError(groupPass, errPassword);
    return true;
  }

  function setError(group, errEl, msg) {
    group.classList.add('error');
    errEl.textContent = msg;
  }

  function clearError(group, errEl) {
    group.classList.remove('error');
    errEl.textContent = '';
  }

  // ── Form submit ───────────────────────────────────────────
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    loginError.classList.add('hidden');
    const okUser = validateUsername();
    const okPass = validatePassword();
    if (!okUser || !okPass) return;

    setLoading(true);

    // Simulate async auth
    setTimeout(() => {
      const user = authenticate(inputUser.value.trim(), inputPass.value);
      setLoading(false);

      if (user) {
        // Store session info
        sessionStorage.setItem('justice_kp_user', JSON.stringify({
          username:  user.username,
          role:      user.role,
          barangay:  user.barangay,
          loginTime: new Date().toISOString(),
        }));

        // Remember me
        if (document.getElementById('rememberMe').checked) {
          localStorage.setItem('justice_kp_remember', user.username);
        }

        // Redirect to main page
        window.location.href = 'main_page.html';
      } else {
        loginError.classList.remove('hidden');
        inputPass.value = '';
      }
    }, 900);
  });

  function authenticate(username, password) {
    return VALID_USERS.find(
      (u) => u.username === username && u.password === password
    ) || null;
  }

  function setLoading(on) {
    btnLogin.disabled = on;
    btnText.classList.toggle('hidden', on);
    btnLoader.classList.toggle('hidden', !on);
  }

  // ── Pre-fill if remembered ────────────────────────────────
  const remembered = localStorage.getItem('justice_kp_remember');
  if (remembered) {
    inputUser.value = remembered;
    document.getElementById('rememberMe').checked = true;
  }

  // ── Redirect if already logged in ────────────────────────
  if (sessionStorage.getItem('justice_kp_user')) {
    window.location.href = 'main_page.html';
  }
})();