import React from 'react';
import { Check } from 'lucide-react';

export type BookingStage =
  | 'REQUESTED'
  | 'NEGOTIATING'
  | 'ADVANCE_PENDING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED';

interface WorkflowTimelineProps {
  currentStage: BookingStage;
}

const STAGES = [
  { id: 'REQUESTED', label: 'Requested' },
  { id: 'NEGOTIATING', label: 'Deal Room' },
  { id: 'ADVANCE_PENDING', label: 'Advance Pending' },
  { id: 'CONFIRMED', label: 'Confirmed' },
];

export const WorkflowTimeline: React.FC<WorkflowTimelineProps> = ({ currentStage }) => {
  if (currentStage === 'CANCELLED') {
    return (
      <div className="w-full bg-red-500/10 border border-red-500/20 p-4 rounded-lg text-center text-red-400 font-medium">
        This booking request was cancelled.
      </div>
    );
  }

  if (currentStage === 'COMPLETED') {
    return (
      <div className="w-full bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg text-center text-emerald-400 font-medium flex items-center justify-center gap-2">
        <Check className="w-5 h-5" /> Booking successfully completed.
      </div>
    );
  }

  const currentIndex = STAGES.findIndex((s) => s.id === currentStage);

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative px-2">
        {/* Connecting Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 z-0 rounded-full"></div>

        {/* Active Line Fill */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#1E4DB7] z-0 rounded-full transition-all duration-500 shadow-sm"
          style={{ width: `${(currentIndex / (STAGES.length - 1)) * 100}%` }}
        ></div>

        {/* Nodes */}
        {STAGES.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;

          let nodeClasses =
            'w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 transition-all bg-white ';

          if (isCompleted) {
            nodeClasses += 'border-[#1E4DB7] text-[#1E4DB7] bg-blue-50';
          } else if (isActive) {
            nodeClasses +=
              'border-[#FF7A2F] text-[#FF7A2F] shadow-lg shadow-orange-500/20 scale-110';
          } else {
            nodeClasses += 'border-slate-200 text-slate-300';
          }

          return (
            <div key={stage.id} className="flex flex-col items-center gap-2 relative z-10">
              <div className={nodeClasses}>
                {isCompleted ? (
                  <Check className="w-5 h-5 stroke-[3px]" />
                ) : (
                  <span className="text-sm font-black">{index + 1}</span>
                )}
              </div>
              <span
                className={`text-[10px] font-black uppercase tracking-widest absolute top-12 whitespace-nowrap transition-colors ${isActive ? 'text-[#FF7A2F]' : isCompleted ? 'text-slate-900' : 'text-slate-300'}`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
