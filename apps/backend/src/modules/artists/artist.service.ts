import { ArtistModel } from './models/artist.model';
import { FeaturedListingModel } from './models/featured-listing.model';
import { AdminActivityLogModel } from '../admin/models/admin-activity.model';
import { AppError } from '../../core/errors';
import mongoose from 'mongoose';
import { getCache, setCache, invalidateCache } from '../../utils/redis.util';

export class ArtistService {
  // --- MANAGEMENT ACTIONS ---

  static async createArtist(managementCompanyId: string, data: any) {
    const artist = await ArtistModel.create({
      ...data,
      managementCompanyId,
      verificationStatus: 'DRAFT', // Force draft on creation
      isPublished: false,
      isActive: true,
    });
    return artist;
  }

  static async updateArtist(managementCompanyId: string, artistId: string, data: any) {
    // Prevent management from updating status directly via generic update
    delete data.verificationStatus;
    delete data.isPublished;

    const artist = await ArtistModel.findOneAndUpdate(
      { _id: artistId, managementCompanyId },
      data,
      { new: true, runValidators: true },
    );
    if (!artist) throw new AppError('Artist not found or unauthorized', 404);

    // Invalidate discovery cache
    await invalidateCache('discovery:search:*');

    return artist;
  }

  static async submitForApproval(managementCompanyId: string, artistId: string) {
    const artist = await ArtistModel.findOneAndUpdate(
      {
        _id: artistId,
        managementCompanyId,
        verificationStatus: { $in: ['DRAFT', 'REJECTED', 'NEEDS_UPDATE'] },
      },
      { verificationStatus: 'PENDING_REVIEW' },
      { new: true },
    );
    if (!artist)
      throw new AppError('Artist cannot be submitted for approval from its current state', 400);
    return artist;
  }

  static async softDeleteArtist(managementCompanyId: string, artistId: string) {
    const artist = await ArtistModel.findOneAndUpdate(
      { _id: artistId, managementCompanyId },
      { isDeleted: true, deletedAt: new Date() },
      { new: true },
    );
    if (!artist) throw new AppError('Artist not found', 404);
    return artist;
  }

  static async updateArtistMedia(
    managementCompanyId: string,
    artistId: string,
    media: { profileImage?: string; gallery?: string[] },
  ) {
    const update: any = {};
    if (media.profileImage) update.profileImage = media.profileImage;
    if (media.gallery && media.gallery.length > 0) {
      update.$push = { gallery: { $each: media.gallery } };
    }

    const artist = await ArtistModel.findOneAndUpdate(
      { _id: artistId, managementCompanyId },
      update,
      { new: true },
    );

    if (!artist) throw new AppError('Artist not found or unauthorized', 404);

    // Invalidate discovery cache
    await invalidateCache('discovery:search:*');

    return artist;
  }

  // --- ADMIN ACTIONS ---

