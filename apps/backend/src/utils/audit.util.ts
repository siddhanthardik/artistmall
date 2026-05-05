import { AdminActivityLogModel } from '../modules/admin/models/admin-activity.model';
import mongoose from 'mongoose';

export const logAdminActivity = async (
  adminId: string | mongoose.Types.ObjectId,
  action: string,
  targetResource: string,
  targetId: string,
  ipAddress?: string,
  details?: Record<string, any>,
) => {
  try {
    await AdminActivityLogModel.create({
      adminId,
      action,
      targetResource,
      targetId,
      ipAddress,
      details,
    });
  } catch (error) {
    console.error('[AUDIT LOG ERROR]', error);
    // We don't throw here to avoid crashing the main request if logging fails,
    // though in a real enterprise app, we might want to ensure logs are written.
  }
};
