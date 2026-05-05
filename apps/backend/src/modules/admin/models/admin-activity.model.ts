import mongoose, { Schema, Document } from 'mongoose';
import { auditPlugin, BaseSchemaOptions } from '../../../core/base.schema';

export interface IAdminActivityLog extends Document {
  adminId: mongoose.Types.ObjectId;
  action: string;
  targetResource: string;
  targetId: string;
  ipAddress?: string;
  details?: Record<string, any>;
}

const adminActivityLogSchema = new Schema<IAdminActivityLog>(
  {
    adminId: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
    action: { type: String, required: true }, // e.g., 'VERIFY_COMPANY', 'REJECT_COMPANY', 'FORCE_CANCEL_BOOKING'
    targetResource: { type: String, required: true }, // e.g., 'ManagementCompany'
    targetId: { type: String, required: true }, // The ID of the affected document
    ipAddress: { type: String },
    details: { type: Schema.Types.Mixed }, // Arbitrary payload describing the change
  },
  BaseSchemaOptions,
);

// Audit logs are immutable generally, but we still apply the plugin for consistency in createdBy etc.
adminActivityLogSchema.plugin(auditPlugin);

export const AdminActivityLogModel = mongoose.model<IAdminActivityLog>(
  'AdminActivityLog',
  adminActivityLogSchema,
);
