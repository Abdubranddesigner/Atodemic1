import React, { useState } from 'react';
import { useAtodemicStore } from '../context/AppContext';
import { ShieldAlert, BookOpen, GraduationCap, ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface AuthScreenProps {
  onSuccess: () => void;
  onBackToLanding: () => void;
}

export default function AuthScreen({ onSuccess, onBackToLanding }: AuthScreenProps) {
  const store = useAtodemicStore();
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'forgot'>('login');
  
  // Form values
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // States
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false); // simulates verification email step

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (activeTab === 'login') {
      if (!username || !password) {
        setError('Please fill in all required fields.');
        return;
      }
      const response = store.login(username, password, rememberMe);
      if (response.success) {
        onSuccess();
      } else {
        setError(response.message);
      }
    } else if (activeTab === 'signup') {
      if (!fullName || !username || !email || !password) {
        setError('Please complete all fields to sign up.');
        return;
      }
      if (username.length < 3) {
        setError('Username must be at least 3 characters.');
        return;
      }
      if (!email.includes('@')) {
        setError('Please enter a valid academic email address.');
        return;
      }

      const response = store.signup(fullName, username, email, password);
      if (response.success) {
        setIsVerifying(true);
      } else {
        setError(response.message);
      }
    } else {
      // Forgot password response
      if (!email) {
        setError('Academic email is required.');
        return;
      }
      setSuccessMsg('Reset voucher has been dispatched to your academic inbox!');
    }
  };

  const handleConfirmVerification = () => {
    setIsVerifying(false);
    setActiveTab('login');
    setSuccessMsg('Email validated! You may now sign in.');
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex items-center justify-center p-6 relative font-sans">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25 pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        {/* Back Link */}
        <button 
          id="btn_back_to_landing"
          onClick={onBackToLanding}
          className="flex items-center gap-1.5 text-xs text-zinc-550 hover:text-zinc-300 transition-colors mb-8 cursor-pointer font-sans"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Atodemic Main
        </button>

        <div className="p-8 rounded-2xl border border-zinc-850 bg-zinc-900/10 backdrop-blur-xl">
          {/* Brand */}
          <div className="flex flex-col items-center text-center pb-8">
            <div className="h-9 w-9 bg-zinc-100 rounded-lg flex items-center justify-center shadow-[0_1px_4px_rgba(255,255,255,0.05)] mb-4">
              <GraduationCap className="h-5 w-5 text-zinc-950 stroke-[2.5]" />
            </div>
            <h2 className="text-base font-bold text-zinc-100 tracking-tight font-sans">Atodemic Student OS</h2>
            <p className="text-zinc-500 text-xs mt-1 leading-relaxed max-w-[240px]">
              {activeTab === 'login' && 'Unlock your personal diagnostic workroom'}
              {activeTab === 'signup' && 'Bootstrapper of actual learning consistency'}
              {activeTab === 'forgot' && 'Academic restoration console'}
            </p>
          </div>

          {/* Form Content */}
          {isVerifying ? (
            <div className="space-y-6 text-center">
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/55 text-zinc-300 text-xs font-mono leading-relaxed">
                A verification link was generated and simulated as dispatched to <span className="underline font-bold text-white">{email}</span>.
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed font-sans">
                In this development sandboxed local environment, academic email verification is automatically active. Click below to verify instantly.
              </p>
              <button
                id="btn_confirm_verify"
                onClick={handleConfirmVerification}
                className="w-full py-3 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-[#09090b] font-bold text-xs transition-colors cursor-pointer"
              >
                Simulate Verification Confirmation
              </button>
            </div>
          ) : (
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {/* Tabs */}
              {activeTab !== 'forgot' && (
                <div id="tabs_container" className="grid grid-cols-2 p-1 bg-[#09090b] rounded-lg mb-6 border border-zinc-850">
                  <button
                    type="button"
                    onClick={() => { setActiveTab('login'); setError(''); }}
                    className={`py-2 rounded-md text-xs font-bold transition-all cursor-pointer ${activeTab === 'login' ? 'bg-zinc-900 text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveTab('signup'); setError(''); }}
                    className={`py-2 rounded-md text-xs font-bold transition-all cursor-pointer ${activeTab === 'signup' ? 'bg-zinc-900 text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    Create Account
                  </button>
                </div>
              )}

              {/* Status Alert Panels */}
              {error && (
                <div id="auth_error" className="flex gap-2 p-3 text-xs rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 leading-relaxed">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div id="auth_success" className="p-3 text-xs rounded-lg border border-zinc-800 bg-zinc-950/20 text-zinc-300 leading-relaxed">
                  {successMsg}
                </div>
              )}

              {/* Dynamic Inputs */}
              {activeTab === 'signup' && (
                <div>
                  <label className="block text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 font-mono">Full Name</label>
                  <input
                    id="inp_fullname"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g., Jonathan Mercer"
                    className="w-full px-3 py-2.5 rounded-lg border border-zinc-805 border-zinc-805 border-zinc-800 bg-[#09090b]/60 text-zinc-100 text-xs placeholder:text-zinc-650 focus:outline-[#09090b] transition-colors"
                  />
                </div>
              )}

              {activeTab !== 'forgot' && (
                <div>
                  <label className="block text-zinc-400 text-[10px] font-bold uppercase tracking-[0.06em] mb-1.5 font-mono">Username or Email</label>
                  <input
                    id="inp_username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={activeTab === 'login' ? 'e.g., alex_jones or stud@uni.edu' : 'e.g., alex_jones'}
                    className="w-full px-3 py-2.5 rounded-lg border border-zinc-800 bg-[#09090b]/60 text-zinc-100 text-xs placeholder:text-zinc-650 focus:outline-[#09090b] transition-colors"
                  />
                </div>
              )}

              {activeTab === 'signup' && (
                <div>
                  <label className="block text-zinc-400 text-[10px] font-bold uppercase tracking-[0.06em] mb-1.5 font-mono">Academic Email Address</label>
                  <input
                    id="inp_email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g., alex@university.edu"
                    className="w-full px-3 py-2.5 rounded-lg border border-zinc-800 bg-[#09090b]/60 text-zinc-100 text-xs placeholder:text-zinc-650 focus:outline-[#09090b] transition-colors"
                  />
                </div>
              )}

              {activeTab === 'forgot' && (
                <div>
                  <label className="block text-zinc-400 text-[10px] font-bold uppercase tracking-[0.06em] mb-1.5 font-mono">Academic Email Address</label>
                  <input
                    id="inp_forgot_email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g., student@academy.edu"
                    className="w-full px-3 py-2.5 rounded-lg border border-zinc-800 bg-[#09090b]/60 text-zinc-100 text-xs placeholder:text-zinc-650 focus:outline-[#09090b] transition-colors"
                  />
                </div>
              )}

              {activeTab !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-zinc-400 text-[10px] font-bold uppercase tracking-[0.06em] font-mono">Password</label>
                    {activeTab === 'login' && (
                      <button
                        type="button"
                        onClick={() => setActiveTab('forgot')}
                        className="text-[10px] font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      >
                        Help?
                      </button>
                    )}
                  </div>
                  
                  <div className="relative">
                    <input
                      id="inp_password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-3 pr-10 py-2.5 rounded-lg border border-zinc-800 bg-[#09090b]/60 text-zinc-100 text-xs placeholder:text-zinc-650 focus:outline-[#09090b] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'login' && (
                <div className="flex items-center gap-2 pt-1 font-mono">
                  <input
                    id="inp_remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-3.5 w-3.5 accent-zinc-100 rounded border-zinc-800 bg-[#09090b] text-zinc-100 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-[11px] text-zinc-400 font-medium select-none">Remember Me</span>
                </div>
              )}

              {/* Action Trigger */}
              <button
                id="btn_submit_auth"
                type="submit"
                className="w-full mt-4 py-3 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-[#09090b] font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {activeTab === 'login' && 'Unlock Workspace'}
                {activeTab === 'signup' && 'Register Student Node'}
                {activeTab === 'forgot' && 'Dispatch recovery plan'}
                <ArrowRight className="h-4 w-4" />
              </button>

              {/* Forgot state cancellation */}
              {activeTab === 'forgot' && (
                <button
                  id="btn_cancel_forgot"
                  type="button"
                  onClick={() => { setActiveTab('login'); setError(''); setSuccessMsg(''); }}
                  className="w-full py-2.5 rounded-lg border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white font-medium text-xs transition-colors cursor-pointer"
                >
                  Return to Login
                </button>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
