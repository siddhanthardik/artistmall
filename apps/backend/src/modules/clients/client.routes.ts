import { Router } from 'express';
import * as ClientController from './client.controller';
import { authorizeAdmin, protectAdmin } from '../../middleware/admin-auth.middleware';
import { uploadClient } from '../../middleware/upload.middleware';

const router = Router();

// Public route for fetching active clients
router.get('/', ClientController.getClients);

// Admin routes
router.use(protectAdmin);
router.get('/admin', authorizeAdmin('SUPER_ADMIN', 'SUB_ADMIN', 'INTERNAL_OPS'), ClientController.getAdminClients);
router.post('/', authorizeAdmin('SUPER_ADMIN', 'SUB_ADMIN'), uploadClient.single('logo'), ClientController.createClient);
router.put('/:id', authorizeAdmin('SUPER_ADMIN', 'SUB_ADMIN'), uploadClient.single('logo'), ClientController.updateClient);
router.delete('/:id', authorizeAdmin('SUPER_ADMIN', 'SUB_ADMIN'), ClientController.deleteClient);

export const clientRoutes = router;
