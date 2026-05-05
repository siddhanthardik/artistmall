import mongoose, { Schema, Document } from 'mongoose';
import { auditPlugin, BaseSchemaOptions } from '../../../core/base.schema';

export interface IBookingNegotiation extends Document {
  bookingRequestId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  message?: string;
  proposedPrice: number;
  isCounterOffer: boolean;
}

const bookingNegotiationSchema = new Schema<IBookingNegotiation>(
  {
    bookingRequestId: { type: Schema.Types.ObjectId, ref: 'BookingRequest', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String },
    proposedPrice: { type: Number, required: true, min: 0 },
    isCounterOffer: { type: Boolean, default: false },
  },
  BaseSchemaOptions,
);

bookingNegotiationSchema.plugin(auditPlugin);

export const BookingNegotiationModel = mongoose.model<IBookingNegotiation>(
  'BookingNegotiation',
  bookingNegotiationSchema,
);
