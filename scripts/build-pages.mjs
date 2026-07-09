function mainFrom(file) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const open = html.indexOf('<main id="main">');
  const contentStart = open + '<main id="main">'.length;
  const close = html.indexOf('</main>', contentStart);
  return html.slice(contentStart, close).trim();
}

function transferLandingFrom(html) {
  const s = html.indexOf('<!-- LATEST MOVEMENT -->');
  if (s === -1) return '';
  const brand = html.indexOf('<!-- BRAND PARTNERSHIPS -->', s);
  if (brand !== -1) return html.slice(s, brand).trim();
  const close = html.indexOf('</main>', s);
  if (close === -1) throw new Error('transfer.html: missing </main> after LATEST MOVEMENT');
  return html.slice(s, close).trim();
}

function leadershipLandingFrom(html) {
  const s = html.indexOf('<!-- LEADERSHIP & AGENTS -->');
  if (s === -1) return leadershipLanding;
  const e = html.indexOf('<!-- JOIN -->', s);
  if (e === -1) throw new Error('index.html missing <!-- JOIN --> after leadership');
  const block = html.slice(s, e).trim();
  if (block.includes('leadership-page')) return leadershipLanding;
  return block;
}import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
execSync('node scripts/generate-athletes-data.mjs', { cwd: root, stdio: 'inherit' });
execSync('node scripts/generate-transfers-data.mjs', { cwd: root, stdio: 'inherit' });
execSync('node scripts/generate-demo-marketing-data.mjs', { cwd: root, stdio: 'inherit' });
execSync('node scripts/generate-athlete-magazine-data.mjs', { cwd: root, stdio: 'inherit' });
const indexPath = path.join(root, 'index.html');
const leadershipLanding = fs.readFileSync(path.join(__dirname, 'snippets/leadership-landing.html'), 'utf8').trim();
const transferLanding = fs.readFileSync(path.join(__dirname, 'snippets/transfer-landing.html'), 'utf8').trim();
const brandLanding = fs.readFileSync(path.join(__dirname, 'snippets/brand-landing.html'), 'utf8').trim();
const joinLanding = fs.readFileSync(path.join(__dirname, 'snippets/join-landing.html'), 'utf8').trim();
const getStartedMain = fs.readFileSync(path.join(__dirname, 'snippets/get-started-main.html'), 'utf8').trim();
const aboutMain = fs.readFileSync(path.join(__dirname, 'snippets/about-main.html'), 'utf8').trim();

const NAV_CTA_ARROW = '<svg class="nav-cta-arrow" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M2 12L12 2M5 2h7v7"/></svg>';

function navCta(current) {
  const isCurrent = current === 'get-started';
  return `<a class="nav-cta" href="get-started.html"${isCurrent ? ' aria-current="page"' : ''}><span class="nav-cta-label">Get Started</span>${NAV_CTA_ARROW}</a>`;
}
const index = fs.readFileSync(indexPath, 'utf8');

function sliceBetween(start, end) {
  const s = index.indexOf(start);
  if (s === -1) throw new Error(`Missing marker: ${start}`);
  const e = end ? index.indexOf(end, s) : index.length;
  if (e === -1) throw new Error(`Missing marker: ${end}`);
  return index.slice(s, e).trim();
}

function sliceBetweenIn(html, start, end) {
  const s = html.indexOf(start);
  if (s === -1) throw new Error(`Missing marker: ${start}`);
  const e = end ? html.indexOf(end, s) : html.length;
  if (e === -1) throw new Error(`Missing marker: ${end}`);
  return html.slice(s, e).trim();
}

const head = index.slice(0, index.indexOf('</head>') + '</head>'.length);
const footer = sliceBetween('<!-- FOOTER -->', '<!-- MODAL');
const modal = sliceBetween('<!-- MODAL', '<div id="agentation-root">');
const tail = index.slice(index.indexOf('<div id="agentation-root">'));

