import React from 'react';
import { ShieldCheck, CalendarRange, Clock, Sparkles, BookOpen, GraduationCap, Award, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export default function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-zinc-100 selection:text-zinc-950 font-sans relative overflow-hidden">
      {/* Dynamic Grid Background Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-zinc-900/80">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 bg-zinc-100 rounded-lg flex items-center justify-center shadow-[0_1px_4px_rgba(255,255,255,0.05)]">
            <GraduationCap className="h-5 w-5 text-zinc-950 stroke-[2.5]" />
          </div>
          <span className="font-sans font-bold text-lg tracking-tight text-zinc-100">
            atodemic
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            id="btn_lh_login"
            onClick={onLogin}
            className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            Login
          </button>
          <button 
            id="btn_lh_get_started"
            onClick={onGetStarted}
            className="relative inline-flex h-9 items-center justify-center rounded-lg bg-zinc-100 px-4 text-xs font-semibold text-zinc-950 transition-all hover:bg-zinc-200 cursor-pointer"
          >
            Open OS
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="mx-auto max-w-max rounded-full border border-zinc-800 bg-zinc-950/60 px-4 py-1.5 text-[10px] tracking-widest text-zinc-400 font-mono uppercase flex items-center gap-1.5 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-zinc-400" />
          The Intelligent Student Operating System
        </div>

        <h1 className="mt-8 font-sans text-4xl md:text-5xl font-bold tracking-tight text-zinc-100 leading-[1.12]">
          Know exactly if you're <span className="text-zinc-300 font-extrabold underline decoration-zinc-700 decoration-2 underline-offset-4">ready</span> for your exam.
        </h1>

        <p className="mt-6 text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Atodemic analyzes your active study hours, chapter progress, and revision schedules in real time to answer the only question that matters: <strong className="font-semibold text-zinc-200">"Am I actually on track to finish before exam day?"</strong>
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            id="btn_hero_cta"
            onClick={onGetStarted}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-zinc-100 text-zinc-950 font-bold text-xs hover:bg-zinc-200 transition-all cursor-pointer shadow-[0_1px_4px_rgba(255,255,255,0.05)]"
          >
            Claim Your Free Workspace
          </button>
          <button 
            id="btn_hero_explore"
            onClick={onLogin}
            className="w-full sm:w-auto px-6 py-3 rounded-lg border border-zinc-800 bg-zinc-900/40 text-zinc-300 font-semibold text-xs hover:bg-zinc-900 hover:text-white transition-all cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-center font-sans text-2xl font-bold text-zinc-100 tracking-tight">
          Everything you need to master your syllabus
        </h2>
        <p className="text-center text-zinc-500 text-xs mt-2 max-w-md mx-auto">
          Built for modern high-achievers who value absolute precision and structured habits.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {/* Card 1 */}
          <div className="p-8 rounded-2xl border border-zinc-850 bg-zinc-900/10 backdrop-blur-sm hover:border-zinc-800 transition-colors">
            <div className="h-9 w-9 bg-zinc-900 rounded-lg flex items-center justify-center text-zinc-300 mb-6 border border-zinc-800">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-100 font-sans">Dynamic Readiness Score</h3>
            <p className="text-zinc-400 text-xs mt-3 leading-relaxed">
              Calculates a live 0-100 preparation index by weighing syllabus size, daily hour averages, and mock performance. No more guessing.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-2xl border border-zinc-855 border-zinc-850 bg-zinc-900/10 backdrop-blur-sm hover:border-zinc-800 transition-colors">
            <div className="h-9 w-9 bg-zinc-900 rounded-lg flex items-center justify-center text-zinc-300 mb-6 border border-zinc-800">
              <Clock className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-100 font-sans">Smart Study Timer</h3>
            <p className="text-zinc-400 text-xs mt-3 leading-relaxed">
              Track focused sessions straight into subjects. Triggers ambient distraction-free focus screen with custom goal counters.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-2xl border border-zinc-850 bg-zinc-900/10 backdrop-blur-sm hover:border-zinc-800 transition-colors">
            <div className="h-9 w-9 bg-zinc-900 rounded-lg flex items-center justify-center text-zinc-300 mb-6 border border-zinc-800">
              <CalendarRange className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-100 font-sans">Integrated Scheduler</h3>
            <p className="text-zinc-400 text-xs mt-3 leading-relaxed">
              Plan and schedule study blocks across integrated Day, Week, and Month calendars with instant attendance logs.
            </p>
          </div>
        </div>
      </section>

      {/* Spaced repetition indicator */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-12 border-t border-zinc-900">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="font-sans text-xl font-bold text-zinc-100 tracking-tight">
              Symmetrical Spaced Repetition Engine
            </h3>
            <p className="text-zinc-400 text-xs mt-4 leading-relaxed">
              When you tick off a chapter in any subject, Atodemic automatically queues critical recall reviews at <span className="text-zinc-100 font-bold decoration-zinc-650 decoration-1 underline">1 day, 3 days, 7 days, 14 days, and 30 days</span>. Build permanent neural retention without administrative planning overhead.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-zinc-300 text-[10px] font-mono uppercase tracking-wider">
                <CheckCircle2 className="h-4 w-4 text-zinc-450" /> Auto-integrated with Task Management
              </div>
              <div className="flex items-center gap-2 text-zinc-300 text-[10px] font-mono uppercase tracking-wider">
                <CheckCircle2 className="h-4 w-4 text-zinc-450" /> Direct risk and delay penalties
              </div>
            </div>
          </div>
          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 flex flex-col gap-4">
            <span className="text-zinc-500 text-[9px] uppercase tracking-widest font-mono">REVISION SCHEDULE SCHEME</span>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs p-3 rounded-lg border border-zinc-850 bg-[#09090b]">
                <span className="font-semibold text-zinc-100">Stage 1: Active Recall</span>
                <span className="text-zinc-400 font-bold font-mono">+1 Day</span>
              </div>
              <div className="flex justify-between items-center text-xs p-3 rounded-lg border border-zinc-850 bg-[#09090b]">
                <span className="font-semibold text-zinc-200">Stage 2: Short Retention</span>
                <span className="text-zinc-450 font-bold font-mono">+3 Days</span>
              </div>
              <div className="flex justify-between items-center text-xs p-3 rounded-lg border border-zinc-850 bg-[#09090b]">
                <span className="font-semibold text-zinc-300">Stage 3: Spaced Consolidating</span>
                <span className="text-zinc-500 font-bold font-mono">+7 Days</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gamification Indicator */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12 border-t border-zinc-900">
        <div className="p-8 md:p-12 rounded-3xl border border-zinc-850 bg-zinc-900/15 text-center">
          <div className="mx-auto max-w-max h-12 w-12 bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-200 border border-zinc-800">
            <Award className="h-6 w-6" />
          </div>
          <h3 className="font-sans text-xl font-bold text-zinc-100 mt-4">
            Gamified Growth, Sourced by Real Action Only
          </h3>
          <p className="text-zinc-400 text-xs mt-3 max-w-xl mx-auto leading-relaxed">
            Gain academic rank points (XP) only through dedicated study minutes inside focus timer or checklist clearance. Progress from <strong className="text-zinc-300">Beginner</strong> to <strong className="text-zinc-100 font-bold">Master Scholar</strong>.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-16 border-t border-zinc-900">
        <h2 className="text-center text-xl font-bold text-zinc-100 font-sans">Frequently Asked Questions</h2>
        <div className="mt-8 space-y-6">
          <div className="p-5 rounded-xl border border-zinc-850 bg-zinc-900/10">
            <h4 className="font-semibold text-zinc-150 text-zinc-100 text-sm font-sans">How does Atodemic calculate readiness?</h4>
            <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
              Our algorithm tracks your remaining estimated hours, Completed Chapters vs Total Chapters, completed tasks progress, and Spaced Repetition consistency. It outputs a precise coefficient (0-100) along with your real recommended daily work hours.
            </p>
          </div>
          <div className="p-5 rounded-xl border border-zinc-850 bg-zinc-900/10">
            <h4 className="font-semibold text-zinc-150 text-zinc-100 text-sm font-sans">Is there any auto-filled fake data?</h4>
            <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
              No. Atodemic is built strictly for high transparency. There are 0 study hours and 0 XP of filler data on signup. Every stat reflects your actual time allocation.
            </p>
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="relative z-10 h-28 border-t border-zinc-900/60 flex items-center justify-between px-8 max-w-7xl mx-auto mt-16 text-zinc-500 text-xs">
        <span>© 2026 Atodemic Study Corp. All rights reserved.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-zinc-300">Academic Integrity</a>
          <a href="#" className="hover:text-zinc-300">Security</a>
        </div>
      </footer>
    </div>
  );
}
