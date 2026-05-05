# Controlled Access Platform Update - The Artist Mall

## Overview
The Artist Mall has transitioned from a public marketplace model to a **Controlled-Access Enterprise B2B Platform**. This change ensures that the platform remains an exclusive, premium network for verified business entities and talent.

## Key Changes

### 1. Removal of Public Registration
- **No Public Signup**: All public-facing registration pages, forms, and onboarding flows have been permanently removed.
- **Controlled Entry**: Users can no longer create accounts independently. Access is strictly managed by The Artist Mall internal team.
- **CTA Updates**: Landing page CTAs like "Register Now" or "Join as Artist" have been replaced with "Request Booking", "Contact Sales", and "Partner With Us".

### 2. Premium Enterprise Login Redesign
- **Enterprise Portal**: The login screen has been redesigned as a secure business gateway.
- **Positioning**: Focused on "Secure Access to India's Premium Talent Booking Network".
- **Contact for Access**: A secondary CTA has been added for legitimate businesses to request access via the internal team.

### 3. Admin-Controlled User Management
Account creation is now restricted based on the following role hierarchy:

| Role | Permissions |
| :--- | :--- |
| **Super Admin** | Create Admins, Create Internal Staff, Create Companies/Artists |
| **Admin Staff (Sub-Admin)** | Create Artists, Create Booking Companies, Create Management Companies |
| **Companies/Artists** | No account creation permissions |

### 4. Technical Enforcement
- **Backend Lockdown**: The `POST /api/v1/auth/register` endpoint has been removed.
- **Admin API**: New secured endpoints at `/api/v1/admin/users` allow staff to create verified accounts.
- **RBAC Enforcement**: Strict Role-Based Access Control (RBAC) ensures that only authorized staff can trigger account creation.
- **Pre-Verification**: All accounts created by admins are marked as pre-verified, streamlining the onboarding for high-value partners.

## Operational Model
To add a new entity to the platform:
1. Business/Artist contacts The Artist Mall Sales/Partnership team.
2. Internal verification is performed offline.
3. Admin Staff creates the account via the Admin Dashboard.
4. User receives secure login credentials and gains access to their premium dashboard.

---
*Date: April 29, 2026*
*Architecture Version: 2.0 (Controlled Access)*
