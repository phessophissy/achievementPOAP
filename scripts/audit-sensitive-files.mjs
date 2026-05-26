#!/usr/bin/env node

import { execFileSync } from 'node:child_process';

const patterns = [
  { label: 'environment file', test: (file) => /(^|\/)\.env(\..+)?$/.test(file) && !file.endsWith('.env.example') },
  { label: 'wallet export', test: (file) => /(^|\/)wallets(?:-[^/]+)?\.json$/.test(file) },
  { label: 'wallet principals snapshot', test: (file) => file.endsWith('tools/wallet-principals.json') },
  { label: 'seed dump', test: (file) => /seed|mnemonic|private-key/i.test(file) },
  { label: 'python cache', test: (file) => file.includes('__pycache__/') },
];

function trackedFiles() {
  return execFileSync('git', ['ls-files'], { encoding: 'utf8' })
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

const violations = trackedFiles().flatMap((file) =>
  patterns.filter((pattern) => pattern.test(file)).map((pattern) => ({ file, label: pattern.label })),
);

if (violations.length) {
  console.error('Sensitive file audit failed.');
  for (const violation of violations) {
    console.error(`- ${violation.file} (${violation.label})`);
  }
  process.exit(1);
}

console.log('Sensitive file audit passed.');
