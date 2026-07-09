import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/1uiHvwBDt7ojTfgtp7oxP4J0cz-e7wtHHNJCbmIAT9jM/gviz/tq?tqx=out:csv&sheet=Players';

const TRANSFERS_CSV_URL =
  'https://docs.google.com/spreadsheets/d/1uiHvwBDt7ojTfgtp7oxP4J0cz-e7wtHHNJCbmIAT9jM/gviz/tq?tqx=out:csv&sheet=Transfers';

function parseCsvLine(line) {
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      out.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export { slugify };

function initials(name) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function normalizeYear(year) {
  return String(year || '')
    .replace(/Redh?sirt/gi, 'Redshirt')
    .trim();
}

export async function fetchRosterRows() {
  const res = await fetch(SHEET_CSV_URL);
  if (!res.ok) throw new Error(`Failed to fetch roster sheet (${res.status})`);
  return parseRosterCsv(await res.text());
}

export function loadRosterRowsFromFile(filePath) {
  const csvPath = filePath || path.join(root, 'data/roster-players.csv');
  if (!fs.existsSync(csvPath)) {
    throw new Error(`Missing roster CSV at ${csvPath}`);
  }
  return parseRosterCsv(fs.readFileSync(csvPath, 'utf8'));
}

function parseRosterCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const header = parseCsvLine(lines[0]);
  const nameIdx = header.indexOf('Name');
  const positionIdx = header.indexOf('Position');
  const yearIdx = header.indexOf('Year');
  const schoolIdx = header.indexOf('School');
  const agentIdx = header.indexOf('Agent');
  const hometownIdx = header.indexOf('Hometown');

  return lines.slice(1).map((line) => {
    const cols = parseCsvLine(line);
    const name = cols[nameIdx]?.trim();
    if (!name) return null;
    const position = cols[positionIdx]?.trim() || '';
    const year = normalizeYear(cols[yearIdx]?.trim());
    const school = cols[schoolIdx]?.trim() || '';
    const agent = cols[agentIdx]?.trim() || '';
    const hometown = cols[hometownIdx]?.trim() || '';
    const slug = slugify(name);
    return {
      slug,
      name,
      position,
      year,
      school,
      agent,
      hometown,
      positionLine: `${position} · ${year}`,
      photo: initials(name),
      athleticLevel: `${year} · ${school}`,
    };
  }).filter(Boolean);
}

export async function fetchTransferRows() {
  const res = await fetch(TRANSFERS_CSV_URL);
  if (!res.ok) throw new Error(`Failed to fetch transfers sheet (${res.status})`);
  const csv = await res.text();
  fs.mkdirSync(path.join(root, 'data'), { recursive: true });
  fs.writeFileSync(path.join(root, 'data/transfers.csv'), csv);
  return parseTransfersCsv(csv);
}

export function loadTransferRowsFromFile(filePath) {
  const csvPath = filePath || path.join(root, 'data/transfers.csv');
  if (!fs.existsSync(csvPath)) return [];
  return parseTransfersCsv(fs.readFileSync(csvPath, 'utf8'));
}

function parseTransfersCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  if (!lines.length) return [];
  const header = parseCsvLine(lines[0]);
  const playerIdx = header.indexOf('Player');
  const windowIdx = header.indexOf('Window');
  const sportIdx = header.indexOf('Sport');
  const fromIdx = header.indexOf('from');
  const toIdx = header.indexOf('to');

  return lines.slice(1).map((line) => {
    const cols = parseCsvLine(line);
    const name = cols[playerIdx]?.trim();
    if (!name) return null;
    const fromSchool = cols[fromIdx]?.trim() || '';
    const toSchool = cols[toIdx]?.trim() || '';
    return {
      slug: slugify(name),
      name,
      window: cols[windowIdx]?.trim() || '',
      sport: cols[sportIdx]?.trim() || 'Football',
      fromSchool,
      toSchool,
    };
  }).filter(Boolean);
}

export function loadPortraitUrls() {
  const file = path.join(root, 'data/roster-portrait-urls.json');
  if (!fs.existsSync(file)) return {};
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export async function downloadPortrait(slug, url, { force = false } = {}) {
  if (!url) return false;
  const dir = path.join(root, 'assets/portraits/athletes');
  fs.mkdirSync(dir, { recursive: true });
  const dest = path.join(dir, `${slug}.jpg`);
  if (fs.existsSync(dest) && !force) return true;

  const res = await fetch(url);
  if (!res.ok) return false;
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return true;
}
