#!/usr/bin/env node
/**
 * Payment Quality Gate - webhook signature, amount unit
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PATHS } from './config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');

const errors = [];
const warnings = [];

const serverDir = PATHS.server;
const webhookHandler = fs.existsSync(path.join(serverDir, 'webhookHandlers.js')) ? fs.readFileSync(path.join(serverDir, 'webhookHandlers.js'), 'utf8') : '';
const serverJs = fs.readFileSync(path.join(serverDir, 'server.js'), 'utf8');
const allPayment = webhookHandler + serverJs;
if (allPayment.includes('webhook') && allPayment.includes('stripe') && !allPayment.includes('constructEvent') && !serverJs.includes('webhookSecret')) {
  warnings.push('Payment: Stripe webhook should verify signature (constructEvent)');
}

const premiumPage = fs.existsSync(path.join(PATHS.src, 'pages/Premium.tsx')) ? fs.readFileSync(path.join(PATHS.src, 'pages/Premium.tsx'), 'utf8') : '';
if (premiumPage.includes('pk_live') || premiumPage.includes('pk_test')) errors.push('Frontend: Do not hardcode Stripe key');

console.log(errors.length ? `Payment Gate: FAIL` : `Payment Gate: PASS (${warnings.length} warnings)`);
if (warnings.length) warnings.forEach((w) => console.warn('  ' + w));
process.exit(errors.length ? 1 : 0);
