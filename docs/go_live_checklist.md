# Go-Live Checklist & SOP

## The Artist Mall — Production Launch Runbook

**Last Updated**: April 2026
**Owner**: Founding Team

---

## PRE-LAUNCH CHECKLIST

### Environment & Secrets

- [ ] All `.env.example` variables populated in production environment (Render/Vercel dashboard)
- [ ] `MONGODB_URI` points to Atlas M10+ production cluster
- [ ] `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` are 64+ character random strings
- [ ] `FRONTEND_URL` set to exact production domain (no trailing slash)
- [ ] Redis URI configured and connection tested
- [ ] Cloudinary credentials valid and upload tested
- [ ] SMTP credentials valid and test email sent

### Database

- [ ] Atlas cluster is M10 or higher (dedicated, not shared)
- [ ] All production indexes created (see `database_performance_strategy.md`)
- [ ] TTL indexes active and verified
- [ ] Point-In-Time Recovery (PITR) backups enabled in Atlas
- [ ] IP Whitelist in Atlas configured (restrict to backend server IPs only)
- [ ] Seed data: Admin user created with `SUPER_ADMIN` role

### Security

- [ ] `express-rate-limit` installed and configured on auth routes
- [ ] `express-mongo-sanitize` installed and active
- [ ] All items from `security_audit_report.md` addressed
- [ ] Sentry DSN configured for both frontend and backend
- [ ] UptimeRobot monitors active

### CI/CD

- [ ] `ci.yml` has successfully passed on the `main` branch
- [ ] `deploy.yml` Render deploy hook and Vercel deploy hook secrets added to GitHub
- [ ] Branch protection rules enabled on `main` (require PR + CI pass)

### Frontend

- [ ] `VITE_API_BASE_URL` points to production backend URL
- [ ] Production build runs successfully (`npm run build`)
- [ ] No console errors on initial page load
- [ ] Core Web Vitals checked (LCP < 2.5s)

---

## DEPLOYMENT PROCEDURE (Zero-Downtime)

1. **Merge to `main`** → CI pipeline runs automatically
2. **CI passes** → `deploy.yml` triggers Render (backend) and Vercel (frontend) deployments
3. **Wait** for both deployments to report healthy
4. **Smoke test** production `https://api.theartistmall.com/health` → must return `{ status: "OK" }`
5. **Test critical flows** (see Smoke Test section below)
6. **Monitor** Sentry and UptimeRobot for 30 minutes post-deploy

---

## SMOKE TEST — Critical Flows

| Flow                                            | Expected Result                       |
| ----------------------------------------------- | ------------------------------------- |
| `POST /api/v1/auth/register` with valid payload | 201, JWT cookie set                   |
| `POST /api/v1/auth/login`                       | 200, access token in cookie           |
| `GET /api/v1/artists/discovery`                 | 200, array of approved artists        |
| Admin login → VerificationCenter loads          | Artists with PENDING_APPROVAL visible |
| Management login → MyArtists loads              | Roster loads (empty if new)           |
| Booking login → BookingRequests loads           | Requests load (empty if new)          |

---

## ROLLBACK STRATEGY

If deployment causes a critical failure:

1. **Frontend**: In Vercel dashboard → Deployments → Click previous deployment → "Promote to Production"
2. **Backend**: In Render dashboard → Manual Deploy → Select previous successful deploy hash
3. **Database**: If schema migration caused issues → Restore from Atlas PITR backup to 10 minutes before deployment

**Target RTO (Recovery Time Objective): < 15 minutes**

---

## PRODUCTION INCIDENT SOP

| Severity      | Definition                          | Response Time     | Escalation         |
| ------------- | ----------------------------------- | ----------------- | ------------------ |
| P0 — Critical | Platform down, payments failing     | 15 min            | Wake all founders  |
| P1 — High     | Core flow broken (login, booking)   | 1 hour            | Alert on-call team |
| P2 — Medium   | Feature degraded, workaround exists | 4 hours           | Slack notification |
| P3 — Low      | UI issue, cosmetic bug              | Next business day | Ticket in backlog  |

---

## 30-DAY FOUNDER KPI TARGETS

| KPI                                 | Day 30 Target    |
| ----------------------------------- | ---------------- |
| Registered Management Companies     | 25               |
| Live Artist Profiles                | 150              |
| Registered Booking Companies        | 40               |
| Total Booking Inquiries Submitted   | 80               |
| Active Negotiations                 | 25               |
| Confirmed Bookings (GMV generated)  | 10               |
| Platform GMV (Month 1)              | ₹50 Lakhs        |
| Platform Commission Earned          | ₹5 Lakhs (10%)   |
| Featured Listing Subscriptions Sold | 5 (₹25,000/slot) |
| Premium Listing Revenue             | ₹1.25 Lakhs      |
