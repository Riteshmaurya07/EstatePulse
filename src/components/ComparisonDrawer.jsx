import React from 'react';
import { X, Check, ArrowRightLeft, Building2, Phone, Droplets, Trash2 } from 'lucide-react';

export default function ComparisonDrawer({ 
  projects, 
  selectedIds, 
  onRemoveFromCompare, 
  onClearAll, 
  onSelectProject 
}) {
  if (!selectedIds || selectedIds.length === 0) return null;

  const compareProjects = projects.filter(p => selectedIds.includes(p.id));

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t-2 border-brand-500/80 shadow-glow-lg transition-all">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-brand-500/20 text-brand-400">
              <ArrowRightLeft className="w-5 h-5" />
            </span>
            <h3 className="text-base font-bold text-white">
              Side-by-Side B2B Project Comparison Matrix ({compareProjects.length})
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClearAll}
              className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-800 text-xs">
                <th className="p-2 w-48 text-slate-400 font-bold uppercase">Attribute</th>
                {compareProjects.map(proj => (
                  <th key={proj.id} className="p-2 font-bold text-white relative">
                    <div className="flex items-center justify-between gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800">
                      <span className="truncate">{proj.projectName}</span>
                      <button
                        onClick={() => onRemoveFromCompare(proj.id)}
                        className="p-1 text-slate-500 hover:text-white hover:bg-slate-800 rounded"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              
              <tr>
                <td className="p-2 font-semibold text-slate-400">Developer</td>
                {compareProjects.map(p => (
                  <td key={p.id} className="p-2 font-bold text-slate-200">{p.developerName}</td>
                ))}
              </tr>

              <tr>
                <td className="p-2 font-semibold text-slate-400">Micro-market</td>
                {compareProjects.map(p => (
                  <td key={p.id} className="p-2 font-semibold text-brand-400">{p.micromarket}</td>
                ))}
              </tr>

              <tr>
                <td className="p-2 font-semibold text-slate-400">BSP Rate (Sqft)</td>
                {compareProjects.map(p => (
                  <td key={p.id} className="p-2 font-bold text-white">₹{p.bspInrSqftRange || 'N/A'}/sqft</td>
                ))}
              </tr>

              <tr>
                <td className="p-2 font-semibold text-slate-400">Absorption Rate</td>
                {compareProjects.map(p => (
                  <td key={p.id} className="p-2 font-bold text-emerald-400">{p.percentSold}% ({p.unitsAbsorbed} u)</td>
                ))}
              </tr>

              <tr>
                <td className="p-2 font-semibold text-slate-400">Sanitary Brands</td>
                {compareProjects.map(p => (
                  <td key={p.id} className="p-2 font-medium text-slate-300">{p.sanitaryBrands || 'Standard'}</td>
                ))}
              </tr>

              <tr>
                <td className="p-2 font-semibold text-slate-400">Modular Kitchen</td>
                {compareProjects.map(p => (
                  <td key={p.id} className="p-2 font-medium text-slate-300">{p.modularKitchen || 'Non-Modular'}</td>
                ))}
              </tr>

              <tr>
                <td className="p-2 font-semibold text-slate-400">Construction Stage</td>
                {compareProjects.map(p => (
                  <td key={p.id} className="p-2 font-bold text-amber-400">{p.constructionStatus || 'Under Construction'}</td>
                ))}
              </tr>

              <tr>
                <td className="p-2 font-semibold text-slate-400">Procurement Phone</td>
                {compareProjects.map(p => (
                  <td key={p.id} className="p-2 font-mono text-emerald-400 font-bold">{p.procurementContact || 'N/A'}</td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
