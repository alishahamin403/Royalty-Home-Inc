'use strict';

/* ═══════════════════════════════════════════════
   1. NAV — transparent → frosted glass on scroll
═══════════════════════════════════════════════ */
function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const THRESHOLD = 80;

  const onScroll = () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > THRESHOLD);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load in case page reloads mid-scroll
}

/* ═══════════════════════════════════════════════
   2. HERO PARALLAX — subtle depth on scroll
═══════════════════════════════════════════════ */
function initParallax() {
  const heroBg = document.querySelector('.hero__bg');
  if (!heroBg) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight * 1.2) {
          heroBg.style.transform = `translateY(${y * 0.28}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ═══════════════════════════════════════════════
   3. HERO ENTRANCE — staggered fade-in on load
═══════════════════════════════════════════════ */
function initHeroEntrance() {
  const items = document.querySelectorAll('.hero__animate');

  items.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('hero__animate--in');
    }, 280 + i * 190);
  });
}

/* ═══════════════════════════════════════════════
   4. SCROLL REVEAL — IntersectionObserver fade-in
═══════════════════════════════════════════════ */
function initReveal() {
  // Stagger children of [data-stagger] containers
  document.querySelectorAll('[data-stagger]').forEach(parent => {
    Array.from(parent.children).forEach((child, i) => {
      child.classList.add('reveal');
      child.style.transitionDelay = `${i * 90}ms`;
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════════
   5. PORTFOLIO FILTER
═══════════════════════════════════════════════ */
function initFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const items   = document.querySelectorAll('.portfolio__item');

  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active button
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show/hide items
      items.forEach(item => {
        const matches = filter === 'all' || item.dataset.category === filter;
        if (matches) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

/* ═══════════════════════════════════════════════
   6. SMOOTH SCROLL — offset for fixed nav
═══════════════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const nav = document.getElementById('nav');
      const navHeight = nav ? nav.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top, behavior: 'smooth' });

      // Close mobile overlay if open
      closeMobileMenu();
    });
  });
}

/* ═══════════════════════════════════════════════
   7. MOBILE MENU
═══════════════════════════════════════════════ */
function closeMobileMenu() {
  const overlay = document.getElementById('mobileOverlay');
  const toggle  = document.querySelector('.nav__hamburger');
  if (!overlay) return;

  overlay.classList.remove('open');
  document.body.classList.remove('no-scroll');
  if (toggle) toggle.setAttribute('aria-expanded', 'false');
}

function initMobileMenu() {
  const toggle  = document.querySelector('.nav__hamburger');
  const overlay = document.getElementById('mobileOverlay');
  const close   = document.querySelector('.nav__mobile-close');

  if (!toggle || !overlay) return;

  toggle.addEventListener('click', () => {
    const isOpen = overlay.classList.toggle('open');
    document.body.classList.toggle('no-scroll', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  if (close) {
    close.addEventListener('click', closeMobileMenu);
  }

  // Close on escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMobileMenu();
  });
}

/* ═══════════════════════════════════════════════
   8. CONTACT FORM — prevent default + feedback
═══════════════════════════════════════════════ */
function initContactForm() {
  const form = document.querySelector('.contact__form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const btn = form.querySelector('[type="submit"]');
    const original = btn.textContent;

    btn.textContent = 'Message Sent';
    btn.style.background = '#4a7c59';
    btn.style.borderColor = '#4a7c59';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      btn.style.borderColor = '';
      btn.disabled = false;
      form.reset();
    }, 3500);
  });
}

/* ═══════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initParallax();
  initHeroEntrance();
  initReveal();
  initFilter();
  initSmoothScroll();
  initMobileMenu();
  initContactForm();
  initQuoteWizard();
});

/* ═══════════════════════════════════════════════
   9. QUOTE WIZARD
═══════════════════════════════════════════════ */
function initQuoteWizard() {
  // ── Data ────────────────────────────────────
  const CATEGORIES = [
    { id: 'kitchen',  label: 'Kitchen\nRenovation',   icon: `<svg width="30" height="30" viewBox="0 0 36 36" fill="none"><rect x="4" y="8" width="28" height="20" rx=".5" stroke="#B89A5A" stroke-width="1.2"/><line x1="4" y1="16" x2="32" y2="16" stroke="#B89A5A" stroke-width="1.2"/><line x1="16" y1="8" x2="16" y2="28" stroke="#B89A5A" stroke-width="1.2"/><circle cx="10" cy="12" r="1.5" fill="#B89A5A"/></svg>` },
    { id: 'bathroom', label: 'Bathroom\nRemodeling',  icon: `<svg width="30" height="30" viewBox="0 0 36 36" fill="none"><rect x="6" y="10" width="16" height="18" rx=".5" stroke="#B89A5A" stroke-width="1.2"/><path d="M22 16 L30 16 L30 28 L22 28" stroke="#B89A5A" stroke-width="1.2"/><line x1="6" y1="30" x2="30" y2="30" stroke="#B89A5A" stroke-width="1.2"/></svg>` },
    { id: 'flooring', label: 'Flooring',              icon: `<svg width="30" height="30" viewBox="0 0 36 36" fill="none"><rect x="4" y="22" width="7" height="6" stroke="#B89A5A" stroke-width="1.2"/><rect x="11" y="22" width="7" height="6" stroke="#B89A5A" stroke-width="1.2"/><rect x="18" y="22" width="7" height="6" stroke="#B89A5A" stroke-width="1.2"/><rect x="25" y="22" width="7" height="6" stroke="#B89A5A" stroke-width="1.2"/><line x1="4" y1="22" x2="32" y2="22" stroke="#B89A5A" stroke-width="1.2"/></svg>` },
    { id: 'painting', label: 'Painting',              icon: `<svg width="30" height="30" viewBox="0 0 36 36" fill="none"><path d="M8 28 L8 10 Q8 8 10 8 L26 8 Q28 8 28 10 L28 22 Q28 24 26 24 L12 24 L8 28Z" stroke="#B89A5A" stroke-width="1.2"/><line x1="14" y1="12" x2="22" y2="12" stroke="#B89A5A" stroke-width="1.2"/><line x1="14" y1="16" x2="22" y2="16" stroke="#B89A5A" stroke-width="1.2"/></svg>` },
    { id: 'fullhome', label: 'Full Home\nRenovation', icon: `<svg width="30" height="30" viewBox="0 0 36 36" fill="none"><rect x="4" y="14" width="28" height="18" rx=".5" stroke="#B89A5A" stroke-width="1.2"/><path d="M4 14 L18 4 L32 14" stroke="#B89A5A" stroke-width="1.2" stroke-linecap="round"/><rect x="14" y="22" width="8" height="10" stroke="#B89A5A" stroke-width="1.2"/></svg>` },
    { id: 'interior', label: 'Interior\nWork',        icon: `<svg width="30" height="30" viewBox="0 0 36 36" fill="none"><rect x="6" y="4" width="10" height="28" rx=".5" stroke="#B89A5A" stroke-width="1.2"/><rect x="20" y="4" width="10" height="12" rx=".5" stroke="#B89A5A" stroke-width="1.2"/><rect x="20" y="20" width="10" height="12" rx=".5" stroke="#B89A5A" stroke-width="1.2"/></svg>` },
    { id: 'exterior', label: 'Exterior\nWork',        icon: `<svg width="30" height="30" viewBox="0 0 36 36" fill="none"><rect x="4" y="18" width="28" height="14" rx=".5" stroke="#B89A5A" stroke-width="1.2"/><path d="M4 18 L4 8 L32 8 L32 18" stroke="#B89A5A" stroke-width="1.2"/><line x1="4" y1="4" x2="32" y2="4" stroke="#B89A5A" stroke-width="1.2"/></svg>` },
    { id: 'landscaping', label: 'Landscaping',        icon: `<svg width="30" height="30" viewBox="0 0 36 36" fill="none"><path d="M18 6 Q24 12 24 18 Q24 24 18 26 Q12 24 12 18 Q12 12 18 6Z" stroke="#B89A5A" stroke-width="1.2"/><line x1="18" y1="26" x2="18" y2="32" stroke="#B89A5A" stroke-width="1.2"/><line x1="10" y1="32" x2="26" y2="32" stroke="#B89A5A" stroke-width="1.2"/></svg>` },
  ];

  const SUBSERVICES = {
    kitchen:     [
      { id: 'kitchen-cabinets',     label: 'New Cabinets',                   range: [4000, 15000] },
      { id: 'kitchen-countertops',  label: 'Countertops',                    range: [2000, 8000]  },
      { id: 'kitchen-backsplash',   label: 'Backsplash & Tile',              range: [800,  3000]  },
      { id: 'kitchen-flooring',     label: 'Flooring',                       range: [1500, 5000]  },
      { id: 'kitchen-appliances',   label: 'Appliance Installation',         range: [2000, 10000] },
      { id: 'kitchen-full',         label: 'Full Kitchen Demolition & Rebuild', range: [25000, 80000] },
    ],
    bathroom:    [
      { id: 'bathroom-flooring',    label: 'New Flooring',                   range: [800,  3000]  },
      { id: 'bathroom-bathtub',     label: 'New Bathtub',                    range: [1500, 5000]  },
      { id: 'bathroom-shower',      label: 'Convert Tub to Standing Shower', range: [3000, 10000] },
      { id: 'bathroom-toilet',      label: 'New Toilet',                     range: [500,  1500]  },
      { id: 'bathroom-vanity',      label: 'New Vanity',                     range: [1500, 5000]  },
      { id: 'bathroom-full',        label: 'Full Bathroom Demolition & Rebuild', range: [15000, 40000] },
    ],
    flooring:    [
      { id: 'flooring-hardwood',    label: 'Hardwood Installation',          range: [5000, 18000] },
      { id: 'flooring-laminate',    label: 'Laminate / LVP',                 range: [2000, 8000]  },
      { id: 'flooring-tile',        label: 'Tile',                           range: [3000, 12000] },
      { id: 'flooring-carpet',      label: 'Carpet Removal',                 range: [500,  2000]  },
      { id: 'flooring-levelling',   label: 'Floor Levelling',                range: [1000, 4000]  },
    ],
    painting:    [
      { id: 'painting-interior',    label: 'Interior Walls',                 range: [1500, 6000]  },
      { id: 'painting-exterior',    label: 'Exterior',                       range: [3000, 12000] },
      { id: 'painting-trim',        label: 'Trim & Doors',                   range: [500,  2000]  },
      { id: 'painting-ceiling',     label: 'Ceiling',                        range: [800,  3000]  },
      { id: 'painting-full',        label: 'Entire Home',                    range: [5000, 18000] },
    ],
    fullhome:    [
      { id: 'fullhome-structural',  label: 'Full Structural Renovation',     range: [80000, 250000] },
      { id: 'fullhome-openplan',    label: 'Open-Concept Conversion',        range: [20000, 60000]  },
      { id: 'fullhome-overhaul',    label: 'Complete Interior Overhaul',     range: [50000, 150000] },
    ],
    interior:    [
      { id: 'interior-drywall',     label: 'Drywall & Plastering',           range: [2000, 8000]  },
      { id: 'interior-moulding',    label: 'Crown Moulding',                 range: [1000, 4000]  },
      { id: 'interior-builtin',     label: 'Built-In Shelving',              range: [3000, 12000] },
      { id: 'interior-lighting',    label: 'Lighting Upgrade',               range: [1500, 6000]  },
    ],
    exterior:    [
      { id: 'exterior-siding',      label: 'Siding',                         range: [8000, 25000] },
      { id: 'exterior-windows',     label: 'Windows & Doors',                range: [5000, 20000] },
      { id: 'exterior-roofing',     label: 'Roofing',                        range: [8000, 30000] },
      { id: 'exterior-soffit',      label: 'Soffit & Fascia',                range: [2000, 8000]  },
    ],
    landscaping: [
      { id: 'landscaping-lawn',     label: 'Lawn & Garden',                  range: [1000, 5000]  },
      { id: 'landscaping-paving',   label: 'Interlocking / Paving',          range: [5000, 20000] },
      { id: 'landscaping-deck',     label: 'Deck or Patio',                  range: [8000, 30000] },
      { id: 'landscaping-fencing',  label: 'Fencing',                        range: [3000, 10000] },
    ],
  };

  const CAT_LABELS = {
    kitchen: 'Kitchen', bathroom: 'Bathroom', flooring: 'Flooring',
    painting: 'Painting', fullhome: 'Full Home', interior: 'Interior',
    exterior: 'Exterior', landscaping: 'Landscaping',
  };

  // ── State ────────────────────────────────────
  const state = {
    currentStep: 1,
    selectedCategories: new Set(),
    selectedSubServices: new Map(), // catId → Set of subservice ids
    uploadedFiles: [],
    activeTab: null,
    contact: { name: '', email: '', phone: '', postal: '' },
  };

  // ── Elements ─────────────────────────────────
  const overlay      = document.getElementById('quoteWizard');
  const closeBtn     = document.getElementById('qwClose');
  const doneBtn      = document.getElementById('qwDone');
  const progressBar  = document.getElementById('qwProgressBar');
  const mobileLabel  = document.getElementById('qwMobileLabel');
  const stepEls      = document.querySelectorAll('.qw-step');
  const panelEls     = document.querySelectorAll('.qw-panel');

  if (!overlay) return;

  // ── Open / Close ─────────────────────────────
  function openWizard() {
    overlay.classList.add('open');
    document.body.classList.add('no-scroll');
    goToStep(1);
  }

  function closeWizard() {
    overlay.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }

  document.querySelectorAll('[data-action="open-quote"]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      closeMobileMenu();
      openWizard();
    });
  });

  closeBtn.addEventListener('click', closeWizard);
  if (doneBtn) doneBtn.addEventListener('click', closeWizard);

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeWizard();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeWizard();
  });

  // ── Step Navigation ───────────────────────────
  const STEP_LABELS = ['Services', 'Details', 'Upload Photos', 'Your Info', 'Estimate'];

  function goToStep(n) {
    state.currentStep = n;

    // Update panels
    panelEls.forEach(p => p.classList.remove('active'));
    const panel = document.getElementById(`qwStep${n}`);
    if (panel) panel.classList.add('active');

    // Update sidebar steps
    stepEls.forEach(el => {
      const s = parseInt(el.dataset.step);
      el.classList.remove('active', 'done');
      if (s === n) el.classList.add('active');
      else if (s < n) el.classList.add('done');
    });

    // Mobile progress
    if (progressBar) progressBar.style.width = `${(n / 5) * 100}%`;
    if (mobileLabel) mobileLabel.textContent = `Step ${n} of 5 — ${STEP_LABELS[n - 1]}`;

    // Render step content
    if (n === 1) renderStep1();
    if (n === 2) renderStep2();
    if (n === 3) renderStep3();
    if (n === 5) renderStep5();
  }

  // ── Step 1 ───────────────────────────────────
  function renderStep1() {
    const grid = document.getElementById('qwCategories');
    if (!grid) return;
    grid.innerHTML = '';

    CATEGORIES.forEach(cat => {
      const card = document.createElement('div');
      card.className = 'qw-cat-card' + (state.selectedCategories.has(cat.id) ? ' selected' : '');
      card.innerHTML = `
        <div class="qw-cat-card__check">✓</div>
        <div class="qw-cat-card__icon">${cat.icon}</div>
        <span class="qw-cat-card__label">${cat.label.replace('\n', '<br>')}</span>
      `;
      card.addEventListener('click', () => {
        if (state.selectedCategories.has(cat.id)) {
          state.selectedCategories.delete(cat.id);
          card.classList.remove('selected');
        } else {
          state.selectedCategories.add(cat.id);
          card.classList.add('selected');
        }
        document.getElementById('qwNext1').disabled = state.selectedCategories.size === 0;
      });
      grid.appendChild(card);
    });

    const next1 = document.getElementById('qwNext1');
    if (next1) {
      next1.disabled = state.selectedCategories.size === 0;
      next1.onclick = () => goToStep(2);
    }
  }

  // ── Step 2 ───────────────────────────────────
  function renderStep2() {
    const tabsEl  = document.getElementById('qwCategoryTabs');
    const listEl  = document.getElementById('qwSubservices');
    if (!tabsEl || !listEl) return;

    const cats = Array.from(state.selectedCategories);
    if (!state.activeTab || !cats.includes(state.activeTab)) {
      state.activeTab = cats[0];
    }

    // Ensure sub-service sets exist
    cats.forEach(c => { if (!state.selectedSubServices.has(c)) state.selectedSubServices.set(c, new Set()); });

    // Render tabs
    tabsEl.innerHTML = '';
    if (cats.length > 1) {
      cats.forEach(catId => {
        const tab = document.createElement('button');
        tab.className = 'qw-cat-tab' + (catId === state.activeTab ? ' active' : '');
        tab.textContent = CAT_LABELS[catId] || catId;
        tab.addEventListener('click', () => {
          state.activeTab = catId;
          renderStep2();
        });
        tabsEl.appendChild(tab);
      });
    }

    // Render sub-service list for active tab
    listEl.innerHTML = '';
    const subs = SUBSERVICES[state.activeTab] || [];
    const selected = state.selectedSubServices.get(state.activeTab) || new Set();

    subs.forEach(sub => {
      const row = document.createElement('div');
      row.className = 'qw-sub-item' + (selected.has(sub.id) ? ' selected' : '');
      row.innerHTML = `
        <div class="qw-sub-item__box"><span class="qw-sub-item__check">✓</span></div>
        <span class="qw-sub-item__text">${sub.label}</span>
        <span class="qw-sub-item__range">$${fmt(sub.range[0])} – $${fmt(sub.range[1])}</span>
      `;
      row.addEventListener('click', () => {
        const set = state.selectedSubServices.get(state.activeTab);
        if (set.has(sub.id)) { set.delete(sub.id); row.classList.remove('selected'); }
        else                  { set.add(sub.id);    row.classList.add('selected');    }
      });
      listEl.appendChild(row);
    });

    const next2 = document.getElementById('qwNext2');
    if (next2) next2.onclick = () => goToStep(3);

    document.querySelectorAll('.qw-back[data-target="1"]').forEach(b => b.onclick = () => goToStep(1));
  }

  // ── Step 3 ───────────────────────────────────
  function renderStep3() {
    const zone    = document.getElementById('qwUploadZone');
    const input   = document.getElementById('qwFileInput');
    const browse  = document.getElementById('qwBrowse');
    const thumbs  = document.getElementById('qwThumbnails');
    const next3   = document.getElementById('qwNext3');
    const skip3   = document.getElementById('qwSkip3');

    if (!zone) return;

    function addFiles(files) {
      Array.from(files).forEach(file => {
        if (state.uploadedFiles.length >= 10) return;
        if (!file.type.startsWith('image/') && !file.name.toLowerCase().endsWith('.heic')) return;
        state.uploadedFiles.push(file);
      });
      renderThumbs();
    }

    function renderThumbs() {
      thumbs.innerHTML = '';
      state.uploadedFiles.forEach((file, i) => {
        const wrap = document.createElement('div');
        wrap.className = 'qw-thumb';
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.alt = file.name;
        const rmv = document.createElement('button');
        rmv.className = 'qw-thumb__remove';
        rmv.innerHTML = '×';
        rmv.setAttribute('aria-label', 'Remove photo');
        rmv.addEventListener('click', () => {
          state.uploadedFiles.splice(i, 1);
          renderThumbs();
        });
        wrap.append(img, rmv);
        thumbs.appendChild(wrap);
      });
    }

    // Drag & drop
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      addFiles(e.dataTransfer.files);
    });
    zone.addEventListener('click', e => {
      if (e.target !== browse) input.click();
    });
    if (browse) browse.addEventListener('click', e => { e.stopPropagation(); input.click(); });
    input.addEventListener('change', () => { addFiles(input.files); input.value = ''; });

    if (next3) next3.onclick = () => goToStep(4);
    if (skip3) skip3.onclick = () => goToStep(4);
    document.querySelectorAll('.qw-back[data-target="2"]').forEach(b => b.onclick = () => goToStep(2));

    renderThumbs();
  }

  // ── Step 4 ───────────────────────────────────
  (function bindStep4() {
    const next4 = document.getElementById('qwNext4');
    if (!next4) return;

    next4.addEventListener('click', () => {
      const name   = document.getElementById('qwName');
      const email  = document.getElementById('qwEmail');
      const postal = document.getElementById('qwPostal');

      let valid = true;
      [name, email, postal].forEach(el => {
        if (!el) return;
        if (!el.value.trim()) { el.style.borderBottomColor = '#c0392b'; valid = false; }
        else el.style.borderBottomColor = '';
      });
      if (email && email.value && !email.value.includes('@')) {
        email.style.borderBottomColor = '#c0392b';
        valid = false;
      }
      if (!valid) return;

      state.contact.name   = name   ? name.value.trim()   : '';
      state.contact.email  = email  ? email.value.trim()  : '';
      state.contact.phone  = document.getElementById('qwPhone')?.value.trim() || '';
      state.contact.postal = postal ? postal.value.trim() : '';

      goToStep(5);
    });

    document.querySelectorAll('.qw-back[data-target="3"]').forEach(b => b.onclick = () => goToStep(3));
  })();

  // ── Step 5 ───────────────────────────────────
  function renderStep5() {
    const container = document.getElementById('qwEstimate');
    if (!container) return;
    container.innerHTML = '';

    let totalMin = 0, totalMax = 0;

    state.selectedCategories.forEach(catId => {
      const subs = state.selectedSubServices.get(catId);
      if (!subs || subs.size === 0) return;

      // Category header
      const header = document.createElement('div');
      header.className = 'qw-estimate__cat-header';
      header.textContent = CAT_LABELS[catId] || catId;
      container.appendChild(header);

      subs.forEach(subId => {
        const allSubs = SUBSERVICES[catId] || [];
        const sub = allSubs.find(s => s.id === subId);
        if (!sub) return;

        totalMin += sub.range[0];
        totalMax += sub.range[1];

        const row = document.createElement('div');
        row.className = 'qw-estimate__item';
        row.innerHTML = `<span class="qw-estimate__name">${sub.label}</span><span class="qw-estimate__price">$${fmt(sub.range[0])} – $${fmt(sub.range[1])}</span>`;
        container.appendChild(row);
      });
    });

    // Total row
    const total = document.createElement('div');
    total.className = 'qw-estimate__item qw-estimate__item--total';
    total.innerHTML = `<span class="qw-estimate__name">Estimated Total</span><span class="qw-estimate__price">$${fmt(totalMin)} – $${fmt(totalMax)}</span>`;
    container.appendChild(total);

    // Submit
    const submitBtn = document.getElementById('qwSubmit');
    if (submitBtn) {
      submitBtn.onclick = () => {
        const ty = document.getElementById('qwThankyou');
        if (ty) ty.classList.add('visible');
      };
    }

    document.querySelectorAll('.qw-back[data-target="4"]').forEach(b => b.onclick = () => goToStep(4));
  }

  // ── Helpers ──────────────────────────────────
  function fmt(n) {
    return n.toLocaleString('en-CA');
  }
}
