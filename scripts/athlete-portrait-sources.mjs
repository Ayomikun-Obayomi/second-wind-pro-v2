/**
 * Demo athlete portraits — Wikimedia Commons (CC-licensed college / NFL media).
 * Fictional roster names; photos are real athletes for placeholder realism only.
 * Full credits: assets/portraits/ATTRIBUTION.md
 */

/** @type {Record<string, { url: string, credit: string, license: string }>} */
export const ATHLETE_PORTRAIT_SOURCES = {
  // Football — matched to school / conference where possible
  'marcus-lane': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Johnny_Manziel_2014_Browns_training_camp_%284%29.jpg/960px-Johnny_Manziel_2014_Browns_training_camp_%284%29.jpg',
    credit: 'Johnny Manziel (Browns training camp) — Erik Drost / CC BY 2.0',
    license: 'CC BY 2.0',
  },
  'caleb-mooney': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Ja%27Marr_Chase.jpg/960px-Ja%27Marr_Chase.jpg',
    credit: "Ja'Marr Chase — Wikimedia Commons / CC BY-SA 2.0",
    license: 'CC BY-SA 2.0',
  },
  'trey-holloway': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Jake_Fromm_%2851817403504%29_%28cropped%29.jpg/960px-Jake_Fromm_%2851817403504%29_%28cropped%29.jpg',
    credit: 'Jake Fromm (Georgia) — All-Pro Reels / CC BY-SA 2.0',
    license: 'CC BY-SA 2.0',
  },
  'devon-park': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/CJ_Stroud_%28cropped%29.jpg',
    credit: 'C.J. Stroud (Ohio State) — Maize and Blue Nation / CC BY 2.0',
    license: 'CC BY 2.0',
  },
  'jordan-blake': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Mac_Jones_One_UA.jpg/960px-Mac_Jones_One_UA.jpg',
    credit: 'Mac Jones (Alabama) — All-Pro Reels / CC BY 3.0',
    license: 'CC BY 3.0',
  },
  'malik-rivers': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Jalen_Hurts_2022_%28cropped%29.jpg/960px-Jalen_Hurts_2022_%28cropped%29.jpg',
    credit: 'Jalen Hurts — All-Pro Reels / CC BY-SA 2.0',
    license: 'CC BY-SA 2.0',
  },
  'chris-dalton': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Justin_Fields.jpg/960px-Justin_Fields.jpg',
    credit: 'Justin Fields (Ohio State) — Wikimedia Commons / CC BY-SA 2.0',
    license: 'CC BY-SA 2.0',
  },
  'andre-coleman': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Derrick_Henry.jpg/960px-Derrick_Henry.jpg',
    credit: 'Derrick Henry (Alabama) — Wikimedia Commons / CC BY 3.0',
    license: 'CC BY 3.0',
  },
  'tyler-nash': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/80/Kenny_Pickett_vs._Clemson_%28cropped_1%29.jpg',
    credit: 'Kenny Pickett (Pitt) — Wikimedia Commons / CC BY-SA 2.0',
    license: 'CC BY-SA 2.0',
  },
  'ryan-mercer': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Hendon_Hooker.jpg/960px-Hendon_Hooker.jpg',
    credit: 'Hendon Hooker (Tennessee) — Wikimedia Commons / CC BY-SA 4.0',
    license: 'CC BY-SA 4.0',
  },
  'darius-webb': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Kyler_Murray.jpg/960px-Kyler_Murray.jpg',
    credit: 'Kyler Murray (Oklahoma / Texas A&M) — Wikimedia Commons / CC BY-SA 4.0',
    license: 'CC BY-SA 4.0',
  },
  'noah-griffin': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Saquon_Barkley.jpg/960px-Saquon_Barkley.jpg',
    credit: 'Saquon Barkley (Penn State) — Wikimedia Commons / CC BY-SA 4.0',
    license: 'CC BY-SA 4.0',
  },
  'ethan-brooks': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Tim_Tebow_%28cropped%29.jpg',
    credit: 'Tim Tebow (Florida) — Wikimedia Commons / CC BY-SA 2.0',
    license: 'CC BY-SA 2.0',
  },
  'jamal-ortiz': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Trevor_Lawrence_%28cropped%29.jpg',
    credit: 'Trevor Lawrence (Clemson) — Wikimedia Commons / CC BY-SA 2.0',
    license: 'CC BY-SA 2.0',
  },
  'cameron-ellis': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Charles_Woodson.jpg/960px-Charles_Woodson.jpg',
    credit: 'Charles Woodson (Michigan) — Chris Nelson / CC BY 3.0',
    license: 'CC BY 3.0',
  },
  'logan-pierce': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Baker_Mayfield_%2829349436067%29.jpg/960px-Baker_Mayfield_%2829349436067%29.jpg',
    credit: 'Baker Mayfield (Oklahoma) — EDrost88 / CC BY 2.0',
    license: 'CC BY 2.0',
  },
  'isaiah-grant': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Aidan_Hutchinson.jpg/960px-Aidan_Hutchinson.jpg',
    credit: 'Aidan Hutchinson (Michigan) — Wikimedia Commons / CC BY-SA 2.0',
    license: 'CC BY-SA 2.0',
  },
  'mason-reid': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/49/BrockPurdy2021_%28cropped%29.jpg',
    credit: 'Brock Purdy (Iowa State) — Wikimedia Commons / CC BY-SA 4.0',
    license: 'CC BY-SA 4.0',
  },
  'cole-bennett': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Micah_Parsons_Cowboys-WFT_DEC2021_%28cropped%29.jpg/960px-Micah_Parsons_Cowboys-WFT_DEC2021_%28cropped%29.jpg',
    credit: 'Micah Parsons — All-Pro Reels / CC BY-SA 2.0',
    license: 'CC BY-SA 2.0',
  },
  'victor-santos': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Jayden_Daniels.jpg/960px-Jayden_Daniels.jpg',
    credit: 'Jayden Daniels (LSU) — Wikimedia Commons / CC BY-SA 2.0',
    license: 'CC BY-SA 2.0',
  },
  'grant-holloway': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/2025-0118_Shilo_Sanders.jpg/960px-2025-0118_Shilo_Sanders.jpg',
    credit: 'Shilo Sanders — Bobak Ha\'Eri / CC BY 3.0',
    license: 'CC BY 3.0',
  },
  'parker-walsh': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Drake_Maye_close_up_NOV2024.png',
    credit: 'Drake Maye (Patriots) — All-Pro Reels / CC BY 3.0',
    license: 'CC BY 3.0',
  },
  'terrell-knox': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Sam_Howell_2022.jpg/960px-Sam_Howell_2022.jpg',
    credit: 'Sam Howell — All-Pro Reels / CC BY 3.0',
    license: 'CC BY 3.0',
  },
  'sean-murphy': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Josh_Allen.jpg/960px-Josh_Allen.jpg',
    credit: 'Josh Allen — Wikimedia Commons / CC BY 2.0',
    license: 'CC BY 2.0',
  },
  // Basketball
  'idris-vale': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Jaden_Ivey_2022.jpg/960px-Jaden_Ivey_2022.jpg',
    credit: 'Jaden Ivey (Purdue) — All-Pro Reels / CC BY-SA 2.0',
    license: 'CC BY-SA 2.0',
  },
  'sienna-hart': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Caitlin_Clark_%282%29_%28cropped%29.jpg/960px-Caitlin_Clark_%282%29_%28cropped%29.jpg',
    credit: 'Caitlin Clark — MGoBlog / CC BY-SA 2.0',
    license: 'CC BY-SA 2.0',
  },
  'avery-collins': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Keegan_Murray.jpg/960px-Keegan_Murray.jpg',
    credit: 'Keegan Murray — Wikimedia Commons / CC BY-SA 2.0',
    license: 'CC BY-SA 2.0',
  },
  'miles-carter': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Oscar_Tshiebwe.jpg/960px-Oscar_Tshiebwe.jpg',
    credit: 'Oscar Tshiebwe (Kentucky) — Wikimedia Commons / CC BY 2.0',
    license: 'CC BY 2.0',
  },
  'jalen-brooks': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Armando_Bacot_%28cropped%29.jpg/960px-Armando_Bacot_%28cropped%29.jpg',
    credit: 'Armando Bacot (UNC) — Wikimedia Commons / CC BY-SA 2.0',
    license: 'CC BY-SA 2.0',
  },
  'derek-lawson': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Hunter_Dickinson_Michigan_%28cropped%29.jpg/960px-Hunter_Dickinson_Michigan_%28cropped%29.jpg',
    credit: 'Hunter Dickinson (Michigan) — Wikimedia Commons / CC BY-SA 2.0',
    license: 'CC BY-SA 2.0',
  },
  'kai-mendoza': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Chet_Holmgren.jpg/960px-Chet_Holmgren.jpg',
    credit: 'Chet Holmgren (Gonzaga) — Wikimedia Commons / CC BY 2.0',
    license: 'CC BY 2.0',
  },
  'tyrese-holland': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Azzi_Fudd.jpg/960px-Azzi_Fudd.jpg',
    credit: 'Azzi Fudd (UConn) — John Mac / CC BY-SA 2.0',
    license: 'CC BY-SA 2.0',
  },
  'brandon-tate': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Kevin_Samuel.jpg/960px-Kevin_Samuel.jpg',
    credit: 'Kevin Samuel (TCU) — Nathan Lowe / CC BY-SA 2.0',
    license: 'CC BY-SA 2.0',
  },
  'nico-alvarez': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Walker_Kessler_%28cropped%29.jpg',
    credit: 'Walker Kessler — Wikimedia Commons / CC BY 2.0',
    license: 'CC BY 2.0',
  },
  'jordan-ellis': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Buddy_Hield_crop.jpg/960px-Buddy_Hield_crop.jpg',
    credit: 'Buddy Hield (Oklahoma) — ChristopherM01 / CC BY-SA 2.0',
    license: 'CC BY-SA 2.0',
  },
};
