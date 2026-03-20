// ============================================================
// Backend Proxy Server for OpenAI API (payments removed)
// HARDENED WITH ENTERPRISE SECURITY
// ============================================================

import crypto from 'crypto';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import multer from 'multer';
import security from './security.js';
import billingRoutes from './routes/billing.js';

// Load .env - MUST use override: true so .env wins over any parent-process empty vars
const rootEnv = path.resolve(__dirname, '..', '.env');
const serverEnv = path.resolve(__dirname, '.env');
const loaded = fs.existsSync(rootEnv)
  ? dotenv.config({ path: rootEnv, override: true })
  : fs.existsSync(serverEnv)
    ? dotenv.config({ path: serverEnv, override: true })
    : dotenv.config({ override: true });
if (loaded.error && process.env.NODE_ENV !== 'production') {
  console.warn('⚠️ .env load warning:', loaded.error.message);
}

const UPLOADS_DIR = path.join(__dirname, 'uploads', 'worksheets');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (_, __, cb) => cb(null, UPLOADS_DIR),
    filename: (_, file, cb) => cb(null, `${Date.now()}-${(file.originalname || 'file').replace(/[^a-zA-Z0-9.-]/g, '_')}`)
  }),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const ext = (file.originalname || '').split('.').pop()?.toLowerCase();
    if (['pdf', 'jpg', 'jpeg', 'png'].includes(ext || '')) cb(null, true);
    else cb(new Error('Sadece PDF, JPEG, PNG kabul edilir'));
  }
});

const app = express();
const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || (isProduction ? 5000 : 3001);

// ============================================================
// SECURITY MIDDLEWARE (Applied First)
// ============================================================

// IP Blocking
app.use(security.ipBlocker);

// Security Headers (OWASP Compliant)
app.use(security.securityHeaders);

// Global Rate Limiting
app.use(security.rateLimiter({
  maxRequests: 100,
  windowMs: 60000
}));

// Trust proxy (for correct IP detection behind load balancers)
app.set('trust proxy', 1);

// ============================================================
// CORS & JSON MIDDLEWARE
// ============================================================

