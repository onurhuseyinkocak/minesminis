#!/usr/bin/env node
/**
 * UI/UX Quality Gate - renk variable, tema parity, buton, !important, z-index
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PATHS, UI_RULES } from './config.js';

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

function scanCssFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules') scanCssFiles(full, out);
    else if (e.isFile() && /\.css$/i.test(e.name)) out.push(full);
  }
  return out;
}

function checkImportantAbuse(content, filePath) {
  const count = (content.match(/!important/g) || []).length;
  if (count > 100) errors.push(`${path.relative(root, filePath)}: Too many !important (${count})`);
  else if (count > 20) warnings.push(`${path.relative(root, filePath)}: Many !important (${count}) - consider refactor`);
}

function checkZIndex(content, filePath) {
  const z = (content.match(/z-index\s*:\s*(\d+)/g) || []).map((s) => parseInt(s.replace(/\D/g, ''), 10));
  const uniq = [...new Set(z)];
  if (uniq.length > UI_RULES.zIndexChaosThreshold) warnings.push(`${path.relative(root, filePath)}: Many z-index values (${uniq.length})`);
}

/** Extract CSS variable names from :root { ... } by brace matching */
function extractRootVarNames(content) {
  const start = content.indexOf(':root');
  if (start === -1) return new Set();
  const open = content.indexOf('{', start);
  if (open === -1) return new Set();
  let depth = 1;
  let i = open + 1;
  while (depth && i < content.length) {
    if (content[i] === '{') depth++;
    else if (content[i] === '}') depth--;
    i++;
  }
  const block = content.slice(open, i);
  const vars = (block.match(/--([a-zA-Z0-9-]+)/g) || []).map((s) => s);
  return new Set(vars);
}

/** Extract CSS variable names from [data-theme="dark"] { ... } in dark-theme.css */
function extractDarkVarNames(content) {
  const start = content.indexOf('[data-theme="dark"]');
  if (start === -1) return new Set();
  const after = content.slice(start);
  const open = after.indexOf('{');
  let depth = 1;
  let i = open + 1;
  while (depth && i < after.length) {
    if (after[i] === '{') depth++;
    else if (after[i] === '}') depth--;
    i++;
  }
  const block = after.slice(open, i);
  const vars = (block.match(/--([a-zA-Z0-9-]+)/g) || []).map((s) => s);
  return new Set(vars);
}

/** Light/dark theme variable parity - critical vars should exist in both */
function checkThemeVarParity(indexCss, darkCss) {
  if (!UI_RULES.themeVarParity || !indexCss.length || !darkCss.length) return;
  const rootVars = extractRootVarNames(indexCss);
  const darkVars = extractDarkVarNames(darkCss);
  const critical = ['text-dark', 'text-medium', 'bg-soft', 'bg-card', 'primary-orange', 'navbar-text', 'border-focus'];
  const missingInDark = critical.filter((name) => rootVars.has(`--${name}`) && !darkVars.has(`--${name}`));
  if (missingInDark.length) {
    warnings.push(`Theme parity: dark theme missing variables: ${missingInDark.join(', ')} – some pages may show wrong colors in dark mode`);
  }
}

/** Count hardcoded colors (hex, rgb, rgba) outside var() – hints at pages not using theme vars */
function checkHardcodedColors(content, filePath) {
  if (!UI_RULES.requireColorVars) return;
  const rel = path.relative(root, filePath);
  const ignorePattern = /(^[\s\S]*?:root\s*\{[\s\S]*?\}|var\s*\([^)]+\)|url\s*\([^)]+\)|\/\*[\s\S]*?\*\/)/g;
  const withoutRootAndVars = content.replace(ignorePattern, ' ');
  const hex = (withoutRootAndVars.match(/#[0-9a-fA-F]{3}\b|#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{8}\b/g) || []).length;
  const rgb = (withoutRootAndVars.match(/rgba?\s*\([^)]+\)/g) || []).length;
  const total = hex + rgb;
  if (total > 30) {
    warnings.push(`${rel}: ${total} hardcoded colors (${hex} hex, ${rgb} rgb) – consider var(--…) for theme/button/text consistency`);
  }
}

function main() {
  const indexCss = readFile(PATHS.indexCss);
  const darkCss = readFile(PATHS.darkTheme);
  if (!indexCss.length) errors.push('src/index.css not found');
  else {
    checkImportantAbuse(indexCss, PATHS.indexCss);
    checkZIndex(indexCss, PATHS.indexCss);
    checkThemeVarParity(indexCss, darkCss);
  }
  if (darkCss.length) {
    checkImportantAbuse(darkCss, PATHS.darkTheme);
    checkZIndex(darkCss, PATHS.darkTheme);
  }
  const cssFiles = scanCssFiles(PATHS.src);
  for (const f of cssFiles) {
    const content = readFile(f);
    checkImportantAbuse(content, f);
    checkZIndex(content, f);
    checkHardcodedColors(content, f);
  }
  if (errors.length) {
    console.error('UI/UX Gate – ERRORS:');
    errors.forEach((e) => console.error('  ' + e));
  }
  if (warnings.length) {
    console.warn('UI/UX Gate – WARNINGS:');
    warnings.forEach((w) => console.warn('  ' + w));
  }
  const fail = errors.length > 0;
  console.log(fail ? `UI/UX Gate: FAIL (${errors.length} errors)` : `UI/UX Gate: PASS (${warnings.length} warnings)`);
  process.exit(fail ? 1 : 0);
}

main();
