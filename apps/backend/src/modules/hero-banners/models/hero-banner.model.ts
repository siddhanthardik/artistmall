import mongoose, { Schema, Document } from 'mongoose';

export interface IHeroBanner extends Document {
  title?: string;
  subtitle?: string;
  imageUrl: string;
  ctaText?: string;
  ctaLink?: string;
  isActive: boolean;
  sortOrder: number;
  openInNewTab: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HeroBannerSchema: Schema = new Schema(
  {
    title: { type: String, trim: true },
    subtitle: { type: String, trim: true },
    imageUrl: { type: String, required: true },
    ctaText: { type: String, trim: true },
    ctaLink: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    openInNewTab: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: 'hero_banners',
  }
);

// Index for efficient sorting
HeroBannerSchema.index({ sortOrder: 1, isActive: -1 });

export default mongoose.model<IHeroBanner>('HeroBanner', HeroBannerSchema);
