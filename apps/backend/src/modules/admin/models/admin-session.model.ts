import mongoose, { Schema, Document } from 'mongoose';

export interface IAdminSession extends Document {
  adminId: mongoose.Types.ObjectId;
  refreshToken: string;
  userAgent?: string;
  ipAddress?: string;
  isValid: boolean;
  rotatedAt?: Date; // For grace period during rotation
  expiresAt: Date;
  createdAt: Date;
  lastUsedAt: Date;
}

const adminSessionSchema = new Schema<IAdminSession>(
  {
    adminId: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
    refreshToken: { type: String, required: true, unique: true },
    userAgent: { type: String },
    ipAddress: { type: String },
    isValid: { type: Boolean, default: true },
    rotatedAt: { type: Date },
    expiresAt: { type: Date, required: true },
    lastUsedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

// Index for automatic cleanup of expired sessions
adminSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
adminSessionSchema.index({ adminId: 1 });

export const AdminSessionModel = mongoose.model<IAdminSession>('AdminSession', adminSessionSchema);
