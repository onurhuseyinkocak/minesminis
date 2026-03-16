#!/usr/bin/env node
/**
 * Security Quality Gate - hardcoded secrets, CORS
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PATHS } from './config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');

const errors = [];
const warnings = [];

const serverJs = fs.readFileSync(path.join(PATHS.server, 'server.js'), 'utf8');
const lines = serverJs.split('\n');
const SECRET_PATTERN = /(?:api[_-]?key|secret|password)\s*[:=]\s*['"][^'"]{8,}['"]/gi;
lines.forEach((line, i) => {
  if (line.trim().startsWith('//') || line.includes('process.env')) return;
  if (SECRET_PATTERN.test(line)) errors.push(`server/server.js:${i + 1}: Possible hardcoded secret`);
});
if (serverJs.includes("origin: '*'") || serverJs.includes('origin: "*"')) errors.push('server: CORS origin * not allowed');

if (errors.length) {
  console.error('Security Gate – ERRORS:');
  errors.forEach((e) => console.error('  ' + e));
}
console.log(errors.length ? `Security Gate: FAIL` : `Security Gate: PASS`);
process.exit(errors.length ? 1 : 0);
