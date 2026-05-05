import mongoose, { Schema, Document } from 'mongoose';
import { auditPlugin, BaseSchemaOptions } from '../../../core/base.schema';

export interface IArtistCategory extends Document {
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
  parentCategoryId?: mongoose.Types.ObjectId;
  image_url?: string;
  image_alt?: string;
  image_blurhash?: string;
  createdBy?: mongoose.Types.ObjectId;
}

const artistCategorySchema = new Schema<IArtistCategory>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  description: { type: String },
  isActive: { type: Boolean, default: true, index: true },
  sortOrder: { type: Number, default: 0, index: true },
  parentCategoryId: { type: Schema.Types.ObjectId, ref: 'ArtistCategory' },
  image_url: { type: String },
  image_alt: { type: String },
  image_blurhash: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
}, BaseSchemaOptions);

artistCategorySchema.pre('validate', function(next) {
  if (this.name && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
  next();
});

artistCategorySchema.plugin(auditPlugin);

export const ArtistCategoryModel = mongoose.model<IArtistCategory>('ArtistCategory', artistCategorySchema);
