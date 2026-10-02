import React, { useState, useEffect, useMemo } from 'react';
import { api, getCurrentUserFromStorage, setCurrentUserInStorage } from './services/api.js';
import Header from './components/Header.jsx';
import StatCards from './components/StatCards.jsx';
import PublicSampleView from './components/PublicSampleView.jsx';
import ExecutiveOverview from './components/ExecutiveOverview.jsx';
import MapView from './components/MapView.jsx';
import ProjectCatalog from './components/ProjectCatalog.jsx';
import ProcurementDirectory from './components/ProcurementDirectory.jsx';
import AnalyticsCharts from './components/AnalyticsCharts.jsx';
import DeveloperPortal from './components/DeveloperPortal.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import AdminLoginPage from './components/AdminLoginPage.jsx';
import ExcelUploaderModal from './components/ExcelUploaderModal.jsx';
import ProjectDetailModal from './components/ProjectDetailModal.jsx';
import ComparisonDrawer from './components/ComparisonDrawer.jsx';
import AuthModal from './components/AuthModal.jsx';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => getCurrentUserFromStorage());
  const [projectsData, setProjectsData] = useState([]);
  const [accessLevel, setAccessLevel] = useState('sample');
  const [isApproved, setIsApproved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Tab & Navigation State
  const [activeTab, setActiveTab] = useState('sample'); // 'sample' | 'overview' | 'map' | 'projects' | 'procurement' | 'analytics' | 'developer' | 'admin' | 'adminSecret'
  const [searchQuery, setSearchQuery] = useState('');

  // Filter States
  const [filterMicromarket, setFilterMicromarket] = useState('');
  const [filterSegment, setFilterSegment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSanitary, setFilterSanitary] = useState('');

  // Modals & Selection States
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCompareIds, setSelectedCompareIds] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [toastMessage, setToastMessage] = useState(null);

  // Toast Helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch Projects from REST API
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await api.getProjects();
      setProjectsData(res.projects || []);
      setAccessLevel(res.accessLevel || 'sample');
      setIsApproved(res.isApproved || false);
    } catch (err) {
      console.error('Fetch Projects Error:', err);
      showToast(`API Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [currentUser]);

  // Auth Callbacks
  const handleAuthSuccess = (user, message) => {
    setCurrentUser(user);
    showToast(message);
    if (user.role === 'admin') {
      setActiveTab('admin');
    } else if (user.role === 'approved_user') {
      setActiveTab('projects');
    } else {
      setActiveTab('sample');
    }
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setActiveTab('sample');
    showToast('Logged out successfully.');
  };

  // Filter Projects by Search Query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return projectsData;
    const query = searchQuery.toLowerCase();
    return projectsData.filter(item => {
      const combined = [
        item.projectName,
        item.developerName,
        item.micromarket,
        item.segment,
        item.sanitaryBrands,
        item.architectDetails,
        item.mepConsultant,
        item.procurementInfo,
        item.procurementContact,
        item.siteManagerName,
        item.reraNo
      ].filter(Boolean).join(' ').toLowerCase();

      return combined.includes(query);
    });
  }, [projectsData, searchQuery]);

  // Compute Overall KPI Metrics
  const stats = useMemo(() => {
    const totalProjects = filteredData.length;
    const totalDevelopers = new Set(filteredData.map(d => d.developerName)).size;
    const totalSqft = filteredData.reduce((acc, d) => acc + (d.launchedSqft || 0), 0);
    const totalUnits = filteredData.reduce((acc, d) => acc + (d.launchedUnits || 0), 0);
    const totalAbsorbedUnits = filteredData.reduce((acc, d) => acc + (d.unitsAbsorbed || 0), 0);
    
    const avgPercentSold = totalUnits > 0 ? Math.round((totalAbsorbedUnits / totalUnits) * 100) : 0;

    // Base Price Range
    const bspValues = filteredData
      .flatMap(d => {
        const str = String(d.bspInrSqftRange || '');
        const nums = str.match(/\d+/g);
        return nums ? nums.map(Number).filter(n => n >= 1000) : [];
      });

    const minBSP = bspValues.length > 0 ? Math.min(...bspValues) : 3600;
    const maxBSP = bspValues.length > 0 ? Math.max(...bspValues) : 9500;

    const totalContacts = filteredData.filter(d => d.procurementContact && !d.procurementContact.includes('🔒')).length;

    return {
      totalProjects,
      totalDevelopers,
      totalSqft,
      totalUnits,
      totalAbsorbedUnits,
      avgPercentSold,
      minBSP,
      maxBSP,
      totalContacts
    };
  }, [filteredData]);

  // Compare Toggle
  const handleToggleCompare = (id) => {
    setSelectedCompareIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      if (prev.length >= 3) {
        showToast('You can compare a maximum of 3 projects simultaneously.');
        return prev;
      }
      return [...prev, id];
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 px-4 py-2.5 rounded-2xl bg-brand-600 text-white font-semibold text-xs shadow-glow animate-in fade-in slide-in-from-top-4 duration-200 flex items-center gap-2 max-w-md border border-brand-400">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentUser={currentUser}
        onOpenAuthModal={(mode = 'login') => {
          setAuthMode(mode);
          setIsAuthModalOpen(true);
        }}
        onOpenAdminSecretLogin={() => setActiveTab('adminSecret')}
        onLogout={handleLogout}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        totalProjects={filteredData.length}
        onExportReport={() => window.print()}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-32">
        
        {/* Render Secret Admin Login Page if activeTab is 'adminSecret' */}
        {activeTab === 'adminSecret' ? (
          <AdminLoginPage
            onAdminAuthSuccess={handleAuthSuccess}
            onBackToPublic={() => setActiveTab('sample')}
          />
        ) : (
          <>
            {/* KPI Metrics Banner */}
            <StatCards stats={stats} />

            {/* Tab 1: Public Sample Projects (10) */}
            {activeTab === 'sample' && (
              <PublicSampleView
                projects={filteredData}
                onSelectProject={(p) => setSelectedProject(p)}
                onRequestAccess={() => {
                  setAuthMode('register');
                  setIsAuthModalOpen(true);
                }}
                onLoginClick={() => {
                  setAuthMode('login');
                  setIsAuthModalOpen(true);
                }}
              />
            )}

            {/* Tab 2: Executive Overview */}
            {activeTab === 'overview' && (
              <ExecutiveOverview
                data={filteredData}
                onSelectProject={(p) => setSelectedProject(p)}
                setActiveTab={setActiveTab}
                setFilterMicromarket={setFilterMicromarket}
                setFilterSegment={setFilterSegment}
              />
            )}

            {/* Tab 3: Geographic Map */}
            {activeTab === 'map' && (
              <MapView
                projects={filteredData}
                onSelectProject={(p) => setSelectedProject(p)}
                onToggleCompare={handleToggleCompare}
                selectedCompareIds={selectedCompareIds}
              />
            )}

            {/* Tab 4: Full Project Catalog (Approved B2B Clients & Admin) */}
            {activeTab === 'projects' && (
              <ProjectCatalog
                projects={filteredData}
                onSelectProject={(p) => setSelectedProject(p)}
                onToggleCompare={handleToggleCompare}
                selectedCompareIds={selectedCompareIds}
                filterMicromarket={filterMicromarket}
                setFilterMicromarket={setFilterMicromarket}
                filterSegment={filterSegment}
                setFilterSegment={setFilterSegment}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                filterSanitary={filterSanitary}
                setFilterSanitary={setFilterSanitary}
              />
            )}

            {/* Tab 5: B2B Procurement Directory */}
            {activeTab === 'procurement' && (
              <ProcurementDirectory
                projects={filteredData}
                onSelectProject={(p) => setSelectedProject(p)}
                showToast={showToast}
              />
            )}

            {/* Tab 6: Market Analytics */}
            {activeTab === 'analytics' && (
              <AnalyticsCharts projects={filteredData} />
            )}

            {/* Tab 7: B2B Developer API Portal */}
            {activeTab === 'developer' && (
              <DeveloperPortal showToast={showToast} />
            )}

            {/* Tab 8: Admin Control Panel */}
            {activeTab === 'admin' && (
              <AdminPanel
                showToast={showToast}
                onDataUpdated={fetchProjects}
              />
            )}
          </>
        )}

      </main>

      {/* Auth Modal (Login / Register / Request Access) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authMode}
      />

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onToggleCompare={handleToggleCompare}
          isCompared={selectedCompareIds.includes(selectedProject.id)}
          showToast={showToast}
          onRequestAccess={() => {
            setSelectedProject(null);
            setAuthMode('register');
            setIsAuthModalOpen(true);
          }}
        />
      )}

      {/* Excel Upload Modal */}
      <ExcelUploaderModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onDataLoaded={(newRecords) => {
          setProjectsData(newRecords);
          setActiveTab('projects');
          showToast(`Loaded ${newRecords.length} custom records!`);
        }}
        onResetData={() => {
          fetchProjects();
          showToast('Reset data to default REST API database dataset');
        }}
      />

      {/* Side-by-Side Comparison Drawer */}
      <ComparisonDrawer
        projects={projectsData}
        selectedIds={selectedCompareIds}
        onRemoveFromCompare={(id) => setSelectedCompareIds(prev => prev.filter(i => i !== id))}
        onClearAll={() => setSelectedCompareIds([])}
        onSelectProject={(p) => setSelectedProject(p)}
      />

    </div>
  );
}
