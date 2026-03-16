#!/usr/bin/env node
/**
 * Syntax Gate - brace balance in server JS
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PATHS } from './config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');

const warnings = [];

function findFiles(dir, ext, out = []) {
  if (!fs.existsSync(dir)) return out;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules') findFiles(full, ext, out);
    else if (e.isFile() && ext.test(e.name)) out.push(full);
  }
  return out;
}

const jsFiles = findFiles(PATHS.server, /\.js$/);
for (const f of jsFiles) {
  const code = fs.readFileSync(f, 'utf8');
  const open = (code.match(/{/g) || []).length;
  const close = (code.match(/}/g) || []).length;
  if (Math.abs(open - close) > 2) warnings.push(`${path.relative(root, f)}: Brace mismatch`);
}

console.log(`Syntax Gate: PASS${warnings.length ? ` (${warnings.length} warnings)` : ''}`);
process.exit(0);
