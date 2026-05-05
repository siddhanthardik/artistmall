import mongoose, { Schema, Document } from 'mongoose';
import { auditPlugin, BaseSchemaOptions } from '../../../core/base.schema';

export interface IFeaturedListing extends Document {
  artistId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  tier: 'GOLD' | 'SILVER';
  isActive: boolean; // Computed or explicitly managed
}

const featuredListingSchema = new Schema<IFeaturedListing>({
  artistId: { type: Schema.Types.ObjectId, ref: 'Artist', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  tier: { type: String, enum: ['GOLD', 'SILVER'], required: true },
  isActive: { type: Boolean, default: true },
}, BaseSchemaOptions);

featuredListingSchema.plugin(auditPlugin);
featuredListingSchema.index({ artistId: 1, endDate: 1, isActive: 1 });

export const FeaturedListingModel = mongoose.model<IFeaturedListing>('FeaturedListing', featuredListingSchema);
