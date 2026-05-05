import { Router } from 'express';
import * as CompanyController from './company.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';

const router = Router();

// Apply auth middleware to all routes below
router.use(requireAuth);

// Management Company (Supply Side)
router.post('/management/profile', requireRole('MANAGEMENT_COMPANY'), CompanyController.updateManagementProfile);
router.post('/management/kyc', requireRole('MANAGEMENT_COMPANY'), CompanyController.submitManagementKyc);

// Booking Company (Demand Side)
router.post('/booking/profile', requireRole('BOOKING_COMPANY'), CompanyController.updateBookingProfile);
router.post('/booking/kyc', requireRole('BOOKING_COMPANY'), CompanyController.submitBookingKyc);

// Admin Routes for Verification
router.post(
  '/admin/verify', 
  requireRole('SUPER_ADMIN', 'SUB_ADMIN'), 
  CompanyController.adminVerifyCompany
);

export const companyRoutes = router;
