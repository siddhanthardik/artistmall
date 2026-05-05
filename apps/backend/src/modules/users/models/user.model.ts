import mongoose, { Schema, Document } from 'mongoose';
import { auditPlugin, BaseSchemaOptions } from '../../../core/base.schema';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  lastLoginAt?: Date;
  lastLoginIp?: string;
  mustChangePassword?: boolean;
  refreshToken?: string;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, required: true }, // Using String enum for simplicity over ObjectId for core roles
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  lastLoginAt: { type: Date },
  lastLoginIp: { type: String },
  mustChangePassword: { type: Boolean, default: false },
  refreshToken: { type: String },
}, BaseSchemaOptions);

userSchema.plugin(auditPlugin);
userSchema.index({ role: 1, isActive: 1 });

export const UserModel = mongoose.model<IUser>('User', userSchema);
