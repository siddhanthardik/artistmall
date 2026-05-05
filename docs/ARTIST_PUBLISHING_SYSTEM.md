# Artist Publishing System

## Overview
The Artist Publishing System is a multi-stage workflow designed to onboard, verify, and distribute talent across The Artist Mall platform. It ensures quality control through administrative review before any artist becomes publicly visible.

## Publishing Workflow

### 1. Intake (Provisioning)
- **Status**: `DRAFT` or `PENDING_REVIEW`
- **Visibility**: Internal only.
- **Action**: Staff creates a talent profile with identity, location, media, and financial guardrails.

### 2. Verification Queue
- **Status**: `PENDING_REVIEW`
- **Visibility**: Accessible in Mission Control → Verification Center.
- **Action**: Administrative audit of biography, gallery assets, and pricing.

### 3. Approval & Publishing
- **Status**: `APPROVED` or `PUBLISHED`
- **IsPublished**: `true`
- **Action**: Once approved, the artist can be published. Only artists with `verificationStatus: 'PUBLISHED'` and `isPublished: true` are visible on the public discovery engine.

## Homepage Promotion Logic
Artists can be explicitly promoted to the public storefront homepage.
- **Field**: `showOnHomepage: true`
- **Logic**: Public API `GET /api/v1/artists/homepage-featured` returns curated talent for the premium storefront feed.

## Image Upload Architecture
- **Infrastructure**: Multer-based disk storage.
- **Paths**:
  - Profile: `/uploads/artists/profile/`
  - Gallery: `/uploads/artists/gallery/`
- **Validation**: Strict MIME-type checking (Images only) and 5MB per-file limit.

## System States Matrix

| Status | isPublished | Public Visibility | Action Required |
| :--- | :--- | :--- | :--- |
| `DRAFT` | `false` | None | Complete Profile |
| `PENDING_REVIEW` | `false` | None | Admin Audit |
| `APPROVED` | `false` | None | Publish Manually |
| `PUBLISHED` | `true` | Full Discovery | Monitoring |
| `REJECTED` | `false` | None | Update Profile |

## Roles & Permissions
- **Super Admin**: Full control over verification, publishing, and homepage promotion.
- **Sub-Admin**: Verification and publishing capabilities.
- **Internal Ops**: Profile creation and media management only.
- **Finance**: Budget and commission oversight.
