import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { LeadService } from './lead.service';
import { ArtistModel } from '../artists/models/artist.model';
import { AppError } from '../../core/errors';

export const createLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;

    // Validation
    if (!data.customerName || !data.phone) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'Missing required fields: customerName, phone' });
    }

    if (
      !data.artistName ||
      !data.eventType ||
      !data.eventDate ||
      !data.eventCity ||
      !data.guestCount
    ) {
      return res.status(400).json({ status: 'fail', message: 'Missing required event fields' });
    }

    // ArtistId ObjectId Fallback (Enterprise-level)
    let artistId = data.artistId;
    if (artistId && !mongoose.Types.ObjectId.isValid(artistId)) {
      const artist = await ArtistModel.findOne({ slug: artistId });
      if (!artist) {
        return res.status(404).json({ status: 'fail', message: 'Artist not found' });
      }
      data.artistId = artist._id;
    }

    // Phone format basic check (can be expanded)
    if (data.phone.length < 10) {
      return res.status(400).json({ status: 'fail', message: 'Invalid phone number format' });
    }

    // Date must be future
    const eventDate = new Date(data.eventDate);
    if (eventDate <= new Date()) {
      return res.status(400).json({ status: 'fail', message: 'Event date must be in the future' });
    }

    // Guest count > 0
    if (data.guestCount <= 0) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'Guest count must be greater than 0' });
    }

    // Email optional but validated
    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return res.status(400).json({ status: 'fail', message: 'Invalid email format' });
      }
    }

    const lead = await LeadService.createLead(data);

    res.status(201).json({ status: 'success', data: { lead } });
  } catch (error) {
    next(error);
  }
};

export const getLeads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = {
      status: req.query.status as string,
      tag: req.query.tag as string,
      today: req.query.today === 'true',
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 50,
    };

    const result = await LeadService.getLeads(filters);
    res.status(200).json({ status: 'success', ...result });
  } catch (error) {
    next(error);
  }
};

export const updateLeadStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    if (!status) throw new AppError('Status is required', 400);

    const lead = await LeadService.updateLeadStatus(req.params.id, status);
    res.status(200).json({ status: 'success', data: { lead } });
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await LeadService.deleteLead(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
