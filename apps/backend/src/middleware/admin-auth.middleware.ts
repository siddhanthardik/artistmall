import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.util';
import { AppError } from '../core/errors';
import { AdminModel } from '../modules/admin/models/admin.model';
import { RoleModel } from '../modules/users/models/role.model';

export const protectAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new AppError('Administrative access denied. Please log in.', 401);
    }

    // 1. Verify token
    const decoded = verifyAccessToken(token);

    // 2. Check if admin still exists and is active
    const admin = await AdminModel.findById(decoded.userId);
    if (!admin) {
      throw new AppError('Administrative user no longer exists.', 401);
    }

    if (!admin.isActive) {
      throw new AppError('Administrative account has been deactivated.', 403);
    }

    // 3. Attach admin to request
    req.user = {
      userId: admin.id,
      role: admin.role,
    };

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Session expired. Please log in again.', 401));
    }
    next(new AppError('Invalid administrative session.', 401));
  }
};

export const authorizeAdmin = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    if (req.user.role === 'SUPER_ADMIN' || roles.includes(req.user.role)) return next();
    return next(new AppError('You do not have permission to perform this action.', 403));
  };
};

export const checkPermission = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required before checking permissions.', 401));
      }

      const admin = await AdminModel.findById(req.user.userId).populate<{
        roleId?: { permissions: string[] };
      }>('roleId');
      if (!admin || !admin.isActive) {
        return next(new AppError('Administrative account is unavailable.', 401));
      }

      if (admin.isSuperAdmin || admin.role === 'SUPER_ADMIN') return next();

      const rolePermissions = admin.roleId?.permissions ?? [];
      const directPermissions = admin.permissions ?? [];
      if (![...rolePermissions, ...directPermissions].includes(permission)) {
        return next(new AppError('Access denied', 403));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validatePermissions = (permissions: string[]) => {
  const allowed = new Set([
    'artist.create',
    'artist.edit',
    'artist.delete',
    'artist.view',
    'lead.view',
    'lead.update',
    'settings.manage',
  ]);

  return permissions.every((permission) => allowed.has(permission));
};

export const resolveRolePermissions = async (roleId?: string) => {
  if (!roleId) return [];
  const role = await RoleModel.findById(roleId);
  return role?.permissions ?? [];
};
