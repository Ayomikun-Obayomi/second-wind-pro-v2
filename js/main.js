/* ============================================================
   SECOND WIND PRO V2 — INTERACTIONS
   ------------------------------------------------------------
   Vanilla JS, no dependencies. Modules:
     1. AthleteData       — placeholder roster + transfer data
     2. ModalSystem       — single modal, two content modes
     3. RosterCarousel    — carousel nav + sport filter tabs
     4. LeadershipCarousel — roster-style carousel + in-card expand
     5. ServicesStack    — Square-style sticky scroll tabs
     6. TransferLive      — live ticker timestamp
     7. NavDropdown       — Resources keyboard support
   ============================================================ */

/* ------------------------------------------------------------
   1. ATHLETE DATA
   ------------------------------------------------------------ */

const ATHLETES = {
  'marcus-lane': {
    name: 'Marcus Lane', position: 'QB · Class of 2027', photo: 'ML',
    basketball: false, agent: 'Luke Bramwell',
    athleticLevel: '5-Star QB · National #1',
    hometown: 'Phoenix, Arizona',
    university: 'University of Texas',
    presentability: 'Executive-ready on camera; trusted in live interview settings',
    bio: 'Marcus is a dual-threat quarterback known for command at the line and poise in high-pressure drives. He is active in local youth camps and is consistently one of the strongest interview performers in his class.',
    accomplishments: ['Elite 11 finalist', 'State champion (2025)', 'Regional NIL camp ambassador'],
    stats: [
      ['3,847', 'Passing yards'], ['32', 'Touchdowns'], ['68.4%', 'Completion rate'],
      ['5-Star', 'Recruit rating'], ['#1', 'National rank'], ['9.2', 'QBR']
    ],
    status: 'committed',
    from: { name: 'Phoenix Heritage HS', logo: 'PH', color: '#7c1d1d' },
    to:   { name: 'University of Texas', logo: 'UT', color: '#bf5700', logoSrc: 'assets/schools/texas.png' },
    signed: 'February 14, 2026'
  },
  'idris-vale': {
    name: 'Idris Vale', position: 'PG · Class of 2026', photo: 'IV',
    basketball: true, agent: 'Lenny Vasquez',
    athleticLevel: 'Top-25 National Guard',
    hometown: 'Newark, New Jersey',
    university: 'Duke University',
    presentability: 'Strong social presence with clean brand alignment history',
    bio: 'Idris is a scoring point guard with advanced pace control and high-assist playmaking. Off the floor, he is known for polished social content and a dependable, sponsor-friendly media style.',
    accomplishments: ['Jordan Brand Classic invite', 'EYBL All-Circuit First Team', 'State Player of the Year finalist'],
    stats: [
      ['24.3', 'Points per game'], ['7.2', 'Assists'], ['4.1', 'Rebounds'],
      ['Top-25', 'National rank'], ['43%', '3-point %'], ['18', 'Games played']
    ],
    status: 'signed',
    from: { name: 'Montverde Academy', logo: 'MN', color: '#3d3d3d' },
    to:   { name: 'Duke University', logo: 'DUKE', color: '#0d2240', logoSrc: 'assets/schools/duke.png' },
    signed: 'December 9, 2025'
  },
  'caleb-mooney': {
    name: 'Caleb Mooney', position: 'WR · Junior', photo: 'CM',
    basketball: false, agent: 'Luke Bramwell', status: 'represented',
    athleticLevel: 'Top-10 National WR',
    hometown: 'Baton Rouge, Louisiana',
    university: 'LSU',
    presentability: 'Charismatic speaker with high fan-event conversion',
    bio: 'Caleb is an explosive receiver with high route discipline and consistent production against top competition. He brings high energy to community and fan activations, especially youth-focused events.',
    accomplishments: ['All-Conference selection', '1,200+ receiving yards season', 'Team captain'],
    stats: [
      ['1,210', 'Receiving yards'], ['9', 'Touchdowns'], ['16.8', 'Yards per catch'],
      ['All-Conf', 'Conference honors'], ['#8', 'National WR rank'], ['78', 'Receptions']
    ]
  },
  'sienna-hart': {
    name: 'Sienna Hart', position: 'SG · AAU Top 50', photo: 'SH',
    basketball: true, agent: 'Lenny Vasquez', status: 'represented',
    athleticLevel: 'AAU Top-50 Wing',
    hometown: 'San Diego, California',
    university: 'UCLA (commit target)',
    presentability: 'Camera-confident storyteller with premium lifestyle fit',
    bio: 'Sienna is a two-way wing whose perimeter defense and shooting range translate across systems. She is especially strong in beauty, wellness, and lifestyle storytelling partnerships.',
    accomplishments: ['EYBL top scorer (regional)', 'Top-50 AAU ranking', 'Nike circuit standout'],
    stats: [
      ['19.8', 'Points per game'], ['5.4', 'Assists'], ['3.8', 'Steals'],
      ['Top-50', 'National rank'], ['41%', '3-point %'], ['EYBL', 'Circuit']
    ]
  },
  'trey-holloway': {
    name: 'Trey Holloway', position: 'Edge · Class of 2026', photo: 'TH',
    basketball: false, agent: 'Luke Bramwell', status: 'represented',
    athleticLevel: 'Top-10 National Edge',
    hometown: 'Atlanta, Georgia',
    university: 'University of Georgia',
    presentability: 'Disciplined spokesperson with strong team-first tone',
    bio: 'Trey is a disruptive edge rusher with elite closing speed and disciplined technique. His personality and communication style perform well for team culture, performance, and training-focused campaigns.',
    accomplishments: ['5-Star recruit', '17.5 sacks in season', 'Defensive MVP (state final)'],
    stats: [
      ['17.5', 'Sacks'], ['74', 'Tackles'], ['12', 'Tackles for loss'],
      ['Top-10', 'National rank'], ['4', 'Forced fumbles'], ['5-Star', 'Recruit rating']
    ]
  },
  'devon-park': {
    name: 'Devon Park', position: 'RB · Senior', photo: 'DP',
    basketball: false, agent: 'Luke Bramwell',
    athleticLevel: 'Top-3 National RB',
    hometown: 'Eugene, Oregon',
    university: 'Ohio State University',
    presentability: 'Veteran media presence; polished in long-form interviews',
    bio: 'Devon is a versatile running back with downhill power and proven receiving production. He offers immediate credibility for performance, apparel, and leadership-driven brand stories.',
    accomplishments: ['Heisman watch list', '1,500+ rushing yards', '18 total touchdowns'],
    stats: [
      ['1,560', 'Rushing yards'], ['18', 'Touchdowns'], ['5.8', 'Yards per carry'],
      ['Heisman', 'Watch list'], ['#3', 'National RB rank'], ['52', 'Receptions']
    ],
    status: 'portal',
    from: { name: 'University of Oregon', logo: 'OR', color: '#154733', logoSrc: 'assets/schools/oregon.png' },
    to:   { name: 'Ohio State University', logo: 'OSU', color: '#a71930', logoSrc: 'assets/schools/ohio-state.png' },
    signed: 'January 30, 2026'
  }
};


const ADVISORS = {
  'jordan-ellis': {
    name: 'Jordan Ellis',
    title: 'Head of Sports & COO',
    bio: 'Jordan spent twelve years in Power Four front offices before co-founding Second Wind Pro. He is known for staying in the negotiation room until every term protects the athlete—not just the next season.',
    disciplines: ['Football', 'Tennis'],
    regions: ['National operations', 'Southeast hub', 'Texas corridor', 'East Coast'],
    athletes: ['marcus-lane', 'devon-park', 'idris-vale'],
  },
  'luke-bramwell': {
    name: 'Luke Bramwell',
    title: 'Senior Agent',
    bio: 'Luke played defensive back at Florida State and moved into representation after helping teammates navigate the first NIL cycle. Families work with him for straight answers and contracts built around eligibility, not headlines.',
    disciplines: ['Football'],
    regions: ['Southeast', 'Texas'],
    athletes: ['marcus-lane', 'caleb-mooney', 'trey-holloway', 'devon-park'],
  },
  'lenny-vasquez': {
    name: 'Lenny Vasquez',
    title: 'Senior Agent',
    bio: 'Lenny grew up playing point guard in Brooklyn and started in D1 compliance before joining the agency. He represents guards and wings the way he wished someone had represented him—clear guidance, no pressure tactics.',
    disciplines: ['Basketball'],
    regions: ['East Coast', 'AAU circuits'],
    athletes: ['idris-vale', 'sienna-hart'],
  },
  'mara-chen': {
    name: 'Mara Chen',
    title: 'Agent',
    bio: 'Mara was a nationally ranked junior before an injury led her to sports law. She still competes in local tournaments and brings an athlete\'s patience to families navigating school, travel, and sponsorship at the same time.',
    disciplines: ['Tennis'],
    regions: ['Junior-to-college pathways', 'National'],
    athletes: [],
  },
  'eli-okonkwo': {
    name: 'Eli Okonkwo',
    title: 'Agent',
    bio: 'Eli is a former Ohio State linebacker who began advising teammates on deals before NIL had a formal name. He focuses on linemen and defenders because those rooms are where leverage is built—and too often ignored.',
    disciplines: ['Football'],
    regions: ['Midwest', 'Power Four'],
    athletes: ['trey-holloway', 'caleb-mooney'],
  },
  'sofia-ruiz': {
    name: 'Sofia Ruiz',
    title: 'Agent',
    bio: 'Sofia played at Oregon and spent four years in sportswear brand strategy before becoming an agent. She helps players tell their own story so partnerships feel authentic—not like a template every recruit gets.',
    disciplines: ['Basketball'],
    regions: ['West Coast', 'Prep-to-pro pipeline'],
    athletes: ['sienna-hart'],
  },
};


/* ------------------------------------------------------------
   2. MODAL SYSTEM
   ------------------------------------------------------------ */

