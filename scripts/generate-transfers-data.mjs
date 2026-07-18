#!/usr/bin/env node
/**
 * Build transfer UI from Google Sheet Transfers tab.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  fetchTransferRows,
  loadTransferRowsFromFile,
  loadRosterRowsFromFile,
} from './roster-sheet.mjs';
import { SCHOOL_LOGO_SRC } from './school-logos.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const CARD_THEMES = ['commit-card--texas', 'commit-card--duke'];

function schoolAbbr(school) {
  return school
    .split(/\s+/)
    .filter((word) => !/^(of|the|university|state|college|a&m)$/i.test(word))
    .map((word) => word[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();
}

function schoolColor(school) {
  let h = 0;
  for (let i = 0; i < school.length; i += 1) h = (h * 31 + school.charCodeAt(i)) >>> 0;
  return `hsl(${h % 360} 42% 34%)`;
}

function schoolLogoHtml(school, size = 72) {
  const src = SCHOOL_LOGO_SRC[school];
  if (src) {
    return `<img src="${src}" alt="" width="${size}" height="${size}" loading="lazy" />`;
  }
  return `<span class="commit-card-logo-fallback" style="background:${schoolColor(school)}">${schoolAbbr(school)}</span>`;
}

function wireSchoolHtml(school) {
  const src = SCHOOL_LOGO_SRC[school];
  if (src) {
    return `<div class="wire-school"><div class="logo logo--img"><img src="${src}" alt="" width="36" height="36" loading="lazy" /></div><span class="name">${school}</span></div>`;
  }
  return `<div class="wire-school"><div class="logo" style="background:${schoolColor(school)}">${schoolAbbr(school)}</div><span class="name">${school}</span></div>`;
}

function splitName(name) {
  const parts = name.trim().split(/\s+/);
  return { first: parts[0], last: parts.slice(1).join(' ') };
}

function initials(name) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function transferDate(_index, windowYear) {
  const year = String(windowYear || '2026').replace(/\D/g, '').slice(0, 4) || '2026';
  return { display: year, iso: year };
}

const CLASS_ABBR = [
  [/redh?shirt\s+freshman/i, 'RS Fr'],
  [/redh?shirt\s+sophomore/i, 'RS So'],
  [/redh?shirt\s+junior/i, 'RS Jr'],
  [/redh?shirt\s+senior/i, 'RS Sr'],
  [/^freshman$/i, 'Fr'],
  [/^sophomore$/i, 'So'],
  [/^junior$/i, 'Jr'],
  [/^senior$/i, 'Sr'],
];

function abbreviateClass(klass) {
  const raw = String(klass || '').trim();
  if (!raw) return '';
  for (const [re, abbr] of CLASS_ABBR) {
    if (re.test(raw)) return abbr;
  }
  return raw;
}

/** Grade · position under the name (no school — destinations live in the wire flow). */
function rosterStyleMeta(_transfer, rosterRow) {
  const parts = String(rosterRow?.positionLine || '').split('·').map((s) => s.trim()).filter(Boolean);
  const role = parts[0] || rosterRow?.position || '';
  const klass = abbreviateClass(parts[1] || rosterRow?.year || '');
  return [klass, role].filter(Boolean).join(' · ');
}

function athleteMeta(slug, rosterBySlug) {
  const row = rosterBySlug[slug];
  if (!row) {
    return { initials: initials(slug), positionLine: 'Football', agent: 'Second Wind Pro', year: '' };
  }
  return {
    initials: row.photo,
    positionLine: row.positionLine,
    agent: row.agent,
    year: row.year || '',
    school: row.school || '',
  };
}

