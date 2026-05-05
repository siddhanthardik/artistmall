import { Request, Response, NextFunction } from 'express';
import { ClientService } from './client.service';
import { AppError } from '../../core/errors';

export const getClients = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const clients = await ClientService.getActiveClients();
    res.status(200).json({ status: 'success', data: { clients } });
  } catch (error) {
    next(error);
  }
};

export const getAdminClients = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const clients = await ClientService.getAllClients();
    res.status(200).json({ status: 'success', data: { clients } });
  } catch (error) {
    next(error);
  }
};

export const createClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, website, isActive, order } = req.body;
    let logo = '';

    if (req.file) {
      logo = `/uploads/clients/${req.file.filename}`;
    } else {
      return next(new AppError('Logo is required', 400));
    }

    const client = await ClientService.createClient({
      name,
      website,
      isActive: isActive !== undefined ? String(isActive) === 'true' : true,
      order: order !== undefined ? parseInt(order, 10) : 0,
      logo,
    });

    res.status(201).json({ status: 'success', data: { client } });
  } catch (error) {
    next(error);
  }
};

export const updateClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, website, isActive, order } = req.body;
    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (website !== undefined) updateData.website = website;
    if (isActive !== undefined) updateData.isActive = String(isActive) === 'true';
    if (order !== undefined) updateData.order = parseInt(order, 10);

    if (req.file) {
      updateData.logo = `/uploads/clients/${req.file.filename}`;
    }

    const client = await ClientService.updateClient(req.params.id, updateData);

    res.status(200).json({ status: 'success', data: { client } });
  } catch (error) {
    next(error);
  }
};

export const deleteClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await ClientService.deleteClient(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