(function ModalSystem() {
  const modal = document.getElementById('modal');
  const closeBtn = document.getElementById('modal-close');
  if (!modal || !closeBtn) return;

  const $name     = document.getElementById('modal-name');
  const $position = document.getElementById('modal-position');
  const $photo    = document.getElementById('modal-photo');
  const $stats    = document.getElementById('modal-stats');
  const $agent    = document.getElementById('modal-agent');
  const $bio = document.getElementById('modal-bio');
  const $accomplishments = document.getElementById('modal-accomplishments');
  const $brandGrid = document.getElementById('modal-brand-grid');
  const $status   = document.getElementById('modal-status');
  const $statusLbl = document.getElementById('modal-status-label');
  const $statusDate = document.getElementById('modal-status-date');
  const $statusSchool = document.getElementById('modal-status-school');

  const STATUS_LABELS = {
    committed: 'Committed',
    portal: 'Portal Move',
    signed: 'Signed',
    represented: 'Represented',
  };

  function formatSignedShort(signed) {
    const d = new Date(signed);
    if (Number.isNaN(d.getTime())) return signed;
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yy = String(d.getFullYear()).slice(-2);
    return `${mm}.${dd}.${yy}`;
  }

  function wireRowLabel(key) {
    const a = ATHLETES[key];
    if (!a) return 'View transfer';
    if (a.from && a.to) {
      return `View ${a.name} transfer from ${a.from.name} to ${a.to.name}`;
    }
    return `View ${a.name}`;
  }

  const modalPanel = modal.querySelector('.modal');
  let lastFocus = null;

  function focusableIn(container) {
    return [...container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )].filter((el) => !el.disabled && el.getAttribute('aria-hidden') !== 'true');
  }

  function schoolLogoMarkup(school) {
    if (!school) return '';
    if (school.logoSrc) {
      return `<div class="logo logo--img"><img src="${school.logoSrc}" alt="" width="36" height="36" loading="lazy" /></div>`;
    }
    return `<div class="logo" style="background:${school.color}">${school.logo}</div>`;
  }

  function renderMovementMarkup(a) {
    if (!a.from || !a.to) return '';
    return `
      <div class="modal-movement-flow">
        <div class="wire-school">${schoolLogoMarkup(a.from)}<span class="name">${a.from.name}</span></div>
        <span class="modal-movement-arrow" aria-hidden="true">→</span>
        <div class="wire-school">${schoolLogoMarkup(a.to)}<span class="name">${a.to.name}</span></div>
      </div>
    `;
  }

  const $movement = document.getElementById('modal-movement');
  const $movementFlow = document.getElementById('modal-movement-flow');
  const $movementSigned = document.getElementById('modal-movement-signed');

  function open(key) {
    const a = ATHLETES[key];
    if (!a) return;

    $name.textContent = a.name;
    $position.textContent = a.position;
    $photo.textContent = a.photo;
    $photo.className = 'modal-photo' + (a.basketball ? ' basketball' : '');

    $stats.innerHTML = '';
    a.stats.forEach(([v, k]) => {
      const el = document.createElement('div');
      el.className = 'modal-stat';
      el.innerHTML = `<div class="v" aria-label="${k}">${v}</div><div class="k">${k}</div>`;
      $stats.appendChild(el);
    });

    $agent.textContent = a.agent;

    if ($brandGrid) {
      const brandRows = [
        ['Athletic level', a.athleticLevel || a.position],
        ['Presentability', a.presentability || 'Brand-safe spokesperson profile'],
        ['Hometown', a.hometown || 'Available on request'],
        ['University', a.university || a.to?.name || 'Available on request'],
      ];
      $brandGrid.innerHTML = '';
      brandRows.forEach(([k, v]) => {
        const row = document.createElement('div');
        row.className = 'modal-brand-item';
        row.innerHTML = `<div class="k">${k}</div><div class="v">${v}</div>`;
        $brandGrid.appendChild(row);
      });
    }

    if ($bio) {
      $bio.textContent = a.bio || `${a.name} is represented by Second Wind Pro for athlete-first NIL partnerships.`;
    }

    if ($accomplishments) {
      $accomplishments.innerHTML = '';
      const items = (a.accomplishments && a.accomplishments.length)
        ? a.accomplishments
        : ['Verified athletic profile available on request'];
      items.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        $accomplishments.appendChild(li);
      });
    }

    const status = a.status || 'represented';
    $status.className = `modal-status modal-status--${status}`;
    $statusLbl.textContent = STATUS_LABELS[status] || status;
    if (a.to) {
      $statusSchool.textContent = a.to.name;
      $statusSchool.hidden = false;
    } else {
      $statusSchool.hidden = true;
    }
    if (a.signed) {
      $statusDate.textContent = formatSignedShort(a.signed);
      $statusDate.hidden = false;
    } else {
      $statusDate.hidden = true;
    }

    if (a.from && a.to && $movement && $movementFlow) {
      $movement.hidden = false;
      $movementFlow.innerHTML = renderMovementMarkup(a);
      if ($movementSigned) {
        if (a.signed) {
          $movementSigned.textContent = `Facilitated · Signed ${formatSignedShort(a.signed)}`;
          $movementSigned.hidden = false;
        } else {
          $movementSigned.hidden = true;
        }
      }
    } else if ($movement) {
      $movement.hidden = true;
      if ($movementFlow) $movementFlow.innerHTML = '';
      if ($movementSigned) $movementSigned.hidden = true;
    }

    lastFocus = document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-modal-open');
    closeBtn.focus();
  }

  function close() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-modal-open');
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    lastFocus = null;
  }

  const rosterList = document.getElementById('roster-grid') || document.getElementById('roster-carousel');

  function activateCard(card) {
    if (!card || card.dataset.hidden === 'true') return;
    open(card.dataset.athlete);
  }

  rosterList?.addEventListener('click', (e) => {
    if (e.target.closest('.partner-btn')) return;
    if (document.getElementById('roster-grid')) {
      if (e.target.closest('.athlete-read-more')) return;
      return;
    }
    activateCard(e.target.closest('.athlete-card[data-athlete]'));
  });

  document.querySelectorAll('.athlete-card[data-athlete]').forEach((card) => {
    const isRosterPageCard = Boolean(card.closest('#roster.roster-page'));
    if (!isRosterPageCard) {
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      const a = ATHLETES[card.dataset.athlete];
      if (a) card.setAttribute('aria-label', `View ${a.name} profile`);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activateCard(card);
        }
      });
    }
  });

  document.querySelectorAll('.partner-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => e.stopPropagation());
  });

  function excerptCopy(text, max = 110) {
    if (!text) return '';
    if (text.length <= max) return text;
    return `${text.slice(0, max).replace(/\s+\S*$/, '').trim()}…`;
  }

  document.querySelectorAll('#roster.roster-page .athlete-card[data-athlete]').forEach((card) => {
    const key = card.dataset.athlete;
    const a = ATHLETES[key];
    if (!a) return;

    const rank = card.querySelector('.athlete-rank');
    const descText = card.querySelector('.athlete-card-desc-text');
    const readMore = card.querySelector('.athlete-read-more');

    if (rank) {
      rank.textContent = a.athleticLevel || '';
      rank.hidden = !rank.textContent;
    }
    if (descText) descText.textContent = `${excerptCopy(a.bio || a.presentability || '')} `;
    if (readMore) {
      readMore.href = `athlete.html?athlete=${encodeURIComponent(key)}`;
      readMore.setAttribute('aria-label', `Read more about ${a.name}`);
    }
  });

  const hashKey = location.hash.replace(/^#/, '');
  if (hashKey && ATHLETES[hashKey]) open(hashKey);

  document.getElementById('leadership-detail-roster')?.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-athlete]');
    if (!trigger) return;
    e.preventDefault();
    e.stopPropagation();
    open(trigger.dataset.athlete);
  });

  document.querySelectorAll('.wire-row').forEach((row) => {
    const key = row.dataset.transfer;
    if (!key) return;
    row.setAttribute('aria-label', wireRowLabel(key));
    const activate = () => open(key);
    row.addEventListener('click', activate);
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate();
      }
    });
  });

  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      e.preventDefault();
      close();
      return;
    }
    if (e.key !== 'Tab' || !modal.classList.contains('open') || !modalPanel) return;
    const nodes = focusableIn(modalPanel);
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
})();


/* ------------------------------------------------------------
   3. ROSTER CAROUSEL + TABS
   ------------------------------------------------------------ */

(function RosterCarousel() {
  const carousel = document.getElementById('roster-carousel');
  const grid = document.getElementById('roster-grid');
  const track = carousel?.querySelector('.roster-track');
  const viewport = carousel?.querySelector('.roster-viewport');
  const cardRoot = grid || track;
  const isGrid = Boolean(grid);
  const rosterSection = document.getElementById('roster');
  const prev = rosterSection?.querySelector('.roster-prev');
  const next = rosterSection?.querySelector('.roster-next');
  const dots = document.getElementById('roster-dots');
  const tabs = document.querySelectorAll('.roster-tabs .tab');
  if (!cardRoot || (!isGrid && (!carousel || !viewport))) return;

  let index = 0;

  function visibleCards() {
    return [...cardRoot.querySelectorAll('.athlete-card')].filter((c) => c.dataset.hidden !== 'true');
  }

  function stepPx() {
    const cards = visibleCards();
    if (!cards.length) return 0;
    const gap = parseFloat(getComputedStyle(track).gap) || 16;
    return cards[0].offsetWidth + gap;
  }

  function renderDots() {
    if (!dots || isGrid) return;
    const cards = visibleCards();
    dots.innerHTML = '';
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'roster-dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Athlete ${i + 1}`);
      dot.setAttribute('aria-selected', String(i === index));
      if (i === index) dot.classList.add('active');
      dot.addEventListener('click', () => { index = i; update(); });
      dots.appendChild(dot);
    });
  }

  function update() {
    if (isGrid || !track) return;
    const cards = visibleCards();
    if (!cards.length) return;
    const max = Math.max(0, cards.length - 1);
    if (index > max) index = 0;
    if (index < 0) index = max;
    track.style.transform = `translateX(-${index * stepPx()}px)`;
    dots?.querySelectorAll('.roster-dot').forEach((dot, i) => {
      const active = i === index;
      dot.classList.toggle('active', active);
      dot.setAttribute('aria-selected', String(active));
    });
  }

  function applyFilter(sport) {
    cardRoot.querySelectorAll('.athlete-card').forEach((card) => {
      const tag = card.dataset.sport
        || card.querySelector('.sport-tag')?.textContent.toLowerCase()
        || '';
      const show = sport === 'all' || tag.includes(sport);
      card.dataset.hidden = show ? 'false' : 'true';
      card.setAttribute('tabindex', show ? '0' : '-1');
      card.setAttribute('aria-hidden', show ? 'false' : 'true');
    });
    if (!isGrid) {
      index = 0;
      renderDots();
      update();
    }
  }

  if (!isGrid) {
    prev?.addEventListener('click', () => { index -= 1; update(); });
    next?.addEventListener('click', () => { index += 1; update(); });
    window.addEventListener('resize', update);
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('active', active);
        t.setAttribute('aria-pressed', String(active));
      });
      const sport = tab.textContent.trim().split(' ')[0].toLowerCase();
      applyFilter(sport);
    });
  });

  cardRoot.querySelectorAll('.athlete-card').forEach((c) => { c.dataset.hidden = 'false'; });
  if (!isGrid) {
    renderDots();
    update();
  }
})();


/* ------------------------------------------------------------
   4. LEADERSHIP CAROUSEL — roster-style track + in-card expand
   ------------------------------------------------------------ */

