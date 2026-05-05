import { Schema } from 'mongoose';

export const BaseSchemaOptions = {
  timestamps: true, // Automatically adds createdAt and updatedAt
};

// Reusable plugin for soft deletes and audit fields
export const auditPlugin = (schema: Schema) => {
  schema.add({
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  });

  // Automatically filter out deleted documents on standard queries
  const types = ['find', 'findOne', 'findOneAndUpdate', 'countDocuments'];
  types.forEach((type) => {
    schema.pre(type as any, function (this: any, next) {
      this.where({ isDeleted: false });
      next();
    });
  });
};
