import { Request, Response, NextFunction } from 'express';
import { BookingService } from './booking.service';

export const createDraft = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = await BookingService.createDraft(req.user!.userId, req.body);
    res.status(201).json({ status: 'success', data: { booking } });
  } catch (error) {
    next(error);
  }
};

export const submitRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = await BookingService.submitRequest(req.user!.userId, req.user!.userId, req.params.id);
    res.status(200).json({ status: 'success', data: { booking } });
  } catch (error) {
    next(error);
  }
};

export const negotiate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { message, proposedPrice, isCounterOffer } = req.body;
    const booking = await BookingService.negotiate(req.user!.userId, req.params.id, message, proposedPrice, isCounterOffer);
    res.status(200).json({ status: 'success', data: { booking } });
  } catch (error) {
    next(error);
  }
};

export const acceptByManagement = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = await BookingService.acceptByManagement(req.user!.userId, req.user!.userId, req.params.id);
    res.status(200).json({ status: 'success', data: { booking } });
  } catch (error) {
    next(error);
  }
};

export const payAdvance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = await BookingService.payAdvance(req.user!.userId, req.params.id);
    res.status(200).json({ status: 'success', data: { booking } });
  } catch (error) {
    next(error);
  }
};

export const completeBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = await BookingService.completeBooking(req.user!.userId, req.params.id);
    res.status(200).json({ status: 'success', data: { booking } });
  } catch (error) {
    next(error);
  }
};

export const adminOverrideStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { newStatus, reason } = req.body;
    const booking = await BookingService.adminOverrideStatus(req.user!.userId, req.params.id, newStatus, reason);
    res.status(200).json({ status: 'success', data: { booking } });
  } catch (error) {
    next(error);
  }
};
