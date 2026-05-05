import { ClientModel, IClient } from './models/client.model';
import { AppError } from '../../core/errors';

export const ClientService = {
  // Public - Get active clients sorted by order
  getActiveClients: async () => {
    return await ClientModel.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
  },

  // Admin - Get all clients
  getAllClients: async () => {
    return await ClientModel.find().sort({ order: 1, createdAt: -1 });
  },

  createClient: async (data: Partial<IClient>) => {
    return await ClientModel.create(data);
  },

  updateClient: async (id: string, data: Partial<IClient>) => {
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
