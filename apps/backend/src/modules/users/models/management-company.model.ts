import mongoose, { Schema, Document } from 'mongoose';
import { auditPlugin, BaseSchemaOptions } from '../../../core/base.schema';

export interface IManagementCompany extends Document {
  userId: mongoose.Types.ObjectId;
  companyName: string;
  gstNumber?: string;
  registrationDocUrl?: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  commissionRate?: number;
}

const managementCompanySchema = new Schema<IManagementCompany>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  companyName: { type: String, required: true },
  gstNumber: { type: String },
  registrationDocUrl: { type: String },
  verificationStatus: { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED'], default: 'PENDING' },
  commissionRate: { type: Number, min: 0, max: 100 },
}, BaseSchemaOptions);

managementCompanySchema.plugin(auditPlugin);
managementCompanySchema.index({ verificationStatus: 1 });

export const ManagementCompanyModel = mongoose.model<IManagementCompany>('ManagementCompany', managementCompanySchema);
