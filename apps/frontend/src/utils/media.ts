/**
 * Centralized media URL handling.
 *
 * Uploaded files are rendered as same-origin relative URLs whenever possible.
 * That keeps https://theartistmall.com and https://www.theartistmall.com tabs
 * from depending on stale absolute URLs saved in the database.
 */

export const FALLBACK_IMAGE = '';

const env = (import.meta as any).env ?? {};
const isDev = Boolean(env.DEV);
const API_BASE_URL: string = env.VITE_API_BASE_URL ?? '/api/v1';

const trimApiPath = (value: string) => value.replace(/\/api\/v1\/?$/, '').replace(/\/+$/, '');

const getApiOrigin = (): string => {
  if (API_BASE_URL.startsWith('/')) return '';

  try {
    return trimApiPath(new URL(API_BASE_URL).origin);
  } catch {
    return '';
  }
};

const stripWww = (hostname: string) => hostname.replace(/^www\./i, '');

const isSameSiteHost = (hostname: string) => {
  if (typeof window === 'undefined') return false;
  return stripWww(hostname) === stripWww(window.location.hostname);
};

const isConfiguredApiHost = (hostname: string) => {
  const apiOrigin = getApiOrigin();
  if (!apiOrigin) return false;

  try {
    return stripWww(hostname) === stripWww(new URL(apiOrigin).hostname);
  } catch {
    return false;
  }
};

const isUploadedAssetPath = (pathname: string) => /^\/uploads(\/|$)/i.test(pathname);

const normalizePath = (value: string) => {
  const [pathPart, suffix = ''] = value.split(/([?#].*)/, 2);
  const normalizedPath = `/${pathPart}`.replace(/\/+/g, '/');
  return `${normalizedPath}${suffix}`;
};

/**
 * Resolves a database media value into a browser-safe URL.
 */
export const resolveMediaUrl = (url: string | undefined | null): string => {
  if (!url || typeof url !== 'string') return '';

  const rawUrl = url.trim();
  if (!rawUrl) return '';
  if (/^(data:|blob:)/i.test(rawUrl)) return rawUrl;

  try {
    const parsed = new URL(rawUrl);

    if (
      isUploadedAssetPath(parsed.pathname) &&
      (isSameSiteHost(parsed.hostname) || isConfiguredApiHost(parsed.hostname))
    ) {
      return `${normalizePath(parsed.pathname)}${parsed.search}${parsed.hash}`;
    }

    if (parsed.protocol === 'http:' && typeof window !== 'undefined' && window.location.protocol === 'https:') {
      parsed.protocol = 'https:';
    }

    return parsed.toString();
  } catch {
    const withoutApiPrefix = rawUrl.replace(/^\/api\/v1(?=\/uploads(?:\/|$))/i, '');
    const normalized = normalizePath(withoutApiPrefix);

    if (isDev || normalized.startsWith('/uploads')) return normalized;

    const apiOrigin = getApiOrigin();
    return apiOrigin ? `${apiOrigin}${normalized}` : normalized;
  }
};

export const resolveMediaUrlOrFallback = resolveMediaUrl;

export const formatCurrency = (amount: number | string | undefined | null): string => {
  if (amount === undefined || amount === null || amount === '') return '';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatCurrencyShorthand = (amount: number | string | undefined | null): string => {
  if (amount === undefined || amount === null || amount === '') return '';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '';

  if (num >= 10_000_000) return `₹${(num / 10_000_000).toFixed(1)}Cr`;
  if (num >= 100_000) return `₹${(num / 100_000).toFixed(1)}L`;
  if (num >= 1_000) return `₹${(num / 1_000).toFixed(1)}K`;
  return `₹${num.toLocaleString('en-IN')}`;
};