(function LeadershipCarousel() {
  const section = document.getElementById('leadership');
  const track = document.getElementById('leadership-track');
  if (!section || !track) return;

  const isPage = section.classList.contains('leadership-page');
  const tabs = section.querySelectorAll('.roster-tabs .tab');
  let expandedCard = null;
  let showcaseActiveFilter = () => {};
  let hideDetailPanel = () => {};
  let activeDetailCard = null;

  function closeExpanded() {
    if (!expandedCard) return;

    const toggle = expandedCard.querySelector('.advisor-photo-toggle');
    const panel = expandedCard.querySelector('.advisor-photo-panel');

    expandedCard.classList.remove('is-expanded');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    if (panel) panel.setAttribute('aria-hidden', 'true');
    expandedCard = null;
  }

  function openExpanded(card) {
    if (expandedCard && expandedCard !== card) closeExpanded();

    const toggle = card.querySelector('.advisor-photo-toggle');
    const panel = card.querySelector('.advisor-photo-panel');

    card.classList.add('is-expanded');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
    if (panel) {
      panel.setAttribute('aria-hidden', 'false');
      panel.querySelector('.advisor-photo-close')?.focus();
    }
    expandedCard = card;
  }

  let afterFilter = () => {};

  function applyFilter(filter) {
    track.querySelectorAll('.advisor-card').forEach((card) => {
      let show = false;
      if (filter === 'all') {
        show = true;
      } else if (isPage) {
        show = (card.dataset.agentType || '').toLowerCase() === filter;
      } else {
        const sports = (card.dataset.sport || '').toLowerCase().split(/\s+/).filter(Boolean);
        show = sports.includes(filter);
      }
      card.dataset.hidden = show ? 'false' : 'true';
      card.setAttribute('tabindex', show ? '0' : '-1');
      card.setAttribute('aria-hidden', show ? 'false' : 'true');
    });
    if (isPage) {
      // showcase swaps profile on filter — no collapse
    } else {
      closeExpanded();
    }
    afterFilter();
  }

  function renderDetailTags(items, container) {
    container.innerHTML = '';
    items.forEach((item) => {
      const tag = document.createElement('span');
      tag.className = 'leadership-detail-tag';
      tag.textContent = item;
      container.appendChild(tag);
    });
  }

  function renderDetailRoster(slugs, container) {
    container.innerHTML = '';
    slugs.forEach((slug) => {
      const athlete = ATHLETES[slug];
      if (!athlete) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'leadership-roster-link tab';
      btn.dataset.athlete = slug;
      btn.textContent = athlete.name;
      btn.setAttribute('aria-label', `View ${athlete.name} profile`);
      container.appendChild(btn);
    });
  }

  function updateLeadershipTabCounts() {
    if (!isPage) return;
    const totals = { all: 0, leadership: 0, senior: 0, agent: 0 };
    track.querySelectorAll('.advisor-card').forEach((card) => {
      totals.all += 1;
      const type = (card.dataset.agentType || '').toLowerCase();
      if (Object.prototype.hasOwnProperty.call(totals, type)) totals[type] += 1;
    });
    tabs.forEach((tab) => {
      const filter = tab.dataset.filter;
      const countEl = tab.querySelector('.count');
      if (!filter || !countEl || totals[filter] === undefined) return;
      countEl.textContent = String(totals[filter]);
      const labels = {
        all: 'All agents',
        leadership: 'Leadership',
        senior: 'Senior agents',
        agent: 'Agents',
      };
      tab.setAttribute('aria-label', `${labels[filter] || filter}, ${totals[filter]} shown`);
    });
  }

  if (isPage) {
    const detail = document.getElementById('leadership-detail');
    const $detailName = document.getElementById('leadership-detail-name');
    const $detailTitle = document.getElementById('leadership-detail-title');
    const $detailBio = document.getElementById('leadership-detail-bio');
    const $detailPhoto = document.getElementById('leadership-detail-photo');
    const $detailInitials = document.getElementById('leadership-detail-initials');
    const $detailDisciplines = document.getElementById('leadership-detail-disciplines');
    const $detailRegions = document.getElementById('leadership-detail-regions');
    const $detailRoster = document.getElementById('leadership-detail-roster');
    const filterClasses = ['is-filter-all', 'is-filter-leadership', 'is-filter-senior', 'is-filter-agent'];

    if (detail && $detailName && $detailTitle && $detailBio && $detailPhoto && $detailInitials && $detailDisciplines && $detailRegions && $detailRoster) {
    function populateDetail(card) {
      const id = card.dataset.advisor;
      const advisor = ADVISORS[id];
      if (!advisor || !detail || card.dataset.hidden === 'true') return false;

      $detailName.textContent = advisor.name;
      $detailTitle.textContent = advisor.title;
      $detailBio.textContent = advisor.bio || '';

      const cardPhoto = card.querySelector('.advisor-photo');
      if (cardPhoto && $detailPhoto) {
        $detailPhoto.className = 'leadership-detail-photo advisor-photo';
        cardPhoto.classList.forEach((cls) => {
          if (cls !== 'advisor-photo') $detailPhoto.classList.add(cls);
        });
      }
      if ($detailInitials) {
        $detailInitials.textContent = card.querySelector('.advisor-initials')?.textContent || '';
      }

      renderDetailTags(advisor.disciplines, $detailDisciplines);
      renderDetailTags(advisor.regions, $detailRegions);
      renderDetailRoster(advisor.athletes, $detailRoster);
      const rosterRow = $detailRoster.closest('.leadership-detail-row');
      if (rosterRow) rosterRow.hidden = !advisor.athletes.length;
      return true;
    }

    function setActiveCard(card) {
      track.querySelectorAll('.advisor-card').forEach((c) => {
        const on = Boolean(card) && c === card;
        c.classList.toggle('is-active', on);
        c.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      activeDetailCard = card || null;
    }

    function hideDetail() {
      setActiveCard(null);
      detail.classList.remove('is-active');
      detail.setAttribute('aria-hidden', 'true');
    }

    function showDetail(card) {
      if (!populateDetail(card)) return;
      setActiveCard(card);
      detail.classList.add('is-active');
      detail.setAttribute('aria-hidden', 'false');
    }

    function selectAgent(card) {
      if (!card || card.dataset.hidden === 'true') return;

      if (activeDetailCard === card) {
        hideDetail();
        card.focus();
        return;
      }

      showDetail(card);
    }

    hideDetailPanel = hideDetail;

    const detailClose = detail.querySelector('.leadership-detail-close');
    detailClose?.addEventListener('click', () => {
      const last = activeDetailCard;
      hideDetail();
      last?.focus();
    });

    function selectFirstVisible() {
      const visible = [...track.querySelectorAll('.advisor-card[data-hidden="false"]')];
      if (!visible.length) {
        hideDetail();
        return;
      }
      if (!detail.classList.contains('is-active')) return;

      const keepCurrent = activeDetailCard && activeDetailCard.dataset.hidden !== 'true';
      showDetail(keepCurrent ? activeDetailCard : visible[0]);
    }


    track.querySelectorAll('.advisor-card').forEach((card) => {
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-selected', 'false');
      card.setAttribute('aria-controls', 'leadership-detail');
      card.addEventListener('click', () => selectAgent(card));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectAgent(card);
        }
      });
    });
    }

    showcaseActiveFilter = (filter) => {
      filterClasses.forEach((cls) => track.classList.remove(cls));
      track.classList.add(`is-filter-${filter}`);
      selectFirstVisible();
    };

    track.classList.add('is-filter-all');
    applyFilter('all');
    updateLeadershipTabCounts();
  }

  track.querySelectorAll('.advisor-card').forEach((card) => {
    if (isPage) return;

    const toggle = card.querySelector('.advisor-photo-toggle');
    const closeBtn = card.querySelector('.advisor-photo-close');

    toggle?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (card.classList.contains('is-expanded')) {
        closeExpanded();
        toggle.focus();
      } else {
        openExpanded(card);
      }
    });

    closeBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      closeExpanded();
      toggle?.focus();
    });
  });

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('active', active);
        t.setAttribute('aria-pressed', String(active));
      });
      const filter = tab.dataset.filter || tab.textContent.trim().split(' ')[0].toLowerCase();
      applyFilter(filter);
      if (isPage) showcaseActiveFilter(filter);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (isPage) {
      if (activeDetailCard) {
        e.preventDefault();
        const last = activeDetailCard;
        hideDetailPanel();
        last.focus();
      }
      return;
    }
    if (expandedCard) {
      e.preventDefault();
      const toggle = expandedCard.querySelector('.advisor-photo-toggle');
      closeExpanded();
      toggle?.focus();
    }
  });

  if (!isPage) {
    track.querySelectorAll('.advisor-card').forEach((card) => { card.dataset.hidden = 'false'; });
  }

  if (isPage) return;

  const carousel = document.getElementById('leadership-carousel');
  const viewport = carousel?.querySelector('.leadership-viewport');
  const prev = document.getElementById('leadership-prev');
  const next = document.getElementById('leadership-next');
  const dots = document.getElementById('leadership-dots');
  if (!carousel || !viewport) return;

  let index = 0;

  function visibleCards() {
    return [...track.querySelectorAll('.advisor-card')].filter((c) => c.dataset.hidden !== 'true');
  }

  function stepPx() {
    const cards = visibleCards();
    if (!cards.length) return 0;
    const gap = parseFloat(getComputedStyle(track).gap) || 16;
    return cards[0].offsetWidth + gap;
  }

  function visibleCount() {
    const cards = visibleCards();
    const gap = parseFloat(getComputedStyle(track).gap) || 16;
    const cardW = cards[0]?.offsetWidth || 0;
    if (!cardW) return 1;
    const vw = viewport.clientWidth;
    return Math.max(1, Math.min(cards.length, Math.floor((vw + gap) / (cardW + gap))));
  }

  function maxIndex() {
    return Math.max(0, visibleCards().length - visibleCount());
  }

  function pageCount() {
    return maxIndex() + 1;
  }

  function renderDots() {
    if (!dots) return;
    const pages = pageCount();
    dots.hidden = pages <= 1;
    dots.innerHTML = '';
    for (let i = 0; i < pages; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'roster-dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Advisor group ${i + 1} of ${pages}`);
      dot.setAttribute('aria-selected', String(i === index));
      if (i === index) dot.classList.add('active');
      dot.addEventListener('click', () => {
        closeExpanded();
        index = i;
        update();
      });
      dots.appendChild(dot);
    }
  }

  function update() {
    const cards = visibleCards();
    const max = maxIndex();
    if (!cards.length) {
      track.style.transform = 'translateX(0)';
      if (prev) prev.disabled = true;
      if (next) next.disabled = true;
      return;
    }
    if (index > max) index = max;
    if (index < 0) index = 0;
    track.style.transform = `translateX(-${index * stepPx()}px)`;
    track.querySelectorAll('.advisor-card').forEach((card) => {
      card.classList.remove('is-active');
      card.removeAttribute('aria-selected');
    });
    const activeCard = cards[index];
    if (activeCard) {
      activeCard.classList.add('is-active');
      activeCard.setAttribute('aria-selected', 'true');
    }
    dots?.querySelectorAll('.roster-dot').forEach((dot, i) => {
      const active = i === index;
      dot.classList.toggle('active', active);
      dot.setAttribute('aria-selected', String(active));
    });
    if (prev) prev.disabled = index <= 0;
    if (next) next.disabled = index >= max;
  }

  afterFilter = () => {
    index = 0;
    renderDots();
    update();
  };

  prev?.addEventListener('click', () => {
    closeExpanded();
    index -= 1;
    update();
  });
  next?.addEventListener('click', () => {
    closeExpanded();
    index += 1;
    update();
  });
  window.addEventListener('resize', () => {
    const prevIndex = index;
    renderDots();
    index = Math.min(prevIndex, maxIndex());
    update();
  });

  renderDots();
  update();
})();


