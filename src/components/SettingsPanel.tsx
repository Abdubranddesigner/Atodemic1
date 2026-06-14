import React, { useState } from 'react';
import { useAtodemicStore } from '../context/AppContext';
import { LogOut, Monitor, Settings, ShieldCheck, Sun, Moon, User as UserIcon, Calendar, CheckSquare } from 'lucide-react';

export default function SettingsPanel() {
  const store = useAtodemicStore();
  const { currentUser, theme } = store;

  // Form states
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [username, setUsername] = useState(currentUser?.username || '');
  const [bio, setBio] = useState('');
  const [academicLevel, setAcademicLevel] = useState(currentUser?.academicLevel || '');
  const [school, setSchool] = useState(currentUser?.school || '');

  const [savingStatus, setSavingStatus] = useState('');
  const [errorSec, setErrorSec] = useState('');

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingStatus('');
    setErrorSec('');

    if (!fullName || !username) {
      setErrorSec('Academic Name and Identity Username are required.');
      return;
    }

    const res = store.updateProfile(fullName, username, bio, academicLevel, school);
    if (res.success) {
      setSavingStatus('Profile configurations secured!');
      setTimeout(() => setSavingStatus(''), 2000);
    } else {
      setErrorSec(res.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Settings Header banner */}
      <div className="bg-zinc-900/10 p-4 rounded-xl border border-zinc-805 border-zinc-800 flex justify-between items-center">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 font-mono">Administration Node</span>
          <h2 className="text-base font-bold text-zinc-150 text-zinc-100 mt-1 font-sans">Profile & Preferences Settings</h2>
        </div>
        <button
          id="btn_logout"
          onClick={store.logout}
          className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-150 font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer border border-zinc-700/60"
        >
          <LogOut className="h-4 w-4" /> Sign Out Workspace
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Theme customizers */}
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-90 w bg-zinc-900/30 space-y-5">
          <h3 className="font-bold text-sm text-zinc-100 font-sans">Interface Customization</h3>

          <div>
            <label className="block text-zinc-500 text-[9px] font-bold uppercase tracking-wider mb-2 font-mono">Operating Theme</label>
            <div id="theme_selection_container" className="grid grid-cols-3 gap-2">
              <button
                id="btn_theme_dark"
                type="button"
                onClick={() => store.setThemePreference('dark')}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors ${theme === 'dark' ? 'border-zinc-700 bg-zinc-100/[0.03] text-zinc-100 font-bold' : 'border-zinc-850 hover:bg-zinc-900 text-zinc-400'}`}
              >
                <Moon className="h-4 w-4" /> Dark
              </button>
              
              <button
                id="btn_theme_light"
                type="button"
                onClick={() => store.setThemePreference('light')}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors ${theme === 'light' ? 'border-zinc-700 bg-zinc-100/[0.03] text-zinc-100 font-bold' : 'border-zinc-850 hover:bg-zinc-900 text-zinc-400'}`}
              >
                <Sun className="h-4 w-4" /> Light
              </button>

              <button
                id="btn_theme_system"
                type="button"
                onClick={() => store.setThemePreference('system')}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors ${theme === 'system' ? 'border-zinc-700 bg-zinc-100/[0.03] text-zinc-100 font-bold' : 'border-zinc-850 hover:bg-zinc-900 text-zinc-400'}`}
              >
                <Monitor className="h-4 w-4" /> System
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800 space-y-2">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono block">Node Identification</span>
            <div className="text-[11px] font-mono text-zinc-400 space-y-1 bg-zinc-950/40 p-3 rounded-lg border border-zinc-850">
              <div>Joined: <span className="text-zinc-200 font-semibold">{currentUser?.joinDate}</span></div>
              <div className="truncate">Email Match: <span className="text-zinc-250 text-zinc-200 font-semibold">{currentUser?.email}</span></div>
              <div>Node ID Ref: <span className="text-zinc-300 font-bold">{currentUser?.id}</span></div>
            </div>
          </div>
        </div>

        {/* Center: Profile management form */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-zinc-800 bg-[#09090b]/40 bg-zinc-900/30">
          <h3 className="font-bold text-sm text-zinc-100 mb-4 font-sans">Academic Student Identity</h3>

          {savingStatus && (
            <div className="mb-4 p-3 rounded-lg border border-zinc-700/30 bg-zinc-100/[0.02] text-zinc-150 text-xs">
              {savingStatus}
            </div>
          )}

          {errorSec && (
            <div className="mb-4 p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-red-500 text-xs">
              {errorSec}
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-400 text-[9px] font-bold uppercase tracking-wider mb-1.5 font-mono">Academic Full Name</label>
                <input
                  id="settings_full_name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#09090b]/60 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder:text-zinc-650 focus:outline-none focus:border-zinc-700"
                />
              </div>

              <div>
                <label className="block text-zinc-400 text-[9px] font-bold uppercase tracking-wider mb-1.5 font-mono">System Username</label>
                <input
                  id="settings_username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-[#09090b]/60 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder:text-zinc-650 focus:outline-none focus:border-zinc-700"
                />
              </div>

              <div>
                <label className="block text-zinc-400 text-[9px] font-bold uppercase tracking-wider mb-1.5 font-mono">Academic Classification</label>
                <select
                  id="settings_academic_level"
                  value={academicLevel}
                  onChange={(e) => setAcademicLevel(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-[#09090b]/60 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
                >
                  <option value="">-- Choose Classification --</option>
                  <option value="High School">High School Candidate</option>
                  <option value="University">Undergraduate University</option>
                  <option value="Graduate">Graduate Doctor / Candidate</option>
                  <option value="Other">Other Certificate Track</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 text-[9px] font-bold uppercase tracking-wider mb-1.5 font-mono">School or Academy</label>
                <input
                  id="settings_school_name"
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="e.g. Stanford University, MIT"
                  className="w-full px-3 py-2 bg-[#09090b]/60 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder:text-zinc-650 focus:outline-none focus:border-zinc-700"
                />
              </div>
            </div>

            <button
              id="btn_submit_settings"
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-[#09090b] font-bold text-xs transition-all cursor-pointer block ml-auto"
            >
              Secure Configurations
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
