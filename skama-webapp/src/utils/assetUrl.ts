import { API_BASE_URL } from '../services/apiPaths';

export function resolveAssetUrl(path?: string | null): string | undefined {
  if (!path) {
    return undefined;
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const base = API_BASE_URL.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return base ? `${base}${normalizedPath}` : normalizedPath;
}

export function fallbackLocalProductImage(failedUrl?: string): string {
  const fileName = decodeURIComponent(failedUrl?.split('/').pop() ?? '');
  if (!fileName) {
    return '/assets/images/hero/skama-hero-jewelry-detail.png';
  }

  if (fileName.startsWith('limited-')) {
    return `/assets/limited/${fileName}`;
  }

  if (fileName.includes('hero') || fileName.startsWith('skama-')) {
    return '/assets/images/hero/skama-hero-jewelry-detail.png';
  }

  return `/assets/regular/${fileName}`;
}
