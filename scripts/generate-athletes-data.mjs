import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { portraitFocusFromFile } from './portrait-focus.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const FOOTBALL_AGENTS = ['Luke Bramwell', 'Luke Bramwell', 'Eli Okonkwo', 'Eli Okonkwo'];
const BASKETBALL_AGENTS = ['Lenny Vasquez', 'Lenny Vasquez', 'Sofia Ruiz'];

const SCHOOLS = [
  ['University of Alabama', 'UA', '#9e1b32'],
  ['University of Michigan', 'MICH', '#00274c'],
  ['USC', 'USC', '#990000'],
  ['University of Florida', 'UF', '#0021a5'],
  ['Clemson University', 'CLEM', '#f56600'],
  ['University of Tennessee', 'TENN', '#ff8200'],
  ['Penn State', 'PSU', '#041e42'],
  ['University of Miami', 'MIA', '#f47321'],
  ['University of Oklahoma', 'OU', '#841617'],
  ['Texas A&M', 'TAMU', '#500000'],
  ['University of Washington', 'UW', '#4b2e83'],
  ['University of Wisconsin', 'WISC', '#c5050c'],
  ['Auburn University', 'AUB', '#0c2340'],
  ['University of Notre Dame', 'ND', '#0c2340'],
  ['Stanford University', 'STAN', '#8c1515'],
];

const BASKETBALL_SCHOOLS = [
  ['University of Kansas', 'KU', '#0051ba'],
  ['University of Kentucky', 'UK', '#0033a0'],
  ['University of North Carolina', 'UNC', '#7bafd4'],
  ['Villanova University', 'NOVA', '#00205b'],
  ['Gonzaga University', 'ZAG', '#c8102e'],
  ['UConn', 'UCONN', '#000e2f'],
  ['Houston', 'HOU', '#c8102e'],
  ['Marquette University', 'MARQ', '#003366'],
  ['Baylor University', 'BAY', '#154734'],
];

