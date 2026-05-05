import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  ChevronDown, Search, 
  BadgeCheck, 
  X, LayoutGrid, List, ChevronRight, ChevronLeft
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ArtistCard } from '../components/shared/ArtistCard';
import { ArtistService } from '../services/artist.service';
import { useDebounce } from '../hooks/useDebounce';
import { Artist } from '../types';

// removed unused CATEGORIES
const CITIES = ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur'];

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  Singer: "Discover world-class vocal talent for your next project. From jazz legends to rising pop stars, find the perfect voice to bring your vision to life.",
  'Live Band': "Experience the energy of live music with our curated bands and orchestras, perfect for weddings, corporate galas, and festivals.",
  DJ: "Top-tier electronic artists and DJs to keep your dance floor packed and energy high throughout your event.",
  Comedian: "Bring laughter to your event with professional stand-up comedians and humorists curated for premium audiences.",
  Default: "Explore our comprehensive directory of professional talent across various artistic disciplines."
};

export const Discovery: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    categoryId: searchParams.get('categoryId') || searchParams.get('category') || '',
    categoryName: searchParams.get('categoryName') || '',
    minPrice: 0,
    maxPrice: 5000000,
    city: searchParams.get('city') || '',
    isVerified: false,
    isFeatured: false,
  });
  const debouncedFilters = useDebounce(filters, 500);

  const { data, isLoading } = useQuery({
    queryKey: ['artists', debouncedFilters],
    queryFn: () => ArtistService.searchArtists(debouncedFilters),
  });

  // removed unused clearFilters

  const categoryTitle = filters.categoryName || 'Artists';
  const description = CATEGORY_DESCRIPTIONS[filters.categoryName] || CATEGORY_DESCRIPTIONS.Default;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      {/* ─── Breadcrumbs & Header ────────────────────────────────────────── */}
      <div className="bg-white border-b border-surface-container pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <nav className="flex items-center gap-2 text-xs font-bold text-neutral-content/40 uppercase tracking-widest mb-8">
            <Link to="/" className="hover:text-brand-primary transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/artists" className="hover:text-brand-primary transition-colors">Marketplace</Link>
            {filters.categoryName && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="text-brand-primary">{filters.categoryName}s</span>
              </>
            )}
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-bold text-neutral-content tracking-tighter mb-6">
                {categoryTitle}s
              </h1>
              <p className="text-neutral-content/50 text-lg font-medium leading-relaxed">
                {description}
              </p>
            </div>
            <div className="flex items-center gap-2 p-1 bg-surface-low rounded-xl border border-surface-container">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-brand-primary' : 'text-neutral-content/40 hover:text-neutral-content'}`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-brand-primary' : 'text-neutral-content/40 hover:text-neutral-content'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* ─── Sidebar Filters ──────────────────────────────────────────── */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="space-y-10 sticky top-32">
              
              {/* Search */}
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-content/30" />
                  <input
                    type="text"
                    placeholder="Search artists..."
                    value={filters.q}
                    onChange={(e) => setFilters(prev => ({ ...prev, q: e.target.value }))}
                    className="w-full bg-white border border-surface-container rounded-xl py-3.5 pl-12 pr-4 text-sm font-semibold text-neutral-content placeholder:text-neutral-content/30 focus:outline-none focus:border-brand-primary transition-all"
                  />
                </div>
              </div>

              {/* Budget Range */}
              <div>
                <h3 className="text-sm font-bold text-neutral-content mb-6">Budget Range</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Under ₹40,000', min: 0, max: 40000 },
                    { label: '₹40,000 - ₹1,25,000', min: 40000, max: 125000 },
                    { label: '₹1,25,000 - ₹4,00,000', min: 125000, max: 400000 },
                    { label: '₹4,00,000+', min: 400000, max: 5000000 },
                  ].map((range) => (
                    <label key={range.label} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="radio"
                          name="budget"
                          checked={filters.maxPrice === range.max}
                          onChange={() => setFilters(p => ({ ...p, minPrice: range.min, maxPrice: range.max }))}
                          className="peer appearance-none w-5 h-5 border-2 border-surface-container rounded-full checked:border-brand-primary transition-all cursor-pointer"
                        />
                        <div className="absolute w-2.5 h-2.5 bg-brand-primary rounded-full opacity-0 peer-checked:opacity-100 transition-all"></div>
                      </div>
                      <span className="text-sm font-medium text-neutral-content/60 group-hover:text-neutral-content transition-colors">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="text-sm font-bold text-neutral-content mb-4">Location</h3>
                <div className="relative">
                  <select
                    value={filters.city}
                    onChange={(e) => setFilters(p => ({ ...p, city: e.target.value }))}
                    className="w-full bg-white border border-surface-container rounded-xl px-4 py-3.5 text-sm font-semibold text-neutral-content focus:outline-none focus:border-brand-primary appearance-none transition-all"
                  >
                    <option value="">All Locations</option>
                    {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-content/30 pointer-events-none" />
                </div>
              </div>

              {/* Verified Toggle */}
              <button 
                onClick={() => setFilters(p => ({ ...p, isVerified: !p.isVerified }))}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${filters.isVerified ? 'bg-brand-primary/5 border-brand-primary text-brand-primary' : 'bg-white border-surface-container text-neutral-content/60'}`}
              >
                <div className="flex items-center gap-3">
                  <BadgeCheck className={`w-5 h-5 ${filters.isVerified ? 'text-brand-primary' : 'text-neutral-content/30'}`} />
                  <span className="text-sm font-bold">Verified Only</span>
                </div>
                {filters.isVerified && <X className="w-4 h-4" />}
              </button>
            </div>
          </aside>

          {/* ─── Artist Grid ──────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm font-bold text-neutral-content/40">
                {isLoading ? 'Loading...' : <><span className="text-neutral-content font-bold">{data?.meta?.total || 0}</span> artists found</>}
              </p>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-neutral-content/30 uppercase tracking-widest">Sort by:</span>
                <button className="flex items-center gap-2 text-sm font-bold text-neutral-content hover:text-brand-primary transition-colors">
                  Most Popular <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white rounded-3xl h-[400px] animate-pulse border border-surface-container" />
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {data?.data?.map((artist: Artist) => (
                    <ArtistCard
                      key={artist._id}
                      id={artist.slug || artist._id}
                      name={artist.stageName || artist.name}
                      categoryName={artist.categoryName}
                      cityName={artist.city}
                      imageUrl={artist.profileImage || ''}
                      priceRange={artist.priceRange}
                      rating={artist.rating}
                      role={artist.performanceTypes?.[0] || artist.categoryName}
                      isVerified={artist.verificationStatus === 'PUBLISHED' || artist.verificationStatus === 'APPROVED'}
                      isFeatured={artist.isFeatured || artist.premiumTier !== 'STANDARD'}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-20 flex items-center justify-center gap-2">
                  <button className="w-10 h-10 rounded-xl border border-surface-container flex items-center justify-center text-neutral-content/40 hover:bg-white transition-all">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 rounded-xl bg-brand-primary text-white font-bold text-sm shadow-lg shadow-brand-primary/20">1</button>
                  <button className="w-10 h-10 rounded-xl border border-surface-container font-bold text-sm text-neutral-content/40 hover:bg-white transition-all">2</button>
                  <button className="w-10 h-10 rounded-xl border border-surface-container font-bold text-sm text-neutral-content/40 hover:bg-white transition-all">3</button>
                  <span className="px-2 text-neutral-content/20">...</span>
                  <button className="w-10 h-10 rounded-xl border border-surface-container font-bold text-sm text-neutral-content/40 hover:bg-white transition-all">12</button>
                  <button className="w-10 h-10 rounded-xl border border-surface-container flex items-center justify-center text-neutral-content/40 hover:bg-white transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
