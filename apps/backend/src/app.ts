import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import path from 'path';
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

// ── Model Registration (Ensures refs can always be populated) ──
import './modules/users/models/user.model';
import './modules/users/models/role.model';
import './modules/users/models/department.model';
import './modules/admin/models/admin.model';
import './modules/artists/models/artist.model';
import './modules/artists/models/artist-category.model';

const app = express();
const PORT = process.env.PORT || 5000;

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
        imgSrc: ["'self'", 'data:', 'blob:', 'http://localhost:*', 'https://res.cloudinary.com'],
        connectSrc: ["'self'"],
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
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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
    res.setHeader(
      'Access-Control-Allow-Origin',
      process.env.FRONTEND_URL ?? 'http://localhost:5173',
    );
    next();
  },
  express.static(path.join(process.cwd(), 'uploads')),
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
});

export default app;
