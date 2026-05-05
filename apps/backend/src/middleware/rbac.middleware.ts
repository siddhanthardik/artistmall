import { Request, Response, NextFunction } from 'express';
import { AppError } from '../core/errors';

/**
 * Middleware to enforce Role Based Access Control (RBAC).
 * Must be used AFTER `requireAuth` middleware.
 * 
 * @param allowedRoles Array of role names that are permitted to access the route.
 */
export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required before checking roles.', 401));
    }

    if (req.user.role === 'SUPER_ADMIN') return next();

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }

    next();
  };
};
