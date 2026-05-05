import { UserModel } from '../users/models/user.model';
import { hashPassword, comparePassword, hashToken } from '../../utils/crypto.util';
import { generateTokens, verifyRefreshToken } from '../../utils/jwt.util';
import { AppError } from '../../core/errors';

export class AuthService {
  static async register(userData: any) {
    const { email, password, role } = userData;

    // Check if user exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already in use', 400);
    }

    if (!password) {
      throw new AppError('Password is required', 400);
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await UserModel.create({
      email,
      passwordHash: hashedPassword,
      role,
      isVerified: true,
    });

    // Auto-login: Generate tokens
    const tokens = generateTokens({ userId: newUser.id, role: newUser.role });
    newUser.refreshToken = hashToken(tokens.refreshToken);
    await newUser.save();

    return {
      user: { id: newUser.id, email: newUser.email, role: newUser.role },
      tokens,
    };
  }

  static async login(email: string, passwordString: string) {
    const user = await UserModel.findOne({ email }).select('+passwordHash');
    
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await comparePassword(passwordString, user.passwordHash);

    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    if (!user.isActive) {
      throw new AppError('Account is deactivated. Please contact support.', 403);
    }

    const tokens = generateTokens({ userId: user.id, role: user.role });

    user.refreshToken = hashToken(tokens.refreshToken);
    user.lastLoginAt = new Date();
    await user.save();

    return {
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        mustChangePassword: user.mustChangePassword 
      },
      tokens,
    };
  }

  static async refreshToken(oldRefreshToken: string) {
    if (!oldRefreshToken) throw new AppError('No refresh token provided', 401);

    // Verify RT validity
    const decoded = verifyRefreshToken(oldRefreshToken);

    // Find user and ensure the RT matches what is in the DB
    const user = await UserModel.findById(decoded.userId);
    if (!user || user.refreshToken !== hashToken(oldRefreshToken)) {
      throw new AppError('Invalid refresh token. Please log in again.', 401);
    }

    // Generate new tokens (Rotation)
    const tokens = generateTokens({ userId: user.id, role: user.role });
    user.refreshToken = hashToken(tokens.refreshToken);
    await user.save();

    return tokens;
  }

  static async forceResetPassword(userId: string, newPasswordString: string) {
    const user = await UserModel.findById(userId);
    if (!user) throw new AppError('User not found', 404);

    const hashedPassword = await hashPassword(newPasswordString);
    user.passwordHash = hashedPassword;
    user.mustChangePassword = false;
    await user.save();
  }

  static async logout(userId: string) {
    await UserModel.findByIdAndUpdate(userId, { refreshToken: null });
  }
}
