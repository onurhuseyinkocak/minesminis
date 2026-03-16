#!/usr/bin/env node
/**
 * Seed words table: 400 words with Pexels images (Turkish search) + TTS audio.
 *
 * HOW TO GET 400 WORDS:
 * 1. Build list: npm run words:build  (reads seed_content.sql, populate_all_content.sql,
 *    scripts/seed_content_phase2.sql, scripts/extra-words.json → writes scripts/words-400.json)
 * 2. Add more to scripts/extra-words.json if needed (format: word, turkish, category, example, grade).
 * 3. Run seed: npm run words:seed
 *
 * Or insert in Supabase SQL Editor: supabase_words.sql, then seed_content.sql, then populate_all_content.sql.
 *
 * Requires: .env with VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY; OPENAI_API_KEY or backend /api/tts; optional PEXELS_API_KEY.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const envPath = path.join(root, '.env');

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (m && !process.env[m[1]]) {
      const val = m[2].replace(/^["']|["']$/g, '').trim();
      process.env[m[1]] = val;
    }
  }
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BACKEND_URL = process.env.VITE_BACKEND_URL || 'http://localhost:3001';

const publicDir = path.join(root, 'public');
const audioWordsDir = path.join(publicDir, 'audio', 'words');
if (!fs.existsSync(audioWordsDir)) {
  fs.mkdirSync(audioWordsDir, { recursive: true });
}

let supabase;
if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
}

function gradeToLevel(grade) {
  if (grade <= 2) return 'beginner';
  if (grade === 3) return 'intermediate';
  return 'advanced';
}

function slug(word, index) {
  const safe = String(word).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `${index}-${safe}`;
}

async function fetchPexelsImage(turkishTerm) {
  if (!PEXELS_API_KEY) return null;
  try {
    const q = encodeURIComponent(turkishTerm);
    const res = await fetch(`https://api.pexels.com/v1/search?query=${q}&per_page=1&locale=tr-TR`, {
      headers: { Authorization: PEXELS_API_KEY },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const photo = data.photos?.[0];
    if (!photo) return null;
    return photo.src?.large2x || photo.src?.original || photo.src?.large || null;
  } catch (e) {
    return null;
  }
}

// American English accent: OpenAI "nova" is US English. One-time generate, then play from DB.
async function generateTTS(text) {
  if (OPENAI_API_KEY) {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: 'nova', // US English (American accent)
        response_format: 'mp3',
        speed: 0.95,
      }),
    });
    if (response.ok) {
      const buf = await response.arrayBuffer();
      return Buffer.from(buf);
    }
  }
  try {
    const res = await fetch(`${BACKEND_URL}/api/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice: 'en-US' }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const b64 = data.audio ?? data.audioContent;
    if (b64) return Buffer.from(b64, 'base64');
  } catch (_) {}
  return null;
}

async function loadWords() {
  const jsonPath = path.join(__dirname, 'words-400.json');
  if (fs.existsSync(jsonPath)) {
    const raw = fs.readFileSync(jsonPath, 'utf8');
    return JSON.parse(raw);
  }
  const dataPath = path.join(__dirname, 'words-400-data.js');
  if (fs.existsSync(dataPath)) {
    const mod = await import(dataPath);
    return mod.WORDS_400 || mod.default || [];
  }
  return [];
}

const FORCE_TTS = process.argv.includes('--force-tts');

async function main() {
  const words = await loadWords();
  if (!words.length) {
    console.error('No words found. Create scripts/words-400.json or scripts/words-400-data.js with WORDS_400.');
    process.exit(1);
  }
  if (!OPENAI_API_KEY && !BACKEND_URL) {
    console.error('Set OPENAI_API_KEY or run backend for TTS.');
    process.exit(1);
  }
  if (!supabase) {
    console.error('Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
    process.exit(1);
  }

  console.log(`Seeding ${words.length} words (American TTS: word + example → DB). Use --force-tts to regenerate audio.\n`);

  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const word = w.word;
    const grade = w.grade ?? 1;
    const category = w.category || 'General';
    const turkish = w.turkish || '';
    const example = w.example || '';
    const s = slug(word, i);
    const level = gradeToLevel(grade);

    let imageUrl = null;
    if (PEXELS_API_KEY && turkish) {
      imageUrl = await fetchPexelsImage(turkish);
      await new Promise((r) => setTimeout(r, 350));
    }

    const wordMp3 = path.join(audioWordsDir, `${s}-word.mp3`);
    const exMp3 = path.join(audioWordsDir, `${s}-ex.mp3`);
    let wordAudioUrl = null;
    let exampleAudioUrl = null;

    const needWordTTS = FORCE_TTS || !fs.existsSync(wordMp3);
    if (needWordTTS) {
      const buf = await generateTTS(word);
      if (buf) {
        fs.writeFileSync(wordMp3, buf);
        wordAudioUrl = `/audio/words/${s}-word.mp3`;
      }
      await new Promise((r) => setTimeout(r, 450));
    } else {
      wordAudioUrl = `/audio/words/${s}-word.mp3`;
    }

    if (example) {
      const needExTTS = FORCE_TTS || !fs.existsSync(exMp3);
      if (needExTTS) {
        const buf = await generateTTS(example);
        if (buf) {
          fs.writeFileSync(exMp3, buf);
          exampleAudioUrl = `/audio/words/${s}-ex.mp3`;
        }
        await new Promise((r) => setTimeout(r, 450));
      } else {
        exampleAudioUrl = `/audio/words/${s}-ex.mp3`;
      }
    }

    const row = {
      word,
      level,
      category,
      emoji: null,
      turkish,
      example: example || null,
      grade,
      image_url: imageUrl,
      word_audio_url: wordAudioUrl,
      example_audio_url: exampleAudioUrl,
    };

    const { error } = await supabase.from('words').upsert(row, { onConflict: 'word' });
    if (error) {
      console.error(`  ${word}:`, error.message);
    } else {
      console.log(`  [${i + 1}/${words.length}] ${word} (grade ${grade})`);
    }
  }

  console.log('\nDone.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
