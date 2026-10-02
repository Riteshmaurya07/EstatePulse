import React, { useState } from 'react';
import { 
  PhoneCall, 
  Mail, 
  User, 
  Building2, 
  Compass, 
  Search, 
  Copy, 
  Check, 
  ShieldCheck, 
  Wrench, 
  Briefcase,
  ExternalLink,
  Phone,
  Sparkles
} from 'lucide-react';

export default function ProcurementDirectory({ projects, onSelectProject, showToast }) {
  const [directorySearch, setDirectorySearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); // 'all' | 'procurement' | 'site' | 'mep' | 'architect'
  const [copiedId, setCopiedId] = useState(null);

  const copyToClipboard = (text, label, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    if (showToast) showToast(`Copied ${label}: ${text}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter contacts
  const filteredProjects = projects.filter(p => {
    // Role filter
    if (roleFilter === 'procurement' && (!p.procurementInfo && !p.procurementContact)) return false;
    if (roleFilter === 'site' && (!p.siteManagerName && !p.siteManagerContact)) return false;
    if (roleFilter === 'mep' && (!p.mepConsultant && !p.mepContact)) return false;
    if (roleFilter === 'architect' && !p.architectDetails) return false;

    // Search filter
    if (directorySearch) {
      const query = directorySearch.toLowerCase();
      const combined = [
        p.projectName,
        p.developerName,
        p.procurementInfo,
        p.procurementContact,
        p.siteManagerName,
        p.siteManagerContact,
        p.mepConsultant,
        p.architectDetails,
        p.builderEmail,
        p.sanitaryBrands
      ].join(' ').toLowerCase();
      return combined.includes(query);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4 border-l-4 border-l-purple-500">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
              <PhoneCall className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              B2B Developer & Procurement Directory
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Direct decision-maker database for B2B building material vendors, MEP consultants, sanitary brand suppliers, and structural contractors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/30 font-bold">
            {filteredProjects.length} Verified Project Decision Contacts
          </span>
        </div>
      </div>

      {/* Directory Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search decision-makers, architects, MEP, procurement numbers..."
            value={directorySearch}
            onChange={(e) => setDirectorySearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Role Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setRoleFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              roleFilter === 'all' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            All Decision Makers
          </button>
          <button
            onClick={() => setRoleFilter('procurement')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              roleFilter === 'procurement' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Procurement Officers
          </button>
          <button
            onClick={() => setRoleFilter('site')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              roleFilter === 'site' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Site Managers
          </button>
          <button
            onClick={() => setRoleFilter('mep')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              roleFilter === 'mep' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            MEP Consultants
          </button>
          <button
            onClick={() => setRoleFilter('architect')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              roleFilter === 'architect' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Architects
          </button>
        </div>

      </div>

      {/* Directory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map(project => (
          <div 
            key={project.id}
            className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-4"
          >
            
            {/* Project Header */}
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                    {project.micromarket}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">
                    {project.projectName}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">Developer: <strong className="text-slate-200">{project.developerName}</strong></p>
                </div>

                <button
                  onClick={() => onSelectProject(project)}
                  className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
                  title="View full specs"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

              {/* B2B Contact Matrix */}
              <div className="mt-4 space-y-3">
                
                {/* 1. Procurement Team */}
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-400 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" /> Procurement / Purchase Dept
                    </span>
                    {project.procurementContact && (
                      <div className="flex items-center gap-1">
                        <a 
                          href={`tel:${project.procurementContact}`}
                          className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white font-mono text-[11px] font-bold transition-all flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" /> {project.procurementContact}
                        </a>
                        <button
                          onClick={() => copyToClipboard(project.procurementContact, 'Procurement Contact', `proc-${project.id}`)}
                          className="p-1 text-slate-400 hover:text-white"
                          title="Copy phone"
                        >
                          {copiedId === `proc-${project.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed font-sans">
                    {project.procurementInfo || 'Details available in full project record'}
                  </p>
                </div>

                {/* 2. Site Manager */}
                {project.siteManagerName && (
                  <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-xs flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Site Manager</span>
                      <strong className="text-slate-200">{project.siteManagerName}</strong>
                    </div>
                    {project.siteManagerContact && (
                      <div className="flex items-center gap-1 font-mono">
                        <a 
                          href={`tel:${project.siteManagerContact}`}
                          className="text-emerald-400 hover:underline font-bold"
                        >
                          {project.siteManagerContact}
                        </a>
                        <button
                          onClick={() => copyToClipboard(project.siteManagerContact, 'Site Manager Contact', `site-${project.id}`)}
                          className="p-1 text-slate-400 hover:text-white"
                        >
                          {copiedId === `site-${project.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. MEP Consultant */}
                {project.mepConsultant && (
                  <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">MEP Consultant</span>
                      {project.mepContact && (
                        <button
                          onClick={() => copyToClipboard(project.mepContact, 'MEP Contact', `mep-${project.id}`)}
                          className="text-[11px] font-mono text-cyan-400 hover:underline flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" /> {project.mepContact.slice(0, 20)}...
                        </button>
                      )}
                    </div>
                    <strong className="text-slate-200 block truncate">{project.mepConsultant}</strong>
                  </div>
                )}

                {/* 4. Architect */}
                {project.architectDetails && (
                  <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-xs">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Architect Partner</span>
                    <span className="text-slate-300 block line-clamp-2">{project.architectDetails}</span>
                  </div>
                )}

              </div>
            </div>

            {/* Footer Specifications Badge */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                <Wrench className="w-3.5 h-3.5" /> Sanitary: {project.sanitaryBrands || 'Standard'}
              </span>
              <span className="font-semibold text-slate-300">
                {project.constructionStatus || 'In Progress'}
              </span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