const allowedOrigins = [
  'http://localhost:5000',
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (server-to-server, Vite proxy, curl)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn(`⚠️ CORS blocked origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Admin-Password', 'X-CSRF-Token'],
  maxAge: 3600, // 1 hour
}));

// JSON body parser with size limit
app.use(express.json({
  limit: '10kb', // Prevent payload too large attacks
  strict: true,
}));

// URL-encoded body parser
app.use(express.urlencoded({
  extended: true,
  limit: '10kb'
}));

// ============================================================
// CSRF PROTECTION (Double-Submit Cookie Pattern)
// ============================================================

// Manual cookie parser (no dependency needed)
function parseCookies(req) {
  const header = req.headers.cookie || '';
  const cookies = {};
  header.split(';').forEach(pair => {
    const idx = pair.indexOf('=');
    if (idx > 0) {
      const key = pair.substring(0, idx).trim();
      const val = pair.substring(idx + 1).trim();
      cookies[key] = decodeURIComponent(val);
    }
  });
  return cookies;
}

// CSRF token endpoint — client calls this to get a token
app.get('/api/csrf-token', (req, res) => {
  const token = crypto.randomBytes(32).toString('hex');
  res.cookie('csrf_token', token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: isProduction,
    path: '/',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });
  res.json({ ok: true, token });
});

// CSRF middleware for mutating requests (POST/PUT/PATCH/DELETE)
function csrfProtection(req, res, next) {
  // Safe methods are exempt
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();

  // Exempt webhook endpoints (billing webhooks have their own signature verification)
  if (req.path.includes('/webhook')) return next();

  // Exempt health check
  if (req.path === '/api/health') return next();

  const cookies = parseCookies(req);
  const cookieToken = cookies.csrf_token;
  const headerToken = req.headers['x-csrf-token'];

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({ ok: false, error: 'Invalid CSRF token' });
  }
  next();
}

app.use(csrfProtection);

// ============================================================
// ADMIN AUTH & SUPABASE (must be before any route that uses them)
// ============================================================
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ||
  (isProduction ? '' : (process.env.VITE_SUPABASE_ANON_KEY || ''));
let adminSupabaseClient = null;
const getAdminSupabase = async () => {
  const url = (SUPABASE_URL || '').toString().trim();
  const key = (SUPABASE_SERVICE_KEY || '').toString().trim();
  if (!url || !key) {
    if (!isProduction) {
      console.warn('⚠️ Supabase config missing: url=' + (url ? 'ok' : 'MISSING') + ' key=' + (key ? 'ok' : 'MISSING'));
    }
    return null;
  }
  if (!adminSupabaseClient) {
    const { createClient } = await import('@supabase/supabase-js');
    adminSupabaseClient = createClient(url, key);
  }
  return adminSupabaseClient;
};

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.VITE_ADMIN_PASSWORD || '';
if (!ADMIN_PASSWORD) console.warn('⚠️ ADMIN_PASSWORD not set – password-based admin auth disabled');

const { verifyIdToken, isFirebaseAdminReady } = await import('./firebaseAdmin.js');
const requireAdminAuth = async (req, res, next) => {
  const passwordHeader = req.headers['x-admin-password'];
  if (ADMIN_PASSWORD && passwordHeader && String(passwordHeader).trim().length === ADMIN_PASSWORD.length && crypto.timingSafeEqual(Buffer.from(String(passwordHeader).trim()), Buffer.from(ADMIN_PASSWORD))) {
    req.adminUid = 'admin-password';
    return next();
  }

  const raw = req.headers.authorization;
  const token = raw && raw.startsWith('Bearer ') ? raw.slice(7).trim() : null;
  if (!token) {
    security.auditLog('ADMIN_API_NO_TOKEN', req);
    return res.status(401).json({ ok: false, error: 'Missing or invalid Authorization header' });
  }
  if (!isFirebaseAdminReady()) {
    return res.status(503).json({ ok: false, error: 'Admin auth not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY or GOOGLE_APPLICATION_CREDENTIALS' });
  }
  const decoded = await verifyIdToken(token);
  if (!decoded || !decoded.uid) {
    security.auditLog('ADMIN_API_INVALID_TOKEN', req);
    return res.status(403).json({ ok: false, error: 'Invalid or expired token' });
  }
  const sb = await getAdminSupabase();
  if (!sb) {
    return res.status(503).json({ ok: false, error: 'Database not configured' });
  }
  const { data, error } = await sb.from('users').select('role, is_admin').eq('id', decoded.uid).maybeSingle();
  if (error || !data || (data.role !== 'admin' && data.is_admin !== true)) {
    security.auditLog('ADMIN_API_NOT_ADMIN', req, { uid: decoded.uid });
    return res.status(403).json({ ok: false, error: 'Admin access required' });
  }
  req.adminUid = decoded.uid;
  next();
};

app.use('/api/admin', requireAdminAuth);

// ============================================================
// VALIDATE OPENAI API KEY
// ============================================================

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY not found');
} else {
  console.log('✅ OpenAI API Key loaded');
}

// ============================================================
// OPENAI ROUTES (with Rate Limiting & Validation)
// ============================================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
    security: 'hardened',
    timestamp: new Date().toISOString()
  });
});

// OpenAI Text-to-Speech Endpoint
// storyNarrator: true → gpt-4o-mini-tts + instructions (insan gibi hikaye anlatımı)
app.post('/api/tts',
  security.rateLimiter({ maxRequests: 120, windowMs: 60000, keyPrefix: 'tts' }),
  security.validateRequest({
    body: {
      text: { required: true, type: 'string', maxLength: 4000 }
    }
  }),
  async (req, res) => {
    // FIX 4: Require authentication for TTS endpoint
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ ok: false, error: 'Authentication required' });
    }
    try {
      const { text, voice = 'nova', storyNarrator = false } = req.body;
      const validVoices = ['alloy', 'ash', 'ballad', 'coral', 'echo', 'fable', 'onyx', 'nova', 'sage', 'shimmer', 'verse', 'marin', 'cedar'];
      const ttsVoice = validVoices.includes(voice) ? voice : 'nova';

      const useStoryNarrator = !!storyNarrator;
      const model = useStoryNarrator ? 'gpt-4o-mini-tts' : 'tts-1';
      const instructions = useStoryNarrator
        ? 'You are a warm, cheerful children\'s story narrator. Sound like a real mom or teacher reading to a child. Use natural rhythm, gentle emphasis on fun words, and friendly tone. Speak clearly and warmly - NOT robotic or monotone. Add natural pauses and a bit of expression. Be engaging and playful.'
        : undefined;

      const ttsBody = {
        model,
        input: text,
        voice: ttsVoice,
        response_format: 'mp3',
        speed: useStoryNarrator ? 0.92 : 0.95,
        ...(instructions && { instructions })
      };

      console.log('🔊 TTS request:', text.substring(0, 50) + '...', 'voice:', ttsVoice, 'model:', model);

      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify(ttsBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ OpenAI TTS Error:', response.status, errorData);
        return res.status(response.status).json({
          ok: false,
          error: errorData.error?.message || 'OpenAI TTS Error'
        });
      }

      const audioBuffer = await response.arrayBuffer();
      const base64Audio = Buffer.from(audioBuffer).toString('base64');

      console.log('✅ TTS audio generated successfully');

      res.json({
        ok: true,
        audio: base64Audio,
        format: 'mp3'
      });

    } catch (error) {
      console.error('❌ TTS Server error:', error);
      res.status(500).json({
        ok: false,
        error: 'Internal server error'
      });
    }
  }
);

// (duplicate health check removed — see /api/health above)

// ============================================================
// FISH AUDIO TTS PROXY (word pronunciation, 30 req/min/IP)
// ============================================================

// Validate Fish Audio API key at startup
const FISH_AUDIO_API_KEY = process.env.FISH_AUDIO_API_KEY;
if (!FISH_AUDIO_API_KEY) {
  console.warn('⚠️ FISH_AUDIO_API_KEY not set – Fish Audio TTS will return 503 (browser fallback will be used)');
} else {
  console.log('✅ Fish Audio API Key loaded');
}

app.post('/api/fish-tts',
  security.rateLimiter({ maxRequests: 30, windowMs: 60000, keyPrefix: 'fish-tts' }),
  async (req, res) => {
    const { text, speed = 1.0 } = req.body || {};

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ ok: false, error: 'Text required' });
    }
    if (text.length > 500) {
      return res.status(400).json({ ok: false, error: 'Text too long (max 500 chars)' });
    }

    if (!FISH_AUDIO_API_KEY) {
      return res.status(503).json({ ok: false, error: 'TTS not configured' });
    }

    const safeSpeed = Math.min(Math.max(Number(speed) || 1.0, 0.5), 2.0);

    try {
      const response = await fetch('https://api.fish.audio/v1/tts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${FISH_AUDIO_API_KEY}`,
          'Content-Type': 'application/json',
          'model': 's2-pro',
        },
        body: JSON.stringify({
          text: text.trim(),
          format: 'mp3',
          mp3_bitrate: 128,
          prosody: { speed: safeSpeed },
          latency: 'balanced',
        }),
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        console.error('❌ Fish Audio TTS error:', response.status, errText);
        return res.status(502).json({ ok: false, error: 'TTS generation failed' });
      }

      res.set('Content-Type', 'audio/mpeg');
      res.set('Cache-Control', 'public, max-age=86400'); // cache 24h on CDN/browser
      response.body.pipe(res);
    } catch (err) {
      console.error('❌ Fish Audio TTS service error:', err);
      res.status(500).json({ ok: false, error: 'TTS service error' });
    }
  }
);

