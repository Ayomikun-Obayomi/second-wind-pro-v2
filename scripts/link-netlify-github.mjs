#!/usr/bin/env node
/**
 * Link second-wind-pro-v2 GitHub repo to Netlify site for continuous deployment.
 * Uses deploy key + build hook + GitHub webhook (manual linking flow).
 */
import { execSync } from 'node:child_process';
import { spawnSync } from 'node:child_process';

const SITE_ID = 'ba1e39bf-5d95-4e1e-a5fe-891615831067';
const REPO = 'Ayomikun-Obayomi/second-wind-pro-v2';
const BRANCH = 'main';

function netlifyApi(method, data = null) {
  const args = ['--yes', 'netlify-cli@22', 'api', method];
  if (data) args.push('--data', JSON.stringify(data));
  const result = spawnSync('npx', args, {
    cwd: new URL('..', import.meta.url).pathname,
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  });
  if (result.status !== 0) {
    throw new Error(`Netlify API ${method} failed: ${result.stderr || result.stdout}`);
  }
  const out = (result.stdout || '').trim();
  return out ? JSON.parse(out) : null;
}

function getGitHubToken() {
  const result = spawnSync(
    'git',
    ['credential', 'fill'],
    {
      input: 'protocol=https\nhost=github.com\n\n',
      encoding: 'utf8',
    },
  );
  const match = (result.stdout || '').match(/^password=(.+)$/m);
  if (!match) throw new Error('Could not read GitHub token from git credential helper');
  return match[1].trim();
}

async function githubRequest(path, { method = 'GET', body } = {}, token) {
  const res = await fetch(`https://api.github.com${path}`, {
    method,
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'second-wind-netlify-link',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }
  if (!res.ok) {
    throw new Error(`GitHub ${method} ${path} → ${res.status}: ${text.slice(0, 400)}`);
  }
  return json;
}

async function main() {
  const token = getGitHubToken();
  console.log('GitHub token acquired');

  const site = netlifyApi('getSite', { site_id: SITE_ID });
  if (site.repo_url) {
    console.log('Site already linked to:', site.repo_url);
    return;
  }

  console.log('Creating Netlify deploy key...');
  const deployKey = netlifyApi('createDeployKey');
  console.log('Deploy key id:', deployKey.id);

  console.log('Adding deploy key to GitHub repo...');
  try {
    await githubRequest(
      `/repos/${REPO}/keys`,
      {
        method: 'POST',
        body: {
          title: `Netlify (${SITE_ID})`,
          key: deployKey.public_key,
          read_only: true,
        },
      },
      token,
    );
  } catch (err) {
    if (!String(err.message).includes('422')) throw err;
    console.log('Deploy key may already exist on repo, continuing...');
  }

  console.log('Linking repository on Netlify site...');
  const updated = netlifyApi('updateSite', {
    site_id: SITE_ID,
    body: {
      repo: {
        provider: 'github',
        repo_path: REPO,
        repo_branch: BRANCH,
        deploy_key_id: deployKey.id,
        dir: '.',
        cmd: '',
        public_repo: true,
      },
    },
  });
  console.log('Linked repo_url:', updated.repo_url || updated.build_settings?.repo_url || '(checking)');

  console.log('Creating Netlify build hook...');
  const hook = netlifyApi('createSiteBuildHook', {
    site_id: SITE_ID,
    body: { title: 'GitHub push', branch: BRANCH },
  });
  console.log('Build hook URL:', hook.url);

  const hooks = await githubRequest(`/repos/${REPO}/hooks`, {}, token);
  const existing = hooks.find((h) => h.config?.url === hook.url);
  if (existing) {
    console.log('GitHub webhook already configured:', existing.id);
  } else {
    console.log('Creating GitHub webhook for push events...');
    await githubRequest(
      `/repos/${REPO}/hooks`,
      {
        method: 'POST',
        body: {
          name: 'web',
          active: true,
          events: ['push'],
          config: {
            url: hook.url,
            content_type: 'json',
            insecure_ssl: '0',
          },
        },
      },
      token,
    );
    console.log('GitHub webhook created');
  }

  const verify = netlifyApi('getSite', { site_id: SITE_ID });
  console.log('\nDone.');
  console.log('repo_url:', verify.repo_url);
  console.log('repo_branch:', verify.repo_branch);
  console.log('build_hooks:', (netlifyApi('listSiteBuildHooks', { site_id: SITE_ID }) || []).length);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
