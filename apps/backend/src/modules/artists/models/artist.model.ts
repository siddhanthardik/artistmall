import mongoose, { Schema, Document } from 'mongoose';
import { auditPlugin, BaseSchemaOptions } from '../../../core/base.schema';

export type PremiumTier = 'STANDARD' | 'FEATURED' | 'SILVER' | 'GOLD' | 'PREMIUM' | 'EXCLUSIVE';
export type AvailabilityStatus =
  | 'AVAILABLE'
  | 'TENTATIVE'
  | 'BLOCKED'
  | 'TOURING'
  | 'SEASONAL_HOLD';
export type VerificationStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'NEEDS_UPDATE'
  | 'PUBLISHED';

export interface IArtist extends Document {
  name: string;
  stageName: string;
  categoryId: mongoose.Types.ObjectId;
  categoryName: string;
  categorySlug: string;
  slug: string;
  subCategoryId?: mongoose.Types.ObjectId;

  // Location
  city: string;
  state: string;
  country: string;

  languages: string[];
  performanceTypes: string[]; // e.g. Virtual, Live, Unplugged, Corporate

  shortBio: string;
  longBio: string;
  bookingTypes: string[]; // Local Event, Corporate, Wedding, etc.
  pricingNotes?: string;
  premiumHighlights: string[];
  trustIndicators: string[];

  // Media
  profileImage: string;
  gallery: string[];
  videoLinks: string[];
  brochureFile?: string;

  // Social
  socialLinks: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    twitter?: string;
    website?: string;
  };

  // Pricing
  startingPrice?: number;
  priceRange: { min: number; max: number };

  // Operational
  availabilityStatus: AvailabilityStatus;
  premiumTier: PremiumTier;
  isFeatured: boolean;

  // Internal Admin
  internalNotes?: string;
  verificationStatus: VerificationStatus;
  isActive: boolean;
  showOnHome: boolean;
  isPublished: boolean;

  createdBy: mongoose.Types.ObjectId; // Reference to Admin (Staff)
  updatedBy?: mongoose.Types.ObjectId;
  isDeleted?: boolean;
  deletedAt?: Date;
  deletedBy?: mongoose.Types.ObjectId;

  // Enterprise Multi-Step Flow
  currentStep: string;
  stepStatus: {
    identity: { completed: boolean; updatedAt: Date };
    profile: { completed: boolean; updatedAt: Date };
    media: { completed: boolean; updatedAt: Date };
    commercial: { completed: boolean; updatedAt: Date };
  };
}

const artistSchema = new Schema<IArtist>(
  {
    name: { type: String, required: true },
    stageName: { type: String, required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'ArtistCategory', required: true },
    categoryName: { type: String, required: true },
    categorySlug: { type: String, required: true, index: true },
    slug: { type: String, unique: true, sparse: true },
    subCategoryId: { type: Schema.Types.ObjectId, ref: 'ArtistCategory' },

    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, default: 'India' },

    languages: [{ type: String }],
    performanceTypes: [{ type: String }],

    shortBio: { type: String, required: true },
    longBio: { type: String, required: true },
    bookingTypes: [{ type: String }],
    pricingNotes: { type: String },
    premiumHighlights: [{ type: String }],
    trustIndicators: [{ type: String }],

    profileImage: { type: String },
    gallery: [{ type: String }],
    videoLinks: [{ type: String }],
    brochureFile: { type: String },

    socialLinks: {
      instagram: String,
      facebook: String,
      youtube: String,
      twitter: String,
      website: String,
    },

    startingPrice: { type: Number, default: 0 },
    priceRange: {
      min: { type: Number, default: 0, min: 0 },
      max: { type: Number, default: 0, min: 0 },
    },

    availabilityStatus: {
      type: String,
      enum: ['AVAILABLE', 'TENTATIVE', 'BLOCKED', 'TOURING', 'SEASONAL_HOLD'],
      default: 'AVAILABLE',
    },
    premiumTier: {
      type: String,
      enum: ['STANDARD', 'FEATURED', 'SILVER', 'GOLD', 'PREMIUM', 'EXCLUSIVE'],
      default: 'STANDARD',
    },
    isFeatured: { type: Boolean, default: false },
    showOnHome: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },

    internalNotes: { type: String },
    verificationStatus: {
      type: String,
      enum: ['DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'NEEDS_UPDATE', 'PUBLISHED'],
      default: 'DRAFT',
    },
    isActive: { type: Boolean, default: true },

    createdBy: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },

    // Enterprise Onboarding Stats
    currentStep: { type: String, default: 'identity' },
    stepStatus: {
      identity: {
        completed: { type: Boolean, default: false },
        updatedAt: { type: Date, default: Date.now },
      },
      profile: {
        completed: { type: Boolean, default: false },
        updatedAt: { type: Date, default: Date.now },
      },
      media: {
        completed: { type: Boolean, default: false },
        updatedAt: { type: Date, default: Date.now },
      },
      commercial: {
        completed: { type: Boolean, default: false },
        updatedAt: { type: Date, default: Date.now },
      },
    },
  },
  BaseSchemaOptions,
);

artistSchema.plugin(auditPlugin);

// Compound Indexes for High-Density Admin Operations
artistSchema.index({ verificationStatus: 1, isActive: 1, isDeleted: 1 });
artistSchema.index({ categorySlug: 1, premiumTier: 1 });
artistSchema.index({ city: 1, state: 1 });
artistSchema.index({ name: 'text', stageName: 'text', shortBio: 'text' });
artistSchema.index({ startingPrice: 1 });
artistSchema.index({ showOnHome: 1, isPublished: 1 });

// Pre-save hook to generate slug
artistSchema.pre('save', async function (next) {
  const self = this as IArtist;

  // Generate slug if it's a new document or name/stageName changed
  if (self.isNew || self.isModified('stageName') || self.isModified('name')) {
    const baseSlug = (self.stageName || self.name)
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');

    let newSlug = baseSlug;
    let counter = 1;
    const model = self.constructor as mongoose.Model<IArtist>;

    // Collision detection loop
    while (true) {
      const existing = await model
        .findOne({ slug: newSlug, _id: { $ne: self._id } })
        .select('_id')
        .lean();
      if (!existing) break;
      newSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    self.slug = newSlug;
  }
  next();
});

export const ArtistModel = mongoose.model<IArtist>('Artist', artistSchema);
