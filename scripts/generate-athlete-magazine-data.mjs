import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildAthletesCatalogSync } from './generate-athletes-data.mjs';
import {
  HANDCRAFTED_SLUGS,
  HANDCRAFTED_SOCIAL,
  HANDCRAFTED_STORIES,
} from './athlete-magazine-handcrafted.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const YT_FOOTBALL = ['EYukKdfRUCU', 'SXOsck1lvtU'];
const YT_BASKETBALL = ['ghetas1K0ms', 'SXOsck1lvtU'];
const COMMIT_FB = 'assets/roster/commitment-football-1.jpg';
const COMMIT_BB = 'assets/roster/commitment-basketball-1.jpg';

function hashSlug(slug) {
  let h = 0;
  for (let i = 0; i < slug.length; i += 1) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return h;
}

function pick(list, slug, offset = 0) {
  return list[(hashSlug(slug) + offset) % list.length];
}

function cityFrom(hometown) {
  return (hometown || 'home').split(',')[0].trim();
}

function firstName(name) {
  return name.split(/\s+/)[0];
}

function lastName(name) {
  const parts = name.split(/\s+/);
  return parts[parts.length - 1];
}

function posAbbr(position = '') {
  const match = position.match(/\b(QB|WR|RB|CB|LB|TE|OT|OL|Edge|S|K|DL|PG|SG|SF|PF|C)\b/i);
  return match ? match[1].toUpperCase() : '';
}

function socialHandles(slug, name, position) {
  const first = firstName(name);
  const last = lastName(name);
  const abbr = posAbbr(position);
  const compact = `${first}${last}`.replace(/[^a-zA-Z]/g, '');
  const xLabel = abbr ? `@${first}${last}${abbr}` : `@${first}${last}`;
  const igLabel = `@${compact.toLowerCase()}`;
  return [
    { platform: 'x', label: xLabel.replace(/\s/g, ''), url: 'https://x.com' },
    { platform: 'instagram', label: igLabel, url: 'https://instagram.com' },
    { platform: 'tiktok', label: igLabel, url: 'https://tiktok.com' },
  ];
}

