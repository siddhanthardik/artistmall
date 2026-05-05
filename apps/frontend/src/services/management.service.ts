import { api } from './api';

export const ManagementService = {
  // Get all artists managed by this company
  getMyRoster: async () => {
    const response = await api.get('/artists/me');
    return response.data.data;
  },

  // Create a new artist profile
  addArtist: async (artistData: Record<string, unknown>) => {
    const response = await api.post('/artists', artistData);
    return response.data.data;
  },

  // Update artist profile
  updateArtist: async (id: string, artistData: Record<string, unknown>) => {
    const response = await api.patch(`/artists/${id}`, artistData);
    return response.data.data;
  },

  // Get all booking requests incoming for their roster
  getIncomingRequests: async () => {
    const response = await api.get('/bookings/incoming');
    return response.data.data;
  },
};
