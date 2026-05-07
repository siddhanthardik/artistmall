import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { artistRoutes } from './modules/artists/artist.routes';
import { bookingRoutes } from './modules/bookings/booking.routes';
import { adminRoutes } from './modules/admin/admin.routes';
import { heroBannerRoutes } from './modules/hero-banners/hero-banner.routes';
import { leadRoutes } from './modules/leads/lead.routes';
import { clientRoutes } from './modules/clients/client.routes';
import { globalErrorHandler } from './middleware/error.middleware';
import { requestLogger } from './middleware/logger.middleware';
import { connectRedis } from './utils/redis.util';
import { connectDB } from './config/database';
import { UPLOAD_ROOT } from './config/uploads';

// ── Model Registration (Ensures refs can always be populated) ──
import './modules/users/models/user.model';
import './modules/users/models/role.model';
import './modules/users/models/department.model';
import './modules/admin/models/admin.model';
import './modules/artists/models/artist.model';
import './modules/artists/models/artist-category.model';

const app = express();
const PORT = process.env.PORT || 5000;

const parseOrigin = (value?: string): URL | null => {
  if (!value) return null;
  try {
    return new URL(value);
  } catch {
    console.warn(`[CONFIG] Ignoring invalid origin: ${value}`);
    return null;
  }
};

const isLocalHostname = (hostname: string) =>
  hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';

const addOriginVariants = (origins: Set<string>, value?: string) => {
  const parsed = parseOrigin(value);
  if (!parsed) return;

  const hostnames = new Set([parsed.hostname]);
  if (parsed.hostname.startsWith('www.')) {
    hostnames.add(parsed.hostname.slice(4));
  } else if (!isLocalHostname(parsed.hostname)) {
    hostnames.add(`www.${parsed.hostname}`);
  }

  const protocols = isLocalHostname(parsed.hostname) ? [parsed.protocol] : ['https:', 'http:'];
  for (const protocol of protocols) {
    for (const hostname of hostnames) {
      const url = new URL(parsed.toString());
      url.protocol = protocol;
      url.hostname = hostname;
      origins.add(url.origin);
    }
  }
};

const getAllowedOrigins = () => {
  const origins = new Set<string>();
  const configuredOrigins = [
    process.env.FRONTEND_URL,
    process.env.PUBLIC_SITE_URL,
    ...(process.env.CORS_ORIGINS ?? '')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  ];

  configuredOrigins.forEach((origin) => addOriginVariants(origins, origin));

  if (origins.size === 0) {
    addOriginVariants(origins, 'http://localhost:5173');
  }

  return origins;
};

const allowedOrigins = getAllowedOrigins();

const isAllowedOrigin = (origin?: string) => {
  if (!origin) return true;
  const parsed = parseOrigin(origin);
  return Boolean(parsed && allowedOrigins.has(parsed.origin));
};

// ── 1. Proxy Trust ────────────────────────────────────────────────────────────
// Required for accurate IP detection behind Render / AWS ALB / Vercel
// This ensures rate limiting uses the real client IP, not the proxy IP
app.set('trust proxy', 1);

// ── 2. HTTP Security Headers (Helmet) ────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'blob:', 'http://localhost:*', 'https:'],
        connectSrc: ["'self'", ...Array.from(allowedOrigins)],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameSrc: ["'none'"],
      },
    },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  }),
);

// ── 3. CORS ───────────────────────────────────────────────────────────────────
// Only the exact registered frontend origin is allowed — no wildcards in prod
app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
  }),
);

// ── 4. Global API Rate Limiter ───────────────────────────────────────────────
// Throttle all /api/* routes: 100 requests per 15 minutes per IP
// Defends against scraping, enumeration, and general abuse
const globalLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 900_000), // 15 min
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS ?? 100),
  standardHeaders: 'draft-7', // Return RateLimit headers per RFC standard
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
  skip: (req) => req.path === '/health', // Never throttle health checks
});
app.use('/api/', globalLimiter);

