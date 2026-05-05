/**
 * Centralized media utility for The Artist Mall.
 *
 * URL Strategy:
 * - In DEVELOPMENT: returns relative paths (e.g. /uploads/artists/...)
 *   → Vite proxy forwards these to the backend at localhost:5000
 *   → This avoids Cross-Origin-Resource-Policy issues between ports 5173/5000
 * - In PRODUCTION: prepends VITE_API_BASE_URL (stripped of /api/v1)
 *   → e.g. https://api.theartistmall.com/uploads/artists/...
 *
 * FALLBACK: returns a transparent 1x1 SVG data URL instead of an empty string
 * so <img> tags never render the browser's broken-image icon.
 */

// A transparent SVG used as a safe no-image placeholder.
// This prevents broken-image icons when the src is empty/null.
export const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E";

const isDev = (import.meta as any).env?.DEV ?? true;

const VITE_API_BASE_URL: string =
  (import.meta as any).env?.VITE_API_BASE_URL ?? 'http://localhost:5000/api/v1';

// Strip "/api/v1" suffix to get the bare server origin
const BASE_URL = VITE_API_BASE_URL.replace(/\/api\/v1\/?$/, '');

/**
 * Resolves a media path from the database into a fully usable URL.
 *
 * @param url  The raw path stored in DB (e.g. "/uploads/artists/profile/xyz.jpg")
 *             or an existing absolute URL (https://...)
 * @returns    A URL safe to use as <img src> or <a href>
 */
export const resolveMediaUrl = (url: string | undefined | null): string => {
  if (!url || url.trim() === '') return FALLBACK_IMAGE;

  // Already an absolute URL (http / https / data:) — return as-is
  if (/^(https?:\/\/|data:)/.test(url)) return url;

  // Ensure a leading slash
  const cleanPath = url.startsWith('/') ? url : `/${url}`;

  // Dev: use relative path so Vite proxy handles cross-port routing
  if (isDev) return cleanPath;

  // Production: prepend the server origin
  return `${BASE_URL}${cleanPath}`;
};

/**
 * Returns a resolved URL, or FALLBACK_IMAGE if the result would be empty.
 * Use this where you need a guaranteed non-empty src.
 */
export const resolveMediaUrlOrFallback = (url: string | undefined | null): string => {
  const resolved = resolveMediaUrl(url);
  return resolved === FALLBACK_IMAGE || resolved === '' ? FALLBACK_IMAGE : resolved;
};

// ─────────────────────────────────────────────────────────────────────────────
// Currency formatting for Indian Rupee (INR)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Formats a number in full INR notation with commas.
 * e.g. 500000 → ₹5,00,000
 */
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

/**
 * Formats large numbers as compact shorthand.
 * e.g. 150000 → ₹1.5L | 10000000 → ₹1.0Cr
 */
export const formatCurrencyShorthand = (amount: number | string | undefined | null): string => {
  if (amount === undefined || amount === null || amount === '') return '';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '';

  if (num >= 10_000_000) return `₹${(num / 10_000_000).toFixed(1)}Cr`;
  if (num >= 100_000)    return `₹${(num / 100_000).toFixed(1)}L`;
  if (num >= 1_000)      return `₹${(num / 1_000).toFixed(1)}K`;
  return `₹${num.toLocaleString('en-IN')}`;
};
