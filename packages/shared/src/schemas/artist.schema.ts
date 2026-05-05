import { z } from 'zod';

export const ArtistCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  slug: z.string(),
  parentCategoryId: z.string().optional(),
});

export const ArtistStatusEnum = z.enum([
  'DRAFT',
  'PENDING_APPROVAL',
  'APPROVED',
  'REJECTED',
  'HIDDEN',
  'ARCHIVED',
]);

export const CelebrityLevelEnum = z.enum(['A_LIST', 'B_LIST', 'C_LIST', 'RISING']);

export const ArtistSchema = z.object({
  id: z.string().optional(),
  managementCompanyId: z.string(),

  // Core Profile
  name: z.string().min(2),
  stageName: z.string().optional(),
  categoryId: z.string(),
  subCategoryId: z.string().optional(),
  cityId: z.string(),
  languages: z.array(z.string()).default([]),
  bio: z.string().optional(),

  // Financials
  priceRange: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
  }),
  minimumBookingValue: z.number().min(0).default(0),

  // Logistics
  performanceDurationMins: z.number().min(0).optional(),
  travelRequirements: z.string().optional(),
  hospitalityRider: z.string().optional(),

  // Proof & Portfolio (Simplified for schema, handled via relations/arrays in DB)
  socialProof: z
    .array(
      z.object({
        type: z.enum(['TESTIMONIAL', 'BRAND_COLLAB']),
        title: z.string(),
        description: z.string().optional(),
        url: z.string().optional(),
      }),
    )
    .default([]),

  // System Fields
  status: ArtistStatusEnum.default('DRAFT'),
  isVerified: z.boolean().default(false),
  celebrityLevel: CelebrityLevelEnum.default('RISING'),
  rating: z.number().min(0).max(5).default(0),
  profileImage: z.string().optional(),
  gallery: z.array(z.string()).default([]),
});

export const ArtistMediaSchema = z.object({
  id: z.string().optional(),
  artistId: z.string(),
  mediaType: z.enum(['IMAGE', 'VIDEO', 'YOUTUBE_LINK', 'TECHNICAL_RIDER_PDF']),
  url: z.string().url(),
  isPrimary: z.boolean().default(false),
});

export type ArtistCategoryType = z.infer<typeof ArtistCategorySchema>;
export type ArtistType = z.infer<typeof ArtistSchema>;
export type ArtistMediaType = z.infer<typeof ArtistMediaSchema>;
