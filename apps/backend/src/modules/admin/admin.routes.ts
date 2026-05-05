import { Router } from 'express';
import * as AdminAuthController from './admin-auth.controller';
import * as AdminController from './admin.controller';
import {
  uploadProfile,
  uploadGallery,
  uploadBrochure,
  uploadCategory,
} from '../../middleware/upload.middleware';
import {
  protectAdmin,
  authorizeAdmin,
  checkPermission,
} from '../../middleware/admin-auth.middleware';
import { PERMISSIONS } from './permissions';

const router = Router();

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC ADMIN AUTH ROUTES (no token required)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/auth/login', AdminAuthController.adminLogin);
router.post('/auth/refresh', AdminAuthController.adminRefresh);
router.post('/auth/logout', protectAdmin, AdminAuthController.adminLogout);

// ─────────────────────────────────────────────────────────────────────────────
// ALL ROUTES BELOW REQUIRE A VALID ADMIN TOKEN
// ─────────────────────────────────────────────────────────────────────────────
router.use(protectAdmin);

// Dashboard Stats
router.get(
  '/stats',
  authorizeAdmin('SUPER_ADMIN', 'SUB_ADMIN', 'INTERNAL_OPS'),
  AdminController.getAdminStats,
);

// ─── MEDIA UPLOAD ROUTES ──────────────────────────────────────────────────────
// CRITICAL: These MUST come BEFORE /artists/:id routes or Express will match
// "upload-profile" and "upload-gallery" as the :id parameter.
// Field names must match exactly what the frontend FormData sends.
router.post(
  '/artists/upload-profile',
  authorizeAdmin('SUPER_ADMIN', 'SUB_ADMIN', 'INTERNAL_OPS'),
  uploadProfile.single('profileImage'),
  AdminController.uploadProfileImage,
);
router.post(
  '/artists/upload-gallery',
  authorizeAdmin('SUPER_ADMIN', 'SUB_ADMIN', 'INTERNAL_OPS'),
  uploadGallery.array('galleryImages', 10),
  AdminController.uploadGalleryImages,
);
router.post(
  '/artists/upload-brochure',
  authorizeAdmin('SUPER_ADMIN', 'SUB_ADMIN', 'INTERNAL_OPS'),
  uploadBrochure.single('brochure'),
  AdminController.uploadBrochure,
);
router.post(
  '/categories/upload',
  authorizeAdmin('SUPER_ADMIN', 'SUB_ADMIN', 'INTERNAL_OPS'),
  uploadCategory.single('categoryImage'),
  AdminController.uploadCategoryImage,
);

// ─── ARTIST MANAGEMENT CRUD ───────────────────────────────────────────────────
router.get('/artists', checkPermission(PERMISSIONS.ARTIST_VIEW), AdminController.getArtists);
router.post(
  '/artists',
  checkPermission(PERMISSIONS.ARTIST_CREATE),
  AdminController.provisionArtist,
);
router.get('/artists/:id', checkPermission(PERMISSIONS.ARTIST_VIEW), AdminController.getArtist);
router.patch(
  '/artists/:id',
  checkPermission(PERMISSIONS.ARTIST_EDIT),
  AdminController.updateArtist,
);
router.put(
  '/artists/:id/step',
  checkPermission(PERMISSIONS.ARTIST_EDIT),
  AdminController.updateArtistStep,
);
router.delete(
  '/artists/:id',
  checkPermission(PERMISSIONS.ARTIST_DELETE),
  AdminController.deleteArtist,
);
router.post(
  '/artists/:id/restore',
  checkPermission(PERMISSIONS.ARTIST_EDIT),
  AdminController.restoreArtist,
);

// Verification & Featured
router.patch(
  '/artists/:id/review',
  checkPermission(PERMISSIONS.ARTIST_EDIT),
  AdminController.reviewArtist,
);
router.patch(
  '/artists/:id/toggle-featured',
  checkPermission(PERMISSIONS.ARTIST_EDIT),
  AdminController.toggleFeatured,
);
router.patch(
  '/artists/:id/toggle-home',
  checkPermission(PERMISSIONS.ARTIST_EDIT),
  AdminController.toggleHome,
);

// ─── CATEGORY MANAGEMENT ──────────────────────────────────────────────────────
router.get(
  '/categories',
  authorizeAdmin('SUPER_ADMIN', 'SUB_ADMIN', 'INTERNAL_OPS'),
  AdminController.getCategories,
);
router.post(
  '/categories',
  authorizeAdmin('SUPER_ADMIN', 'SUB_ADMIN'),
  AdminController.createCategory,
);
router.patch(
  '/categories/:id',
  authorizeAdmin('SUPER_ADMIN', 'SUB_ADMIN'),
  AdminController.updateCategory,
);
router.delete('/categories/:id', authorizeAdmin('SUPER_ADMIN'), AdminController.deleteCategory);

// ─── VERIFICATION QUEUE ───────────────────────────────────────────────────────
router.get(
  '/verifications',
  authorizeAdmin('SUPER_ADMIN', 'SUB_ADMIN'),
  AdminController.getVerificationQueue,
);

// ─── AUDIT LOGS ───────────────────────────────────────────────────────────────
router.get('/audit-logs', authorizeAdmin('SUPER_ADMIN'), AdminController.getAuditLogs);

// ─── STAFF PROVISIONING (Super Admin only) ────────────────────────────────────
router.post('/staff', authorizeAdmin('SUPER_ADMIN'), AdminController.provisionStaff);

router.get(
  '/settings/permissions',
  checkPermission(PERMISSIONS.SETTINGS_MANAGE),
  AdminController.getSettingsPermissions,
);
router.get(
  '/settings/users',
  checkPermission(PERMISSIONS.SETTINGS_MANAGE),
  AdminController.getSettingsUsers,
);
router.post(
  '/settings/users',
  checkPermission(PERMISSIONS.SETTINGS_MANAGE),
  AdminController.createSettingsUser,
);
router.patch(
  '/settings/users/:id',
  checkPermission(PERMISSIONS.SETTINGS_MANAGE),
  AdminController.updateSettingsUser,
);
router.get(
  '/settings/roles',
  checkPermission(PERMISSIONS.SETTINGS_MANAGE),
  AdminController.getSettingsRoles,
);
router.post(
  '/settings/roles',
  checkPermission(PERMISSIONS.SETTINGS_MANAGE),
  AdminController.createSettingsRole,
);
router.get(
  '/settings/departments',
  checkPermission(PERMISSIONS.SETTINGS_MANAGE),
  AdminController.getSettingsDepartments,
);
router.post(
  '/settings/departments',
  checkPermission(PERMISSIONS.SETTINGS_MANAGE),
  AdminController.createSettingsDepartment,
);

export { router as adminRoutes };
