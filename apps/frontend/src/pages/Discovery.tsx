import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ChevronDown,
  Search,
  LayoutGrid,
  List,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ArtistCard } from '../components/shared/ArtistCard';
import { ArtistService } from '../services/artist.service';
import { useDebounce } from '../hooks/useDebounce';
import { Artist } from '../types';

const BUDGET_RANGES = [
  { label: '₹1 Lakh to ₹5 Lakh', value: '1-5', min: 100000, max: 500000 },
  { label: '₹5 Lakh to ₹10 Lakh', value: '5-10', min: 500000, max: 1000000 },
  { label: '₹10 Lakh to ₹15 Lakh', value: '10-15', min: 1000000, max: 1500000 },
  { label: '₹15 Lakh to ₹20 Lakh', value: '15-20', min: 1500000, max: 2000000 },
  { label: 'Above ₹20 Lakh', value: '20-plus', min: 2000000, max: 50000000 },
];

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  Singer:
    'Discover world-class vocal talent for your next project. From jazz legends to rising pop stars, find the perfect voice to bring your vision to life.',
  'Live Band':
    'Experience the energy of live music with our curated bands and orchestras, perfect for weddings, corporate galas, and festivals.',
  DJ: 'Top-tier electronic artists and DJs to keep your dance floor packed and energy high throughout your event.',
  Comedian:
    'Bring laughter to your event with professional stand-up comedians and humorists curated for premium audiences.',
  Default:
    'Explore our comprehensive directory of professional talent across various artistic disciplines.',
};

import { Breadcrumbs } from '../components/shared/Breadcrumbs';

export const Discovery: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    categoryId: searchParams.get('categoryId') || searchParams.get('category') || '',
    categoryName: searchParams.get('categoryName') || '',
    budget: searchParams.get('budget') || '',
    page: Number(searchParams.get('page')) || 1,
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
          <Breadcrumbs className="mb-8" />

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
                    onChange={(e) => {
                      const newQ = e.target.value;
                      setFilters((prev) => ({ ...prev, q: newQ, page: 1 }));
                      const params = new URLSearchParams(searchParams);
                      if (newQ) params.set('q', newQ);
                      else params.delete('q');
                      params.set('page', '1');
                      setSearchParams(params);
                    }}
                    className="w-full bg-white border border-surface-container rounded-xl py-3.5 pl-12 pr-4 text-sm font-semibold text-neutral-content placeholder:text-neutral-content/30 focus:outline-none focus:border-brand-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-neutral-content mb-6">Budget Range</h3>
                <div className="space-y-4">
                  {BUDGET_RANGES.map((range) => (
                    <label
                      key={range.value}
                      className="flex items-center gap-4 cursor-pointer group p-2 -ml-2 hover:bg-white rounded-xl transition-all"
                    >
                      <div className="relative flex items-center justify-center">
                        <input
                          type="radio"
                          name="budget"
                          checked={filters.budget === range.value}
                          onChange={() => {
                            const newFilters = { ...filters, budget: range.value, page: 1 };
                            setFilters(newFilters);
                            const params = new URLSearchParams(searchParams);
                            params.set('budget', range.value);
                            params.set('page', '1');
                            setSearchParams(params);
                          }}
                          className="peer appearance-none w-5 h-5 border-2 border-surface-container rounded-full checked:border-brand-primary transition-all cursor-pointer"
                        />
                        <div className="absolute w-2.5 h-2.5 bg-brand-primary rounded-full opacity-0 peer-checked:opacity-100 transition-all"></div>
                      </div>
                      <span className="text-sm font-medium text-slate-700 group-hover:text-brand-primary transition-colors">
                        {range.label}
                      </span>
                    </label>
                  ))}
                  {filters.budget && (
                    <button
                      onClick={() => {
                        const newFilters = { ...filters, budget: '', page: 1 };
                        setFilters(newFilters);
                        const params = new URLSearchParams(searchParams);
                        params.delete('budget');
                        params.set('page', '1');
                        setSearchParams(params);
                      }}
                      className="text-[10px] font-black uppercase tracking-widest text-brand-primary hover:underline mt-2 ml-1"
                    >
                      Clear Budget
                    </button>
                  )}
                </div>
              </div>

            </div>
          </aside>

          {/* ─── Artist Grid ──────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm font-bold text-neutral-content/40">
                {isLoading ? (
                  'Loading...'
                ) : (
                  <>
                    <span className="text-neutral-content font-bold">{data?.meta?.total || 0}</span>{' '}
                    artists found
                  </>
                )}
              </p>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-neutral-content/30 uppercase tracking-widest">
                  Sort by:
                </span>
                <button className="flex items-center gap-2 text-sm font-bold text-neutral-content hover:text-brand-primary transition-colors">
                  Most Popular <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-3xl h-[400px] animate-pulse border border-surface-container"
                  />
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
                      isVerified={
                        artist.verificationStatus === 'PUBLISHED' ||
                        artist.verificationStatus === 'APPROVED'
                      }
                      isFeatured={artist.isFeatured || artist.premiumTier !== 'STANDARD'}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {data?.meta?.totalPages > 1 && (
                  <div className="mt-20 flex items-center justify-center gap-2">
                    <button
                      disabled={filters.page === 1}
                      onClick={() => {
                        const newPage = filters.page - 1;
                        setFilters({ ...filters, page: newPage });
                        const params = new URLSearchParams(searchParams);
                        params.set('page', newPage.toString());
                        setSearchParams(params);
                      }}
                      className="w-10 h-10 rounded-xl border border-surface-container flex items-center justify-center text-neutral-content/40 hover:bg-white transition-all disabled:opacity-20"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: data.meta.totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => {
                          setFilters({ ...filters, page: p });
                          const params = new URLSearchParams(searchParams);
                          params.set('page', p.toString());
                          setSearchParams(params);
                        }}
                        className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                          filters.page === p
                            ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                            : 'border border-surface-container text-neutral-content/40 hover:bg-white'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      disabled={filters.page === data.meta.totalPages}
                      onClick={() => {
                        const newPage = filters.page + 1;
                        setFilters({ ...filters, page: newPage });
                        const params = new URLSearchParams(searchParams);
                        params.set('page', newPage.toString());
                        setSearchParams(params);
                      }}
                      className="w-10 h-10 rounded-xl border border-surface-container flex items-center justify-center text-neutral-content/40 hover:bg-white transition-all disabled:opacity-20"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