  static async adminUpdateStatus(
    adminId: string,
    artistId: string,
    status: 'APPROVED' | 'REJECTED' | 'HIDDEN' | 'ARCHIVED',
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const artist = await ArtistModel.findByIdAndUpdate(
        artistId,
        { verificationStatus: status },
        { new: true, session },
      );

      if (!artist) throw new AppError('Artist not found', 404);

      await AdminActivityLogModel.create(
        [
          {
            adminId,
            action: `ARTIST_STATUS_${status}`,
            targetResource: 'Artist',
            targetId: artistId,
            details: { previousStatus: artist.verificationStatus, newStatus: status },
          },
        ],
        { session },
      );

      await session.commitTransaction();
      session.endSession();

      // Invalidate discovery cache
      await invalidateCache('discovery:search:*');

      return artist;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  static async adminFeatureArtist(
    adminId: string,
    artistId: string,
    tier: 'GOLD' | 'SILVER',
    startDate: Date,
    endDate: Date,
  ) {
    const feature = await FeaturedListingModel.create({
      artistId,
      tier,
      startDate,
      endDate,
    });
    return feature;
  }

  // --- PUBLIC APIS & SEARCH ENGINE ---

  static async searchArtists(filters: {
    categoryId?: string;
    categorySlug?: string;
    categoryName?: string;
    city?: string;
    cityId?: string;
    minPrice?: number;
    maxPrice?: number;
    celebrityLevel?: string;
    isVerified?: string; // 'true' or 'false'
    isFeatured?: string; // 'true' or 'false'
    searchQuery?: string;
    page?: number;
    limit?: number;
  }) {
    const {
      categoryId,
      categorySlug,
      categoryName,
      city,
      cityId,
      minPrice,
      maxPrice,
      celebrityLevel,
      isVerified,
      isFeatured,
      searchQuery,
      page = 1,
      limit = 20,
    } = filters;
    const skip = (page - 1) * limit;

    // --- CACHE LOOKUP ---
    const cacheKey = `discovery:search:${JSON.stringify(filters)}`;
    const cachedData = await getCache(cacheKey);
    if (cachedData) return cachedData;

    // RULE 1: Strict Public Match
    const matchStage: any = {
      isDeleted: false,
      isPublished: true,
      verificationStatus: 'PUBLISHED', // Only published artists can be searched publicly
    };

    if (searchQuery) matchStage.$text = { $search: searchQuery };
    if (categorySlug) {
      matchStage.categorySlug = categorySlug;
    } else if (categoryName) {
      matchStage.categoryName = { $regex: `^${categoryName}$`, $options: 'i' };
    } else if (categoryId) {
      matchStage.categoryId = new mongoose.Types.ObjectId(categoryId);
    }
    if (cityId) matchStage.cityId = new mongoose.Types.ObjectId(cityId);
    if (city) matchStage.city = { $regex: `^${city}$`, $options: 'i' };
    if (celebrityLevel) matchStage.celebrityLevel = celebrityLevel;
    if (isVerified === 'true') matchStage.isVerified = true;
    if (isFeatured === 'true') matchStage.isFeatured = true;

    // Budget range (Price logic using new Schema priceRange)
    if (minPrice !== undefined || maxPrice !== undefined) {
      // The logic: An artist's price range must overlap with the user's budget range.
      // Artist Min <= User Max AND Artist Max >= User Min
      if (maxPrice !== undefined) matchStage['priceRange.min'] = { $lte: maxPrice };
      if (minPrice !== undefined) matchStage['priceRange.max'] = { $gte: minPrice };
    }

    const pipeline: any[] = [];
    pipeline.push({ $match: matchStage });

    // Join Featured Listings (Monetization Logic)
    const currentDate = new Date();
    pipeline.push({
      $lookup: {
        from: 'featuredlistings',
        let: { artistId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$artistId', '$$artistId'] },
                  { $eq: ['$isActive', true] },
                  { $lte: ['$startDate', currentDate] },
                  { $gte: ['$endDate', currentDate] },
                  { $eq: ['$isDeleted', false] },
                ],
              },
            },
          },
        ],
        as: 'activeFeatures',
      },
    });

    // Ranking computation
    pipeline.push({
      $addFields: {
        sortWeight: {
          $switch: {
            branches: [
              { case: { $in: ['GOLD', '$activeFeatures.tier'] }, then: 100 },
              { case: { $in: ['SILVER', '$activeFeatures.tier'] }, then: 50 },
            ],
            default: { $cond: [{ $eq: ['$isVerified', true] }, 10, 0] }, // Verified gives a small organic bump
          },
        },
      },
    });

    // Sort
    const sortStage: any = { sortWeight: -1 };
    if (searchQuery) sortStage.score = { $meta: 'textScore' };
    else sortStage.rating = -1; // Fallback sort
    pipeline.push({ $sort: sortStage });

    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });
    pipeline.push({ $project: { activeFeatures: 0, sortWeight: 0 } });

    const results = await ArtistModel.aggregate(pipeline);
    const totalCount = await ArtistModel.countDocuments(matchStage);

    const result = {
      data: results,
      meta: { total: totalCount, page, limit, totalPages: Math.ceil(totalCount / limit) },
    };

    // --- CACHE STORE (10 minutes for searches) ---
    await setCache(cacheKey, result, 600);

    return result;
  }

  static async getTrendingArtists(limit = 10) {
    return await ArtistModel.find({
      isDeleted: false,
      isPublished: true,
      verificationStatus: 'PUBLISHED',
    })
      .sort({ rating: -1 })
      .limit(limit);
  }

  static async getHomepageFeatured(limit = 8) {
    return await ArtistModel.find({
      isDeleted: false,
      isPublished: true,
      verificationStatus: 'PUBLISHED',
      showOnHome: true,
    })
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  static async getFeaturedArtists(limit = 10) {
    // Priority 1: Boolean isFeatured flag (New simple system)
    // Priority 2: Paid FeaturedListingModel (Existing legacy system)

    // First, get artists with the simple boolean flag
    const directFeatured = await ArtistModel.find({
      isFeatured: true,
      isPublished: true,
      isDeleted: false,
      verificationStatus: 'PUBLISHED',
    }).limit(limit);

    if (directFeatured.length >= limit) return directFeatured;

    // If we need more, fallback to the paid listings
    const currentDate = new Date();
    const remainingLimit = limit - directFeatured.length;
    const features = await FeaturedListingModel.find({
      isActive: true,
      isDeleted: false,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
    })
      .populate('artistId')
      .limit(remainingLimit);

    const paidFeatured = features
      .map((f) => f.artistId)
      .filter((a) => a && !directFeatured.find((df) => df._id.equals((a as any)._id)));

    return [...directFeatured, ...paidFeatured];
  }

  static async getArtistBySlugOrId(slugOrId: string) {
    const isObjectId = mongoose.Types.ObjectId.isValid(slugOrId);
    const query = isObjectId
      ? { _id: slugOrId, isDeleted: false }
      : { slug: slugOrId, isDeleted: false };

    const artist = await ArtistModel.findOne(query)
      .populate('categoryId')
      .populate('subCategoryId');

    if (!artist) throw new AppError('Artist not found or not published', 404);

    // For public detail, we should also check if published unless explicitly allowed
    // But usually this service method is used by both. Let's keep it generic but enforce isPublished in the controller if needed.
    return artist;
  }
}
