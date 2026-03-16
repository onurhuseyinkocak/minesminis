#!/usr/bin/env node
/**
 * Ensure .env exists (copy from main repo or .env.example).
 * Run in worktree when .env is missing: node scripts/ensure-env.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const envPath = path.join(root, '.env');
const examplePath = path.join(root, '.env.example');

if (fs.existsSync(envPath)) {
  console.log('.env already exists');
  process.exit(0);
}

// Mac: Masaüstü → Projeler → minesminis
const home = process.env.HOME || process.env.USERPROFILE || '';
const macDesktopProject = path.join(home, 'Desktop', 'projeler', 'minesminis', '.env');

const candidates = [
  macDesktopProject,
  path.resolve(root, '..', '..', 'minesminis', '.env'),
  path.resolve(root, '..', '.env'),
];
for (const p of candidates) {
  if (p && fs.existsSync(p)) {
    fs.copyFileSync(p, envPath);
    console.log('Copied .env from:', p);
    process.exit(0);
  }
}

if (fs.existsSync(examplePath)) {
  fs.copyFileSync(examplePath, envPath);
  console.log('Created .env from .env.example (fill in your values)');
  process.exit(0);
}

console.error('.env not found. Copy from main repo or create from .env.example');
process.exit(1);
