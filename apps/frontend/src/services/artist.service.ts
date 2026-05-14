import { api } from './api';

export interface SearchFilters {
  q?: string;
  categoryId?: string;
  categoryName?: string;
  cityId?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  budget?: string;
  celebrityLevel?: string;
  isVerified?: boolean;
  isFeatured?: boolean;
  page?: number;
  limit?: number;
}

export const ArtistService = {
  searchArtists: async (filters: SearchFilters) => {
    // Clean up undefined values
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v != null && v !== ''),
    );

    const response = await api.get('/artists/search', { params: cleanedFilters });
    return response.data; // { status: 'success', data: [...], meta: {...} }
  },

  getTrendingArtists: async (limit: number = 10) => {
    const response = await api.get('/artists/trending', { params: { limit } });
    return response.data;
  },

  getFeaturedArtists: async (limit: number = 10) => {
    const response = await api.get('/artists/featured', { params: { limit } });
    return response.data;
  },

  getArtistDetail: async (id: string) => {
    const response = await api.get(`/artists/${id}`);
    return response.data;
  },

  getHeroBanners: async () => {
    const response = await api.get('/hero-banners');
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/artists/categories');
    return response.data;
  },
};
