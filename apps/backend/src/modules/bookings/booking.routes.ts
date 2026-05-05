import { Router } from 'express';
import * as BookingController from './booking.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';

const router = Router();

router.use(requireAuth);

// Demand Side (Booking Company)
router.post('/draft', requireRole('BOOKING_COMPANY'), BookingController.createDraft);
router.post('/:id/submit', requireRole('BOOKING_COMPANY'), BookingController.submitRequest);

// Negotiation (Both Supply and Demand)
router.post(
  '/:id/negotiate',
  requireRole('BOOKING_COMPANY', 'MANAGEMENT_COMPANY'),
  BookingController.negotiate,
);

// Supply Side (Management Company)
router.post('/:id/accept', requireRole('MANAGEMENT_COMPANY'), BookingController.acceptByManagement);

// Payment & Completion Simulation
router.post('/:id/pay-advance', requireRole('BOOKING_COMPANY'), BookingController.payAdvance);
router.post(
  '/:id/complete',
  requireRole('SUPER_ADMIN', 'SUB_ADMIN', 'INTERNAL_OPS'),
  BookingController.completeBooking,
);

// Admin
router.post('/:id/override', requireRole('SUPER_ADMIN'), BookingController.adminOverrideStatus);

export const bookingRoutes = router;
