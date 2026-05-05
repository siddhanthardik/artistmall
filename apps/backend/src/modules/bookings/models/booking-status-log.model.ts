import mongoose, { Schema, Document } from 'mongoose';
import { auditPlugin, BaseSchemaOptions } from '../../../core/base.schema';

export interface IBookingStatusLog extends Document {
  bookingRequestId: mongoose.Types.ObjectId;
  previousStatus: string;
  newStatus: string;
  changedById: mongoose.Types.ObjectId;
  reason?: string;
}

const bookingStatusLogSchema = new Schema<IBookingStatusLog>({
  bookingRequestId: { type: Schema.Types.ObjectId, ref: 'BookingRequest', required: true },
  previousStatus: { type: String, required: true },
  newStatus: { type: String, required: true },
  changedById: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String },
}, BaseSchemaOptions);

bookingStatusLogSchema.plugin(auditPlugin);

export const BookingStatusLogModel = mongoose.model<IBookingStatusLog>('BookingStatusLog', bookingStatusLogSchema);
