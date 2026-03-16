import { getSupabase, getEnvStatus, getSupabaseUnavailableResponse } from './_lib/admin.js';
import crypto from 'crypto';

function checkAuth(req) {
  const pw = req.headers['x-admin-password'];
  const adminPass = process.env.ADMIN_PASSWORD || process.env.VITE_ADMIN_PASSWORD || '';
  if (!adminPass || !pw) return false;
  const input = String(pw).trim();
  if (input.length !== adminPass.length) return false;
  return crypto.timingSafeEqual(Buffer.from(input), Buffer.from(adminPass));
}

export default async function handler(req, res) {
  const path = (req.query.path || '').replace(/^\/+|\/+$/g, '');
  const segments = path ? path.split('/') : [];
  const resource = segments[0];
  const idOrWord = segments[1] ? decodeURIComponent(segments[1]) : null;

  if (resource === 'health') {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    const status = getEnvStatus();
    return res.status(200).json({
      ok: true,
      supabaseConfigured: status.supabaseConfigured,
      hasSupabaseUrl: status.hasSupabaseUrl,
      hasSupabaseKey: status.hasSupabaseKey,
      hint: status.hint,
      message: status.supabaseConfigured ? 'Admin API configured.' : status.hint,
    });
  }

  if (!checkAuth(req)) return res.status(401).json({ error: 'Unauthorized' });
  const sb = getSupabase();
  if (!sb) return res.status(503).json(getSupabaseUnavailableResponse());

  const body = req.body || {};

  try {
    if (resource === 'upload') {
      if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
      const { file, name } = body;
      if (!file || !name) return res.status(400).json({ error: 'file ve name gerekli' });
      const allowedExt = ['pdf', 'jpg', 'jpeg', 'png'];
      const ext = (name.split('.').pop() || '').toLowerCase();
      if (!allowedExt.includes(ext)) return res.status(400).json({ error: 'Sadece PDF, JPEG, PNG' });
      const buf = Buffer.from(file, 'base64');
      const safeName = name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const storagePath = `uploads/${Date.now()}-${safeName}`;
      const contentType = ext === 'pdf' ? 'application/pdf' : (ext === 'jpg' ? 'image/jpeg' : `image/${ext}`);
      const { error } = await sb.storage.from('worksheets').upload(storagePath, buf, { contentType, upsert: true });
      if (error) throw error;
      const { data: urlData } = sb.storage.from('worksheets').getPublicUrl(storagePath);
      return res.status(200).json({ url: urlData.publicUrl, thumbnailUrl: ['jpg', 'jpeg', 'png'].includes(ext) ? urlData.publicUrl : null });
    }

    if (resource === 'games') {
      if (!idOrWord) {
        if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
        const { title, url, category, thumbnail_url, description, target_audience } = body;
        if (!title || !url) return res.status(400).json({ error: 'title ve url gerekli' });
        const { data, error } = await sb.from('games').insert({ title, url, category: category || 'Quiz', thumbnail_url: thumbnail_url || null, description: description || '', target_audience: target_audience || '2' }).select('id').single();
        if (error) throw error;
        return res.status(200).json(data);
      }
      if (req.method !== 'PATCH' && req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });
      if (req.method === 'DELETE') {
        const { error } = await sb.from('games').delete().eq('id', idOrWord);
        if (error) throw error;
        return res.status(200).json({ ok: true });
      }
      const { title, url, category, thumbnail_url, description, target_audience } = body;
      const row = {};
      if (title != null) row.title = title;
      if (url != null) row.url = url;
      if (category != null) row.category = category;
      if (thumbnail_url != null) row.thumbnail_url = thumbnail_url;
      if (description != null) row.description = description;
      if (target_audience != null) row.target_audience = target_audience;
      const { error } = await sb.from('games').update(row).eq('id', idOrWord);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    if (resource === 'videos') {
      if (!idOrWord) {
        if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
        const { youtube_id, title, description, thumbnail, duration, category, grade, isPopular } = body;
        if (!youtube_id || !title) return res.status(400).json({ error: 'youtube_id ve title gerekli' });
        const row = { youtube_id, title, description: description || '', thumbnail: thumbnail || '', duration: duration || '0:00', category: category || 'lesson' };
        if (grade != null) row.grade = grade;
        if (isPopular != null) row.is_popular = !!isPopular;
        const { data, error } = await sb.from('videos').insert(row).select().single();
        if (error) throw error;
        return res.status(200).json(data);
      }
      if (req.method !== 'PATCH' && req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });
      if (req.method === 'DELETE') {
        const { error } = await sb.from('videos').delete().eq('id', idOrWord);
        if (error) throw error;
        return res.status(200).json({ ok: true });
      }
      const { youtube_id, title, description, thumbnail, duration, category, grade, isPopular } = body;
      const row = {};
      if (youtube_id != null) row.youtube_id = youtube_id;
      if (title != null) row.title = title;
      if (description != null) row.description = description;
      if (thumbnail != null) row.thumbnail = thumbnail;
      if (duration != null) row.duration = duration;
      if (category != null) row.category = category;
      if (grade != null) row.grade = grade;
      if (isPopular != null) row.is_popular = !!isPopular;
      const { error } = await sb.from('videos').update(row).eq('id', idOrWord);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    if (resource === 'words') {
      if (!idOrWord) {
        if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
        const { word, turkish, level, category, emoji, example } = body;
        if (!word || !turkish) return res.status(400).json({ error: 'word ve turkish gerekli' });
        const { data, error } = await sb.from('words').insert({ word: String(word).trim(), turkish: String(turkish), level: level || 'beginner', category: category || 'Animals', emoji: emoji || '📚', example: example || null }).select().single();
        if (error) throw error;
        return res.status(200).json(data);
      }
      if (req.method !== 'PATCH' && req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });
      if (req.method === 'DELETE') {
        const { error } = await sb.from('words').delete().eq('word', idOrWord);
        if (error) throw error;
        return res.status(200).json({ ok: true });
      }
      const { turkish, level, category, emoji, example } = body;
      const row = {};
      if (turkish != null) row.turkish = turkish;
      if (level != null) row.level = level;
      if (category != null) row.category = category;
      if (emoji != null) row.emoji = emoji;
      if (example !== undefined) row.example = example ?? null;
      if (Object.keys(row).length > 0) {
        const { error } = await sb.from('words').update(row).eq('word', idOrWord);
        if (error) throw error;
      }
      return res.status(200).json({ ok: true });
    }

    if (resource === 'worksheets') {
      if (!idOrWord) {
        if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
        const { title, description, category, grade, thumbnailUrl, externalUrl, source } = body;
        if (!title || !externalUrl) return res.status(400).json({ error: 'title ve externalUrl gerekli' });
        const ext = (externalUrl.split('?')[0].split('.').pop() || 'html').toLowerCase();
        const fileType = ['pdf', 'jpg', 'jpeg', 'png'].includes(ext) ? ext : 'html';
        const fileName = (title || 'worksheet').replace(/\s+/g, '-').toLowerCase() + '.' + fileType;
        const row = { title: String(title), description: description || '', file_url: String(externalUrl), file_name: fileName, file_type: fileType, subject: category || 'Vocabulary', grade: String(grade || '2'), thumbnail_url: thumbnailUrl || null, source: source || 'MinesMinis' };
        const { data, error } = await sb.from('worksheets').insert(row).select().single();
        if (error) throw error;
        return res.status(200).json(data);
      }
      if (req.method !== 'PATCH' && req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });
      if (req.method === 'DELETE') {
        const { error } = await sb.from('worksheets').delete().eq('id', idOrWord);
        if (error) throw error;
        return res.status(200).json({ ok: true });
      }
      const { title, description, category, grade, thumbnailUrl, externalUrl, source } = body;
      const row = {};
      if (title != null) row.title = title;
      if (description != null) row.description = description;
      if (category != null) row.subject = category;
      if (grade != null) row.grade = grade;
      if (thumbnailUrl != null) row.thumbnail_url = thumbnailUrl;
      if (externalUrl != null) row.file_url = externalUrl;
      if (source != null) row.source = source;
      if (Object.keys(row).length > 0) {
        const { error } = await sb.from('worksheets').update(row).eq('id', idOrWord);
        if (error) throw error;
      }
      return res.status(200).json({ ok: true });
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (e) {
    console.error('Admin route error:', e);
    return res.status(500).json({ error: e.message || 'Server error' });
  }
}