function nav(current) {
  const link = (href, label, key) => {
    const isCurrent = current === key;
    return `<a href="${href}"${isCurrent ? ' aria-current="page"' : ''}>${label}</a>`;
  };

  return `<!-- NAV -->
<header class="nav-header">
  <nav class="nav" aria-label="Primary">
    <div class="nav-left">
      <a href="index.html" class="nav-brand">
        <img src="assets/logo-white.png" alt="Second Wind Pro" class="nav-logo" width="300" height="132" />
      </a>
    </div>
    <ul class="nav-links">
      <li class="nav-dropdown">
        <button type="button" class="nav-dropdown-toggle" aria-label="Show Roster menu" aria-haspopup="true" aria-expanded="false">
          Roster
          <svg class="nav-dropdown-chevron" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 3.5L5 6.5L8 3.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <ul class="nav-submenu">
          <li>${link('meet-the-athletes.html', 'Meet the Athletes', 'athletes')}</li>
          <li>${link('transfer.html', 'Transfers', 'transfer')}</li>
        </ul>
      </li>
      <li>${link('leadership.html', 'Leadership', 'leadership')}</li>
      <li class="nav-dropdown">
        <button type="button" class="nav-dropdown-toggle" aria-label="Show Resources menu" aria-haspopup="true" aria-expanded="false">
          Resources
          <svg class="nav-dropdown-chevron" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 3.5L5 6.5L8 3.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <ul class="nav-submenu">
          <li>${link('about.html', 'About Us', 'about')}</li>
          <li>${link('careers.html', 'Careers', 'careers')}</li>
        </ul>
      </li>
    </ul>
    <div class="nav-actions">
      <button type="button" class="nav-toggle" aria-expanded="false" aria-controls="nav-drawer" aria-label="Open menu">
        <span class="nav-toggle-bars" aria-hidden="true"></span>
      </button>
      ${navCta(current)}
    </div>
  </nav>

  <div class="nav-scrim" aria-hidden="true" hidden></div>

  <aside class="nav-drawer" id="nav-drawer" aria-hidden="true" inert>
    <div class="nav-drawer-card">
      <ul class="nav-drawer-list">
        <li class="nav-drawer-group">
          <button type="button" class="nav-drawer-trigger" aria-expanded="false" aria-controls="nav-drawer-roster">
            Roster <span class="nav-drawer-plus" aria-hidden="true">+</span>
          </button>
          <ul class="nav-drawer-sub" id="nav-drawer-roster" hidden>
            <li>${link('meet-the-athletes.html', 'Meet the Athletes', 'athletes')}</li>
            <li>${link('transfer.html', 'Transfers', 'transfer').replace('<a ', '<a class="nav-drawer-sub-link" ')}</li>
          </ul>
        </li>
        <li>${link('leadership.html', 'Leadership', 'leadership')}</li>
        <li class="nav-drawer-group">
          <button type="button" class="nav-drawer-trigger" aria-expanded="false" aria-controls="nav-drawer-sub">
            Resources <span class="nav-drawer-plus" aria-hidden="true">+</span>
          </button>
          <ul class="nav-drawer-sub" id="nav-drawer-sub" hidden>
            <li>${link('about.html', 'About Us', 'about')}</li>
            <li>${link('careers.html', 'Careers', 'careers')}</li>
          </ul>
        </li>
      </ul>
    </div>
  </aside>
</header>`;
}

function footerHtml() {
  return footer
    .replace('href="#roster"', 'href="meet-the-athletes.html"')
    .replace('>Roster</a>', '>Meet the Athletes</a>')
    .replace('href="#transfer"', 'href="transfer.html"')
    .replace('href="#brand"', 'href="brand.html"')
    .replace('href="#leadership"', 'href="leadership.html"')
    .replace('href="#agency"', 'href="about.html"')
    .replace('href="#careers"', 'href="careers.html"');
}

function transferForLanding(html) {
  return html
    .replace(/\s*<div class="transfer-live-bar"[\s\S]*?<\/div>\s*\n\s*<\/div>\s*\n/, '\n    </div>\n\n')
    .replace(/\s*<div class="wire-row" data-transfer="devon-park"[\s\S]*?<\/div>\s*\n/, '\n')
    .replace('wire-row wire-row-live', 'wire-row')
    .replace(
      '<h2 id="transfer-heading">Strategic placements <em>&amp; commitments.</em></h2>\n      </div>',
      '<h2 id="transfer-heading">Strategic placements, <em>made visible.</em></h2>\n        <p class="desc">Confirmed signings and portal commitments from the college football athletes we represent.</p>\n      </div>'
    );
}

