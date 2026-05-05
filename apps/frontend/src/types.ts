import axios from 'axios';

export interface Artist {
  _id: string;
  name: string;
  stageName: string;
  slug: string;
  categoryId?: string | {
    _id: string;
    name: string;
  };
  categoryName: string;
  categorySlug: string;
  city: string;
  state: string;
  languages?: string[];
  performanceTypes?: string[];
  trustIndicators?: string[];
  premiumHighlights?: string[];
  bookingTypes?: string[];
  pricingNotes?: string;
  profileImage?: string;
  gallery: string[];
  videoLinks: string[];
  brochureFile?: string;
  startingPrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  rating?: number;
  isVerified?: boolean;
  isFeatured?: boolean;
  premiumTier?: 'STANDARD' | 'FEATURED' | 'SILVER' | 'GOLD' | 'PREMIUM' | 'EXCLUSIVE';
  shortBio: string;
  longBio?: string;
  verificationStatus: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'NEEDS_UPDATE' | 'PUBLISHED';
  yearsOfExperience?: number;
  isPublished: boolean;
  createdAt: string;
}

export interface Booking {
  _id: string;
  artistId: Artist;
  customerId: unknown; // Simplified
  eventDate: string;
  status: string;
  originalOffer: number;
  currentOffer: number;
  updatedAt: string;
  notes?: Array<{
    text: string;
    timestamp: string;
  }>;
}

export interface ApiResponse<T> {
  status: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

export const isAxiosError = axios.isAxiosError;