function scoutProfile(position, isBasketball) {
  const abbr = posAbbr(position);
  const footballScouts = {
    QB: {
      strengths: ['Pre-snap processing and command at the line', 'Poise under pressure in late-down situations', 'Accuracy on intermediate throws'],
      weaknesses: ['Can hold the ball when first read is taken away', 'Frame still maturing through contact'],
    },
    WR: {
      strengths: ['Route discipline and separation at the break', 'Reliable hands in traffic', 'Strong fan-event and media presence'],
      weaknesses: ['Top-end speed good not elite', 'Can drift on comeback routes'],
    },
    RB: {
      strengths: ['Vision between the tackles', 'Receiving value out of the backfield', 'Pass-protection willingness'],
      weaknesses: ['Long speed vs. stacked boxes', 'Ball security under pile-ups'],
    },
    Edge: {
      strengths: ['Closing speed and bend off the edge', 'Motor on third down', 'Team-first communication'],
      weaknesses: ['Hand usage vs. veteran tackles', 'Can over-pursue on misdirection'],
    },
    DL: {
      strengths: ['Interior push on early downs', 'Disciplined gap fits', 'High-rep motor in rotation'],
      weaknesses: ['Pass-rush counters still developing', 'Can play high vs. double teams'],
    },
    LB: {
      strengths: ['Instinctive run fits', 'Coverage awareness in zone', 'Leadership in the huddle'],
      weaknesses: ['Man coverage vs. elite athletes', 'Can take aggressive angles that open cutbacks'],
    },
    CB: {
      strengths: ['Press technique and recovery speed', 'Ball skills in phase', 'Confidence in one-on-one settings'],
      weaknesses: ['Size vs. bigger receivers on 50/50 balls', 'Can gamble when trailing in man'],
    },
    S: {
      strengths: ['Range in the deep middle', 'Tackling reliability in space', 'Communication in quarters looks'],
      weaknesses: ['Man coverage on slot receivers', 'Can bite on play-action'],
    },
    TE: {
      strengths: ['Versatility as a blocker and receiver', 'Catch radius in the seam', 'Red-zone presence'],
      weaknesses: ['Separation vs. NFL-caliber linebackers', 'Inline strength still building'],
    },
    OT: {
      strengths: ['Length and footwork in pass protection', 'Anchor vs. power rushers', 'Discipline in communication'],
      weaknesses: ['Recovery speed vs. elite speed rush', 'Can lunge when late on counters'],
    },
    OL: {
      strengths: ['Consistency in run blocking', 'Hand placement at the point of attack', 'Multi-year starter reps'],
      weaknesses: ['Pass-pro foot speed vs. edges', 'Can struggle vs. heavy twists'],
    },
    K: {
      strengths: ['Accuracy inside 45 yards', 'Clutch temperament in tight games', 'Operational consistency on special teams'],
      weaknesses: ['Range beyond 50 still proving out', 'Wind adjustment on deep kicks'],
    },
  };
  const basketballScouts = {
    PG: {
      strengths: ['Pace control and live-dribble passing', 'Decision-making in pick-and-roll', 'Polished on-camera presence'],
      weaknesses: ['Can over-pass in late-clock situations', 'Strength vs. physical defenders'],
    },
    SG: {
      strengths: ['Perimeter shooting off movement', 'Two-way competitiveness', 'Shot creation in transition'],
      weaknesses: ['Can force contested pull-ups early', 'Size vs. length at the rim'],
    },
    SF: {
      strengths: ['Defensive versatility across positions', 'Floor spacing and cutting', 'Transition finishing'],
      weaknesses: ['Ball-handling vs. elite pressure', 'Consistency from mid-range'],
    },
    PF: {
      strengths: ['Rebounding and interior presence', 'Ability to stretch the floor', 'Defensive communication'],
      weaknesses: ['Lateral quickness on switches', 'Foul discipline in post-ups'],
    },
    C: {
      strengths: ['Rim protection and rebounding', 'Screen-and-roll finishing', 'Interior defensive timing'],
      weaknesses: ['Perimeter switching in space', 'Free-throw consistency'],
    },
  };

  const table = isBasketball ? basketballScouts : footballScouts;
  return table[abbr] || (isBasketball
    ? { strengths: ['Two-way impact and coachability', 'Consistent production on the circuit', 'Professional approach to media'], weaknesses: ['Still adding strength through contact', 'Can force tough shots early in the clock'] }
    : { strengths: ['Consistent on-field production', 'Professional approach to NIL and media', 'Team-first communication'], weaknesses: ['Still proving vs. top-tier competition', 'Can leave plays on the field when pressing'] });
}

function programChapter(a, slug) {
  const city = cityFrom(a.hometown);
  const school = a.from?.name || `${city} High`;
  const uni = a.university || a.to?.name || 'his program';
  const sport = a.basketball ? 'basketball' : 'football';

  if (a.status === 'portal') {
    return {
      title: 'The portal window',
      paragraphs: [
        `${a.name} entered the transfer portal after establishing himself as one of the more reliable producers at ${a.from?.name || 'his previous program'}. The move was less about escaping a situation and more about finding a roster fit that matched his timeline and championship goals.`,
        `Within weeks, ${uni} emerged as the destination—staff sold him on immediate usage, development, and a scheme that fits how he already wins on ${sport === 'basketball' ? 'the floor' : 'Saturdays'}.`,
      ],
    };
  }

  if (a.status === 'committed' || a.status === 'signed') {
    const campus = pick(['campus', 'facility tour', 'staff meeting room'], slug, 3);
    return {
      title: `Commitment to ${uni.split(' ').slice(-1)[0] === 'University' ? uni.replace('University of ', '') : uni}`,
      paragraphs: [
        `${firstName(a.name)} closed his recruitment after a final visit built around ${campus} reps—not photo walls. He announced in front of teammates and family with a short statement about wanting a staff that coaches details after cameras leave.`,
        `“I wanted a program that would challenge me every day,” he said. “${uni} made that clear.”`,
      ],
    };
  }

  return {
    title: `Represented at ${uni}`,
    paragraphs: [
      `${a.name} is represented by Second Wind Pro while building his profile at ${school} and preparing for the next step at ${uni}. Staffers cite his ${a.athleticLevel?.toLowerCase() || 'production'} and consistency in high-leverage moments.`,
      `Off the field, ${firstName(a.name)} has become a dependable voice in community camps and sponsor activations—${a.presentability?.toLowerCase() || 'polished on camera without sounding rehearsed'}.`,
    ],
  };
}

