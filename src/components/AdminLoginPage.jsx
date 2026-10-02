import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, KeyRound, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { api } from '../services/api.js';

export default function AdminLoginPage({ onAdminAuthSuccess, onBackToPublic }) {
  const [email, setEmail] = useState('admin@estatepulse.b2b');
  const [password, setPassword] = useState('admin123password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await api.adminLogin({ email, password });
      onAdminAuthSuccess(data.user, 'Welcome back, Admin!');
    } catch (err) {
      setError(err.message || 'Invalid Admin Credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md p-8 rounded-3xl border border-purple-500/30 shadow-glow relative">
        
        {/* Top Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-300 flex items-center justify-center mx-auto mb-3 shadow-glow">
            <ShieldCheck className="w-8 h-8 text-purple-400" />
          </div>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 tracking-wider">
            Secret Direct Portal
          </span>
          <h2 className="text-2xl font-extrabold text-white tracking-tight mt-2">
            Admin Console Login
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Restricted access for system administrators & governance officers
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-xs font-bold bg-purple-600 text-white hover:bg-purple-500 transition-all shadow-glow flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
            ) : (
              <>
                <span>Authenticate Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <button
            onClick={onBackToPublic}
            className="text-xs text-slate-400 hover:text-white underline font-semibold"
          >
            ← Return to Public B2B Portal
          </button>
        </div>

      </div>
    </div>
  );
}
