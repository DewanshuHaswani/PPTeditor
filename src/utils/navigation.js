export const isPortable = () => !!window.__AHM_PORTABLE__;
export const viewUrl = (view) => isPortable() ? `#${view}` : `/${view}`;
export const assetUrl = (url) => window.__AHM_ASSETS__?.[url] || url;

export function externalLink(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  const text = value.trim();
  try {
    const url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || !url.hostname.includes('.')) return null;
    return url.href;
  } catch { return null; }
}
