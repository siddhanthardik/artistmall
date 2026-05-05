# Production Monitoring Strategy

## The Artist Mall — Observability & Alerting

---

## 1. Structured Logging (Winston)

The platform uses `winston` with environment-aware formatting:

- **Development**: Colorized, human-readable console output
- **Production**: Structured JSON logs (ingested by Datadog/CloudWatch)

Log levels used:
| Level | When Used |
|---|---|
| `info` | Successful operations, HTTP 2xx/3xx |
| `warn` | Client errors (4xx), cache misses, degraded features |
| `error` | Server errors (5xx), DB failures, security events |
| `debug` | Verbose trace data (disabled in production) |

---

## 2. Sentry — Error Tracking (Frontend + Backend)

### Backend Setup

```bash
npm install @sentry/node @sentry/profiling-node
```

```ts
// Add to app.ts BEFORE other middleware
import * as Sentry from '@sentry/node';
Sentry.init({ dsn: process.env.SENTRY_DSN, tracesSampleRate: 0.2 });
app.use(Sentry.Handlers.requestHandler());
// ... routes ...
app.use(Sentry.Handlers.errorHandler()); // BEFORE globalErrorHandler
```

### Frontend Setup

```bash
npm install @sentry/react
```

```ts
// In main.tsx, wrap App with Sentry.ErrorBoundary
Sentry.init({ dsn: import.meta.env.VITE_SENTRY_DSN, integrations: [new BrowserTracing()] });
```

**Critical Alerts to configure in Sentry:**

- Any 500-level error → Alert immediately via Slack/Email
- Payment/Commission failures → Page on-call engineer
- Auth failures > 50/min → Security incident

---

## 3. UptimeRobot — Uptime Monitoring

Create monitors for:
| URL | Check Interval | Alert Contact |
|---|---|---|
| `https://api.theartistmall.com/health` | Every 5 min | Founders + DevOps |
| `https://www.theartistmall.com` | Every 5 min | Founders |

---

## 4. MongoDB Atlas Monitoring

Enable in Atlas Dashboard:

- **Real-time Performance Panel**: Monitor opcounters, connections, latency
- **Query Profiler**: Enable for slow query detection (threshold: 100ms)
- **Atlas Alerts**: Set up alerts for:
  - Connection pool > 80% capacity
  - Query execution time > 500ms
  - Disk utilization > 75%

---

## 5. Key Business Metrics to Track (Post-Launch)

| Metric          | Tool               | Target  |
| --------------- | ------------------ | ------- |
| API P95 Latency | Sentry / Datadog   | < 300ms |
| Frontend LCP    | Sentry Performance | < 2.5s  |
| Error Rate      | Sentry             | < 0.1%  |
| DB Query Time   | Atlas Profiler     | < 100ms |
| Uptime          | UptimeRobot        | 99.9%   |
