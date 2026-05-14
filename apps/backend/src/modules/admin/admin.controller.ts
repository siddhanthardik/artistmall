import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { ArtistModel } from '../artists/models/artist.model';
import { ArtistCategoryModel } from '../artists/models/artist-category.model';
import { FeaturedListingModel } from '../artists/models/featured-listing.model';
import { generateTempPassword } from '../../utils/password.util';
import { logAdminActivity } from '../../utils/audit.util';
import { AppError } from '../../core/errors';
import { AdminActivityLogModel } from './models/admin-activity.model';
import { AdminModel } from './models/admin.model';
import { RoleModel } from '../users/models/role.model';
import { DepartmentModel } from '../users/models/department.model';
import { ALL_PERMISSIONS, DEFAULT_ROLES } from './permissions';
import { localUploadedMediaExists } from '../../utils/media-integrity.util';

// Helper: consistently pull the admin's ID from the v2 auth token payload
const getAdminId = (req: Request): string => req.user!.userId;
const isValidObjectId = (id?: string) => !id || mongoose.Types.ObjectId.isValid(id);

const ensureValidPermissions = (permissions: string[]) => {
  const allowed = new Set(ALL_PERMISSIONS);
  if (!permissions.every((permission) => allowed.has(permission as any))) {
    throw new AppError('One or more permissions are invalid', 400);
  }
};

const assertArtistHasPublishableMedia = (artist: { profileImage?: string; gallery?: string[] }) => {
  const hasProfileImage = localUploadedMediaExists(artist.profileImage);
  const hasGalleryImage = (artist.gallery ?? []).some((url) => localUploadedMediaExists(url));

  if (!hasProfileImage && !hasGalleryImage) {
    throw new AppError('Cannot publish artist because the profile/gallery image file is missing from storage', 400);
  }
};

/**
 * 1. PROVISION ARTIST (CREATE)
 */
export const provisionArtist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adminId = getAdminId(req);
    const body = req.body;

    // Parse numbers safely — never let NaN reach Mongoose
    const priceMin = Number(body.priceRange?.min) || 0;
    const priceMax = Number(body.priceRange?.max) || 0;
    const yearsOfExperience = Number(body.yearsOfExperience) || 0;
    const eventsCompleted = Number(body.eventsCompleted) || 0;

    // Fetch the category to denormalize its data
    const category = await ArtistCategoryModel.findById(body.categoryId);
    if (!category) throw new AppError('Selected category does not exist', 400);

    const artistData = {
      ...body,
      categoryName: category.name,
      categorySlug: category.slug,
      createdBy: adminId,
      yearsOfExperience,
      eventsCompleted,
      priceRange: { min: priceMin, max: priceMax },
      verificationStatus: body.verificationStatus || 'DRAFT',
      isPublished: body.verificationStatus === 'PUBLISHED',
      isActive: true,
    };

    if (artistData.isPublished || artistData.showOnHome || artistData.isFeatured) {
      assertArtistHasPublishableMedia(artistData);
    }

    const newArtist = await ArtistModel.create(artistData);

    await logAdminActivity(adminId, 'CREATE_ARTIST', 'Artist', newArtist._id.toString(), req.ip, {
      name: newArtist.name,
      stageName: newArtist.stageName,
    });

    res.status(201).json({
      status: 'success',
      data: { artist: newArtist },
    });
  } catch (error: any) {
    // PRODUCTION GRADE: Handle Duplicate Key Errors (E11000)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || 'record';
      const value = error.keyValue ? error.keyValue[field] : 'this value';
      return res.status(400).json({
        status: 'fail',
        message: `Duplicate Error: An artist with this ${field} ("${value}") already exists. Please use a unique Stage Name.`,
      });
    }

    console.error('ARTIST CREATE ERROR:', {
      message: error.message,
      errors: error.errors,
      body: req.body,
    });
    next(error);
  }
};

/**
 * 2. GET ARTISTS (READ LIST)
 */
