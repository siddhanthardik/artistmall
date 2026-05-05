import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt.util';
import { AppError } from '../core/errors';
import { UserModel } from '../modules/users/models/user.model';
import { AdminModel } from '../modules/admin/models/admin.model';

declare global {
  /* eslint-disable-next-line @typescript-eslint/no-namespace */
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;

    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    // Verify token
    const decoded = verifyAccessToken(token);

    const user = await UserModel.findById(decoded.userId);
    if (user && user.isActive) {
      req.user = {
        userId: user.id,
        role: user.role,
      };
      return next();
    }

    const admin = await AdminModel.findById(decoded.userId);
    if (admin && admin.isActive) {
      req.user = {
        userId: admin.id,
        role: admin.role,
      };
      return next();
    }

    return next(new AppError('Account no longer exists or has been deactivated.', 401));
  } catch (error) {
    return next(new AppError('Invalid or expired token. Please log in again.', 401));
  }
};
