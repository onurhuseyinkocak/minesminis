import { getSupabase, getEnvStatus, getSupabaseUnavailableResponse } from './_lib/admin.js';
import crypto from 'crypto';
import OpenAI from 'openai';

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

    // ── STORIES ──────────────────────────────────────────────────────────────
    if (resource === 'stories') {
      // Generate: POST /api/admin/stories/generate
      if (idOrWord === 'generate') {
        if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

        const { theme, location, characters, target_age } = body;
        if (!theme) return res.status(400).json({ error: 'theme required' });

        const openaiKey = process.env.OPENAI_API_KEY;
        if (!openaiKey) return res.status(503).json({ error: 'OpenAI not configured' });

        const openai = new OpenAI({ apiKey: openaiKey });

        const ageRange = Array.isArray(target_age) ? target_age : [4, 8];
        const characterList = Array.isArray(characters) && characters.length > 0
          ? characters.join(', ')
          : 'mimi_dragon';

        const systemPrompt = `You are a world-class children's English learning story creator.
You combine Montessori pedagogy, phonics instruction, and adventure storytelling.
Your stories feature Mimi and her friends on educational adventures.
Rules:
- English is the target language, Turkish is the translation layer
- Each vocabulary word must highlight a phonics pattern (e.g. "cat" = short-a CVC)
- Stories are interactive: 3-5 scenes, each with 2 choices
- Age-appropriate: ages ${ageRange[0]}-${ageRange[1]}
- Each scene has a camera_angle hint: wide|closeUp|lowAngle|birdEye|sidePan|sidePanLeft|dutch|dramatic
- ALWAYS return valid JSON, no markdown fences`;

        const userPrompt = `Create an educational English story for children aged ${ageRange[0]}-${ageRange[1]}.
Theme: ${theme}
Location: ${location || 'enchanted_forest'}
Characters: ${characterList}

Return ONLY this JSON structure (no markdown):
{
  "title": "Story Title in English",
  "title_tr": "Hikaye Başlığı Türkçe",
  "summary": "2-sentence English summary",
  "summary_tr": "2 cümle Türkçe özet",
  "cover_scene": "forest-clearing",
  "target_age": [${ageRange[0]}, ${ageRange[1]}],
  "moral": "Short moral lesson in English",
  "moral_tr": "Kısa ahlaki ders Türkçe",
  "characters": ["mimi_dragon"],
  "location": "${location || 'enchanted_forest'}",
  "theme": "${theme}",
  "scenes": [
    {
      "scene_order": 1,
      "text": "English narration for this scene (2-3 sentences, vivid and child-friendly)",
      "text_tr": "Türkçe anlatım (2-3 cümle)",
      "location": "forest-clearing",
      "characters": ["mimi_dragon"],
      "mood": "excited",
      "camera_angle": "wide",
      "sound_effect": "birds_chirping",
      "animation_cue": "leaves_fall",
      "vocabulary": [
        {
          "word": "sparkle",
          "word_tr": "parlamak",
          "emoji": "✨",
          "phonics": "ar blend",
          "example": "The stars sparkle at night."
        }
      ],
      "choices": [
        {
          "id": "1a",
          "text": "Follow the glowing path",
          "text_tr": "Işıklı yolu takip et",
          "next_scene_id": "2"
        },
        {
          "id": "1b",
          "text": "Climb the tall oak tree",
          "text_tr": "Uzun meşe ağacına tırman",
          "next_scene_id": "3"
        }
      ]
    }
  ]
}

Generate 4-5 scenes total. Make it magical, educational, and joyful.`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.85,
          max_tokens: 3000,
          response_format: { type: 'json_object' },
        });

        const raw = completion.choices[0].message.content || '{}';
        let story;
        try {
          story = JSON.parse(raw);
        } catch {
          return res.status(500).json({ error: 'AI returned invalid JSON', raw });
        }

        return res.status(200).json({ story });
      }

      // List: GET /api/admin/stories
      if (!idOrWord) {
        if (req.method === 'GET') {
          const { data, error } = await sb
            .from('stories')
            .select('id, title, title_tr, summary, target_age, published, created_at, cover_scene')
            .order('created_at', { ascending: false })
            .limit(100);
          if (error) throw error;
          return res.status(200).json({ stories: data || [] });
        }

        // Publish (save): POST /api/admin/stories
        if (req.method === 'POST') {
          const { title, title_tr, summary, summary_tr, cover_scene, target_age, published,
            characters, location, theme, moral, moral_tr, scenes } = body;
          if (!title || !scenes) return res.status(400).json({ error: 'title and scenes required' });

          const { data: storyRow, error: storyErr } = await sb
            .from('stories')
            .insert({
              title, title_tr: title_tr || '', summary: summary || '', summary_tr: summary_tr || '',
              cover_scene: cover_scene || 'forest-clearing',
              target_age: target_age || [4, 8],
              published: published !== false,
              characters: characters || [],
              location: location || '',
              theme: theme || '',
              moral: moral || '',
              moral_tr: moral_tr || '',
            })
            .select('id')
            .single();
          if (storyErr) throw storyErr;

          const storyId = storyRow.id;

          if (Array.isArray(scenes) && scenes.length > 0) {
            const sceneRows = scenes.map((s, i) => ({
              story_id: storyId,
              scene_order: s.scene_order ?? i + 1,
              text: s.text || '',
              text_tr: s.text_tr || '',
              location: s.location || '',
              characters: s.characters || [],
              mood: s.mood || 'neutral',
              camera_angle: s.camera_angle || 'wide',
              sound_effect: s.sound_effect || null,
              animation_cue: s.animation_cue || null,
              vocabulary: s.vocabulary || [],
              choices: s.choices || [],
            }));
            const { error: scenesErr } = await sb.from('story_scenes').insert(sceneRows);
            if (scenesErr) throw scenesErr;
          }

          return res.status(200).json({ id: storyId, ok: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });
      }

      // Single story ops: PATCH/DELETE /api/admin/stories/:id
      if (req.method === 'PATCH') {
        const { published } = body;
        const row = {};
        if (published !== undefined) row.published = !!published;
        if (Object.keys(row).length === 0) return res.status(400).json({ error: 'Nothing to update' });
        const { error } = await sb.from('stories').update(row).eq('id', idOrWord);
        if (error) throw error;
        return res.status(200).json({ ok: true });
      }

      if (req.method === 'DELETE') {
        await sb.from('story_scenes').delete().eq('story_id', idOrWord);
        const { error } = await sb.from('stories').delete().eq('id', idOrWord);
        if (error) throw error;
        return res.status(200).json({ ok: true });
      }

      return res.status(405).json({ error: 'Method not allowed' });
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (e) {
    console.error('Admin route error:', e);
    return res.status(500).json({ error: e.message || 'Server error' });
  }
}
