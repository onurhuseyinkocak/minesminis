import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const pw = req.headers['x-admin-password'];
  const adminPass = process.env.ADMIN_PASSWORD || process.env.VITE_ADMIN_PASSWORD || '';
  if (!pw || !adminPass) return res.status(401).json({ error: 'Unauthorized' });
  const a = Buffer.from(String(pw).trim());
  const b = Buffer.from(adminPass);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return res.status(401).json({ error: 'Unauthorized' });
  const { word } = req.body || {};
  if (!word || typeof word !== 'string') return res.status(400).json({ error: 'word gerekli' });
  const w = word.trim().toLowerCase();
  if (!w) return res.status(400).json({ error: 'Kelime bos olamaz' });
  try {
    const turkishRes = await fetch('https://api.mymemory.translated.net/get?q=' + encodeURIComponent(w) + '&langpair=en|tr').then(r => r.json());
    const turkish = turkishRes?.responseData?.translatedText || w;
    let emoji = '📚';
    let example = turkish ? ('I like ' + w + '.') : '';
    const openaiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;
    if (openaiKey) {
      try {
        const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + openaiKey },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'Respond with ONLY valid JSON: { emoji: string, example: string }.' },
              { role: 'user', content: 'Word: ' + w }
            ],
            max_tokens: 80,
            temperature: 0.3
          })
        }).then(r => r.json());
        if (openaiRes?.choices?.[0]?.message?.content) {
          const raw = openaiRes.choices[0].message.content.replace(/```\w*|```/g, '').trim();
          const j = JSON.parse(raw);
          if (j.emoji) emoji = j.emoji;
          if (j.example) example = j.example;
        }
      } catch (_) {}
    }
    res.status(200).json({ turkish, emoji, example });
  } catch (e) {
    console.error('Words enrich error:', e);
    res.status(500).json({ error: e.message || 'Bilgiler alinamadi' });
  }
}