export const getArtists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      tier,
      status,
      featured,
      showOnHome,
      includeDeleted = 'false',
    } = req.query;

    const query: any = {};

    if (includeDeleted !== 'true') query.isDeleted = false;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { stageName: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) query.categoryId = category;
    if (tier) query.premiumTier = tier;
    if (status) query.verificationStatus = status;
    if (featured === 'true') query.isFeatured = true;
    if (showOnHome === 'true') query.showOnHome = true;

    const artists = await ArtistModel.find(query)
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await ArtistModel.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: artists.length,
      total,
      data: { artists },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 3. GET SINGLE ARTIST
 */
export const getArtist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

    const query = isObjectId ? { _id: id } : { slug: id };

    const artist = await ArtistModel.findOne(query)
      .populate('categoryId', 'name')
      .populate('createdBy', 'email fullName');

    if (!artist) throw new AppError('Artist not found', 404);

    res.status(200).json({
      status: 'success',
      data: { artist },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 4. UPDATE ARTIST
 */
export const updateArtist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adminId = getAdminId(req);
    const { id } = req.params;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    const query = isObjectId ? { _id: id } : { slug: id };

    const artist = await ArtistModel.findOne(query);
    if (!artist) throw new AppError('Artist not found', 404);

    const oldState = artist.toObject();

    // Sanitize numeric fields in updates too
    if (req.body.yearsOfExperience !== undefined)
      req.body.yearsOfExperience = Number(req.body.yearsOfExperience) || 0;
    if (req.body.eventsCompleted !== undefined)
      req.body.eventsCompleted = Number(req.body.eventsCompleted) || 0;
    if (req.body.priceRange) {
      req.body.priceRange.min = Number(req.body.priceRange.min) || 0;
      req.body.priceRange.max = Number(req.body.priceRange.max) || 0;
    }

    // If category changed or updating for the first time, denormalize category data
    if (req.body.categoryId && req.body.categoryId !== artist.categoryId.toString()) {
      const category = await ArtistCategoryModel.findById(req.body.categoryId);
      if (!category) throw new AppError('Selected category does not exist', 400);
      req.body.categoryName = category.name;
      req.body.categorySlug = category.slug;
    }

    Object.assign(artist, req.body);

    if (artist.isPublished || artist.showOnHome || artist.isFeatured) {
      assertArtistHasPublishableMedia(artist);
    }

    artist.updatedBy = adminId as any;
    await artist.save();

    await logAdminActivity(adminId, 'UPDATE_ARTIST', 'Artist', artist._id.toString(), req.ip, {
      before: oldState,
      after: artist.toObject(),
    });

    res.status(200).json({
      status: 'success',
      data: { artist },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 4.1 UPDATE ARTIST STEP (Enterprise Multi-Step Flow)
 * PUT /admin/artists/:id/step
 */
export const updateArtistStep = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adminId = getAdminId(req);
    const { id } = req.params;
    const { step, data } = req.body;

    const artist = await ArtistModel.findById(id);
    if (!artist) throw new AppError('Artist not found', 404);

    // 1. Strict Validation per Step (KYC Level)
    if (step === 'identity') {
      if (!data.name && !data.fullName) throw new AppError('Full name required', 400);
      if (!data.stageName) throw new AppError('Stage name required', 400);
      if (!data.categoryId) throw new AppError('Category required', 400);
      if (!data.city) throw new AppError('City required', 400);
    } else if (step === 'profile') {
      const shortBio = data.shortBio || '';
      const longBio = data.longBio || '';
      if (shortBio.length < 10) throw new AppError('Short Bio too short', 400);
      if (longBio.length < 50) throw new AppError('Story must be at least 50 characters', 400);
    } else if (step === 'media') {
      if (!data.profilePicture && !data.profileImage)
        throw new AppError('Profile image required', 400);
    } else if (step === 'commercial') {
      if (data.priceRange?.min === undefined || data.priceRange.min === '')
        throw new AppError('Price floor required', 400);
      if (data.priceRange?.max === undefined || data.priceRange.max === '')
        throw new AppError('Price ceiling required', 400);
      if (Number(data.priceRange.max) < Number(data.priceRange.min))
        throw new AppError('Price ceiling cannot be less than floor', 400);
    }

    // 2. Map Frontend Field Names to DB Field Names
    const updateData: any = { ...data };
    if (data.name === undefined && data.fullName) updateData.name = data.fullName;
    if (data.profilePicture) updateData.profileImage = data.profilePicture;
    if (data.portfolioGallery) updateData.gallery = data.portfolioGallery;
    if (data.youtubeLinks) updateData.videoLinks = data.youtubeLinks;
    if (data.brochure) updateData.brochureFile = data.brochure;

    // Cast numbers
    if (data.priceRange) {
      updateData.priceRange = {
        min: Number(data.priceRange.min) || 0,
        max: Number(data.priceRange.max) || 0,
      };
    }

    // 3. Perform Update
    Object.assign(artist, updateData);

    // 4. Update Step Status
    if (artist.stepStatus && (artist.stepStatus as any)[step]) {
      (artist.stepStatus as any)[step].completed = true;
      (artist.stepStatus as any)[step].updatedAt = new Date();
    }

    // Advance currentStep if we just finished it
    const steps = ['identity', 'profile', 'media', 'commercial', 'review'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex !== -1 && currentIndex < steps.length - 1) {
      artist.currentStep = steps[currentIndex + 1];
    }

    artist.updatedBy = adminId as any;
    await artist.save();

    res.status(200).json({
      status: 'success',
      data: {
        artist,
        currentStep: artist.currentStep,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 5. DELETE ARTIST (SOFT)
 */
export const deleteArtist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adminId = getAdminId(req);
    const artist = await ArtistModel.findById(req.params.id);
    if (!artist) throw new AppError('Artist not found', 404);

    artist.isDeleted = true;
    artist.deletedAt = new Date();
    artist.deletedBy = adminId as any;
    await artist.save();

    await logAdminActivity(adminId, 'DELETE_ARTIST', 'Artist', artist._id.toString(), req.ip);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * 6. RESTORE ARTIST
 */
export const restoreArtist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adminId = getAdminId(req);
    const artist = await ArtistModel.findById(req.params.id);
    if (!artist) throw new AppError('Artist not found', 404);

    artist.isDeleted = false;
    artist.deletedAt = undefined;
    artist.deletedBy = undefined;
    await artist.save();

    await logAdminActivity(adminId, 'RESTORE_ARTIST', 'Artist', artist._id.toString(), req.ip);

    res.status(200).json({
      status: 'success',
      data: { artist },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 7. GET ADMIN DASHBOARD STATS
 */
export const getAdminStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalArtists = await ArtistModel.countDocuments({ isDeleted: false });
    const pendingVerifications = await ArtistModel.countDocuments({
      verificationStatus: 'PENDING_REVIEW',
      isDeleted: false,
    });
    const featuredArtists = await ArtistModel.countDocuments({
      isFeatured: true,
      isDeleted: false,
    });
    const publishedArtists = await ArtistModel.countDocuments({
      isPublished: true,
      isDeleted: false,
    });
    const homepageFeaturedArtists = await ArtistModel.countDocuments({
      showOnHome: true,
      isDeleted: false,
    });
    const totalStaff = await AdminModel.countDocuments({
      role: { $in: ['SUPER_ADMIN', 'SUB_ADMIN', 'INTERNAL_OPS', 'FINANCE', 'SUPPORT'] },
    });

    // Recent Activity
    const recentLogs = await AdminActivityLogModel.find()
      .populate('adminId', 'email fullName')
      .sort({ timestamp: -1 })
      .limit(10);

    res.status(200).json({
      status: 'success',
      data: {
        kpis: {
          totalArtists,
          pendingVerifications,
          featuredArtists,
          publishedArtists,
          homepageFeaturedArtists,
          totalStaff,
        },
        recentActivity: recentLogs,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 8. PROVISION STAFF (Super Admin Only)
 */
export const provisionStaff = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, role, fullName, department, roleId, departmentId, password } = req.body;
    const adminId = getAdminId(req);
    const adminRole = req.user!.role;

    if (adminRole !== 'SUPER_ADMIN') {
      throw new AppError('Only Super Admins can provision staff', 403);
    }

    const existing = await AdminModel.findOne({ email });
    if (existing) throw new AppError('Email already in use', 400);

    if (!isValidObjectId(roleId) || !isValidObjectId(departmentId)) {
      throw new AppError('Invalid role or department selected', 400);
    }

    const tempPassword = password || generateTempPassword();

    const newUser = await AdminModel.create({
      email,
      password: tempPassword,
      role: role || 'INTERNAL_OPS',
      roleId,
      departmentId,
      fullName,
      permissions: [],
      isActive: true,
      mustChangePassword: true,
      createdBy: adminId,
    });

    await logAdminActivity(adminId, 'PROVISION_STAFF', 'User', newUser._id.toString(), req.ip, {
      email,
      role,
      fullName,
      department,
      roleId,
      departmentId,
    });

    res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: newUser._id,
          email: newUser.email,
          role: newUser.role,
          roleId: newUser.roleId,
          departmentId: newUser.departmentId,
        },
        tempPassword,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getSettingsPermissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ status: 'success', data: { permissions: ALL_PERMISSIONS } });
  } catch (error) {
    next(error);
  }
};

export const seedDefaultRoles = async () => {
  await Promise.all(
    DEFAULT_ROLES.map((role) =>
      RoleModel.updateOne({ name: role.name }, { $setOnInsert: role }, { upsert: true }),
    ),
  );
};

export const getSettingsRoles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await seedDefaultRoles();
    const roles = await RoleModel.find().sort({ name: 1 });
    res.status(200).json({ status: 'success', data: { roles } });
  } catch (error) {
    next(error);
  }
};

export const createSettingsRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, permissions = [] } = req.body;
    if (!name) throw new AppError('Role name is required', 400);
    ensureValidPermissions(permissions);

    const role = await RoleModel.create({ name, roleName: name, permissions });
    await logAdminActivity(getAdminId(req), 'CREATE_ROLE', 'Role', role._id.toString(), req.ip, {
      name,
      permissions,
    });

    res.status(201).json({ status: 'success', data: { role } });
  } catch (error: any) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'Role with this name already exists' });
    }
    next(error);
  }
};

