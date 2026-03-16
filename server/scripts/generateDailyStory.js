#!/usr/bin/env node
/**
 * Daily Story Generator - Her gün 12:00'de cron ile çalışır
 * OpenAI ile yeni hikaye üretir, JSON olarak kaydeder.
 * 
 * Kullanım: node server/scripts/generateDailyStory.js
 * Cron: 0 12 * * * cd /path/to/minesminis && node server/scripts/generateDailyStory.js
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootEnv = path.join(__dirname, '../../.env');
const serverEnv = path.join(__dirname, '../.env');
if (fs.existsSync(rootEnv)) dotenv.config({ path: rootEnv });
else if (fs.existsSync(serverEnv)) dotenv.config({ path: serverEnv });
else dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const DATA_DIR = path.join(__dirname, '../data');
const STORY_FILE = path.join(DATA_DIR, 'dailyStory.json');

const GLINTS = ['mimi_dragon', 'ruby_fox', 'indigo_bunny', 'moss_panda', 'volt_monster', 'luna_cat', 'atlas_robot'];
const BACKGROUNDS = ['valley-morning', 'valley-meadow', 'forest-path', 'river-side', 'mountain-view', 'sunset-valley'];
const MUSIC = ['cheerfulMorning', 'funPlayful', 'magicForest', 'calmEnding', 'softAdventure'];
const SFX = ['birdsMorning', 'forestAmbient', 'footstepsGrass', 'splashWater', 'magicSparkle', 'giggle', 'sneeze', 'slideWhistle', 'boing', 'pageTurn'];

const SYSTEM_PROMPT = `You are a children's story writer. Write EXTREMELY simple English stories for kids aged 5-8.
Rules:
- Use ONLY our characters: Mimi (dragon), Ruby (fox), Indigo (bunny), Moss (panda), Volt (monster), Luna (cat), Atlas (robot)
- NO character voices - the NARRATOR reads EVERYTHING including dialogue
- Include COMEDY: silly situations, banana peel slips, funny sneezes, etc.
- Proper plot: setup, rising action, climax (funny!), resolution
- Maximum 6 scenes
- Each scene: 2-4 short sentences. Very simple words.
- Child-friendly, NO violence
- Imaginary world: Echo Valley
- Output ONLY valid JSON, no markdown`;

const USER_PROMPT = `Generate a new daily story for today. Return a JSON object with this exact structure:
{
  "id": "unique-id-kebab",
  "title": "Story Title",
  "dayIndex": 0,
  "scenes": [
    {
      "id": "s1",
      "characters": [{"id": "mimi_dragon", "position": "center", "state": "waving"}],
      "background": "valley-morning",
      "text": "Full scene text for display.",
      "textSegments": ["Segment 1.", "Segment 2."],
      "music": "cheerfulMorning",
      "sfx": ["birdsMorning"],
      "sfxTimed": [{"sfx": "giggle", "delayMs": 3000}]
    }
  ]
}

Valid backgrounds: valley-morning, valley-meadow, forest-path, river-side, mountain-view, sunset-valley
Valid music: cheerfulMorning, funPlayful, magicForest, calmEnding, softAdventure
Valid sfx: birdsMorning, forestAmbient, footstepsGrass, splashWater, magicSparkle, giggle, sneeze, slideWhistle, boing, pageTurn
Valid character positions: left, center, right
Valid character states: idle, waving, celebrating, laughing
Character ids: mimi_dragon, ruby_fox, indigo_bunny, moss_panda, volt_monster, luna_cat, atlas_robot
textSegments: split text for narrator pauses. Each segment = one TTS chunk. Use natural punctuation for realistic speech: ellipsis (...) for dramatic pauses, exclamation for emphasis. Short segments (1-2 sentences) for natural rhythm.`;

async function generateStory() {
  if (!OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY not found');
    process.exit(1);
  }

  const today = new Date().toISOString().slice(0, 10);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: USER_PROMPT },
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || response.statusText);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim() || '';
    let jsonStr = content;
    if (jsonStr.startsWith('```json')) jsonStr = jsonStr.slice(7);
    if (jsonStr.startsWith('```')) jsonStr = jsonStr.slice(3);
    if (jsonStr.endsWith('```')) jsonStr = jsonStr.slice(0, -3);
    jsonStr = jsonStr.trim();

    const story = JSON.parse(jsonStr);
    story.generatedAt = today;

    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    const toSave = { date: today, story };
    fs.writeFileSync(STORY_FILE, JSON.stringify(toSave, null, 2));
    console.log(`✅ Story generated and saved: ${story.title} (${today})`);
  } catch (error) {
    console.error('❌ Failed to generate story:', error.message);
    process.exit(1);
  }
}

generateStory();
