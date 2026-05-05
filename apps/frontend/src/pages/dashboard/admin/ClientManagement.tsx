import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Edit2,
  Trash2,
  Link as LinkIcon,
  CheckCircle2,
  XCircle,
  Upload,
  X,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { resolveMediaUrl } from '../../../utils/media';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { api } from '../../../services/api';

export const ClientManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', website: '', isActive: true, order: 0 });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { data: clientsData, isLoading } = useQuery({
    queryKey: ['admin-clients'],
    queryFn: async () => {
      const res = await api.get('/clients/admin');
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: FormData) => {
      return api.post('/clients', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clients'] });
      closeModal();
      toast.success('Client added successfully');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to add client'),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: FormData }) => {
      return api.put(`/clients/${id}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clients'] });
      closeModal();
      toast.success('Client updated successfully');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update client'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/clients/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clients'] });
      toast.success('Client deleted');
    },
  });

  const clients = clientsData?.data?.clients || [];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
    setFormData({ name: '', website: '', isActive: true, order: 0 });
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEdit = (client: any) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      website: client.website || '',
      isActive: client.isActive,
      order: client.order,
    });
    setPreviewUrl(resolveMediaUrl(client.logo));
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return toast.error('Name is required');
    if (!editingClient && !selectedFile) return toast.error('Logo is required');

    setUploading(true);
    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('website', formData.website);
    payload.append('isActive', String(formData.isActive));
    payload.append('order', String(formData.order));

    if (selectedFile) {
      payload.append('logo', selectedFile);
    }

    if (editingClient) {
      updateMutation.mutate(
        { id: editingClient._id, payload },
        { onSettled: () => setUploading(false) },
      );
    } else {
      createMutation.mutate(payload, { onSettled: () => setUploading(false) });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Our Clients</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Manage trusted partners displayed on the homepage.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Add Client
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest w-24">
                  Order
                </th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Logo
                </th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Client Name
                </th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Status
                </th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Loading clients...
                  </td>
                </tr>
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No clients added yet.
                  </td>
                </tr>
              ) : (
                clients.map((client: any) => (
                  <tr key={client._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-slate-900 text-center">{client.order}</td>
                    <td className="p-4">
                      <div className="h-12 w-24 bg-slate-50 rounded-lg p-2 border border-slate-100 flex items-center justify-center">
                        <img
                          src={resolveMediaUrl(client.logo)}
                          alt={client.name}
                          className="max-h-full max-w-full object-contain filter grayscale"
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{client.name}</p>
                      {client.website && (
                        <a
                          href={client.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[10px] font-bold text-brand-blue uppercase tracking-widest mt-1 hover:underline"
                        >
                          <LinkIcon className="w-3 h-3" /> Website
                        </a>
                      )}
                    </td>
                    <td className="p-4">
                      {client.isActive ? (
                        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                          <XCircle className="w-3.5 h-3.5" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(client)}
                          className="p-2 text-slate-400 hover:text-brand-blue transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this client?')) {
                              deleteMutation.mutate(client._id);
                            }
                          }}
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={closeModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-lg rounded-[32px] p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {editingClient ? 'Edit Client' : 'Add New Client'}
                </h2>
                <button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                    Client Logo *
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative w-full h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${
                      previewUrl
                        ? 'border-brand-primary bg-brand-primary/5'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-brand-primary/50'
                    }`}
                  >
                    {previewUrl ? (
                      <div className="p-4 w-full h-full flex items-center justify-center">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="max-h-full object-contain filter grayscale"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <p className="text-white text-xs font-bold uppercase tracking-widest">
                            Change Image
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-slate-400 mb-2" />
                        <p className="text-sm font-bold text-slate-600">Click to upload logo</p>
                        <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-widest">
                          PNG, JPG up to 2MB
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleFileSelect}
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                      Client Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-brand-primary focus:bg-white transition-colors"
                      placeholder="e.g. Google"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                      Website URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-brand-primary focus:bg-white transition-colors"
                      placeholder="https://"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) =>
                          setFormData({ ...formData, order: Number(e.target.value) })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-brand-primary focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                        Status
                      </label>
                      <div className="flex items-center h-[46px] px-4 bg-slate-50 border border-slate-200 rounded-xl">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={(e) =>
                              setFormData({ ...formData, isActive: e.target.checked })
                            }
                            className="w-4 h-4 rounded text-brand-primary focus:ring-brand-primary"
                          />
                          <span className="text-sm font-bold text-slate-700">Active</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="text-slate-500 hover:text-slate-700 text-sm font-bold px-4 py-2 transition-colors"
                  >
                    Cancel
                  </button>
                  <Button type="submit" isLoading={uploading}>
                    {editingClient ? 'Save Changes' : 'Add Client'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
