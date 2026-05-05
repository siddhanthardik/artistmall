import mongoose, { Schema, Document } from 'mongoose';
import { auditPlugin, BaseSchemaOptions } from '../../../core/base.schema';

export interface IArtistAvailability extends Document {
  artistId: mongoose.Types.ObjectId;
  blockedDates: Date[]; // Specific dates blocked manually
  unavailableDays: string[]; // e.g. ['Monday', 'Tuesday']
  unavailableSlots: {
    startTime: string; // HH:mm
    endTime: string; // HH:mm
    days: string[];
  }[];
  seasonalUnavailability: {
    startDate: Date;
    endDate: Date;
    reason: string;
  }[];
}

const artistAvailabilitySchema = new Schema<IArtistAvailability>({
  artistId: { type: Schema.Types.ObjectId, ref: 'Artist', required: true, unique: true },
  blockedDates: [{ type: Date }],
  unavailableDays: [{ type: String }],
  unavailableSlots: [{
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    days: [{ type: String }]
  }],
  seasonalUnavailability: [{
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String }
  }]
}, BaseSchemaOptions);

artistAvailabilitySchema.plugin(auditPlugin);

export const ArtistAvailabilityModel = mongoose.model<IArtistAvailability>('ArtistAvailability', artistAvailabilitySchema);