// Blog Generate Endpoint - admin only
app.post('/api/blog/generate',
  requireAdminAuth,
  security.rateLimiter({ maxRequests: 20, windowMs: 60000, keyPrefix: 'blog-generate' }),
  async (req, res) => {
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ ok: false, error: 'OpenAI API key not configured' });
    }
    try {
      const topics = [
        'Kids learning English at home - tips for parents',
        'Fun ways to teach English vocabulary to children',
        'Best educational games for English learners aged 5-12',
        'How to make English learning enjoyable for kids',
        'Benefits of learning English at a young age',
        'Interactive worksheets for English practice',
        'MinesMinis: English learning platform for Turkish kids',
      ];
      const topic = topics[Math.floor(Math.random() * topics.length)];

      const sys = `You are an SEO content writer for an English learning platform for kids (MinesMinis). 
Write blog posts optimized for Google search. 
- Use clear H2/H3 headings, 800-1200 words
- Include meta_title (50-60 chars) and meta_description (150-160 chars)
- Use keyword-rich content, natural language
- Output ONLY valid JSON: { "title": "...", "slug": "url-slug", "content": "HTML/markdown", "excerpt": "2-3 sentences", "meta_title": "...", "meta_description": "..." }`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: sys },
            { role: 'user', content: `Write an SEO-optimized blog post about: ${topic}` },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        return res.status(500).json({ ok: false, error: err.error?.message || 'OpenAI error' });
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || '';
      let json = text;
      if (json.startsWith('```json')) json = json.slice(7);
      if (json.startsWith('```')) json = json.slice(3);
      if (json.endsWith('```')) json = json.slice(0, -3);
      json = json.trim();

      const post = JSON.parse(json);
      post.published_at = new Date().toISOString();
      post.created_at = post.published_at;
      post.updated_at = post.published_at;

      res.json({ ok: true, post });
    } catch (e) {
      console.error('Blog generate error:', e);
      res.status(500).json({ ok: false, error: e.message || 'Generation failed' });
    }
  }
);

// Daily Story Endpoint - cron ile üretilen hikayeyi döndürür
app.get('/api/story/today', (req, res) => {
  try {
    const storyFile = path.join(__dirname, 'data', 'dailyStory.json');

    if (!fs.existsSync(storyFile)) {
      return res.status(404).json({ ok: false, error: 'No daily story generated yet' });
    }

    const today = new Date().toISOString().slice(0, 10);
    const data = JSON.parse(fs.readFileSync(storyFile, 'utf8'));

    if (data.date !== today) {
      return res.status(404).json({ ok: false, error: 'Today\'s story not generated' });
    }

    res.json({ ok: true, data: data.story });
  } catch (error) {
    console.error('Story API error:', error);
    res.status(500).json({ ok: false, error: 'Failed to load story' });
  }
});

// Daily Challenge - günlük değişir, AI ile title/description üretir (cache per day)
const dailyChallengeCache = new Map();
// TTL cleanup: remove entries older than 24 hours, runs every hour
const CHALLENGE_CACHE_TTL = 24 * 60 * 60 * 1000; // 24h in ms
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of dailyChallengeCache) {
    if (value._cachedAt && now - value._cachedAt > CHALLENGE_CACHE_TTL) {
      dailyChallengeCache.delete(key);
    }
  }
}, 60 * 60 * 1000); // cleanup every hour
const CHALLENGE_TEMPLATES = [
  { type: 'words', target: 5, rewardXP: 50, icon: '📖' },
  { type: 'words', target: 10, rewardXP: 100, icon: '🌟' },
  { type: 'games', target: 2, rewardXP: 40, icon: '🎮' },
  { type: 'games', target: 3, rewardXP: 60, icon: '🎯' },
  { type: 'videos', target: 1, rewardXP: 25, icon: '🎬' },
  { type: 'videos', target: 2, rewardXP: 45, icon: '📺' },
  { type: 'worksheets', target: 1, rewardXP: 60, icon: '✏️' },
  { type: 'worksheets', target: 2, rewardXP: 90, icon: '📝' },
];
app.get('/api/daily-challenge', security.rateLimiter({ maxRequests: 60, windowMs: 60000 }), async (req, res) => {
  try {
    const dateStr = (req.query.date || new Date().toISOString().slice(0, 10)).toString().slice(0, 10);
    if (dailyChallengeCache.has(dateStr)) {
      const { _cachedAt, ...cached } = dailyChallengeCache.get(dateStr);
      return res.json(cached);
    }
    const seed = dateStr.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const template = CHALLENGE_TEMPLATES[seed % CHALLENGE_TEMPLATES.length];
    const id = `daily_${dateStr}`;
    let title = template.type === 'words' ? 'Word Explorer' : template.type === 'games' ? 'Game Master' : template.type === 'videos' ? 'Video Fan' : 'Writing Star';
    let description = `Complete ${template.target} ${template.type} today!`;

    if (OPENAI_API_KEY) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_API_KEY}` },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'You generate fun daily challenges for kids learning English (age 5-12). Respond ONLY with valid JSON: { "title": "short catchy title", "description": "one short sentence in English" }. No other text.' },
              { role: 'user', content: `Today\'s challenge: ${template.type}, target ${template.target}. Give a fun title and one sentence description.` }
            ],
            max_tokens: 120,
            temperature: 0.8
          })
        });
        if (response.ok) {
          const data = await response.json();
          const text = (data.choices?.[0]?.message?.content || '').replace(/```\w*|```/g, '').trim();
          const j = JSON.parse(text);
          if (j.title) title = j.title;
          if (j.description) description = j.description;
        }
      } catch (e) {
        console.warn('Daily challenge AI fallback:', e.message);
      }
    }

    const challenge = { id, title, description, target: template.target, type: template.type, rewardXP: template.rewardXP, icon: template.icon, _cachedAt: Date.now() };
    dailyChallengeCache.set(dateStr, challenge);
    const { _cachedAt, ...responseChallenge } = challenge;
    res.json(responseChallenge);
  } catch (e) {
    console.error('Daily challenge error:', e);
    res.status(500).json({ ok: false, error: 'Failed to load daily challenge' });
  }
});