function pageTail({ withAthleteMagazineData = false } = {}) {
  let scripts = tail;
  if (!scripts.includes('portraits.js')) {
    scripts = scripts.replace(
      '<script src="js/athletes-data.js" defer></script>',
      '<script src="js/portraits.js" defer></script>\n<script src="js/athletes-data.js" defer></script>'
    );
    if (!scripts.includes('portraits.js')) {
      scripts = scripts.replace(
        '<script src="js/main.js" defer></script>',
        '<script src="js/portraits.js" defer></script>\n<script src="js/main.js" defer></script>'
      );
    }
  }
  if (!scripts.includes('athletes-data.js')) {
    scripts = scripts.replace(
      '<script src="js/main.js" defer></script>',
      '<script src="js/athletes-data.js" defer></script>\n<script src="js/main.js" defer></script>'
    );
  }
  if (!scripts.includes('demo-marketing-data.js')) {
    scripts = scripts.replace(
      '<script src="js/main.js" defer></script>',
      '<script src="js/demo-marketing-data.js" defer></script>\n<script src="js/main.js" defer></script>'
    );
  }
  if (withAthleteMagazineData) {
    scripts = scripts.replace(
      '<script src="js/main.js" defer></script>',
      '<script src="js/athlete-magazine-data.js" defer></script>\n<script src="js/main.js" defer></script>'
    );
  }
  return scripts;
}

function page({ file, title, description, current, main, withModal = false, withTemplates = false, withAthleteMagazineData = false, rootAssets = false }) {
  const pageHead = head
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(
      /content="Second Wind Pro — the modern athlete's NIL agency\.[^"]*"/,
      `content="${description}"`
    )
    .replace(
      /<meta charset="UTF-8" \/>/,
      rootAssets
        ? '<meta charset="UTF-8" />\n  <base href="/" />'
        : '<meta charset="UTF-8" />'
    );

  const templates = withTemplates
    ? `\n${sliceBetween('<template id="svc-vis-0">', '  </section>\n\n  <!-- ROSTER -->')}\n`
    : '';

  const body = `${pageHead}
<body>

<a href="#main" class="skip-link">Skip to content</a>

${nav(current)}

<main id="main">

${main}

</main>

${footerHtml()}

${withModal ? `\n${modal}\n` : ''}
${pageTail({ withAthleteMagazineData })}`;

  fs.writeFileSync(path.join(root, file), body);
}

function rosterCarouselFrom(html) {
  const s = html.indexOf('<!-- ROSTER -->');
  if (s === -1) throw new Error('Missing marker: <!-- ROSTER -->');
  const transfer = html.indexOf('<!-- LATEST MOVEMENT -->', s);
  const brand = html.indexOf('<!-- BRAND PARTNERSHIPS -->', s);
  const end = transfer !== -1 ? transfer : brand;
  if (end === -1) throw new Error('Missing marker after roster: LATEST MOVEMENT or BRAND PARTNERSHIPS');
  return html.slice(s, end).trim();
}

const rosterLanding = fs.existsSync(path.join(__dirname, 'snippets/roster-landing.html'))
  ? fs.readFileSync(path.join(__dirname, 'snippets/roster-landing.html'), 'utf8').trim()
  : rosterCarouselFrom(index);
const athletesPage = mainFrom('meet-the-athletes.html');
const transfer = mainFrom('transfer.html');
const brand = mainFrom('brand.html');
const leadership = mainFrom('leadership.html');
const join = getStartedMain;
const agency = sliceBetween('<!-- AGENCY STATEMENT -->', '<!-- BENTO SERVICES -->');

const careers = `  <section class="page-intro" aria-labelledby="careers-heading">
    <div class="section-head">
      <div>
        <span class="eyebrow">Resources — Careers</span>
        <h2 id="careers-heading">Build the future of <em>athlete representation.</em></h2>
        <p class="desc">We're assembling operators, agents, and strategists who treat NIL like a professional discipline—not a side hustle.</p>
      </div>
    </div>
    <div class="contact-cta">
      <a href="mailto:careers@secondwind.pro" class="btn-outline btn-primary">Email careers@secondwind.pro</a>
    </div>
  </section>`;

const contactUs = mainFrom('contact-us.html');

