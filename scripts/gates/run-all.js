#!/usr/bin/env node
/**
 * Quality Gate Runner - Tum kalite kapilarini calistirir.
 * Bir gate bile basarisiz olursa exit code 1.
 */
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');

const args = process.argv.slice(2);
const onlyGate = args.find((a) => a.startsWith('--gate='))?.slice(7);
const skipList = args.filter((a) => a.startsWith('--skip=')).flatMap((a) => a.slice(7).split(','));

const GATES = [
  { id: 'lint', cmd: 'npm', cargs: ['run', 'lint'], cwd: root },
  { id: 'typecheck', cmd: 'npx', cargs: ['tsc', '-b', '--noEmit'], cwd: root },
  { id: 'build', cmd: 'npm', cargs: ['run', 'build'], cwd: root },
  { id: 'ui-ux', cmd: 'node', cargs: [path.join(__dirname, 'gate-ui-ux.js')], cwd: root },
  { id: 'db', cmd: 'node', cargs: [path.join(__dirname, 'gate-db.js')], cwd: root },
  { id: 'security', cmd: 'node', cargs: [path.join(__dirname, 'gate-security.js')], cwd: root },
  { id: 'payment', cmd: 'node', cargs: [path.join(__dirname, 'gate-payment.js')], cwd: root },
  { id: 'syntax', cmd: 'node', cargs: [path.join(__dirname, 'gate-syntax.js')], cwd: root },
];

function run(cmd, cargs, cwd) {
  return new Promise((resolve) => {
    const p = spawn(cmd, cargs, { cwd, stdio: 'inherit', shell: true });
    p.on('close', (code) => resolve(code === 0));
  });
}

async function main() {
  const toRun = onlyGate ? GATES.filter((g) => g.id === onlyGate) : GATES.filter((g) => !skipList.includes(g.id));
  if (toRun.length === 0) {
    console.error('No gates to run.');
    process.exit(1);
  }
  console.log('Quality Gates (Million-Dollar Standard)\n');
  let allOk = true;
  for (const g of toRun) {
    process.stdout.write(`[${g.id}] ... `);
    const ok = await run(g.cmd, g.cargs, g.cwd);
    if (!ok) {
      console.error(`\n[${g.id}] FAILED`);
      allOk = false;
    } else {
      console.log(`[${g.id}] OK`);
    }
  }
  console.log(allOk ? '\nAll gates passed.' : '\nSome gates failed.');
  process.exit(allOk ? 0 : 1);
}

main();
