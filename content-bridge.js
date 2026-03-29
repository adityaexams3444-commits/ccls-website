/**
 * CCLS Content Bridge
 * Reads admin-managed content from localStorage and injects it
 * into the public-facing pages dynamically.
 *
 * Include this script at the bottom of any public page to enable
 * live admin-controlled content.
 *
 * Usage: <script src="admin/content-bridge.js"></script>
 */
(function () {
  'use strict';

  const STORE_KEY = 'ccls_content_v1';

  function getData() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function setText(sel, val) {
    const el = document.querySelector(sel);
    if (el && val !== undefined && val !== '') el.textContent = val;
  }

  function setHTML(sel, val) {
    const el = document.querySelector(sel);
    if (el && val !== undefined && val !== '') el.innerHTML = val;
  }

  function setAttr(sel, attr, val) {
    const el = document.querySelector(sel);
    if (el && val !== undefined && val !== '') el.setAttribute(attr, val);
  }

  const data = getData();
  if (!data) return; // No admin data yet, keep original HTML

  const page = window.location.pathname.split('/').pop() || 'index.html';

  // ─── HOMEPAGE ──────────────────────────────────────────────────
  if (page === 'index.html' || page === '') {
    const hp = data.homepage;
    if (!hp) return;

    // Hero badge
    setText('.hero-badge', hp.heroBadge);

    // Hero title (with italic gold word)
    const heroTitleEl = document.querySelector('.hero-title');
    if (heroTitleEl && hp.heroTitle) {
      const italic = hp.heroItalic || '';
      const plain = italic
        ? hp.heroTitle.replace(italic, `<em>${italic}</em>`)
        : hp.heroTitle;
      heroTitleEl.innerHTML = plain.replace(/ (\S+)$/, '<br>$1');
    }

    // Hero sub & CTA
    setText('.hero-sub', hp.heroSub);
    const ctaEl = document.querySelector('.hero-btn');
    if (ctaEl && hp.heroCta) ctaEl.textContent = hp.heroCta;

    // Stats
    const statItems = document.querySelectorAll('.stat-item');
    const stats = [
      { num: hp.stat1num, lbl: hp.stat1lbl },
      { num: hp.stat2num, lbl: hp.stat2lbl },
      { num: hp.stat3num, lbl: hp.stat3lbl }
    ];
    statItems.forEach((item, i) => {
      if (!stats[i]) return;
      const numEl = item.querySelector('.stat-number');
      const lblEl = item.querySelector('.stat-label');
      if (numEl && stats[i].num) numEl.textContent = stats[i].num;
      if (lblEl && stats[i].lbl) lblEl.textContent = stats[i].lbl;
    });

    // About section
    const splitDivs = document.querySelectorAll('.split');
    if (splitDivs[0]) {
      const st = splitDivs[0].querySelector('.split-text');
      if (st) {
        const h2 = st.querySelector('h2');
        const ps = st.querySelectorAll('p');
        if (h2 && hp.aboutTitle) h2.textContent = hp.aboutTitle;
        if (ps[0] && hp.aboutP1) ps[0].textContent = hp.aboutP1;
        if (ps[1] && hp.aboutP2) ps[1].textContent = hp.aboutP2;
        const sig = st.querySelector('.signature');
        if (sig && hp.aboutSig) sig.innerHTML = hp.aboutSig.replace(',', ',<br>');
      }
    }

    // Principal message
    if (splitDivs[1]) {
      const st = splitDivs[1].querySelector('.split-text');
      if (st) {
        const ps = st.querySelectorAll('p');
        if (ps[0] && hp.picQ1) ps[0].innerHTML = `&ldquo;${hp.picQ1}&rdquo;`;
        if (ps[1] && hp.picQ2) ps[1].innerHTML = `&ldquo;${hp.picQ2}&rdquo;`;
        const sig = st.querySelector('.signature');
        if (sig && hp.picName) sig.innerHTML = `<strong>${hp.picName}</strong><br>${hp.picRole || ''}`;
        const role = st.querySelector('.role');
        if (role && hp.picRole) role.textContent = hp.picRole;
      }
    }

    // Countdown label
    const cdLabelEl = document.querySelector('.countdown-label');
    if (cdLabelEl && hp.cdLabel) cdLabelEl.textContent = hp.cdLabel;

    // Countdown date (reinitialise timer)
    if (hp.cdDate) {
      const targetTime = new Date(hp.cdDate).getTime();
      function updateCountdown() {
        const diff = targetTime - Date.now();
        if (diff <= 0) return;
        const days = Math.floor(diff / 864e5);
        const hours = Math.floor(diff % 864e5 / 36e5);
        const mins = Math.floor(diff % 36e5 / 6e4);
        const secs = Math.floor(diff % 6e4 / 1e3);
        function s(id, v) { const e = document.getElementById(id); if (e) e.textContent = String(v).padStart(2, '0'); }
        s('cd-days', days); s('cd-hours', hours); s('cd-mins', mins); s('cd-secs', secs);
      }
      updateCountdown();
      setInterval(updateCountdown, 1000);
    }
  }

  // ─── EVENTS PAGE ──────────────────────────────────────────────
  if (page === 'events.html') {
    const events = (data.events || []).filter(e => e.status === 'published');
    const grid = document.querySelector('.events-grid');
    if (grid && events.length) {
      grid.innerHTML = events.map(ev => {
        const d = ev.date ? new Date(ev.date) : null;
        const dayNum = d ? d.getDate() : '—';
        const monthStr = d ? d.toLocaleString('en-IN', { month: 'short' }).toUpperCase() : '';
        return `
          <div class="event-card">
            <div class="event-card-img">
              <span class="icon">📋</span>
              <div class="event-date">
                <strong>${dayNum}</strong>
                <span>${monthStr}</span>
              </div>
            </div>
            <div class="event-card-body">
              <h3>${ev.title}</h3>
              <p>${ev.desc || ''}</p>
              <div class="event-meta">${ev.category}${ev.venue ? ' · ' + ev.venue : ''}${ev.time ? ' · ' + ev.time : ''}</div>
              ${ev.link ? `<a href="${ev.link}" target="_blank" style="font-size:0.78rem;color:var(--gold);display:inline-block;margin-top:10px">Register / Learn More →</a>` : ''}
            </div>
          </div>`;
      }).join('');
    }
  }

  // ─── ARTICLES PAGE ────────────────────────────────────────────
  if (page === 'articles.html') {
    const articles = (data.articles || []).filter(a => a.status === 'published');
    const grid = document.querySelector('.articles-grid');
    if (grid && articles.length) {
      grid.innerHTML = articles.map(a => `
        <div class="article-card">
          <div>
            <span class="article-tag">${a.category}</span>
            <h3>${a.title}</h3>
            <p>${a.abstract || ''}</p>
          </div>
          <div class="article-meta">
            <span>${a.author}</span>
            <span>${a.date ? new Date(a.date).toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'}) : ''}</span>
          </div>
          ${a.link ? `<a href="${a.link}" target="_blank" style="font-size:0.75rem;color:var(--gold);display:inline-block;margin-top:10px">Read Full Article →</a>` : ''}
        </div>`).join('');
    }
  }

  // ─── PARTNERS PAGE ────────────────────────────────────────────
  if (page === 'partners.html') {
    const partners = (data.partners || []).filter(p => p.status === 'active');
    const categories = { Industry: [], Academic: [], Government: [], Knowledge: [] };
    partners.forEach(p => {
      const cat = p.category || 'Industry';
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(p);
    });
    // Try to inject into existing partner logo rows
    Object.entries(categories).forEach(([cat, items]) => {
      if (!items.length) return;
      // Find section with matching heading
      document.querySelectorAll('.section, [class*="section"]').forEach(sec => {
        const h = sec.querySelector('h2,h3');
        if (h && h.textContent.toLowerCase().includes(cat.toLowerCase())) {
          const row = sec.querySelector('.partners-row, .partner-logos, [class*="partner"]');
          if (row) {
            row.innerHTML = items.map(p =>
              p.logo
                ? `<div class="partner-logo"><a href="${p.url||'#'}" target="_blank"><img src="${p.logo}" alt="${p.name}" title="${p.name}" style="max-height:40px"></a></div>`
                : `<div class="partner-logo"><a href="${p.url||'#'}" target="_blank" style="font-size:0.78rem;font-weight:600;color:var(--navy)">${p.name}</a></div>`
            ).join('');
          }
        }
      });
    });
  }

  // ─── CONTACT PAGE ─────────────────────────────────────────────
  if (page === 'contact.html') {
    const ct = data.contact;
    if (!ct) return;
    if (ct.email) {
      document.querySelectorAll('[href^="mailto"]').forEach(el => el.setAttribute('href', 'mailto:' + ct.email));
      document.querySelectorAll('[class*="email"]').forEach(el => { if (!el.querySelector('a')) el.textContent = ct.email; });
    }
    if (ct.phone) {
      document.querySelectorAll('[class*="phone"]').forEach(el => el.textContent = ct.phone);
    }
    if (ct.address) {
      document.querySelectorAll('[class*="address"]').forEach(el => el.textContent = ct.address);
    }
    const socialLinks = { instagram: ct.instagram, linkedin: ct.linkedin, youtube: ct.youtube, twitter: ct.twitter };
    Object.entries(socialLinks).forEach(([platform, url]) => {
      if (!url) return;
      document.querySelectorAll(`a[href*="${platform}"]`).forEach(el => el.setAttribute('href', url));
    });
  }

  // ─── ALL PAGES — FOOTER ───────────────────────────────────────
  const ft = data.footer;
  if (ft) {
    const fbottom = document.querySelector('.footer-bottom');
    if (fbottom && ft.copyright) fbottom.textContent = ft.copyright;
  }

  // ─── ALL PAGES — LOGO (if admin uploaded one) ─────────────────
  const mainLogo = (data.media || []).find(m => m.id === 'mainLogo');
  if (mainLogo) {
    document.querySelectorAll('.nav-logo-img, .footer-brand img').forEach(img => {
      img.src = mainLogo.src;
    });
  }

  // ─── ORGANOGRAM / FACULTY TEAM ────────────────────────────────
  if (page === 'faculty-team.html') {
    const members = data.members || [];
    if (!members.length) return;

    // Group by tier
    const tiers = {};
    members.forEach(m => {
      if (!tiers[m.tier]) tiers[m.tier] = [];
      tiers[m.tier].push(m);
    });

    const container = document.querySelector('.section') || document.querySelector('main') || document.body;
    const existingTeam = document.querySelector('.team-tier');

    if (existingTeam) {
      // Replace existing team content
      const parent = existingTeam.parentNode;
      // Remove all team-tier divs
      parent.querySelectorAll('.team-tier').forEach(el => el.remove());

      Object.entries(tiers).forEach(([tier, mems]) => {
        const tierDiv = document.createElement('div');
        tierDiv.className = 'team-tier';
        tierDiv.innerHTML = `
          <div class="team-tier-label">${tier}</div>
          <div class="team-grid">
            ${mems.map(m => `
              <div class="team-card">
                <div class="photo">${m.photo ? `<img src="${m.photo}" style="width:100%;height:100%;object-fit:cover">` : m.name[0]}</div>
                <div class="name">${m.name}</div>
                <div class="role">${m.role || ''}</div>
              </div>`).join('')}
          </div>`;
        parent.appendChild(tierDiv);
      });
    }
  }

})();
