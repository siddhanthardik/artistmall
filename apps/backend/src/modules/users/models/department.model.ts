import mongoose, { Schema, Document } from 'mongoose';
import { auditPlugin, BaseSchemaOptions } from '../../../core/base.schema';

export interface IDepartment extends Document {
  name: string;
  description?: string;
  isActive: boolean;
}

const departmentSchema = new Schema<IDepartment>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  BaseSchemaOptions,
);

departmentSchema.plugin(auditPlugin);
departmentSchema.index({ name: 1 });

export const DepartmentModel = mongoose.model<IDepartment>('Department', departmentSchema);