const FOOTBALL_SEED = [
  { preserve: true, name: 'Marcus Lane', position: 'QB · Class of 2027', photo: 'ML', agent: 'Luke Bramwell', athleticLevel: '5-Star QB · National #1', hometown: 'Phoenix, Arizona', university: 'University of Texas', presentability: 'Executive-ready on camera; trusted in live interview settings', bio: 'Marcus is a dual-threat quarterback known for command at the line and poise in high-pressure drives. He is active in local youth camps and is consistently one of the strongest interview performers in his class.', accomplishments: ['Elite 11 finalist', 'State champion (2025)', 'Regional NIL camp ambassador'], stats: [['3,847', 'Passing yards'], ['32', 'Touchdowns'], ['68.4%', 'Completion rate'], ['5-Star', 'Recruit rating'], ['#1', 'National rank'], ['9.2', 'QBR']], status: 'committed', from: { name: 'Phoenix Heritage HS', logo: 'PH', color: '#7c1d1d' }, to: { name: 'University of Texas', logo: 'UT', color: '#bf5700', logoSrc: 'assets/schools/texas.png' }, signed: 'February 14, 2026' },
  { preserve: true, name: 'Caleb Mooney', position: 'WR · Junior', photo: 'CM', agent: 'Luke Bramwell', status: 'represented', athleticLevel: 'Top-10 National WR', hometown: 'Baton Rouge, Louisiana', university: 'LSU', presentability: 'Charismatic speaker with high fan-event conversion', bio: 'Caleb is an explosive receiver with high route discipline and consistent production against top competition. He brings high energy to community and fan activations, especially youth-focused events.', accomplishments: ['All-Conference selection', '1,200+ receiving yards season', 'Team captain'], stats: [['1,210', 'Receiving yards'], ['9', 'Touchdowns'], ['16.8', 'Yards per catch'], ['All-Conf', 'Conference honors'], ['#8', 'National WR rank'], ['78', 'Receptions']], from: { name: 'Baton Rouge High', logo: 'BR', color: '#461d7c' }, to: { name: 'LSU', logo: 'LSU', color: '#461d7c' } },
  { preserve: true, name: 'Trey Holloway', position: 'Edge · Class of 2026', photo: 'TH', agent: 'Luke Bramwell', status: 'represented', athleticLevel: 'Top-10 National Edge', hometown: 'Atlanta, Georgia', university: 'University of Georgia', presentability: 'Disciplined spokesperson with strong team-first tone', bio: 'Trey is a disruptive edge rusher with elite closing speed and disciplined technique. His personality and communication style perform well for team culture, performance, and training-focused campaigns.', accomplishments: ['5-Star recruit', '17.5 sacks in season', 'Defensive MVP (state final)'], stats: [['17.5', 'Sacks'], ['74', 'Tackles'], ['12', 'Tackles for loss'], ['Top-10', 'National rank'], ['4', 'Forced fumbles'], ['5-Star', 'Recruit rating']], from: { name: 'Westlake High', logo: 'WL', color: '#ba0c2f' }, to: { name: 'University of Georgia', logo: 'UGA', color: '#ba0c2f' } },
  { preserve: true, name: 'Devon Park', position: 'RB · Senior', photo: 'DP', agent: 'Luke Bramwell', athleticLevel: 'Top-3 National RB', hometown: 'Eugene, Oregon', university: 'Ohio State University', presentability: 'Veteran media presence; polished in long-form interviews', bio: 'Devon is a versatile running back with downhill power and proven receiving production. He offers immediate credibility for performance, apparel, and leadership-driven brand stories.', accomplishments: ['Heisman watch list', '1,500+ rushing yards', '18 total touchdowns'], stats: [['1,560', 'Rushing yards'], ['18', 'Touchdowns'], ['5.8', 'Yards per carry'], ['Heisman', 'Watch list'], ['#3', 'National RB rank'], ['52', 'Receptions']], status: 'portal', from: { name: 'University of Oregon', logo: 'OR', color: '#154733', logoSrc: 'assets/schools/oregon.png' }, to: { name: 'Ohio State University', logo: 'OSU', color: '#a71930', logoSrc: 'assets/schools/ohio-state.png' }, signed: 'January 30, 2026' },
  { name: 'Jordan Blake', position: 'QB · Class of 2026', athleticLevel: '4-Star Pro-Style QB', hometown: 'Dallas, Texas', university: 'University of Alabama' },
  { name: 'Malik Rivers', position: 'WR · Sophomore', athleticLevel: 'All-Conference WR', hometown: 'Miami, Florida', university: 'University of Miami' },
  { name: 'Chris Dalton', position: 'TE · Junior', athleticLevel: 'Mackey Award Watch', hometown: 'Columbus, Ohio', university: 'Ohio State University' },
  { name: 'Andre Coleman', position: 'OT · Senior', athleticLevel: 'All-American OL', hometown: 'Birmingham, Alabama', university: 'University of Alabama' },
  { name: 'Tyler Nash', position: 'CB · Class of 2027', athleticLevel: 'Top-15 National CB', hometown: 'Charlotte, North Carolina', university: 'Clemson University' },
  { name: 'Ryan Mercer', position: 'LB · Junior', athleticLevel: 'Butkus Award Candidate', hometown: 'Nashville, Tennessee', university: 'University of Tennessee' },
  { name: 'Darius Webb', position: 'RB · Class of 2026', athleticLevel: '4-Star All-Purpose Back', hometown: 'Houston, Texas', university: 'Texas A&M' },
  { name: 'Noah Griffin', position: 'Edge · Sophomore', athleticLevel: 'Double-Digit Sack Season', hometown: 'State College, Pennsylvania', university: 'Penn State' },
  { name: 'Ethan Brooks', position: 'S · Senior', athleticLevel: 'Thorpe Award Semifinalist', hometown: 'Tampa, Florida', university: 'University of Florida' },
  { name: 'Jamal Ortiz', position: 'WR · Class of 2027', athleticLevel: 'Top-20 National WR', hometown: 'Los Angeles, California', university: 'USC' },
  { name: 'Cameron Ellis', position: 'DL · Junior', athleticLevel: 'All-Power Four Interior', hometown: 'Detroit, Michigan', university: 'University of Michigan' },
  { name: 'Logan Pierce', position: 'QB · Sophomore', athleticLevel: 'Rising Portal QB', hometown: 'Norman, Oklahoma', university: 'University of Oklahoma' },
  { name: 'Isaiah Grant', position: 'CB · Junior', athleticLevel: 'Lockdown Corner', hometown: 'Seattle, Washington', university: 'University of Washington' },
  { name: 'Mason Reid', position: 'LB · Class of 2026', athleticLevel: '4-Star Instinct Linebacker', hometown: 'Madison, Wisconsin', university: 'University of Wisconsin' },
  { name: 'Cole Bennett', position: 'K · Senior', athleticLevel: 'Lou Groza Award Finalist', hometown: 'Auburn, Alabama', university: 'Auburn University' },
  { name: 'Victor Santos', position: 'WR · Senior', athleticLevel: '1,000+ Yard Receiver', hometown: 'San Antonio, Texas', university: 'University of Texas' },
  { name: 'Grant Holloway', position: 'OL · Junior', athleticLevel: 'Multi-Year Starter', hometown: 'South Bend, Indiana', university: 'University of Notre Dame' },
  { name: 'Parker Walsh', position: 'Edge · Class of 2027', athleticLevel: 'Top-25 National Edge', hometown: 'Palo Alto, California', university: 'Stanford University' },
  { name: 'Terrell Knox', position: 'RB · Junior', athleticLevel: 'Workhorse Back', hometown: 'Jacksonville, Florida', university: 'University of Florida' },
  { name: 'Sean Murphy', position: 'QB · Senior', athleticLevel: 'Graduate Transfer QB', hometown: 'Tucson, Arizona', university: 'USC' },
];

