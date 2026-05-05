# Platform Simplification & Cleanup - The Artist Mall

## Overview

The Artist Mall has undergone a major architectural simplification, transitioning from a complex marketplace/CRM/SaaS model into a **Focused Admin-Controlled Premium Artist Database + Internal Booking Operations Platform**.

## Removed Architecture

### 1. Company Module (Completely Deleted)

- **Entities**: Removed `BookingCompany` and `ManagementCompany` models.
- **Roles**: Removed `MANAGEMENT_COMPANY` and `BOOKING_COMPANY` roles.
- **Logic**: Deleted all company onboarding, verification, and profile management flows.

### 2. Public Marketplace Flows (Deleted)

- **Negotiation**: Removed the Negotiation Room and Counter-Offer systems.
- **Self-Service**: Removed the ability for external entities to request bookings or track them via a personal dashboard.
- **Inquiry**: Deleted public-facing inquiry workflows.

### 3. CRM & Sales Systems (Deleted)

- **Leads**: Removed Lead models and sales pipelines.
- **Tracking**: Deleted inquiry management and revenue pipeline tracking.

### 4. Commercial Document System (Deleted)

- **Generators**: Removed Proposal, Quotation, and Agreement generators.
- **Finance**: Deleted automated Invoice generation and payment proposal flows.
- **Manual Control**: All commercial agreements are now handled manually by internal staff offline.

### 5. Email Delivery System (Deleted)

- **SMTP**: Removed SMTP configurations and email delivery engine.
- **Queues**: Deleted BullMQ email background workers.
- **Notification**: Credentials and notifications are now shared manually by admins with enterprise partners.

## Final Platform Scope

### 1. Internal Roles Only

- **SUPER_ADMIN**: Full system control and staff provisioning.
- **SUB_ADMIN**: Artist database management and operations.
- **INTERNAL_OPS**: Day-to-day talent procurement and listing management.
- **FINANCE / SUPPORT**: Specialized internal access.

### 2. Premium Artist Database

- A verified, high-security repository of talent.
- Profiles are created and maintained exclusively by internal staff.
- High-density search and filtering for internal talent discovery.

### 3. Internal Operations Platform

- Centralized "Mission Control" for managing artist rosters.
- Internal booking tracking and status management.
- Immutable audit logs for all administrative actions.

## Cleaned Modules

### Backend

- `auth`: Simplified to internal login only.
- `admin`: Expanded to handle staff and artist provisioning.
- `artists`: Focused on the database model.
- `bookings`: Simplified for internal tracking (negations and public requests removed).

### Frontend

- Removed all Company and Management dashboards.
- Unified "Mission Control" layout for internal staff.
- Simplified homepage focused on brand trust and discovery, not signups.

---

_Date: April 29, 2026_
_Status: Architecture Cleanup Complete_
