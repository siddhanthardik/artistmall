import { Request, Response, NextFunction } from 'express';
import { CompanyService } from './company.service';

// --- SUPPLY SIDE (MANAGEMENT) ---

export const updateManagementProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await CompanyService.createOrUpdateManagementProfile(req.user!.userId, req.body);
    res.status(200).json({ status: 'success', data: { profile } });
  } catch (error) {
    next(error);
  }
};

export const submitManagementKyc = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { documentUrl, gstNumber } = req.body;
    const profile = await CompanyService.submitManagementKyc(req.user!.userId, documentUrl, gstNumber);
    res.status(200).json({ status: 'success', data: { profile } });
  } catch (error) {
    next(error);
  }
};

// --- DEMAND SIDE (BOOKING) ---

export const updateBookingProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await CompanyService.createOrUpdateBookingProfile(req.user!.userId, req.body);
    res.status(200).json({ status: 'success', data: { profile } });
  } catch (error) {
    next(error);
  }
};

export const submitBookingKyc = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { industryType, billingAddress } = req.body;
    const profile = await CompanyService.submitBookingKyc(req.user!.userId, industryType, billingAddress);
    res.status(200).json({ status: 'success', data: { profile } });
  } catch (error) {
    next(error);
  }
};

// --- ADMIN VERIFICATION ---

export const adminVerifyCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { companyId, type, status } = req.body;
    const ipAddress = req.ip || req.socket.remoteAddress;

    const company = await CompanyService.verifyCompany(req.user!.userId, companyId, type, status, ipAddress);
    
    res.status(200).json({ status: 'success', data: { company } });
  } catch (error) {
    next(error);
  }
};
