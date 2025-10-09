// import fs from 'fs/promises';
// import path from 'path';
// import { ImagePool } from '@squoosh/lib';

// const INPUT_DIR = path.resolve('./src/assets/imageses');
// const OUTPUT_DIR = path.resolve('./src/assets/imageses/optimized');
// const QUALITY = 75; // default quality

// async function ensureOut() {
//   await fs.mkdir(OUTPUT_DIR, { recursive: true });
// }

// async function walk(dir) {
//   const entries = await fs.readdir(dir, { withFileTypes: true });
//   const files = [];
//   for (const e of entries) {
//     const res = path.resolve(dir, e.name);
//     if (e.isDirectory()) {
//       files.push(...await walk(res));
//     } else {
//       files.push(res);
//     }
//   }
//   return files;
// }

// function isRaster(file) {
//   const ext = path.extname(file).toLowerCase();
//   return ['.png', '.jpg', '.jpeg', '.webp'].includes(ext);
// }

// async function optimizeFile(file, imagePool) {
//   try {
//     const rel = path.relative(INPUT_DIR, file);
//     const outDir = path.join(OUTPUT_DIR, path.dirname(rel));
//     await fs.mkdir(outDir, { recursive: true });

//     const buff = await fs.readFile(file);
//     const image = imagePool.ingestImage(buff);

//     await image.decoded; // ensure decoded

//     // Encode to webp and avif
//     const webpEncoder = imagePool.availableEncoders.get('webp');
//     const avifEncoder = imagePool.availableEncoders.get('avif');

//     const webpCompressed = await image.encode({
//       webp: {
//         quality: QUALITY,
//       }
//     });

//     const avifCompressed = await image.encode({
//       avif: {
//         cqLevel: Math.round((100 - QUALITY) / 10),
//       }
//     });

//     const baseName = path.basename(file, path.extname(file));
//     await fs.writeFile(path.join(outDir, `${baseName}.webp`), Buffer.from(webpCompressed.webp));
//     await fs.writeFile(path.join(outDir, `${baseName}.avif`), Buffer.from(avifCompressed.avif));

//     imagePool.close(image);

//     return {
//       file,
//       out: [path.join(outDir, `${baseName}.webp`), path.join(outDir, `${baseName}.avif`)],
//     };
//   } catch (err) {
//     console.error('optimizeFile (wasm) error', file, err?.message || err);
//     return null;
//   }
// }

// (async function main(){
//   await ensureOut();
//   const files = await walk(INPUT_DIR);
//   const pool = new ImagePool();

//   const done = [];
//   for (const f of files) {
//     if (!isRaster(f)) continue;
//     const stat = await fs.stat(f);
//     if (stat.size < 20 * 1024) continue; // skip tiny files
//     const r = await optimizeFile(f, pool);
//     if (r) done.push(r);
//   }

//   pool.close();

//   console.log(`Optimized ${done.length} files. Output in ${OUTPUT_DIR}`);
//   for (const d of done) {
//     console.log(d.file);
//     for (const o of d.out) console.log('  ->', o);
//   }
// })();
