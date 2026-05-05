import { api } from './api';

export const BookingService = {
  // Get all booking requests for the logged-in Booking Company
  getMyRequests: async () => {
    const response = await api.get('/bookings/me');
    return response.data.data;
  },

  // Get details of a single booking
  getBookingDetails: async (id: string) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data.data;
  },

  // Create a new booking request (from Discovery page)
  createRequest: async (artistId: string, eventDetails: Record<string, unknown>) => {
    const response = await api.post('/bookings', {
      artistId,
      ...eventDetails,
    });
    return response.data.data;
  },

  // Negotiate an existing booking (Deal Room)
  negotiate: async (
    id: string,
    action: 'ACCEPT' | 'REJECT' | 'COUNTER',
    counterAmount?: number,
    notes?: string,
  ) => {
    const response = await api.post(`/bookings/${id}/negotiate`, {
      action,
      counterAmount,
      notes,
    });
    return response.data.data;
  },
};
