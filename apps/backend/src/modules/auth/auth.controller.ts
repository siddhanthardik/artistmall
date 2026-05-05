import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

const setTokenCookie = (res: Response, token: string) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const { user, tokens } = await AuthService.login(email, password);

    setTokenCookie(res, tokens.refreshToken);

    res.status(200).json({
      status: 'success',
      data: {
        user,
        accessToken: tokens.accessToken,
      },
    });
  } catch (error) {
    console.error('LOGIN ERROR:', error);
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const tokens = await AuthService.refreshToken(refreshToken);

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

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user) {
      await AuthService.logout(req.user.userId);
    }

    res.cookie('refreshToken', 'loggedout', {
      httpOnly: true,
      expires: new Date(Date.now() + 10 * 1000), // Expire quickly
    });

    res.status(200).json({ status: 'success' });
  } catch (error) {
    next(error);
  }
};
export const forceResetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { newPassword } = req.body;
    const userId = req.user!.userId;

    await AuthService.forceResetPassword(userId, newPassword);

    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully. Please log in with your new password.',
    });
  } catch (error) {
    next(error);
  }
};
