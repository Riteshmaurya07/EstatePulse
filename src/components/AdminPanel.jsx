import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  Clock, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  ShieldCheck, 
  SlidersHorizontal, 
  Search, 
  Sparkles,
  Phone,
  Mail,
  Building2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api.js';

export default function AdminPanel({ showToast, onDataUpdated }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [toggles, setToggles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'users' | 'toggles'

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [dash, uList, rList, tList] = await Promise.all([
        api.getAdminDashboard(),
        api.getAdminUsers(),
        api.getAdminRequests(),
        api.getSampleToggles()
      ]);

      setDashboardData(dash);
      setUsers(uList.users || []);
      setRequests(rList.requests || []);
      setToggles(tList.toggles || []);
    } catch (err) {
      console.error(err);
      if (showToast) showToast(`Admin Data Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Handle Approve / Reject Request
  const handleUpdateRequest = async (requestId, status) => {
    setActionLoading(requestId);
    try {
      const res = await api.updateAccessRequest(requestId, status);
      if (showToast) showToast(res.message);
      await loadAdminData();
      if (onDataUpdated) onDataUpdated();
    } catch (err) {
      if (showToast) showToast(`Error: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Handle User Role / Status Update
  const handleUpdateUserRole = async (userId, newRole) => {
    setActionLoading(userId);
    try {
      const res = await api.updateUserRoleStatus(userId, { role: newRole });
      if (showToast) showToast(`Updated user role to ${newRole}`);
      await loadAdminData();
      if (onDataUpdated) onDataUpdated();
    } catch (err) {
      if (showToast) showToast(`Error: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Handle Toggle Sample Contact Details Visibility
  const handleToggleContactDetails = async (projectId, currentStatus) => {
    setActionLoading(projectId);
    try {
      const newStatus = !currentStatus;
      const res = await api.toggleSampleContactDetails(projectId, newStatus);
      if (showToast) showToast(`Contact details for ${projectId} set to ${newStatus ? 'VISIBLE' : 'HIDDEN'}`);
      await loadAdminData();
      if (onDataUpdated) onDataUpdated();
    } catch (err) {
      if (showToast) showToast(`Error: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading && !dashboardData) {
    return (
      <div className="glass-panel p-12 rounded-3xl text-center">
        <div className="w-8 h-8 rounded-full border-3 border-purple-500 border-t-transparent animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-semibold text-slate-300">Loading Secure Admin Control Panel...</p>
      </div>
    );
  }

  const pendingRequests = requests.filter(r => r.status === 'pending');

  return (
    <div className="space-y-6">
      
      {/* Admin Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border-l-4 border-l-purple-500 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Admin Governance & Access Control Panel
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage user accounts, approve B2B access requests, and toggle contact visibility for public sample projects.
          </p>
        </div>

        <button
          onClick={loadAdminData}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Data
        </button>
      </div>

      {/* Admin KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Registered Users */}
        <div className="glass-panel p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Users</span>
            <Users className="w-5 h-5 text-brand-400" />
          </div>
          <span className="text-2xl font-extrabold text-white">{dashboardData?.totalUsers || 0}</span>
          <p className="text-[11px] text-slate-400 mt-1">Registered Platform Accounts</p>
        </div>

        {/* Card 2: Pending Access Requests */}
        <div className="glass-panel p-4 rounded-2xl border-brand-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Pending Requests</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-amber-400">{pendingRequests.length}</span>
          <p className="text-[11px] text-amber-400/80 mt-1 font-semibold">Awaiting Admin Approval</p>
        </div>

        {/* Card 3: Approved B2B Clients */}
        <div className="glass-panel p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Approved B2B Clients</span>
            <UserCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-2xl font-extrabold text-emerald-400">{dashboardData?.approvedUsers || 0}</span>
          <p className="text-[11px] text-slate-400 mt-1">Unlocked Unfiltered Access</p>
        </div>

        {/* Card 4: Sample Projects Contact Toggles */}
        <div className="glass-panel p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Sample Projects</span>
            <Eye className="w-5 h-5 text-purple-400" />
          </div>
          <span className="text-2xl font-extrabold text-purple-300">10 Projects</span>
          <p className="text-[11px] text-slate-400 mt-1">Public Sample Directory</p>
        </div>

      </div>

      {/* Admin Panel Sub-tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all relative ${
            activeTab === 'requests' ? 'bg-purple-600 text-white shadow-glow' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          Pending Access Requests Queue ({pendingRequests.length})
          {pendingRequests.length > 0 && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-ping"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'users' ? 'bg-purple-600 text-white shadow-glow' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          User Account Directory ({users.length})
        </button>

        <button
          onClick={() => setActiveTab('toggles')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'toggles' ? 'bg-purple-600 text-white shadow-glow' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          Sample Projects Contact Controls
        </button>
      </div>

      {/* SECTION 1: PENDING ACCESS REQUESTS QUEUE */}
      {activeTab === 'requests' && (
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" /> B2B Access Approval Queue
              </h3>
              <p className="text-xs text-slate-400">Review requests from registered users to unlock full project & procurement details</p>
            </div>
          </div>

          {requests.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/40 rounded-2xl text-slate-400 text-xs">
              No access requests recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/80 border-b border-slate-800 text-[11px] uppercase font-bold text-slate-400">
                    <th className="p-3">Applicant Name</th>
                    <th className="p-3">Organization & Phone</th>
                    <th className="p-3">Reason / Scope</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {requests.map(req => (
                    <tr key={req.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-white">{req.userName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{req.userEmail}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-200">{req.company}</div>
                        <div className="text-[11px] font-mono text-emerald-400">{req.phone}</div>
                      </td>
                      <td className="p-3 text-slate-300 max-w-xs truncate">
                        {req.reason}
                      </td>
                      <td className="p-3 text-slate-400 font-mono text-[11px]">
                        {new Date(req.requestedAt).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          req.status === 'approved' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : req.status === 'rejected'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {req.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleUpdateRequest(req.id, 'approved')}
                              disabled={actionLoading === req.id}
                              className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 transition-all flex items-center gap-1 shadow-glow"
                            >
                              <Check className="w-3.5 h-3.5" /> Approve
                            </button>
                            <button
                              onClick={() => handleUpdateRequest(req.id, 'rejected')}
                              disabled={actionLoading === req.id}
                              className="px-3 py-1 rounded-lg text-xs font-bold bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600 hover:text-white transition-all"
                            >
                              <X className="w-3.5 h-3.5" /> Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500 italic">Resolved</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: USER DIRECTORY & ROLE MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" /> User Directory & Role Assignment
              </h3>
              <p className="text-xs text-slate-400">Change permissions (`admin`, `approved_user`, `registered_user`)</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-800 text-[11px] uppercase font-bold text-slate-400">
                  <th className="p-3">User ID</th>
                  <th className="p-3">Name & Email</th>
                  <th className="p-3">Company</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Role Modifier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-3 font-mono text-slate-400 text-[11px]">{u.id}</td>
                    <td className="p-3">
                      <div className="font-bold text-white">{u.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                    </td>
                    <td className="p-3 text-slate-300 font-medium">{u.company}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        u.role === 'admin' 
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : u.role === 'approved_user'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300 font-semibold">{u.status}</td>
                    <td className="p-3 text-right">
                      <select
                        value={u.role}
                        onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                        disabled={u.email === 'admin@estatepulse.b2b'}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                      >
                        <option value="admin">Admin</option>
                        <option value="approved_user">Approved B2B Client</option>
                        <option value="registered_user">Registered User (Pending)</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: SAMPLE PROJECTS CONTACT VISIBILITY TOGGLES */}
      {activeTab === 'toggles' && (
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-cyan-400" /> Sample Projects Contact Visibility Controls
              </h3>
              <p className="text-xs text-slate-400">
                Enable or disable direct contact numbers & emails for individual sample projects so prospective clients can verify data richness before signing up.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {toggles.map(t => (
              <div 
                key={t.projectId}
                className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20 font-mono">
                      {t.projectId}
                    </span>
                    <span className="text-xs font-bold text-white truncate max-w-[200px]">{t.projectName}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{t.developerName}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    t.showContactDetails ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {t.showContactDetails ? 'Contact Visible' : 'Contact Hidden'}
                  </span>

                  <button
                    onClick={() => handleToggleContactDetails(t.projectId, t.showContactDetails)}
                    disabled={actionLoading === t.projectId}
                    className={`p-2 rounded-xl transition-all border ${
                      t.showContactDetails 
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-glow' 
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                    title={t.showContactDetails ? 'Click to hide contacts' : 'Click to expose contacts'}
                  >
                    {t.showContactDetails ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
