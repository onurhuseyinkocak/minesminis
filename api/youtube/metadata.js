export default async function handler(req, res) {
  // CORS
  const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5000').split(',');
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Password');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Admin-only: this endpoint scrapes YouTube and should not be public
  const pw = req.headers['x-admin-password'];
  const adminPass = process.env.ADMIN_PASSWORD || process.env.VITE_ADMIN_PASSWORD || '';
  if (!pw || !adminPass) return res.status(401).json({ error: 'Unauthorized' });
  const { timingSafeEqual } = await import('crypto');
  const a = Buffer.from(String(pw).trim());
  const b = Buffer.from(adminPass);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return res.status(401).json({ error: 'Unauthorized' });

  const url = req.query.url || req.query.v;
  if (!url || typeof url !== 'string') return res.status(400).json({ error: 'url gerekli' });

  // Sanitize: only allow reasonable URL length
  if (url.length > 200) return res.status(400).json({ error: 'URL too long' });

  const idMatch = String(url).match(/(?:v=|\/)([a-zA-Z0-9_-]{11})(?:\?|&|$)/) || (url.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(url) ? [null, url] : null);
  const videoId = idMatch ? idMatch[1] : null;
  if (!videoId) return res.status(400).json({ error: 'Gecersiz YouTube URL' });

  const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    let title = '';
    let description = '';
    let duration = '';
    const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const [oembedRes, pageRes] = await Promise.all([
      fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`, { headers: { 'User-Agent': ua }, signal: controller.signal }),
      fetch(watchUrl, { headers: { 'User-Agent': ua }, signal: controller.signal })
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

    res.status(200).json({
      videoId,
      title,
      description,
      duration,
      thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
    });
  } catch (e) {
    if (e.name === 'AbortError') {
      return res.status(504).json({ error: 'YouTube request timed out' });
    }
    res.status(500).json({ error: 'Video bilgileri alinamadi' });
  } finally {
    clearTimeout(timeout);
  }
}
