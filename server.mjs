import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import {
  getRandomLiterature,
  getBookMetadata,
  getBookText,
  cleanGutenbergBoilerplate,
  GENRES
} from './literature_engine.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, 'public');
const TTS_CACHE_DIR = path.join(__dirname, '.cache', 'tts');

// Ensure TTS cache directory exists
await fsp.mkdir(TTS_CACHE_DIR, { recursive: true }).catch(() => {});

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav'
};

function getLocalIp() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

function sendJSON(res, data, statusCode = 200) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

function sendError(res, message, statusCode = 500) {
  sendJSON(res, { error: message }, statusCode);
}

/**
 * Splits longer text into chunks under 160 characters on punctuation/spaces
 * for natural, high-fidelity Google neural speech generation.
 */
function splitTextIntoChunks(text, maxLen = 160) {
  if (text.length <= maxLen) return [text];

  const words = text.split(/\s+/);
  const chunks = [];
  let current = '';

  for (const word of words) {
    if ((current + ' ' + word).trim().length <= maxLen) {
      current = (current + ' ' + word).trim();
    } else {
      if (current) chunks.push(current);
      current = word;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

let activePort = 3000;

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  // --- API ROUTES ---
  if (pathname === '/api/network-info') {
    return sendJSON(res, {
      localIp: getLocalIp(),
      port: activePort,
      url: `http://${getLocalIp()}:${activePort}`
    });
  }

  if (pathname === '/api/genres') {
    return sendJSON(res, { genres: GENRES });
  }

  if (pathname === '/api/random') {
    try {
      const genre = parsedUrl.searchParams.get('genre') || 'all';
      const minutes = parseInt(parsedUrl.searchParams.get('minutes') || '20', 10);
      const excludeId = parsedUrl.searchParams.get('excludeId') || null;

      const data = await getRandomLiterature({ genre, targetMinutes: minutes, excludeId });
      return sendJSON(res, data);
    } catch (err) {
      console.error('Error in /api/random:', err);
      return sendError(res, err.message || 'Failed to fetch random literature');
    }
  }

  // --- HUMAN-LIKE NEURAL TTS ENDPOINT ---
  if (pathname === '/api/tts') {
    try {
      const text = (parsedUrl.searchParams.get('text') || '').trim();
      const lang = parsedUrl.searchParams.get('lang') || 'en-US'; // en-US (smooth female), en-GB (refined British female), etc.

      if (!text) return sendError(res, 'Missing text parameter', 400);

      // Check cache for this exact text + lang
      const hash = crypto.createHash('md5').update(`${lang}:${text}`).digest('hex');
      const cacheFile = path.join(TTS_CACHE_DIR, `${hash}.mp3`);

      try {
        const cached = await fsp.readFile(cacheFile);
        if (cached && cached.length > 500) {
          res.writeHead(200, {
            'Content-Type': 'audio/mpeg',
            'Cache-Control': 'public, max-age=86400',
            'Access-Control-Allow-Origin': '*'
          });
          return res.end(cached);
        }
      } catch {}

      // Split into gentle phrase chunks under 160 chars
      const chunks = splitTextIntoChunks(text, 160);
      const audioBuffers = [];

      for (const chunk of chunks) {
        const chunkHash = crypto.createHash('md5').update(`${lang}:${chunk}`).digest('hex');
        const chunkFile = path.join(TTS_CACHE_DIR, `c_${chunkHash}.mp3`);

        let chunkBuf;
        try {
          chunkBuf = await fsp.readFile(chunkFile);
        } catch {
          const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${encodeURIComponent(lang)}&client=tw-ob&q=${encodeURIComponent(chunk)}`;
          const audioRes = await fetch(googleUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
            },
            signal: AbortSignal.timeout(6000)
          });

          if (!audioRes.ok) throw new Error(`Upstream TTS returned status ${audioRes.status}`);
          chunkBuf = Buffer.from(await audioRes.arrayBuffer());
          await fsp.writeFile(chunkFile, chunkBuf).catch(() => {});
        }

        if (chunkBuf && chunkBuf.length > 0) {
          audioBuffers.push(chunkBuf);
        }
      }

      const combinedAudio = Buffer.concat(audioBuffers);
      await fsp.writeFile(cacheFile, combinedAudio).catch(() => {});

      res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*'
      });
      return res.end(combinedAudio);
    } catch (err) {
      console.error('Error generating TTS:', err);
      return sendError(res, err.message || 'TTS generation failed', 500);
    }
  }

  if (pathname.startsWith('/api/book/')) {
    const parts = pathname.split('/').filter(Boolean);
    const bookId = parts[2];
    const isFull = parts[3] === 'full';

    if (!bookId) {
      return sendError(res, 'Missing book ID', 400);
    }

    try {
      if (isFull) {
        const rawText = await getBookText(bookId);
        const cleaned = cleanGutenbergBoilerplate(rawText);
        const meta = await getBookMetadata(bookId);
        return sendJSON(res, { book: meta, text: cleaned });
      } else {
        const meta = await getBookMetadata(bookId);
        return sendJSON(res, { book: meta });
      }
    } catch (err) {
      console.error(`Error in /api/book/${bookId}:`, err);
      return sendError(res, err.message || 'Failed to retrieve book', 404);
    }
  }

  // --- STATIC FILE SERVING ---
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('Access denied');
  }

  try {
    const stats = await fsp.stat(filePath);
    if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  } catch (err) {
    try {
      const indexFile = path.join(PUBLIC_DIR, 'index.html');
      const content = await fsp.readFile(indexFile);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(content);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File Not Found');
    }
  }
});

let DEFAULT_PORT = parseInt(process.env.PORT || '3000', 10);

function startServer(port) {
  activePort = port;
  // Listen on 0.0.0.0 to enable access from phones and tablets on the local network
  server.listen(port, '0.0.0.0', () => {
    const localIp = getLocalIp();
    console.log(`\n==========================================================`);
    console.log(`🏛️  Bibliotheca - Literature Explorer & Reader is LIVE!`);
    console.log(`💻  Desktop: http://localhost:${port}`);
    console.log(`📱  Mobile Phone: http://${localIp}:${port}`);
    console.log(`==========================================================\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is occupied, trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer(DEFAULT_PORT);
