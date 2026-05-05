# Database Performance Strategy

## The Artist Mall — MongoDB Atlas Production Optimization

---

## 1. Index Audit & Optimization Plan

### Artist Collection — Indexes Required

```js
// Primary discovery query: category + city + price range + status
db.artists.createIndex(
  { status: 1, categoryId: 1, cityId: 1, 'priceRange.min': 1 },
  { name: 'idx_discovery_primary' },
);

// Featured tier boost: ensures GOLD/SILVER artists sort to top
db.artists.createIndex({ featuredTier: 1, status: 1 }, { name: 'idx_featured_tier' });

// Full-text search on name and bio
db.artists.createIndex(
  { name: 'text', bio: 'text' },
  { name: 'idx_text_search', weights: { name: 10, bio: 3 } },
);

// Management company roster lookup
db.artists.createIndex({ createdBy: 1, status: 1 }, { name: 'idx_management_roster' });
```

### Booking Collection — Indexes Required

```js
// Demand-side: booking company viewing their requests
db.bookings.createIndex(
  { bookingCompanyId: 1, status: 1, createdAt: -1 },
  { name: 'idx_booking_demand' },
);

// Supply-side: management viewing incoming requests for their artists
db.bookings.createIndex({ artistId: 1, status: 1 }, { name: 'idx_booking_supply' });

// Admin: commission reporting by date range
db.bookings.createIndex(
  { status: 1, completedAt: -1, commissionStatus: 1 },
  { name: 'idx_commission_audit' },
);
```

### User/Auth Collection — TTL Index (Auto-Cleanup)

```js
// Refresh tokens: expire automatically after 7 days
db.refreshtokens.createIndex(
  { expiresAt: 1 },
  { expireAfterSeconds: 0, name: 'idx_ttl_refresh_tokens' },
);

// Notifications: archive notifications after 90 days
db.notifications.createIndex(
  { createdAt: 1 },
  { expireAfterSeconds: 7776000, name: 'idx_ttl_notifications' },
);
```

---

## 2. Aggregation Pipeline Optimizations

The Discovery engine's `$match` stage must be the **first** stage in every pipeline to leverage the `idx_discovery_primary` index. Ensure the following order:

1. `$match` — Filter by `status: 'APPROVED'` and user-selected filters
2. `$sort` — Sort by `featuredTier` first, then `priceRange.min`
3. `$skip` / `$limit` — Pagination
4. `$lookup` — Populate `categoryId` and `cityId` (only after filtering)

**Rule: Never $lookup before $match. This causes full collection scans.**

---

## 3. MongoDB Atlas Production Settings

| Setting              | Recommended Value                                       |
| -------------------- | ------------------------------------------------------- |
| Read Preference      | `primaryPreferred` for dashboards, `primary` for writes |
| Write Concern        | `w: majority` for all financial/booking operations      |
| Connection Pool Size | `minPoolSize: 5`, `maxPoolSize: 50`                     |
| Atlas Tier           | M10+ for production (dedicated cluster)                 |
| Backup               | Enable continuous backups (PITR)                        |
| Atlas Search         | Enable for text search if full-text load is high        |

---

## 4. Log Archival Strategy

| Data               | Retention  | Action                           |
| ------------------ | ---------- | -------------------------------- |
| Refresh Tokens     | 7 days     | TTL index auto-delete            |
| Notifications      | 90 days    | TTL index auto-archive           |
| Admin Audit Logs   | 2 years    | Archive to cold storage (S3)     |
| Booking History    | Indefinite | Never delete — financial record  |
| Commission Records | Indefinite | Never delete — legal requirement |
