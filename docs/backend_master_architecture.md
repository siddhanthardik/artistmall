# The Artist Mall: Backend Master Architecture Blueprint

**Version:** 1.0.0
**Context:** Production-Grade B2B Artist Management Marketplace (Pan India)
**Stack:** Node.js, Express.js, TypeScript, MongoDB Atlas

This document serves as the master execution blueprint for the backend engineering team. It was collaboratively designed by the Architecture, Database, Security, DevOps, and Data Science experts.

---

## TASK A: COMPLETE DATABASE DESIGN (MongoDB Atlas)

**Global Architecture Rules:**
*   **Audit Fields:** Every collection contains `createdAt`, `updatedAt`, `createdBy` (User ID), and `updatedBy` (User ID).
*   **Soft Deletes:** Every collection contains `isDeleted` (Boolean, default: false) and `deletedAt` (Date). Hard deletes are strictly prohibited in production.
*   **Validation:** Mongoose schemas will enforce strict validation, backed by Zod at the API layer.
*   **Denormalization Strategy:** Embed rarely changing, frequently accessed data (e.g., basic category names inside artists) to avoid `$lookup` overhead. Use references for unbounded relationships (e.g., bookings).

### 1. `users`
*   **Purpose:** Core identity and authentication.
*   **Fields:** `email` (String, req), `passwordHash` (String, req), `role` (Enum/Ref, req), `isActive` (Bool), `isVerified` (Bool), `lastLoginAt` (Date).
*   **Indexes:** `{ email: 1 }` (Unique), `{ role: 1, isActive: 1 }`.

### 2. `roles_permissions`
*   **Purpose:** RBAC definition.
*   **Fields:** `roleName` (String, req), `permissions` (Array of Strings, req - e.g., `["artist:create", "booking:approve"]`).
*   **Indexes:** `{ roleName: 1 }` (Unique).

### 3. `management_companies` (Supply Side)
*   **Purpose:** Profile for PR Firms/Managers.
*   **Fields:** `userId` (Ref: users, req), `companyName` (String, req), `gstNumber` (String), `registrationDocUrl` (String), `verificationStatus` (Enum: PENDING, VERIFIED, REJECTED), `commissionRate` (Number).
*   **Indexes:** `{ userId: 1 }` (Unique), `{ verificationStatus: 1 }`.

### 4. `booking_companies` (Demand Side)
*   **Purpose:** Profile for Event Planners/Agencies.
*   **Fields:** `userId` (Ref: users, req), `companyName` (String, req), `industryType` (String), `kycStatus` (Enum), `billingAddress` (Object).
*   **Indexes:** `{ userId: 1 }` (Unique).

### 5. `artists`
*   **Purpose:** The core marketplace asset.
*   **Fields:** `managementCompanyId` (Ref: management_companies, req), `categoryId` (Ref: artist_categories, req), `name` (String, req), `bio` (String), `basePrice` (Number, req), `performanceDurationMins` (Number), `riderRequirements` (String).
*   **Indexes:** Compound: `{ categoryId: 1, basePrice: 1 }`, `{ managementCompanyId: 1 }`, Text Index on `{ name: "text" }`.
*   **Scalability:** Denormalize `categoryName` to reduce joins on the listing page.

### 6. `artist_categories`
*   **Purpose:** Taxonomy (e.g., Musician, Standup, Anchor).
*   **Fields:** `name` (String, req), `slug` (String, req, unique), `parentCategoryId` (Ref, optional for sub-categories).

### 7. `artist_media`
*   **Purpose:** High-res images, YouTube links, Press Kits.
*   **Fields:** `artistId` (Ref, req), `mediaType` (Enum: IMAGE, VIDEO, PDF), `url` (String, req), `isPrimary` (Bool).
*   **Scalability:** Kept separate from `artists` to keep the main artist document small during search aggregations.

### 8. `artist_availability`
*   **Purpose:** Calendar blocking.
*   **Fields:** `artistId` (Ref, req), `date` (Date, req), `status` (Enum: BOOKED, BLOCKED, HOLD).
*   **Indexes:** `{ artistId: 1, date: 1 }` (Unique compound).

### 9. `booking_requests`
*   **Purpose:** The initial inquiry payload.
*   **Fields:** `bookingCompanyId` (Ref, req), `artistId` (Ref, req), `eventDate` (Date, req), `cityId` (Ref, req), `eventType` (Ref: event_types), `offeredBudget` (Number), `status` (Enum - see Task D).
*   **Indexes:** `{ artistId: 1, status: 1 }`, `{ bookingCompanyId: 1, eventDate: 1 }`.

