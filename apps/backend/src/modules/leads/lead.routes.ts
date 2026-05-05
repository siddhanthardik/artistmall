import { Router } from 'express';
import * as LeadController from './lead.controller';
import { protectAdmin, checkPermission } from '../../middleware/admin-auth.middleware';
import { PERMISSIONS } from '../admin/permissions';

const router = Router();

// Public route for frontend modal
router.post('/create', LeadController.createLead);

// Admin Routes
router.use(protectAdmin);
router.get('/', checkPermission(PERMISSIONS.LEAD_VIEW), LeadController.getLeads);
router.patch('/:id/status', checkPermission(PERMISSIONS.LEAD_UPDATE), LeadController.updateLeadStatus);
router.delete('/:id', checkPermission(PERMISSIONS.LEAD_UPDATE), LeadController.deleteLead);

export const leadRoutes = router;
