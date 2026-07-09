/* Placeholder portrait paths — synthetic headshots for demo only. */

(function SWPortraits(global) {
  const BASE = 'assets/portraits';

  /** Slack-style pre-generated display sizes */
  const DISPLAY_SIZES = {
    wire: 55,
    queue: 32,
    commit: 96,
    roster: 512,
  };

  const FEMALE_KEYS = new Set([
    'sienna-hart',
    'mara-chen',
    'sofia-ruiz',
  ]);

  function athletePortraitSrc(slug) {
    return `${BASE}/athletes/${slug}.jpg`;
  }

  function athleteDerivedSrc(slug, size) {
    return `${BASE}/athletes/derived/${size}/${slug}.jpg`;
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

    img.removeAttribute('srcset');
    img.removeAttribute('sizes');
    img.removeAttribute('width');
    img.removeAttribute('height');
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

  /**
   * Slack-style sized portrait: serve pre-generated 1x/2x assets instead of CSS upscaling.
   */
  function applySizedAthletePortrait(container, slug, displaySize, alt) {
    if (!container || !slug || !displaySize) return;

    const size2x = displaySize * 2;
    const src1x = athleteDerivedSrc(slug, displaySize);
    const src2x = athleteDerivedSrc(slug, size2x);

    let img = container.querySelector('img.portrait-img');
    if (!img) {
      img = document.createElement('img');
      img.className = 'portrait-img';
      img.loading = 'lazy';
      img.decoding = 'async';
      container.insertBefore(img, container.firstChild);
    }

    img.alt = alt || '';
    img.width = displaySize;
    img.height = displaySize;
    img.sizes = `${displaySize}px`;
    img.srcset = `${src1x} ${displaySize}w, ${src2x} ${size2x}w`;
    img.src = src1x;
    container.classList.add('has-portrait');

    const initials = container.querySelector('.advisor-initials, .athlete-magazine-agent-initials');
    if (initials) initials.hidden = true;

    img.onerror = () => {
      applyPortraitImage(container, athletePortraitSrc(slug), alt);
    };
  }

  function rosterGridFocusFromSize(width, height) {
    if (!width || !height) return 'center top';
    const imageAr = height / width;
    const frameAr = 24 / 25;
    if (imageAr <= frameAr) return 'center top';
    if (imageAr >= 1.85) return 'center 14%';
    if (imageAr >= 1.65) return 'center 12%';
    return 'center top';
  }

  function applyAthleteObjectPosition(img, position) {
    if (!position) {
      img.style.objectPosition = '';
      img.style.transformOrigin = '';
      return;
    }
    img.style.objectPosition = position;
    img.style.transformOrigin = position;
  }

  function fillAthletePhoto(el, slug, athlete) {
    if (!el || !slug) return;

    const fallback = athlete?.photo || '';
    const alt = athlete?.name ? `${athlete.name} portrait` : 'Athlete portrait';

    const onRosterPage = Boolean(el.closest('#roster.roster-page'));
    const onCommitCard = Boolean(el.closest('.commit-card'));
    const onMktQueue = Boolean(el.closest('.mkt-queue-av'));
    const onWirePhoto = Boolean(el.closest('.wire-photo'));

    if (onWirePhoto) {
      applySizedAthletePortrait(el, slug, DISPLAY_SIZES.wire, alt);
    } else if (onMktQueue) {
      applySizedAthletePortrait(el, slug, DISPLAY_SIZES.queue, alt);
    } else if (onCommitCard) {
      applySizedAthletePortrait(el, slug, DISPLAY_SIZES.commit, alt);
    } else {
      const src = athlete?.photoSrc || athletePortraitSrc(slug);
      applyPortraitImage(el, src, alt);
    }

    [...el.childNodes].forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) node.remove();
    });

    const img = el.querySelector('img.portrait-img');
    if (!img) return;

    if (onWirePhoto || onMktQueue || onCommitCard) return;

    const syncPosition = () => {
      if (onRosterPage) {
        const position = athlete?.photoPositionRoster
          || rosterGridFocusFromSize(img.naturalWidth, img.naturalHeight);
        applyAthleteObjectPosition(img, position);
        return;
      }

      applyAthleteObjectPosition(img, athlete?.photoPosition || '');
    };

    syncPosition();
    if (!img.complete) {
      img.addEventListener('load', syncPosition, { once: true });
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
    athleteDerivedSrc,
    agentPortraitSrc,
    founderPortraitSrc,
    portraitSeed,
    isFemaleKey,
    fillAthletePhoto,
    fillAdvisorPhoto,
    applyPortraitImage,
    applySizedAthletePortrait,
    DISPLAY_SIZES,
  };
})(window);
