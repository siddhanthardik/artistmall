import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Loader2, 
  Eye, 
  EyeOff,
  GripVertical,
  Image as ImageIcon,
  Save
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AdminService } from '../../../../services/admin.service';
import { toast } from 'react-hot-toast';
import { Reorder } from 'framer-motion';

export const HeroBannerList: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  interface IBanner {
    _id: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    ctaText: string;
    ctaLink: string;
    isActive: boolean;
    sortOrder: number;
  }

  const [items, setItems] = useState<IBanner[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const { data: bannersResponse, isLoading } = useQuery({
    queryKey: ['admin-hero-banners'],
    queryFn: () => AdminService.getHeroBanners(),
  });

  useEffect(() => {
    if (bannersResponse?.data) {
      setItems(bannersResponse.data);
    }
  }, [bannersResponse]);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => AdminService.deleteHeroBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-hero-banners'] });
      toast.success('Banner deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete banner');
    }
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => 
      AdminService.updateHeroBanner(id, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-hero-banners'] });
      toast.success('Status updated');
    }
  });

  const reorderMutation = useMutation({
    mutationFn: (newItems: any[]) => {
      const orders = newItems.map((item, index) => ({
        id: item._id,
        sortOrder: index
      }));
      return AdminService.reorderHeroBanners(orders);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-hero-banners'] });
      toast.success('Order saved');
      setHasChanges(false);
    }
  });

  const handleReorder = (newItems: any[]) => {
    setItems(newItems);
    setHasChanges(true);
  };

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-neutral-content tracking-tighter uppercase">Hero Banners</h1>
          <p className="text-[10px] font-black text-neutral-content/40 uppercase tracking-[0.3em] mt-1">Homepage Visual Inventory Management</p>
        </div>
        <div className="flex items-center gap-3">
          {hasChanges && (
            <button 
              onClick={() => reorderMutation.mutate(items)}
              disabled={reorderMutation.isPending}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-500/20"
            >
              {reorderMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              <span>Save Order</span>
            </button>
          )}
          <button 
            onClick={() => navigate('/admin/hero-banners/create')}
            className="flex items-center gap-2 bg-brand-primary hover:bg-brand-primaryContainer text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-brand-primary/20"
          >
            <Plus className="w-5 h-5" />
            <span>Add Banner</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-surface-container rounded-[40px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-surface-container">
                <th className="px-8 py-6 text-[10px] font-black text-neutral-content/40 uppercase tracking-widest w-24">Order</th>
                <th className="px-6 py-6 text-[10px] font-black text-neutral-content/40 uppercase tracking-widest">Banner Preview</th>
                <th className="px-6 py-6 text-[10px] font-black text-neutral-content/40 uppercase tracking-widest">Content Details</th>
                <th className="px-6 py-6 text-[10px] font-black text-neutral-content/40 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-neutral-content/40 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <Reorder.Group axis="y" values={items} onReorder={handleReorder} as="tbody" className="divide-y divide-slate-100">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-4 text-neutral-content/20">
                      <ImageIcon className="w-12 h-12" />
                      <p className="font-bold uppercase tracking-widest text-xs">No banners added yet</p>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((banner: IBanner, index: number) => (
                  <Reorder.Item 
                    key={banner._id} 
                    value={banner}
                    as="tr"
                    className="group hover:bg-slate-50/50 transition-colors cursor-default"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3 text-neutral-content/20 group-hover:text-neutral-content/60 transition-colors">
                        <GripVertical className="w-5 h-5 cursor-grab active:cursor-grabbing" />
                        <span className="font-mono font-bold">#{(index + 1).toString().padStart(2, '0')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="w-48 h-24 rounded-2xl overflow-hidden border border-surface-container bg-slate-100 relative group/img">
                        <img 
                          src={banner.imageUrl} 
                          alt="" 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110" 
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity" />
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="space-y-1">
                        <p className="text-sm font-black text-neutral-content uppercase tracking-tight">{banner.title || 'Untitled Banner'}</p>
                        <p className="text-[10px] font-bold text-neutral-content/40 truncate max-w-[250px]">{banner.subtitle || 'No subtitle provided'}</p>
                        {banner.ctaText && (
                          <div className="inline-flex items-center gap-2 mt-2 px-2 py-0.5 bg-brand-primary/10 rounded-full">
                            <span className="text-[8px] font-black text-brand-primary uppercase tracking-tighter">CTA: {banner.ctaText}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex justify-center">
                        <button 
                          onClick={() => toggleActiveMutation.mutate({ id: banner._id, isActive: !banner.isActive })}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                            banner.isActive 
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                              : 'bg-slate-50 text-slate-400 border border-slate-100'
                          }`}
                        >
                          {banner.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {banner.isActive ? 'Active' : 'Hidden'}
                        </button>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => navigate(`/admin/hero-banners/${banner._id}/edit`)}
                          className="p-3 text-neutral-content/40 hover:text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-all"
                        >
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this banner?')) {
                              deleteMutation.mutate(banner._id);
                            }
                          }}
                          className="p-3 text-neutral-content/40 hover:text-error hover:bg-error/5 rounded-xl transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </Reorder.Item>
                ))
              )}
            </Reorder.Group>
          </table>
        </div>
      </div>
    </div>
  );
};
