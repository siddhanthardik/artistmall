import multer from 'multer';
import path from 'path';
import fs from 'fs';

// ─────────────────────────────────────────────────────────────────────────────
// Helper: ensure upload directory exists
// ─────────────────────────────────────────────────────────────────────────────
const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const UPLOAD_ROOT = path.join(process.cwd(), 'uploads');
ensureDir(path.join(UPLOAD_ROOT, 'artists', 'profile'));
ensureDir(path.join(UPLOAD_ROOT, 'artists', 'gallery'));
ensureDir(path.join(UPLOAD_ROOT, 'artists', 'brochures'));
ensureDir(path.join(UPLOAD_ROOT, 'categories'));
ensureDir(path.join(UPLOAD_ROOT, 'clients'));

// ─────────────────────────────────────────────────────────────────────────────
// Filename Sanitizer
// Converts "Arijit Singh Main Pic.JPG" → "arijit-singh-main-pic-1714472837.jpg"
// ─────────────────────────────────────────────────────────────────────────────
const sanitizeFilename = (originalname: string): string => {
  const ext = path.extname(originalname).toLowerCase(); // e.g. ".jpg"
  const basename = path.basename(originalname, path.extname(originalname));
  const slug = basename
    .toLowerCase()
    .replace(/\s+/g, '-') // spaces → hyphens
    .replace(/[^a-z0-9-]/g, '') // strip special chars
    .replace(/-+/g, '-') // collapse multiple hyphens
    .replace(/^-+|-+$/g, '') // trim leading/trailing hyphens
    .slice(0, 60); // cap length

  const timestamp = Date.now();
  return `${slug || 'file'}-${timestamp}${ext}`;
};

// ─────────────────────────────────────────────────────────────────────────────
// ALLOWED IMAGE TYPES — ONLY JPG, JPEG, PNG
// WEBP, GIF, SVG, HEIC, TIFF, BMP are explicitly rejected
// ─────────────────────────────────────────────────────────────────────────────
const ALLOWED_IMAGE_MIMETYPES = ['image/jpeg', 'image/jpg', 'image/png'];

const imageFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (ALLOWED_IMAGE_MIMETYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type: "${file.mimetype}". Only JPG, JPEG, and PNG images are accepted.`,
      ),
    );
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// ALLOWED DOCUMENT TYPES — PDF, DOC, DOCX
// ─────────────────────────────────────────────────────────────────────────────
const ALLOWED_DOCUMENT_MIMETYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const brochureFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (ALLOWED_DOCUMENT_MIMETYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: "${file.mimetype}". Only PDF, DOC, and DOCX are accepted.`));
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Storage: Profile Image  →  uploads/artists/profile/
// ─────────────────────────────────────────────────────────────────────────────
const profileStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dest = path.join(UPLOAD_ROOT, 'artists', 'profile');
    ensureDir(dest);
    cb(null, dest);
  },
  filename: (_req, file, cb) => {
    cb(null, `profile-${sanitizeFilename(file.originalname)}`);
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Storage: Gallery Images  →  uploads/artists/gallery/
// ─────────────────────────────────────────────────────────────────────────────
const galleryStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dest = path.join(UPLOAD_ROOT, 'artists', 'gallery');
    ensureDir(dest);
    cb(null, dest);
  },
  filename: (_req, file, cb) => {
    cb(null, `gallery-${sanitizeFilename(file.originalname)}`);
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Storage: Brochure / Document  →  uploads/artists/brochures/
// ─────────────────────────────────────────────────────────────────────────────
const brochureStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dest = path.join(UPLOAD_ROOT, 'artists', 'brochures');
    ensureDir(dest);
    cb(null, dest);
  },
  filename: (_req, file, cb) => {
    cb(null, `brochure-${sanitizeFilename(file.originalname)}`);
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Generic storage (legacy support for artist.routes.ts management company uploads)
// ─────────────────────────────────────────────────────────────────────────────
const genericStorage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const type = req.params.type || 'general';
    const dest = path.join(UPLOAD_ROOT, 'artists', type);
    ensureDir(dest);
    cb(null, dest);
  },
  filename: (_req, file, cb) => {
    cb(null, sanitizeFilename(file.originalname));
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Storage: Hero Banners  →  uploads/banners/
// ─────────────────────────────────────────────────────────────────────────────
const bannerStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dest = path.join(UPLOAD_ROOT, 'banners');
    ensureDir(dest);
    cb(null, dest);
  },
  filename: (_req, file, cb) => {
    cb(null, `banner-${sanitizeFilename(file.originalname)}`);
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Storage: Categories  →  uploads/categories/
// ─────────────────────────────────────────────────────────────────────────────
const categoryStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dest = path.join(UPLOAD_ROOT, 'categories');
    ensureDir(dest);
    cb(null, dest);
  },
  filename: (_req, file, cb) => {
    cb(null, `cat-${sanitizeFilename(file.originalname)}`);
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Storage: Client Logos  →  uploads/clients/
// ─────────────────────────────────────────────────────────────────────────────
const clientStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dest = path.join(UPLOAD_ROOT, 'clients');
    ensureDir(dest);
    cb(null, dest);
  },
  filename: (_req, file, cb) => {
    cb(null, `client-${sanitizeFilename(file.originalname)}`);
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Exported multer instances
// ─────────────────────────────────────────────────────────────────────────────

/** Profile image — field name: "profileImage" | accepts: JPG, JPEG, PNG | max: 5 MB */
export const uploadProfile = multer({
  storage: profileStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

/** Gallery images — field name: "galleryImages" (array) | accepts: JPG, JPEG, PNG | max: 5 MB each */
export const uploadGallery = multer({
  storage: galleryStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

/** Brochure / document — field name: "brochure" | accepts: PDF, DOC, DOCX | max: 10 MB */
export const uploadBrochure = multer({
  storage: brochureStorage,
  fileFilter: brochureFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

/** Hero Banner — field name: "bannerImage" | accepts: JPG, JPEG, PNG | max: 5 MB */
export const uploadBanner = multer({
  storage: bannerStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

/** Category Image — field name: "categoryImage" | accepts: JPG, JPEG, PNG | max: 2 MB */
export const uploadCategory = multer({
  storage: categoryStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

/** Generic upload (legacy — management company uploads) */
export const upload = multer({
  storage: genericStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

/** Client Logo — field name: "logo" | accepts: JPG, JPEG, PNG | max: 2 MB */
export const uploadClient = multer({
  storage: clientStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});
