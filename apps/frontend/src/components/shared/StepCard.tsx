import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const StepCard: React.FC<StepCardProps> = ({ number, title, description, icon: Icon }) => {
  return (
    <div className="flex flex-col items-center text-center group">
      <div className="relative mb-10">
        <div className="w-24 h-24 rounded-3xl bg-orange-50 border border-orange-100 flex items-center justify-center transition-all duration-500 group-hover:bg-brand-orange group-hover:shadow-xl group-hover:shadow-brand-orange/20 group-hover:scale-110">
          <Icon className="w-10 h-10 text-brand-orange group-hover:text-white transition-colors duration-500" />
        </div>
        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-brand-blue text-white text-xs font-black flex items-center justify-center border-2 border-white shadow-md">
          {number}
        </div>
      </div>
      <h3 className="text-slate-900 font-black text-xl mb-3 tracking-tight group-hover:text-brand-orange transition-colors">
        {title}
      </h3>
      <p className="text-slate-500 text-sm leading-relaxed max-w-xs font-medium">{description}</p>
    </div>
  );
};
