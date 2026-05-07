import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Upload, Loader2, Check, Link as LinkIcon, Type, AlignLeft } from 'lucide-react';
import { AdminService } from '../../../../services/admin.service';
import { toast } from 'react-hot-toast';
import { resolveMediaUrl } from '../../../../utils/media';

export const CreateHeroBanner: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditMode = !!id;

  interface IBanner {
    _id: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    ctaText: string;
    ctaLink: string;
    isActive: boolean;
    openInNewTab: boolean;
    sortOrder: number;
  }

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    ctaText: '',
    ctaLink: '',
    isActive: true,
    openInNewTab: false,
    sortOrder: 0,
  });

  const [uploading, setUploading] = useState(false);

  const { data: bannerResponse, isLoading: isLoadingBanner } = useQuery({
    queryKey: ['admin-hero-banner', id],
    queryFn: () => AdminService.getHeroBanners(), // We'll filter in useEffect or ideally have a single get API
    enabled: isEditMode,
  });

  useEffect(() => {
    if (isEditMode && bannerResponse?.data) {
      const banner = bannerResponse.data.find((b: IBanner) => b._id === id);
      if (banner) {
        setFormData({
          title: banner.title || '',
          subtitle: banner.subtitle || '',
          imageUrl: banner.imageUrl || '',
          ctaText: banner.ctaText || '',
          ctaLink: banner.ctaLink || '',
          isActive: banner.isActive,
          openInNewTab: banner.openInNewTab || false,
          sortOrder: banner.sortOrder || 0,
        });
      }
    }
  }, [isEditMode, bannerResponse, id]);

  const saveMutation = useMutation({
    mutationFn: (data: any) =>
      isEditMode ? AdminService.updateHeroBanner(id!, data) : AdminService.createHeroBanner(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-hero-banners'] });
      toast.success(isEditMode ? 'Banner updated' : 'Banner created');
      navigate('/admin/hero-banners');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to save banner');
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append('bannerImage', file);

    setUploading(true);
    try {
      const res = await AdminService.uploadHeroBannerImage(fd);
      setFormData((prev) => ({ ...prev, imageUrl: res.imageUrl }));
      toast.success('Image uploaded');
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      toast.error('Image is required');
      return;
    }
    saveMutation.mutate(formData);
  };

  if (isEditMode && isLoadingBanner) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/hero-banners')}
          className="p-3 bg-white border border-surface-container rounded-2xl text-neutral-content/40 hover:text-neutral-content hover:shadow-md transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-neutral-content tracking-tighter uppercase">
            {isEditMode ? 'Edit' : 'Add'} Hero Banner
          </h1>
          <p className="text-[10px] font-black text-neutral-content/40 uppercase tracking-[0.3em] mt-1">
            {isEditMode ? 'Modify existing visual asset' : 'Design a new cinematic entrance'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image Preview & Upload */}
        <div className="lg:col-span-1 space-y-6">
          <label className="text-[10px] font-black text-neutral-content/40 uppercase tracking-widest ml-1">
            Banner Image (16:9 Recommended)
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="aspect-[16/9] bg-[#F8F9FA] border-2 border-dashed border-surface-container rounded-[32px] flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-brand-primary transition-all group overflow-hidden relative"
          >
            {formData.imageUrl ? (
              <>
                <img
                  src={resolveMediaUrl(formData.imageUrl)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2">
                  <Upload className="w-8 h-8" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Replace Image
                  </span>
                </div>
              </>
            ) : uploading ? (
              <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
            ) : (
              <>
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-neutral-content/20 group-hover:text-brand-primary transition-colors shadow-sm">
                  <Upload className="w-8 h-8" />
                </div>
                <div className="text-center px-6">
                  <p className="text-[10px] font-black text-neutral-content/40 uppercase tracking-widest">
                    Click to upload banner
                  </p>
                  <p className="text-[8px] font-bold text-neutral-content/20 uppercase mt-1">
                    JPG, PNG up to 5MB
                  </p>
                </div>
              </>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
            />
          </div>

          <div className="bg-white border border-surface-container rounded-[32px] p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-black text-neutral-content uppercase tracking-tight">
                  Active Status
                </p>
                <p className="text-[10px] font-bold text-neutral-content/40">Visible on homepage</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData((p) => ({ ...p, isActive: !p.isActive }))}
                className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${formData.isActive ? 'bg-emerald-500' : 'bg-slate-200'}`}
              >
                <div
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${formData.isActive ? 'translate-x-6' : ''}`}
                ></div>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-black text-neutral-content uppercase tracking-tight">
                  Open in New Tab
                </p>
                <p className="text-[10px] font-bold text-neutral-content/40">
                  For external CTA links
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFormData((p) => ({ ...p, openInNewTab: !p.openInNewTab }))}
                className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${formData.openInNewTab ? 'bg-brand-primary' : 'bg-slate-200'}`}
              >
                <div
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${formData.openInNewTab ? 'translate-x-6' : ''}`}
                ></div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Content Form */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-surface-container rounded-[40px] p-10 space-y-8">
            <div className="grid grid-cols-1 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-content/40 uppercase tracking-widest ml-1">
                  Main Heading (Title)
                </label>
                <div className="relative">
                  <Type className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-content/20" />
                  <input
                    type="text"
                    placeholder="e.g. Discover Global Superstars"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[#F8F9FA] border border-transparent rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-neutral-content focus:outline-none focus:border-brand-primary transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-content/40 uppercase tracking-widest ml-1">
                  Subtitle / Description
                </label>
                <div className="relative">
                  <AlignLeft className="absolute left-5 top-5 w-5 h-5 text-neutral-content/20" />
                  <textarea
                    placeholder="e.g. Book verified artists for your next high-impact event with ease."
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    rows={3}
                    className="w-full bg-[#F8F9FA] border border-transparent rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-neutral-content focus:outline-none focus:border-brand-primary transition-all resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-neutral-content/40 uppercase tracking-widest ml-1">
                    CTA Button Text
                  </label>
                  <div className="relative">
                    <Check className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-content/20" />
                    <input
                      type="text"
                      placeholder="e.g. Browse Artists"
                      value={formData.ctaText}
                      onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                      className="w-full bg-[#F8F9FA] border border-transparent rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-neutral-content focus:outline-none focus:border-brand-primary transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-neutral-content/40 uppercase tracking-widest ml-1">
                    CTA Redirect Link
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-content/20" />
                    <input
                      type="text"
                      placeholder="e.g. /artists or https://..."
                      value={formData.ctaLink}
                      onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                      className="w-full bg-[#F8F9FA] border border-transparent rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-neutral-content focus:outline-none focus:border-brand-primary transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-content/40 uppercase tracking-widest ml-1">
                  Manual Display Order
                </label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) =>
                    setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })
                  }
                  className="w-full bg-[#F8F9FA] border border-transparent rounded-2xl py-4 px-6 text-sm font-bold text-neutral-content focus:outline-none focus:border-brand-primary transition-all"
                />
                <p className="text-[9px] font-bold text-neutral-content/30 uppercase tracking-tighter ml-1">
                  Lower numbers appear first in the slider.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={saveMutation.isPending || uploading}
              className="flex-1 bg-brand-primary hover:bg-brand-primaryContainer text-white py-5 rounded-[24px] font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {saveMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Check className="w-5 h-5 stroke-[3]" />
              )}
              <span>{isEditMode ? 'Update Blueprint' : 'Launch Banner'}</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/hero-banners')}
              className="px-10 bg-[#F8F9FA] border border-surface-container text-neutral-content/40 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-white hover:text-neutral-content transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
