import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const STATE_FILE = path.join(DATA_DIR, 'hifz-state.json');
const BACKUP_FILE = path.join(DATA_DIR, 'hifz-state.backup.json');
const DIST_DIR = path.resolve(process.cwd(), 'dist');
const MAX_BODY_BYTES = 4 * 1024 * 1024; // 4 MB for multi-student history

fs.mkdirSync(DATA_DIR, { recursive: true });

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};

let writeQueue = Promise.resolve();

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let bytes = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      bytes += chunk.length;
      if (bytes > MAX_BODY_BYTES) {
        reject(new Error('Payload too large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf-8');
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error('Invalid JSON payload'));
      }
    });
    req.on('error', reject);
  });
}

function isStockDemoStudentServer(student) {
  if (!student || typeof student !== 'object') return false;
  const settings = student.settings || {};
  const logs = Array.isArray(student.logs) ? student.logs : [];
  const wonTreats = Array.isArray(student.wonTreats) ? student.wonTreats : [];
  const pos = student.quranPosition || {};

  const allDemoLogs = logs.every((l) => l && typeof l.id === 'string' && l.id.startsWith('demo-log-'));
  const defaultPos =
    (pos.juz === 26 &&
      pos.surahNumber === 50 &&
      (pos.ayatNumber === 17 || pos.ayatNumber === 15)) ||
    (pos.juz === 29 && pos.surahNumber === 68 && pos.ayatNumber === 4);
  const defaultWon = wonTreats.every((w) => w && w.id === 'won-demo-1');
  const defaultSettings =
    settings.childName === 'Little Champion' &&
    (settings.heroId ?? 'iron-hafiz') === 'iron-hafiz' &&
    (settings.parentPin ?? '1234') === '1234';

  return allDemoLogs && defaultPos && defaultWon && defaultSettings;
}

function isStockDemoStoreServer(payload) {
  if (!payload || typeof payload !== 'object') return false;
  if (Array.isArray(payload.students)) {
    return payload.students.length === 1 && isStockDemoStudentServer(payload.students[0]);
  }
  return isStockDemoStudentServer(payload);
}

async function readJsonFileSafe(filePath) {
  const raw = await fsp.readFile(filePath, 'utf-8');
  return JSON.parse(raw);
}

async function handleGetState(res) {
  try {
    const parsed = await readJsonFileSafe(STATE_FILE);
    sendJson(res, 200, { state: parsed });
    return;
  } catch (err) {
    // Attempt automatic recovery from backup file if primary state file is missing or corrupted
    try {
      const backupParsed = await readJsonFileSafe(BACKUP_FILE);
      console.warn('Primary state missing/unreadable; serving backup:', BACKUP_FILE);
      sendJson(res, 200, { state: backupParsed, recoveredFromBackup: true });
      return;
    } catch {
      if (err && typeof err === 'object' && 'code' in err && err.code === 'ENOENT') {
        sendJson(res, 200, { state: null });
        return;
      }
    }
    console.error('Failed to read state file:', err);
    sendJson(res, 500, { error: 'Failed to read state' });
  }
}

