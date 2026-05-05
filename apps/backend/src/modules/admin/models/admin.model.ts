import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { auditPlugin, BaseSchemaOptions } from '../../../core/base.schema';

export type AdminRole = 'SUPER_ADMIN' | 'ADMIN' | 'SUB_ADMIN' | 'INTERNAL_OPS' | 'FINANCE' | 'SUPPORT';

export interface IAdmin extends Document {
  fullName: string;
  email: string;
  password?: string;
  role: AdminRole;
  roleId?: mongoose.Types.ObjectId;
  departmentId?: mongoose.Types.ObjectId;
  isSuperAdmin: boolean;
  permissions: string[];
  isActive: boolean;
  mustChangePassword: boolean;
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  createdBy?: mongoose.Types.ObjectId;
  comparePassword(candidate: string): Promise<boolean>;
}

const adminSchema = new Schema<IAdmin>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, immutable: true },
  password: { type: String, required: true, select: false },
  role: { 
    type: String, 
    enum: ['SUPER_ADMIN', 'ADMIN', 'SUB_ADMIN', 'INTERNAL_OPS', 'FINANCE', 'SUPPORT'],
    default: 'INTERNAL_OPS'
  },
  roleId: { type: Schema.Types.ObjectId, ref: 'Role' },
  departmentId: { type: Schema.Types.ObjectId, ref: 'Department' },
  isSuperAdmin: { type: Boolean, default: false },
  permissions: [{ type: String }],
  isActive: { type: Boolean, default: true },
  mustChangePassword: { type: Boolean, default: false },
  lastLogin: { type: Date },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
  createdBy: { type: Schema.Types.ObjectId, ref: 'Admin' }
}, BaseSchemaOptions);

// Password Hashing (Deterministic v2 Rebuild)
adminSchema.pre('save', async function (next) {
  if (this.role === 'SUPER_ADMIN') this.isSuperAdmin = true;
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password!, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare Password Helper
adminSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return await bcrypt.compare(candidate, this.password);
};

adminSchema.plugin(auditPlugin);
adminSchema.index({ email: 1 });
adminSchema.index({ role: 1 });

export const AdminModel = mongoose.model<IAdmin>('Admin', adminSchema);
