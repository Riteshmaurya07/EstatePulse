import React from 'react';
import { 
  Building2, 
  Map, 
  Users, 
  BarChart3, 
  FileSpreadsheet, 
  Search, 
  Sparkles, 
  Download,
  Layers,
  PhoneCall,
  Lock,
  LogOut,
  ShieldCheck,
  User,
  KeyRound,
  Code2
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  searchQuery, 
  setSearchQuery, 
  currentUser,
  onOpenAuthModal,
  onOpenAdminSecretLogin,
  onLogout,
  onOpenUploadModal,
  totalProjects,
  onExportReport
}) {
  const isApproved = currentUser && (currentUser.role === 'admin' || (currentUser.role === 'approved_user' && currentUser.status === 'active'));
  const isAdmin = currentUser && currentUser.role === 'admin';

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center shadow-glow font-bold text-white text-xl">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  EstatePulse <span className="text-brand-400">B2B</span>
                </span>
                
                {/* User Access Badge */}
                {isAdmin ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    <ShieldCheck className="w-3 h-3 mr-1 text-purple-400" /> System Admin
                  </span>
                ) : isApproved ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <Sparkles className="w-3 h-3 mr-1 text-emerald-400" /> Approved B2B Client
                  </span>
                ) : currentUser ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    <Lock className="w-3 h-3 mr-1 text-amber-400" /> Pending Approval
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-800 text-slate-300 border border-slate-700">
                    🌐 Public Preview
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-medium">
                RERA Real Estate Market & Procurement Intelligence Platform
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects, developers, architects, sanitary brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* User Auth Profile / Action Buttons */}
          <div className="flex items-center gap-3">
            
            {isApproved && (
              <button
                onClick={onOpenUploadModal}
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all"
                title="Upload custom Excel dataset"
              >
                <FileSpreadsheet className="w-4 h-4" /> Upload Excel
              </button>
            )}

            {currentUser ? (
              <div className="flex items-center gap-3 border-l border-slate-800 pl-3">
                <div className="hidden sm:block text-right">
                  <div className="text-xs font-bold text-white leading-tight">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-400 leading-tight">{currentUser.company || currentUser.email}</div>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-slate-800 transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuthModal('login')}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 transition-all"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuthModal('register')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-500 transition-all shadow-glow"
                >
                  Request B2B Access
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-t border-slate-800/60 pt-2 pb-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Public Sample Tab */}
            <button
              onClick={() => setActiveTab('sample')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'sample'
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Public Sample Projects (10)
            </button>

            {/* Executive Overview */}
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              Executive Overview
            </button>

            {/* Geographic Map */}
            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'map'
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Map className="w-4 h-4" />
              Geographic Map
            </button>

            {/* Authenticated / Approved Client Tabs */}
            {isApproved && (
              <>
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    activeTab === 'projects'
                      ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  Full Project Catalog ({totalProjects})
                </button>

                <button
                  onClick={() => setActiveTab('procurement')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    activeTab === 'procurement'
                      ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  B2B Procurement Directory
                </button>

                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    activeTab === 'analytics'
                      ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  Market Analytics
                </button>

                {/* Developer API Portal Tab */}
                <button
                  onClick={() => setActiveTab('developer')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    activeTab === 'developer'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  Developer API Portal
                </button>
              </>
            )}

            {/* Admin Control Panel Tab (Only visible when logged in as admin) */}
            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'admin'
                    ? 'bg-purple-600 text-white shadow-glow border border-purple-400'
                    : 'text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Console
              </button>
            )}

          </div>

          <div className="hidden lg:flex items-center gap-3 text-xs text-slate-400 pl-4 border-l border-slate-800">
            {/* Secret Admin Direct Portal Trigger */}
            <button
              onClick={onOpenAdminSecretLogin}
              className="text-[11px] text-slate-500 hover:text-purple-400 transition-colors flex items-center gap-1 font-semibold"
              title="Secret Admin Direct Login Portal"
            >
              <KeyRound className="w-3.5 h-3.5" /> Secret Admin Portal
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
