import React from 'react';
import { Activity, TrendingUp, ArrowUpRight, ArrowDownRight, Map } from 'lucide-react';

export const ReportingOverview: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-blue-500" /> Executive Business Intelligence
        </h2>
        <p className="text-slate-400">
          Founder control layer. Track platform health, growth, and supply-demand imbalances.
        </p>
      </div>

      {/* Top Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#111] border border-slate-800 p-5 rounded-lg">
          <p className="text-xs text-slate-500 font-bold tracking-wider mb-1">MOM GMV GROWTH</p>
          <div className="flex items-end gap-2">
            <h3 className="text-2xl font-bold text-white">+18.4%</h3>
            <span className="flex items-center text-emerald-400 text-xs font-medium mb-1">
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>
        <div className="bg-[#111] border border-slate-800 p-5 rounded-lg">
          <p className="text-xs text-slate-500 font-bold tracking-wider mb-1">LEAD CONVERSION</p>
          <div className="flex items-end gap-2">
            <h3 className="text-2xl font-bold text-white">24.2%</h3>
            <span className="flex items-center text-red-400 text-xs font-medium mb-1">
              <ArrowDownRight className="w-3 h-3" /> -2.1%
            </span>
          </div>
        </div>
        <div className="bg-[#111] border border-slate-800 p-5 rounded-lg">
          <p className="text-xs text-slate-500 font-bold tracking-wider mb-1">ACTIVE AGENCIES</p>
          <div className="flex items-end gap-2">
            <h3 className="text-2xl font-bold text-white">142</h3>
            <span className="flex items-center text-emerald-400 text-xs font-medium mb-1">
              <ArrowUpRight className="w-3 h-3" /> 12
            </span>
          </div>
        </div>
        <div className="bg-[#111] border border-slate-800 p-5 rounded-lg">
          <p className="text-xs text-slate-500 font-bold tracking-wider mb-1">AVG DEAL SIZE</p>
          <div className="flex items-end gap-2">
            <h3 className="text-2xl font-bold text-white">₹4.8L</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supply vs Demand Imbalance */}
        <div className="bg-[#111] border border-slate-800 rounded-lg p-6">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Map className="w-4 h-4 text-amber-500" /> Geographic Imbalance Tracker
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white font-medium">Pune (High Demand, Low Supply)</span>
                <span className="text-amber-400 font-bold">WARNING</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div className="bg-blue-500 h-full" style={{ width: '80%' }}></div>
                <div className="bg-emerald-500 h-full" style={{ width: '20%' }}></div>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Demand outpaces supply 4:1. Action: Acquire more Pune artists.
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white font-medium">Delhi (Balanced)</span>
                <span className="text-emerald-400 font-bold">HEALTHY</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div className="bg-blue-500 h-full" style={{ width: '55%' }}></div>
                <div className="bg-emerald-500 h-full" style={{ width: '45%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Category Performance */}
        <div className="bg-[#111] border border-slate-800 rounded-lg p-6">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-6 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-500" /> Category Performance (GMV)
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Live Bands</span>
              <span className="text-sm font-bold text-white">₹48.2L</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Standup Comedy</span>
              <span className="text-sm font-bold text-white">₹32.5L</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">DJs</span>
              <span className="text-sm font-bold text-white">₹18.0L</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Motivational Speakers</span>
              <span className="text-sm font-bold text-slate-500">₹4.2L</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
