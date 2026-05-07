import { ClientModel, IClient } from './models/client.model';
import { AppError } from '../../core/errors';
import { hasValidMediaField, sanitizeMediaField } from '../../utils/media-integrity.util';

export const ClientService = {
  // Public - Get active clients sorted by order
  getActiveClients: async () => {
    const clients = await ClientModel.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    return clients
      .filter((client) => hasValidMediaField(client as any, 'logo'))
      .map((client) => sanitizeMediaField(client as any, 'logo'));
  },

  // Admin - Get all clients
  getAllClients: async () => {
    return await ClientModel.find().sort({ order: 1, createdAt: -1 });
  },

  createClient: async (data: Partial<IClient>) => {
    if (data.logo && !hasValidMediaField(data as any, 'logo')) {
      throw new AppError('Client logo file is missing from storage', 400);
    }
    return await ClientModel.create(data);
  },

  updateClient: async (id: string, data: Partial<IClient>) => {
    if (data.logo && !hasValidMediaField(data as any, 'logo')) {
      throw new AppError('Client logo file is missing from storage', 400);
    }
    const client = await ClientModel.findByIdAndUpdate(id, data, { new: true });
    if (!client) throw new AppError('Client not found', 404);
    return client;
  },

  deleteClient: async (id: string) => {
    const client = await ClientModel.findByIdAndDelete(id);
    if (!client) throw new AppError('Client not found', 404);
    return client;
  },
};
