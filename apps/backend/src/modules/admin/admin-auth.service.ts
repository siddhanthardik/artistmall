import { AdminModel } from './models/admin.model';
import { AdminSessionModel } from './models/admin-session.model';
import { generateTokens, verifyRefreshToken } from '../../utils/jwt.util';
import { AppError } from '../../core/errors';
import { hashToken } from '../../utils/crypto.util';

const buildAdminAuthPayload = (admin: any) => ({
  id: admin.id,
  email: admin.email,
  fullName: admin.fullName,
  role: admin.role,
  roleName: admin.roleId?.name,
  permissions: Array.from(
    new Set([...(admin.permissions ?? []), ...(admin.roleId?.permissions ?? [])]),
  ),
  isSuperAdmin: admin.isSuperAdmin || admin.role === 'SUPER_ADMIN',
  mustChangePassword: admin.mustChangePassword,
});

export class AdminAuthService {
  static async login(email: string, passwordString: string, ip: string, device: string) {
    // 1. Find admin with password selected
    const admin = await AdminModel.findOne({ email })
      .select('+password')
      .populate<{ roleId?: { permissions: string[]; name: string } }>('roleId');

    if (!admin) {
      throw new AppError('Invalid credentials', 401);
    }

    // 2. Check if locked
    if (admin.lockUntil && admin.lockUntil > new Date()) {
      throw new AppError(
        'Account temporarily locked due to multiple failed attempts. Try again later.',
        403,
      );
    }

    // 3. Validate Active
    if (!admin.isActive) {
      throw new AppError('Account is deactivated', 403);
    }

    // 4. Compare Password
    const isMatch = await admin.comparePassword(passwordString);

    if (!isMatch) {
      // Increment failed attempts
      admin.loginAttempts += 1;
      if (admin.loginAttempts >= 5) {
        admin.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 mins lock
      }

      await admin.save();
      throw new AppError('Invalid credentials', 401);
    }

    // 5. Success Flow
    admin.loginAttempts = 0;
    admin.lockUntil = undefined;
    admin.lastLogin = new Date();
    await admin.save();

    const tokens = generateTokens({
      userId: admin.id,
      role: admin.role,
    });

    // 6. Create dedicated session
    await AdminSessionModel.create({
      adminId: admin._id,
      refreshToken: hashToken(tokens.refreshToken),
      ipAddress: ip,
      userAgent: device,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return {
      admin: buildAdminAuthPayload(admin),
      tokens,
    };
  }

  static async refreshToken(oldRefreshToken: string) {
    if (!oldRefreshToken) throw new AppError('No refresh token provided', 401);

    // 1. Verify token signature
    let decoded;
    try {
      decoded = verifyRefreshToken(oldRefreshToken);
    } catch (err) {
      throw new AppError('Invalid or expired session. Please log in again.', 401);
    }

    // 2. Find the session
    const hashedRefreshToken = hashToken(oldRefreshToken);
    const session = await AdminSessionModel.findOne({ refreshToken: hashedRefreshToken });

    if (!session) {
      // Check if this token was recently rotated (Grace Period)
      // This handles concurrent refresh requests (e.g. multiple tabs or simultaneous API calls)
      const recentlyRotatedSession = await AdminSessionModel.findOne({
        adminId: decoded.userId,
        rotatedAt: { $gte: new Date(Date.now() - 30 * 1000) }, // 30 second grace period
      }).sort({ rotatedAt: -1 });

      if (recentlyRotatedSession) {
        const admin = await AdminModel.findById(recentlyRotatedSession.adminId).populate<{
          roleId?: { permissions: string[]; name: string };
        }>('roleId');
        if (!admin || !admin.isActive) {
          throw new AppError('Administrative account is unavailable.', 401);
        }

        // Return a fresh set of tokens based on the current valid session
        const tokens = generateTokens({
          userId: recentlyRotatedSession.adminId.toString(),
          role: admin.role,
        });

        // Update the current session with the new token
        recentlyRotatedSession.refreshToken = hashToken(tokens.refreshToken);
        recentlyRotatedSession.lastUsedAt = new Date();
        await recentlyRotatedSession.save();

        return tokens;
      }

      throw new AppError('Session not found or has been revoked.', 401);
    }

    if (!session.isValid) {
      throw new AppError('Session has been invalidated. Please log in again.', 401);
    }

    if (session.expiresAt < new Date()) {
      session.isValid = false;
      await session.save();
      throw new AppError('Session expired. Please log in again.', 401);
    }

    const admin = await AdminModel.findById(session.adminId).populate<{
      roleId?: { permissions: string[]; name: string };
    }>('roleId');
    if (!admin || !admin.isActive) {
      session.isValid = false;
      await session.save();
      throw new AppError('Administrative account is unavailable.', 401);
    }

    // 3. Token Rotation
    const tokens = generateTokens({ userId: session.adminId.toString(), role: admin.role });

    // Mark old session as rotated (effectively removing the old token from 'active' use)
    // but keep it as a reference for the grace period
    session.refreshToken = hashToken(tokens.refreshToken);
    session.rotatedAt = new Date();
    session.lastUsedAt = new Date();
    await session.save();

    return tokens;
  }

  static async logout(adminId: string, refreshToken?: string) {
    if (refreshToken) {
      // Invalidate specific session
      await AdminSessionModel.findOneAndUpdate(
        { adminId, refreshToken: hashToken(refreshToken) },
        { $set: { isValid: false } },
      );
    } else {
      // Invalidate all sessions (Force logout all devices)
      await AdminSessionModel.updateMany({ adminId }, { $set: { isValid: false } });
    }
  }
}
