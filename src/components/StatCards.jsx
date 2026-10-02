import React from 'react';
import { Building2, Layers, TrendingUp, IndianRupee, Contact, CheckCircle2, ArrowUpRight, Tag } from 'lucide-react';

export default function StatCards({ stats }) {
  const formatSqft = (sqft) => {
    if (sqft >= 1000000) return `${(sqft / 1000000).toFixed(2)}M sq ft`;
    if (sqft >= 1000) return `${(sqft / 1000).toFixed(0)}k sq ft`;
    return `${sqft} sq ft`;
  };

  const formatCurrency = (val) => {
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      
      {/* Card 1: Total Projects */}
      <div className="glass-panel p-4 rounded-2xl relative overflow-hidden group hover:border-brand-500/40 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Projects</span>
          <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400 group-hover:scale-110 transition-transform">
            <Building2 className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-white tracking-tight">{stats.totalProjects}</span>
          <span className="text-xs text-slate-400 font-medium">({stats.totalDevelopers} Developers)</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>Active RERA Registry</span>
        </div>
      </div>

      {/* Card 2: Inventory Volume */}
      <div className="glass-panel p-4 rounded-2xl relative overflow-hidden group hover:border-cyan-500/40 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Inventory</span>
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-white tracking-tight">{formatSqft(stats.totalSqft)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          <span>{stats.totalUnits.toLocaleString()} Launched Units</span>
        </div>
      </div>

      {/* Card 3: Market Absorption */}
      <div className="glass-panel p-4 rounded-2xl relative overflow-hidden group hover:border-emerald-500/40 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Market Absorption</span>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-emerald-400 tracking-tight">{stats.avgPercentSold}%</span>
          <span className="text-xs text-slate-400">Sold</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          <span>{stats.totalAbsorbedUnits.toLocaleString()} Units Sold</span>
        </div>
      </div>

      {/* Card 4: BSP Price Range */}
      <div className="glass-panel p-4 rounded-2xl relative overflow-hidden group hover:border-amber-500/40 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">BSP Price Range</span>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform flex items-center justify-center font-bold">
            <IndianRupee className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            ₹{stats.minBSP.toLocaleString('en-IN')} - ₹{stats.maxBSP.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-amber-400/90 font-medium">
          <span>Per Sq. Ft. (Base Price)</span>
        </div>
      </div>

      {/* Card 5: Procurement Directory */}
      <div className="glass-panel p-4 rounded-2xl relative overflow-hidden group hover:border-purple-500/40 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">B2B Contacts</span>
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
            <Contact className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-purple-300 tracking-tight">{stats.totalContacts}</span>
          <span className="text-xs text-slate-400">Decision Makers</span>
        </div>
        <div className="mt-2 flex items-center gap-1 text-xs text-purple-400 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Procurement & MEP Verified</span>
        </div>
      </div>

    </div>
  );
}