export const getSettingsDepartments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const departments = await DepartmentModel.find({ isActive: true }).sort({ name: 1 });
    res.status(200).json({ status: 'success', data: { departments } });
  } catch (error) {
    next(error);
  }
};

export const createSettingsDepartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description } = req.body;
    if (!name) throw new AppError('Department name is required', 400);

    const department = await DepartmentModel.create({ name, description });
    await logAdminActivity(
      getAdminId(req),
      'CREATE_DEPARTMENT',
      'Department',
      department._id.toString(),
      req.ip,
      { name },
    );

    res.status(201).json({ status: 'success', data: { department } });
  } catch (error: any) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'Department with this name already exists' });
    }
    next(error);
  }
};

export const getSettingsUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await AdminModel.find()
      .populate('roleId', 'name roleName permissions')
      .populate('departmentId', 'name description')
      .sort({ createdAt: -1 });

    res.status(200).json({ status: 'success', data: { users } });
  } catch (error) {
    next(error);
  }
};

export const createSettingsUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, fullName, email, password, roleId, departmentId } = req.body;
    if (!email || !password || !(name || fullName)) {
      throw new AppError('Name, email and password are required', 400);
    }
    if (!isValidObjectId(roleId) || !isValidObjectId(departmentId)) {
      throw new AppError('Invalid role or department selected', 400);
    }

    const role = roleId ? await RoleModel.findById(roleId) : null;
    if (roleId && !role) throw new AppError('Selected role does not exist', 400);
    if (departmentId && !(await DepartmentModel.exists({ _id: departmentId }))) {
      throw new AppError('Selected department does not exist', 400);
    }

    const user = await AdminModel.create({
      fullName: fullName || name,
      email,
      password,
      role: 'INTERNAL_OPS',
      roleId,
      departmentId,
      isActive: true,
      mustChangePassword: false,
      createdBy: getAdminId(req),
    });

    await logAdminActivity(getAdminId(req), 'CREATE_USER', 'User', user._id.toString(), req.ip, {
      email,
      name: user.fullName,
      roleId,
      departmentId,
    });

    const savedUser = await AdminModel.findById(user._id)
      .populate('roleId', 'name roleName permissions')
      .populate('departmentId', 'name description');

    res.status(201).json({ status: 'success', data: { user: savedUser } });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ status: 'fail', message: 'Email already in use' });
    }
    next(error);
  }
};

