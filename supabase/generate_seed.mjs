/**
 * Generate seed_exercises.sql from all TypeScript data files.
 * Run with: node supabase/generate_seed.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const BASE = join(import.meta.dirname, '..', 'src', 'data');

// Helper: escape single quotes for SQL
function esc(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/'/g, "''");
}

// Helper: convert JS object to a safe JSON string for SQL
function jsonSql(obj) {
  return esc(JSON.stringify(obj));
}

// Helper: build an SQL array literal from a JS string array
function sqlArray(arr) {
  if (!arr || arr.length === 0) return "'{}'";
  return "'{" + arr.map(s => `"${esc(s)}"`).join(',') + "}'";
}

// Strip TS types / imports from file and eval as JS
function loadTsData(filename) {
  let code = readFileSync(join(BASE, filename), 'utf-8');
  // Remove import lines
  code = code.replace(/^import\s+.*$/gm, '');
  // Remove export interface blocks
  code = code.replace(/export\s+interface\s+\w+\s*\{[^}]*\}/gs, '');
  // Remove type annotations from const declarations
  code = code.replace(/:\s*\w+(\[\])?\s*=/g, ' =');
  // Remove 'as const'
  code = code.replace(/\s+as\s+const/g, '');
  // Remove type casts like `as BlendingWord['type']`
  code = code.replace(/as\s+\w+(\[['"][^'"]+['"]\])?/g, '');
  return code;
}

const inserts = [];
let sortOrder = 0;

function addInsert({ id, type, difficulty, title, titleTr, content, targetSounds, targetWords, phonicsGroup }) {
  sortOrder++;
  const tsArr = targetSounds && targetSounds.length > 0 ? sqlArray(targetSounds) : "'{}'";
  const twArr = targetWords && targetWords.length > 0 ? sqlArray(targetWords) : "'{}'";
  const pgVal = phonicsGroup != null ? phonicsGroup : 'NULL';
  const titleVal = title ? `'${esc(title)}'` : 'NULL';
  const titleTrVal = titleTr ? `'${esc(titleTr)}'` : 'NULL';

  inserts.push(
    `INSERT INTO exercises (id, type, difficulty, title, title_tr, content, target_sounds, target_words, phonics_group, sort_order)
VALUES ('${esc(id)}', '${esc(type)}', ${difficulty || 1}, ${titleVal}, ${titleTrVal}, '${jsonSql(content)}'::jsonb, ${tsArr}, ${twArr}, ${pgVal}, ${sortOrder})
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  difficulty = EXCLUDED.difficulty,
  title = EXCLUDED.title,
  title_tr = EXCLUDED.title_tr,
  content = EXCLUDED.content,
  target_sounds = EXCLUDED.target_sounds,
  target_words = EXCLUDED.target_words,
  phonics_group = EXCLUDED.phonics_group,
  sort_order = EXCLUDED.sort_order;`
  );
}

// ── 1. Rhyme Exercises ──────────────────────────────────────────────────────

console.log('Processing rhymeExercises...');
const rhymeCode = readFileSync(join(BASE, 'rhymeExercises.ts'), 'utf-8');
// Extract array contents between the brackets
const rhymeMatches = [...rhymeCode.matchAll(/\{\s*\n\s*id:\s*'([^']+)',\s*\n\s*type:\s*'([^']+)',/g)];

// Parse the full objects manually — use a different approach: eval after cleanup
let rhymeClean = rhymeCode;
rhymeClean = rhymeClean.replace(/^import\s+.*$/gm, '');
rhymeClean = rhymeClean.replace(/export\s+const\s+RHYME_EXERCISES:\s*\w+\[\]\s*=/, 'var RHYME_EXERCISES =');
rhymeClean += '\n;RHYME_EXERCISES;';
const rhymeExercises = eval(rhymeClean);

for (const ex of rhymeExercises) {
  addInsert({
    id: `rhyme_${ex.id}`,
    type: 'rhyme',
    difficulty: ex.difficulty || 1,
    title: ex.targetWord || ex.targetWord2 || null,
    titleTr: null,
    content: ex,
    targetSounds: [],
    targetWords: ex.words || (ex.targetWord ? [ex.targetWord] : (ex.targetWord2 ? [ex.targetWord2] : [])),
    phonicsGroup: null,
  });
}
console.log(`  → ${rhymeExercises.length} rhyme exercises`);

// ── 2. Phoneme Manipulation Exercises ───────────────────────────────────────

console.log('Processing phonemeManipulationExercises...');
let pmCode = readFileSync(join(BASE, 'phonemeManipulationExercises.ts'), 'utf-8');
pmCode = pmCode.replace(/^import\s+.*$/gm, '');
pmCode = pmCode.replace(/:\s*PhonemeManipulationQuestion\[\]/g, '');
pmCode = pmCode.replace(/export\s+const\s+phonemeManipulationExercises\s*=/, 'var phonemeManipulationExercises =');
pmCode = pmCode.replace(/export\s+\{[^}]*\};?/g, '');
pmCode += '\n;phonemeManipulationExercises;';
const pmExercises = eval(pmCode);

for (const ex of pmExercises) {
  addInsert({
    id: `phoneme_${ex.id}`,
    type: 'phoneme_manipulation',
    difficulty: ex.difficulty || 1,
    title: ex.prompt,
    titleTr: ex.promptTr,
    content: ex,
    targetSounds: ex.targetWordPhonemes || [],
    targetWords: [ex.targetWord],
    phonicsGroup: null,
  });
}
console.log(`  → ${pmExercises.length} phoneme manipulation exercises`);

// ── 3. Syllable Exercises ───────────────────────────────────────────────────

console.log('Processing syllableExercises...');
let sylCode = readFileSync(join(BASE, 'syllableExercises.ts'), 'utf-8');
sylCode = sylCode.replace(/export\s+interface\s+SyllableQuestion\s*\{[^}]*\}/s, '');
sylCode = sylCode.replace(/export\s+const\s+SYLLABLE_EXERCISES:\s*SyllableQuestion\[\]\s*=/, 'var SYLLABLE_EXERCISES =');
sylCode += '\n;SYLLABLE_EXERCISES;';
const sylExercises = eval(sylCode);

for (const ex of sylExercises) {
  addInsert({
    id: `syllable_${ex.id}`,
    type: 'syllable',
    difficulty: ex.syllableCount,
    title: ex.word,
    titleTr: ex.wordTr,
    content: ex,
    targetSounds: [],
    targetWords: [ex.word],
    phonicsGroup: null,
  });
}
console.log(`  → ${sylExercises.length} syllable exercises`);

// ── 4. Blending Exercises ───────────────────────────────────────────────────

console.log('Processing blendingExercises...');
let blCode = readFileSync(join(BASE, 'blendingExercises.ts'), 'utf-8');
blCode = blCode.replace(/^import\s+.*$/gm, '');
blCode = blCode.replace(/export\s+interface\s+\w+\s*\{[^}]*\}/gs, '');
blCode = blCode.replace(/:\s*BlendingWord\[\]/g, '');
blCode = blCode.replace(/:\s*SightWord\[\]/g, '');
blCode = blCode.replace(/export\s+const/g, 'var');
// Remove type annotations like `: BlendingWord[]` or `: SightWord[]`
blCode = blCode.replace(/:\s*\w+\[\]\s*=/g, ' =');
// Remove type annotations like `: Record<string, BlendingWord[]>`
blCode = blCode.replace(/:\s*Record<[^>]+>/g, '');
// Remove type annotations in function params
blCode = blCode.replace(/:\s*\w+\['\w+'\]/g, '');
// Remove export function blocks one at a time (match balanced braces)
blCode = blCode.replace(/export\s+function\s+\w+[^{]*\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g, '');
blCode += '\n;({BLENDING_WORDS, SIGHT_WORDS});';
const { BLENDING_WORDS, SIGHT_WORDS } = eval(blCode);

// Store each blending word as an exercise
for (let i = 0; i < BLENDING_WORDS.length; i++) {
  const w = BLENDING_WORDS[i];
  addInsert({
    id: `blending_${w.word}_${w.level}_${i}`,
    type: 'blending',
    difficulty: w.level,
    title: w.word,
    titleTr: w.turkish,
    content: w,
    targetSounds: w.phonemes || [],
    targetWords: [w.word],
    phonicsGroup: w.level,
  });
}

// Also store sight words
for (let i = 0; i < SIGHT_WORDS.length; i++) {
  const w = SIGHT_WORDS[i];
  addInsert({
    id: `sight_word_${w.word.replace(/\s+/g, '_')}_${i}`,
    type: 'blending',
    difficulty: w.level,
    title: w.word,
    titleTr: w.turkish,
    content: { ...w, isSightWord: true },
    targetSounds: [],
    targetWords: [w.word],
    phonicsGroup: null,
  });
}
console.log(`  → ${BLENDING_WORDS.length} blending words + ${SIGHT_WORDS.length} sight words`);

// ── 5. Dialogue Exercises ───────────────────────────────────────────────────

console.log('Processing dialogueExercises...');
let dlCode = readFileSync(join(BASE, 'dialogueExercises.ts'), 'utf-8');
dlCode = dlCode.replace(/^import\s+.*$/gm, '');
dlCode = dlCode.replace(/export\s+interface\s+\w+\s*\{[^}]*\}/gs, '');
dlCode = dlCode.replace(/:\s*DialogueExercise\[\]/g, '');
dlCode = dlCode.replace(/export\s+const\s+DIALOGUE_EXERCISES\s*=/, 'var DIALOGUE_EXERCISES =');
dlCode += '\n;DIALOGUE_EXERCISES;';
const dlExercises = eval(dlCode);

for (const ex of dlExercises) {
  addInsert({
    id: `dialogue_${ex.id}`,
    type: 'dialogue',
    difficulty: 1,
    title: ex.title,
    titleTr: ex.titleTr,
    content: ex,
    targetSounds: [],
    targetWords: [],
    phonicsGroup: null,
  });
}
console.log(`  → ${dlExercises.length} dialogue exercises`);

// ── 6. Listening Exercises ──────────────────────────────────────────────────

console.log('Processing listeningExercises...');
let lstCode = readFileSync(join(BASE, 'listeningExercises.ts'), 'utf-8');
lstCode = lstCode.replace(/^import\s+.*$/gm, '');
lstCode = lstCode.replace(/export\s+interface\s+\w+\s*\{[^}]*\}/gs, '');
lstCode = lstCode.replace(/:\s*ListeningExercise\[\]/g, '');
lstCode = lstCode.replace(/export\s+const\s+ALL_LISTENING_EXERCISES\s*=/, 'var ALL_LISTENING_EXERCISES =');
lstCode = lstCode.replace(/export\s+function\s+\w+[\s\S]*$/, '');
lstCode += '\n;ALL_LISTENING_EXERCISES;';
const lstExercises = eval(lstCode);

for (const ex of lstExercises) {
  addInsert({
    id: `listening_${ex.id}`,
    type: 'listening',
    difficulty: ex.level,
    title: ex.sentence.substring(0, 80),
    titleTr: ex.sentenceTr.substring(0, 80),
    content: ex,
    targetSounds: [],
    targetWords: [],
    phonicsGroup: null,
  });
}
console.log(`  → ${lstExercises.length} listening exercises`);

// ── 7. Grammar Lessons ──────────────────────────────────────────────────────

console.log('Processing grammarLessons...');
let grCode = readFileSync(join(BASE, 'grammarLessons.ts'), 'utf-8');
grCode = grCode.replace(/^import\s+.*$/gm, '');
// Remove export interface with nested braces (multi-level)
grCode = grCode.replace(/export\s+interface\s+\w+\s*\{[\s\S]*?^}/gm, '');
grCode = grCode.replace(/:\s*GrammarLesson\[\]/g, '');
grCode = grCode.replace(/export\s+const\s+grammarLessons\s*=/, 'var grammarLessons =');
grCode = grCode.replace(/export\s+function\s+\w+[\s\S]*$/, '');
// Remove Array<{...}> type annotations (may span multiple lines)
grCode = grCode.replace(/:\s*Array<\{[\s\S]*?\}>/g, '');
// Remove simple type annotations
grCode = grCode.replace(/:\s*1\s*\|\s*2\s*\|\s*3/g, '');
grCode += '\n;grammarLessons;';
const grLessons = eval(grCode);

for (const lesson of grLessons) {
  addInsert({
    id: `grammar_${lesson.id}`,
    type: 'grammar',
    difficulty: lesson.level,
    title: lesson.topic,
    titleTr: lesson.topicTr,
    content: lesson,
    targetSounds: [],
    targetWords: [],
    phonicsGroup: null,
  });
}
console.log(`  → ${grLessons.length} grammar lessons`);

// ── 8. Image Label Exercises ────────────────────────────────────────────────

console.log('Processing imageLabelExercises...');
let ilCode = readFileSync(join(BASE, 'imageLabelExercises.ts'), 'utf-8');
ilCode = ilCode.replace(/^import\s+.*$/gm, '');
ilCode = ilCode.replace(/:\s*LabelQuestion\[\]/g, '');
ilCode = ilCode.replace(/export\s+const\s+IMAGE_LABEL_QUESTIONS\s*=/, 'var IMAGE_LABEL_QUESTIONS =');
ilCode += '\n;IMAGE_LABEL_QUESTIONS;';
const ilExercises = eval(ilCode);

for (const ex of ilExercises) {
  addInsert({
    id: `image_label_${ex.id}`,
    type: 'image_label',
    difficulty: 1,
    title: ex.correctLabel,
    titleTr: ex.correctLabelTr,
    content: ex,
    targetSounds: ex.phonetic ? [ex.phonetic] : [],
    targetWords: [ex.correctLabel],
    phonicsGroup: null,
  });
}
console.log(`  → ${ilExercises.length} image label exercises`);

// ── 9. Say It Exercises ─────────────────────────────────────────────────────

console.log('Processing sayItExercises...');
let siCode = readFileSync(join(BASE, 'sayItExercises.ts'), 'utf-8');
siCode = siCode.replace(/^import\s+.*$/gm, '');
siCode = siCode.replace(/:\s*SayItQuestion\[\]/g, '');
siCode = siCode.replace(/export\s+const\s+sayItExercises\s*=/, 'var sayItExercises =');
siCode += '\n;sayItExercises;';
const siExercises = eval(siCode);

for (const ex of siExercises) {
  addInsert({
    id: `say_it_${ex.id}`,
    type: 'say_it',
    difficulty: 1,
    title: ex.word,
    titleTr: ex.wordTr,
    content: ex,
    targetSounds: ex.phonetic ? [ex.phonetic] : [],
    targetWords: [ex.word],
    phonicsGroup: null,
  });
}
console.log(`  → ${siExercises.length} say it exercises`);

// ── 10. Word Family Exercises ───────────────────────────────────────────────

console.log('Processing wordFamilyExercises...');
let wfCode = readFileSync(join(BASE, 'wordFamilyExercises.ts'), 'utf-8');
wfCode = wfCode.replace(/export\s+interface\s+WordFamily\s*\{[^}]*\}/s, '');
wfCode = wfCode.replace(/:\s*WordFamily\[\]/g, '');
wfCode = wfCode.replace(/export\s+const\s+WORD_FAMILIES\s*=/, 'var WORD_FAMILIES =');
wfCode += '\n;WORD_FAMILIES;';
const wfExercises = eval(wfCode);

for (const ex of wfExercises) {
  addInsert({
    id: `word_family_${ex.id}`,
    type: 'word_family',
    difficulty: 1,
    title: ex.rime,
    titleTr: ex.rimeTr,
    content: ex,
    targetSounds: [],
    targetWords: ex.validWords || [],
    phonicsGroup: null,
  });
}
console.log(`  → ${wfExercises.length} word family exercises`);

// ── Write SQL ───────────────────────────────────────────────────────────────

const sql = `-- MinesMinis Exercise Seed Data
-- Generated: ${new Date().toISOString()}
-- Total exercises: ${inserts.length}

BEGIN;

${inserts.join('\n\n')}

COMMIT;
`;

const outPath = join(import.meta.dirname, 'seed_exercises.sql');
writeFileSync(outPath, sql, 'utf-8');
console.log(`\nWrote ${inserts.length} INSERT statements to ${outPath}`);