const athleteProfileMain = fs.readFileSync(path.join(__dirname, 'snippets/athlete-profile-main.html'), 'utf8')
  .replace(/^<main id="main"[^>]*>\s*/i, '')
  .replace(/\s*<\/main>\s*$/i, '')
  .trim();

page({
  file: 'athlete.html',
  title: 'Athlete Profile — Second Wind Pro',
  description: 'Athlete profile — Second Wind Pro represented talent for NIL partnerships.',
  current: 'athletes',
  main: athleteProfileMain,
  withAthleteMagazineData: true,
  rootAssets: true,
});

page({
  file: 'meet-the-athletes.html',
  title: 'Meet the Athletes — Second Wind Pro',
  description: 'Meet Second Wind Pro athletes — elite football and basketball talent represented for NIL partnerships.',
  current: 'athletes',
  main: athletesPage,
  withModal: true,
});

page({
  file: 'transfer.html',
  title: 'Transfers — Second Wind Pro',
  description: 'Latest transfer portal moves and commitments from Second Wind Pro athletes.',
  current: 'transfer',
  main: transfer,
  withModal: true,
});

page({
  file: 'brand.html',
  title: 'Brand Partnerships — Second Wind Pro',
  description: 'Partner with Second Wind Pro athletes through brand activations, appearances, and hyper-local campaigns.',
  current: 'brand',
  main: brand,
});

page({
  file: 'leadership.html',
  title: 'Leadership — Second Wind Pro',
  description: 'Meet the Second Wind Pro leadership team and agents behind every deal.',
  current: 'leadership',
  main: leadership,
});

page({
  file: 'about.html',
  title: 'About Us — Second Wind Pro',
  description: 'About Second Wind Pro — founder Luke Mazur, our mission, and how we serve athletes and universities in the pay-to-play era.',
  current: 'about',
  main: aboutMain,
});

page({
  file: 'careers.html',
  title: 'Careers — Second Wind Pro',
  description: 'Careers at Second Wind Pro — join the team redefining athlete representation.',
  current: 'careers',
  main: careers,
});

page({
  file: 'contact-us.html',
  title: 'Contact Us — Second Wind Pro',
  description: 'Contact Second Wind Pro — partnerships, representation, and general inquiries.',
  current: 'contact',
  main: contactUs,
});

page({
  file: 'get-started.html',
  title: 'Get Started — Second Wind Pro',
  description: 'Get started with Second Wind Pro — representation for elite athletes and partners.',
  current: 'get-started',
  main: join,
});

function buildIndexFromPages() {
  const currentIndex = fs.readFileSync(indexPath, 'utf8');
  if ((currentIndex.match(/<!DOCTYPE html>/gi) || []).length > 1) {
    throw new Error('index.html looks corrupted (multiple DOCTYPE). Fix manually before running build-pages.');
  }
  const hero = currentIndex.indexOf('<!-- HERO -->');
  const roster = currentIndex.indexOf('<!-- ROSTER -->', hero);
  if (hero === -1 || roster === -1) throw new Error('index.html missing <!-- HERO --> or <!-- ROSTER --> markers');
  const landingCore = currentIndex.slice(hero, roster).trim();

  const landingMain = `${landingCore}

${rosterLanding}

${transferLanding}

${brandLanding}

${leadershipLandingFrom(currentIndex)}

${joinLanding}`;

  const cleanHead = head
    .replace(/<title>.*?<\/title>/, '<title>Second Wind Pro — The Modern Athlete\'s NIL Agency</title>');

  const modalBlock = sliceBetweenIn(
    fs.readFileSync(path.join(root, 'meet-the-athletes.html'), 'utf8'),
    '<!-- MODAL',
    '<div id="agentation-root">'
  );

  const landingIndex = `${cleanHead}
<body>

<a href="#main" class="skip-link">Skip to content</a>

${nav('home')}

<main id="main">
${landingMain}
</main>

${footerHtml()}

${modalBlock}
${tail}`;

  fs.writeFileSync(indexPath, landingIndex);
}

// Trim index.html — landing + copies of all subpage sections
buildIndexFromPages();

console.log('Built: athlete.html, meet-the-athletes.html, transfer.html, brand.html, leadership.html, about.html, careers.html, contact-us.html, get-started.html');
console.log('Updated: index.html (landing only)');
