import { Request, Response } from 'express';
import { HeroBannerService } from './hero-banner.service';

export const HeroBannerController = {
  /**
   * Public: Get active banners
   */
  getActiveBanners: async (req: Request, res: Response) => {
    try {
      const banners = await HeroBannerService.getActiveBanners();
      res.status(200).json({
        success: true,
        data: banners,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch hero banners',
        error: error.message,
      });
    }
  },

  /**
   * Admin: Get all banners
   */
  getAllBanners: async (req: Request, res: Response) => {
    try {
      const banners = await HeroBannerService.getAllBanners();
      res.status(200).json({
        success: true,
        data: banners,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch banners',
        error: error.message,
      });
    }
  },

  /**
   * Admin: Create banner
   */
  createBanner: async (req: Request, res: Response) => {
    try {
      const banner = await HeroBannerService.createBanner(req.body);
      res.status(201).json({
        success: true,
        data: banner,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: 'Failed to create banner',
        error: error.message,
      });
    }
  },

  /**
   * Admin: Update banner
   */
  updateBanner: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const banner = await HeroBannerService.updateBanner(id, req.body);
      if (!banner) {
        return res.status(404).json({ success: false, message: 'Banner not found' });
      }
      res.status(200).json({
        success: true,
        data: banner,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: 'Failed to update banner',
        error: error.message,
      });
    }
  },

  /**
   * Admin: Delete banner
   */
  deleteBanner: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await HeroBannerService.deleteBanner(id);
      res.status(200).json({
        success: true,
        message: 'Banner deleted successfully',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete banner',
        error: error.message,
      });
    }
  },

  /**
   * Admin: Reorder banners
   */
  reorderBanners: async (req: Request, res: Response) => {
    try {
      const { orders } = req.body;
      if (!Array.isArray(orders)) {
        return res.status(400).json({ success: false, message: 'Orders must be an array' });
      }
      await HeroBannerService.reorderBanners(orders);
      res.status(200).json({
        success: true,
        message: 'Banners reordered successfully',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to reorder banners',
        error: error.message,
      });
    }
  },
};