### 10. `booking_negotiations`
*   **Purpose:** Chat/Offer history for a booking.
*   **Fields:** `bookingRequestId` (Ref, req), `senderId` (Ref: users), `message` (String), `proposedPrice` (Number), `isCounterOffer` (Bool).

### 11. `booking_status_logs`
*   **Purpose:** Immutable audit trail for booking state changes.
*   **Fields:** `bookingRequestId` (Ref, req), `previousStatus` (Enum), `newStatus` (Enum), `changedById` (Ref: users), `reason` (String).

### 12. `commissions`
*   **Purpose:** Financial ledger for platform fees.
*   **Fields:** `bookingRequestId` (Ref, req), `managementCompanyId` (Ref), `bookingAmount` (Number), `platformFeePercentage` (Number), `platformFeeAmount` (Number), `status` (Enum: UNPAID, PAID, DISPUTED).

### 13. `featured_listings`
*   **Purpose:** Monetization (Sponsored artists).
*   **Fields:** `artistId` (Ref, req), `startDate` (Date), `endDate` (Date), `tier` (Enum: GOLD, SILVER).
*   **Indexes:** `{ artistId: 1, endDate: 1 }`.

### 14. `admin_activity_logs`
*   **Purpose:** Security audit for Super Admins.
*   **Fields:** `adminId` (Ref, req), `action` (String), `targetResource` (String), `targetId` (String), `ipAddress` (String).

### 15. `notifications`
*   **Purpose:** System alerts.
*   **Fields:** `userId` (Ref, req), `type` (Enum: BOOKING, SYSTEM, PAYMENT), `title` (String), `content` (String), `isRead` (Bool).

### 16. `documents_verification`
*   **Purpose:** KYC workflow.
*   **Fields:** `userId` (Ref), `documentType` (Enum: GST, PAN, AADHAAR), `documentUrl` (String), `status` (Enum: PENDING, APPROVED, REJECTED), `reviewedBy` (Ref).

### 17. `cities`
*   **Purpose:** Standardized location taxonomy.
*   **Fields:** `name` (String), `state` (String), `tier` (Enum: TIER_1, TIER_2, TIER_3).

### 18. `event_types`
*   **Purpose:** Standardized event tags.
*   **Fields:** `name` (String) - e.g., "Corporate Gala", "Wedding Sangeet".

### 19. `testimonials`
*   **Purpose:** Social proof.
*   **Fields:** `artistId` (Ref), `bookingRequestId` (Ref), `rating` (Number 1-5), `reviewText` (String), `isApproved` (Bool).

### 20. `audit_logs`
*   **Purpose:** General data changes (CDC - Change Data Capture pattern).
*   **Fields:** `collectionName` (String), `documentId` (String), `operation` (Enum: CREATE, UPDATE, DELETE), `diff` (Object).

---

## TASK B: ROLE PERMISSION MATRIX & SECURITY STRATEGY

### 1. Role Definitions

1.  **Super Admin:** Unrestricted access. Can manage other admins, override any booking, access full financials.
2.  **Sub Admin:** Restricted admin. Can verify documents, moderate testimonials, but cannot change platform fee percentages or create admins.
3.  **Management Company (Supply):** Can CRUD their own artists, accept/reject booking requests, negotiate pricing, view their commission reports.
4.  **Booking Company (Demand):** Can search artists, initiate booking requests, submit offers, view their booking history.
5.  **Internal Operations Team:** Can view bookings, assist in matchmaking, follow up on pending KYC, but no financial access.
6.  **Finance Team:** Read-only access to bookings. Full access to `commissions`, payouts, and GST reports.
7.  **Support Team:** Can view basic user profiles and booking statuses to resolve tickets. No access to edit or view exact financial margins.

### 2. Security & Authentication Architecture

*   **RBAC Strategy:** Express middleware will check `req.user.role` against a required permissions matrix before hitting the controller.
*   **JWT Strategy (Double Token):**
    *   **Access Token:** Short-lived (15 minutes), stateless, contains `userId` and `role`. Sent via `Authorization: Bearer`.
    *   **Refresh Token:** Long-lived (7 days), stateful (hashed and stored in DB), issued as an `HttpOnly`, `Secure`, `SameSite=Strict` cookie.
