import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const INPUT_DIRS = [
  path.resolve('./src/assets/imageses'),
  path.resolve('./public')
];
const OUTPUT_DIR = path.resolve('./public/optimized');
const RESIZES = [1920, 1280, 640]; // widths to generate
const MIN_SIZE_TO_OPTIMIZE = 50 * 1024; // only optimize files > 50KB

async function ensureOut() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
}

async function walk(dir) {
  let entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const res = path.resolve(dir, e.name);
    if (e.isDirectory()) {
      files.push(...await walk(res));
    } else {
      files.push(res);
    }
  }
  return files;
}

function isRaster(file) {
  const ext = path.extname(file).toLowerCase();
  return ['.png', '.jpg', '.jpeg', '.webp', '.tif', '.tiff'].includes(ext);
}

async function optimizeFile(file) {
  try {
    const stat = await fs.stat(file);
    if (stat.size < MIN_SIZE_TO_OPTIMIZE) return null;
    if (!isRaster(file)) return null;

    const basename = path.basename(file, path.extname(file));
  // derive project root from this script location (works in ESM)
  const __dirname = path.dirname(new URL(import.meta.url).pathname.replace(/^\/?([A-Z]:)?\//, ''));
  const projectRoot = path.resolve(__dirname, '..');
  const relDir = path.relative(projectRoot, path.dirname(file));
  // replace any unsafe chars; then normalize Windows backslashes to forward slashes
  const safeDir = relDir.replace(/[^a-zA-Z0-9_\-]/g, '_').replace(/\\/g, '/');
    const outDir = path.join(OUTPUT_DIR, safeDir);
    await fs.mkdir(outDir, { recursive: true });

    const image = sharp(file);
    const meta = await image.metadata();

    const results = [];

    for (const w of RESIZES) {
      if (meta.width && meta.width < w) continue; // don't upscale
      const outBase = path.join(outDir, `${basename}-${w}`);
      // webp
      await image
        .resize(w)
        .webp({ quality: 80, effort: 6 })
        .toFile(`${outBase}.webp`);
      // avif
      await image
        .resize(w)
        .avif({ quality: 50 })
        .toFile(`${outBase}.avif`);
      results.push(`${outBase}.webp`, `${outBase}.avif`);
    }

    // also create a default compressed copy at original size
    const outBaseOrig = path.join(outDir, `${basename}`);
    await image
      .jpeg({ quality: 80 })
      .toFile(`${outBaseOrig}.jpg`)
      .catch(async () => {
        // fall back to webp if jpeg fails (e.g., source png with alpha)
        await image.webp({ quality: 80 }).toFile(`${outBaseOrig}.webp`);
      });
    results.push(`${outBaseOrig}.jpg`);

    return { file, optimized: results };
  } catch (err) {
    console.error('optimizeFile error', file, err.message);
    return null;
  }
}

(async function main() {
  await ensureOut();
  const files = new Set();
  for (const d of INPUT_DIRS) {
    try {
      const list = await walk(d);
      for (const f of list) files.add(f);
    } catch (e) {
      // ignore missing dirs
    }
  }

  const fileArr = [...files];
  console.log(`Found ${fileArr.length} files to consider`);

  const done = [];
  for (const f of fileArr) {
    const res = await optimizeFile(f);
    if (res) done.push(res);
  }

  console.log(`Optimized ${done.length} files. Output in ${OUTPUT_DIR}`);
  for (const d of done) {
    console.log(d.file);
    for (const o of d.optimized) console.log('  ->', o);
  }
})();
