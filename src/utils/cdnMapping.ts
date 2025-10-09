import CDN_STATIC from './cdnStatic';

let mapping: Record<string, { secure_url?: string }> | null = null;

export async function loadCdnMapping() {
  if (mapping) return mapping;
  try {
    const res = await fetch('/cdn-mapping.json', { cache: 'no-cache' });
    if (!res.ok) return null;
    mapping = await res.json();
    return mapping;
  } catch (e) {
    return null;
  }
}

export function getCdnUrl(basename: string) {
  // Prefer loaded mapping
  if (mapping) {
    const entry = mapping[basename];
    if (entry?.secure_url) return entry.secure_url;
  }
  // Fall back to the static mapping (synchronous)
  const s = CDN_STATIC[basename];
  return s?.secure_url;
}

// Small convenience: attempt to pre-load in background
loadCdnMapping().catch(() => {});

export default { loadCdnMapping, getCdnUrl };
