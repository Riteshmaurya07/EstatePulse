import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Layers, 
  SlidersHorizontal, 
  Grid, 
  List, 
  ArrowUpDown, 
  CheckSquare, 
  Square,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Phone,
  Droplets,
  Ruler
} from 'lucide-react';

export default function ProjectCatalog({ 
  projects, 
  onSelectProject, 
  onToggleCompare, 
  selectedCompareIds,
  filterMicromarket,
  setFilterMicromarket,
  filterSegment,
  setFilterSegment,
  filterStatus,
  setFilterStatus,
  filterSanitary,
  setFilterSanitary
}) {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [sortBy, setSortBy] = useState('percentSold'); // 'percentSold' | 'launchedSqft' | 'projectName'

  // Extract Filter Options
  const micromarkets = Array.from(new Set(projects.map(p => p.micromarket).filter(Boolean))).sort();
  const segments = Array.from(new Set(projects.map(p => p.segment).filter(Boolean))).sort();
  const statuses = Array.from(new Set(projects.map(p => p.constructionStatus).filter(Boolean))).sort();
  
  // Extract Sanitary Brands
  const sanitaryBrands = Array.from(new Set(
    projects.flatMap(p => (p.sanitaryBrands || '').split(',').map(b => b.trim())).filter(Boolean)
  )).sort();

  // Filter Logic
  const filteredProjects = projects.filter(p => {
    if (filterMicromarket && p.micromarket !== filterMicromarket) return false;
    if (filterSegment && p.segment !== filterSegment) return false;
    if (filterStatus && p.constructionStatus !== filterStatus) return false;
    if (filterSanitary && !(p.sanitaryBrands || '').toLowerCase().includes(filterSanitary.toLowerCase())) return false;
    return true;
  });

  // Sort Logic
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'percentSold') return b.percentSold - a.percentSold;
    if (sortBy === 'launchedSqft') return b.launchedSqft - a.launchedSqft;
    if (sortBy === 'projectName') return a.projectName.localeCompare(b.projectName);
    return 0;
  });

  return (
    <div className="space-y-6">
      
      {/* Control Bar & Filter Drawer */}
      <div className="glass-panel p-5 rounded-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-brand-400" />
            <h2 className="text-base font-bold text-white">Filter & Refine Intelligence Catalog</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700">
              {sortedProjects.length} Projects
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'grid' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Grid className="w-4 h-4" /> Grid
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'table' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <List className="w-4 h-4" /> Table
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-slate-400 hidden sm:block" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="percentSold">Sort by % Sold (Highest)</option>
                <option value="launchedSqft">Sort by Total Sqft (Highest)</option>
                <option value="projectName">Sort by Project Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80">
          
          {/* Micro-market Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Micro-market</label>
            <select
              value={filterMicromarket}
              onChange={(e) => setFilterMicromarket(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            >
              <option value="">All Micro-markets ({micromarkets.length})</option>
              {micromarkets.map((m, i) => (
                <option key={i} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Property Segment Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Property Segment</label>
            <select
              value={filterSegment}
              onChange={(e) => setFilterSegment(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            >
              <option value="">All Segments</option>
              {segments.map((s, i) => (
                <option key={i} value={s}>{s} Segment</option>
              ))}
            </select>
          </div>

          {/* Construction Status Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Construction Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            >
              <option value="">All Stages</option>
              {statuses.map((st, i) => (
                <option key={i} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Sanitary Fitting Brand Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Sanitary Fittings Brand</label>
            <select
              value={filterSanitary}
              onChange={(e) => setFilterSanitary(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            >
              <option value="">All Fitting Brands</option>
              {sanitaryBrands.map((b, i) => (
                <option key={i} value={b}>{b}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Clear Filters Pill */}
        {(filterMicromarket || filterSegment || filterStatus || filterSanitary) && (
          <div className="flex items-center justify-between pt-2 text-xs">
            <span className="text-slate-400">Active filters applied</span>
            <button
              onClick={() => {
                setFilterMicromarket('');
                setFilterSegment('');
                setFilterStatus('');
                setFilterSanitary('');
              }}
              className="text-brand-400 hover:underline font-semibold"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProjects.map(project => {
            const isCompared = selectedCompareIds.includes(project.id);
            return (
              <div 
                key={project.id}
                className={`glass-panel p-5 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:border-brand-500/50 hover:shadow-glow relative ${
                  isCompared ? 'border-brand-500 bg-brand-950/20' : ''
                }`}
              >
                {/* Header Info */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider bg-brand-500/10 text-brand-400 border border-brand-500/20">
                          {project.micromarket}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          {project.segment || 'Mid'}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-1.5 leading-snug line-clamp-1">
                        {project.projectName}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">By {project.developerName}</p>
                    </div>

                    {/* Compare Checkbox */}
                    <button
                      onClick={() => onToggleCompare(project.id)}
                      className={`p-1.5 rounded-lg border transition-all ${
                        isCompared 
                          ? 'bg-brand-600 border-brand-500 text-white' 
                          : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                      }`}
                      title={isCompared ? 'Remove from compare' : 'Add to side-by-side compare'}
                    >
                      {isCompared ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-2 my-4 p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block">BSP Rate</span>
                      <strong className="text-white font-bold">₹{project.bspInrSqftRange || 'N/A'}/sqft</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Absorbed Rate</span>
                      <strong className="text-emerald-400 font-bold">{project.percentSold}% ({project.unitsAbsorbed} u)</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Launched Area</span>
                      <span className="text-slate-300 font-medium">{(project.launchedSqft / 1000).toFixed(0)}k sqft</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Construction</span>
                      <span className="text-amber-400 font-medium truncate block">{project.constructionStatus || 'In Progress'}</span>
                    </div>
                  </div>

                  {/* B2B Specs preview */}
                  <div className="space-y-1.5 text-[11px] text-slate-300 mb-4">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Droplets className="w-3.5 h-3.5 text-brand-400" />
                      <span className="truncate">Sanitary: <strong className="text-slate-200">{project.sanitaryBrands || 'Standard'}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Ruler className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Structure: <strong className="text-slate-200">{project.buildingStructure || 'Standard'}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="text-[10px] text-slate-500 font-mono">
                    {project.reraNo.split(',')[0]}
                  </div>
                  <button
                    onClick={() => onSelectProject(project)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-500/10 text-brand-300 border border-brand-500/30 hover:bg-brand-500 hover:text-white transition-all flex items-center gap-1"
                  >
                    B2B Specs <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="glass-panel rounded-2xl overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800 text-[11px] uppercase font-bold text-slate-400">
                <th className="p-3">Compare</th>
                <th className="p-3">Project & Developer</th>
                <th className="p-3">Micromarket</th>
                <th className="p-3">BSP / Sqft</th>
                <th className="p-3">Launched Units</th>
                <th className="p-3">% Sold</th>
                <th className="p-3">Stage</th>
                <th className="p-3">Sanitary Fittings</th>
                <th className="p-3">Procurement Contact</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {sortedProjects.map(project => {
                const isCompared = selectedCompareIds.includes(project.id);
                return (
                  <tr key={project.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-3">
                      <button
                        onClick={() => onToggleCompare(project.id)}
                        className={`p-1 rounded border ${
                          isCompared ? 'bg-brand-600 border-brand-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-500'
                        }`}
                      >
                        {isCompared ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-white">{project.projectName}</div>
                      <div className="text-[11px] text-slate-400">{project.developerName}</div>
                    </td>
                    <td className="p-3 text-slate-300 font-medium">{project.micromarket}</td>
                    <td className="p-3 font-bold text-brand-300">₹{project.bspInrSqftRange || 'N/A'}</td>
                    <td className="p-3 text-slate-300">{project.launchedUnits.toLocaleString()} u</td>
                    <td className="p-3">
                      <span className="font-bold text-emerald-400">{project.percentSold}%</span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {project.constructionStatus || 'In Progress'}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300 truncate max-w-[150px]">
                      {project.sanitaryBrands || 'Standard'}
                    </td>
                    <td className="p-3 text-slate-300 font-mono text-[11px]">
                      {project.procurementContact || 'N/A'}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onSelectProject(project)}
                        className="px-2.5 py-1 rounded bg-brand-500/10 text-brand-400 hover:bg-brand-500 hover:text-white transition-all text-xs font-semibold"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