async function handlePostState(req, res) {
  let payload;
  try {
    payload = await readJsonBody(req);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Bad Request';
    sendJson(res, message === 'Payload too large' ? 413 : 400, { error: message });
    return;
  }

  const candidate =
    payload && typeof payload === 'object' && 'state' in payload ? payload.state : payload;
  const allowReset = Boolean(payload && typeof payload === 'object' && payload.allowReset === true);

  const isValidMulti =
    candidate &&
    typeof candidate === 'object' &&
    !Array.isArray(candidate) &&
    Array.isArray(candidate.students) &&
    candidate.students.length > 0;

  const isValidLegacy =
    candidate &&
    typeof candidate === 'object' &&
    !Array.isArray(candidate) &&
    'settings' in candidate &&
    'shortTermGoal' in candidate &&
    'longTermGoal' in candidate;

  if (!isValidMulti && !isValidLegacy) {
    sendJson(res, 400, { error: 'Invalid Hifz app state structure' });
    return;
  }

  let protectedOverwrite = false;

  writeQueue = writeQueue
    .then(async () => {
      await fsp.mkdir(DATA_DIR, { recursive: true });

      let existingRaw = null;
      let existingParsed = null;
      try {
        existingRaw = await fsp.readFile(STATE_FILE, 'utf-8');
        existingParsed = JSON.parse(existingRaw);
      } catch {
        // No valid existing file yet
      }

      if (
        !allowReset &&
        existingParsed &&
        !isStockDemoStoreServer(existingParsed) &&
        isStockDemoStoreServer(candidate)
      ) {
        protectedOverwrite = true;
        return;
      }

      // Preserve atomic backup copy of previous valid state before overwriting
      if (existingRaw && existingParsed) {
        const tmpBackup = `${BACKUP_FILE}.tmp`;
        await fsp.writeFile(tmpBackup, existingRaw, 'utf-8');
        await fsp.rename(tmpBackup, BACKUP_FILE);
      }

      const tmpFile = `${STATE_FILE}.tmp`;
      await fsp.writeFile(tmpFile, JSON.stringify(candidate, null, 2), 'utf-8');
      await fsp.rename(tmpFile, STATE_FILE);
    })
    .catch((err) => {
      console.error('Failed to persist state:', err);
      throw err;
    });

  try {
    await writeQueue;
    if (protectedOverwrite) {
      sendJson(res, 409, {
        error: 'Protected existing saved user data from accidental demo overwrite',
        protected: true,
      });
      return;
    }
    sendJson(res, 200, { ok: true });
  } catch {
    sendJson(res, 500, { error: 'Failed to save state to disk' });
  }
}

async function serveStatic(urlPathname, res) {
  const decodedPath = decodeURIComponent(urlPathname);
  const relativePath = decodedPath === '/' ? 'index.html' : decodedPath.replace(/^\/+/, '');
  const resolved = path.resolve(DIST_DIR, relativePath);

  if (!resolved.startsWith(DIST_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  let fileToServe = resolved;
  try {
    const stat = await fsp.stat(fileToServe);
    if (stat.isDirectory()) {
      fileToServe = path.join(fileToServe, 'index.html');
      await fsp.access(fileToServe);
    }
  } catch {
    // SPA fallback to dist/index.html
    fileToServe = path.join(DIST_DIR, 'index.html');
  }

  try {
    const data = await fsp.readFile(fileToServe);
    const ext = path.extname(fileToServe).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const isImmutableAsset = fileToServe.includes(`${path.sep}assets${path.sep}`);
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': isImmutableAsset ? 'public, max-age=31536000, immutable' : 'no-cache',
    });
    res.end(data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found. Run "npm run build" first.');
  }
}

async function requestHandler(req, res) {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

  if (url.pathname === '/api/health' && req.method === 'GET') {
    sendJson(res, 200, { ok: true, dataDir: DATA_DIR });
    return;
  }

  if (url.pathname === '/api/state') {
    if (req.method === 'GET') {
      await handleGetState(res);
      return;
    }
    if (req.method === 'POST') {
      await handlePostState(req, res);
      return;
    }
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  if (req.method === 'GET' || req.method === 'HEAD') {
    await serveStatic(url.pathname, res);
    return;
  }

  res.writeHead(405);
  res.end('Method Not Allowed');
}

const servers = [];
const primaryServer = http.createServer(requestHandler);
servers.push(primaryServer);

primaryServer.listen(PORT, HOST, () => {
  console.log(`Hifz Avengers server listening on http://${HOST}:${PORT} (storage: ${STATE_FILE})`);
});

// Also listen on port 80 in production containers in case reverse proxy defaults to port 80
if (PORT !== 80 && process.env.NODE_ENV === 'production') {
  const port80Server = http.createServer(requestHandler);
  port80Server.on('error', (err) => {
    console.warn('Optional port 80 listener skipped:', err.message);
  });
  port80Server.listen(80, HOST, () => {
    console.log(`Hifz Avengers server also listening on http://${HOST}:80`);
    servers.push(port80Server);
  });
}

function shutdown(signal) {
  console.log(`Received ${signal}, shutting down gracefully...`);
  Promise.all(
    servers.map(
      (srv) =>
        new Promise((resolve) => {
          srv.close(() => resolve());
        })
    )
  ).finally(() => {
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