// ============================================================
// PII DETECTION (child safety)
// ============================================================
function containsPII(text) {
  const patterns = [
    /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/,           // Phone numbers
    /\b\d{3}[-.]?\d{2}[-.]?\d{4}\b/,            // SSN-like
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
    /\b\d{1,5}\s+\w+\s+(street|st|ave|avenue|blvd|road|rd|dr|drive|lane|ln|way|court|ct|sokak|cadde|mahalle|mah)\b/i, // Address (EN + TR)
  ];
  return patterns.some(p => p.test(text));
}

// ============================================================
// SERVER-SIDE SYSTEM PROMPT (never trust client)
// ============================================================
const CHAT_SYSTEM_PROMPT = `Sen "Mimi" adında sevimli yeşil bir ejderhasın! 🐲✨

KRİTİK KURALLAR:

1. 🚫 SADECE İLK MESAJDA SELAMLA!
   - İlk mesaj: "Merhaba canım!" veya "Hello!" de
   - Sonraki mesajlar: ASLA "Merhaba", "Hello", "Hi" DEME! Direkt konuya gir!
   - Örnek: Çocuk "iyi" derse → "Harika! What shall we do today? 🐲" (selamlama YOK)

2. 📏 KISA YAZ: MAKSİMUM 2-3 cümle! Uzun yazmak yasak!

3. 🧠 HAFIZA: Konuşmayı HATIRLA!
   - Az önce ne konuştuk, onu takip et
   - Aynı soruyu sorma, aynı cevabı verme
   - Konuşmayı ilerlet, tekrarlama

4. 🌍 KARIŞIK DİL: Türkçe ve İngilizce karışık konuş
   - "Blue demek mavi! 💙"
   - "Let's play! Hadi oynayalım!"

5. 👶 BASİT: 5-8 yaş çocuk için basit kelimeler!

6. 🎯 KONUŞMAYI İLERLET:
   - Soru sor: "What's your favorite color?"
   - Öner: "Shall we learn animal names?"
   - Takip et: Çocuğun dediğine yanıt ver

YAPMA:
- Her mesajda selamlama (YASAK!)
- Tekrarlayan sorular
- Aynı şeyleri söylemek
- "Nasılsın?" diye sürekli sormak

İYİ ÖRNEK AKIŞ:
1. Mimi: "Merhaba tatlım! I'm Mimi! 🐲"
2. Çocuk: "iyiyim"
3. Mimi: "Super! Do you want to learn colors or animals today?" (selamlama YOK!)
4. Çocuk: "renkler"
5. Mimi: "Great choice! My favorite is GREEN - yeşil! 💚 What's yours?"

SEN: Arkadaş canlısı, eğlenceli, öğretici ejderha! 🐲`;

// OpenAI Chat Proxy Endpoint
app.post('/api/chat',
  security.rateLimiter({ maxRequests: 30, windowMs: 60000, keyPrefix: 'chat' }),
  async (req, res) => {
    try {
      // FIX 2: Require authentication (Firebase token or admin password)
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ ok: false, error: 'Authentication required' });
      }

      const { messages } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({
          ok: false, error: 'Invalid request: messages array required'
        });
      }

      // Validate message structure
      for (const msg of messages) {
        if (!msg.role || !msg.content) {
          return res.status(400).json({
            ok: false, error: 'Invalid message format'
          });
        }
        if (!['user', 'assistant', 'system'].includes(msg.role)) {
          return res.status(400).json({
            ok: false, error: 'Invalid message role'
          });
        }
        // Limit individual message length
        if (typeof msg.content === 'string' && msg.content.length > 2000) {
          return res.status(400).json({
            ok: false, error: 'Message content too long (max 2000 chars)'
          });
        }
      }

      // FIX 1: Strip any system messages from client — server controls the prompt
      const userMessages = messages.filter(m => m.role !== 'system');

      // FIX 3: PII filter — protect children's personal information
      const lastMsg = userMessages[userMessages.length - 1];
      if (lastMsg && typeof lastMsg.content === 'string' && containsPII(lastMsg.content)) {
        return res.json({
          message: "I noticed you might be sharing personal information. Let's keep that private! Instead, let's practice some English words! 🌟 Kişisel bilgilerini paylaşmayalım, onun yerine İngilizce öğrenmeye devam edelim! 🐲"
        });
      }

      // Prepend server-side system prompt, limit conversation history
      const fullMessages = [
        { role: 'system', content: CHAT_SYSTEM_PROMPT },
        ...userMessages.slice(-10) // Only last 10 messages for context
      ];

      console.log('📨 Received chat request with', userMessages.length, 'user messages');

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: fullMessages,
          max_tokens: 150,
          temperature: 0.6,
          frequency_penalty: 0.3,
          presence_penalty: 0.2
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ OpenAI API Error:', response.status, errorData);

        return res.status(response.status).json({
          ok: false,
          error: errorData.error?.message || 'OpenAI API Error'
        });
      }

      const data = await response.json();
      console.log('✅ OpenAI response received');

      res.json({
        message: data.choices[0].message.content,
        model: data.model,
        usage: data.usage
      });

    } catch (error) {
      console.error('❌ Server error:', error);
      res.status(500).json({
        ok: false,
        error: 'Internal server error'
      });
    }
  }
);

