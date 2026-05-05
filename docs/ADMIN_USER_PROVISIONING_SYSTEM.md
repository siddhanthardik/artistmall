# Admin User Provisioning System - The Artist Mall

## Operational Architecture

The User Provisioning System is the **sole onboarding engine** for The Artist Mall. Since public registration has been disabled, all users, companies, and artists are provisioned through this internal infrastructure.

## Onboarding Workflow

### 1. Company Provisioning

- **Entities**: Booking Companies (Clients) and Management Companies (Vendors).
- **Fields**: Email, Company Name, Industry Type, GST Number, Billing Address, Assigned Manager.
- **Outcome**: A User account and a Company Profile are created simultaneously.

### 2. Artist Provisioning

- **Strict Rule**: Artists can ONLY be created by internal admin staff.
- **Fields**: Name, Category, City, Fee Range, Celebrity Tier, Verification Status.
- **Outcome**: Artist profile is created and linked to a Management Company.

### 3. Staff Provisioning (Super Admin Only)

- **Roles**: Admin, Sub-Admin, Internal Ops, Finance Ops.
- **Outcome**: Secure access granted to internal team members.

## Security & Access Control

### Temporary Password Flow

1. Admin enters user details.
2. System generates a secure, random 12-character temporary password.
3. Account is created with `mustChangePassword: true`.
4. Credentials are sent to the user (and displayed once to the admin).

### Mandatory Password Reset

- On first login, the user is restricted from accessing the dashboard until they set a new, secure password.
- This ensures the temporary credentials are never used for long-term access.

### RBAC Matrix

| Action              | Super Admin | Sub-Admin | Internal Ops |
| :------------------ | :---------: | :-------: | :----------: |
| Provision Companies |     ✅      |    ✅     |      ❌      |
| Provision Artists   |     ✅      |    ✅     |      ❌      |
| Provision Staff     |     ✅      |    ❌     |      ❌      |
| View Audit Logs     |     ✅      |    ❌     |      ❌      |

## Audit Architecture

Every administrative action is logged in an immutable audit trail:

- **Created By**: The admin ID and role.
- **Timestamp**: Exact time of action.
- **IP Address**: Source IP of the request.
- **Target Resource**: The entity affected (e.g., User, Company).
- **Metadata**: Before/After state or creation parameters.

---

_Date: April 29, 2026_
_System Version: 1.0 (Internal Provisioning)_