*   **Login Security:**
    *   Rate limiting on `/auth/login` (e.g., max 5 attempts per 15 mins).
    *   Account lockout after consecutive failures.
    *   Passwords hashed with `bcrypt` (cost factor 12).
*   **Session Invalidation:** Changing password or logging out deletes the Refresh Token from the DB and clears the cookie.

---

## TASK C: COMPLETE API BLUEPRINT

**Architecture Pattern:** `Route -> Controller -> Service -> Repository -> Model`
**Base Path:** `/api/v1`

### 1. Auth Module (`/auth`)
*   `POST /register`: Payload: email, password, role. Rule: Requires email verification workflow.
*   `POST /login`: Payload: email, password. Response: AT in body, RT in cookie.
*   `POST /logout`: Clears RT cookie, invalidates RT in DB.
*   `POST /refresh`: Validates RT cookie, issues new AT.

### 2. Management Company Module (`/management-companies`)
*   `POST /kyc-documents`: Payload: files. Auth: Mgmt Company. Business Rule: Triggers status change to PENDING_REVIEW.
*   `GET /:id/dashboard-stats`: Returns active artists, pending requests, total earnings.

### 3. Artist Module (`/artists`)
*   `POST /`: Payload: name, categoryId, basePrice, etc. Auth: Mgmt Company. Validation: basePrice > 0.
*   `GET /search`: Payload (Query): city, category, minPrice, maxPrice, date. Auth: Any. Rule: Excludes `isDeleted: true` and unavailable artists. Uses MongoDB Aggregation for performance.
*   `PATCH /:id`: Update details.
*   `POST /:id/media`: Upload images/videos (integrates with AWS S3 Service).

### 4. Booking Request Module (`/bookings`)
*   `POST /`: Payload: artistId, date, offeredBudget. Auth: Booking Company. Rule: Checks `artist_availability`. Creates `DRAFT` or `PENDING_REVIEW` booking.
*   `POST /:id/negotiate`: Payload: proposedPrice, message. Auth: Mgmt or Booking Co. Creates entry in `booking_negotiations`.
*   `PATCH /:id/status`: Payload: status. Auth: Mgmt Co or Admin. Triggers status machine rules (Task D).

### 5. Commission & Finance Module (`/finance`)
*   `GET /commissions/pending`: Auth: Finance Team. Lists all completed bookings awaiting payout.
*   `POST /commissions/:id/mark-paid`: Auth: Finance Team. Updates ledger.

### 6. Admin Module (`/admin`)
*   `PATCH /users/:id/verify`: Auth: Sub Admin / Super Admin.
*   `POST /featured-listings`: Auth: Super Admin. Elevates an artist's search ranking.

---

## TASK D: BOOKING BUSINESS LOGIC & WORKFLOW

**The State Machine (Strict Transitions Enforced by Backend Service):**

1.  **`DRAFT`**: Created by Demand side, not sent yet.
2.  **`REQUESTED`**: Sent to Management Company. (Blocks `artist_availability` as HOLD).
3.  **`NEGOTIATING`**: Counter-offers being exchanged via `booking_negotiations`.
4.  **`ACCEPTED_BY_MGMT`**: Supply side agrees to price/terms.
5.  **`ADVANCE_PENDING`**: Demand side must pay the platform/escrow advance. (Auto-expires if not paid in 48h).
6.  **`CONFIRMED`**: Advance paid. (Changes `artist_availability` to BOOKED).
7.  **`COMPLETED`**: Event occurred. Triggers Commission generation.
8.  **`CANCELLED_BY_CLIENT`**: Triggers refund/penalty rules.
9.  **`CANCELLED_BY_MGMT`**: Triggers admin review/penalty.
10. **`REJECTED`**: Management company declined the initial request.

**Admin Overrides:**
*   Super Admins have an emergency `FORCE_CANCEL` or `FORCE_CONFIRM` endpoint, which bypasses normal rules but mandates a strict `reason` payload logged in `booking_status_logs` and `admin_activity_logs`.

**Failure Handling:**
*   If a transaction fails during `ADVANCE_PENDING`, the state reverts to `ACCEPTED_BY_MGMT` and a notification is fired.
*   DB Transactions (Session/ACID) will be used when moving from `ADVANCE_PENDING` -> `CONFIRMED` to ensure Ledger and Status update atomically.

---

*This blueprint defines the boundary conditions for all backend development. No code will be merged that violates these structural rules.*