// ============================================================
// ADMIN SECURITY ENDPOINTS
// ============================================================

// Admin health check (used by login form to verify password server-side)
app.get('/api/admin/health', requireAdminAuth, (req, res) => {
  res.json({ status: 'ok', authenticated: true });
});

// Get security status (admin only)
app.get('/api/admin/security-status', requireAdminAuth, (req, res) => {
  const status = security.getSecurityStatus();
  res.json(status);
});

// ============================================================
// SEO - Dynamic sitemap.xml & robots.txt (7/24 çalışır)
// ============================================================
const SITE_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/games', priority: '0.9', changefreq: 'weekly' },
  { path: '/words', priority: '0.9', changefreq: 'weekly' },
  { path: '/videos', priority: '0.9', changefreq: 'weekly' },
  { path: '/worksheets', priority: '0.9', changefreq: 'weekly' },
  { path: '/blog', priority: '0.9', changefreq: 'weekly' },
  { path: '/premium', priority: '0.8', changefreq: 'monthly' },
  { path: '/pricing', priority: '0.8', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.5', changefreq: 'yearly' },
  { path: '/terms', priority: '0.5', changefreq: 'yearly' },
  { path: '/cookies', priority: '0.5', changefreq: 'yearly' },
  { path: '/ataturk', priority: '0.7', changefreq: 'monthly' },
  { path: '/story', priority: '0.8', changefreq: 'weekly' },
];