/* ------------------------------------------------------------
   6. SERVICES STACK — Square-style sticky scroll tabs
   ------------------------------------------------------------ */

(function ServicesStack() {
  const root = document.getElementById('services-stack');
  if (!root) return;

  const tabs = [...root.querySelectorAll('.svc-stack-tab')];
  const panels = [...root.querySelectorAll('.svc-stack-panel')];
  const COUNT = tabs.length;
  const mktCache = new Map();
  const mqMobile = window.matchMedia('(max-width: 980px)');

  let activeIndex = -1;
  let scrollLock = false;
  let mktTimers = [];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SWAP_IN_MS = 520;

  function mktMotionEnabled() {
    return false;
  }

  function clearMktTimers() {
    mktTimers.forEach((id) => clearInterval(id));
    mktTimers = [];
  }

  function setBarsInstant(mktRoot) {
    mktRoot.querySelectorAll('.mkt-bar-fill').forEach((bar) => {
      const target = bar.dataset.width;
      if (target) bar.style.setProperty('--bar-w', `${target}%`);
    });
  }

  function animateBars(mktRoot) {
    if (!mktMotionEnabled(mktRoot)) {
      setBarsInstant(mktRoot);
      return;
    }
    mktRoot.querySelectorAll('.mkt-bar-fill').forEach((bar, i) => {
      const target = bar.dataset.width;
      if (!target) return;
      bar.style.setProperty('--bar-w', '0%');
      requestAnimationFrame(() => {
        setTimeout(() => {
          bar.style.setProperty('--bar-w', `${target}%`);
        }, 150 + i * 100);
      });
    });
  }

  function animateRing(mktRoot) {
    const ring = mktRoot.querySelector('.mkt-ring');
    if (!ring) return;
    const fill = ring.querySelector('.mkt-ring-fill');
    const target = parseFloat(ring.dataset.pct || '0');
    const circumference = 188.5;
    const setOffset = (pct) => {
      const offset = circumference * (1 - pct / 100);
      ring.style.setProperty('--pct', String(pct));
      if (fill) fill.style.strokeDashoffset = String(offset);
    };

    if (!mktMotionEnabled(mktRoot)) {
      setOffset(target);
      ring.classList.add('is-ready');
      return;
    }

    ring.classList.remove('is-ready');
    setOffset(0);
    requestAnimationFrame(() => {
      setTimeout(() => {
        setOffset(target);
        ring.classList.add('is-ready');
      }, 220);
    });
  }

  function animateMetric(mktRoot) {
    const el = mktRoot.querySelector('.mkt-wealth-total, .mkt-perf-hero, .mkt-earn-total, .mkt-hero-metric strong');
    if (!el) return;
    const raw = el.textContent.replace(/[^0-9.]/g, '');
    const end = parseFloat(raw);
    if (!Number.isFinite(end)) return;
    const prefix = el.textContent.trim().startsWith('$') ? '$' : '';
    const suffix = el.textContent.trim().endsWith('%') ? '%' : '';
    const decimals = (raw.split('.')[1] || '').length;
    if (!mktMotionEnabled(mktRoot)) return;

    const duration = 900;
    const t0 = performance.now();

    function tick(now) {
      const t = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = end * eased;
      el.textContent = prefix + val.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }

    el.textContent = prefix + '0' + suffix;
    requestAnimationFrame(tick);
  }

  const DEAL_QUEUE = [
    {
      title: 'Marcus Lane',
      type: 'Apparel + camp appearances',
      offer: '$420K',
      term: '2 yr',
      status: 'Counter sent',
      feed: [
        { role: 'Agent', msg: 'Counter filed · apparel + 2 camp days' },
        { role: 'Brand', msg: 'Requested social deliverables breakdown' },
      ],
      agent: 'Luke Bramwell',
    },
    {
      title: 'Idris Vale',
      type: 'Transfer portal · Duke fit',
      offer: '$310K',
      term: '1 yr',
      status: 'In review',
      feed: [
        { role: 'Agent', msg: 'School fit memo sent to family' },
        { role: 'NCAA', msg: '14 days left in transfer window' },
      ],
      agent: 'Lenny Vasquez',
    },
    {
      title: 'Devon Park',
      type: 'HS commit · NIL package',
      offer: '$185K',
      term: '3 yr',
      status: 'Signed',
      feed: [
        { role: 'Agent', msg: 'Package locked · compliance filed' },
        { role: 'Brand', msg: 'Regional apparel deal executed' },
      ],
      agent: 'Luke Bramwell',
    },
  ];

  const PERF_PROFILES = [
    {
      label: 'Readiness score · Week 8',
      hero: '94%',
      delta: '+3% vs last week',
      panelLabel: 'Game day',
      alloc: [
        { label: 'Training', pct: 78, val: '78%' },
        { label: 'HRV', pct: 91, val: '91' },
        { label: 'Nutrition', pct: 88, val: '88%' },
      ],
      sessions: [
        { mark: 'TH', title: 'Field practice', sub: 'Thu · High load block', amt: '78%' },
        { mark: 'FR', title: 'Recovery protocol', sub: 'Fri · Pool + stretch', amt: 'Deload' },
        { mark: 'SA', title: 'Game day prep', sub: 'Sat · Walk-through', amt: 'Peak' },
      ],
      status: 'Cleared · Sat kickoff',
    },
    {
      label: 'Training load · Week 8',
      hero: '78%',
      delta: 'Deload week · trending down',
      panelLabel: 'Load outlook',
      alloc: [
        { label: 'Training', pct: 78, val: '78%' },
        { label: 'Load cap', pct: 62, val: '62%' },
        { label: 'Hydration', pct: 74, val: '74%' },
      ],
      sessions: [
        { mark: 'MO', title: 'Lower-body lift', sub: 'Mon · Volume day', amt: '72%' },
        { mark: 'WE', title: 'Position drills', sub: 'Wed · Moderate load', amt: '68%' },
        { mark: 'FR', title: 'Active recovery', sub: 'Fri · Deload block', amt: '45%' },
      ],
      status: 'Managed · Sat cleared',
    },
    {
      label: 'Recovery score · Week 8',
      hero: '91',
      delta: 'HRV optimal · sleep on track',
      panelLabel: 'Recovery window',
      alloc: [
        { label: 'HRV', pct: 91, val: '91' },
        { label: 'Sleep', pct: 86, val: '86%' },
        { label: 'Mobility', pct: 80, val: '80%' },
      ],
      sessions: [
        { mark: 'TU', title: 'Cold plunge', sub: 'Tue · Recovery suite', amt: 'Complete' },
        { mark: 'TH', title: 'Sports massage', sub: 'Thu · 60 min block', amt: 'Booked' },
        { mark: 'SA', title: 'Post-game reset', sub: 'Sat · Protocol ready', amt: 'Queued' },
      ],
      status: 'In range · cleared to play',
    },
  ];

  const TECH_PROFILES = [
    {
      label: 'Marcus Lane · portfolio',
      hero: '$847,500',
      delta: '+18.4% vs last month',
      panelLabel: 'Sync',
      allocHead: 'Revenue mix',
      alloc: [
        { label: 'NIL', pct: 55, val: '55%' },
        { label: 'Brand', pct: 30, val: '30%' },
        { label: 'Portal', pct: 15, val: '15%' },
      ],
      signals: [
        { mark: 'WR', title: 'P4 WR comps', sub: 'Similar production · reach', amt: '$720K' },
        { mark: '↑', title: 'Valuation trend', sub: '30-day rolling index', amt: '+18%' },
        { mark: '●', title: 'Deal pipeline', sub: '2 offers in review', amt: 'Active' },
      ],
      status: 'Live · updated 2m ago',
    },
    {
      label: 'Market demand index',
      hero: '84',
      delta: '↑ 12% apparel category',
      panelLabel: 'Signal',
      allocHead: 'Demand mix',
      alloc: [
        { label: 'Apparel', pct: 72, val: '72%' },
        { label: 'Social', pct: 84, val: '84%' },
        { label: 'Regional', pct: 61, val: '61%' },
      ],
      signals: [
        { mark: 'BR', title: 'Brand demand', sub: 'Apparel interest rising', amt: '↑ 12%' },
        { mark: 'IG', title: 'Social reach', sub: 'Engagement vs cohort', amt: 'Top 8%' },
        { mark: 'TX', title: 'Market heat', sub: 'Texas · SEC footprint', amt: 'High' },
      ],
      status: 'Demand up · apparel lead',
    },
    {
      label: 'Comparable athletes',
      hero: '$720K',
      delta: 'P4 WR avg · similar profile',
      panelLabel: 'Activity',
      allocHead: 'Comp spread',
      alloc: [
        { label: 'Floor', pct: 45, val: '45%' },
        { label: 'Median', pct: 68, val: '68%' },
        { label: 'Ceiling', pct: 92, val: '92%' },
      ],
      signals: [
        { mark: 'A1', title: 'Cohort median', sub: 'Production + social index', amt: '$680K' },
        { mark: 'A2', title: 'Portal watch', sub: '3 schools monitoring', amt: 'Active' },
        { mark: 'A3', title: 'Offer ceiling', sub: 'Modeled max next cycle', amt: '$1.1M' },
      ],
      status: '3 schools · monitoring film',
    },
  ];

  const WEALTH_STAGES = [
    {
      label: 'NIL portfolio value',
      total: '$847,500',
      delta: '+$131K this season',
      alloc: [
        { pct: 55, val: '55%' },
        { pct: 30, val: '30%' },
        { pct: 15, val: '15%' },
      ],
      activities: [
        { mark: 'NI', title: 'Apparel deal closed', sub: 'Regional brand · 2-yr term', amt: '+$420K' },
        { mark: 'CA', title: 'Camp appearances', sub: 'Summer schedule · 4 events', amt: '+$85K' },
        { mark: 'SO', title: 'Social campaign', sub: 'Deliverables on track', amt: '+$42K' },
      ],
      status: 'NIL rollover · reinvest after season',
    },
    {
      label: 'Draft signing value',
      total: '$2.1M',
      delta: 'Signing bonus · Round 1',
      alloc: [
        { pct: 45, val: '45%' },
        { pct: 35, val: '35%' },
        { pct: 20, val: '20%' },
      ],
      activities: [
        { mark: 'SG', title: 'Signing bonus received', sub: 'Draft day · wire posted', amt: '+$1.4M' },
        { mark: 'AG', title: 'Agent advisory fee', sub: 'Representation · settled', amt: '−$84K' },
        { mark: 'TR', title: 'Trust account opened', sub: 'Estate planning · initiated', amt: '$420K' },
      ],
      status: 'Pre-draft financial literacy · Q2',
    },
    {
      label: 'Pro career treasury',
      total: '$24.8M',
      delta: '+$2.1M since draft',
      alloc: [
        { pct: 40, val: '40%' },
        { pct: 35, val: '35%' },
        { pct: 25, val: '25%' },
      ],
      activities: [
        { mark: 'PR', title: 'Pro contract bonus', sub: 'Year 2 · performance tier', amt: '+$3.2M' },
        { mark: 'TR', title: 'Family trust funded', sub: 'Quarterly contribution', amt: '$8.7M' },
        { mark: 'RB', title: 'Portfolio rebalance', sub: 'Advisor review · scheduled', amt: 'Q2' },
      ],
      status: 'Wealth plan active · liquidity reserve funded',
    },
    {
      label: 'Legacy fund target',
      total: '$4.2M',
      delta: 'Family office · long-term',
      alloc: [
        { pct: 50, val: '50%' },
        { pct: 35, val: '35%' },
        { pct: 15, val: '15%' },
      ],
      activities: [
        { mark: 'LF', title: 'Legacy fund seeded', sub: 'Community impact · endowed', amt: '$1.2M' },
        { mark: 'PH', title: 'Philanthropy pledge', sub: 'Youth football · 5-yr', amt: '$800K' },
        { mark: 'OF', title: 'Family office setup', sub: 'Advisory board · forming', amt: 'Active' },
      ],
      status: 'Legacy planning · post-career runway',
    },
  ];

  function renderLedgerRows(list, rows, { active = 0 } = {}) {
    if (!list) return;
    list.innerHTML = rows.map((row, i) => (
      `<button type="button" class="mkt-school-row${i === active ? ' on' : ''}" data-row="${i}">`
      + `<span class="mkt-school-mark">${row.mark}</span>`
      + `<span class="mkt-school-copy"><strong>${row.title}</strong><span>${row.sub}</span></span>`
      + `<em class="mkt-school-amt${row.amt.startsWith('+') ? ' up' : ''}">${row.amt}</em>`
      + '</button>'
    )).join('');
  }

  function wireQueue(mktRoot) {
    const items = [...mktRoot.querySelectorAll('.mkt-queue-item')];
    const pane = mktRoot.querySelector('.mkt-deal-pane');
    if (!items.length || !pane) return;

    const $title = pane.querySelector('.mkt-deal-title');
    const $type = pane.querySelector('.mkt-deal-type');
    const $offer = pane.querySelector('.mkt-deal-offer');
    const $term = pane.querySelector('.mkt-deal-term');
    const $status = pane.querySelector('.mkt-deal-status');
    const $agent = pane.querySelector('.mkt-deal-agent-name');
    const $feed = pane.querySelector('.mkt-deal-feed');

    function renderFeed(feed) {
      if (!$feed) return;
      $feed.innerHTML = feed.map((line) => (
        `<div class="mkt-feed-line"><span>${line.role}</span>`
        + `<p class="mkt-feed-msg">${line.msg}</p></div>`
      )).join('');
    }

    function applyDeal(i) {
      const data = DEAL_QUEUE[i];
      if (!data) return;
      if ($title) $title.textContent = data.title;
      if ($type) $type.textContent = data.type;
      if ($offer) $offer.textContent = data.offer;
      if ($term) $term.textContent = data.term;
      if ($status) $status.textContent = data.status;
      if ($agent) $agent.textContent = data.agent;
      renderFeed(data.feed);
    }

    function setQueue(active) {
      const i = parseInt(active.dataset.q, 10);
      items.forEach((item) => item.classList.toggle('on', item === active));

      if (!mktMotionEnabled(mktRoot)) {
        applyDeal(i);
        return;
      }

      pane.classList.add('is-swapping');
      setTimeout(() => {
        applyDeal(i);
        pane.classList.remove('is-swapping');
      }, 200);
    }

    items.forEach((item) => item.addEventListener('click', () => setQueue(item)));
    applyDeal(parseInt(items.find((it) => it.classList.contains('on'))?.dataset.q || '0', 10));

    mktRoot._queueAuto = () => {
      if (!mktMotionEnabled(mktRoot)) return null;
      let auto = 0;
      return setInterval(() => {
        auto = (auto + 1) % items.length;
        setQueue(items[auto]);
      }, 3400);
    };
  }

  function wireKpi(mktRoot) {
    const tabs = [...mktRoot.querySelectorAll('.mkt-seg-tab[data-perf]')];
    if (!tabs.length) return;

    const $label = mktRoot.querySelector('.mkt-perf-label');
    const $hero = mktRoot.querySelector('.mkt-perf-hero');
    const $delta = mktRoot.querySelector('.mkt-perf-delta');
    const $panelLabel = mktRoot.querySelector('.mkt-perf-status > span');
    const $status = mktRoot.querySelector('.mkt-perf-status strong');
    const $a0 = mktRoot.querySelector('.mkt-perf-a0');
    const $a1 = mktRoot.querySelector('.mkt-perf-a1');
    const $a2 = mktRoot.querySelector('.mkt-perf-a2');
    const $list = mktRoot.querySelector('.mkt-perf-sessions');
    const amts = [$a0, $a1, $a2];
    const allocLabels = [...mktRoot.querySelectorAll('.mkt-alloc .mkt-alloc-row > span')];

    function applyProfile(i, { sessionActive = 0 } = {}) {
      const data = PERF_PROFILES[i];
      if (!data) return;
      if ($label) $label.textContent = data.label;
      if ($hero) $hero.textContent = data.hero;
      if ($delta) {
        $delta.textContent = data.delta;
        $delta.classList.toggle('is-neutral', !data.delta.startsWith('+'));
      }
      if ($panelLabel && data.panelLabel) $panelLabel.textContent = data.panelLabel;
      if ($status) $status.textContent = data.status;
      data.alloc.forEach((row, idx) => {
        if (allocLabels[idx]) allocLabels[idx].textContent = row.label;
        if (amts[idx]) amts[idx].textContent = row.val;
        const bar = mktRoot.querySelectorAll('.mkt-alloc .mkt-bar-fill')[idx];
        if (bar) bar.dataset.width = String(row.pct);
      });
      animateAllocBars(mktRoot, data.alloc);
      renderLedgerRows($list, data.sessions, { active: sessionActive });
    }

    if ($list && !$list.dataset.bound) {
      $list.addEventListener('click', (e) => {
        const row = e.target.closest('.mkt-school-row');
        if (!row || !$list.contains(row)) return;
        $list.querySelectorAll('.mkt-school-row').forEach((r) => r.classList.remove('on'));
        row.classList.add('on');
      });
      $list.dataset.bound = '1';
    }

    function setTab(active) {
      const i = parseInt(active.dataset.perf, 10);
      tabs.forEach((tab) => tab.classList.toggle('on', tab === active));
      if (mktMotionEnabled(mktRoot)) pulseBlock(mktRoot.querySelector('.mkt-perf-sessions'));
      applyProfile(i);
    }

    tabs.forEach((tab) => tab.addEventListener('click', () => setTab(tab)));
    applyProfile(0);

    mktRoot._perfAuto = () => {
      if (!mktMotionEnabled(mktRoot)) return null;
      let auto = 0;
      return setInterval(() => {
        auto = (auto + 1) % tabs.length;
        setTab(tabs[auto]);
      }, 3200);
    };
  }

  const EARNINGS_SCHOOLS = [
    {
      label: 'Texas · projected annual',
      total: '$1.2M',
      delta: '+$310K vs next offer',
      status: 'Texas lead · offer sheet under review',
      alloc: [
        { key: 'collective', pct: 60, amt: '$720K' },
        { key: 'roster', pct: 23, amt: '$280K' },
        { key: 'nil', pct: 17, amt: '$200K' },
      ],
    },
    {
      label: 'Oregon · projected annual',
      total: '$890K',
      delta: '+$250K vs next offer',
      status: 'Oregon package · collective terms pending',
      alloc: [
        { key: 'collective', pct: 58, amt: '$520K' },
        { key: 'roster', pct: 25, amt: '$220K' },
        { key: 'nil', pct: 17, amt: '$150K' },
      ],
    },
    {
      label: 'Duke · projected annual',
      total: '$640K',
      delta: 'Baseline market comp',
      status: 'Duke offer · brand upside modeled',
      alloc: [
        { key: 'collective', pct: 59, amt: '$380K' },
        { key: 'roster', pct: 25, amt: '$160K' },
        { key: 'nil', pct: 16, amt: '$100K' },
      ],
    },
  ];

  function animateAllocBars(mktRoot, rows) {
    const bars = mktRoot.querySelectorAll('.mkt-alloc .mkt-bar-fill');
    bars.forEach((bar, i) => {
      const target = rows[i]?.pct;
      if (!target) return;
      if (mktMotionEnabled(mktRoot)) {
        bar.style.setProperty('--bar-w', '0%');
        requestAnimationFrame(() => {
          setTimeout(() => bar.style.setProperty('--bar-w', `${target}%`), 80 + i * 60);
        });
      } else {
        bar.style.setProperty('--bar-w', `${target}%`);
      }
    });
  }

  function wireOffers(mktRoot) {
    const offers = [...mktRoot.querySelectorAll('.mkt-school-row')];
    if (!offers.length) return;

    const $label = mktRoot.querySelector('.mkt-earn-label');
    const $total = mktRoot.querySelector('.mkt-earn-total');
    const $delta = mktRoot.querySelector('.mkt-earn-delta');
    const $status = mktRoot.querySelector('.mkt-earn-status strong');
    const $collective = mktRoot.querySelector('.mkt-earn-collective');
    const $roster = mktRoot.querySelector('.mkt-earn-roster');
    const $nil = mktRoot.querySelector('.mkt-earn-nil');

    function applySchool(i) {
      const data = EARNINGS_SCHOOLS[i];
      if (!data) return;
      if ($label) $label.textContent = data.label;
      if ($total) $total.textContent = data.total;
      if ($delta) {
        $delta.textContent = data.delta;
        $delta.classList.toggle('is-neutral', !data.delta.startsWith('+'));
      }
      if ($status) $status.textContent = data.status;
      if ($collective) $collective.textContent = data.alloc[0].amt;
      if ($roster) $roster.textContent = data.alloc[1].amt;
      if ($nil) $nil.textContent = data.alloc[2].amt;
      data.alloc.forEach((row, idx) => {
        const bar = mktRoot.querySelectorAll('.mkt-alloc .mkt-bar-fill')[idx];
        if (bar) bar.dataset.width = String(row.pct);
      });
      animateAllocBars(mktRoot, data.alloc);
    }

    offers.forEach((offer) => {
      offer.addEventListener('click', () => {
        offers.forEach((o) => o.classList.remove('on'));
        offer.classList.add('on');
        applySchool(parseInt(offer.dataset.offer, 10));
      });
    });

    applySchool(0);

    mktRoot._offersAuto = () => {
      if (!mktMotionEnabled(mktRoot)) return null;
      let auto = 0;
      return setInterval(() => {
        auto = (auto + 1) % offers.length;
        offers[auto].click();
      }, 3200);
    };
  }

  const LIFESTYLE_STEPS = [
    {
      icon: 'announcement',
      route: 'ATL · campus',
      head: 'Thu media day · Press block 10 AM',
      badge: 'On site',
      log: [
        { key: 'Studio', val: 'Studio B · mic check 9:45 AM' },
        { key: 'Wardrobe', val: 'Team gear + press kit staged' },
        { key: 'Comms', val: 'Talking points cleared · 12 min slot' },
      ],
    },
    {
      icon: 'camera',
      route: 'ATL → NYC',
      head: 'Fri brand shoot · Car service 2:30 PM',
      badge: 'Confirmed',
      log: [
        { key: 'Car', val: 'Black SUV · Pickup 2:15 PM at hotel' },
        { key: 'Hotel', val: 'Soho House · 2 nights · late checkout Sun' },
        { key: 'Wardrobe', val: 'Stylist on-site 1 PM · 3 looks prepped' },
      ],
    },
    {
      icon: 'sun',
      route: 'NYC · recovery',
      head: 'Sat recovery block · Facility 9 AM',
      badge: 'Scheduled',
      log: [
        { key: 'Facility', val: 'Equinox Hudson Yards · 90 min block' },
        { key: 'Nutrition', val: 'Macro protocol · meals pre-ordered' },
        { key: 'Sleep', val: 'Checkout moved · quiet hours flagged' },
      ],
    },
    {
      icon: 'plane',
      route: 'NYC → ATL',
      head: 'Sun return travel · Flight 6 PM',
      badge: 'Ticketed',
      log: [
        { key: 'Car', val: 'SUV · Pickup 4:15 PM at hotel' },
        { key: 'Flight', val: 'Delta 1842 · JFK → ATL · seat 2A' },
        { key: 'Checkout', val: 'Soho House · 11 AM · bags to car' },
      ],
    },
  ];

  function wireSchedule(mktRoot) {
    const days = [...mktRoot.querySelectorAll('.mkt-sched-item')];
    const concierge = [...mktRoot.querySelectorAll('.mkt-concierge-item')];
    const chip = mktRoot.querySelector('.mkt-travel-chip');
    const $route = chip?.querySelector('.mkt-travel-route');
    const $head = chip?.querySelector('.mkt-travel-head');
    const $badge = chip?.querySelector('.mkt-travel-badge');
    const $ico = chip?.querySelector('.mkt-travel-ico');
    const $log = chip?.querySelector('.mkt-travel-log');
    if (!days.length) return;

    function applyChip(step) {
      const data = LIFESTYLE_STEPS[step];
      if (!data || !chip) return;
      if ($route) $route.textContent = data.route;
      if ($head) $head.textContent = data.head;
      if ($badge) $badge.textContent = data.badge;
      if ($ico) $ico.dataset.swIcon = data.icon;
      window.SW_ICONS?.hydrate(chip);
      if ($log) {
        $log.innerHTML = data.log.map((row) => (
          `<li><strong class="mkt-travel-log-key">${row.key}</strong>`
          + `<span class="mkt-travel-log-val">${row.val}</span></li>`
        )).join('');
      }
    }

    function setDay(active, { animate = true } = {}) {
      const step = parseInt(active.dataset.day, 10);
      const svc = active.dataset.svc;
      const schedule = mktRoot.querySelector('.mkt-schedule');
      if (animate) pulseBlock(schedule);

      days.forEach((day) => {
        const n = parseInt(day.dataset.day, 10);
        day.classList.toggle('on', n === step);
        day.classList.toggle('done', n < step);
      });

      if (concierge.length && svc) {
        concierge.forEach((item) => {
          item.classList.toggle('on', item.dataset.svc === svc);
        });
      }

      applyChip(step);
    }

    days.forEach((day) => day.addEventListener('click', () => setDay(day)));
    concierge.forEach((item) => {
      item.addEventListener('click', () => {
        const match = days.find((d) => d.dataset.svc === item.dataset.svc);
        if (match) setDay(match);
      });
    });

    const initial = days.find((d) => d.classList.contains('on')) || days[0];
    setDay(initial, { animate: false });

    mktRoot._scheduleAuto = () => {
      if (!mktMotionEnabled(mktRoot)) return null;
      let auto = 1;
      return setInterval(() => {
        auto = (auto + 1) % days.length;
        setDay(days[auto], { animate: false });
      }, 2600);
    };
  }

  function wireMilestones(mktRoot) {
    const tabs = [...mktRoot.querySelectorAll('.mkt-seg-tab[data-stage]')];
    if (!tabs.length) return;

    const $label = mktRoot.querySelector('.mkt-wealth-label');
    const $total = mktRoot.querySelector('.mkt-wealth-total');
    const $delta = mktRoot.querySelector('.mkt-wealth-delta');
    const $status = mktRoot.querySelector('.mkt-wealth-status strong');
    const $a0 = mktRoot.querySelector('.mkt-wealth-a0');
    const $a1 = mktRoot.querySelector('.mkt-wealth-a1');
    const $a2 = mktRoot.querySelector('.mkt-wealth-a2');
    const $list = mktRoot.querySelector('.mkt-wealth-feed');
    const amts = [$a0, $a1, $a2];

    function setStageState(step) {
      tabs.forEach((tab) => {
        const n = parseInt(tab.dataset.stage, 10);
        tab.classList.toggle('on', n === step);
        tab.classList.toggle('done', n < step);
      });
    }

    function applyStage(i, { activityActive = 0 } = {}) {
      const data = WEALTH_STAGES[i];
      if (!data) return;
      if ($label) $label.textContent = data.label;
      if ($total) $total.textContent = data.total;
      if ($delta) {
        $delta.textContent = data.delta;
        $delta.classList.toggle('is-neutral', !data.delta.startsWith('+'));
      }
      if ($status) $status.textContent = data.status;
      data.alloc.forEach((row, idx) => {
        if (amts[idx]) amts[idx].textContent = row.val;
        const bar = mktRoot.querySelectorAll('.mkt-alloc .mkt-bar-fill')[idx];
        if (bar) bar.dataset.width = String(row.pct);
      });
      animateAllocBars(mktRoot, data.alloc);
      renderLedgerRows($list, data.activities, { active: activityActive });
      setStageState(i);
    }

    if ($list && !$list.dataset.bound) {
      $list.addEventListener('click', (e) => {
        const row = e.target.closest('.mkt-school-row');
        if (!row || !$list.contains(row)) return;
        $list.querySelectorAll('.mkt-school-row').forEach((r) => r.classList.remove('on'));
        row.classList.add('on');
      });
      $list.dataset.bound = '1';
    }

    function setStage(active) {
      const i = parseInt(active.dataset.stage, 10);
      if (mktMotionEnabled(mktRoot)) pulseBlock(mktRoot.querySelector('.mkt-wealth-feed'));
      applyStage(i);
    }

    tabs.forEach((tab) => tab.addEventListener('click', () => setStage(tab)));
    applyStage(2);

    mktRoot._mileAuto = () => {
      if (!mktMotionEnabled(mktRoot)) return null;
      let auto = 0;
      return setInterval(() => {
        auto = (auto + 1) % tabs.length;
        setStage(tabs[auto]);
      }, 3200);
    };
  }

  function wireTech(mktRoot) {
    const tabs = [...mktRoot.querySelectorAll('.mkt-seg-tab[data-tech]')];
    if (!tabs.length) return;

    const $label = mktRoot.querySelector('.mkt-tech-label');
    const $hero = mktRoot.querySelector('.mkt-tech-hero');
    const $delta = mktRoot.querySelector('.mkt-tech-delta');
    const $allocHead = mktRoot.querySelector('.mkt-tech-alloc-head');
    const $panelLabel = mktRoot.querySelector('.mkt-tech-status > span');
    const $status = mktRoot.querySelector('.mkt-tech-status strong');
    const $a0 = mktRoot.querySelector('.mkt-tech-a0');
    const $a1 = mktRoot.querySelector('.mkt-tech-a1');
    const $a2 = mktRoot.querySelector('.mkt-tech-a2');
    const $list = mktRoot.querySelector('.mkt-tech-feed');
    const amts = [$a0, $a1, $a2];
    const allocLabels = [...mktRoot.querySelectorAll('.mkt-alloc .mkt-alloc-row > span')];

    function applyProfile(i, { signalActive = 0 } = {}) {
      const data = TECH_PROFILES[i];
      if (!data) return;
      if ($label) $label.textContent = data.label;
      if ($hero) $hero.textContent = data.hero;
      if ($delta) {
        $delta.textContent = data.delta;
        $delta.classList.toggle('is-neutral', !data.delta.startsWith('+') && !data.delta.startsWith('↑'));
      }
      if ($allocHead) $allocHead.textContent = data.allocHead;
      if ($panelLabel && data.panelLabel) $panelLabel.textContent = data.panelLabel;
      if ($status) $status.textContent = data.status;
      data.alloc.forEach((row, idx) => {
        if (allocLabels[idx]) allocLabels[idx].textContent = row.label;
        if (amts[idx]) amts[idx].textContent = row.val;
        const bar = mktRoot.querySelectorAll('.mkt-alloc .mkt-bar-fill')[idx];
        if (bar) bar.dataset.width = String(row.pct);
      });
      animateAllocBars(mktRoot, data.alloc);
      renderLedgerRows($list, data.signals, { active: signalActive });
    }

    if ($list && !$list.dataset.bound) {
      $list.addEventListener('click', (e) => {
        const row = e.target.closest('.mkt-school-row');
        if (!row || !$list.contains(row)) return;
        $list.querySelectorAll('.mkt-school-row').forEach((r) => r.classList.remove('on'));
        row.classList.add('on');
      });
      $list.dataset.bound = '1';
    }

    function setTab(active) {
      const i = parseInt(active.dataset.tech, 10);
      tabs.forEach((tab) => tab.classList.toggle('on', tab === active));
      applyProfile(i);
    }

    tabs.forEach((tab) => tab.addEventListener('click', () => setTab(tab)));
    applyProfile(0);

    mktRoot._techAuto = () => {
      if (!mktMotionEnabled(mktRoot)) return null;
      let auto = 0;
      return setInterval(() => {
        auto = (auto + 1) % tabs.length;
        setTab(tabs[auto]);
      }, 3200);
    };
  }

  function wirePipeline(mktRoot) {
    const stages = [...mktRoot.querySelectorAll('.mkt-stage')];
    const detail = mktRoot.querySelector('.mkt-pipeline-detail');
    if (!stages.length || !detail) return;

    const $focusAv = detail.querySelector('.mkt-pipeline-av');
    const $focusSub = detail.querySelector('.mkt-pipeline-sub');
    const $focusBadge = detail.querySelector('.mkt-pipeline-badge');
    const $rowAv = detail.querySelector('.mkt-pipeline-row-av');
    const $rowName = detail.querySelector('.mkt-pipeline-row-name');
    const $rowSub = detail.querySelector('.mkt-pipeline-row-sub');
    const $rowBadge = detail.querySelector('.mkt-pipeline-row-badge');
    const $panelLabel = detail.querySelector('.mkt-pipeline-panel-label');
    const $panelValue = detail.querySelector('.mkt-pipeline-panel-value');

    function applyContent(step) {
      const data = PIPELINE_STEPS[step];
      if (!data) return;

      if ($focusSub) $focusSub.textContent = data.focus.sub;
      if ($focusAv) $focusAv.textContent = data.focus.initials;
      if ($focusBadge) {
        $focusBadge.textContent = data.focus.badge;
        $focusBadge.classList.toggle('muted', data.focus.muted);
      }
      if ($rowAv) {
        $rowAv.textContent = data.row.initials;
        $rowAv.classList.toggle('bb', data.row.basketball);
      }
      if ($rowName) $rowName.textContent = data.row.name;
      if ($rowSub) $rowSub.textContent = data.row.sub;
      if ($rowBadge) {
        $rowBadge.textContent = data.row.badge;
        $rowBadge.classList.toggle('muted', data.row.muted);
      }
      if ($panelLabel) $panelLabel.textContent = data.panel.label;
      if ($panelValue) $panelValue.textContent = data.panel.value;
    }

    function setStage(active) {
      const step = parseInt(active.dataset.step, 10);
      stages.forEach((stage) => {
        const n = parseInt(stage.dataset.step, 10);
        stage.classList.toggle('on', n === step);
        stage.classList.toggle('done', n < step);
      });

      if (!mktMotionEnabled(mktRoot)) {
        applyContent(step);
        return;
      }

      detail.classList.add('is-swapping');
      setTimeout(() => {
        applyContent(step);
        detail.classList.remove('is-swapping');
        detail.classList.add('is-swapped-in');
        setTimeout(() => detail.classList.remove('is-swapped-in'), SWAP_IN_MS);
      }, 220);
    }

    stages.forEach((stage) => {
      stage.addEventListener('click', () => setStage(stage));
    });

    setStage(stages.find((s) => s.classList.contains('on')) || stages[0]);

    mktRoot._pipelineAuto = () => {
      if (!mktMotionEnabled(mktRoot)) return null;
      let auto = 0;
      return setInterval(() => {
        auto = (auto + 1) % stages.length;
        setStage(stages[auto]);
      }, 3200);
    };
  }

  function pulseBlock(el) {
    const mkt = el?.closest('.mkt');
    if (!el || !mktMotionEnabled(mkt)) return;
    el.classList.add('is-swapping');
    setTimeout(() => el.classList.remove('is-swapping'), 240);
  }

  function wireChecklist(mktRoot) {
    const checks = [...mktRoot.querySelectorAll('.mkt-check')];
    const list = mktRoot.querySelector('.mkt-checklist');
    checks.forEach((item) => {
      item.addEventListener('click', () => {
        pulseBlock(list);
        checks.forEach((c) => c.classList.remove('on'));
        item.classList.add('on');
      });
    });
  }

  function wireTimeline(mktRoot) {
    const days = [...mktRoot.querySelectorAll('.mkt-tl-item')];
    if (!days.length) return;

    function setDay(active, { animate = true } = {}) {
      const step = parseInt(active.dataset.day, 10);
      const timeline = mktRoot.querySelector('.mkt-timeline');
      const list = mktRoot.querySelector('.mkt-checklist');
      if (animate) {
        pulseBlock(timeline);
        pulseBlock(list);
      }

      days.forEach((day) => {
        const n = parseInt(day.dataset.day, 10);
        day.classList.toggle('on', n === step);
        day.classList.toggle('done', n < step);
      });

      const checks = mktRoot.querySelectorAll('.mkt-check');
      checks.forEach((check, i) => {
        const day = days[i];
        if (!day) return;
        const n = parseInt(day.dataset.day, 10);
        check.classList.toggle('on', n === step);
        check.classList.toggle('done', n < step);
      });
    }

    days.forEach((day) => {
      day.addEventListener('click', () => setDay(day));
    });

    mktRoot._timelineAuto = () => {
      if (!mktMotionEnabled(mktRoot)) return null;
      let auto = 1;
      return setInterval(() => {
        auto = (auto + 1) % days.length;
        setDay(days[auto], { animate: false });
      }, 2400);
    };
  }

  function startMktAuto(mktRoot) {
    if (!mktRoot || !mktMotionEnabled(mktRoot)) return;
    ['_queueAuto', '_pipelineAuto', '_offersAuto', '_scheduleAuto', '_timelineAuto', '_mileAuto', '_perfAuto', '_techAuto'].forEach((key) => {
      if (typeof mktRoot[key] === 'function') {
        const id = mktRoot[key]();
        if (id) mktTimers.push(id);
      }
    });
  }

  function wireCompRows(mktRoot) {
    const rows = [...mktRoot.querySelectorAll('.mkt-comp-row')];
    rows.forEach((row) => {
      row.addEventListener('mouseenter', () => {
        rows.forEach((r) => r.classList.remove('hi'));
        row.classList.add('hi');
      });
    });
    const wrap = mktRoot.querySelector('.mkt-comp:not(.mkt-comp-tight)');
    if (wrap) {
      wrap.addEventListener('mouseleave', () => {
        rows.forEach((r, i) => r.classList.toggle('hi', i === 0));
      });
    }
  }

  function bootMktVisual(mktRoot, { wire = true } = {}) {
    if (!mktRoot) return;
    animateBars(mktRoot);
    animateRing(mktRoot);
    animateMetric(mktRoot);
    if (wire && !mktRoot.dataset.wired) {
      wireQueue(mktRoot);
      wireKpi(mktRoot);
      wireOffers(mktRoot);
      wireSchedule(mktRoot);
      wireMilestones(mktRoot);
      wireTech(mktRoot);
      wirePipeline(mktRoot);
      wireChecklist(mktRoot);
      wireTimeline(mktRoot);
      wireCompRows(mktRoot);
      mktRoot.dataset.wired = '1';
    }
    startMktAuto(mktRoot);
  }

  function playMktEntrance(mktRoot) {
    if (!mktRoot) return;
    if (!mktMotionEnabled(mktRoot)) {
      mktRoot.classList.add('is-ready');
      mktRoot.classList.remove('is-entering');
      return;
    }

    mktRoot.classList.remove('is-ready');
    mktRoot.classList.add('is-entering');
    requestAnimationFrame(() => {
      mktRoot.classList.add('is-ready');
      setTimeout(() => mktRoot.classList.remove('is-entering'), SWAP_IN_MS + 120);
    });
  }

  function initMktVisual(mktRoot, { entering = true } = {}) {
    if (!mktRoot) return;
    bootMktVisual(mktRoot);
    if (entering && mktMotionEnabled(mktRoot)) {
      playMktEntrance(mktRoot);
    } else {
      mktRoot.classList.add('is-ready');
      mktRoot.classList.remove('is-entering');
    }
  }

  function getMkt(i) {
    if (mktCache.has(i)) return mktCache.get(i);
    const tpl = document.getElementById(`svc-vis-${i}`);
    if (!tpl) return null;
    const frag = tpl.content.cloneNode(true);
    const mkt = frag.querySelector('.mkt');
    if (mkt) mktCache.set(i, mkt);
    return mkt;
  }

  function mountMkt(i, slot) {
    if (!slot) return null;
    const existing = slot.querySelector('.mkt');
    if (existing) return existing;
    const mkt = getMkt(i);
    if (!mkt) return null;
    slot.appendChild(mkt);
    window.SW_ICONS?.hydrate(slot);
    return mkt;
  }

  function segmentFromScroll() {
    const scrollable = root.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return { index: 0, frac: 0 };
    const progress = Math.max(0, Math.min(1, -root.getBoundingClientRect().top / scrollable));
    const scaled = progress * COUNT;
    const index = Math.min(COUNT - 1, Math.floor(scaled));
    const frac = scaled - index;
    return { index, frac };
  }

  function scrollToIndex(i) {
    if (mqMobile.matches) return;
    const scrollable = root.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return;

    const sectionTop = window.scrollY + root.getBoundingClientRect().top;
    const target = sectionTop + scrollable * ((i + 0.5) / COUNT);

    scrollLock = true;
    window.scrollTo({ top: target, behavior: reducedMotion ? 'auto' : 'smooth' });
    setTimeout(() => { scrollLock = false; }, reducedMotion ? 0 : 650);
  }

  function indexFromScroll() {
    return segmentFromScroll().index;
  }

  function setActive(i, { fromScroll = false, animate = true } = {}) {
    if (i < 0 || i >= COUNT || i === activeIndex) return;

    activeIndex = i;
    clearMktTimers();
    root.classList.toggle('svc-stack-motion', !reducedMotion);

    tabs.forEach((tab, idx) => {
      const on = idx === i;
      tab.classList.toggle('is-active', on);
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
      const toggle = tab.querySelector('.svc-stack-tab-toggle');
      if (toggle) toggle.textContent = on ? '−' : '+';
    });

    if (!mqMobile.matches) panels[i].hidden = false;

    panels.forEach((panel, idx) => {
      const on = idx === i;
      panel.classList.toggle('is-active', on);
      if (mqMobile.matches) {
        panel.hidden = !on;
        panel.removeAttribute('aria-hidden');
      } else {
        panel.hidden = false;
        panel.setAttribute('aria-hidden', on ? 'false' : 'true');
      }
    });

    const slot = panels[i]?.querySelector('.svc-stack-visual');
    const mkt = mountMkt(i, slot);
    if (mkt) {
      const motion = animate && mktMotionEnabled(mkt);
      if (!mkt.dataset.booted) {
        initMktVisual(mkt, { entering: motion });
        mkt.dataset.booted = '1';
      } else {
        bootMktVisual(mkt, { wire: false });
        if (motion) playMktEntrance(mkt);
        else {
          mkt.classList.add('is-ready');
          mkt.classList.remove('is-entering');
        }
      }
    }

    if (!fromScroll) {
      scrollToIndex(i);
      if (mqMobile.matches) {
        requestAnimationFrame(() => {
          root.querySelector('.svc-stack-panels')?.scrollIntoView({
            behavior: reducedMotion ? 'auto' : 'smooth',
            block: 'start',
          });
        });
      }
    }
  }

  let scrollRaf = 0;

  function onScroll() {
    if (mqMobile.matches || scrollLock) return;
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(() => {
      scrollRaf = 0;
      const i = indexFromScroll();
      if (i !== activeIndex) setActive(i, { fromScroll: true, animate: false });
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => setActive(parseInt(tab.dataset.i, 10)));
  });

  const inViewObserver = new IntersectionObserver(
    ([entry]) => {
      root.classList.toggle('svc-stack-inview', entry.isIntersecting);
    },
    { rootMargin: '120px 0px' }
  );
  inViewObserver.observe(root);

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    if (mqMobile.matches || scrollLock) return;
    onScroll();
  });

  setActive(0, { animate: false });
})();


