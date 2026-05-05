export * from './schemas/user.schema';
export * from './schemas/artist.schema';
export * from './schemas/booking.schema';

// Core interfaces that don't need Zod validation
export interface BaseEntity {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
  isDeleted?: boolean;
  deletedAt?: Date | null;
}
