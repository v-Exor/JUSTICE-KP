// ============================================================
// JUSTICE-KP  |  main.js — Navigation, Session, UI Controls
// ============================================================

(function () {
  'use strict';

  // ── Auth guard ────────────────────────────────────────────
  const raw = sessionStorage.getItem('justice_kp_user');
  if (!raw) {
    window.location.href = 'index.html';
    return;
  }
  const user = JSON.parse(raw);

  // ── Populate user info ────────────────────────────────────
  document.getElementById('userName').textContent    = user.username.charAt(0).toUpperCase() + user.username.slice(1);
  document.getElementById('userRole').textContent    = user.role;
  document.getElementById('userAvatar').textContent  = user.username.charAt(0).toUpperCase();
  document.getElementById('welcomeName').textContent = user.username.charAt(0).toUpperCase() + user.username.slice(1);
  document.getElementById('barangayName').textContent = user.barangay;
  document.getElementById('topbarBarangay').querySelector('span:last-child').textContent = user.barangay;

  // ── Date display ─────────────────────────────────────────
  function updateClock() {
    const now = new Date();
    const opts = { weekday:'short', year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' };
    document.getElementById('topbarDate').textContent = now.toLocaleDateString('en-PH', opts);
  }
  updateClock();
  setInterval(updateClock, 60000);

  // ── Panel switching ───────────────────────────────────────
  window.switchPanel = function (panelId) {
    // Hide all panels
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    // Show target
    const target = document.getElementById('panel-' + panelId);
    if (target) target.classList.add('active');

    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.panel === panelId);
    });

    // Update topbar title
    const titles = {
      dashboard:  'Dashboard',
      'new-case': 'New Case',
      cases:      'Cases',
      records:    'Records',
      ordinances: 'Ordinances',
      reports:    'Reports',
      forms:      'KP Forms',
      settings:   'Settings',
      help:       'Help',
    };
    const crumbs = {
      dashboard:  'Home › Dashboard',
      'new-case': 'Home › New Case',
      cases:      'Home › Cases',
      records:    'Home › Records',
      ordinances: 'Home › Ordinances',
      reports:    'Home › Reports',
      forms:      'Home › KP Forms',
      settings:   'Home › Settings',
      help:       'Home › Help',
    };
    document.getElementById('pageTitle').textContent   = titles[panelId] || panelId;
    document.getElementById('breadcrumb').textContent  = crumbs[panelId] || '';

    // Close sidebar on mobile after nav
    closeSidebar();
  };

  // Attach nav-item clicks
  document.querySelectorAll('.nav-item[data-panel]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      switchPanel(item.dataset.panel);
    });
  });

  // ── Sidebar toggle (mobile) ───────────────────────────────
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('sidebarOverlay');
  const toggleBtn = document.getElementById('sidebarToggle');

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.remove('hidden');
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.add('hidden');
  }
  toggleBtn.addEventListener('click', () => {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  });
  overlay.addEventListener('click', closeSidebar);

  // ── Logout ────────────────────────────────────────────────
  document.getElementById('btnLogout').addEventListener('click', () => {
    sessionStorage.removeItem('justice_kp_user');
    window.location.href = 'index.html';
  });

})();