/* ------------------------------------------------------------
   6. TRANSFER LIVE — rolling timestamp
   ------------------------------------------------------------ */

(function TransferLive() {
  const el = document.getElementById('transfer-updated');
  if (!el) return;

  let seconds = 0;
  setInterval(() => {
    seconds += 12;
    if (seconds < 60) {
      el.textContent = `Updated ${seconds}s ago`;
    } else {
      el.textContent = `Updated ${Math.floor(seconds / 60)}m ago`;
    }
  }, 12000);
})();


/* ------------------------------------------------------------
   7. MOBILE NAV — Origin-style drawer
   ------------------------------------------------------------ */

(function MobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const drawer = document.getElementById('nav-drawer');
  const scrim = document.querySelector('.nav-scrim');
  if (!toggle || !drawer) return;

  const drawerGroups = [...drawer.querySelectorAll('.nav-drawer-group')];
  const mq = window.matchMedia('(max-width: 980px)');

  function closeAllDrawerSubs() {
    drawerGroups.forEach((group) => {
      const trigger = group.querySelector('.nav-drawer-trigger');
      const sub = group.querySelector('.nav-drawer-sub');
      if (!trigger || !sub) return;
      trigger.setAttribute('aria-expanded', 'false');
      sub.hidden = true;
      group.classList.remove('is-open');
    });
  }

  function setOpen(open) {
    if (!mq.matches) {
      document.body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
      drawer.setAttribute('inert', '');
      if (scrim) {
        scrim.hidden = true;
        scrim.setAttribute('aria-hidden', 'true');
      }
      return;
    }

    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    drawer.setAttribute('aria-hidden', String(!open));

    if (open) {
      drawer.removeAttribute('inert');
    } else {
      drawer.setAttribute('inert', '');
      closeAllDrawerSubs();
    }

    if (scrim) {
      scrim.hidden = !open;
      scrim.setAttribute('aria-hidden', String(!open));
    }
  }

  toggle.addEventListener('click', () => {
    setOpen(!document.body.classList.contains('nav-open'));
  });

  scrim?.addEventListener('click', () => setOpen(false));

  drawer.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  drawerGroups.forEach((group) => {
    const trigger = group.querySelector('.nav-drawer-trigger');
    const sub = group.querySelector('.nav-drawer-sub');
    if (!trigger || !sub) return;

    trigger.addEventListener('click', () => {
      const open = trigger.getAttribute('aria-expanded') !== 'true';
      closeAllDrawerSubs();
      if (open) {
        trigger.setAttribute('aria-expanded', 'true');
        sub.hidden = false;
        group.classList.add('is-open');
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
      setOpen(false);
      toggle.focus();
    }
  });

  mq.addEventListener('change', () => setOpen(false));
})();


/* ------------------------------------------------------------
   8. NAV DROPDOWN — keyboard accessibility
   ------------------------------------------------------------ */

(function NavDropdown() {
  const dropdowns = [...document.querySelectorAll('.nav-dropdown')];
  if (!dropdowns.length) return;

  function dropdownTrigger(dropdown) {
    return dropdown.querySelector('.nav-dropdown-toggle') || dropdown.querySelector(':scope > button');
  }

  function closeAll() {
    dropdowns.forEach((dropdown) => {
      const btn = dropdownTrigger(dropdown);
      const menu = dropdown.querySelector('.nav-submenu');
      if (!btn || !menu) return;
      menu.style.display = '';
      btn.setAttribute('aria-expanded', 'false');
    });
  }

  dropdowns.forEach((dropdown) => {
    const btn = dropdownTrigger(dropdown);
    const menu = dropdown.querySelector('.nav-submenu');
    if (!btn || !menu) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = menu.style.display === 'block';
      closeAll();
      if (!open) {
        menu.style.display = 'block';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (e.target.closest('.nav-submenu a')) return;
    closeAll();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
  });
})();


/* ------------------------------------------------------------
   8. HERO VIDEO — respect reduced motion
   ------------------------------------------------------------ */

(function HeroVideo() {
  const video = document.getElementById('hero-video');
  if (!video) return;

  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');

  function sync() {
    if (mq.matches) {
      video.pause();
      video.removeAttribute('autoplay');
    } else {
      video.setAttribute('autoplay', '');
      video.play().catch(() => {});
    }
  }

  mq.addEventListener('change', sync);
  sync();
})();


/* ------------------------------------------------------------
   9. ATHLETE MAGAZINE PROFILE PAGE
   ------------------------------------------------------------ */

(function AthleteProfilePage() {
  const root = document.getElementById('athlete-profile');
  if (!root) return;

  const empty = document.getElementById('athlete-profile-empty');

  function profileKey() {
    const params = new URLSearchParams(location.search);
    const fromQuery = params.get('athlete');
    if (fromQuery) return fromQuery;
    const fromHash = location.hash.replace(/^#/, '');
    return fromHash || '';
  }

  function splitBio(bio) {
    if (!bio) return { lead: '', body: '' };
    const match = bio.match(/^(.+?[.!?])(?:\s+)([\s\S]+)$/);
    if (!match) return { lead: bio, body: '' };
    return { lead: match[1].trim(), body: match[2].trim() };
  }

  function renderMeta(label, value) {
    if (!value) return '';
    return `<dt>${label}</dt><dd>${value}</dd>`;
  }

  function render(key) {
    const a = ATHLETES[key];
    if (!a) {
      root.hidden = true;
      if (empty) empty.hidden = false;
      return;
    }

    const bio = a.bio || `${a.name} is represented by Second Wind Pro for athlete-first NIL partnerships.`;
    const { lead, body } = splitBio(bio);
    const sport = a.basketball ? 'Basketball' : 'Football';

    document.title = `${a.name} — Second Wind Pro`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', `${a.name} — ${a.athleticLevel || a.position}. ${lead}`);

    const photo = document.getElementById('athlete-magazine-photo');
    if (photo) {
      photo.textContent = a.photo;
      photo.className = 'athlete-magazine-photo' + (a.basketball ? ' basketball' : '');
    }

    const sportEl = document.getElementById('athlete-magazine-sport');
    if (sportEl) sportEl.textContent = sport;

    const rankEl = document.getElementById('athlete-magazine-rank');
    if (rankEl) rankEl.textContent = a.athleticLevel || '';

    const nameEl = document.getElementById('athlete-magazine-name');
    if (nameEl) nameEl.textContent = a.name;

    const posEl = document.getElementById('athlete-magazine-position');
    if (posEl) posEl.textContent = a.position || '';

    const leadEl = document.getElementById('athlete-magazine-lead');
    if (leadEl) leadEl.textContent = lead;

    const pullEl = document.getElementById('athlete-magazine-pull');
    if (pullEl) {
      pullEl.textContent = a.presentability ? `“${a.presentability}”` : '';
    }

    const copyEl = document.getElementById('athlete-magazine-copy');
    if (copyEl) {
      const paragraphs = [];
      if (body) paragraphs.push(`<p>${body}</p>`);
      if (a.hometown || a.university) {
        paragraphs.push(
          `<p>Based in ${a.hometown || 'the United States'}, ${a.name.split(' ')[0]} is closely tied to ${a.university || a.to?.name || 'a top collegiate program'}—a footprint brands use for regional activations and campus-adjacent storytelling.</p>`
        );
      }
      copyEl.innerHTML = paragraphs.join('');
    }

    const accEl = document.getElementById('athlete-magazine-accomplishments');
    if (accEl) {
      const items = a.accomplishments?.length
        ? a.accomplishments
        : ['Verified athletic profile available on request'];
      accEl.innerHTML = items.map((item) => `<li>${item}</li>`).join('');
    }

    const statsEl = document.getElementById('athlete-magazine-stats');
    if (statsEl && a.stats) {
      statsEl.innerHTML = a.stats.map(([v, k]) => (
        `<div class="athlete-magazine-stat"><span class="v">${v}</span><span class="k">${k}</span></div>`
      )).join('');
    }

    const metaEl = document.getElementById('athlete-magazine-meta');
    if (metaEl) {
      metaEl.innerHTML = [
        renderMeta('Hometown', a.hometown),
        renderMeta('University', a.university || a.to?.name),
        renderMeta('Presentability', a.presentability),
      ].filter(Boolean).join('');
    }

    const agentEl = document.getElementById('athlete-magazine-agent');
    if (agentEl) agentEl.textContent = a.agent || 'Second Wind Pro';

    root.hidden = false;
    if (empty) empty.hidden = true;
  }

  render(profileKey());
})();


/* ------------------------------------------------------------
   10. PARTNERSHIP CONTACT FORM
   ------------------------------------------------------------ */

(function PartnershipForm() {
  const form = document.getElementById('partnership-form');
  if (!form) return;

  const sportsError = document.getElementById('sports-error');
  const success = document.getElementById('contact-form-success');

  function selectedSports() {
    return [...form.querySelectorAll('input[name="sports"]:checked')];
  }

  form.querySelectorAll('input[name="sports"]').forEach((input) => {
    input.addEventListener('change', () => {
      if (selectedSports().length && sportsError) sportsError.hidden = true;
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (!selectedSports().length) {
      if (sportsError) sportsError.hidden = false;
      form.querySelector('input[name="sports"]')?.focus();
      return;
    }

    if (sportsError) sportsError.hidden = true;
    form.classList.add('is-submitted');
    if (success) success.hidden = false;
    success?.focus();
  });
})();


/* ------------------------------------------------------------
   11. FOOTER — back to top
   ------------------------------------------------------------ */

(function FooterBackTop() {
  const link = document.querySelector('.footer-back-top');
  if (!link) return;

  link.addEventListener('click', (e) => {
    e.preventDefault();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    document.getElementById('main')?.focus({ preventScroll: true });
  });
})();
