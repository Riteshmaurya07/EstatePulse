import React from 'react';
import { 
  Building2, 
  MapPin, 
  CheckCircle2, 
  TrendingUp, 
  Phone, 
  Mail, 
  Briefcase, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Compass,
  Zap
} from 'lucide-react';

export default function ExecutiveOverview({ 
  data, 
  onSelectProject, 
  setActiveTab,
  setFilterMicromarket,
  setFilterSegment 
}) {
  // Compute Top Micromarkets
  const micromarketMap = {};
  data.forEach(item => {
    const mm = item.micromarket || 'Unknown';
    if (!micromarketMap[mm]) {
      micromarketMap[mm] = { name: mm, count: 0, units: 0, sqft: 0, absorbed: 0 };
    }
    micromarketMap[mm].count += 1;
    micromarketMap[mm].units += item.launchedUnits;
    micromarketMap[mm].sqft += item.launchedSqft;
    micromarketMap[mm].absorbed += item.unitsAbsorbed;
  });

  const topMicromarkets = Object.values(micromarketMap)
    .sort((a, b) => b.units - a.units)
    .slice(0, 6);

  // Construction Stage Breakdown
  const stageMap = {};
  data.forEach(item => {
    const st = item.constructionStatus || 'Other';
    stageMap[st] = (stageMap[st] || 0) + 1;
  });

  // Top Developers by Units
  const devMap = {};
  data.forEach(item => {
    const dev = item.developerName;
    devMap[dev] = (devMap[dev] || 0) + item.launchedUnits;
  });
  const topDevs = Object.entries(devMap)
    .map(([name, units]) => ({ name, units }))
    .sort((a, b) => b.units - a.units)
    .slice(0, 5);

  // Top B2B Procurement Leads (Projects with direct procurement contact)
  const procurementLeads = data.filter(d => d.procurementInfo || d.procurementContact).slice(0, 4);

  return (
    <div className="space-y-6">
      
      {/* Pitch Deck Banner */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-brand-900/90 via-slate-900 to-slate-950 border border-brand-500/30 shadow-glow">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
            <Zap className="w-3.5 h-3.5 text-brand-400" /> B2B Real Estate Market Intelligence Brief
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
             Lucknow RERA Housing Market & Procurement Intelligence
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Real-time market analysis covering <strong className="text-white">{data.length} major residential & commercial developments</strong> across Lucknow’s prime micro-markets. Access verified developer contacts, MEP consultants, architects, sanitary specifications, and absorption trends for targeted B2B supply chain strategy.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('procurement')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-500 text-white hover:bg-brand-400 transition-all shadow-glow"
            >
              <Phone className="w-4 h-4" /> Browse Procurement Directory
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-all"
            >
              <Compass className="w-4 h-4" /> Explore Interactive Map
            </button>
          </div>
        </div>
      </div>

      {/* Grid Section 1: Micromarkets & Construction Stages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Micromarkets */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-400" /> Top Micro-markets by Volume
              </h2>
              <p className="text-xs text-slate-400">Inventory supply and sales absorption rate</p>
            </div>
            <button 
              onClick={() => setActiveTab('projects')}
              className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {topMicromarkets.map((mm, idx) => {
              const absorptionPct = mm.units > 0 ? Math.round((mm.absorbed / mm.units) * 100) : 0;
              return (
                <div 
                  key={idx}
                  onClick={() => {
                    setFilterMicromarket(mm.name);
                    setActiveTab('projects');
                  }}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-brand-500/40 cursor-pointer transition-all hover:translate-x-1"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-slate-200">{mm.name}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-brand-500/10 text-brand-400">
                      {mm.count} Projects
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between text-xs text-slate-400 mb-2">
                    <span>Launched: <strong className="text-slate-200">{mm.units.toLocaleString()} units</strong></span>
                    <span>Absorption: <strong className="text-emerald-400">{absorptionPct}%</strong></span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 rounded-full"
                      style={{ width: `${Math.min(100, absorptionPct)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Construction Velocity Breakdown */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
              <Briefcase className="w-5 h-5 text-amber-400" /> Construction Stages
            </h2>
            <p className="text-xs text-slate-400 mb-4">Targeting material procurement phases</p>
            
            <div className="space-y-3">
              {Object.entries(stageMap).map(([stage, count], i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
                  <span className="text-xs font-semibold text-slate-300">{stage}</span>
                  <span className="text-xs font-bold text-white bg-slate-800 px-2.5 py-1 rounded-lg">
                    {count} Projects
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Finishing stage projects offer immediate B2B sales opportunities for sanitary & modular fittings.</span>
          </div>
        </div>

      </div>

      {/* Grid Section 2: Top Developers & Featured B2B Procurement Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Developers */}
        <div className="glass-panel p-6 rounded-2xl">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-purple-400" /> Top Developers by Scale
          </h2>
          <div className="space-y-3">
            {topDevs.map((dev, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-200">{dev.name}</span>
                </div>
                <span className="text-xs font-semibold text-purple-300">
                  {dev.units.toLocaleString()} Units
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Featured B2B Procurement Contacts */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Phone className="w-5 h-5 text-emerald-400" /> Verified B2B Procurement Officers
              </h2>
              <p className="text-xs text-slate-400">Direct contacts for developer purchase & site teams</p>
            </div>
            <button 
              onClick={() => setActiveTab('procurement')}
              className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1"
            >
              Full Directory <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {procurementLeads.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/30 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xs font-bold text-white truncate max-w-[200px]">{item.projectName}</h3>
                    <p className="text-[11px] text-slate-400">{item.developerName}</p>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Verified
                  </span>
                </div>
                
                <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-400">Procurement:</span>
                    <span className="text-slate-200 truncate">{item.procurementInfo || 'Available on request'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span className="font-mono text-emerald-400 font-bold">{item.procurementContact || 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
