import mongoose, { Schema, Document } from 'mongoose';
import { auditPlugin, BaseSchemaOptions } from '../../../core/base.schema';

export interface IRole extends Document {
  name: string;
  roleName: string;
  permissions: string[];
}

const roleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    roleName: { type: String, required: true, unique: true, trim: true },
    permissions: [{ type: String, required: true }],
  },
  BaseSchemaOptions,
);

roleSchema.pre('validate', function (next) {
  if (!this.roleName && this.name) this.roleName = this.name;
  if (!this.name && this.roleName) this.name = this.roleName;
  next();
});

roleSchema.plugin(auditPlugin);

export const RoleModel = mongoose.model<IRole>('Role', roleSchema);
