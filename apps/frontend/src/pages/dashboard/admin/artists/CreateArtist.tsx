import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  Loader2,
  X,
  Plus,
  Info,
  Check,
  Edit3,
  ImageIcon,
  Upload,
  Trash2,
  Youtube,
  Link as LinkIcon,
  FileText,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminService } from '../../../../services/admin.service';
import { resolveMediaUrl } from '../../../../utils/media';

const ARTIST_STEPS = [
  { id: 1, key: 'identity', label: 'Identity' },
  { id: 2, key: 'profile', label: 'Profile' },
  { id: 3, key: 'media', label: 'Media Assets' },
  { id: 4, key: 'commercial', label: 'Commercial' },
  { id: 5, key: 'review', label: 'Review' },
] as const;

// removed unused StepKey

const BOOKING_TYPES = [
  'Local Event',
  'Corporate Event',
  'Wedding',
  'College Fest',
  'Private Party',
  'International Show',
];

const BIO_EDITOR_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    ['blockquote', 'link'],
    ['clean'],
  ],
};

const BIO_EDITOR_FORMATS = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'color',
  'background',
  'align',
  'list',
  'bullet',
  'indent',
  'blockquote',
  'link',
];

const getPlainTextLength = (html: string) => {
  const text = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  return text.length;
};

const ReviewStat = ({ label, value }: { label: string; value: string | number }) => (
  <div className="bg-white border border-surface-container rounded-2xl p-6 text-center shadow-sm">
    <p className="text-2xl font-black text-neutral-content">{value}</p>
    <p className="text-[10px] font-black text-neutral-content/30 uppercase tracking-widest mt-1">
      {label}
    </p>
  </div>
);

