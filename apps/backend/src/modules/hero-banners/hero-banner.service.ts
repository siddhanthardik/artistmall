import HeroBanner, { IHeroBanner } from './models/hero-banner.model';
import { hasValidMediaField, sanitizeMediaField } from '../../utils/media-integrity.util';
import { AppError } from '../../core/errors';

export const HeroBannerService = {
  /**
   * Get all banners (Admin)
   */
  getAllBanners: async () => {
    return HeroBanner.find().sort({ sortOrder: 1, createdAt: -1 });
  },

  /**
   * Get active banners (Public)
   */
  getActiveBanners: async () => {
    const banners = await HeroBanner.find({ isActive: true }).sort({ sortOrder: 1 });
    return banners
      .filter((banner) => hasValidMediaField(banner as any, 'imageUrl'))
      .map((banner) => sanitizeMediaField(banner as any, 'imageUrl'));
  },

  /**
   * Create a new banner
   */
  createBanner: async (data: Partial<IHeroBanner>) => {
    if (data.imageUrl && !hasValidMediaField(data as any, 'imageUrl')) {
      throw new AppError('Banner image file is missing from storage', 400);
    }
    return HeroBanner.create(data);
  },

  /**
   * Update a banner
   */
  updateBanner: async (id: string, data: Partial<IHeroBanner>) => {
    if (data.imageUrl && !hasValidMediaField(data as any, 'imageUrl')) {
      throw new AppError('Banner image file is missing from storage', 400);
    }
    return HeroBanner.findByIdAndUpdate(id, { $set: data }, { new: true });
  },

  /**
   * Delete a banner
   */
  deleteBanner: async (id: string) => {
    return HeroBanner.findByIdAndDelete(id);
  },

  /**
   * Bulk reorder banners
   */
  reorderBanners: async (orders: { id: string; sortOrder: number }[]) => {
    const operations = orders.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { sortOrder: item.sortOrder } },
      },
    }));
    return HeroBanner.bulkWrite(operations);
  },
};
