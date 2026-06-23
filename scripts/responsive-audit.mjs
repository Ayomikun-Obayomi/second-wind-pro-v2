/**
 * One-off responsiveness audit — run: node scripts/responsive-audit.mjs
 * Requires: npx playwright (downloads chromium on first run)
 */
import { chromium } from 'playwright';

const URL = process.env.AUDIT_URL || 'http://localhost:8001/';
const WIDTHS = [320, 375, 768, 1024, 1280, 1440, 1920, 2560];
const HEIGHT = 900;

const auditFn = () => {
  window.scrollTo(0, 0);
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const doc = document.documentElement;
  const overflowX = Math.max(0, doc.scrollWidth - vw);

  const navLinks = document.querySelector('.nav-links');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinksVisible = navLinks && getComputedStyle(navLinks).display !== 'none';
  const toggleVisible = navToggle && getComputedStyle(navToggle).display !== 'none';

  const heroCta = document.querySelector('.hero-cta .btn-primary');
  const ctaRect = heroCta?.getBoundingClientRect();
  const ctaAboveFold = ctaRect ? ctaRect.top < vh && ctaRect.bottom > 0 : false;

  const h1 = document.querySelector('.hero h1');
  const h1Overflow = h1 ? h1.getBoundingClientRect().right > vw + 2 : false;

  const tinyText = [];
  for (const el of document.querySelectorAll('*')) {
    if (tinyText.length >= 6) break;
    const s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden') continue;
    const fs = parseFloat(s.fontSize);
    const text = (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3)
      ? el.textContent.trim()
      : '';
    if (fs > 0 && fs < 12 && text) {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        tinyText.push({ cls: String(el.className).slice(0, 40), fs, text: text.slice(0, 40) });
      }
    }
  }

  const smallTargets = vw < 768
    ? [...document.querySelectorAll('a, button, [role="button"], input')]
        .filter((el) => {
          if (el.closest('#agentation-root')) return false;
          const s = getComputedStyle(el);
          if (s.display === 'none' || s.visibility === 'hidden') return false;
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.height > 0 && (r.width < 44 || r.height < 44);
        })
        .map((el) => ({
          tag: el.tagName,
          cls: String(el.className).slice(0, 35),
          w: Math.round(el.getBoundingClientRect().width),
          h: Math.round(el.getBoundingClientRect().height),
          label: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 24),
        }))
    : [];

  const mediaOverflow = [...document.querySelectorAll('img, video')]
    .filter((el) => {
      const r = el.getBoundingClientRect();
      return r.right > vw + 2 || r.left < -2;
    })
    .map((el) => ({
      tag: el.tagName,
      cls: String(el.className).slice(0, 30),
      right: Math.round(el.getBoundingClientRect().right),
    }));

  const wireOverflow = [...document.querySelectorAll('.wire-row')]
    .filter((el) => el.getBoundingClientRect().right > vw + 2).length;

  const agencyCols = getComputedStyle(document.querySelector('.agency-inner') || document.body).gridTemplateColumns;
  const rosterTrack = document.querySelector('.roster-track');
  const rosterCardW = document.querySelector('.athlete-card')?.getBoundingClientRect().width;

  const svcStack = document.querySelector('.services-stack');
  const svcHeight = svcStack ? parseFloat(getComputedStyle(svcStack).height) : 0;

  const container = document.querySelector('.section-head, .agency-inner, .footer-top');
  const contentMax = document.querySelector('.agency-inner')?.getBoundingClientRect().width;

  return {
    vw,
    overflowX,
    navLinksVisible,
    toggleVisible,
    ctaAboveFold,
    h1Overflow,
    tinyText,
    smallTargetsCount: smallTargets.length,
    smallTargets: smallTargets.slice(0, 10),
    mediaOverflow,
    wireOverflow,
    agencyCols,
    rosterCardW: rosterCardW ? Math.round(rosterCardW) : null,
    svcHeight: Math.round(svcHeight),
    contentWidth: contentMax ? Math.round(contentMax) : null,
  };
};

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const results = [];

for (const width of WIDTHS) {
  await page.setViewportSize({ width, height: HEIGHT });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  const data = await page.evaluate(auditFn);
  results.push(data);
}

// Transfer section scroll check at 320
await page.setViewportSize({ width: 320, height: HEIGHT });
await page.goto(URL, { waitUntil: 'networkidle' });
await page.locator('#transfer').scrollIntoViewIfNeeded();
await page.waitForTimeout(200);
const transfer320 = await page.evaluate(() => {
  const vw = window.innerWidth;
  const rows = [...document.querySelectorAll('.wire-row')].map((el) => ({
    right: Math.round(el.getBoundingClientRect().right),
    overflow: el.getBoundingClientRect().right > vw + 2,
  }));
  const head = document.querySelector('#transfer .section-head');
  const headRect = head?.getBoundingClientRect();
  return {
    rowOverflow: rows.filter((r) => r.overflow).length,
    rows,
    headStacked: headRect ? headRect.height > 80 : null,
  };
});

// Modal at 375
await page.setViewportSize({ width: 375, height: HEIGHT });
await page.goto(URL, { waitUntil: 'networkidle' });
await page.locator('button[name="View Marcus Lane profile"], .athlete-card').first().click({ timeout: 5000 }).catch(() =>
  page.evaluate(() => document.querySelector('[data-athlete="0"]')?.click() || document.querySelector('.athlete-card')?.click())
);
await page.waitForTimeout(400);
const modal375 = await page.evaluate(() => {
  const vw = window.innerWidth;
  const modal = document.querySelector('.modal');
  const overlay = document.querySelector('.modal-overlay');
  if (!modal) return { open: false };
  const mr = modal.getBoundingClientRect();
  return {
    open: overlay?.getAttribute('aria-hidden') === 'false',
    modalOverflow: mr.right > vw + 2 || mr.left < -2,
    modalW: Math.round(mr.width),
    modalH: Math.round(mr.height),
    vw,
  };
});

await browser.close();

console.log(JSON.stringify({ results, transfer320, modal375 }, null, 2));
