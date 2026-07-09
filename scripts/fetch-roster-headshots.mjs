#!/usr/bin/env node
/**
 * Download official roster headshots from college athletics sites (and fallbacks).
 * Run: node scripts/fetch-roster-headshots.mjs [--force]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadRosterRowsFromFile, loadTransferRowsFromFile } from './roster-sheet.mjs';
import { processPortrait } from './process-portraits.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const FORCE = process.argv.includes('--force');

const SCHOOL_DOMAINS = {
  'Iowa State': 'cyclones.com',
  Mercyhurst: 'hurstathletics.com',
  Harding: 'hardingsports.com',
  Toledo: 'utrockets.com',
  'Gardner-Webb': 'gwusports.com',
  'New Mexico State': 'nmstatesports.com',
  Bryant: 'bryantbulldogs.com',
  'New Hampshire': 'unhwildcats.com',
  'Johnson C. Smith': 'goldenbullsports.com',
  'Eastern Washington': 'goeags.com',
  Allen: 'auyellowjackets.com',
  'Western Michigan': 'wmubroncos.com',
  'James Madison': 'jmusports.com',
  Hawaii: 'hawaiiathletics.com',
  Nevada: 'nevadawolfpack.com',
  Valparaiso: 'valpoathletics.com',
  'Prairie View A&M': 'pvpanthers.com',
  'West Georgia': 'uwgathletics.com',
  'San Diego State': 'goaztecs.com',
  Virginia: 'virginiasports.com',
  'San Jose State': 'sjsuspartans.com',
  'SE Louisiana': 'lionsports.net',
  'Holy Cross': 'goholycross.com',
  'Iowa Central CC': 'ictritons.com',
  UTGRV: 'goutrgv.com',
};

/** Curated fallbacks when roster pages lack photos or player not listed yet. */
const PORTRAIT_FALLBACKS = {
  'jaiden-allos':
    'https://dxbhsrqyrr690.cloudfront.net/sidearm.nextgen.sites/hurstathletics.com/images/2025/8/1/Allos_25_cropped.jpg',
  'quory-ambrose': 'https://images.sidearmdev.com/convert?url=https%3A%2F%2Fgobluehose.com%2Fimages%2F2025%2F8%2F20%2FAmbrose_x55JT.png&type=jpeg',
  'fabian-duncan': 'https://auyellowjackets.com/images/2025/8/22/22FabianDuncan.png.png',
  'jamai-east': 'https://dxbhsrqyrr690.cloudfront.net/sidearm.nextgen.sites/oregonstate.sidearmsports.com/images/2025/7/25/07082025_FB_Headshot_EastJamai_1017.png',
  'tre-leonard': 'https://dxbhsrqyrr690.cloudfront.net/sidearm.nextgen.sites/jmusports.com/images/2025/7/11/Leonard-Tre-25.JPG',
  'justin-montgomery': 'https://gobluehose.com/images/2025/8/20/Montgomery_DbzOd.png',
  'mytrell-tillman': 'https://pbs.twimg.com/media/G-5zH6ZW0AA6jZy.jpg',
  'shacre-colwell': 'https://unavatar.io/twitter/Shacre6',
  'wynden-ho-ohuli': 'https://hawaiiathletics.com/images/2026/6/10/300dpi_Hoohuli__Wynden26_2729_JRtLt.JPG',
};

/** Transfer-only athletes (not on roster sheet) — social / recruiting sources. */
const TRANSFER_PORTRAIT_FALLBACKS = {
  'jaden-turner': 'https://unavatar.io/x/JTurner004',
};

/** Slugs that should use curated fallback over roster autodetect. */
const PREFER_FALLBACK_SLUGS = new Set(['jaiden-allos', 'quory-ambrose', 'mytrell-tillman']);

const UA = 'SecondWindPro/1.0 (roster headshots)';

function normalizeToken(value) {
  return value.toLowerCase().replace(/[^a-z]/g, '');
}

function pathMatchesName(path, first, last) {
  const low = path.toLowerCase();
  const compact = low.replace(/[^a-z]/g, '');
  return (
    compact.includes(last) &&
    (compact.includes(first) || compact.includes(first.slice(0, 3)) || low.includes(last))
  );
}

function decodeImageUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url.replace(/&amp;/g, '&'));
    const inner = u.searchParams.get('url');
    if (inner) return decodeURIComponent(inner);
  } catch {
    /* use raw url */
  }
  return url.replace(/&amp;/g, '&');
}

function pickPlayerImage(html) {
  const og = html.match(/property="og:image" content="([^"]+)"/i);
  if (og) {
    const decoded = decodeImageUrl(og[1]);
    if (decoded && !/generic_image_missing|blank-avatar|silhouette/i.test(decoded)) {
      return decoded;
    }
  }

  const imgs = [...html.matchAll(/https?:\/\/[^"'\s>]+\.(?:jpg|jpeg|png|webp)(?:\?[^"'\s>]*)?/gi)].map((m) => m[0]);
  return (
    imgs.find(
      (u) =>
        /\/images\/20\d{2}\//i.test(u) &&
        !/logo|missing|pattern|footer|branded|responsive|icon|sprite|nav|banner|TN\.jpeg|Press_Conference|template/i.test(u),
    ) || null
  );
}

async function fetchHtml(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
  if (!res.ok) return null;
  return res.text();
}

async function findProfilePath(domain, name) {
  const html = await fetchHtml(`https://${domain}/sports/football/roster`);
  if (!html) return null;

  const parts = name.replace(/\./g, '').split(/\s+/).filter(Boolean);
  const first = normalizeToken(parts[0]);
  const last = normalizeToken(parts[parts.length - 1]);
  const re = /href="(\/sports\/football\/roster(?:\/player)?\/[^"]+)"/gi;
  const paths = [...html.matchAll(re)].map((m) => m[1]);
  const hit = paths.find((p) => pathMatchesName(p, first, last));
  return hit || null;
}

