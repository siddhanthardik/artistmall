import mongoose, { Schema, Document } from 'mongoose';

export interface ILead extends Document {
  artistId?: mongoose.Types.ObjectId;
  artistName: string;
  eventType: string;
  eventDate: Date;
  eventCity: string;
  guestCount: number;
  customerName: string;
  phone: string;
  email?: string;
  message?: string;
  status: 'new' | 'contacted' | 'quoted' | 'converted' | 'closed';
  source: 'website' | 'admin' | 'other';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema(
  {
    artistId: {
      type: Schema.Types.ObjectId,
      ref: 'Artist',
    },
    artistName: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
      required: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    eventCity: {
      type: String,
      required: true,
    },
    guestCount: {
      type: Number,
      required: true,
      min: [1, 'Guest count must be greater than 0'],
    },
    customerName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'quoted', 'converted', 'closed'],
      default: 'new',
    },
    source: {
      type: String,
      enum: ['website', 'admin', 'other'],
      default: 'website',
    },
    tags: [{
      type: String,
    }],
  },
  {
    timestamps: true,
  }
);

export const LeadModel = mongoose.model<ILead>('Lead', leadSchema);
