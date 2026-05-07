import React from 'react';
import { LucideIcon, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

import { resolveMediaUrl } from '../../utils/media';

interface CategoryCardProps {
  name: string;
  count: number;
  icon: LucideIcon;
  imageUrl?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  count,
  icon: Icon,
  imageUrl,
}) => {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-brand-orange/10 transition-all cursor-pointer group flex flex-col relative"
    >
      <div className="w-full h-40 relative overflow-hidden bg-slate-50">
        {imageUrl ? (
          <img
            src={resolveMediaUrl(imageUrl)}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-orange-50/50 group-hover:bg-orange-50 transition-colors">
            <Icon className="w-12 h-12 text-brand-orange opacity-50 group-hover:opacity-100 transition-opacity group-hover:scale-110 duration-500" />
          </div>
        )}

        {/* Soft elegant overlay instead of black */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>

      <div className="p-5 flex flex-col flex-grow bg-white z-10 relative">
        <div className="flex items-center justify-between mb-2">
          <div className="w-10 h-10 rounded-full bg-orange-50 text-brand-orange flex items-center justify-center mb-1 group-hover:scale-110 transition-transform shadow-sm">
            <Icon className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
            {count}+ Artists
          </span>
        </div>

        <h3 className="text-slate-900 font-black text-lg tracking-tight group-hover:text-brand-orange transition-colors">
          {name}
        </h3>

        <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest group-hover:text-brand-orange transition-colors">
          Explore Talent{' '}
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
};
