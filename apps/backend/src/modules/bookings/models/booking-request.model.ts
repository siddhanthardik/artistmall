import mongoose, { Schema, Document } from 'mongoose';
import { auditPlugin, BaseSchemaOptions } from '../../../core/base.schema';

export interface IBookingRequest extends Document {
  bookingCompanyId: mongoose.Types.ObjectId;
  artistId: mongoose.Types.ObjectId;
  eventDate: Date;
  cityId: mongoose.Types.ObjectId;
  eventTypeId?: mongoose.Types.ObjectId;
  offeredBudget: number;
  status: string;
}

const bookingRequestSchema = new Schema<IBookingRequest>({
  bookingCompanyId: { type: Schema.Types.ObjectId, ref: 'BookingCompany', required: true },
  artistId: { type: Schema.Types.ObjectId, ref: 'Artist', required: true },
  eventDate: { type: Date, required: true },
  cityId: { type: Schema.Types.ObjectId, ref: 'City', required: true }, // Assuming a City collection will exist
  eventTypeId: { type: Schema.Types.ObjectId, ref: 'EventType' },
  offeredBudget: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: [
      'DRAFT', 'REQUESTED', 'NEGOTIATING', 'ACCEPTED_BY_MGMT', 
      'ADVANCE_PENDING', 'CONFIRMED', 'COMPLETED', 
      'CANCELLED_BY_CLIENT', 'CANCELLED_BY_MGMT', 'REJECTED'
    ],
    default: 'DRAFT',
  },
}, BaseSchemaOptions);

bookingRequestSchema.plugin(auditPlugin);
bookingRequestSchema.index({ artistId: 1, status: 1 });
bookingRequestSchema.index({ bookingCompanyId: 1, eventDate: 1 });

export const BookingRequestModel = mongoose.model<IBookingRequest>('BookingRequest', bookingRequestSchema);
