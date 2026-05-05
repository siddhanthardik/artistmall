import { api } from './api';

// ─────────────────────────────────────────────────────────────────────────────
// Admin Service — all calls hit /api/v1/admin/*
// The axios interceptor in api.ts automatically attaches the Bearer token.
// ─────────────────────────────────────────────────────────────────────────────

export const AdminService = {
  // ── Dashboard ──────────────────────────────────────────────────────────────
  getAdminStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // ── Artists ─────────────────────────────────────────────────────────────────
  getArtists: async (params?: any) => {
    const response = await api.get('/admin/artists', { params });
    return response.data;
  },

  getArtist: async (id: string) => {
    const response = await api.get(`/admin/artists/${id}`);
    return response.data;
  },

  provisionArtist: async (data: any) => {
    const response = await api.post('/admin/artists', data);
    return response.data;
  },

  updateArtist: async (id: string, data: any) => {
    const response = await api.patch(`/admin/artists/${id}`, data);
    return response.data;
  },

  updateArtistStep: async (id: string, step: string, data: any) => {
    const response = await api.put(`/admin/artists/${id}/step`, { step, data });
    return response.data;
  },

  deleteArtist: async (id: string) => {
    const response = await api.delete(`/admin/artists/${id}`);
    return response.data;
  },

  restoreArtist: async (id: string) => {
    const response = await api.post(`/admin/artists/${id}/restore`);
    return response.data;
  },

  // ── Media Upload ────────────────────────────────────────────────────────────
  // Field name MUST be "profileImage" — matches upload.single('profileImage') in backend
  uploadProfileImage: async (formData: FormData) => {
    const response = await api.post('/admin/artists/upload-profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Field name MUST be "galleryImages" — matches upload.array('galleryImages', 10) in backend
  uploadGalleryImages: async (formData: FormData) => {
    const response = await api.post('/admin/artists/upload-gallery', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Field name MUST be "brochure" — matches uploadBrochure.single('brochure') in backend
  uploadBrochure: async (formData: FormData) => {
    const response = await api.post('/admin/artists/upload-brochure', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // ── Categories ──────────────────────────────────────────────────────────────
  getCategories: async () => {
    const response = await api.get('/admin/categories');
    return response.data;
  },

  createCategory: async (data: any) => {
    const response = await api.post('/admin/categories', data);
    return response.data;
  },

  updateCategory: async (id: string, data: any) => {
    const response = await api.patch(`/admin/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: string) => {
    const response = await api.delete(`/admin/categories/${id}`);
    return response.data;
  },

  uploadCategoryImage: async (formData: FormData) => {
    const response = await api.post('/admin/categories/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // ── Verification Queue ──────────────────────────────────────────────────────
  getVerificationQueue: async () => {
    const response = await api.get('/admin/verifications');
    return response.data;
  },

  getPendingVerifications: async () => {
    const response = await api.get('/admin/verifications');
    return response.data;
  },

  reviewArtist: async (
    id: string,
    data: { status: string; adminNotes: string; isPublished?: boolean; showOnHome?: boolean },
  ) => {
    const response = await api.patch(`/admin/artists/${id}/review`, data);
    return response.data;
  },

  // ── Featured & Home Toggles ───────────────────────────────────────────────────
  toggleFeatured: async (id: string, data?: { isFeatured: boolean; premiumTier: string }) => {
    const response = await api.patch(`/admin/artists/${id}/toggle-featured`, data);
    return response.data;
  },

  toggleHome: async (id: string) => {
    const response = await api.patch(`/admin/artists/${id}/toggle-home`);
    return response.data;
  },

  // ── Audit Logs ───────────────────────────────────────────────────────────────
  getAuditLogs: async (params?: any) => {
    const response = await api.get('/admin/audit-logs', { params });
    return response.data;
  },

  // ── Staff Provisioning ───────────────────────────────────────────────────────
  provisionStaff: async (data: any) => {
    const response = await api.post('/admin/staff', data);
    return response.data;
  },

  getSettingsPermissions: async () => {
    const response = await api.get('/admin/settings/permissions');
    return response.data;
  },

  getSettingsUsers: async () => {
    const response = await api.get('/admin/settings/users');
    return response.data;
  },

  createSettingsUser: async (data: any) => {
    const response = await api.post('/admin/settings/users', data);
    return response.data;
  },

  updateSettingsUser: async (id: string, data: any) => {
    const response = await api.patch(`/admin/settings/users/${id}`, data);
    return response.data;
  },

  getSettingsRoles: async () => {
    const response = await api.get('/admin/settings/roles');
    return response.data;
  },

  createSettingsRole: async (data: any) => {
    const response = await api.post('/admin/settings/roles', data);
    return response.data;
  },

  getSettingsDepartments: async () => {
    const response = await api.get('/admin/settings/departments');
    return response.data;
  },

  createSettingsDepartment: async (data: any) => {
    const response = await api.post('/admin/settings/departments', data);
    return response.data;
  },

  // ── Hero Banners ─────────────────────────────────────────────────────────────
  getHeroBanners: async () => {
    const response = await api.get('/hero-banners/admin');
    return response.data;
  },

  createHeroBanner: async (data: any) => {
    const response = await api.post('/hero-banners/admin', data);
    return response.data;
  },

  updateHeroBanner: async (id: string, data: any) => {
    const response = await api.patch(`/hero-banners/admin/${id}`, data);
    return response.data;
  },

  deleteHeroBanner: async (id: string) => {
    const response = await api.delete(`/hero-banners/admin/${id}`);
    return response.data;
  },

  reorderHeroBanners: async (orders: { id: string; sortOrder: number }[]) => {
    const response = await api.patch('/hero-banners/admin/reorder', { orders });
    return response.data;
  },

  uploadHeroBannerImage: async (formData: FormData) => {
    const response = await api.post('/hero-banners/admin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
