# Enterprise Authentication System v2 (Mission Control)

## Architecture Overview
The v2 Authentication System is a deterministic, enterprise-grade security layer specifically designed for administrative access to The Artist Mall. It replaces all legacy auth logic with a centralized, database-backed security model.

## Key Components

### 1. Dedicated Admin Security Model
- **Model**: `AdminModel` (stored in `apps/backend/src/modules/admin/models/admin.model.ts`)
- **Hashing Strategy**: Salt-round 12 using `bcrypt` (deterministic).
- **Brute-Force Protection**: 
  - Tracks `loginAttempts`.
  - Automatic 30-minute lockout after 5 consecutive failures.
- **Audit Logging**: Captures `IP`, `User-Agent`, `Timestamp`, and `Outcome` for every login attempt.

### 2. Standardized JWT Pipeline
- **Secrets**: `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`.
- **Expirations**: 
  - Access: 15 minutes.
  - Refresh: 7 days.
- **Refresh Strategy**: Database-verified token rotation on every refresh request.

### 3. Middleware Reinforcement
- **`protectAdmin`**: Verifies JWT + checks if admin exists and is active in the database.
- **`authorizeAdmin`**: Enforces Role-Based Access Control (RBAC).

### 4. Frontend Hydration Guard
- **Store**: Zustand with Persistence.
- **Hydration State**: `isHydrated` flag ensures that Protected Routes wait for the store to sync from `localStorage` before performing any redirects or renders.
- **Blank Screen Prevention**: Display of a high-fidelity sync loader until the session is deterministic.

## Admin Seeder System
To provision or reset the environment:
```bash
cd apps/backend
npx ts-node src/scripts/resetAdmin.ts
```
**Default Credentials:**
- **Email**: `admin@theartistmall.com`
- **Password**: `Admin@123456`
- **Role**: `SUPER_ADMIN`

## Security Hardening Checklist
- [x] Password selection disabled by default in Mongoose.
- [x] Recursive hashing prevented via `isModified` check.
- [x] Brute-force lockout logic.
- [x] IP & Device audit logs.
- [x] HTTP-only cookie for refresh tokens.
- [x] Rate limiting on all auth endpoints.
- [x] No sensitive data (passwords) returned in API responses.

## Troubleshooting
| Issue | Potential Cause | Resolution |
| :--- | :--- | :--- |
| Blank Screen after Login | Hydration Race Condition | Hydration guard in `ProtectedRoute` now prevents this. |
| Login Fails (401) | Bcrypt Mismatch | Run `resetAdmin.ts` to ensure correct hashing. |
| Token Expired (401) | 15m Access Limit | Frontend automatically attempts refresh via `AdminAuthService`. |
| Account Locked (403) | Multiple Failures | Wait 30 minutes or reset via database. |
