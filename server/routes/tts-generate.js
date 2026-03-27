/**
 * TTS Generate Routes
 * Manages bulk/single audio generation via the local Qwen TTS server (port 7700).
 * Routes:
 *   POST /api/tts/generate-bulk  — trigger generation for all missing items
 *   GET  /api/tts/status         — count of items cached in tts_cache
 *   POST /api/tts/generate-one   — generate a single item { text, key }
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const TTS_SERVER = 'http://localhost:7700';

const SUPABASE_URL = 'https://sblwqplagirgiroekotp.supabase.co';
const SERVICE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNibHdxcGxhZ2lyZ2lyb2Vrb3RwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIs' +
  'ImlhdCI6MTc2MTUzNzY3NiwiZXhwIjoyMDc3MTEzNjc2fQ.' +
  'spZC8YAQ7K42eCpkl17kwQdrfeqVeEC9EgAlpl629v8';

// Track running bulk job state in-process (single server instance only)
let bulkRunning = false;
let bulkProgress = { done: 0, total: 0, errors: 0, running: false };

function getTtsItemsPath() {
  return path.resolve(__dirname, '..', '..', 'tts-items.json');
}

function loadTtsItems() {
  const p = getTtsItemsPath();
  if (!fs.existsSync(p)) return [];
  try {
    return JSON.parse(fs.readFileSync(p, 'utf-8'));
  } catch {
    return [];
  }
}

async function getCachedCount() {
  try {
    const resp = await fetch(
      `${SUPABASE_URL}/rest/v1/tts_cache?select=id&limit=10000`,
      {
        headers: {
          Authorization: `Bearer ${SERVICE_KEY}`,
          apikey: SERVICE_KEY,
          'Content-Range': '0-9999',
          Prefer: 'count=exact',
        },
      }
    );
    const contentRange = resp.headers.get('content-range');
    if (contentRange) {
      const match = contentRange.match(/\/(\d+)$/);
      if (match) return parseInt(match[1], 10);
    }
    const rows = await resp.json();
    return Array.isArray(rows) ? rows.length : 0;
  } catch {
    return 0;
  }
}

async function generateOne(text, key, instruction) {
  const body = { text, key, instruction };
  const resp = await fetch(`${TTS_SERVER}/generate-and-upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(120_000),
  });
  if (!resp.ok) {
    const errText = await resp.text().catch(() => 'unknown');
    throw new Error(`TTS server error ${resp.status}: ${errText}`);
  }
  return resp.json();
}

// ─── GET /api/tts/status ──────────────────────────────────────────────────────

router.get('/status', async (req, res) => {
  try {
    const items = loadTtsItems();
    const cached = await getCachedCount();
    res.json({
      ok: true,
      total: items.length,
      cached,
      missing: Math.max(0, items.length - cached),
      bulk: bulkProgress,
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ─── POST /api/tts/generate-one ──────────────────────────────────────────────

router.post('/generate-one', async (req, res) => {
  const { text, key, instruction } = req.body || {};
  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ ok: false, error: 'text is required' });
  }
  if (!key || typeof key !== 'string' || !key.trim()) {
    return res.status(400).json({ ok: false, error: 'key is required' });
  }
  try {
    const storageKey = key.endsWith('.wav') ? key : `${key}.wav`;
    const result = await generateOne(text.trim(), storageKey, instruction);
    res.json({ ok: true, url: result.url, cached: result.cached });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ─── POST /api/tts/generate-bulk ─────────────────────────────────────────────

router.post('/generate-bulk', async (req, res) => {
  if (bulkRunning) {
    return res.json({ ok: true, message: 'Bulk generation already running', bulk: bulkProgress });
  }

  const items = loadTtsItems();
  if (!items.length) {
    return res.status(400).json({ ok: false, error: 'tts-items.json not found or empty' });
  }

  // Check TTS server health first
  try {
    const health = await fetch(`${TTS_SERVER}/health`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!health.ok) throw new Error('TTS server unhealthy');
  } catch {
    return res.status(503).json({
      ok: false,
      error: 'Local TTS server not reachable at http://localhost:7700. Start tts-server.py first.',
    });
  }

  bulkRunning = true;
  bulkProgress = { done: 0, total: items.length, errors: 0, running: true };

  // Run async — return immediately
  res.json({ ok: true, message: 'Bulk generation started', total: items.length });

  // Process with concurrency limit of 1 to avoid overloading the local model
  (async () => {
    for (const item of items) {
      try {
        const storageKey = `${item.id}.wav`;
        await generateOne(item.text, storageKey, item.instruction);
        bulkProgress.done++;
      } catch (err) {
        bulkProgress.errors++;
        console.error(`TTS bulk error for ${item.id}:`, err.message);
      }
    }
    bulkRunning = false;
    bulkProgress.running = false;
    console.log(
      `TTS bulk generation complete: ${bulkProgress.done}/${bulkProgress.total} done, ${bulkProgress.errors} errors`
    );
  })().catch((err) => {
    bulkRunning = false;
    bulkProgress.running = false;
    console.error('TTS bulk generation crashed:', err);
  });
});

export default router;