export const CreateArtist: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
  const [categories, setCategories] = useState<any[]>([]);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    stageName: '',
    categoryId: '',
    city: '',
    state: '',
    shortBio: '',
    longBio: '',
    premiumHighlights: [] as string[],
    profilePicture: '',
    portfolioGallery: [] as string[],
    youtubeLinks: [] as string[],
    brochure: '',
    priceRange: { min: '', max: '' },
    bookingTypes: [] as string[],
    pricingNotes: '',
    isPublished: true,
    isFeatured: false,
    showOnHome: false,
  });

  const [highlightInput, setHighlightInput] = useState('');
  const [videoLinkInput, setVideoLinkInput] = useState('');

  const profileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const brochureInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const queryClient = useQueryClient();

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const {
    data: artistData,
    isLoading: isFetchingArtist,
    isError,
    error: fetchError,
    refetch,
  } = useQuery({
    queryKey: ['admin-artist', id],
    queryFn: () => AdminService.getArtist(id!),
    enabled: isEditMode && !!id,
    retry: 1,
  });

  useEffect(() => {
    // Fetch Categories (Always needed)
    AdminService.getCategories()
      .then((res) => setCategories(res.data?.categories || []))
      .catch(() => console.error('Failed to fetch categories'));
  }, []);

  useEffect(() => {
    if (artistData?.data?.artist) {
      const artist = artistData.data.artist;

      // Resume Flow: Jump to the last active step from DB
      if (artist.currentStep) {
        const resumeStep = ARTIST_STEPS.find((s) => s.key === artist.currentStep);
        if (resumeStep) setActiveStep(resumeStep.id);
      }
      // Hydrate form state with production-grade safety defaults
      setFormData({
        name: artist.name || '',
        stageName: artist.stageName || '',
        categoryId: artist.categoryId?._id || artist.categoryId || '',
        city: artist.city || '',
        state: artist.state || '',
        shortBio: artist.shortBio || '',
        longBio: artist.longBio || '',
        premiumHighlights: artist.premiumHighlights || [],
        profilePicture: artist.profileImage || '',
        portfolioGallery: artist.gallery || [],
        youtubeLinks: artist.videoLinks || [],
        brochure: artist.brochureFile || '',
        priceRange: {
          min: artist.priceRange?.min?.toString() || '',
          max: artist.priceRange?.max?.toString() || '',
        },
        bookingTypes: artist.bookingTypes || [],
        pricingNotes: artist.pricingNotes || '',
        isPublished: artist.isPublished ?? false,
        isFeatured: artist.isFeatured || false,
        showOnHome: artist.showOnHome || false,
      });
    }
  }, [artistData]);

  // Handle Fetch Errors
  useEffect(() => {
    if (isError) {
      const msg =
        (fetchError as any)?.response?.data?.message || 'Failed to fetch artist profile details';
      showToast('error', msg);
    }
  }, [isError, fetchError]);

  // removed unused steps array

  const validateStep = (step: number) => {
    const errs: Record<string, string> = {};
    if (step === 1) {
      if (!formData.name) errs.name = 'Full name required';
      if (!formData.stageName) errs.stageName = 'Stage name required';
      if (!formData.categoryId) errs.categoryId = 'Category required';
      if (!formData.city) errs.city = 'City required';
    } else if (step === 2) {
      if (!formData.shortBio || formData.shortBio.length < 10)
        errs.shortBio = 'Bio must be at least 10 chars';
      if (!formData.longBio || getPlainTextLength(formData.longBio) < 50)
        errs.longBio = 'Story must be at least 50 chars';
    } else if (step === 3) {
      if (!formData.profilePicture) errs.profilePicture = 'Profile image required';
    } else if (step === 4) {
      if (!formData.priceRange.min) errs.priceRangeMin = 'Price floor required';
      if (!formData.priceRange.max) errs.priceRangeMax = 'Price ceiling required';
      if (Number(formData.priceRange.max) < Number(formData.priceRange.min))
        errs.priceRangeMax = 'Ceiling cannot be less than floor';
    }
    return errs;
  };

  const handleNextStep = async () => {
    const stepErrors = validateStep(activeStep);
    if (Object.keys(stepErrors).length > 0) {
      showToast('error', 'Please complete required fields for this step');
      return;
    }

    if (activeStep < 5) {
      if (isEditMode && id) {
        setIsLoading(true);
        try {
          const stepKey = ARTIST_STEPS[activeStep - 1].key;
          // Coerce priceRange values to numbers.
          const stepPayload = {
            ...formData,
            priceRange: {
              min: Number(formData.priceRange?.min) || 0,
              max: Number(formData.priceRange?.max) || 0,
            },
          };
          await AdminService.updateArtistStep(id, stepKey, stepPayload);
          setActiveStep(activeStep + 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err: any) {
          showToast('error', err.response?.data?.message || 'Failed to save progress');
        } finally {
          setIsLoading(false);
        }
      } else {
        // For new artists, we can either save locally or provision on Step 1
        if (activeStep === 1) {
          // Optionally provision artist here to enable persistence from step 1
          setActiveStep(activeStep + 1);
        } else {
          setActiveStep(activeStep + 1);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      handleFinalSubmit();
    }
  };

  const handlePrevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinalSubmit = async () => {
    // Basic validation before sync
    if (!formData.name || !formData.stageName || !formData.categoryId) {
      showToast('error', 'Please complete Identity Blueprint (Step 1)');
      setActiveStep(1);
      return;
    }
    if (!formData.shortBio || !formData.longBio) {
      showToast('error', 'Please complete Profile Blueprint (Step 2)');
      setActiveStep(2);
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        profileImage: formData.profilePicture,
        gallery: formData.portfolioGallery,
        videoLinks: formData.youtubeLinks,
        brochureFile: formData.brochure,
        trustIndicators: [],
        premiumTier: 'STANDARD',
        priceRange: {
          min: Number(formData.priceRange.min) || 0,
          max: Number(formData.priceRange.max) || 0,
        },
        verificationStatus: formData.isPublished ? 'PUBLISHED' : 'DRAFT',
      };

      if (isEditMode) {
        await AdminService.updateArtist(id!, payload);
        queryClient.invalidateQueries({ queryKey: ['admin-artist', id] });
        queryClient.invalidateQueries({ queryKey: ['admin-artists'] });
        showToast('success', 'Artist profile updated successfully');
      } else {
        await AdminService.provisionArtist(payload);
        queryClient.invalidateQueries({ queryKey: ['admin-artists'] });
        showToast('success', 'New artist provisioned successfully');
      }
      setTimeout(() => navigate('/admin/artists'), 2000);
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || err?.message || 'Synchronization failed';
      showToast('error', `Error: ${errorMsg}`);
      console.error('Finalize Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Tag Management
  const addTag = (field: 'premiumHighlights', value: string, setter: (v: string) => void) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData((prev) => ({ ...prev, [field]: [...prev[field], value.trim()] }));
      setter('');
    }
  };

  const removeTag = (field: 'premiumHighlights', idx: number) => {
    setFormData((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== idx) }));
  };

  // Media Handlers
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'profile' | 'gallery' | 'brochure',
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading((prev) => ({ ...prev, [type]: true }));
    try {
      const fd = new FormData();
      if (type === 'profile') {
        fd.append('profileImage', files[0]);
        const res = await AdminService.uploadProfileImage(fd);
        setFormData((prev) => ({ ...prev, profilePicture: res.data.url }));
        showToast('success', 'Profile portrait uploaded');
      } else if (type === 'gallery') {
        Array.from(files).forEach((f) => fd.append('galleryImages', f));
        const res = await AdminService.uploadGalleryImages(fd);
        setFormData((prev) => ({
          ...prev,
          portfolioGallery: [...prev.portfolioGallery, ...res.data.urls],
        }));
        showToast('success', 'Media assets added to gallery');
      } else {
        fd.append('brochure', files[0]);
        const res = await AdminService.uploadBrochure(fd);
        setFormData((prev) => ({ ...prev, brochure: res.data.url }));
        showToast('success', 'Artist brochure uploaded');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Upload failed';
      showToast('error', msg);
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
      if (e.target) e.target.value = '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 md:space-y-12 pb-20 font-sans px-4 md:px-0">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className={`fixed top-8 left-1/2 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border ${
              toast.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-rose-50 border-rose-200 text-rose-700'
            }`}
          >
            {toast.type === 'success' ? (
              <Check className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="text-sm font-bold tracking-tight">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PROGRESS BAR & STEP INDICATOR */}
      <div className="bg-white border border-surface-container rounded-[32px] p-8 md:p-10 mb-10 md:mb-12 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary">
              {isEditMode ? <Edit3 className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-content tracking-tighter">
                {isEditMode ? 'Edit Artist Profile' : 'Initialize New Artist'}
              </h1>
              <p className="text-xs font-bold text-neutral-content/40 uppercase tracking-widest mt-1">
                Step {activeStep} of 5: {ARTIST_STEPS[activeStep - 1].label}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="text-[10px] font-black uppercase tracking-widest text-neutral-content/40">
              Onboarding Completion
            </div>
            <div className="flex items-center gap-4">
              <div className="w-48 h-2.5 bg-[#F8F9FA] rounded-full overflow-hidden border border-neutral-content/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(activeStep / 5) * 100}%` }}
                  className="h-full bg-brand-primary"
                />
              </div>
              <span className="text-sm font-bold text-brand-primary">
                {Math.round((activeStep / 5) * 100)}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-neutral-content/5 -z-10 mx-6" />
          {ARTIST_STEPS.map((step) => (
            <div
              key={step.id}
              onClick={() => {
                if (step.id < activeStep) setActiveStep(step.id);
              }}
              className="flex flex-col items-center gap-3 cursor-pointer group"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black transition-all duration-500 border-2 ${
                  activeStep === step.id
                    ? 'bg-brand-primary border-brand-primary text-white shadow-xl shadow-brand-primary/20 scale-110'
                    : activeStep > step.id
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'bg-white border-neutral-content/10 text-neutral-content/40 group-hover:border-neutral-content/20'
                }`}
              >
                {activeStep > step.id ? <Check className="w-5 h-5 stroke-[3]" /> : step.id}
              </div>
              <span
                className={`text-[10px] font-black uppercase tracking-widest hidden md:block ${
                  activeStep === step.id
                    ? 'text-brand-primary'
                    : activeStep > step.id
                      ? 'text-emerald-500'
                      : 'text-neutral-content/30'
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. STEP CONTENT CARD */}
      <div className="bg-white border border-surface-container rounded-[24px] md:rounded-[40px] shadow-sm overflow-hidden min-h-[600px]">
        {/* Step Header */}
        <div className="p-6 md:p-10 border-b border-surface-container flex flex-col md:flex-row items-center justify-between bg-[#F8F9FA]/30 gap-4">
          <div className="space-y-1 text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-bold text-neutral-content tracking-tight">
              Step {activeStep}: {ARTIST_STEPS[activeStep - 1].label} Blueprint
            </h2>
            <p className="text-xs md:text-sm font-medium text-neutral-content/40">
              {activeStep === 1 && 'Basic identification and categorical data'}
              {activeStep === 2 && 'Biography and performance narrative'}
              {activeStep === 3 && 'Visual assets and media integration'}
              {activeStep === 4 && 'Financial terms and booking capability'}
              {activeStep === 5 && 'Review and finalize profile blueprint'}
            </p>
          </div>
          <div className="bg-[#FDF0E9] px-4 py-2 rounded-full border border-brand-primary/10 flex items-center gap-2">
            <Info className="w-3 h-3 md:w-4 md:h-4 text-brand-primary" />
            <span className="text-[9px] md:text-[10px] font-black text-brand-primary uppercase tracking-widest">
              Required Step
            </span>
          </div>
        </div>

        {/* Step Body */}
        <div className="p-6 md:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-10 md:space-y-12"
            >
              {isFetchingArtist && isEditMode && activeStep === 1 && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
                  <p className="text-xs font-black uppercase tracking-widest text-neutral-content/40">
                    Hydrating Artist Blueprint...
                  </p>
                </div>
              )}

              {isError && isEditMode && (
                <div className="bg-rose-50 border border-rose-200 rounded-3xl p-10 text-center space-y-6">
                  <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-rose-900">Unable to load artist</h3>
                    <p className="text-sm text-rose-700/60 font-medium max-w-sm mx-auto">
                      The blueprint for this artist could not be retrieved from the main server.
                    </p>
                  </div>
                  <button
                    onClick={() => refetch()}
                    className="bg-rose-500 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-600 transition-all active:scale-95 shadow-lg shadow-rose-500/20"
                  >
                    Retry Fetch
                  </button>
                </div>
              )}
              {/* STEP 1: IDENTITY */}
              {activeStep === 1 && (
                <div className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 md:gap-y-10">
                    <InputField
                      label="Full Legal Name"
                      placeholder="e.g. Jonathan David Smith"
                      value={formData.name}
                      onChange={(v) => setFormData({ ...formData, name: v })}
                    />
                    <InputField
                      label="Stage/Brand Name"
                      placeholder="e.g. J-Swift"
                      value={formData.stageName}
                      onChange={(v) => setFormData({ ...formData, stageName: v })}
                    />
                    <div className="space-y-2 md:space-y-3">
                      <label className="text-[9px] md:text-[10px] font-black text-neutral-content/40 uppercase tracking-widest ml-1">
                        Artist Category
                      </label>
                      <select
                        className="w-full bg-[#F8F9FA] border border-transparent rounded-xl md:rounded-2xl py-3.5 md:py-4 px-5 md:px-6 text-sm font-bold text-neutral-content focus:outline-none focus:bg-white focus:border-brand-primary transition-all"
                        value={formData.categoryId}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat: any) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <InputField
                      label="Base City"
                      placeholder="e.g. Mumbai"
                      value={formData.city}
                      onChange={(v) => setFormData({ ...formData, city: v })}
                    />
                    <InputField
                      label="State"
                      placeholder="e.g. Maharashtra"
                      value={formData.state}
                      onChange={(v) => setFormData({ ...formData, state: v })}
                    />
                    <div className="space-y-2 md:space-y-3">
                      <label className="text-[9px] md:text-[10px] font-black text-neutral-content/40 uppercase tracking-widest ml-1">
                        Live Status
                      </label>
                      <div className="bg-[#F8F9FA] rounded-xl md:rounded-2xl py-3.5 md:py-4 px-5 md:px-6 flex flex-col gap-4 border border-transparent">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-neutral-content/60">
                            Visible to Public
                          </span>
                          <button
                            onClick={() => {
                              const newState = !formData.isPublished;
                              setFormData((prev) => ({
                                ...prev,
                                isPublished: newState,
                                showOnHome: newState ? prev.showOnHome : false,
                              }));
                            }}
                            className={`w-10 md:w-12 h-5 md:h-6 rounded-full relative transition-colors duration-300 ${formData.isPublished ? 'bg-brand-primary' : 'bg-neutral-content/20'}`}
                          >
                            <div
                              className={`absolute top-0.5 md:top-1 left-0.5 md:left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${formData.isPublished ? 'translate-x-5 md:translate-x-6' : ''}`}
                            ></div>
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-neutral-content/60">
                            Featured Artist
                          </span>
                          <button
                            onClick={() =>
                              setFormData({ ...formData, isFeatured: !formData.isFeatured })
                            }
                            className={`w-10 md:w-12 h-5 md:h-6 rounded-full relative transition-colors duration-300 ${formData.isFeatured ? 'bg-emerald-500' : 'bg-neutral-content/20'}`}
                          >
                            <div
                              className={`absolute top-0.5 md:top-1 left-0.5 md:left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${formData.isFeatured ? 'translate-x-5 md:translate-x-6' : ''}`}
                            ></div>
                          </button>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <div className="space-y-1">
                            <span className="block text-sm font-bold text-neutral-content/60">
                              Popular
                            </span>
                            <span className="block text-[10px] font-black uppercase tracking-widest text-neutral-content/30">
                              Show in Home page Popular Picks
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              if (!formData.isPublished && !formData.showOnHome) {
                                showToast(
                                  'error',
                                  'Only published artists can appear in Popular Picks',
                                );
                                return;
                              }
                              setFormData({ ...formData, showOnHome: !formData.showOnHome });
                            }}
                            className={`w-10 md:w-12 h-5 md:h-6 rounded-full relative transition-colors duration-300 ${formData.showOnHome ? 'bg-brand-secondary' : 'bg-neutral-content/20'}`}
                          >
                            <div
                              className={`absolute top-0.5 md:top-1 left-0.5 md:left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${formData.showOnHome ? 'translate-x-5 md:translate-x-6' : ''}`}
                            ></div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: PROFILE */}
              {activeStep === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                  <div className="space-y-10">
                    <InputField
                      label="Hook Line (Short Bio)"
                      placeholder="A premium one-line punchline..."
                      value={formData.shortBio}
                      onChange={(v) => setFormData({ ...formData, shortBio: v })}
                    />
                    <div className="space-y-3">
                      <label className="block text-[10px] font-black text-neutral-content/40 uppercase tracking-widest ml-1">
                        Comprehensive Story
                      </label>
                      <div className="bg-white rounded-[24px] border border-surface-container overflow-hidden [&_.ql-toolbar]:border-none [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-surface-container [&_.ql-toolbar]:bg-[#F8F9FA] [&_.ql-container]:border-none [&_.ql-editor]:min-h-[380px] [&_.ql-editor]:text-sm [&_.ql-editor]:font-medium [&_.ql-editor]:text-neutral-content [&_.ql-editor]:leading-7 [&_.ql-editor_p]:mb-3 [&_.ql-editor_h1]:text-3xl [&_.ql-editor_h1]:font-bold [&_.ql-editor_h2]:text-2xl [&_.ql-editor_h2]:font-bold [&_.ql-editor_h3]:text-xl [&_.ql-editor_h3]:font-bold [&_.ql-editor_ul]:pl-6 [&_.ql-editor_ol]:pl-6">
                        <ReactQuill
                          theme="snow"
                          value={formData.longBio}
                          onChange={(content: string) => setFormData({ ...formData, longBio: content })}
                          modules={BIO_EDITOR_MODULES}
                          formats={BIO_EDITOR_FORMATS}
                          preserveWhitespace
                          placeholder="Describe the artist's legacy, major achievements, and unique style..."
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-10">
                    <TagArea
                      label="Premium Highlights"
                      placeholder="e.g. Voted Best DJ 2023"
                      input={highlightInput}
                      setInput={setHighlightInput}
                      tags={formData.premiumHighlights}
                      onAdd={() => addTag('premiumHighlights', highlightInput, setHighlightInput)}
                      onRemove={(i) => removeTag('premiumHighlights', i)}
                    />
                    <div className="bg-brand-secondary/5 border border-brand-secondary/10 rounded-3xl p-8 space-y-4">
                      <div className="flex items-center gap-3 text-brand-secondary">
                        <ShieldCheck className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          Profile Authority
                        </span>
                      </div>
                      <p className="text-[11px] font-medium text-neutral-content/60 leading-relaxed uppercase tracking-wide">
                        Premium highlights appear in the booking interface to maximize conversion
                        for this talent. Add each highlight separately for clean spacing.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: MEDIA ASSETS */}
              {activeStep === 3 && (
                <div className="space-y-16">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div className="space-y-8">
                      <label className="text-[10px] font-black text-neutral-content/40 uppercase tracking-widest ml-1">
                        Profile Portrait
                      </label>
                      <div className="bg-[#F8F9FA] border border-transparent rounded-[40px] p-8">
                        <div
                          onClick={() => profileInputRef.current?.click()}
                          className="w-full aspect-square bg-white border-2 border-dashed border-surface-container rounded-[32px] flex flex-col items-center justify-center gap-6 cursor-pointer hover:border-brand-primary transition-all relative overflow-hidden group"
                        >
                          {formData.profilePicture ? (
                            <>
                              <img
                                src={resolveMediaUrl(formData.profilePicture)}
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-3">
                                <Upload className="w-8 h-8 text-white" />
                                <span className="text-white text-[10px] font-black uppercase tracking-widest">
                                  Replace Image
                                </span>
                              </div>
                            </>
                          ) : uploading.profile ? (
                            <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
                          ) : (
                            <>
                              <ImageIcon className="w-10 h-10 text-neutral-content/20" />
                              <span className="text-[10px] font-black text-neutral-content/40 uppercase tracking-widest">
                                Upload Portrait
                              </span>
                            </>
                          )}
                          <input
                            type="file"
                            ref={profileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'profile')}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-8">
                      <label className="text-[10px] font-black text-neutral-content/40 uppercase tracking-widest ml-1">
                        Performance Gallery
                      </label>
                      <div className="bg-[#F8F9FA] border border-transparent rounded-[40px] p-8 min-h-[400px]">
                        <div className="grid grid-cols-2 gap-6">
                          {formData.portfolioGallery.map((url, i) => (
                            <div
                              key={i}
                              className="aspect-[4/5] bg-white rounded-2xl relative overflow-hidden group border border-surface-container shadow-sm"
                            >
                              <img
                                src={resolveMediaUrl(url)}
                                alt="Gallery"
                                className="w-full h-full object-cover"
                              />
                              <button
                                onClick={() =>
                                  setFormData((p) => ({
                                    ...p,
                                    portfolioGallery: p.portfolioGallery.filter((u) => u !== url),
                                  }))
                                }
                                className="absolute top-2 right-2 p-2 bg-white rounded-lg text-error opacity-0 group-hover:opacity-100 transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <div
                            onClick={() => galleryInputRef.current?.click()}
                            className="aspect-[4/5] bg-white border-2 border-dashed border-surface-container rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-brand-primary transition-all text-neutral-content/20"
                          >
                            {uploading.gallery ? (
                              <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                              <Plus className="w-8 h-8" />
                            )}
                            <span className="text-[9px] font-black uppercase tracking-widest">
                              Add Media
                            </span>
                            <input
                              type="file"
                              ref={galleryInputRef}
                              className="hidden"
                              multiple
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, 'gallery')}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div className="space-y-8">
                      <label className="text-[10px] font-black text-neutral-content/40 uppercase tracking-widest ml-1">
                        Video Showreel Links
                      </label>
                      <div className="bg-white border border-surface-container rounded-[32px] p-8 space-y-6">
                        <div className="flex gap-4">
                          <div className="flex-1 relative">
                            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-content/20" />
                            <input
                              type="text"
                              placeholder="YouTube/Vimeo URL..."
                              value={videoLinkInput}
                              onChange={(e) => setVideoLinkInput(e.target.value)}
                              className="w-full bg-[#F8F9FA] border border-transparent rounded-2xl py-3.5 pl-12 pr-6 text-sm font-bold text-neutral-content focus:outline-none focus:border-brand-secondary transition-all"
                            />
                          </div>
                          <button
                            onClick={() => {
                              if (videoLinkInput) {
                                setFormData((p) => ({
                                  ...p,
                                  youtubeLinks: [...p.youtubeLinks, videoLinkInput],
                                }));
                                setVideoLinkInput('');
                              }
                            }}
                            className="bg-brand-secondary text-white px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest"
                          >
                            Add
                          </button>
                        </div>
                        <div className="space-y-3">
                          {formData.youtubeLinks.map((link, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-xl text-xs font-bold text-neutral-content/60"
                            >
                              <div className="flex items-center gap-3">
                                <Youtube className="w-4 h-4 text-rose-500" />
                                <span className="truncate max-w-[200px]">{link}</span>
                              </div>
                              <button
                                onClick={() =>
                                  setFormData((p) => ({
                                    ...p,
                                    youtubeLinks: p.youtubeLinks.filter((l) => l !== link),
                                  }))
                                }
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-8">
                      <label className="text-[10px] font-black text-neutral-content/40 uppercase tracking-widest ml-1">
                        Artist Brochure (PDF)
                      </label>
                      <div
                        onClick={() => brochureInputRef.current?.click()}
                        className="h-44 bg-[#F8F9FA] border-2 border-dashed border-surface-container rounded-[32px] flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-brand-primary transition-all group"
                      >
                        {formData.brochure ? (
                          <div className="flex items-center gap-4 text-brand-success">
                            <FileText className="w-10 h-10" />
                            <div className="text-left">
                              <p className="text-sm font-bold text-neutral-content">
                                Brochure Uploaded
                              </p>
                              <p className="text-[10px] font-black uppercase tracking-widest">
                                Click to Replace
                              </p>
                            </div>
                          </div>
                        ) : uploading.brochure ? (
                          <Loader2 className="w-8 h-8 animate-spin" />
                        ) : (
                          <>
                            <FileText className="w-10 h-10 text-neutral-content/20" />
                            <span className="text-[10px] font-black text-neutral-content/40 uppercase tracking-widest">
                              Upload Profile Deck
                            </span>
                          </>
                        )}
                        <input
                          type="file"
                          ref={brochureInputRef}
                          className="hidden"
                          accept=".pdf"
                          onChange={(e) => handleFileUpload(e, 'brochure')}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: COMMERCIAL */}
              {activeStep === 4 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                  <div className="space-y-10">
                    <div className="grid grid-cols-2 gap-6">
                      <InputField
                        label="Price Floor (₹)"
                        placeholder="Min"
                        type="number"
                        value={formData.priceRange.min}
                        onChange={(v) =>
                          setFormData({
                            ...formData,
                            priceRange: { ...formData.priceRange, min: v },
                          })
                        }
                      />
                      <InputField
                        label="Price Ceiling (₹)"
                        placeholder="Max"
                        type="number"
                        value={formData.priceRange.max}
                        onChange={(v) =>
                          setFormData({
                            ...formData,
                            priceRange: { ...formData.priceRange, max: v },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-neutral-content/40 uppercase tracking-widest ml-1">
                        Booking Capability
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {BOOKING_TYPES.map((type) => (
                          <button
                            key={type}
                            onClick={() =>
                              setFormData((p) => ({
                                ...p,
                                bookingTypes: p.bookingTypes.includes(type)
                                  ? p.bookingTypes.filter((t) => t !== type)
                                  : [...p.bookingTypes, type],
                              }))
                            }
                            className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-left border-2 transition-all ${formData.bookingTypes.includes(type) ? 'bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'bg-[#F8F9FA] border-transparent text-neutral-content/60'}`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-10">
                    <div className="space-y-3">
                      <label className="block text-[10px] font-black text-neutral-content/40 uppercase tracking-widest ml-1">
                        Pricing & Logistics Notes
                      </label>
                      <textarea
                        placeholder="Travel, accommodation, and rider requirements..."
                        value={formData.pricingNotes}
                        onChange={(e) => setFormData({ ...formData, pricingNotes: e.target.value })}
                        className="w-full h-44 bg-[#F8F9FA] border border-transparent rounded-[24px] px-6 py-5 text-sm font-semibold text-neutral-content focus:outline-none focus:border-brand-primary transition-all resize-none shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: REVIEW */}
              {activeStep === 5 && (
                <div className="space-y-10">
                  <div className="bg-brand-success/5 border border-brand-success/10 rounded-[32px] p-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-24 h-24 bg-white rounded-3xl overflow-hidden border-2 border-brand-success/20 shadow-sm shrink-0">
                      <img
                        src={resolveMediaUrl(formData.profilePicture)}
                        alt="Final Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-2 text-center md:text-left">
                      <h3 className="text-3xl font-bold text-neutral-content tracking-tight">
                        {formData.stageName}
                      </h3>
                      <p className="text-neutral-content/40 font-medium">
                        {formData.city}, {formData.state} •{' '}
                        {formData.categoryId
                          ? categories.find((c) => c._id === formData.categoryId)?.name
                          : 'Uncategorized'}
                      </p>
                      <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                        <span className="bg-brand-secondary text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                          {formData.isPublished ? 'Live' : 'Draft'}
                        </span>
                      </div>
                    </div>
                    <div className="text-center md:text-right">
                      <p className="text-2xl font-bold text-neutral-content">
                        Rs. {Number(formData.priceRange.min).toLocaleString()} - Rs.{' '}
                        {Number(formData.priceRange.max).toLocaleString()}
                      </p>
                      <p className="text-[10px] font-black text-neutral-content/40 uppercase tracking-widest mt-1">
                        Price Range
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <ReviewStat label="Gallery Items" value={formData.portfolioGallery.length} />
                    <ReviewStat label="Video Assets" value={formData.youtubeLinks.length} />
                    <ReviewStat label="Booking Capabilities" value={formData.bookingTypes.length} />
                  </div>
                  <div className="p-10 bg-[#F8F9FA] rounded-[32px] space-y-4">
                    <h4 className="text-[10px] font-black text-neutral-content/40 uppercase tracking-widest">
                      Administrative Bio Summary
                    </h4>
                    <p className="text-sm font-medium text-neutral-content/60 leading-relaxed">
                      {formData.shortBio || 'No hook line provided.'}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Step Footer */}
        <div className="p-6 md:p-10 border-t border-surface-container flex flex-col md:flex-row items-center justify-between bg-[#F8F9FA]/30 gap-6">
          <button
            onClick={handlePrevStep}
            disabled={activeStep === 1}
            className="w-full md:w-auto flex items-center justify-center gap-3 bg-white border border-surface-container px-8 py-3.5 md:py-4 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-widest text-neutral-content/60 hover:text-neutral-content disabled:opacity-20 transition-all shadow-sm"
          >
            Back
          </button>
          <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-6 md:gap-8">
            <button className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-neutral-content/40 hover:text-neutral-content transition-colors">
              Save Draft
            </button>
            <button
              onClick={handleNextStep}
              disabled={isLoading}
              className="flex-1 md:flex-none bg-brand-primary text-white font-bold px-8 md:px-10 py-3.5 md:py-4 rounded-xl md:rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-brand-primary/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
            >
              {activeStep === 5 ? (
                isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Finalize & Sync'
                )
              ) : (
                <>
                  Next Step <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string | number;
  onChange: (val: string) => void;
  type?: string;
}

const InputField = ({ label, placeholder, value, onChange, type = 'text' }: InputFieldProps) => (
  <div className="space-y-2 md:space-y-3">
    <label className="text-[9px] md:text-[10px] font-black text-neutral-content/40 uppercase tracking-widest ml-1">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full bg-[#F8F9FA] border border-transparent rounded-xl md:rounded-2xl py-3.5 md:py-4 px-5 md:px-6 text-sm font-bold text-neutral-content focus:outline-none focus:bg-white focus:border-brand-primary transition-all"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

interface TagAreaProps {
  label: string;
  placeholder: string;
  input: string;
  setInput: (val: string) => void;
  tags: string[];
  onAdd: () => void;
  onRemove: (idx: number) => void;
}

const TagArea = ({ label, placeholder, input, setInput, tags, onAdd, onRemove }: TagAreaProps) => (
  <div className="space-y-4">
    <label className="text-[9px] md:text-[10px] font-black text-neutral-content/40 uppercase tracking-widest ml-1">
      {label}
    </label>
    <div className="bg-[#F8F9FA] border border-transparent rounded-xl md:rounded-2xl p-4 flex flex-wrap items-center gap-3 min-h-[64px]">
      {tags.map((tag: string, i: number) => (
        <div
          key={i}
          className="bg-brand-secondary text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
        >
          {tag}{' '}
          <button onClick={() => onRemove(i)}>
            <X className="w-2.5 h-2.5 md:w-3 md:h-3" />
          </button>
        </div>
      ))}
      <input
        type="text"
        placeholder={placeholder}
        className="bg-transparent border-none focus:outline-none text-sm font-bold text-neutral-content placeholder:text-neutral-content/20 flex-1 min-w-[120px] ml-1"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && onAdd()}
      />
    </div>
  </div>
);