async function resolveFromRoster(row) {
  const domain = SCHOOL_DOMAINS[row.school];
  if (!domain) return null;

  const path = await findProfilePath(domain, row.name);
  if (!path) return null;

  const html = await fetchHtml(`https://${domain}${path}`);
  if (!html) return null;
  return pickPlayerImage(html);
}

async function resolvePortraitUrl(row) {
  const fallback = PORTRAIT_FALLBACKS[row.slug];
  if (PREFER_FALLBACK_SLUGS.has(row.slug) && fallback) {
    return { url: fallback, source: 'fallback' };
  }

  const rosterUrl = await resolveFromRoster(row);
  if (rosterUrl) return { url: rosterUrl, source: 'roster' };

  if (fallback) return { url: fallback, source: 'fallback' };

  return null;
}

export async function fetchAllRosterHeadshots({ force = false } = {}) {
  const rows = loadRosterRowsFromFile();
  const sources = {};
  const results = [];

  for (const row of rows) {
    const resolved = await resolvePortraitUrl(row);
    if (!resolved) {
      results.push({ slug: row.slug, status: 'missing' });
      continue;
    }

    const result = await downloadImage(row.slug, resolved.url, force);
    sources[row.slug] = { url: resolved.url, source: resolved.source };
    results.push({ ...result, source: resolved.source });
  }

  const outFile = path.join(root, 'data/roster-headshot-sources.json');
  fs.writeFileSync(outFile, `${JSON.stringify(sources, null, 2)}\n`);

  const transferResults = await fetchTransferOnlyPortraits({ force, sources });
  results.push(...transferResults);

  return { results, sources };
}

export async function fetchTransferOnlyPortraits({ force = false, sources = {} } = {}) {
  const transfers = loadTransferRowsFromFile();
  const rosterSlugs = new Set(loadRosterRowsFromFile().map((row) => row.slug));
  const results = [];

  for (const transfer of transfers) {
    const { slug } = transfer;
    if (rosterSlugs.has(slug)) continue;

    const url = TRANSFER_PORTRAIT_FALLBACKS[slug];
    if (!url) {
      results.push({ slug, status: 'missing', reason: 'no transfer portrait source' });
      continue;
    }

    const result = await downloadImage(slug, url, force);
    sources[slug] = { url, source: 'transfer-social' };
    results.push({ ...result, source: 'transfer-social' });
  }

  const outFile = path.join(root, 'data/roster-headshot-sources.json');
  fs.writeFileSync(outFile, `${JSON.stringify(sources, null, 2)}\n`);

  return results;
}

/** Prefer larger Sidearm/CDN variants when available (Slack-style high-res source). */
function upgradePortraitUrl(url) {
  if (!url) return url;
  try {
    const u = new URL(url.replace(/&amp;/g, '&'));
    if (u.hostname.includes('sidearmdev.com') && u.pathname.includes('/convert')) {
      u.searchParams.set('width', '1024');
      u.searchParams.set('height', '1024');
      return u.toString();
    }
    if (u.hostname.includes('cloudfront.net') || u.hostname.includes('sidearmsports.com')) {
      u.searchParams.set('width', '1024');
      return u.toString();
    }
  } catch {
    /* keep original */
  }
  return url;
}

async function downloadImage(slug, url, force = FORCE) {
  const dest = path.join(root, 'assets/portraits/athletes/raw', `${slug}.jpg`);
  if (!force && fs.existsSync(dest) && fs.statSync(dest).size > 12000) {
    const processed = await processPortrait(slug, { force: false });
    return {
      slug,
      status: 'skip',
      dest,
      bytes: fs.statSync(dest).size,
      processed: processed.status,
    };
  }

  const fetchUrl = upgradePortraitUrl(url);
  const res = await fetch(fetchUrl, { headers: { 'User-Agent': UA }, redirect: 'follow' });
  if (!res.ok) return { slug, status: 'fail', reason: `HTTP ${res.status}`, url: fetchUrl };

  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 3000) return { slug, status: 'fail', reason: 'too small', url: fetchUrl };

  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);

  const processed = await processPortrait(slug, { force: true });
  return {
    slug,
    status: 'ok',
    dest,
    bytes: buf.length,
    url: fetchUrl,
    processed: processed.status,
    master: processed.master,
  };
}

async function main() {
  const { results } = await fetchAllRosterHeadshots({ force: FORCE });

  console.log(`Fetching headshots for ${results.length} players…`);
  for (const result of results) {
    if (result.status === 'skip') {
      console.log(`  · ${result.slug} — skip (${Math.round(result.bytes / 1024)} KB)`);
    } else if (result.status === 'ok') {
      console.log(`  ✓ ${result.slug} — ${result.source} (${Math.round(result.bytes / 1024)} KB)`);
    } else if (result.status === 'missing') {
      console.log(`  ✗ ${result.slug} — no source found`);
    } else {
      console.log(`  ✗ ${result.slug} — ${result.reason || 'failed'}`);
    }
  }

  console.log(`\nWrote data/roster-headshot-sources.json`);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
