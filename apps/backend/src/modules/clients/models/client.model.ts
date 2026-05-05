import mongoose, { Schema, Document } from 'mongoose';

export interface IClient extends Document {
  name: string;
  logo: string;
  website?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const clientSchema = new Schema(
  {
    name: { 
      type: String, 
      required: true,
      trim: true
    },
    logo: { 
      type: String, 
      required: true 
    },
    website: { 
      type: String,
      trim: true 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    order: { 
      type: Number, 
      default: 0 
    }
  },
  { 
    timestamps: true 
  }
);

export const ClientModel = mongoose.model<IClient>('Client', clientSchema);
