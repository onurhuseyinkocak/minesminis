#!/usr/bin/env node
/**
 * Daily Blog Generator - Her gün 12:00'de cron ile çalışır
 * OpenAI ile SEO odaklı blog yazısı üretir, Supabase'e ekler.
 * 
 * Önkoşul: supabase_blog.sql çalıştırılmış olmalı.
 * Kullanım: node server/scripts/generateDailyBlog.js
 * Cron: 0 12 * * * cd /path/to/minesminis && node server/scripts/generateDailyBlog.js
 */

import dotenv from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootEnv = path.join(__dirname, '../../.env');
const serverEnv = path.join(__dirname, '../.env');
if (fs.existsSync(rootEnv)) dotenv.config({ path: rootEnv });
else if (fs.existsSync(serverEnv)) dotenv.config({ path: serverEnv });
else dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const BACKEND_URL = process.env.VITE_BACKEND_URL || 'http://localhost:3001';

async function generateDailyBlog() {
  if (!OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY not found');
    process.exit(1);
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/blog/generate`, { method: 'POST' });
    const json = await res.json();

    if (!json.ok) {
      console.error('❌ Blog generation failed:', json.error);
      process.exit(1);
    }

    const post = json.post;

    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      const { error } = await supabase.from('blog_posts').insert({
        title: post.title,
        slug: post.slug || post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        content: post.content,
        excerpt: post.excerpt || post.content?.slice(0, 200),
        meta_title: post.meta_title || post.title,
        meta_description: post.meta_description || post.excerpt,
        published_at: post.published_at || new Date().toISOString(),
      });
      if (error) {
        console.error('❌ Supabase insert failed:', error.message);
        process.exit(1);
      }
      console.log(`✅ Blog post saved: ${post.title}`);
    } else {
      console.log('⚠️ Supabase credentials not set. Post generated but not saved.');
      console.log('Post:', JSON.stringify(post, null, 2));
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

generateDailyBlog();