function commitCardHtml(transfer, rosterBySlug, index) {
  const { first, last } = splitName(transfer.name);
  const meta = athleteMeta(transfer.slug, rosterBySlug);
  const date = transferDate(index, transfer.window);
  const theme = CARD_THEMES[index % CARD_THEMES.length];
  const roleMeta = rosterStyleMeta(transfer, rosterBySlug[transfer.slug]);

  return `      <article class="commit-card ${theme}" data-athlete="${transfer.slug}">
        <div class="commit-card-visual" aria-hidden="true">
          <div class="commit-card-bg"></div>
          <div class="commit-card-pattern"></div>
          <div class="commit-card-uni">
            ${schoolLogoHtml(transfer.toSchool)}
          </div>
          <div class="commit-card-athlete">${meta.initials}</div>
        </div>
        <div class="commit-card-body">
          <div class="commit-card-head">
            <div class="commit-card-identity">
              <h3 class="commit-card-name">${first}${last ? ` <em>${last}</em>` : ''}</h3>
              <p class="commit-card-role">${roleMeta}</p>
            </div>
            <div class="commit-card-meta">
              <time class="commit-card-date" datetime="${date.iso}">${date.display}</time>
              <span class="commit-card-status commit-card-status--portal">Portal Move</span>
            </div>
          </div>
          <div class="commit-card-journey">
            <span class="commit-card-from">${transfer.fromSchool}</span>
            <span class="commit-card-arrow" aria-hidden="true">→</span>
            <span class="commit-card-to">${transfer.toSchool}</span>
          </div>
        </div>
      </article>`;
}

function wireRowHtml(transfer, rosterBySlug, index) {
  const { first, last } = splitName(transfer.name);
  const meta = athleteMeta(transfer.slug, rosterBySlug);
  const date = transferDate(index, transfer.window);
  const liveClass = index === 0 ? ' wire-row-live' : '';
  const roleMeta = rosterStyleMeta(transfer, rosterBySlug[transfer.slug]);
  const sportClass = transfer.sport?.toLowerCase() === 'basketball' ? ' basketball' : '';

  return `      <div class="wire-row${liveClass}" data-transfer="${transfer.slug}">
        <div class="wire-athlete">
          <div class="wire-photo${sportClass}" aria-hidden="true">${meta.initials}</div>
          <div class="wire-athlete-copy">
            <p class="wire-athlete-name">${first}${last ? ` <em>${last}</em>` : ''}</p>
            <span class="wire-athlete-sport">${roleMeta}</span>
          </div>
        </div>
        <div class="wire-row-meta">
          <time class="wire-date" datetime="${date.iso}">${date.display}</time>
          <span class="wire-badge portal">Portal Move</span>
        </div>
        <div class="wire-flow">
          ${wireSchoolHtml(transfer.fromSchool)}
          <span class="wire-arrow" aria-hidden="true">→</span>
          ${wireSchoolHtml(transfer.toSchool)}
        </div>
      </div>`;
}

function landingSnippet(transfers, rosterBySlug) {
  const featured = transfers.slice(0, 2);
  const cards = featured.map((t, i) => commitCardHtml(t, rosterBySlug, i)).join('\n\n');

  return `<!-- LATEST MOVEMENT -->
  <section id="transfer" aria-labelledby="transfer-heading">
    <div class="section-head">
      <div>
        <span class="eyebrow">03 — Transfers</span>
        <h2 id="transfer-heading">Strategic placements, <em>made visible.</em></h2>
        <p class="desc">Confirmed signings and portal commitments from the college football athletes we represent.</p>
      </div>
    </div>

    <div class="commit-grid">
${cards}
    </div>
  </section>`;
}

function patchTransferPage(transfers, rosterBySlug) {
  const transferPath = path.join(root, 'transfer.html');
  let html = fs.readFileSync(transferPath, 'utf8');
  const rows = transfers.map((t, i) => wireRowHtml(t, rosterBySlug, i)).join('\n\n');
  html = html.replace(
    /<div class="wire-list">[\s\S]*?<\/div>\s*\n\s*<\/section>/,
    `<div class="wire-list">\n${rows}\n    </div>\n  </section>`,
  );
  fs.writeFileSync(transferPath, html);
}

export async function buildTransfersOutput() {
  let transfers;
  try {
    transfers = await fetchTransferRows();
  } catch {
    transfers = loadTransferRowsFromFile();
  }

  const roster = loadRosterRowsFromFile();
  const rosterBySlug = Object.fromEntries(roster.map((row) => [row.slug, row]));

  const snippet = landingSnippet(transfers, rosterBySlug);
  fs.writeFileSync(path.join(__dirname, 'snippets/transfer-landing.html'), `${snippet}\n`);
  patchTransferPage(transfers, rosterBySlug);

  return transfers.length;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  buildTransfersOutput()
    .then((count) => console.log(`Generated ${count} transfers from sheet`))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
