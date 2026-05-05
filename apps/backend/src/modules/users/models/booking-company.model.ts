import mongoose, { Schema, Document } from 'mongoose';
import { auditPlugin, BaseSchemaOptions } from '../../../core/base.schema';

export interface IBookingCompany extends Document {
  userId: mongoose.Types.ObjectId;
  companyName: string;
  industryType?: string;
  kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}

const bookingCompanySchema = new Schema<IBookingCompany>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  companyName: { type: String, required: true },
  industryType: { type: String },
  kycStatus: { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED'], default: 'PENDING' },
  billingAddress: {
    street: String,
    city: String,
    state: String,
    zip: String,
  },
}, BaseSchemaOptions);

bookingCompanySchema.plugin(auditPlugin);

export const BookingCompanyModel = mongoose.model<IBookingCompany>('BookingCompany', bookingCompanySchema);
