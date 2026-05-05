import { Router } from 'express';
import * as ArtistController from './artist.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';
import { upload } from '../../middleware/upload.middleware';

const router = Router();

// --- PUBLIC ROUTES (No Auth Required) ---
router.get('/search', ArtistController.searchArtists);
router.get('/trending', ArtistController.getTrendingArtists);
router.get('/featured', ArtistController.getFeaturedArtists);
router.get('/homepage-featured', ArtistController.getHomepageFeatured);
router.get('/categories', ArtistController.getCategories);
router.get('/:id', ArtistController.getArtistDetail);

// --- PROTECTED ROUTES ---
router.use(requireAuth);

// Management Routes
router.post('/', requireRole('MANAGEMENT_COMPANY'), ArtistController.createArtist);
router.patch('/:id', requireRole('MANAGEMENT_COMPANY'), ArtistController.updateArtist);
router.post(
  '/:id/submit',
  requireRole('MANAGEMENT_COMPANY'),
  ArtistController.submitArtistForApproval,
);
router.delete('/:id', requireRole('MANAGEMENT_COMPANY'), ArtistController.deleteArtist);
router.patch(
  '/:id/media',
  requireRole('MANAGEMENT_COMPANY'),
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'gallery', maxCount: 10 },
  ]),
  ArtistController.uploadArtistMedia,
);

// Admin Routes
router.patch(
  '/:id/approve',
  requireRole('SUPER_ADMIN', 'SUB_ADMIN'),
  ArtistController.adminApproveArtist,
);
router.patch(
  '/:id/reject',
  requireRole('SUPER_ADMIN', 'SUB_ADMIN'),
  ArtistController.adminRejectArtist,
);
router.post('/:id/feature', requireRole('SUPER_ADMIN'), ArtistController.adminFeatureArtist);

export const artistRoutes = router;
