#!/usr/bin/env node
/** One-off helper: resolve Wikimedia file titles to 900px thumb URLs. */

import https from 'https';

const TITLES = process.argv.slice(2);
if (!TITLES.length) {
  console.error('Usage: node resolve-wikimedia-portraits.mjs "File:Name.jpg" ...');
  process.exit(1);
}

const q = new URLSearchParams({
  action: 'query',
  titles: TITLES.join('|'),
  prop: 'imageinfo',
  iiprop: 'url|extmetadata',
  iiurlwidth: '900',
  format: 'json',
});

https.get(`https://commons.wikimedia.org/w/api.php?${q}`, { headers: { 'User-Agent': 'SecondWindPro/1.0' } }, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const json = JSON.parse(data);
    for (const page of Object.values(json.query?.pages || {})) {
      if (page.missing !== undefined) {
        console.log('MISSING', page.title);
        continue;
      }
      const ii = page.imageinfo?.[0];
      if (!ii?.thumburl) {
        console.log('NOIMG', page.title);
        continue;
      }
      const license = (ii.extmetadata?.LicenseShortName?.value || '').replace(/<[^>]+>/g, '');
      console.log(JSON.stringify({
        title: page.title.replace(/^File:/, ''),
        url: ii.thumburl,
        license,
      }));
    }
  });
}).on('error', (err) => {
  console.error(err);
  process.exit(1);
});
