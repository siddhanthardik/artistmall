# Artist Upload and Publish System - V2 Architecture

## Overview
The Artist Creation pipeline has been completely rebuilt to address the 500 Internal Server Errors that occurred when saving artists with media files. The root causes were identified as:
1.  **Payload Mismatch:** The frontend was attempting to send `FormData` to an endpoint that expected JSON.
2.  **Schema Validation:** Numeric fields like `priceRange.min` and `priceRange.max` were failing Mongoose validation because they were strictly required even for drafts, and were not safely parsed from strings.
3.  **Identity Resolution:** The Admin authentication object was using a legacy `.id` property instead of the updated v2 `.userId` property, causing `createdBy` reference failures.
4.  **Route Conflicts:** Upload endpoints had conflicting signatures with parameterized GET routes.

## Architecture Updates

### 1. Two-Phase Media Upload
The backend now enforces a robust, two-phase process for creating artists with media.

**Phase A: Media Ingestion**
Media files must be uploaded *before* the artist is provisioned. The backend exposes two dedicated, deterministically-routed endpoints:
*   **Profile Image:** `POST /api/v1/admin/artists/upload-profile`
    *   **Field Name:** `profileImage` (Must match exactly)
    *   **Response:** Returns the URL path to the uploaded image.
*   **Gallery Images:** `POST /api/v1/admin/artists/upload-gallery`
    *   **Field Name:** `galleryImages` (Must match exactly)
    *   **Response:** Returns an array of URL paths.

*Note: The backend now serves these images statically via `/uploads/artists/*`.*

**Phase B: Payload Provisioning**
Once media URLs are retrieved, the frontend must submit a standard **JSON** payload to `POST /api/v1/admin/artists`. 

### 2. Schema Flexibility
*   The `ArtistModel` has been updated to remove the strict `required: true` constraints on `priceRange.min` and `priceRange.max`.
*   Draft artists can now be saved without mandatory pricing information. 
*   The controller automatically sanitizes string inputs to `Numbers`, defaulting to `0` to prevent `NaN` Mongoose cast errors.

### 3. V2 Identity Integration
The `admin.controller.ts` now strictly uses the `req.user.userId` property provided by the `admin-auth.middleware.ts` to log actions and set the `createdBy` reference.

### 4. Route Organization
Upload routes have been strictly ordered in `admin.routes.ts` *before* the `/:id` parameterized routes. This guarantees that `upload-profile` is not interpreted as an artist ID by Express.

## Frontend Implementation Rules
When implementing or modifying the artist creation form:
1.  Do NOT send `FormData` to the primary `provisionArtist` endpoint.
2.  Maintain separate loading states for `profile` and `gallery` uploads.
3.  Append the backend's base URL (e.g., `http://localhost:5000`) to the returned image paths for live preview on the frontend.
4.  Use the `AdminService.uploadProfileImage` and `AdminService.uploadGalleryImages` methods strictly.

## Troubleshooting
*   **500 Error on Save:** Check the terminal logs. If it's a validation error, ensure numeric fields are not being sent as empty strings `""` or `NaN`.
*   **400 Error on Upload:** Ensure your `FormData` exactly uses `fd.append('profileImage', file)` or `fd.append('galleryImages', file)`. Mismatched field names will trigger a Multer error.
*   **404 on Images:** Ensure the backend is running. Images are served statically from the backend's `/uploads` folder.
