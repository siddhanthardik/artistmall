import mongoose, { Schema, Document } from 'mongoose';
import { auditPlugin, BaseSchemaOptions } from '../../../core/base.schema';

export interface ICommission extends Document {
  bookingRequestId: mongoose.Types.ObjectId;
  managementCompanyId: mongoose.Types.ObjectId;
  bookingAmount: number;
  platformFeePercentage: number;
  platformFeeAmount: number;
  status: 'UNPAID' | 'PAID' | 'DISPUTED';
}

const commissionSchema = new Schema<ICommission>({
  bookingRequestId: { type: Schema.Types.ObjectId, ref: 'BookingRequest', required: true },
  managementCompanyId: { type: Schema.Types.ObjectId, ref: 'ManagementCompany', required: true },
  bookingAmount: { type: Number, required: true, min: 0 },
  platformFeePercentage: { type: Number, required: true, min: 0, max: 100 },
  platformFeeAmount: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['UNPAID', 'PAID', 'DISPUTED'], default: 'UNPAID' },
}, BaseSchemaOptions);

commissionSchema.plugin(auditPlugin);
commissionSchema.index({ managementCompanyId: 1, status: 1 });

export const CommissionModel = mongoose.model<ICommission>('Commission', commissionSchema);
