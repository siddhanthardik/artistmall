import fs from 'fs';
import path from 'path';
import { UPLOAD_ROOT } from '../config/uploads';

const isUploadedPath = (value: string) => /^\/uploads(\/|$)/i.test(value);

export const normalizeUploadedMediaPath = (value?: string | null): string => {
  if (!value || typeof value !== 'string') return '';

  const trimmed = value.trim();
  if (!trimmed) return '';

  try {
    const parsed = new URL(trimmed);
    return isUploadedPath(parsed.pathname) ? parsed.pathname : trimmed;
  } catch {
    const normalized = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    return normalized.replace(/\/+/g, '/');
  }
};

export const localUploadedMediaExists = (value?: string | null): boolean => {
  const mediaPath = normalizeUploadedMediaPath(value);
  if (!mediaPath) return false;

  if (/^https?:\/\//i.test(mediaPath)) return true;
  if (!isUploadedPath(mediaPath)) return false;

  const relativePath = mediaPath.replace(/^\/uploads\/?/i, '');
  const absolutePath = path.resolve(UPLOAD_ROOT, relativePath);

  if (!absolutePath.startsWith(UPLOAD_ROOT)) return false;
  return fs.existsSync(absolutePath);
};

const toPlainObject = <T>(value: T): any => {
  if (value && typeof (value as any).toObject === 'function') {
    return (value as any).toObject();
  }

  return value;
};

export const sanitizeArtistMedia = <T>(artist: T): any => {
  const plainArtist = toPlainObject(artist);
  if (!plainArtist) return plainArtist;

  const gallery = Array.isArray(plainArtist.gallery)
    ? plainArtist.gallery
        .map((item: string) => normalizeUploadedMediaPath(item))
        .filter((item: string) => localUploadedMediaExists(item))
    : [];

  const profileImage = normalizeUploadedMediaPath(plainArtist.profileImage);
  const hasProfileImage = localUploadedMediaExists(profileImage);

  return {
    ...plainArtist,
    profileImage: hasProfileImage ? profileImage : gallery[0] ?? '',
    gallery,
    brochureFile: localUploadedMediaExists(plainArtist.brochureFile)
      ? normalizeUploadedMediaPath(plainArtist.brochureFile)
      : '',
  };
};

export const sanitizeArtistsMedia = <T>(artists: T[]): any[] => artists.map(sanitizeArtistMedia);

export const sanitizeMediaField = <T extends Record<string, any>>(item: T, field: keyof T): T => {
  const plainItem = toPlainObject(item);
  const mediaPath = normalizeUploadedMediaPath(plainItem?.[field]);

  return {
    ...plainItem,
    [field]: localUploadedMediaExists(mediaPath) ? mediaPath : '',
  };
};

export const hasValidMediaField = <T extends Record<string, any>>(item: T, field: keyof T) =>
  localUploadedMediaExists(toPlainObject(item)?.[field]);
