import React, { useState } from 'react';
import { AtodemicProvider, useAtodemicStore } from './context/AppContext';
import LandingPage from './components/LandingPage';
import AuthScreen from './components/AuthScreen';
import OnboardingScreen from './components/OnboardingScreen';
import Dashboard from './components/Dashboard';
import SubjectManager from './components/SubjectManager';
import SmartTimer from './components/SmartTimer';
import CalendarSystem from './components/CalendarSystem';
import ResourceVault from './components/ResourceVault';
import SpacedRepetition from './components/SpacedRepetition';
import AnalyticsView from './components/AnalyticsView';
import SettingsPanel from './components/SettingsPanel';

import { 
  GraduationCap, 
  LayoutDashboard, 
  BookOpen, 
  Clock, 
  Calendar, 
  Inbox, 
  History, 
  Settings, 
  LogOut,
  Layers,
  Award,
  Flame,
  Menu,
  X
} from 'lucide-react';

function AppContent() {
  const store = useAtodemicStore();
  const { currentUser, theme } = store;

  // Visual navigation routing controllers
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'auth' | 'app'>('landing');
  const [activeAppView, setActiveAppView] = useState<'dashboard' | 'subjects' | 'timer' | 'calendar' | 'vault' | 'spaced' | 'analytics' | 'settings'>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Success handling
  const handleAuthComplete = () => {
    setCurrentScreen('app');
  };

  const handleStartOnboarding = () => {
    setCurrentScreen('auth');
  };

  // Logic path rendering
  if (currentScreen === 'landing' && !currentUser) {
    return <LandingPage onGetStarted={handleStartOnboarding} onLogin={() => { setCurrentScreen('auth'); }} />;
  }

  if (currentScreen === 'auth' && !currentUser) {
    return <AuthScreen onSuccess={handleAuthComplete} onBackToLanding={() => setCurrentScreen('landing')} />;
  }

  // If session is active check if Onboarding parameters are met
  if (currentUser && !currentUser.examDate) {
    return <OnboardingScreen onComplete={() => setCurrentScreen('app')} />;
  }

  // Primary OS workspace rendering
  const renderActiveView = () => {
    switch (activeAppView) {
      case 'dashboard': return <Dashboard onSetActiveView={(v) => setActiveAppView(v as any)} />;
      case 'subjects': return <SubjectManager />;
      case 'timer': return <SmartTimer />;
      case 'calendar': return <CalendarSystem />;
      case 'vault': return <ResourceVault />;
      case 'spaced': return <SpacedRepetition />;
      case 'analytics': return <AnalyticsView />;
      case 'settings': return <SettingsPanel />;
      default: return <Dashboard onSetActiveView={(v) => setActiveAppView(v as any)} />;
    }
  };

  const menuItems = [
    { key: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
    { key: 'subjects', label: 'Subjects Manager', icon: BookOpen },
    { key: 'timer', label: 'Focus Workroom', icon: Clock },
    { key: 'calendar', label: 'Calendar Grid', icon: Calendar },
    { key: 'vault', label: 'Resource Vault', icon: Inbox },
    { key: 'spaced', label: 'Spaced Repetition', icon: Layers },
    { key: 'analytics', label: 'Analytics Reports', icon: History },
    { key: 'settings', label: 'Preferences', icon: Settings },
  ] as const;

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans flex flex-col md:flex-row select-none">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-35 pointer-events-none" />

      {/* Mobile Top Navigation rail bar */}
      <header className="md:hidden flex h-16 items-center justify-between px-6 border-b border-zinc-800 bg-[#09090b] z-20 sticky top-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-zinc-950 rounded-sm flex items-center justify-center">
              <GraduationCap className="h-3 w-3 text-zinc-100" />
            </div>
          </div>
          <span className="font-sans font-bold text-base tracking-tight italic text-zinc-50 font-medium">Atodemic</span>
        </div>

        <button 
          id="btn_hamburger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 text-zinc-400 hover:text-white"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`w-64 border-r border-zinc-800 bg-[#09090b] flex-col justify-between shrink-0 fixed inset-y-0 left-0 z-30 transform md:translate-x-0 transition-transform duration-300 pointer-events-auto md:sticky md:h-screen flex ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Upper part logo */}
        <div className="flex flex-col p-6">
          <div className="hidden md:flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center shrink-0">
              <div className="w-4 h-4 bg-zinc-950 rounded-sm flex items-center justify-center">
                <GraduationCap className="h-3 w-3 text-zinc-100" />
              </div>
            </div>
            <span className="font-bold text-xl tracking-tight italic text-zinc-50 font-sans">Atodemic</span>
          </div>

          <nav id="sidebar_nav" className="space-y-1">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = activeAppView === item.key;
              return (
                <button
                  id={`btn_nav_${item.key}`}
                  key={item.key}
                  onClick={() => {
                    setActiveAppView(item.key);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-xs rounded-md font-medium select-none cursor-pointer transition-colors ${
                    isActive 
                      ? 'bg-zinc-800 text-white font-semibold' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                  }`}
                >
                  <Icon className="h-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Lower session profile parameters */}
        <div className="p-6 border-t border-zinc-800 bg-[#09090b]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-semibold text-zinc-400 shrink-0 font-mono">
              {currentUser?.username.substring(0, 2).toUpperCase() || 'US'}
            </div>
            <div className="text-left font-sans truncate flex-1 leading-normal">
              <span className="text-sm font-medium text-zinc-200 block truncate leading-none">{currentUser?.fullName}</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mt-1">@{currentUser?.username}</span>
            </div>
            <button
              id="sidebar_btn_logout"
              onClick={store.logout}
              className="p-1.5 text-zinc-600 hover:text-zinc-300 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

      </aside>

      {/* Mobile background menu close click absorber overlay */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-10 md:hidden pointer-events-auto"
        />
      )}

      {/* Main Operating Area Viewport */}
      <main className="flex-1 w-full p-6 md:p-8 max-w-7xl mx-auto overflow-y-auto relative z-10">
        
        {/* Dynamic header row metadata info */}
        <div className="flex items-center justify-between pb-6 border-b border-zinc-800/60 mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-50 capitalize leading-none font-sans">
            {activeAppView} Panel
          </h1>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 font-medium">
            <span>Terminal Live</span>
            <span className="h-2 w-2 rounded-full bg-zinc-400 animate-pulse" />
          </div>
        </div>

        {renderActiveView()}
      </main>

    </div>
  );
}

export default function App() {
  return (
    <AtodemicProvider>
      <AppContent />
    </AtodemicProvider>
  );
}
