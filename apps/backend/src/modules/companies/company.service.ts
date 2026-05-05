import { ManagementCompanyModel } from '../users/models/management-company.model';
import { BookingCompanyModel } from '../users/models/booking-company.model';
import { AdminActivityLogModel } from '../admin/models/admin-activity.model';
import { AppError } from '../../core/errors';
import mongoose from 'mongoose';

export class CompanyService {
  // --- SUPPLY SIDE (MANAGEMENT) ---

  static async createOrUpdateManagementProfile(userId: string, data: any) {
    const profile = await ManagementCompanyModel.findOneAndUpdate(
      { userId },
      { ...data, userId },
      { new: true, upsert: true, runValidators: true },
    );
    return profile;
  }

  static async submitManagementKyc(userId: string, documentUrl: string, gstNumber: string) {
    const profile = await ManagementCompanyModel.findOne({ userId });
    if (!profile) throw new AppError('Profile not found', 404);

    profile.registrationDocUrl = documentUrl;
    profile.gstNumber = gstNumber;
    profile.verificationStatus = 'PENDING';
    await profile.save();

    return profile;
  }

  // --- DEMAND SIDE (BOOKING) ---

  static async createOrUpdateBookingProfile(userId: string, data: any) {
    const profile = await BookingCompanyModel.findOneAndUpdate(
      { userId },
      { ...data, userId },
      { new: true, upsert: true, runValidators: true },
    );
    return profile;
  }

  static async submitBookingKyc(userId: string, industryType: string, billingAddress: any) {
    const profile = await BookingCompanyModel.findOne({ userId });
    if (!profile) throw new AppError('Profile not found', 404);

    profile.industryType = industryType;
    profile.billingAddress = billingAddress;
    profile.kycStatus = 'PENDING';
    await profile.save();

    return profile;
  }

  // --- ADMIN VERIFICATION & AUDIT LOGGING ---

  static async verifyCompany(
    adminId: string,
    companyId: string,
    type: 'MANAGEMENT' | 'BOOKING',
    status: 'VERIFIED' | 'REJECTED',
    ipAddress?: string,
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      let updatedCompany;

      if (type === 'MANAGEMENT') {
        updatedCompany = await ManagementCompanyModel.findByIdAndUpdate(
          companyId,
          { verificationStatus: status },
          { new: true, session },
        );
      } else {
        updatedCompany = await BookingCompanyModel.findByIdAndUpdate(
          companyId,
          { kycStatus: status },
          { new: true, session },
        );
      }

      if (!updatedCompany) {
        throw new AppError('Company not found', 404);
      }

      // Secure Audit Log
      await AdminActivityLogModel.create(
        [
          {
            adminId,
            action: status === 'VERIFIED' ? 'VERIFY_COMPANY' : 'REJECT_COMPANY',
            targetResource: type === 'MANAGEMENT' ? 'ManagementCompany' : 'BookingCompany',
            targetId: companyId,
            ipAddress,
            details: { newStatus: status },
          },
        ],
        { session },
      );

      await session.commitTransaction();
      session.endSession();

      return updatedCompany;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}