export const updateSettingsUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, fullName, password } = req.body;

    const user = await AdminModel.findById(id).select('+password');
    if (!user) throw new AppError('User not found', 404);

    if (fullName || name) user.fullName = fullName || name;
    if (password) {
      user.password = password;
      user.mustChangePassword = false;
    }

    await user.save();
    await logAdminActivity(getAdminId(req), 'USER_UPDATED', 'User', user._id.toString(), req.ip, {
      name: user.fullName,
    });

    const updatedUser = await AdminModel.findById(id)
      .populate('roleId', 'name roleName permissions')
      .populate('departmentId', 'name description');

    res.status(200).json({ status: 'success', data: { user: updatedUser } });
  } catch (error) {
    next(error);
  }
};

/**
 * 9. CATEGORY MANAGEMENT
 */
export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await ArtistCategoryModel.find({ isActive: true })
      .populate('parentCategoryId', 'name')
      .sort({ sortOrder: 1, name: 1 });
    res.status(200).json({ status: 'success', data: { categories } });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, slug } = req.body;
    const adminId = getAdminId(req);

    const generatedSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const existing = await ArtistCategoryModel.findOne({
      $or: [{ name }, { slug: generatedSlug }],
    });

    if (existing) {
      throw new AppError('Category with this name or slug already exists', 400);
    }

    const category = await ArtistCategoryModel.create({
      ...req.body,
      slug: generatedSlug,
      createdBy: adminId,
    });

    await logAdminActivity(
      adminId,
      'CREATE_CATEGORY',
      'Category',
      category._id.toString(),
      req.ip,
      { name: category.name },
    );
    res.status(201).json({ status: 'success', data: { category } });
  } catch (error: any) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'Category with this name or slug already exists' });
    }
    next(error);
  }
};

