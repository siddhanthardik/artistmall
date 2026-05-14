import { Request, Response, NextFunction } from 'express';
import { ArtistService } from './artist.service';
import { AppError } from '../../core/errors';
import { ArtistCategoryModel } from './models/artist-category.model';
import { sanitizeMediaField } from '../../utils/media-integrity.util';

// --- MANAGEMENT CONTROLLERS ---

export const createArtist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const artist = await ArtistService.createArtist(req.user!.userId, req.body);
    res.status(201).json({ status: 'success', data: { artist } });
  } catch (error) {
    next(error);
  }
};

export const updateArtist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const artist = await ArtistService.updateArtist(req.user!.userId, req.params.id, req.body);
    res.status(200).json({ status: 'success', data: { artist } });
  } catch (error) {
    next(error);
  }
};

export const submitArtistForApproval = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const artist = await ArtistService.submitForApproval(req.user!.userId, req.params.id);
    res.status(200).json({ status: 'success', data: { artist } });
  } catch (error) {
    next(error);
  }
};

export const deleteArtist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const artist = await ArtistService.softDeleteArtist(req.user!.userId, req.params.id);
    res.status(200).json({ status: 'success', data: { artist } });
  } catch (error) {
    next(error);
  }
};

// --- ADMIN CONTROLLERS ---

export const adminApproveArtist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const artist = await ArtistService.adminUpdateStatus(
      req.user!.userId,
      req.params.id,
      'APPROVED',
    );
    res.status(200).json({ status: 'success', data: { artist } });
  } catch (error) {
    next(error);
  }
};

export const adminRejectArtist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const artist = await ArtistService.adminUpdateStatus(
      req.user!.userId,
      req.params.id,
      'REJECTED',
    );
    res.status(200).json({ status: 'success', data: { artist } });
  } catch (error) {
    next(error);
  }
};

export const adminFeatureArtist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tier, startDate, endDate } = req.body;
    const feature = await ArtistService.adminFeatureArtist(
      req.user!.userId,
      req.params.id,
      tier,
      new Date(startDate),
      new Date(endDate),
    );
    res.status(201).json({ status: 'success', data: { feature } });
  } catch (error) {
    next(error);
  }
};

// --- PUBLIC CONTROLLERS ---

export const searchArtists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
    let maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;

    const budget = req.query.budget as string;
    if (budget) {
      if (budget === '1-5') {
        minPrice = 100000;
        maxPrice = 500000;
      } else if (budget === '5-10') {
        minPrice = 500000;
        maxPrice = 1000000;
      } else if (budget === '10-15') {
        minPrice = 1000000;
        maxPrice = 1500000;
      } else if (budget === '15-20') {
        minPrice = 1500000;
        maxPrice = 2000000;
      } else if (budget === '20-plus') {
        minPrice = 2000000;
        maxPrice = undefined;
      }
    }

    const filters = {
      categoryId: req.query.categoryId as string,
      categorySlug: req.query.categorySlug as string,
      categoryName: req.query.categoryName as string,
      city: req.query.city as string,
      cityId: req.query.cityId as string,
      celebrityLevel: req.query.celebrityLevel as string,
      isVerified: req.query.isVerified as string,
      isFeatured: req.query.isFeatured as string,
      minPrice,
      maxPrice,
      budget,
      searchQuery: req.query.q as string,
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 20,
    };
    const result = await ArtistService.searchArtists(filters);
    res.status(200).json({ status: 'success', ...result });
  } catch (error) {
    next(error);
  }
};

export const getTrendingArtists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const artists = await ArtistService.getTrendingArtists(limit);
    res.status(200).json({ status: 'success', data: { artists } });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedArtists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const artists = await ArtistService.getFeaturedArtists(limit);
    res.status(200).json({ status: 'success', data: { artists } });
  } catch (error) {
    next(error);
  }
};

export const getHomepageFeatured = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 8;
    const artists = await ArtistService.getHomepageFeatured(limit);
    res.status(200).json({ status: 'success', data: { artists } });
  } catch (error) {
    next(error);
  }
};

export const getArtistDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const artist = await ArtistService.getArtistBySlugOrId(req.params.id);

    if (!artist.isPublished) {
      throw new AppError('Artist profile is not public yet', 403);
    }

    res.status(200).json({ status: 'success', data: { artist } });
  } catch (error) {
    next(error);
  }
};

export const uploadArtistMedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const profileImage = files['profileImage']?.[0]?.filename;
    const gallery = files['gallery']?.map((file) => file.filename) || [];

    const artist = await ArtistService.updateArtistMedia(req.user!.userId, req.params.id, {
      profileImage,
      gallery,
    });

    res.status(200).json({ status: 'success', data: { artist } });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await ArtistCategoryModel.find({ isActive: true }).sort({
      sortOrder: 1,
      name: 1,
    });
    res.status(200).json({
      status: 'success',
      data: { categories: categories.map((category) => sanitizeMediaField(category as any, 'image_url')) },
    });
  } catch (error) {
    next(error);
  }
};
