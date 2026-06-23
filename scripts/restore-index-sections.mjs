import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const indexPath = path.join(root, 'index.html');

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function mainFrom(file) {
  const html = read(file);
  const open = html.indexOf('<main id="main">');
  if (open === -1) throw new Error(`No <main> in ${file}`);
  const contentStart = open + '<main id="main">'.length;
  const close = html.indexOf('</main>', contentStart);
  if (close === -1) throw new Error(`No </main> in ${file}`);
  return html.slice(contentStart, close).trim();
}

function sliceBetween(html, start, end) {
  const s = html.indexOf(start);
  if (s === -1) throw new Error(`Missing marker: ${start}`);
  const e = end ? html.indexOf(end, s) : html.length;
  if (e === -1) throw new Error(`Missing marker: ${end}`);
  return html.slice(s, e).trim();
}

const index = read('index.html');
if ((index.match(/<!DOCTYPE html>/gi) || []).length > 1) {
  throw new Error('index.html looks corrupted (multiple DOCTYPE). Fix manually before running restore-index-sections.');
}

const head = index.slice(0, index.indexOf('</head>') + '</head>'.length);
const nav = sliceBetween(index, '<!-- NAV -->', '</header>') + '\n</header>';
const footer = sliceBetween(index, '<!-- FOOTER -->', '<div id="agentation-root">');
const modal = sliceBetween(read('meet-the-athletes.html'), '<!-- MODAL', '<div id="agentation-root">');
const tail = index.slice(index.indexOf('<div id="agentation-root">'));

const landingCore = sliceBetween(index, '<!-- HERO -->', '<!-- ROSTER -->');

// Index roster is the carousel — never paste the full meet-the-athletes grid here.
const roster = sliceBetween(index, '<!-- ROSTER -->', '<!-- LATEST MOVEMENT -->');
const transfer = fs.readFileSync(path.join(__dirname, 'snippets/transfer-landing.html'), 'utf8').trim();
const leadership = fs.readFileSync(path.join(__dirname, 'snippets/leadership-landing.html'), 'utf8').trim();
const brand = mainFrom('brand.html');
const join = mainFrom('join.html');

const landingMain = `${landingCore}

${roster}

${transfer}

${brand}

${leadership}

${join}`;

const output = `${head}
<body>

<a href="#main" class="skip-link">Skip to content</a>

${nav}

<main id="main">

${landingMain}

</main>

${footer}

${modal}
${tail}`;

fs.writeFileSync(indexPath, output);
console.log('Restored full section copies on index.html');
