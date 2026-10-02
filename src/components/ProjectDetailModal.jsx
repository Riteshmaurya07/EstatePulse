import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Briefcase, 
  CheckCircle2, 
  Copy, 
  Check, 
  ShieldCheck, 
  Wrench, 
  ExternalLink,
  Layers,
  Ruler,
  Globe,
  Droplets,
  Lock,
  ArrowRight
} from 'lucide-react';

export default function ProjectDetailModal({ 
  project, 
  onClose, 
  onToggleCompare, 
  isCompared, 
  showToast,
  onRequestAccess
}) {
  const [copiedField, setCopiedField] = useState(null);

  if (!project) return null;

  const isContactVisible = !project.contactProtected || project.adminContactOverride;

  const copyToClipboard = (text, label) => {
    if (!text || text.includes('🔒')) return;
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    if (showToast) showToast(`Copied ${label}: ${text}`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel w-full max-w-4xl my-8 p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-glow relative animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                {project.micromarket}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
                {project.segment || 'Mid'} Segment
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {project.percentSold}% Sold
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {project.projectName}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Developed by <strong className="text-white">{project.developerName}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onToggleCompare && (
              <button
                onClick={() => onToggleCompare(project.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  isCompared 
                    ? 'bg-brand-600 border-brand-500 text-white shadow-glow' 
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                {isCompared ? '✓ Added to Compare' : '+ Add to Compare'}
              </button>
            )}
          </div>
        </div>

        {/* RERA Certificate Badge Bar */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-brand-950/40 to-slate-900 border border-brand-500/20 flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-brand-400" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Official RERA Registration</span>
              <strong className="text-xs font-mono text-brand-300">{project.reraNo}</strong>
            </div>
          </div>
          <button
            onClick={() => copyToClipboard(project.reraNo, 'RERA Number')}
            className="px-3 py-1.5 rounded-xl bg-brand-500/20 text-brand-300 hover:bg-brand-500 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            {copiedField === 'RERA Number' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            Copy RERA ID
          </button>
        </div>

        {/* Modal Body: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Column 1: B2B Procurement & Decision Makers */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-purple-400 flex items-center justify-between">
              <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> B2B Decision Makers & Contacts</span>
              {!isContactVisible && (
                <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Contact Protected
                </span>
              )}
            </h3>

            {/* Procurement Officer */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Procurement / Purchase Dept</span>
              <p className="text-xs text-white font-medium whitespace-pre-line">
                {project.procurementInfo || 'N/A'}
              </p>
              
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Direct Phone:</span>
                {isContactVisible ? (
                  <div className="flex items-center gap-2">
                    <a href={`tel:${project.procurementContact}`} className="text-xs font-mono text-emerald-400 font-bold hover:underline">
                      📞 {project.procurementContact}
                    </a>
                    <button
                      onClick={() => copyToClipboard(project.procurementContact, 'Procurement Contact')}
                      className="p-1 text-slate-400 hover:text-white"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={onRequestAccess}
                    className="px-3 py-1 rounded-lg bg-amber-500/10 text-amber-300 hover:bg-amber-500 hover:text-white text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <Lock className="w-3 h-3" /> Request Access
                  </button>
                )}
              </div>
            </div>

            {/* Site Manager */}
            {project.siteManagerName && (
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase">Site Manager</span>
                <p className="text-xs text-white font-bold">{project.siteManagerName}</p>
                <div className="pt-1 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Contact:</span>
                  {isContactVisible ? (
                    <span className="font-mono text-emerald-400 font-bold">{project.siteManagerContact || 'N/A'}</span>
                  ) : (
                    <span className="text-amber-400 font-bold text-[11px]">🔒 Hidden</span>
                  )}
                </div>
              </div>
            )}

            {/* MEP Consultant */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase">MEP Consultant</span>
              <p className="text-xs text-slate-200 font-semibold">{project.mepConsultant || 'Standard / In-house'}</p>
              <div className="pt-1 flex items-center justify-between text-xs">
                <span className="text-slate-400">MEP Phone:</span>
                {isContactVisible ? (
                  <span className="font-mono text-cyan-400 font-bold">{project.mepContact || 'N/A'}</span>
                ) : (
                  <span className="text-amber-400 font-bold text-[11px]">🔒 Hidden</span>
                )}
              </div>
            </div>

            {/* Architect Details */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase">Architect Firm</span>
              <p className="text-xs text-slate-200 font-medium">{project.architectDetails || 'Architect details available on request'}</p>
            </div>
          </div>

          {/* Column 2: Specifications & Market Metrics */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-brand-400 flex items-center gap-2">
              <Wrench className="w-4 h-4" /> Technical & Fitting Specifications
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Sanitary Brands</span>
                <strong className="text-xs text-brand-300 font-bold">{project.sanitaryBrands || 'Standard'}</strong>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Modular Kitchen</span>
                <strong className="text-xs text-slate-200 font-bold">{project.modularKitchen || 'Non-Modular'}</strong>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Building Structure</span>
                <strong className="text-xs text-slate-200 font-bold">{project.buildingStructure || 'Standard'}</strong>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Construction Status</span>
                <strong className="text-xs text-amber-400 font-bold">{project.constructionStatus || 'Under Construction'}</strong>
              </div>
            </div>

            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-emerald-400 pt-2 flex items-center gap-2">
              <Layers className="w-4 h-4" /> Market & Inventory Summary
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">BSP Price Range</span>
                <strong className="text-sm text-white font-extrabold">₹{project.bspInrSqftRange}/sqft</strong>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Units Absorption</span>
                <strong className="text-sm text-emerald-400 font-extrabold">{project.unitsAbsorbed} / {project.launchedUnits} ({project.percentSold}%)</strong>
              </div>
            </div>

            {/* Address */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-brand-400" /> Site Address & Landmark
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {project.siteAddress || 'Lucknow, Uttar Pradesh'}
              </p>
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
          {!isContactVisible ? (
            <button
              onClick={onRequestAccess}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-500 transition-all flex items-center gap-2 shadow-glow"
            >
              <span>Unlock Full Contact Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div></div>
          )}

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700"
          >
            Close Dossier
          </button>
        </div>

      </div>
    </div>
  );
}
