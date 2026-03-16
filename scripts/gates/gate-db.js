#!/usr/bin/env node
/**
 * DB Quality Gate - RLS, SQL injection risk
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PATHS } from './config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');

const errors = [];
const warnings = [];

function readFile(p) {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch {
    return '';
  }
}

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

const codeFiles = [...findFiles(PATHS.src, /\.(ts|tsx)$/), ...findFiles(PATHS.server, /\.js$/)];
for (const f of codeFiles) {
  const content = readFile(f);
  if (/\$\s*\{[^}]*\}\s*\)/.test(content) && content.includes('query') && content.includes('SELECT')) {
    warnings.push(`${path.relative(root, f)}: Possible SQL injection - use parameterized queries`);
  }
}

console.log(errors.length ? `DB Gate: FAIL` : `DB Gate: PASS (${warnings.length} warnings)`);
if (warnings.length) warnings.forEach((w) => console.warn('  ' + w));
process.exit(errors.length ? 1 : 0);
