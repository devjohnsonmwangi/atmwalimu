#!/usr/bin/env node
/**
 * Upload images from src/assets/imageses (or a configured list) to Cloudinary using an unsigned upload preset.
 * Outputs a mapping JSON to public/cdn-mapping.json with structure:
 * { "basename.png": { public_id: "folder/filename", cloud_name: "..." } }
 *
 * Usage:
 *   CLOUDINARY_CLOUD_NAME=your_cloud_name UPLOAD_PRESET=your_preset node ./scripts/cloudinary-upload.mjs
 *
 * NOTE: This script uses unsigned uploads (no API secret). Create an unsigned upload preset in your Cloudinary console.
 */

import fs from 'fs/promises';
import path from 'path';

// Prefer env vars, but fall back to the project's src/utils/cloudinary.ts constants if present.
let CLOUD_NAME = globalThis.process?.env?.CLOUDINARY_CLOUD_NAME;
let UPLOAD_PRESET = globalThis.process?.env?.UPLOAD_PRESET;

if (!CLOUD_NAME || !UPLOAD_PRESET) {
  try {
    // dynamic import the TypeScript module (Vite/tsconfig setup allows ts imports) — Node ESM can import .ts here in this workspace tooling context
    const cloud = await import('../src/utils/cloudinary.ts');
    CLOUD_NAME = CLOUD_NAME || cloud.CLOUDINARY_CLOUD_NAME;
    UPLOAD_PRESET = UPLOAD_PRESET || cloud.CLOUDINARY_UPLOAD_PRESET;
    console.log('Falling back to src/utils/cloudinary.ts values');
  } catch (err) {
    // ignore — we'll validate below
  }
}

if (!CLOUD_NAME || !UPLOAD_PRESET) {
  console.error('Missing CLOUDINARY_CLOUD_NAME or UPLOAD_PRESET environment variables and no src/utils/cloudinary.ts fallback found.');
  console.error('Set them and re-run: CLOUDINARY_CLOUD_NAME=... UPLOAD_PRESET=... node scripts/cloudinary-upload.mjs');
  globalThis.process?.exit(1);
}

const INPUT_DIR = path.resolve('./src/assets/imageses');
const OUT_FILE = path.resolve('./public/cdn-mapping.json');

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const res = path.resolve(dir, e.name);
    if (e.isDirectory()) files.push(...await walk(res));
    else files.push(res);
  }
  return files;
}

async function uploadFile(filePath) {
  const form = new FormData();
  const data = await fs.readFile(filePath);
  const filename = path.basename(filePath);
  form.append('file', new Blob([data]), filename);
  form.append('upload_preset', UPLOAD_PRESET);

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const res = await fetch(url, { method: 'POST', body: form });
  if (!res.ok) throw new Error(`Upload failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function main() {
  console.log('Scanning', INPUT_DIR);
  let files = [];
  try { files = await walk(INPUT_DIR); } catch (e) { console.error('Input dir missing', e.message); globalThis.process?.exit(1); }

  const mapping = {};
  for (const f of files) {
    const ext = path.extname(f).toLowerCase();
    if (!['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) continue;
    console.log('Uploading', f);
    try {
      const r = await uploadFile(f);
      // r.public_id is returned; store mapping keyed by basename
  mapping[path.basename(f)] = { public_id: r.public_id, cloud_name: CLOUD_NAME, secure_url: r.secure_url };
  console.log(' ->', r.secure_url);
    } catch (err) {
      console.error('Upload error for', f, err.message || err);
    }
  }

  await fs.mkdir(path.dirname(OUT_FILE), { recursive: true });
  await fs.writeFile(OUT_FILE, JSON.stringify(mapping, null, 2), 'utf8');
  console.log('Wrote mapping to', OUT_FILE);
}

main().catch(err => { console.error(err); globalThis.process?.exit(1); });
