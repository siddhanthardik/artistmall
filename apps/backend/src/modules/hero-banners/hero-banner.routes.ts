import { Router } from 'express';
import { HeroBannerController } from './hero-banner.controller';
import { authorizeAdmin, protectAdmin } from '../../middleware/admin-auth.middleware';
import { uploadBanner } from '../../middleware/upload.middleware';

const router = Router();

// --- PUBLIC ROUTES ---
router.get('/', HeroBannerController.getActiveBanners);

// --- ADMIN ROUTES (Protected) ---
router.use(protectAdmin);
router.use(authorizeAdmin('SUPER_ADMIN', 'SUB_ADMIN'));

router.get('/admin', HeroBannerController.getAllBanners);
router.post('/admin', HeroBannerController.createBanner);
router.post('/admin/upload', uploadBanner.single('bannerImage'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  const imageUrl = `/uploads/banners/${req.file.filename}`;
  res.status(200).json({ success: true, imageUrl });
});
router.patch('/admin/reorder', HeroBannerController.reorderBanners);
router.patch('/admin/:id', HeroBannerController.updateBanner);
router.delete('/admin/:id', HeroBannerController.deleteBanner);

export const heroBannerRoutes = router;