export const uploadCategoryImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file)
      throw new AppError('No file uploaded. Ensure field name is "categoryImage".', 400);
    const imageUrl = `/uploads/categories/${req.file.filename}`;
    res.status(200).json({ status: 'success', data: { url: imageUrl } });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await ArtistCategoryModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!category) throw new AppError('Category not found', 404);
    await logAdminActivity(
      getAdminId(req),
      'UPDATE_CATEGORY',
      'Category',
      category._id.toString(),
      req.ip,
      { name: category.name },
    );
    res.status(200).json({ status: 'success', data: { category } });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await ArtistCategoryModel.findByIdAndDelete(req.params.id);
    if (!category) throw new AppError('Category not found', 404);
    await logAdminActivity(getAdminId(req), 'DELETE_CATEGORY', 'Category', req.params.id, req.ip);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * 10. VERIFICATION QUEUE
 */
export const getVerificationQueue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queue = await ArtistModel.find({ verificationStatus: 'PENDING_REVIEW' })
      .populate('categoryId', 'name')
      .sort({ updatedAt: 1 });
    res.status(200).json({ status: 'success', results: queue.length, data: { artists: queue } });
  } catch (error) {
    next(error);
  }
};

export const reviewArtist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, adminNotes, isPublished, showOnHome } = req.body;
    const updateData: any = { verificationStatus: status, adminNotes };

    if (isPublished !== undefined) updateData.isPublished = isPublished;
    if (showOnHome !== undefined) updateData.showOnHome = showOnHome;

    // Auto-publish if status is set to PUBLISHED
    if (status === 'PUBLISHED') updateData.isPublished = true;

    // Safety check: if unpublishing, also remove from homepage
    if (updateData.isPublished === false) {
      updateData.showOnHome = false;
    }

    const existingArtist = await ArtistModel.findById(req.params.id);
    if (!existingArtist) throw new AppError('Artist not found', 404);

    Object.assign(existingArtist, updateData);
    if (existingArtist.isPublished || existingArtist.showOnHome || existingArtist.isFeatured) {
      assertArtistHasPublishableMedia(existingArtist);
    }

    const artist = await existingArtist.save();
    if (!artist) throw new AppError('Artist not found', 404);

    await logAdminActivity(
      getAdminId(req),
      'REVIEW_ARTIST',
      'Artist',
      artist._id.toString(),
      req.ip,
      { status, adminNotes, isPublished, showOnHome },
    );

    res.status(200).json({ status: 'success', data: { artist } });
  } catch (error) {
    next(error);
  }
};

