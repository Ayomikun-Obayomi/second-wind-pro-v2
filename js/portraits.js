/* Placeholder portrait paths — synthetic headshots for demo only. */

(function SWPortraits(global) {
  const BASE = 'assets/portraits';

  const FEMALE_KEYS = new Set([
    'sienna-hart',
    'mara-chen',
    'sofia-ruiz',
  ]);

  function athletePortraitSrc(slug) {
    return `${BASE}/athletes/${slug}.jpg`;
  }

  function agentPortraitSrc(advisorId) {
    return `${BASE}/agents/${advisorId}.jpg`;
  }

  function founderPortraitSrc() {
    return `${BASE}/agents/luke-mazur.jpg`;
  }

  function portraitSeed(key, female) {
    return female ? `${key}-f` : key;
  }

  function isFemaleKey(key) {
    return FEMALE_KEYS.has(key);
  }

  function applyPortraitImage(container, src, alt) {
    if (!container || !src) return;

    let img = container.querySelector('img.portrait-img');
    if (!img) {
      img = document.createElement('img');
      img.className = 'portrait-img';
      img.loading = 'lazy';
      img.decoding = 'async';
      container.insertBefore(img, container.firstChild);
    }

    img.src = src;
    img.alt = alt || '';
    container.classList.add('has-portrait');

    const initials = container.querySelector('.advisor-initials, .athlete-magazine-agent-initials');
    if (initials) initials.hidden = true;

    img.onerror = () => {
      container.classList.remove('has-portrait');
      img.remove();
      if (initials) initials.hidden = false;
    };
  }

  function fillAthletePhoto(el, slug, athlete) {
    if (!el || !slug) return;

    const fallback = athlete?.photo || '';
    const src = athlete?.photoSrc || athletePortraitSrc(slug);
    const alt = athlete?.name ? `${athlete.name} portrait` : 'Athlete portrait';

    applyPortraitImage(el, src, alt);

    [...el.childNodes].forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) node.remove();
    });

    const img = el.querySelector('img.portrait-img');
    if (!img) return;

    const onRoster = Boolean(el.closest('#roster.roster-page'));
    if (onRoster) {
      img.style.objectPosition = '';
      img.style.transformOrigin = '';
    } else if (athlete?.photoPosition) {
      img.style.objectPosition = athlete.photoPosition;
      img.style.transformOrigin = athlete.photoPosition;
    }

    img.onerror = () => {
      el.classList.remove('has-portrait');
      img.remove();
      if (fallback && !el.textContent.trim()) el.insertBefore(document.createTextNode(fallback), el.firstChild);
    };
  }

  function fillAdvisorPhoto(el, advisorId, advisor) {
    if (!el || !advisorId) return;
    const surface = el.querySelector('.advisor-photo-surface') || el;
    const src = advisor?.photoSrc || agentPortraitSrc(advisorId);
    const alt = advisor?.name ? `${advisor.name} headshot` : 'Agent headshot';
    applyPortraitImage(surface, src, alt);
  }

  global.SW_PORTRAITS = {
    athletePortraitSrc,
    agentPortraitSrc,
    founderPortraitSrc,
    portraitSeed,
    isFemaleKey,
    fillAthletePhoto,
    fillAdvisorPhoto,
    applyPortraitImage,
  };
})(window);
