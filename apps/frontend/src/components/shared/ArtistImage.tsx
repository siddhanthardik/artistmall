import React, { useState } from 'react';
import { resolveMediaUrl, FALLBACK_IMAGE } from '../../utils/media';

interface ArtistImageProps {
  src: string | undefined | null;
  alt: string;
  className?: string;
  fallbackClassName?: string;
}

/**
 * ArtistImage — a drop-in <img> replacement that:
 * 1. Resolves the URL correctly (dev proxy vs production absolute)
 * 2. Shows an elegant placeholder on error — never a broken-image icon
 * 3. Handles null/undefined src gracefully
 */
export const ArtistImage: React.FC<ArtistImageProps> = ({
  src,
  alt,
  className = '',
  fallbackClassName = '',
}) => {
  const [errored, setErrored] = useState(false);

  const resolvedSrc = resolveMediaUrl(src);
  const showFallback = errored || !src || resolvedSrc === FALLBACK_IMAGE;

  if (showFallback) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 ${fallbackClassName || className}`}
        aria-label={alt}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-10 h-10 text-slate-300"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
      loading="lazy"
    />
  );
};
