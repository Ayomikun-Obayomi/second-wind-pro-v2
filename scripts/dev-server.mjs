import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const port = Number(process.env.PORT) || 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

function resolveRequestPath(url) {
  let pathname = decodeURIComponent(url.pathname);

  const athleteSlug = pathname.match(/^\/athlete\/([^/]+)\/?$/);
  if (athleteSlug) {
    const params = new URLSearchParams(url.search);
    params.set('athlete', athleteSlug[1]);
    return {
      filePath: path.join(root, 'athlete.html'),
      search: `?${params.toString()}`,
    };
  }

  if (pathname === '/athlete' || pathname === '/athlete/') {
    return {
      filePath: path.join(root, 'meet-the-athletes.html'),
      search: url.search,
      redirect: null,
    };
  }

  if (pathname.endsWith('/')) pathname += 'index.html';
  if (!path.extname(pathname)) {
    const htmlPath = path.join(root, `${pathname}.html`);
    if (fs.existsSync(htmlPath)) {
      return { filePath: htmlPath, search: url.search };
    }
  }

  return {
    filePath: path.join(root, pathname),
    search: url.search,
  };
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || '/', `http://localhost:${port}`);
  const { filePath, search } = resolveRequestPath(url);

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<!DOCTYPE html><title>404</title><h1>Not found</h1>');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const noCache = ext === '.html' || ext === '.js' || ext === '.css';
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': noCache ? 'no-cache' : 'public, max-age=300',
    });
    res.end(data);
  });
});

server.listen(port, () => {
  console.log(`Playground dev server: http://localhost:${port}`);
  console.log(`Athlete profile example: http://localhost:${port}/athlete/idris-vale`);
});
