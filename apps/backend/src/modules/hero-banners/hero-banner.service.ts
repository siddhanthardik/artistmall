import HeroBanner, { IHeroBanner } from './models/hero-banner.model';

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
    return HeroBanner.find({ isActive: true }).sort({ sortOrder: 1 });
  },

  /**
   * Create a new banner
   */
  createBanner: async (data: Partial<IHeroBanner>) => {
    return HeroBanner.create(data);
  },

  /**
   * Update a banner
   */
  updateBanner: async (id: string, data: Partial<IHeroBanner>) => {
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