function roadChapter(a) {
  const uni = a.university || a.to?.name || 'the next level';
  const growth = pick([
    'adding strength without losing the athletic traits that show up on film',
    'proving consistency against top-tier competition week after week',
    'expanding his role in high-leverage moments late in games',
    'turning strong practice habits into repeatable game-day production',
  ], a.name, 5);

  return {
    title: `The road ahead`,
    paragraphs: [
      `Evaluators project ${firstName(a.name)} as a contributor who can help ${uni} win in the ${a.basketball ? 'conference tournament picture' : 'conference and postseason'} if development continues on schedule. The growth area is ${growth}.`,
      `In interview settings and brand activations, he projects the kind of presence sponsors want—prepared, authentic, and aligned with performance-driven storytelling.`,
    ],
  };
}

function buildMagazineStory(slug, a) {
  const city = cityFrom(a.hometown);
  const school = a.from?.name || `${city} High`;
  const handles = socialHandles(slug, a.name, a.position);
  const xHandle = handles[0].label;
  const igHandle = handles[1].label;
  const yt = a.basketball ? YT_BASKETBALL : YT_FOOTBALL;
  const sportWord = a.basketball ? 'court' : 'field';
  const scout = scoutProfile(a.position, a.basketball);
  const acc = a.accomplishments?.[0] || (a.basketball ? 'Circuit standout' : 'All-conference honors');
  const statLine = a.stats?.slice(0, 2).map(([v, k]) => `${v} ${k.toLowerCase()}`).join(' and ') || 'steady production';

  const rootsParagraphs = a.basketball
    ? [
        `${a.name} built his game on ${city} courts—early mornings at the gym, late nights editing film on his phone. Coaches trusted him early because he processed the game one possession ahead of his peers.`,
        `By the time he reached ${school}, he was already the player teammates wanted in closing minutes: composed, communicative, and unwilling to let a possession slip without a quality look.`,
      ]
    : [
        `${a.name} grew up in ${city} in a household that treated film and fundamentals like homework. The ${sportWord} was always nearby—community camps, seven-on-seven, and the kind of repetition that shows up when the lights are brightest.`,
        `At ${school}, ${firstName(a.name)} became the player coordinators built around—${statLine} with the kind of ${a.basketball ? 'poise' : 'discipline'} that travels when competition level jumps.`,
      ];

  const schoolParagraphs = [
    `${firstName(a.name)} enters this chapter as ${a.athleticLevel || 'represented talent'} with ${acc.toLowerCase()} on his resume. Coaches cite his preparation and the way he elevates teammates in meeting rooms and walk-throughs.`,
    a.bio || `${firstName(a.name)} is represented by Second Wind Pro for athlete-first NIL partnerships that match his on-${sportWord} identity.`,
  ];

  const program = programChapter(a, slug);
  const road = roadChapter(a);

  const clipTextX = a.basketball
    ? `Film thread from circuit weekend—every read, every finish in transition. Staffs bookmarked this one. 🧵`
    : `Game-film thread—every key rep from the latest win, tagged for coordinators who asked for the full cut. 🧵`;

  const clipTextIg = a.basketball
    ? `Mic'd up at a circuit stop—defensive stops, transition buckets, and the play teammates kept replaying in the group chat. 🏀`
    : `Mic'd up from Friday night—pre-snap communication, execution, and the rep that trended on social. 🎯`;

  const commitThumb = a.basketball ? COMMIT_BB : COMMIT_FB;
  const commitTitle = a.status === 'portal' ? 'Signing day' : 'Announcement day';

  return [
    { type: 'chapter', title: `Roots in ${city}`, paragraphs: rootsParagraphs },
    { type: 'chapter', title: school, paragraphs: schoolParagraphs },
    {
      type: 'clip',
      platform: 'x',
      embed: 'tweet',
      displayName: a.name,
      handle: xHandle,
      avatar: a.photo,
      text: clipTextX,
      metric: `${pick(['620K', '890K', '1.1M', '1.4M', '1.8M'], slug)} views`,
      posted: pick(['March 2025', 'October 2025', 'January 2026', 'February 2026'], slug, 2),
      postedISO: pick(['2025-03-08', '2025-10-03', '2026-01-15', '2026-02-12'], slug, 4),
      url: 'https://x.com',
      youtubeId: pick(yt, slug),
    },
    {
      type: 'clip',
      platform: 'instagram',
      embed: 'instagram',
      displayName: a.name,
      handle: igHandle,
      avatar: a.photo,
      text: clipTextIg,
      metric: `${pick(['480K', '540K', '720K', '840K', '980K'], slug, 1)} plays`,
      posted: pick(['June 2025', 'October 2025', 'December 2025', 'January 2026'], slug, 3),
      url: 'https://instagram.com',
      youtubeId: pick(yt, slug, 1),
    },
    { type: 'chapter', title: program.title, paragraphs: program.paragraphs },
    {
      type: 'clip',
      platform: 'instagram',
      embed: 'instagram',
      displayName: a.name,
      handle: igHandle,
      avatar: a.photo,
      text: `${commitTitle} reel—family in the frame, teammates behind ${firstName(a.name)}, and the moment the next chapter became official.`,
      metric: `${pick(['720K', '860K', '1.1M', '1.4M'], slug, 6)} plays`,
      posted: a.signed || pick(['January 2026', 'February 2026', 'December 2025'], slug, 7),
      postedISO: a.signed ? undefined : pick(['2026-01-30', '2026-02-14', '2025-12-09'], slug, 8),
      url: 'https://instagram.com',
      thumbnail: commitThumb,
      thumbnailAlt: `${a.name} commitment announcement on Instagram`,
    },
    { type: 'chapter', title: road.title, paragraphs: road.paragraphs },
    { type: 'scout', strengths: scout.strengths, weaknesses: scout.weaknesses },
    {
      type: 'quote',
      text: pick([
        `${firstName(a.name)} prepares like the next rep is the one that matters. That shows up on ${sportWord} and on camera.`,
        `He makes the room better. That is why teammates and staff trust him in big moments.`,
        `You do not have to coach effort with ${firstName(a.name)}. You coach details—and he keeps them.`,
      ], slug, 9),
      cite: pick([
        `Head coach, ${school}`,
        `Position coach, ${school}`,
        `${a.agent || 'Second Wind Pro'}, athlete advisor`,
      ], slug, 10),
    },
    {
      type: 'quote',
      text: pick([
        `If he is on the roster, I am watching every game. The kid plays like he belongs on the biggest stage.`,
        `This is the kind of athlete you build a campaign around—real production, real presence.`,
        `Fans can tell when it is authentic. ${firstName(a.name)} has that.`,
      ], slug, 11),
      cite: `Fan reply on ${xHandle} thread`,
    },
  ];
}

function serializeMagazineData(social, stories) {
  const socialJson = JSON.stringify(social, null, 2).replace(/"([^"]+)":/g, "'$1':");
  const storiesJson = JSON.stringify(stories, null, 2).replace(/"([^"]+)":/g, "'$1':");
  return `/** Generated by scripts/generate-athlete-magazine-data.mjs — do not edit by hand */
window.ATHLETE_SOCIAL = ${socialJson};

window.MAGAZINE_STORIES = ${storiesJson};
`;
}

const athletes = buildAthletesCatalogSync();
const social = { ...HANDCRAFTED_SOCIAL };
const stories = { ...HANDCRAFTED_STORIES };

let generated = 0;
for (const [slug, a] of Object.entries(athletes)) {
  if (HANDCRAFTED_SLUGS.includes(slug)) continue;
  social[slug] = socialHandles(slug, a.name, a.position);
  stories[slug] = buildMagazineStory(slug, a);
  generated += 1;
}

const outPath = path.join(root, 'js/athlete-magazine-data.js');
fs.writeFileSync(outPath, serializeMagazineData(social, stories));
console.log(`Generated magazine profiles for ${generated} athletes (${HANDCRAFTED_SLUGS.length} handcrafted preserved, ${Object.keys(stories).length} total)`);
