// Production server:  npm run build && npm start   (PORT, DATA_DIR, ADMIN_USER, ADMIN_PASS are optional env vars)
// Serves the built site from /dist plus the JSON API, so admin changes are shared by every visitor.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleApi } from './api.js';

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.txt': 'text/plain',
};

http
  .createServer(async (req, res) => {
    if (await handleApi(req, res)) return;
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    let file = path.join(dist, path.normalize(urlPath));
    if (!file.startsWith(dist)) { res.statusCode = 403; return res.end(); }
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(dist, 'index.html'); // SPA fallback
    res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
    if (file.includes(`${path.sep}assets${path.sep}`)) res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    fs.createReadStream(file).pipe(res);
  })
  .listen(process.env.PORT || 3000, () => console.log(`Almosanadah running on http://localhost:${process.env.PORT || 3000}`));
