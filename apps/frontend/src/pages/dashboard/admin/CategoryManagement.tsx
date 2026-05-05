import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Search,  
  Edit3, 
  Trash2, 
  ChevronRight, 
  Loader2,
  Tag,
  Save,
  X,
  Upload,
  ImageIcon
} from 'lucide-react';
import { resolveMediaUrl } from '../../../utils/media';
import { AdminService } from '../../../services/admin.service';
import { Button } from '../../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export const CategoryManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', parentId: '', image_url: '' });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: AdminService.getCategories,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => AdminService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setIsModalOpen(false);
      setFormData({ name: '', slug: '', description: '', parentId: '', image_url: '' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => AdminService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setIsModalOpen(false);
      setEditingCategory(null);
      setFormData({ name: '', slug: '', description: '', parentId: '', image_url: '' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => AdminService.deleteCategory(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
  });

  const categories = data?.data?.categories || data?.data || [];

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      parentId: category.parentId || '',
      image_url: category.image_url || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Artist Categories</h1>
          <p className="text-slate-500 font-medium text-sm tracking-wide mt-1">Manage global artist taxonomy</p>
        </div>
        <Button onClick={() => { setEditingCategory(null); setIsModalOpen(true); }} className="bg-brand-orange hover:bg-brand-orangeHover text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-brand-orange/20 flex items-center gap-2 transition-all">
          <Plus className="w-4 h-4" /> Add Category
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
           <div className="flex items-center gap-4 flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search categories..."
                className="bg-transparent border-none text-sm font-semibold text-slate-900 focus:outline-none w-full placeholder:text-slate-500"
              />
           </div>
           <div className="flex items-center gap-6">
              <div className="text-right">
                 <p className="text-sm font-bold text-slate-900">{categories.length}</p>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Categories</p>
              </div>
           </div>
        </div>

        <div className="p-0">
           {isLoading ? (
             <div className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-orange" /></div>
           ) : (
             <div className="divide-y divide-slate-100">
                {categories.map((category: any) => (
                  <div key={category._id} className="p-6 hover:bg-slate-50 transition-all group flex items-center justify-between">
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-brand-orange transition-colors border border-slate-200 overflow-hidden">
                           {category.image_url ? (
                             <img src={resolveMediaUrl(category.image_url)} alt={category.name} className="w-full h-full object-cover" />
                           ) : (
                             <Tag className="w-5 h-5" />
                           )}
                        </div>
                        <div>
                           <div className="flex items-center gap-3">
                              <h4 className="text-sm font-bold text-slate-900 tracking-tight">{category.name}</h4>
                              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">/{category.slug}</span>
                           </div>
                           <p className="text-xs font-medium text-slate-500 mt-1">{category.description || 'No description provided.'}</p>
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                        <button 
                          onClick={() => handleEdit(category)}
                          className="p-3 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-400 hover:text-brand-blue transition-all shadow-sm"
                        >
                           <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => { if(confirm('Delete category?')) deleteMutation.mutate(category._id) }}
                          className="p-3 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-xl text-slate-400 hover:text-brand-error transition-all shadow-sm"
                        >
                           <Trash2 className="w-4 h-4" />
                        </button>
                        <ChevronRight className="w-4 h-4 text-slate-300 ml-2" />
                     </div>
                  </div>
                ))}
             </div>
           )}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-slate-200 rounded-[32px] w-full max-w-lg relative z-10 shadow-2xl overflow-hidden"
            >
               <form onSubmit={handleSubmit}>
                  <div className="p-8 border-b border-slate-200 flex items-center justify-between">
                     <h3 className="text-xl font-bold text-slate-900 tracking-tight">{editingCategory ? 'Edit Category' : 'Create Category'}</h3>
                     <button type="button" onClick={() => { setIsModalOpen(false); setFormData({ name: '', slug: '', description: '', parentId: '', image_url: '' }); }} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-colors"><X className="w-5 h-5" /></button>
                  </div>
                  
                  <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Category Image</label>
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          className="aspect-[16/9] bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-brand-orange transition-all overflow-hidden relative group"
                        >
                           {formData.image_url ? (
                             <>
                               <img src={resolveMediaUrl(formData.image_url)} alt="Preview" className="w-full h-full object-cover" />
                               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                 <Upload className="w-8 h-8 text-white" />
                               </div>
                             </>
                           ) : uploading ? (
                             <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
                           ) : (
                             <>
                               <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-300 group-hover:text-brand-orange transition-colors shadow-sm">
                                 <ImageIcon className="w-6 h-6" />
                               </div>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Click to upload image</p>
                             </>
                           )}
                           <input 
                             type="file" 
                             ref={fileInputRef}
                             className="hidden" 
                             accept="image/*"
                             onChange={async (e) => {
                               const file = e.target.files?.[0];
                               if (!file) return;
                               const fd = new FormData();
                               fd.append('categoryImage', file);
                               setUploading(true);
                               try {
                                 const res = await AdminService.uploadCategoryImage(fd);
                                 setFormData({...formData, image_url: res.data.url});
                               } catch (err) {
                                 console.error(err);
                               } finally {
                                 setUploading(false);
                               }
                             }}
                           />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Category Name</label>
                        <input 
                          type="text" 
                          required
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-blue focus:bg-white focus:ring-4 focus:ring-brand-blue/10 transition-all"
                          placeholder="e.g. Celebrity Anchors"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">URL Slug</label>
                        <div className="relative">
                           <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">/</span>
                           <input 
                             type="text" 
                             required
                             className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-10 py-4 text-sm font-mono text-brand-orange focus:outline-none focus:border-brand-blue focus:bg-white focus:ring-4 focus:ring-brand-blue/10 transition-all"
                             placeholder="celebrity-anchors"
                             value={formData.slug}
                             onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/ /g, '-')})}
                           />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Description</label>
                        <textarea 
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-blue focus:bg-white focus:ring-4 focus:ring-brand-blue/10 transition-all resize-none h-24"
                          placeholder="Brief description for SEO and system context..."
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                     </div>

                     <div className="pt-4">
                        <Button 
                          type="submit"
                          disabled={createMutation.isPending || updateMutation.isPending}
                          className="w-full bg-brand-orange hover:bg-brand-orangeHover text-white font-bold py-4 rounded-2xl shadow-lg shadow-brand-orange/20 flex items-center justify-center gap-3 transition-all"
                        >
                           {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4" /> {editingCategory ? 'Update Category' : 'Create Category'}</>}
                        </Button>
                     </div>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
