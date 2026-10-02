import React, { useState } from 'react';
import { X, Lock, Mail, User, Building2, Phone, ArrowRight, AlertCircle, Sparkles, KeyRound, CheckCircle2, ShieldCheck } from 'lucide-react';
import { api } from '../services/api.js';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register' | 'otp'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('');

  // OTP State
  const [otpCode, setOtpCode] = useState('');
  const [otpPreview, setOtpPreview] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        const data = await api.login({ email, password });
        onAuthSuccess(data.user, 'Logged in successfully!');
        onClose();
      } else if (mode === 'register') {
        const data = await api.register({
          name,
          email,
          password,
          company,
          phone,
          reason
        });

        // Move to OTP Step
        setOtpPreview(data.otpPreview);
        setMode('otp');
      } else if (mode === 'otp') {
        const data = await api.verifyOtp(email, otpCode);
        onAuthSuccess(data.user, 'Email verified! Your B2B access request has been submitted for admin approval.');
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await api.resendOtp(email);
      setOtpPreview(res.otpPreview);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const fillClientDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel w-full max-w-md my-8 p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-glow relative animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center mx-auto mb-3 shadow-glow">
            {mode === 'otp' ? <CheckCircle2 className="w-6 h-6 text-white" /> : <Lock className="w-6 h-6 text-white" />}
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            {mode === 'login' 
              ? 'Sign In to B2B Client Portal' 
              : mode === 'otp' 
              ? 'Verify Your Email Address' 
              : 'Register Organization Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login' 
              ? 'Access real estate procurement intelligence & decision-maker contacts'
              : mode === 'otp'
              ? `Enter the 6-digit code sent to ${email}`
              : 'Authentic 2-Step Registration with Email Code Verification'
            }
          </p>
        </div>

        {/* Mode Switcher Tabs (Only shown in login/register) */}
        {mode !== 'otp' && (
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'login' ? 'bg-brand-600 text-white shadow-glow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Client Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'register' ? 'bg-brand-600 text-white shadow-glow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Register & Request Access
            </button>
          </div>
        )}

        {/* Client Demo Quick Buttons (Excludes Admin) */}
        {mode === 'login' && (
          <div className="mb-6 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" /> One-Click B2B Client Sign In
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillClientDemo('client@realestate.com', 'client123password')}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500 hover:text-white border border-emerald-500/30 text-[11px] font-bold transition-all truncate"
              >
                ✅ Approved B2B Client
              </button>
              <button
                type="button"
                onClick={() => fillClientDemo('user@investor.com', 'user123password')}
                className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 text-amber-300 hover:bg-amber-500 hover:text-white border border-amber-500/30 text-[11px] font-bold transition-all truncate"
              >
                ⏳ Registered User
              </button>
            </div>
          </div>
        )}

        {/* Demo OTP Preview Box */}
        {mode === 'otp' && otpPreview && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs text-center font-medium">
            <span className="block text-[10px] uppercase font-bold text-emerald-400">✨ Demo Email Verification OTP</span>
            <strong className="text-xl font-mono text-white tracking-widest block my-1">{otpPreview}</strong>
            <span className="text-[10px] text-slate-400">Copy or auto-fill this code below</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Siddharth Mehta"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Firm</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="e.g. Apex Infra"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="+91 98765..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {mode !== 'otp' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            </>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Procurement Requirement</label>
              <textarea
                rows={2}
                placeholder="Describe your material procurement purpose (e.g. Supplying sanitary fittings, MEP contracting, modular kitchens)..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              ></textarea>
            </div>
          )}

          {/* OTP Input Field */}
          {mode === 'otp' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Enter 6-Digit Code</label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="Enter 6-digit OTP code"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-center text-lg font-mono tracking-widest text-white focus:outline-none focus:border-brand-500"
              />
              <div className="mt-2 text-right">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-xs text-brand-400 hover:underline font-semibold"
                >
                  Resend Verification Code
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-500 transition-all shadow-glow flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
            ) : (
              <>
                <span>
                  {mode === 'login' 
                    ? 'Sign In to Client Portal' 
                    : mode === 'otp'
                    ? 'Verify & Submit Access Request'
                    : 'Send Verification Code →'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
}
