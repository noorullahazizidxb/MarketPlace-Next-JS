#!/usr/bin/env node
// Simple dev wrapper: load .env before starting Next
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const envFile = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envFile)) {
  const lines = fs.readFileSync(envFile, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^\s*([^#=\s]+)=(.*)$/);
    if (m) {
      const k = m[1];
      let v = m[2];
      if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
      process.env[k] = v;
    }
  }
}

// If PORT is set, pass it as env for next dev
const args = ['dev'];
const nextBin = path.resolve(process.cwd(), 'node_modules', '.bin', process.platform === 'win32' ? 'next.cmd' : 'next');
let child;
if (process.platform === 'win32') {
  child = spawn('cmd', ['/c', nextBin, ...args], { stdio: 'inherit', env: process.env });
} else {
  child = spawn(nextBin, args, { stdio: 'inherit', env: process.env });
}
child.on('exit', (code) => process.exit(code));
