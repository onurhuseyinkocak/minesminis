export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const url = req.query.url || req.query.v;
  if (!url) return res.status(400).json({ error: 'url gerekli' });
  const idMatch = String(url).match(/(?:v=|\/)([a-zA-Z0-9_-]{11})(?:\?|&|$)/) || (url.length === 11 ? [null, url] : null);
  const videoId = idMatch ? idMatch[1] : null;
  if (!videoId) return res.status(400).json({ error: 'Geçersiz YouTube URL' });
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
    res.status(200).json({
      videoId,
      title,
      description,
      duration,
      thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
    });
  } catch (e) {
    console.error('YouTube metadata error:', e);
    res.status(500).json({ error: 'Video bilgileri alınamadı' });
  }
}