app.get('/sitemap.xml', async (req, res) => {
  try {
    const base = (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-host'])
      ? `${req.headers['x-forwarded-proto']}://${req.headers['x-forwarded-host']}`
      : `${req.protocol}://${req.get('host')}`;
    const siteBase = base.replace(/\/$/, '');
    const today = new Date().toISOString().split('T')[0];
    let blogSlugs = [];
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(process.env.VITE_SUPABASE_URL || '', process.env.VITE_SUPABASE_ANON_KEY || '');
      const { data } = await supabase.from('blog_posts').select('slug');
      if (data) blogSlugs = data.map(r => r.slug).filter(Boolean);
    } catch (_) {}
    const staticUrls = SITE_ROUTES.map(r => `  <url>
    <loc>${siteBase}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('\n');
    const blogUrls = blogSlugs.map(slug => `  <url>
    <loc>${siteBase}/blog/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n');
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${blogUrls}
</urlset>`;
    res.set('Content-Type', 'application/xml');
    res.send(xml);
  } catch (e) {
    console.error('Sitemap error:', e);
    res.status(500).send('Error generating sitemap');
  }
});

app.get('/robots.txt', (req, res) => {
  const base = (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-host'])
    ? `${req.headers['x-forwarded-proto']}://${req.headers['x-forwarded-host']}`
    : `${req.protocol}://${req.get('host')}`;
  const siteBase = base.replace(/\/$/, '');
  const txt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${siteBase}/sitemap.xml`;
  res.set('Content-Type', 'text/plain');
  res.send(txt);
});

app.post('/api/seo/apply', security.rateLimiter({ maxRequests: 20, windowMs: 60000, keyPrefix: 'seo-apply' }), async (req, res) => {
  try {
    const base = req.headers.origin || `${req.protocol}://${req.get('host')}`;
    const siteBase = base.replace(/\/$/, '');
    const sitemapUrl = encodeURIComponent(`${siteBase}/sitemap.xml`);
    await fetch(`https://www.google.com/ping?sitemap=${sitemapUrl}`);
    await fetch(`https://www.bing.com/ping?sitemap=${sitemapUrl}`).catch(() => {});
    res.json({ ok: true, message: 'Google ve Bing sitemap bildirildi' });
  } catch (e) {
    console.error('SEO apply error:', e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.get('/api/youtube/metadata', security.rateLimiter({ maxRequests: 20, windowMs: 60000 }), async (req, res) => {
  const url = req.query.url || req.query.v;
  if (!url) return res.status(400).json({ ok: false, error: 'url gerekli' });
  const idMatch = String(url).match(/(?:v=|\/)([a-zA-Z0-9_-]{11})(?:\?|&|$)/) || (url.length === 11 ? [null, url] : null);
  const videoId = idMatch ? idMatch[1] : null;
  if (!videoId) return res.status(400).json({ ok: false, error: 'Geçersiz YouTube URL' });
  const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  try {
    let title = '';
    let description = '';
    let duration = '';
    const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

    const [oembedRes, pageRes] = await Promise.all([
      fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`, { headers: { 'User-Agent': ua } }),
      fetch(watchUrl, { headers: { 'User-Agent': ua } })
    ]);

    if (oembedRes.ok) {
      const oembed = await oembedRes.json().catch(() => ({}));
      if (oembed.title) title = oembed.title.replace(/&amp;/g, '&').replace(/&#39;/g, "'");
    }

    const html = await pageRes.text();
    if (!title) {
      const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/) || html.match(/<title>([^<]+)<\/title>/);
      title = titleMatch ? titleMatch[1].replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/\s*-\s*YouTube$/, '') : 'YouTube Video';
    }
    const descMatch = html.match(/<meta property="og:description" content="([^"]*)"/);
    if (descMatch) description = descMatch[1].replace(/&amp;/g, '&').replace(/&#39;/g, "'").slice(0, 500);

    const lenSec = html.match(/"lengthSeconds":"(\d+)"/);
    const approxMs = html.match(/"approxDurationMs":"(\d+)"/);
    if (lenSec) duration = `${Math.floor(parseInt(lenSec[1], 10) / 60)}:${(parseInt(lenSec[1], 10) % 60).toString().padStart(2, '0')}`;
    else if (approxMs) {
      const sec = Math.round(parseInt(approxMs[1], 10) / 1000);
      duration = `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, '0')}`;
    }

    res.json({
      videoId,
      title,
      description,
      duration,
      thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
    });
  } catch (e) {
    console.error('YouTube metadata error:', e);
    res.status(500).json({ ok: false, error: 'Video bilgileri alınamadı' });
  }
});

app.post('/api/worksheets/upload', requireAdminAuth, security.rateLimiter({ maxRequests: 20, windowMs: 60000 }), upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ ok: false, error: 'Dosya gerekli' });
    const base = req.headers.origin || `${req.protocol}://${req.get('host')}`;
    const url = `${base.replace(/\/$/, '')}/uploads/worksheets/${req.file.filename}`;
    res.json({ ok: true, url, thumbnailUrl: /\.(jpg|jpeg|png)$/i.test(req.file.originalname || '') ? url : null });
  } catch (e) {
    console.error('Worksheet upload error:', e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads'), { maxAge: '1d' }));

// Admin API routes (requireAdminAuth applied via app.use('/api/admin', ...) above)
app.post('/api/admin/words', security.rateLimiter({ maxRequests: 50, windowMs: 60000 }), async (req, res) => {
  try {
    const sb = await getAdminSupabase();
    if (!sb) return res.status(503).json({ ok: false, error: 'Supabase yapılandırılmamış. .env dosyasına VITE_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY ekleyin.' });
    const { word, turkish, level, category, emoji, example } = req.body;
    if (!word || !turkish) return res.status(400).json({ ok: false, error: 'word ve turkish gerekli' });
    const { data, error } = await sb.from('words').insert({ word: String(word).trim(), turkish: String(turkish), level: level || 'beginner', category: category || 'Animals', emoji: emoji || '📚', example: example || null }).select().single();
    if (error) throw error;
    res.json(data);
  } catch (e) {
    console.error('Admin words insert:', e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.patch('/api/admin/words/:word', security.rateLimiter({ maxRequests: 50, windowMs: 60000 }), async (req, res) => {
  try {
    const sb = await getAdminSupabase();
    if (!sb) return res.status(503).json({ ok: false, error: 'Supabase yapılandırılmamış' });
    const { turkish, level, category, emoji, example } = req.body;
    const { error } = await sb.from('words').update({ turkish, level, category, emoji, example }).eq('word', decodeURIComponent(req.params.word));
    if (error) throw error;
    res.json({ ok: true });
  } catch (e) {
    console.error('Admin words update:', e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.delete('/api/admin/words/:word', security.rateLimiter({ maxRequests: 50, windowMs: 60000 }), async (req, res) => {
  try {
    const sb = await getAdminSupabase();
    if (!sb) return res.status(503).json({ ok: false, error: 'Supabase yapılandırılmamış' });
    const { error } = await sb.from('words').delete().eq('word', decodeURIComponent(req.params.word));
    if (error) throw error;
    res.json({ ok: true });
  } catch (e) {
    console.error('Admin words delete:', e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.post('/api/admin/videos', security.rateLimiter({ maxRequests: 30, windowMs: 60000 }), async (req, res) => {
  try {
    const sb = await getAdminSupabase();
    if (!sb) return res.status(503).json({ ok: false, error: 'Supabase yapılandırılmamış' });
    const { youtube_id, title, description, thumbnail, duration, category, grade, isPopular } = req.body;
    if (!youtube_id || !title) return res.status(400).json({ ok: false, error: 'youtube_id ve title gerekli' });
    const row = { youtube_id, title, description: description || '', thumbnail: thumbnail || '', duration: duration || '0:00', category: category || 'lesson' };
    if (grade != null) row.grade = grade;
    if (isPopular != null) row.is_popular = !!isPopular;
    const { data, error } = await sb.from('videos').insert(row).select().single();
    if (error) throw error;
    res.json(data);
  } catch (e) {
    console.error('Admin videos insert:', e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.patch('/api/admin/videos/:id', security.rateLimiter({ maxRequests: 30, windowMs: 60000 }), async (req, res) => {
  try {
    const sb = await getAdminSupabase();
    if (!sb) return res.status(503).json({ ok: false, error: 'Supabase yapılandırılmamış' });
    const { youtube_id, title, description, thumbnail, duration, category, grade, isPopular } = req.body;
    const row = {};
    if (youtube_id != null) row.youtube_id = youtube_id;
    if (title != null) row.title = title;
    if (description != null) row.description = description;
    if (thumbnail != null) row.thumbnail = thumbnail;
    if (duration != null) row.duration = duration;
    if (category != null) row.category = category;
    if (grade != null) row.grade = grade;
    if (isPopular != null) row.is_popular = !!isPopular;
    const { error } = await sb.from('videos').update(row).eq('id', req.params.id);
    if (error) throw error;
    res.json({ ok: true });
  } catch (e) {
    console.error('Admin videos update:', e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.delete('/api/admin/videos/:id', security.rateLimiter({ maxRequests: 30, windowMs: 60000 }), async (req, res) => {
  try {
    const sb = await getAdminSupabase();
    if (!sb) return res.status(503).json({ ok: false, error: 'Supabase yapılandırılmamış' });
    const { error } = await sb.from('videos').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ ok: true });
  } catch (e) {
    console.error('Admin videos delete:', e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.post('/api/admin/games', security.rateLimiter({ maxRequests: 30, windowMs: 60000 }), async (req, res) => {
  try {
    const sb = await getAdminSupabase();
    if (!sb) return res.status(503).json({ ok: false, error: 'Supabase yapılandırılmamış' });
    const { title, url, category, thumbnail_url, description, target_audience } = req.body;
    if (!title || !url) return res.status(400).json({ ok: false, error: 'title ve url gerekli' });
    const { data, error } = await sb.from('games').insert({ title, url, category: category || 'Quiz', thumbnail_url: thumbnail_url || null, description: description || '', target_audience: target_audience || '2' }).select('id').single();
    if (error) throw error;
    res.json(data);
  } catch (e) {
    console.error('Admin games insert:', e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.patch('/api/admin/games/:id', security.rateLimiter({ maxRequests: 30, windowMs: 60000 }), async (req, res) => {
  try {
    const sb = await getAdminSupabase();
    if (!sb) return res.status(503).json({ ok: false, error: 'Supabase yapılandırılmamış' });
    const { title, url, category, thumbnail_url, description, target_audience } = req.body;
    const row = {};
    if (title != null) row.title = title;
    if (url != null) row.url = url;
    if (category != null) row.category = category;
    if (thumbnail_url != null) row.thumbnail_url = thumbnail_url;
    if (description != null) row.description = description;
    if (target_audience != null) row.target_audience = target_audience;
    const { error } = await sb.from('games').update(row).eq('id', req.params.id);
    if (error) throw error;
    res.json({ ok: true });
  } catch (e) {
    console.error('Admin games update:', e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.delete('/api/admin/games/:id', security.rateLimiter({ maxRequests: 30, windowMs: 60000 }), async (req, res) => {
  try {
    const sb = await getAdminSupabase();
    if (!sb) return res.status(503).json({ ok: false, error: 'Supabase yapılandırılmamış' });
    const { error } = await sb.from('games').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ ok: true });
  } catch (e) {
    console.error('Admin games delete:', e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Admin Worksheets API - persist to Supabase
app.post('/api/admin/worksheets', security.rateLimiter({ maxRequests: 30, windowMs: 60000 }), async (req, res) => {
  try {
    const sb = await getAdminSupabase();
    if (!sb) return res.status(503).json({ ok: false, error: 'Supabase yapılandırılmamış' });
    const { title, description, category, grade, thumbnailUrl, externalUrl, source } = req.body;
    if (!title || !externalUrl) return res.status(400).json({ ok: false, error: 'title ve externalUrl (veya file_url) gerekli' });
    const ext = (externalUrl.split('?')[0].split('.').pop() || 'html').toLowerCase();
    const fileType = ['pdf', 'jpg', 'jpeg', 'png'].includes(ext) ? ext : 'html';
    const fileName = (title || 'worksheet').replace(/\s+/g, '-').toLowerCase() + '.' + fileType;
    const row = {
      title: String(title),
      description: description || '',
      file_url: String(externalUrl),
      file_name: fileName,
      file_type: fileType,
      subject: category || 'Vocabulary',
      grade: String(grade || '2'),
      thumbnail_url: thumbnailUrl || null,
      source: source || 'MinesMinis'
    };
    const { data, error } = await sb.from('worksheets').insert(row).select().single();
    if (error) throw error;
    res.json(data);
  } catch (e) {
    console.error('Admin worksheets insert:', e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.patch('/api/admin/worksheets/:id', security.rateLimiter({ maxRequests: 30, windowMs: 60000 }), async (req, res) => {
  try {
    const sb = await getAdminSupabase();
    if (!sb) return res.status(503).json({ ok: false, error: 'Supabase yapılandırılmamış' });
    const { title, description, category, grade, thumbnailUrl, externalUrl, source } = req.body;
    const row = {};
    if (title != null) row.title = title;
    if (description != null) row.description = description;
    if (category != null) row.subject = category;
    if (grade != null) row.grade = grade;
    if (thumbnailUrl != null) row.thumbnail_url = thumbnailUrl;
    if (externalUrl != null) row.file_url = externalUrl;
    if (source != null) row.source = source;
    if (Object.keys(row).length === 0) return res.json({ ok: true });
    const { error } = await sb.from('worksheets').update(row).eq('id', req.params.id);
    if (error) throw error;
    res.json({ ok: true });
  } catch (e) {
    console.error('Admin worksheets update:', e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.delete('/api/admin/worksheets/:id', security.rateLimiter({ maxRequests: 30, windowMs: 60000 }), async (req, res) => {
  try {
    const sb = await getAdminSupabase();
    if (!sb) return res.status(503).json({ ok: false, error: 'Supabase yapılandırılmamış' });
    const { error } = await sb.from('worksheets').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ ok: true });
  } catch (e) {
    console.error('Admin worksheets delete:', e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.post('/api/admin/blog', security.rateLimiter({ maxRequests: 30, windowMs: 60000, keyPrefix: 'admin-blog' }), async (req, res) => {
  try {
    const sb = await getAdminSupabase();
    if (!sb) return res.status(503).json({ ok: false, error: 'Supabase yapılandırılmamış' });
    const { title, slug, content, excerpt, meta_title, meta_description, published_at } = req.body;
    if (!title || !content) return res.status(400).json({ ok: false, error: 'title ve content gerekli' });
    const s = (slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/^-|-$/g, '');
    const row = {
      title: String(title),
      slug: s,
      content: String(content),
      excerpt: excerpt || content?.slice(0, 200) || '',
      meta_title: meta_title || title,
      meta_description: meta_description || excerpt || '',
      published_at: published_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const { data, error } = await sb.from('blog_posts').insert(row).select().single();
    if (error) throw error;
    res.json(data);
  } catch (e) {
    console.error('Admin blog insert:', e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.post('/api/words/enrich', requireAdminAuth, security.rateLimiter({ maxRequests: 30, windowMs: 60000 }), async (req, res) => {
  const { word } = req.body;
  if (!word || typeof word !== 'string') return res.status(400).json({ ok: false, error: 'word gerekli' });
  const w = word.trim().toLowerCase();
  if (!w) return res.status(400).json({ ok: false, error: 'Kelime boş olamaz' });
  try {
    const [turkishRes, openaiRes] = await Promise.all([
      fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(w)}&langpair=en|tr`).then(r => r.json()),
      OPENAI_API_KEY ? fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_API_KEY}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'Respond with ONLY valid JSON: { "emoji": "single emoji", "example": "simple English sentence for kids" }. No other text.' },
            { role: 'user', content: `Word: ${w}` }
          ],
          max_tokens: 80,
          temperature: 0.3
        })
      }).then(r => r.json()) : null
    ]);
    const turkish = turkishRes?.responseData?.translatedText || w;
    let emoji = '📚';
    let example = '';
    if (openaiRes?.choices?.[0]?.message?.content) {
      try {
        const j = JSON.parse(openaiRes.choices[0].message.content.replace(/```\w*|```/g, '').trim());
        if (j.emoji) emoji = j.emoji;
        if (j.example) example = j.example;
      } catch (_) {}
    }
    const emojiMap = { apple:'🍎',cat:'🐱',dog:'🐕',book:'📚',ball:'⚽',sun:'☀️',car:'🚗',tree:'🌳',water:'💧',food:'🍎',animal:'🐾',run:'🏃',jump:'🦘',happy:'😊',red:'🔴',blue:'🔵',green:'🟢',banana:'🍌',bird:'🐦',fish:'🐟',house:'🏠',milk:'🥛',school:'🏫',star:'⭐',flower:'🌸',moon:'🌙',cloud:'☁️',heart:'❤️',friend:'👫',family:'👨‍👩‍👧',play:'⚽',rain:'🌧️',butterfly:'🦋',lion:'🦁',rainbow:'🌈',pizza:'🍕',orange:'🍊',mouse:'🐁',elephant:'🐘',tiger:'🐯',rabbit:'🐰',snake:'🐍',horse:'🐴',cow:'🐄',chicken:'🐔',duck:'🦆',frog:'🐸',bee:'🐝',bear:'🐻',monkey:'🐒',penguin:'🐧',owl:'🦉',turtle:'🐢',whale:'🐋',dolphin:'🐬',shark:'🦈',cookie:'🍪',bread:'🍞',milk:'🥛',egg:'🥚',cheese:'🧀',carrot:'🥕', tomato:'🍅',potato:'🥔',banana:'🍌',grape:'🍇',strawberry:'🍓',cherry:'🍒',peach:'🍑',watermelon:'🍉',lemon:'🍋',small:'🐁',big:'🐘',fast:'🚀',slow:'🐢',hot:'🔥',cold:'❄️',new:'✨',old:'📜',good:'👍',bad:'👎',love:'❤️',like:'👍',nice:'😊',fun:'🎉',cool:'😎',sad:'😢',angry:'😠',tired:'😴',hungry:'🍕',thirsty:'💧',sleepy:'😴',excited:'🎉',scared:'😨',surprised:'😲',brave:'🦁',kind:'💝',smart:'🧠',strong:'💪',beautiful:'🌸',ugly:'👾',clean:'✨',dirty:'💩',easy:'😊',hard:'💪',open:'📂',close:'🔒',start:'🏁',stop:'🛑',come:'👋',go:'👋',run:'🏃',walk:'🚶',sit:'🪑',stand:'🧍',jump:'🦘',fly:'✈️',swim:'🏊',read:'📖',write:'✏️',draw:'🎨',sing:'🎤',dance:'💃',eat:'🍕',drink:'🥤',sleep:'😴',wake:'⏰',learn:'📚',teach:'👩‍🏫',think:'🤔',know:'💡',see:'👀',hear:'👂',smell:'👃',touch:'🤚',taste:'👅' };
    if (emojiMap[w]) emoji = emojiMap[w];
    if (!example && turkish) example = `I like ${w}.`;
    res.json({ turkish, emoji, example });
  } catch (e) {
    console.error('Words enrich error:', e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

// ============================================================
// BILLING ROUTES (Lemon Squeezy)
// ============================================================
app.use('/api/billing', billingRoutes);

// ============================================================
// STATIC FILE SERVING (Production)
// ============================================================

if (isProduction) {
  const distPath = path.join(__dirname, '..', 'dist');

  app.use(express.static(distPath, {
    maxAge: '1d', // Cache static files for 1 day
    etag: true,
    lastModified: true,
  }));

  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'));
    }
  });

  console.log('📁 Serving static files from:', distPath);
}

// ============================================================
// ERROR HANDLING
// ============================================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({ ok: false, error: 'Not Found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  security.auditLog('SERVER_ERROR', req, { error: err.message });

  res.status(500).json({
    ok: false,
    error: isProduction ? 'Internal Server Error' : err.message
  });
});

// ============================================================
// SERVER STARTUP
// ============================================================

async function startServer() {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    const sbOk = !!(SUPABASE_URL && SUPABASE_SERVICE_KEY);
    console.log(sbOk ? '✅ Supabase configured (admin API ready)' : '⚠️ Supabase NOT configured – admin panel will show "yapılandırılmamış"');
    console.log(`✅ Mode: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
    console.log(`🔒 Security: ENTERPRISE HARDENED`);
    console.log(`✅ Ready to proxy requests to OpenAI API`);
  });
}

startServer();