const BASKETBALL_SEED = [
  { preserve: true, name: 'Idris Vale', position: 'PG · Class of 2026', photo: 'IV', agent: 'Lenny Vasquez', athleticLevel: 'Top-25 National Guard', hometown: 'Newark, New Jersey', university: 'Duke University', presentability: 'Strong social presence with clean brand alignment history', bio: 'Idris is a scoring point guard with advanced pace control and high-assist playmaking. Off the floor, he is known for polished social content and a dependable, sponsor-friendly media style.', accomplishments: ['Jordan Brand Classic invite', 'EYBL All-Circuit First Team', 'State Player of the Year finalist'], stats: [['24.3', 'Points per game'], ['7.2', 'Assists'], ['4.1', 'Rebounds'], ['Top-25', 'National rank'], ['43%', '3-point %'], ['18', 'Games played']], status: 'signed', from: { name: 'Montverde Academy', logo: 'MN', color: '#3d3d3d' }, to: { name: 'Duke University', logo: 'DUKE', color: '#0d2240', logoSrc: 'assets/schools/duke.png' }, signed: 'December 9, 2025' },
  { preserve: true, name: 'Sienna Hart', position: 'SG · AAU Top 50', photo: 'SH', agent: 'Lenny Vasquez', status: 'represented', athleticLevel: 'AAU Top-50 Wing', hometown: 'San Diego, California', university: 'UCLA (commit target)', presentability: 'Camera-confident storyteller with premium lifestyle fit', bio: 'Sienna is a two-way wing whose perimeter defense and shooting range translate across systems. She is especially strong in beauty, wellness, and lifestyle storytelling partnerships.', accomplishments: ['EYBL top scorer (regional)', 'Top-50 AAU ranking', 'Nike circuit standout'], stats: [['19.8', 'Points per game'], ['5.4', 'Assists'], ['3.8', 'Steals'], ['Top-50', 'National rank'], ['41%', '3-point %'], ['EYBL', 'Circuit']], from: { name: 'Hoover High', logo: 'HV', color: '#2d68c4' }, to: { name: 'UCLA', logo: 'UCLA', color: '#2d68c4' } },
  { name: 'Avery Collins', position: 'SF · Class of 2027', athleticLevel: 'Top-30 National Forward', hometown: 'Chicago, Illinois', university: 'University of Kansas' },
  { name: 'Miles Carter', position: 'PG · Sophomore', athleticLevel: 'SEC Newcomer of the Year', hometown: 'Lexington, Kentucky', university: 'University of Kentucky' },
  { name: 'Jalen Brooks', position: 'SG · Junior', athleticLevel: 'All-ACC First Team', hometown: 'Raleigh, North Carolina', university: 'University of North Carolina' },
  { name: 'Derek Lawson', position: 'PF · Senior', athleticLevel: 'Double-Double Machine', hometown: 'Philadelphia, Pennsylvania', university: 'Villanova University' },
  { name: 'Kai Mendoza', position: 'C · Class of 2026', athleticLevel: 'Rim-Protecting Big', hometown: 'Spokane, Washington', university: 'Gonzaga University' },
  { name: 'Tyrese Holland', position: 'PG · Junior', athleticLevel: 'National Champion Contributor', hometown: 'Hartford, Connecticut', university: 'UConn' },
  { name: 'Brandon Tate', position: 'SF · Sophomore', athleticLevel: 'Two-Way Wing', hometown: 'Houston, Texas', university: 'Houston' },
  { name: 'Nico Alvarez', position: 'SG · Class of 2027', athleticLevel: 'Elite Shooter', hometown: 'Milwaukee, Wisconsin', university: 'Marquette University' },
  { name: 'Jordan Ellis', position: 'PF · Junior', athleticLevel: 'Big 12 Defensive Player', hometown: 'Waco, Texas', university: 'Baylor University' },
];

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function initials(name) {
  return name.split(/\s+/).map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

function defaultBio(name, sport, university) {
  return `${name.split(' ')[0]} is a represented ${sport} athlete at ${university}, known for consistent on-field production and a professional approach to NIL and media opportunities.`;
}

function defaultPresentability() {
  const lines = [
    'Polished on camera with strong sponsor alignment',
    'High community engagement and fan-event conversion',
    'Trusted voice for performance and lifestyle brands',
    'Clean social presence with national reach',
    'Executive-ready in interview and activation settings',
  ];
  return lines[Math.floor(Math.random() * lines.length)];
}

function attachPortraitMeta(slug, data) {
  const portraitPath = path.join(root, 'assets/portraits/athletes', `${slug}.jpg`);
  if (fs.existsSync(portraitPath)) {
    data.photoPosition = portraitFocusFromFile(portraitPath);
  }
  return data;
}

function buildAthlete(entry, basketball, index) {
  const slug = slugify(entry.name);
  if (entry.preserve) {
    const { preserve, ...data } = entry;
    return { slug, data: attachPortraitMeta(slug, { ...data, basketball, photoSrc: `assets/portraits/athletes/${slug}.jpg` }) };
  }
  const agent = entry.agent || (basketball ? BASKETBALL_AGENTS[index % BASKETBALL_AGENTS.length] : FOOTBALL_AGENTS[index % FOOTBALL_AGENTS.length]);
  const schoolPool = basketball ? BASKETBALL_SCHOOLS : SCHOOLS;
  const school = schoolPool.find(([name]) => name === entry.university) || schoolPool[index % schoolPool.length];
  const [schoolName, logo, color] = school;

  return {
    slug,
    data: attachPortraitMeta(slug, {
      name: entry.name,
      position: entry.position,
      photo: initials(entry.name),
      basketball,
      agent,
      athleticLevel: entry.athleticLevel || (basketball ? 'Represented Guard/Forward' : 'Represented Football Talent'),
      hometown: entry.hometown || 'United States',
      university: entry.university || schoolName,
      presentability: defaultPresentability(),
      bio: entry.bio || defaultBio(entry.name, basketball ? 'basketball' : 'football', entry.university || schoolName),
      accomplishments: [
        basketball ? 'Circuit standout' : 'All-conference honors',
        'Team captain or leadership role',
        'Community camp ambassador',
      ],
      stats: basketball
        ? [['18.5', 'Points per game'], ['4.2', 'Rebounds'], ['3.1', 'Assists'], ['Top-50', 'National rank'], ['38%', '3-point %'], ['32', 'Games played']]
        : [['1,050', 'Yards'], ['10', 'Touchdowns'], ['All-Conf', 'Honors'], ['Top-100', 'National rank'], ['4-Star', 'Rating'], ['12', 'Starts']],
      status: entry.status || 'represented',
      from: { name: `${entry.hometown?.split(',')[0] || 'Local'} HS`, logo: initials(entry.name), color },
      to: { name: entry.university || schoolName, logo: school[1], color },
      photoSrc: `assets/portraits/athletes/${slug}.jpg`,
    }),
  };
}

export function buildAthletesCatalog() {
  const athletes = {};
  FOOTBALL_SEED.forEach((entry, i) => {
    const { slug, data } = buildAthlete(entry, false, i);
    athletes[slug] = data;
  });
  BASKETBALL_SEED.forEach((entry, i) => {
    const { slug, data } = buildAthlete(entry, true, i);
    athletes[slug] = data;
  });
  return athletes;
}

const athletes = buildAthletesCatalog();

function serializeAthletes(obj) {
  const json = JSON.stringify(obj, null, 2);
  return `/* Generated by scripts/generate-athletes-data.mjs — do not edit by hand */\nconst ATHLETES = ${json};\n`;
}

function rosterCardHtml(slug, a) {
  const sport = a.basketball ? 'basketball' : 'football';
  const sportLabel = a.basketball ? 'Basketball' : 'Football';
  const photoClass = a.basketball ? 'athlete-photo basketball' : 'athlete-photo';
  return `      <article class="athlete-card" data-athlete="${slug}" data-sport="${sport}">
        <div class="${photoClass}">${a.photo}<span class="sport-tag">${sportLabel}</span></div>
        <div class="athlete-card-body">
          <div class="athlete-card-head">
            <h3 class="athlete-name">${a.name}</h3>
            <p class="athlete-rank"></p>
            <p class="athlete-card-desc"><span class="athlete-card-desc-text"></span></p>
          </div>
          <a href="athlete.html?athlete=${slug}" class="partner-btn athlete-read-more"><span class="btn-label">Read more</span></a>
        </div>
      </article>`;
}

/** Meet-the-athletes grid: alternate football / basketball while preserving each sport's seed order. */
function interleaveRosterEntries(catalog) {
  const football = Object.entries(catalog).filter(([, a]) => !a.basketball);
  const basketball = Object.entries(catalog).filter(([, a]) => a.basketball);
  const mixed = [];
  const maxLen = Math.max(football.length, basketball.length);

  for (let i = 0; i < maxLen; i += 1) {
    if (i < football.length) mixed.push(football[i]);
    if (i < basketball.length) mixed.push(basketball[i]);
  }

  return mixed;
}

function writeAthletesOutput() {
  const catalog = buildAthletesCatalog();
  const footballCount = Object.values(catalog).filter((a) => !a.basketball).length;
  const basketballCount = Object.values(catalog).filter((a) => a.basketball).length;
  const totalCount = Object.keys(catalog).length;

  const gridHtml = interleaveRosterEntries(catalog).map(([slug, a]) => rosterCardHtml(slug, a)).join('\n\n');

  fs.writeFileSync(path.join(root, 'js/athletes-data.js'), serializeAthletes(catalog));

  const meetPath = path.join(root, 'meet-the-athletes.html');
  const indexPath = path.join(root, 'index.html');
  let meetHtml = fs.readFileSync(meetPath, 'utf8');
  meetHtml = meetHtml.replace(
    /<button type="button" class="tab active"[^>]*>All <span class="count">\d+<\/span><\/button>/,
    `<button type="button" class="tab active" aria-pressed="true" data-filter="all">All <span class="count">${totalCount}</span></button>`
  );
  meetHtml = meetHtml.replace(
    /<button type="button" class="tab"[^>]*>Football <span class="count">\d+<\/span><\/button>/,
    `<button type="button" class="tab" aria-pressed="false" data-filter="football">Football <span class="count">${footballCount}</span></button>`
  );
  meetHtml = meetHtml.replace(
    /<button type="button" class="tab"[^>]*>Basketball <span class="count">\d+<\/span><\/button>/,
    `<button type="button" class="tab" aria-pressed="false" data-filter="basketball">Basketball <span class="count">${basketballCount}</span></button>`
  );
  meetHtml = meetHtml.replace(
    /<div class="roster-grid" id="roster-grid">[\s\S]*?<\/div>\n    <\/div>/,
    `<div class="roster-grid" id="roster-grid">\n${gridHtml}\n    </div>\n    </div>`
  );
  fs.writeFileSync(meetPath, meetHtml);

  let indexHtml = fs.readFileSync(indexPath, 'utf8');
  indexHtml = indexHtml.replace(
    /<button type="button" class="tab active"[^>]*>All <span class="count">\d+<\/span><\/button>/,
    `<button type="button" class="tab active" aria-pressed="true" data-filter="all">All <span class="count">${totalCount}</span></button>`
  );
  indexHtml = indexHtml.replace(
    /<button type="button" class="tab"[^>]*>Football <span class="count">\d+<\/span><\/button>/,
    `<button type="button" class="tab" aria-pressed="false" data-filter="football">Football <span class="count">${footballCount}</span></button>`
  );
  indexHtml = indexHtml.replace(
    /<button type="button" class="tab"[^>]*>Basketball <span class="count">\d+<\/span><\/button>/,
    `<button type="button" class="tab" aria-pressed="false" data-filter="basketball">Basketball <span class="count">${basketballCount}</span></button>`
  );
  fs.writeFileSync(indexPath, indexHtml);

  console.log(`Generated ${totalCount} athletes (${footballCount} football, ${basketballCount} basketball)`);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) writeAthletesOutput();
