import { Router } from 'express';
import { login, refresh, logout, forceResetPassword } from './auth.controller';
import { requireAuth } from '../../middleware/auth.middleware';

const router = Router();

router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', requireAuth, logout);
router.post('/force-reset-password', requireAuth, forceResetPassword);

export const authRoutes = router;
