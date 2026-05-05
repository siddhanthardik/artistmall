import { Request, Response, NextFunction } from 'express';
import { AdminAuthService } from './admin-auth.service';

const setTokenCookie = (res: Response, token: string) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('adminRefreshToken', token, {
    httpOnly: true,
    secure: isProd, // Must be true in prod for HTTPS
    sameSite: isProd ? 'none' : 'lax', // 'none' required for cross-site in prod if domains differ
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const ip = req.ip || 'unknown';
    const device = req.headers['user-agent'] || 'unknown';

    const { admin, tokens } = await AdminAuthService.login(email, password, ip, device);

    setTokenCookie(res, tokens.refreshToken);

    res.status(200).json({
      status: 'success',
      data: {
        user: admin,
        accessToken: tokens.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const adminRefresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.adminRefreshToken;
    const tokens = await AdminAuthService.refreshToken(refreshToken);

    setTokenCookie(res, tokens.refreshToken);

    res.status(200).json({
      status: 'success',
      data: {
        accessToken: tokens.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const adminLogout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adminId = req.user?.userId;
    const refreshToken = req.cookies.adminRefreshToken;

    if (adminId) {
      await AdminAuthService.logout(adminId, refreshToken);
    }

    res.clearCookie('adminRefreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
    });

    res.status(200).json({ status: 'success' });
  } catch (error) {
    next(error);
  }
};
