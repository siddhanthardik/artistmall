# Admin Artist Management System - The Artist Mall

## Operational Philosophy

The Artist Management System (AMS) is the core operational engine of The Artist Mall. It is designed as an **Internal Staff Only** infrastructure for managing a premium, vetted roster of talent. It prioritizes data integrity, operational speed, and investor-grade audit trails.

## RBAC Access Matrix

| Module                | Super Admin | Admin | Internal Ops | Finance |
| :-------------------- | :---------: | :---: | :----------: | :-----: |
| Dashboard Stats       |     ✅      |  ✅   |      ✅      |   ✅    |
| Artist Create/Update  |     ✅      |  ✅   |      ❌      |   ❌    |
| Artist Delete/Restore |     ✅      |  ❌   |      ❌      |   ❌    |
| Verification Queue    |     ✅      |  ✅   |      ❌      |   ❌    |
| Audit Logs            |     ✅      |  ❌   |      ❌      |   ❌    |
| Staff Management      |     ✅      |  ❌   |      ❌      |   ❌    |

## Core Infrastructure

### 1. Artist Master CRUD

- **Location**: `/admin/artists`
- **Capabilities**: High-density management of the entire talent roster.
- **Fields**: Comprehensive data points including stage name, multi-layered location, performance types, premium tiers, and financial guardrails.

### 2. Talent Intake Workflow

- **Location**: `/admin/artists/create`
- **Design**: A 4-step premium provisioning flow:
  1. **Identity**: Branding and category mapping.
  2. **Context**: Location data and comprehensive biographies.
  3. **Media**: High-resolution gallery and video asset management.
  4. **Operations**: Pricing benchmarks, premium tier assignment, and status control.

### 3. Premium Tiering System

Artists are assigned to logical tiers that govern platform visibility and discovery priority:

- `STANDARD`
- `FEATURED`
- `SILVER`
- `GOLD`
- `PREMIUM`
- `EXCLUSIVE`

### 4. Verification Workflow

All talent profiles move through a controlled lifecycle:

- `DRAFT` → `PENDING_REVIEW` → `APPROVED` → `PUBLISHED`
- Failed entries are marked as `NEEDS_UPDATE` or `REJECTED` with internal reviewer notes.

## Audit & Compliance Architecture

Every administrative action triggers an immutable log entry:

- **Action Type**: (e.g., `CREATE_ARTIST`, `UPDATE_PRICING`)
- **Metadata**: Before/After state snapshots.
- **Context**: Admin ID, exact Timestamp, and Source IP.
- **Compliance**: Designed for executive review and operational accountability.

---

_Date: April 29, 2026_
_System Version: 2.0 (Talent Operations Master)_
