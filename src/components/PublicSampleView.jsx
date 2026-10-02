import React from 'react';
import { 
  Building2, 
  MapPin, 
  Lock, 
  Unlock, 
  Droplets, 
  Ruler, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Phone, 
  Eye, 
  Briefcase,
  ChevronRight,
  UserCheck
} from 'lucide-react';

export default function PublicSampleView({ projects, onSelectProject, onRequestAccess, onLoginClick }) {
  // Filter 10 sample projects
  const sampleProjects = projects.filter(p => p.isSample || projects.indexOf(p) < 10).slice(0, 10);

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-brand-900/90 via-slate-900 to-slate-950 border border-brand-500/30 shadow-glow">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" /> Public B2B Data Verification Showcase
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              10 Sample Real Estate Projects (Lucknow Market)
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Explore complete technical specifications, market absorption rates, sanitary fitting brands, building structures, and procurement contact designations. Direct phone numbers & emails are protected until access request is approved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={onRequestAccess}
              className="px-5 py-3 rounded-2xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-500 transition-all shadow-glow flex items-center gap-2 whitespace-nowrap"
            >
              <span>Request Full B2B Access</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onLoginClick}
              className="px-4 py-3 rounded-2xl text-xs font-bold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-all whitespace-nowrap"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      {/* Grid of 10 Public Sample Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleProjects.map(project => {
          const isContactVisible = !project.contactProtected || project.adminContactOverride;

          return (
            <div 
              key={project.id}
              className="glass-panel p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-brand-500/40 transition-all group relative"
            >
              
              {/* Top Header */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20 font-mono">
                        {project.id}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {project.micromarket}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1.5 line-clamp-1">
                      {project.projectName}
                    </h3>
                    <p className="text-xs text-slate-400">By {project.developerName}</p>
                  </div>

                  {isContactVisible ? (
                    <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" title="Admin Sample Preview Enabled">
                      <Unlock className="w-4 h-4" />
                    </span>
                  ) : (
                    <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20" title="Contact Info Protected">
                      <Lock className="w-4 h-4" />
                    </span>
                  )}
                </div>

                {/* Key Technical Specs Grid */}
                <div className="grid grid-cols-2 gap-2 my-3 p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">BSP Rate Range</span>
                    <strong className="text-white font-bold">₹{project.bspInrSqftRange || 'N/A'}/sqft</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Absorption</span>
                    <strong className="text-emerald-400 font-bold">{project.percentSold}% Sold</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Launched Area</span>
                    <span className="text-slate-300 font-medium">{(project.launchedSqft / 1000).toFixed(0)}k sqft</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Stage</span>
                    <span className="text-amber-400 font-medium truncate block">{project.constructionStatus || 'In Progress'}</span>
                  </div>
                </div>

                {/* Specs & Fitting Brands */}
                <div className="space-y-1.5 text-[11px] text-slate-300 mb-3">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Droplets className="w-3.5 h-3.5 text-brand-400" />
                    <span>Sanitary: <strong className="text-slate-200">{project.sanitaryBrands || 'Standard'}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Ruler className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Structure: <strong className="text-slate-200">{project.buildingStructure || 'Standard'}</strong></span>
                  </div>
                </div>

                {/* Contact Protection Box */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block flex items-center justify-between">
                    <span>Procurement Contact Designation</span>
                    {isContactVisible ? (
                      <span className="text-emerald-400 text-[9px] font-bold">🔓 Unlocked</span>
                    ) : (
                      <span className="text-amber-400 text-[9px] font-bold">🔒 Protected</span>
                    )}
                  </span>
                  
                  <p className="text-xs text-white font-medium line-clamp-2">
                    {project.procurementInfo || 'Purchase Department / Procurement Team'}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-semibold">Direct Phone:</span>
                    {isContactVisible ? (
                      <a href={`tel:${project.procurementContact}`} className="font-mono text-emerald-400 font-bold hover:underline">
                        📞 {project.procurementContact}
                      </a>
                    ) : (
                      <button
                        onClick={onRequestAccess}
                        className="text-brand-400 hover:text-brand-300 font-bold text-[11px] flex items-center gap-1"
                      >
                        <Lock className="w-3 h-3" /> Request Access
                      </button>
                    )}
                  </div>
                </div>

              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">
                  {project.reraNo.split(',')[0]}
                </span>
                <button
                  onClick={() => onSelectProject(project)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-500/10 text-brand-300 hover:bg-brand-500 hover:text-white transition-all flex items-center gap-1"
                >
                  View Details <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
