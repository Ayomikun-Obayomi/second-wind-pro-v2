#!/usr/bin/env node
/**
 * Download demo portraits — Wikimedia Commons college/NFL headshots + agent stock photos.
 * See assets/portraits/ATTRIBUTION.md for license credits.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { buildAthletesCatalog } from './generate-athletes-data.mjs';
import { ATHLETE_PORTRAIT_SOURCES } from './athlete-portrait-sources.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const FORCE = process.argv.includes('--force');
const ATHLETES_ONLY = process.argv.includes('--athletes-only');

const FEMALE_AGENTS = new Set(['mara-chen', 'sofia-ruiz']);

const AGENT_IDS = [
  'jordan-ellis',
  'luke-bramwell',
  'lenny-vasquez',
  'mara-chen',
  'eli-okonkwo',
  'sofia-ruiz',
  'luke-mazur',
];

const MALE_AGENT = [
  1181690,
  2182970,
  3762945,
  3211478,
  1181519,
  774909,
  91227,
  2379004,
  'photo-1560250097-0b93528c311a',
  'photo-1472099645785-5658abf4ff4e',
  'photo-1519085360753-af0119f7cbe7',
  'photo-1507003211169-0a1dd7228f2d',
  'photo-1500648767791-00dcc994a43e',
];

const FEMALE_AGENT = [
  3756679,
  'photo-1573496359142-b8d87734a5a2',
  'photo-1580489944761-15a19d654956',
];

function hashIndex(key, max) {
  let h = 0;
  for (let i = 0; i < key.length; i += 1) {
    h = (h * 31 + key.charCodeAt(i)) >>> 0;
  }
  return h % max;
}

function pexelsUrl(id) {
  const base = `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg`;
  return `${base}?auto=compress&cs=tinysrgb&w=900&h=900&fit=crop`;
}

function unsplashUrl(id) {
  return `https://images.unsplash.com/${id}?w=900&h=900&fit=crop&crop=faces&auto=format&q=85`;
}

function resolveSource(entry) {
  if (typeof entry === 'number') return pexelsUrl(entry);
  if (String(entry).startsWith('photo-')) return unsplashUrl(entry);
  throw new Error(`Unknown source: ${entry}`);
}

function pickFromPool(key, pool) {
  return resolveSource(pool[hashIndex(key, pool.length)]);
}

function athletePortraitUrl(slug) {
  const source = ATHLETE_PORTRAIT_SOURCES[slug];
  if (!source?.url) throw new Error(`Missing Wikimedia portrait for: ${slug}`);
  return source.url;
}

function agentPortraitUrl(id) {
  if (FEMALE_AGENTS.has(id)) return pickFromPool(id, FEMALE_AGENT);
  if (id === 'jordan-ellis') return resolveSource(MALE_AGENT[0]);
  if (id === 'luke-mazur') return resolveSource(MALE_AGENT[1]);
  return pickFromPool(id, MALE_AGENT);
}

function download(url, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  try {
    execSync(`curl -sfL -A "SecondWindPro/1.0" -o ${JSON.stringify(dest)} ${JSON.stringify(url)}`, { stdio: 'pipe' });
    if (!fs.existsSync(dest) || fs.statSync(dest).size < 4000) {
      throw new Error('empty file');
    }
    return Promise.resolve(dest);
  } catch (err) {
    return Promise.reject(err);
  }
}

function sleep(ms) {
  return new Promise((resolve) => { setTimeout(resolve, ms); });
}

function writeAttribution(catalog) {
  const lines = [
    '# Athlete portrait attribution (demo)',
    '',
    'Placeholder headshots sourced from [Wikimedia Commons](https://commons.wikimedia.org/) under Creative Commons licenses.',
    'Fictional roster names do **not** represent the pictured athletes. Replace with cleared, licensed media before production.',
    '',
    '| Athlete (fictional) | Photo subject | License |',
    '|---|---|---|',
  ];

  for (const slug of Object.keys(catalog).sort()) {
    const athlete = catalog[slug];
    const src = ATHLETE_PORTRAIT_SOURCES[slug];
    if (!src) continue;
    lines.push(`| ${athlete.name} (\`${slug}\`) | ${src.credit} | ${src.license} |`);
  }

  lines.push('');
  fs.writeFileSync(path.join(root, 'assets/portraits/ATTRIBUTION.md'), `${lines.join('\n')}\n`);
}

async function main() {
  const athletesDir = path.join(root, 'assets/portraits/athletes');
  const agentsDir = path.join(root, 'assets/portraits/agents');
  fs.mkdirSync(athletesDir, { recursive: true });
  fs.mkdirSync(agentsDir, { recursive: true });

  const catalog = buildAthletesCatalog();
  writeAttribution(catalog);

  const jobs = [];

  for (const slug of Object.keys(catalog)) {
    jobs.push({
      label: `athlete ${slug}`,
      url: athletePortraitUrl(slug),
      dest: path.join(athletesDir, `${slug}.jpg`),
    });
  }

  for (const id of AGENT_IDS) {
    if (ATHLETES_ONLY) continue;
    jobs.push({
      label: `agent ${id}`,
      url: agentPortraitUrl(id),
      dest: path.join(agentsDir, `${id}.jpg`),
    });
  }

  console.log(`Downloading ${jobs.length} portraits (${FORCE ? 'force' : 'skip existing'})…`);

  let ok = 0;
  let failed = 0;

  for (const job of jobs) {
    if (!FORCE && fs.existsSync(job.dest) && fs.statSync(job.dest).size > 8000) {
      console.log(`  skip ${job.label}`);
      ok += 1;
      continue;
    }
    process.stdout.write(`  ${job.label}… `);
    try {
      await download(job.url, job.dest);
      const kb = Math.round(fs.statSync(job.dest).size / 1024);
      console.log(`ok (${kb} KB)`);
      ok += 1;
    } catch (err) {
      console.log(`failed (${err.message})`);
      failed += 1;
    }
    await sleep(2500);
  }

  console.log(`Done. ${ok} ok, ${failed} failed.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
