#!/usr/bin/env node
/**
 * Slack-style portrait pipeline:
 * - Square masters at 512–1024px (target 1024)
 * - Pre-generated display sizes (never upscale in the browser)
 *
 * Run: node scripts/process-portraits.mjs [--force] [--slug=name]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { portraitFocusFromFile, rosterGridFocusFromFile } from './portrait-focus.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const FORCE = process.argv.includes('--force');
const SLUG_FILTER = process.argv.find((a) => a.startsWith('--slug='))?.split('=')[1];

/** Slack upload bounds */
export const MASTER_TARGET = 1024;
export const MASTER_MIN = 512;

/** Slack-style derived sizes + wire @2x */
export const DERIVED_SIZES = [32, 48, 55, 64, 72, 96, 110, 192, 512];

const JPEG_QUALITY = 85;

const PHOTO_POSITION_OVERRIDES = {
  'jaiden-allos': 'center 0%',
};

const PHOTO_POSITION_ROSTER_OVERRIDES = {
  'jaiden-allos': 'center 0%',
  'salahadin-allah': 'center top',
  'quory-ambrose': 'center top',
  'nick-herman': 'center top',
  'shacre-colwell': 'center top',
  'malik-diaby': 'center top',
  'maddox-arnold': 'center top',
  'wynden-ho-ohuli': 'center top',
  'sean-brady': 'center 30%',
};

function parseObjectPosition(position = 'center top') {
  const parts = position.trim().split(/\s+/);
  let x = 0.5;
  let y = 0;

  const xToken = parts[0] || 'center';
  if (xToken === 'left') x = 0;
  else if (xToken === 'right') x = 1;
  else if (xToken === 'center' && parts.length === 1) {
    x = 0.5;
    y = 0.5;
  } else if (xToken.endsWith('%')) x = Number.parseFloat(xToken) / 100;

  const yToken = parts[1] || (xToken === 'top' || xToken === 'bottom' ? xToken : 'top');
  if (yToken === 'top') y = 0;
  else if (yToken === 'bottom') y = 1;
  else if (yToken === 'center') y = 0.5;
  else if (yToken.endsWith('%')) y = Number.parseFloat(yToken) / 100;

  return { x, y };
}

/** Square crop region aligned to object-position (Slack circle/square framing). */
export function squareCropRegion(width, height, position = 'center top') {
  const { x, y } = parseObjectPosition(position);
  const size = Math.min(width, height);

  if (width >= height) {
    const left = Math.round((width - size) * x);
    return { left, top: 0, width: size, height: size };
  }

  const left = Math.round((width - size) * x);
  const anchorY = y * height;
  let top = Math.round(anchorY - size / 2);
  top = Math.max(0, Math.min(top, height - size));
  return { left, top, width: size, height: size };
}

function portraitPositionForSlug(slug, rawPath) {
  if (PHOTO_POSITION_ROSTER_OVERRIDES[slug]) return PHOTO_POSITION_ROSTER_OVERRIDES[slug];
  if (PHOTO_POSITION_OVERRIDES[slug]) return PHOTO_POSITION_OVERRIDES[slug];
  if (fs.existsSync(rawPath)) return rosterGridFocusFromFile(rawPath);
  return 'center top';
}

function masterPath(slug) {
  return path.join(root, 'assets/portraits/athletes', `${slug}.jpg`);
}

function rawPath(slug) {
  return path.join(root, 'assets/portraits/athletes/raw', `${slug}.jpg`);
}

function derivedPath(slug, size) {
  return path.join(root, 'assets/portraits/athletes/derived', String(size), `${slug}.jpg`);
}

async function ensureRawFromMaster(slug) {
  const raw = rawPath(slug);
  const master = masterPath(slug);
  if (!fs.existsSync(raw) && fs.existsSync(master)) {
    fs.mkdirSync(path.dirname(raw), { recursive: true });
    fs.copyFileSync(master, raw);
  }
}

async function buildMasterBuffer(inputPath, position) {
  const image = sharp(inputPath);
  const meta = await image.metadata();
  const width = meta.width || 0;
  const height = meta.height || 0;
  if (!width || !height) throw new Error('invalid dimensions');

  const crop = squareCropRegion(width, height, position);
  let pipeline = image.extract(crop);

  const croppedSide = crop.width;
  const target = croppedSide < MASTER_MIN
    ? MASTER_MIN
    : Math.min(MASTER_TARGET, croppedSide);

  pipeline = pipeline.resize(target, target, {
    fit: 'fill',
    kernel: sharp.kernel.lanczos3,
  });

  return pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();
}

async function writeDerivedSizes(slug, masterBuffer, { force = false } = {}) {
  const results = [];

  for (const size of DERIVED_SIZES) {
    const dest = derivedPath(slug, size);
    if (!force && fs.existsSync(dest) && fs.statSync(dest).size > 400) {
      results.push({ size, status: 'skip' });
      continue;
    }

    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const buf = await sharp(masterBuffer)
      .resize(size, size, { fit: 'fill', kernel: sharp.kernel.lanczos3 })
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
      .toBuffer();

    fs.writeFileSync(dest, buf);
    results.push({ size, status: 'ok', bytes: buf.length });
  }

  return results;
}

export async function processPortrait(slug, { force = FORCE } = {}) {
  await ensureRawFromMaster(slug);

  const raw = rawPath(slug);
  const master = masterPath(slug);
  const source = fs.existsSync(raw) ? raw : master;

  if (!fs.existsSync(source)) {
    return { slug, status: 'missing' };
  }

  const position = portraitPositionForSlug(slug, source);
  const masterStale = force
    || !fs.existsSync(master)
    || fs.statSync(master).mtimeMs < fs.statSync(source).mtimeMs;

  let masterBuffer;
  if (masterStale) {
    masterBuffer = await buildMasterBuffer(source, position);
    fs.mkdirSync(path.dirname(master), { recursive: true });
    fs.writeFileSync(master, masterBuffer);
  } else {
    masterBuffer = fs.readFileSync(master);
  }

  const derived = await writeDerivedSizes(slug, masterBuffer, { force: masterStale || force });
  const meta = await sharp(masterBuffer).metadata();

  return {
    slug,
    status: 'ok',
    position,
    master: `${meta.width}x${meta.height}`,
    derived,
  };
}

export async function processAllPortraits({ force = FORCE, slugs = null } = {}) {
  const athletesDir = path.join(root, 'assets/portraits/athletes');
  const discovered = new Set();

  for (const dir of [athletesDir, path.join(athletesDir, 'raw')]) {
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!/\.(jpe?g|png|webp)$/i.test(file)) continue;
      discovered.add(path.basename(file, path.extname(file)));
    }
  }

  let targets = [...discovered].sort();
  if (slugs?.length) targets = targets.filter((s) => slugs.includes(s));

  const results = [];
  for (const slug of targets) {
    if (SLUG_FILTER && slug !== SLUG_FILTER) continue;
    results.push(await processPortrait(slug, { force }));
  }
  return results;
}

async function main() {
  const results = await processAllPortraits({ force: FORCE });
  const ok = results.filter((r) => r.status === 'ok');
  const missing = results.filter((r) => r.status === 'missing');

  console.log(`Processed ${ok.length} portraits (${missing.length} missing source)`);
  for (const r of ok) {
    const sizes = r.derived.filter((d) => d.status === 'ok').map((d) => d.size).join(', ');
    console.log(`  ✓ ${r.slug} — ${r.master} @ ${r.position}${sizes ? ` → [${sizes}]` : ''}`);
  }
  for (const r of missing) {
    console.log(`  · ${r.slug} — no source`);
  }
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