/**
 * 11. FEATURED MANAGEMENT
 */
export const toggleFeatured = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const artist = await ArtistModel.findById(req.params.id);
    if (!artist) throw new AppError('Artist not found', 404);

    if (!artist.isFeatured) {
      assertArtistHasPublishableMedia(artist);
    }

    artist.isFeatured = !artist.isFeatured;
    await artist.save();

    await logAdminActivity(
      getAdminId(req),
      'TOGGLE_FEATURED',
      'Artist',
      artist._id.toString(),
      req.ip,
      { isFeatured: artist.isFeatured },
    );

    res.status(200).json({ status: 'success', data: { artist } });
  } catch (error) {
    next(error);
  }
};

export const toggleHome = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const artist = await ArtistModel.findById(req.params.id);
    if (!artist) throw new AppError('Artist not found', 404);

    // Rule: showOnHome = true only if published = true
    if (!artist.isPublished && !artist.showOnHome) {
      throw new AppError('Cannot show unpublished artist on homepage', 400);
    }

    if (!artist.showOnHome) {
      assertArtistHasPublishableMedia(artist);
    }

    artist.showOnHome = !artist.showOnHome;
    await artist.save();

    await logAdminActivity(
      getAdminId(req),
      'TOGGLE_HOME',
      'Artist',
      artist._id.toString(),
      req.ip,
      { showOnHome: artist.showOnHome },
    );

    res.status(200).json({ status: 'success', data: { artist } });
  } catch (error) {
    next(error);
  }
};

/**
 * 12. MEDIA UPLOAD
 * POST /admin/artists/upload-profile — field: profileImage
 * POST /admin/artists/upload-gallery — field: galleryImages (array)
 */
export const uploadProfileImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file)
      throw new AppError('No file uploaded. Ensure field name is "profileImage".', 400);

    const imageUrl = `/uploads/artists/profile/${req.file.filename}`;

    res.status(200).json({
      status: 'success',
      data: { url: imageUrl },
    });
  } catch (error) {
    next(error);
  }
};

export const uploadGalleryImages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0)
      throw new AppError('No files uploaded. Ensure field name is "galleryImages".', 400);

    const urls = files.map((file) => `/uploads/artists/gallery/${file.filename}`);

    res.status(200).json({
      status: 'success',
      data: { urls },
    });
  } catch (error) {
    next(error);
  }
};

export const uploadBrochure = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) throw new AppError('No file uploaded. Ensure field name is "brochure".', 400);

    const fileUrl = `/uploads/artists/brochures/${req.file.filename}`;

    res.status(200).json({
      status: 'success',
      data: { url: fileUrl },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 13. AUDIT LOGS
 */
export const getAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 50, action, admin } = req.query;
    const query: any = {};
    if (action) query.action = action;
    if (admin) query.adminId = admin;

    const logs = await AdminActivityLogModel.find(query)
      .populate('adminId', 'email fullName')
      .sort({ timestamp: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await AdminActivityLogModel.countDocuments(query);

    res.status(200).json({
      status: 'success',
      total,
      data: { logs },
    });
  } catch (error) {
    next(error);
  }
};
