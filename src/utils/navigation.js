export const isPortable = () => !!window.__AHM_PORTABLE__;
export const viewUrl = (view) => isPortable() ? `#${view}` : `/${view}`;
export const assetUrl = (url) => window.__AHM_ASSETS__?.[url] || url;
