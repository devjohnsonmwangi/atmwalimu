// Helper utilities to compute public optimized image paths produced by the CI optimizer.
// The optimizer writes into `public/optimized/<safeDir>/<basename>-<width>.<ext>`
export function safeDirFrom(relDir: string) {
  return relDir.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/\\/g, '/');
}

export function optimizedBasePath(relDir: string) {
  const safe = safeDirFrom(relDir);
  return `/optimized/${safe}`;
}

export function optimizedSrcSet(relDir: string, basename: string, widths: number[] = [1920, 1280, 640], ext = 'avif') {
  const base = optimizedBasePath(relDir);
  return widths.map((w) => `${base}/${basename}-${w}.${ext} ${w}w`).join(', ');
}

export function optimizedFallback(relDir: string, basename: string) {
  const base = optimizedBasePath(relDir);
  return `${base}/${basename}.jpg`;
}

export function optimizedSources(relDir: string, basename: string, widths = [1920, 1280, 640]) {
  return {
    avifSrcSet: optimizedSrcSet(relDir, basename, widths, 'avif'),
    webpSrcSet: optimizedSrcSet(relDir, basename, widths, 'webp'),
    fallback: optimizedFallback(relDir, basename),
  };
}