// ── 5. Auth Route Strict Limiter ─────────────────────────────────────────────
// Much tighter limit on login/register/refresh to defeat brute-force and
// credential stuffing attacks. 10 attempts per 15 minutes per IP.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please wait 15 minutes.',
  },
});
// Applied BEFORE route mounting so it fires first
app.use('/api/v1/admin/auth/login', authLimiter);
app.use('/api/v1/admin/auth/refresh', authLimiter);
app.use('/api/admin/auth/login', authLimiter);
app.use('/api/admin/auth/refresh', authLimiter);

// ── 6. Body Parser (Payload Hardening) ───────────────────────────────────────
// 2 MB limit prevents large payload DoS attacks
// urlencoded extended: false avoids complex object injection via query strings
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: false, limit: '2mb' }));
app.use(cookieParser());

// ── 7. NoSQL Injection Prevention ────────────────────────────────────────────
// Strips MongoDB operators ($, .) from req.body, req.query, req.params
// Prevents attacks like { "email": { "$gt": "" } } which bypass auth checks
app.use(
  mongoSanitize({
    replaceWith: '_', // Replace $ and . with underscore (safer than silent removal)
    onSanitize: ({ req, key }) => {
      console.warn(`[SECURITY] Sanitized potentially dangerous key: ${key} from ${req.ip}`);
    },
  }),
);

// ── 8. Structured Request Logging ────────────────────────────────────────────
app.use(requestLogger);

// ── Routes ────────────────────────────────────────────────────────────────────
// Static file serving for uploaded artist images.
// IMPORTANT: Must set Cross-Origin-Resource-Policy: cross-origin BEFORE express.static
// or Helmet's default 'same-origin' policy silently blocks <img> tags on the frontend
// (which runs on a different port in dev, and potentially a different domain in prod).
app.use(
  '/uploads',
  (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    const requestOrigin = req.get('origin');
    if (requestOrigin && isAllowedOrigin(requestOrigin)) {
      res.setHeader('Access-Control-Allow-Origin', requestOrigin);
      res.setHeader('Vary', 'Origin');
    }
    // Immutable cache for 30 days for uploaded assets
    res.setHeader('Cache-Control', 'public, max-age=2592000, immutable');
    next();
  },
  express.static(UPLOAD_ROOT, {
    maxAge: '30d',
    immutable: true,
  }),
);

app.use('/api/v1/artists', artistRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/v1/hero-banners', heroBannerRoutes);
app.use('/api/v1/leads', leadRoutes);
app.use('/api/v1/clients', clientRoutes);

// ── Health Check (no rate limit, no auth) ────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Artist Mall API is operational',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV ?? 'development',
  });
});

// ── Global Error Handler (must be last) ──────────────────────────────────────
app.use(globalErrorHandler);

app.listen(PORT, async () => {
  const env = process.env.NODE_ENV ?? 'development';
  console.log(`[${env.toUpperCase()}] Artist Mall API running on port ${PORT}`);

  // Initialize async services
  await connectDB();
  await connectRedis();

  // Startup Validation
  const dbUri = process.env.MONGODB_URI || '';
  const dbName = dbUri.split('/').pop()?.split('?')[0] || 'unknown';

  console.log(`\n--- Startup Validation ---`);
  console.log(`Database Name: ${dbName}`);
  console.log(`Upload Root:   ${UPLOAD_ROOT}`);
  console.log(`Media Path:    /uploads -> ${UPLOAD_ROOT}`);

  if (!fs.existsSync(UPLOAD_ROOT)) {
    console.warn(`[WARNING] Upload directory does not exist at ${UPLOAD_ROOT}`);
    fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
    console.log(`[INFO] Created missing upload directory.`);
  } else {
    console.log(`[OK] Upload directory validated.`);
  }
  console.log(`--------------------------\n`);
});

export default app;
