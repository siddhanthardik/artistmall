import { z } from 'zod';

export const BookingStatusEnum = z.enum([
  'DRAFT',
  'REQUESTED',
  'NEGOTIATING',
  'ACCEPTED_BY_MGMT',
  'ADVANCE_PENDING',
  'CONFIRMED',
  'COMPLETED',
  'CANCELLED_BY_CLIENT',
  'CANCELLED_BY_MGMT',
  'REJECTED',
]);

export const BookingRequestSchema = z.object({
  id: z.string().optional(),
  bookingCompanyId: z.string(),
  artistId: z.string(),
  eventDate: z.date(),
  cityId: z.string(),
  eventTypeId: z.string().optional(),
  offeredBudget: z.number().min(0),
  status: BookingStatusEnum.default('DRAFT'),
});

export const BookingNegotiationSchema = z.object({
  id: z.string().optional(),
  bookingRequestId: z.string(),
  senderId: z.string(),
  message: z.string().optional(),
  proposedPrice: z.number().min(0),
  isCounterOffer: z.boolean().default(false),
});

export type BookingStatusType = z.infer<typeof BookingStatusEnum>;
export type BookingRequestType = z.infer<typeof BookingRequestSchema>;
export type BookingNegotiationType = z.infer<typeof BookingNegotiationSchema>;
