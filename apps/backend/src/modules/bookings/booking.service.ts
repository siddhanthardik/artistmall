import { BookingRequestModel, IBookingRequest } from './models/booking-request.model';
import { BookingNegotiationModel } from './models/booking-negotiation.model';
import { BookingStatusLogModel } from './models/booking-status-log.model';
import { CommissionModel } from './models/commission.model';
import { ArtistModel } from '../artists/models/artist.model';
import { AppError } from '../../core/errors';
import mongoose from 'mongoose';

export class BookingService {
  // Helper to log status changes
  private static async logStatusChange(
    bookingId: mongoose.Types.ObjectId,
    oldStatus: string,
    newStatus: string,
    userId: string,
    reason?: string,
    session?: mongoose.ClientSession,
  ) {
    if (oldStatus !== newStatus) {
      await BookingStatusLogModel.create(
        [
          {
            bookingRequestId: bookingId,
            previousStatus: oldStatus,
            newStatus,
            changedById: userId,
            reason,
          },
        ],
        { session },
      );
    }
  }

  // --- DEMAND SIDE ACTIONS (BOOKING COMPANY) ---

  static async createDraft(bookingCompanyId: string, data: any) {
    const artist = await ArtistModel.findOne({
      _id: data.artistId,
      status: 'APPROVED',
      isDeleted: false,
    });
    if (!artist) throw new AppError('Artist not available for booking', 400);

    return await BookingRequestModel.create({
      ...data,
      bookingCompanyId,
      status: 'DRAFT',
    });
  }

  static async submitRequest(userId: string, bookingCompanyId: string, bookingId: string) {
    const booking = await BookingRequestModel.findOne({
      _id: bookingId,
      bookingCompanyId,
      status: 'DRAFT',
    });
    if (!booking) throw new AppError('Draft booking not found', 404);

    const oldStatus = booking.status;
    booking.status = 'REQUESTED';
    await booking.save();

    await this.logStatusChange(booking._id, oldStatus, booking.status, userId);
    return booking;
  }

  // --- NEGOTIATION ---

  static async negotiate(
    userId: string,
    bookingId: string,
    message: string,
    proposedPrice: number,
    isCounterOffer: boolean,
  ) {
    const booking = await BookingRequestModel.findById(bookingId);
    if (!booking) throw new AppError('Booking not found', 404);

    // Both Supply and Demand can negotiate, but only in certain states
    if (!['REQUESTED', 'NEGOTIATING'].includes(booking.status)) {
      throw new AppError('Cannot negotiate at this stage', 400);
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Save Negotiation Entry
      await BookingNegotiationModel.create(
        [
          {
            bookingRequestId: bookingId,
            senderId: userId,
            message,
            proposedPrice,
            isCounterOffer,
          },
        ],
        { session },
      );

      // 2. Update Booking Status and Budget
      const oldStatus = booking.status;
      booking.status = 'NEGOTIATING';
      booking.offeredBudget = proposedPrice;
      await booking.save({ session });

      await this.logStatusChange(
        booking._id,
        oldStatus,
        'NEGOTIATING',
        userId,
        'Counter offer submitted',
        session,
      );

      await session.commitTransaction();
      session.endSession();
      return booking;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  // --- SUPPLY SIDE ACTIONS (MANAGEMENT COMPANY) ---

  static async acceptByManagement(userId: string, managementCompanyId: string, bookingId: string) {
    const booking = await BookingRequestModel.findById(bookingId).populate('artistId');
    if (!booking) throw new AppError('Booking not found', 404);

    // Verify ownership
    const artist = booking.artistId as any;
    if (artist.managementCompanyId.toString() !== managementCompanyId) {
      throw new AppError('Unauthorized', 403);
    }

    if (!['REQUESTED', 'NEGOTIATING'].includes(booking.status)) {
      throw new AppError('Booking is not in a state to be accepted', 400);
    }

    const oldStatus = booking.status;
    booking.status = 'ACCEPTED_BY_MGMT';
    // Logic: move to ADVANCE_PENDING immediately in most workflows, waiting for client payment
    booking.status = 'ADVANCE_PENDING';
    await booking.save();

    await this.logStatusChange(booking._id, oldStatus, 'ADVANCE_PENDING', userId);
    return booking;
  }

  // --- SYSTEM / FINANCE ACTIONS ---

  static async payAdvance(userId: string, bookingId: string) {
    // Simulated payment logic
    const booking = await BookingRequestModel.findOne({
      _id: bookingId,
      status: 'ADVANCE_PENDING',
    });
    if (!booking) throw new AppError('Booking not awaiting advance', 400);

    const oldStatus = booking.status;
    booking.status = 'CONFIRMED';
    await booking.save();

    await this.logStatusChange(
      booking._id,
      oldStatus,
      'CONFIRMED',
      userId,
      'Advance payment received',
    );
    return booking;
  }

  static async completeBooking(userId: string, bookingId: string) {
    const booking = await BookingRequestModel.findOne({
      _id: bookingId,
      status: 'CONFIRMED',
    }).populate('artistId');
    if (!booking) throw new AppError('Only confirmed bookings can be completed', 400);

    const artist = booking.artistId as any;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const oldStatus = booking.status;
      booking.status = 'COMPLETED';
      await booking.save({ session });

      await this.logStatusChange(
        booking._id,
        oldStatus,
        'COMPLETED',
        userId,
        'Event completed',
        session,
      );

      // Generate Commission Ledger
      const platformFeePercentage = 10; // e.g., 10%
      const platformFeeAmount = (booking.offeredBudget * platformFeePercentage) / 100;

      await CommissionModel.create(
        [
          {
            bookingRequestId: booking._id,
            managementCompanyId: artist.managementCompanyId,
            bookingAmount: booking.offeredBudget,
            platformFeePercentage,
            platformFeeAmount,
            status: 'UNPAID',
          },
        ],
        { session },
      );

      await session.commitTransaction();
      session.endSession();
      return booking;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  // --- ADMIN ACTIONS ---

  static async adminOverrideStatus(
    adminId: string,
    bookingId: string,
    newStatus: string,
    reason: string,
  ) {
    const booking = await BookingRequestModel.findById(bookingId);
    if (!booking) throw new AppError('Booking not found', 404);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const oldStatus = booking.status;
      booking.status = newStatus;
      await booking.save({ session });

      await this.logStatusChange(
        booking._id,
        oldStatus,
        newStatus,
        adminId,
        `ADMIN OVERRIDE: ${reason}`,
        session,
      );

      await session.commitTransaction();
      session.endSession();
      return booking;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}
